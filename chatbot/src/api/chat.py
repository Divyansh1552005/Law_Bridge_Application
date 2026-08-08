import json
import os
import re
import sys
import traceback
from pathlib import Path

import requests
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from langchain_core.prompts import PromptTemplate
from langchain_tavily import TavilySearch
from pydantic import BaseModel

src_path = Path(__file__).parent.parent
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from config.env import APP_SECRET_KEY, TAVILY_API_KEY
from config.genai_initialize import get_llm
from document_pipeline.pipeline import process_uploaded_document
from vectorStore_Retrieval.store_embedding import get_retriever
from prompt_Templates.chat_prompts import INTENT_PROMPT, PROMPT


os.environ["TAVILY_API_KEY"] = TAVILY_API_KEY

tavily_tool = TavilySearch(
    max_results=5,
    search_depth="advanced",
    topic="general",
    include_domains=[
        "indiankanoon.org",
        "sci.gov.in",
        "main.sci.gov.in",
        "livelaw.in",
        "barandbench.com",
        "lawstreetindia.com",
        "verdictum.in",
        "indiacode.nic.in",
        "legislative.gov.in",
        "mha.gov.in",
        "pib.gov.in",
        "thehindu.com",
        "hindustantimes.com",
        "ndtv.com",
        "theprint.in",
        "scroll.in",
    ],
)

app = FastAPI(title="LawBridge Legal Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    sessionId: str
    history: list[Message]
    message: str
    user_id: str | None = None
    mode: str = "both"  # "knowledge-base" | "user-uploads" | "both"


class Source(BaseModel):
    title: str
    url: str


class ChatResponse(BaseModel):
    response: str
    sources: list[Source] = []


class UploadResponse(BaseModel):
    status: str
    filename: str
    file_type: str
    chunks_stored: int
    namespace: str


class DeleteUserDataRequest(BaseModel):
    user_id: str


class UploadDocumentRequest(BaseModel):
    user_id: str
    filename: str
    signed_url: str
    public_id: str


# LLM aur retriever initialize karo
llm = get_llm()
retriever = get_retriever()


# Intent classification



def classify_intent(message: str, chat_history: str, llm) -> dict:
    """web search aur user docs ki zaroorat hai ya nahi — LLM se decide karo"""
    try:
        prompt = INTENT_PROMPT.format(
            chat_history=chat_history or "No prior history.",
            message=message,
        )
        result = llm.invoke(prompt)
        text = result.content if hasattr(result, "content") else str(result)

        # LLM kabhi kabhi extra text deta hai, sirf JSON nikalo
        match = re.search(r"\{[^}]+\}", text)
        if match:
            return json.loads(match.group())

    except Exception as e:
        print(f"[INTENT CLASSIFICATION FAILED] {e}", flush=True)

    # fallback — safe default
    return {"needs_web_search": False, "needs_user_docs": False}

# If user asks in their language we cannot directly convert their stuff to embeddings so pehle translate krna pdega for tavily
def translate_query_for_search(message: str, llm) -> str:
    """user ki query ko English mein translate karo — Tavily search ke liye"""
    try:
        result = llm.invoke(
            f"Translate the following query to English for a legal search engine. "
            f"Output ONLY the translated query, nothing else.\n\nQuery: {message}"
        )
        text = result.content if hasattr(result, "content") else str(result)
        return text.strip()
    except Exception as e:
        print(f"[TRANSLATION FAILED] {e}", flush=True)
        return message  # fallback — original query hi use karo

# Routes

# LawBridge chatbot API
# - intent classification: har query pe LLM decide karta hai web search aur user docs ki zaroorat
# - RAG pipeline: KB context hamesha, user docs sirf jab intent kare ya mode force kare
# - multilingual Tavily search: user ki query pehle English mein translate hoti hai search ke liye
# - response user ki original language mein aata hai

@app.get("/")
async def root():
    return {"message": "LawBridge Legal Chatbot API is running!"}


@app.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest, secure_key: str = Header(None, alias="secure_key")
):
    if secure_key != APP_SECRET_KEY:
        raise HTTPException(
            status_code=401, detail="Unauthorized: Invalid or missing key"
        )
    try:
        # last 10 messages lo — token limit ke liye
        chat_history_formatted = ""
        if request.history and len(request.history) > 0:
            recent_messages = (
                request.history[-10:] if len(request.history) > 10 else request.history
            )
            for msg in recent_messages:
                role = "User" if msg.role == "user" else "Assistant"
                chat_history_formatted += f"{role}: {msg.content}\n"
            chat_history_formatted += "---\n"
        else:
            chat_history_formatted = "This is the start of our conversation.\n---\n"

        print("[CHAT] History formatted.", flush=True)

        # intent classify karo — web search aur user docs dono decide honge yahan se
        print("[CHAT] Classifying intent...", flush=True)
        intent = classify_intent(request.message, chat_history_formatted, llm)
        print(f"[CHAT] Intent result: {intent}", flush=True)

        kb_context = ""
        doc_context = ""

        if request.mode in ("knowledge-base", "both"):
            print("[CHAT] Fetching KB context...", flush=True)
            kb_docs = retriever.invoke(request.message)
            print(f"[CHAT] KB docs fetched: {len(kb_docs)}", flush=True)
            kb_context = "\n\n".join([doc.page_content for doc in kb_docs])

        # user docs sirf tab fetch karo jab intent kare ya mode explicitly "user-uploads" ho
        force_user_docs = request.mode == "user-uploads"
        should_fetch_user_docs = (
            (force_user_docs or intent.get("needs_user_docs", False))
            and request.mode in ("user-uploads", "both")
            and request.user_id
        )

        if should_fetch_user_docs:
            print("[CHAT] Fetching user doc context (intent-triggered)...", flush=True)
            from config.pinecone_initialize import get_user_namespace
            from vectorStore_Retrieval.store_embedding import (
                get_retriever as get_ns_retriever,
            )

            user_retriever = get_ns_retriever(
                namespace=get_user_namespace(request.user_id)
            )
            user_docs = user_retriever.invoke(request.message)
            print(f"[CHAT] User docs fetched: {len(user_docs)}", flush=True)
            doc_context = "\n\n".join([doc.page_content for doc in user_docs])
        else:
            print("[CHAT] Skipping user doc fetch (not needed per intent).", flush=True)

        if not kb_context:
            kb_context = "No relevant information found in the legal knowledge base."

        # web search sirf tab jab intent ne kaha ho
        print("[CHAT] Checking web search intent...", flush=True)
        web_context = ""
        sources = []
        if intent.get("needs_web_search", False):
            try:
                search_query = translate_query_for_search(request.message, llm)
                print(f"[CHAT] Tavily search query: {search_query}", flush=True)
                web_results = tavily_tool.invoke({"query": search_query})

                if isinstance(web_results, list):
                    sources = [
                        Source(title=r.get("title", "Source"), url=r.get("url", ""))
                        for r in web_results
                        if r.get("url")
                    ]
                    web_context = "\n\n".join(
                        [r.get("content", "") for r in web_results if "content" in r]
                    )
                elif isinstance(web_results, dict) and "results" in web_results:
                    sources = [
                        Source(title=r.get("title", "Source"), url=r["url"])
                        for r in web_results["results"]
                        if "url" in r
                    ]
                    web_context = "\n\n".join(
                        [r["content"] for r in web_results["results"] if "content" in r]
                    )
            except Exception as e:
                print(f"[WEB SEARCH FAILED] {e}", flush=True)
                web_context = ""
        else:
            print("[CHAT] Skipping web search (not needed per intent).", flush=True)

        if not doc_context:
            doc_context = (
                "No document uploaded by the user."
                if request.mode == "both"
                else "Not applicable."
            )

        formatted_prompt = PROMPT.format(
            chat_history=chat_history_formatted,
            kb_context=kb_context,
            doc_context=doc_context,
            web_context=web_context
            if web_context
            else "No recent web results available.",
            question=request.message,
        )

        print("[CHAT] Calling LLM...", flush=True)
        response = llm.invoke(formatted_prompt)
        print("[CHAT] LLM called successfully.", flush=True)

        if hasattr(response, "content"):
            response_text = response.content
        elif isinstance(response, dict):
            response_text = response.get("text", str(response))
        else:
            response_text = str(response)

        return ChatResponse(response=response_text, sources=sources)

    except Exception as e:
        print(f"[CHAT ERROR]\n{traceback.format_exc()}", flush=True)
        raise HTTPException(
            status_code=500, detail=f"Error processing question: {str(e)}"
        )


@app.post("/upload-document", response_model=UploadResponse)
async def upload_document(
    body: UploadDocumentRequest,
    secure_key: str = Header(None, alias="secure_key"),
):
    # JS backend se already Cloudinary pe (private/authenticated) upload hui file aati hai
    # sirf RAG pipeline chalti hai: fetch via signed_url -> extract -> chunk -> pinecone store
    if secure_key != APP_SECRET_KEY:
        raise HTTPException(
            status_code=401, detail="Unauthorized: Invalid or missing key"
        )

    try:
        response = requests.get(body.signed_url, timeout=30)
        response.raise_for_status()

        result = process_uploaded_document(
            file_bytes=response.content,
            filename=body.filename,
            user_id=body.user_id,
            cloudinary_public_id=body.public_id,
        )

        return UploadResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    except Exception as e:
        print(f"[UPLOAD ERROR]\n{traceback.format_exc()}", flush=True)
        raise HTTPException(
            status_code=500, detail=f"Document processing mein error: {str(e)}"
        )


@app.delete("/delete-user-data")
async def delete_user_data(
    request: DeleteUserDataRequest,
    secure_key: str = Header(None, alias="secure_key"),
):
    if secure_key != APP_SECRET_KEY:
        raise HTTPException(
            status_code=401, detail="Unauthorized: Invalid or missing key"
        )

    try:
        from config.pinecone_initialize import get_pinecone_index, get_user_namespace

        index = get_pinecone_index()
        namespace = get_user_namespace(request.user_id)
        index.delete(delete_all=True, namespace=namespace)

        return {"success": True, "deleted_namespace": namespace}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Pinecone cleanup failed: {str(e)}"
        )


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "LawBridge Legal Chatbot"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=4000)

import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# Ensure we can import from src directory
src_path = Path(__file__).parent.parent
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from config.genai_initialize import get_llm
from vectorStore_Retrieval.store_embedding import get_retriever

app = FastAPI(title="LawBridge Legal Chatbot API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    userMessage: str
    chatHistory: list[Message]

class ChatResponse(BaseModel):
    answer: str

# Initialize LLM and retriever
llm = get_llm()
retriever = get_retriever()

# Custom prompt for legal queries
legal_prompt_template = """
You are a helpful and responsible legal assistant specializing in Indian law.

You must follow this rule:
1. FIRST, check if the answer is present in the given context.
2. If the context contains relevant information → answer STRICTLY using the context.
3. If the context does NOT contain the answer → 
   provide a general, safe, high-level legal guidance based on common legal principles in India.
   DO NOT say "I don't have enough information" unless the topic is outside law or unsafe.
4. NEVER provide illegal advice. NEVER tell the user to hide evidence or evade police.
5. If the question involves criminal matters (like false cases), 
   you may give general steps such as: consult a lawyer, file a counter-complaint, 
   collect evidence, approach court for anticipatory bail, etc.
6. If the question is not related to Indian law, politely inform the user that you specialize in Indian law only.
7. If the question is not related to law, politely inform the user that you can only assist with legal queries.

Context:
{context}

Question:
{question}

Answer:
Provide a clear, safe, helpful, and actionable explanation. 
If the context is useful, cite its ideas indirectly.
If not, answer using general legal knowledge.
"""


PROMPT = PromptTemplate(
    template=legal_prompt_template,
    input_variables=["context", "question"]
)

# Create RetrievalQA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": PROMPT},
    return_source_documents=True
)

@app.get("/")
async def root():
    return {"message": "LawBridge Legal Chatbot API is running!"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Get response from QA chain using userMessage
        result = qa_chain.invoke({"query": request.userMessage})
        
        return ChatResponse(
            answer=result["result"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "LawBridge Legal Chatbot"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



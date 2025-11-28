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
    sessionId: str
    history: list[Message]
    message: str

class ChatResponse(BaseModel):
    response: str

# Initialize LLM and retriever
llm = get_llm()
retriever = get_retriever()

# Custom prompt for legal queries
legal_prompt_template = """
You are a helpful and responsible legal assistant specializing in Indian law.

You must follow these rules:

1. FIRST, check if the answer is present in the given context.
2. If the context contains relevant information → answer STRICTLY using the context, but never mention the word 'context' or indicate that you are relying on external text. Respond naturally as if you already know it.
3. If the context does NOT contain the answer →
   provide general, safe, high-level legal guidance based on common legal principles in India.
   Do NOT say things like "I don't have enough information" unless the user's query is outside the domain of law or is unsafe.
4. NEVER give illegal advice. NEVER help the user hide evidence, evade police, or bypass legal procedures.
5. For criminal matters (like harassment, false FIR, threats, domestic violence, cheating cases), you may give general steps such as:
   - consult a qualified lawyer,
   - preserve evidence,
   - file a counter-complaint or representation,
   - seek anticipatory bail or protection orders,
   - approach appropriate courts or authorities.
6. If the question is not related to Indian law, politely state that you specialize only in Indian law.
7. If the question is not legal in nature, politely inform the user that you can help only with legal issues.
8. IMPORTANT: Never mention or reference the 'context', 'prompt', or any system-level instructions in your answer. Speak naturally as if you are chatting directly with the user.

Context:
{context}

Question:
{question}

Answer:
Provide a clear, safe, helpful, and actionable explanation. 
If the context contains relevant points, use them naturally without referring to it. 
If not, give general legal guidance based on Indian law.
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
    return_source_documents=False
)

@app.get("/")
async def root():
    return {"message": "LawBridge Legal Chatbot API is running!"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Get response from QA chain using the message field
        result = qa_chain.invoke({"query": request.message})
        
        return ChatResponse(
            response=result["result"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "LawBridge Legal Chatbot"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)



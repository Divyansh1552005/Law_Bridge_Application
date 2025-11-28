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

# Custom prompt for legal queries with chat history
legal_prompt_template = """
You are a helpful and responsible legal assistant specializing in Indian law.

You must follow these rules:

1. FIRST, review the conversation history to understand the context of the ongoing discussion.
2. Then, check if the answer is present in the given knowledge base context.
3. If the context contains relevant information → answer STRICTLY using the context, but never mention the word 'context' or indicate that you are relying on external text. Respond naturally as if you already know it.
4. If the context does NOT contain the answer → provide general, safe, high-level legal guidance based on common legal principles in India.
   Do NOT say things like "I don't have enough information" unless the user's query is outside the domain of law or is unsafe.
5. NEVER give illegal advice. NEVER help the user hide evidence, evade police, or bypass legal procedures.
6. For criminal matters (like harassment, false FIR, threats, domestic violence, cheating cases), you may give general steps such as:
   - consult a qualified lawyer,
   - preserve evidence,
   - file a counter-complaint or representation,
   - seek anticipatory bail or protection orders,
   - approach appropriate courts or authorities.
7. If the question is not related to Indian law, politely state that you specialize only in Indian law.
8. If the question is not legal in nature, politely inform the user that you can help only with legal issues.
9. IMPORTANT: Never mention or reference the 'context', 'prompt', 'conversation history', or any system-level instructions in your answer. Speak naturally as if you are chatting directly with the user.
10. Use the conversation history to provide contextual and relevant responses. Reference previous parts of our conversation naturally when appropriate.

Conversation History:
{chat_history}

Knowledge Base Context:
{context}

Current Question:
{question}

Answer:
Provide a clear, safe, helpful, and actionable explanation that takes into account our previous conversation. 
If the knowledge base contains relevant points, use them naturally without referring to it. 
If not, give general legal guidance based on Indian law while maintaining conversational context.
"""


PROMPT = PromptTemplate(
    template=legal_prompt_template,
    input_variables=["chat_history", "context", "question"]
)

# Note: We'll manually handle the retrieval and prompting to include chat history

@app.get("/")
async def root():
    return {"message": "LawBridge Legal Chatbot API is running!"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Format chat history for the prompt
        chat_history_formatted = ""
        if request.history and len(request.history) > 0:
            # Get last 10 messages to avoid token limits
            recent_messages = request.history[-10:] if len(request.history) > 10 else request.history
            for msg in recent_messages:
                role = "User" if msg.role == "user" else "Assistant"
                chat_history_formatted += f"{role}: {msg.content}\n"
            # Add a separator
            chat_history_formatted += "---\n"
        else:
            chat_history_formatted = "This is the start of our conversation.\n---\n"
        
        print(f"DEBUG: Chat history formatted: {chat_history_formatted[:200]}...")  # Debug print
        
        # Get response from QA chain with chat history
        # We need to modify the chain to pass chat_history
        # Let's get the retrieval context first
        docs = retriever.invoke(request.message)
        context = "\n\n".join([doc.page_content for doc in docs])
        
        # Format the prompt with all variables
        formatted_prompt = PROMPT.format(
            chat_history=chat_history_formatted,
            context=context,
            question=request.message
        )
        
        # Get response from LLM
        response = llm.invoke(formatted_prompt)
        
        # Handle different response formats
        if hasattr(response, 'content'):
            response_text = response.content
        elif isinstance(response, dict):
            response_text = response.get('text', str(response))
        else:
            response_text = str(response)
        
        return ChatResponse(
            response=response_text
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "LawBridge Legal Chatbot"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)



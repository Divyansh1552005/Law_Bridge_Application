import sys
from pathlib import Path
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Ensure we can import from src directory
src_path = Path(__file__).parent.parent
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from config.env import GOOGLE_API_KEY


load_dotenv()


def get_llm():    
    return ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
    GOOGLE_API_KEY= GOOGLE_API_KEY,  # by default it reads from environment variable
)

def get_embedding_model():
    return GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        GOOGLE_API_KEY= GOOGLE_API_KEY,  # by default it reads from environment variable
    )


import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX")
APP_SECRET_KEY = os.getenv("APP_SECRET_KEY")

APP_NAME = os.getenv("APP_NAME", "RAG FastAPI Server")

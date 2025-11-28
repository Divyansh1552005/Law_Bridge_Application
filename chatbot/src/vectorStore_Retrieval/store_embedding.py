import sys
from pathlib import Path
from langchain_pinecone import PineconeVectorStore

# Ensure we can import from src directory
src_path = Path(__file__).parent.parent
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from config.genai_initialize import get_embedding_model
from config.env import PINECONE_INDEX
from config.pinecone_initialize import get_pinecone_index

embedding_model = get_embedding_model()

# Initialize vector store with correct parameters
vector_store = PineconeVectorStore(
    index=get_pinecone_index(),
    embedding=embedding_model,
)

def store_embeddings(documents):
    vector_store.add_documents(documents)

# retrieval function
retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 3})

def get_retriever():
    return retriever


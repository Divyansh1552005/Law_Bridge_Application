import sys
from pathlib import Path

# Ensure we can import from src directory
src_path = Path(__file__).parent.parent
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from config.genai_initialize import get_embedding_model
from loaders.loader import load_pdf
from processors.text_chunker import chunk_text
from vectorStore_Retrieval.store_embedding import store_embeddings

def create_and_store_embeddings():
    """
    Complete pipeline to load PDF, chunk text, and store embeddings
    Only creates embeddings if they don't already exist
    """
    # Commented out embedding check - using existing Pinecone index directly
    # from vectorStore_Retrieval.store_embedding import check_embeddings_exist
    
    # Check if embeddings already exist
    # if check_embeddings_exist():
    #     print("Embeddings already exist in Pinecone index. Skipping creation.")
    #     return []
    
    print("Loading PDF documents...")
    documents = load_pdf()
    print(f"Loaded {len(documents)} documents")
    
    print("Chunking documents...")
    chunked_docs = chunk_text(documents, chunk_size=1000, overlap=200)
    print(f"Created {len(chunked_docs)} chunks")
    
    print("Creating and storing embeddings...")
    store_embeddings(chunked_docs)
    print("Embeddings stored successfully!")
    
    return chunked_docs

if __name__ == "__main__":
    create_and_store_embeddings()
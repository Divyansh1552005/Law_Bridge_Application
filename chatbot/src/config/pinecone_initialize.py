# src/config/pinecone_initialize.py

import sys
import time
from pathlib import Path
from pinecone import Pinecone, ServerlessSpec

# Ensure we can import from src directory
src_path = Path(__file__).parent.parent
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from config.env import PINECONE_API_KEY, PINECONE_INDEX

def get_pinecone_index():
    # 1. Init client
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # do this only when index does not exist, commented out for now coz i have created the index already
    # # 2. Check existing indexes
    # existing_indexes = [index.name for index in pc.list_indexes()]

    # # 3. Create if needed
    # if PINECONE_INDEX not in existing_indexes:
    #     pc.create_index(
    #         name=PINECONE_INDEX,
    #         dimension=768,  # Google text-embedding-004 dimension
    #         metric="cosine",
    #         spec=ServerlessSpec(
    #             cloud="aws",
    #             region="us-east-1"
    #         )
    #     )
    #     print(f"Created index: {PINECONE_INDEX}")
    # else:
    #     print(f"Index {PINECONE_INDEX} already exists!")

    # 4. Return connected index
    return pc.Index(PINECONE_INDEX)

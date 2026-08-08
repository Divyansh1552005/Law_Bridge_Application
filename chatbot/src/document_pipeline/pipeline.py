import sys
from pathlib import Path
from langchain_core.documents import Document

src_path = Path(__file__).parent.parent
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from document_pipeline.detector import detect_file_type
from document_pipeline.extractors.txt_extractor import extract_text_from_txt
from document_pipeline.extractors.docx_extractor import extract_text_from_docx
from document_pipeline.extractors.pdf_extractor import extract_text_from_pdf
from document_pipeline.extractors.image_extractor import extract_text_from_image
from processors.text_chunker import chunk_text
from vectorStore_Retrieval.store_embedding import store_embeddings
from config.pinecone_initialize import get_user_namespace


def process_uploaded_document(
    file_bytes: bytes,
    filename: str,
    user_id: str,
    cloudinary_public_id: str = None,
) -> dict:
    """
    Uploaded document ka complete pipeline:
    bytes → detect → extract → chunk → embed → pinecone store

    Args:
        file_bytes            : Raw bytes of the uploaded file
        filename               : Original filename (e.g. "contract.pdf")
        user_id                : User ka unique ID (namespace isolation ke liye)
        cloudinary_public_id   : Optional, metadata mein store hota hai (asset private hai,
                                  isi se baad mein fresh signed URL generate hoti hai)

    Returns:
        {
            "status": "success",
            "filename": "contract.pdf",
            "file_type": "pdf",
            "chunks_stored": 42,
            "namespace": "user-uploads-abc123"
        }

    Raises:
        UnsupportedFileTypeError : Agar file type supported nahi hai
        ValueError               : Agar file empty hai ya text extract nahi hua
    """

    # Step 1 — File type detect karo
    print(f"[Pipeline] '{filename}' processing shuru...")
    file_type = detect_file_type(filename)
    print(f"[Pipeline] File type detected: {file_type}")

    # Step 2 — Text extract karo
    if file_type == "txt":
        text = extract_text_from_txt(file_bytes)

    elif file_type == "docx":
        text = extract_text_from_docx(file_bytes)

    elif file_type == "pdf":
        text = extract_text_from_pdf(file_bytes)

    elif file_type == "image":
        text = extract_text_from_image(file_bytes)

    print(f"[Pipeline] Text extracted — {len(text)} characters")

    # Step 3 — Text ko Document object mein wrap karo
    # (text_chunker ka split_documents Document objects expect karta hai)
    metadata = {
        "filename": filename,
        "user_id": user_id,
        "file_type": file_type,
    }
    if cloudinary_public_id:
        metadata["cloudinary_public_id"] = cloudinary_public_id

    document = Document(page_content=text, metadata=metadata)

    # Step 4 — Chunk karo
    chunks = chunk_text([document], chunk_size=1000, overlap=200)
    print(f"[Pipeline] {len(chunks)} chunks bane")

    # Step 5 — User ke namespace mein store karo
    namespace = get_user_namespace(user_id)
    store_embeddings(chunks, namespace=namespace)

    print(f"[Pipeline] '{filename}' successfully store hua — namespace: '{namespace}'")

    return {
        "status": "success",
        "filename": filename,
        "file_type": file_type,
        "chunks_stored": len(chunks),
        "namespace": namespace,
    }
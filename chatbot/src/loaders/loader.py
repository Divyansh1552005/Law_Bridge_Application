import os
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader

# Get absolute path to the PDF file
current_dir = Path(__file__).parent
pdf_path = current_dir.parent.parent / "data" / "Mp-Jain-Indian-Constitutional-Law.pdf"

loader = PyPDFLoader(str(pdf_path))

documents = loader.load() 

def load_pdf():
    return documents



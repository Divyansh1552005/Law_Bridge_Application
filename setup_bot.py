import os
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='[%(asctime)s]: %(message)s')


# All folders + files to create inside chatbot/
project_structure = [
    "config/__init__.py",
    "config/settings.py",

    "data/raw/",
    "data/processed/",
    "data/embeddings/",

    "pipelines/__init__.py",
    "pipelines/chunker.py",
    "pipelines/embedder.py",
    "pipelines/vector_store.py",
    "pipelines/retrieval.py",

    "llm/__init__.py",
    "llm/prompts.py",
    "llm/chat_model.py",

    "core/__init__.py",
    "core/rag_pipeline.py",

    "utils/__init__.py",
    "utils/logger.py",

    "main.py",
    "__init__.py"
]


def create_chatbot_structure(base_folder="chatbot"):
    base = Path(base_folder)

    for path in project_structure:
        file_path = base / path

        # If ends with "/" → it's a folder
        if str(path).endswith("/"):
            os.makedirs(file_path, exist_ok=True)
            logging.info(f"Directory created: {file_path}")
        else:
            # Ensure directories exist
            os.makedirs(file_path.parent, exist_ok=True)

            # Create empty file if not exists
            if (not file_path.exists()) or (file_path.stat().st_size == 0):
                with open(file_path, "w") as f:
                    pass
                logging.info(f"File created: {file_path}")
            else:
                logging.info(f"File already exists: {file_path}")


if __name__ == "__main__":
    create_chatbot_structure()
    logging.info("Chatbot project structure created successfully!")

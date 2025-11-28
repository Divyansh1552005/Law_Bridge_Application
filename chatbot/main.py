#!/usr/bin/env python3
"""
LawBridge Legal Chatbot Main Application

This application provides a complete RAG (Retrieval Augmented Generation) system
for legal document querying using Indian Constitutional Law documents.
"""

import os
import sys
from pathlib import Path

# Add src directory to Python path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

from embeddings.create_embeddings import create_and_store_embeddings
from api.chat import app
import uvicorn

def setup_embeddings():
    """
    Setup embeddings if they don't exist
    """
    try:
        print("Setting up embeddings...")
        create_and_store_embeddings()
        print("Embeddings setup completed!")
    except Exception as e:
        print(f"Error setting up embeddings: {e}")
        return False
    return True

def start_api_server():
    """
    Start the FastAPI server
    """
    print("Starting LawBridge Legal Chatbot API...")
    uvicorn.run(
        "api.chat:app",
        host="0.0.0.0",
        port=4000,
        reload=True,
        reload_dirs=["src"]
    )

def main():
    """
    Main application entry point
    """
    print("=" * 50)
    print("LawBridge Legal Chatbot System")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "setup":
            # Setup embeddings only
            setup_embeddings()
        
        elif command == "server":
            # Start API server only
            start_api_server()
        
        elif command == "help":
            print("Available commands:")
            print("  python main.py setup   - Setup embeddings")
            print("  python main.py server  - Start API server")
            print("  python main.py         - Setup embeddings and start server")
        
        else:
            print(f"Unknown command: {command}")
            print("Use 'python main.py help' for available commands")
    
    else:
        # Default: Setup embeddings and start server
        print("Starting complete setup...")
        
        # Setup embeddings first
        if setup_embeddings():
            # Start API server
            start_api_server()
        else:
            print("Failed to setup embeddings. Please check your configuration.")
            sys.exit(1)

if __name__ == "__main__":
    main()
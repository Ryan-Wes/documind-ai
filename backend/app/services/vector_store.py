import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from app.core.config import OPENAI_API_KEY

CHROMA_DIR = os.path.join(os.getcwd(), "chroma_db")

def save_chunks_to_chroma(chunks, filename: str):
    os.makedirs(CHROMA_DIR, exist_ok=True)

    embeddings = OpenAIEmbeddings(
        openai_api_key=OPENAI_API_KEY
    )

    texts = []
    metadatas = []

    for i, chunk in enumerate(chunks):
        texts.append(chunk)
        metadatas.append({
            "source": filename,
            "chunk_id": i
        })

    vector_store = Chroma.from_texts(
        texts=texts,
        embedding=embeddings,
        metadatas=metadatas,
        persist_directory=CHROMA_DIR
    )

    vector_store.persist()

    return vector_store
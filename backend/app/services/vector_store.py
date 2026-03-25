from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from app.core.config import OPENAI_API_KEY

CHROMA_DIR = "chroma_db"

def save_chunks_to_chroma(chunks, filename: str):
    embeddings = OpenAIEmbeddings(
        openai_api_key=OPENAI_API_KEY
    )

    texts = chunks
    metadatas = [{"source": filename} for _ in chunks]

    vector_store = Chroma.from_texts(
        texts=texts,
        embedding=embeddings,
        metadatas=metadatas,
        persist_directory=CHROMA_DIR
    )

    return vector_store
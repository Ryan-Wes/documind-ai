import os
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from app.core.config import OPENAI_API_KEY

CHROMA_PATH = "data/chroma"
COLLECTION_NAME = "documind"


def get_vector_store():
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=CHROMA_PATH,
    )


def save_chunks(chunks: list[str], filename: str):
    store = get_vector_store()
    metadatas = [{"source": filename, "chunk_id": i} for i in range(len(chunks))]
    store.add_texts(texts=chunks, metadatas=metadatas)


def delete_chunks_by_source(filename: str):
    store = get_vector_store()
    store.delete(where={"source": filename})

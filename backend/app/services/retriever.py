from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from app.core.config import OPENAI_API_KEY

CHROMA_DIR = "chroma_db"

def search_similar_chunks(query: str, k: int = 3):
    embeddings = OpenAIEmbeddings(
        openai_api_key=OPENAI_API_KEY
    )

    vector_store = Chroma(
        persist_directory=CHROMA_DIR,
        embedding_function=embeddings
    )

    results = vector_store.similarity_search(query, k=k)

    return results
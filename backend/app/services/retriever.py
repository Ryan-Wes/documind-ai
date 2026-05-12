from app.services.vector_store import get_vector_store


def search_similar_chunks(query: str, k: int = 6):
    store = get_vector_store()
    return store.similarity_search(query, k=k)

import uuid

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore

from app.core.config import OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY, QDRANT_COLLECTION


def get_embeddings():
    return OpenAIEmbeddings(
        openai_api_key=OPENAI_API_KEY
    )


def get_qdrant_client():
    return QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY
    )


def ensure_collection_exists():
    client = get_qdrant_client()

    collections = client.get_collections().collections
    collection_names = [collection.name for collection in collections]

    if QDRANT_COLLECTION not in collection_names:
        client.create_collection(
            collection_name=QDRANT_COLLECTION,
            vectors_config=VectorParams(
                size=1536,
                distance=Distance.COSINE
            )
        )


def save_chunks_to_qdrant(chunks, filename: str):
    ensure_collection_exists()

    embeddings = get_embeddings()
    client = get_qdrant_client()

    texts = []
    metadatas = []
    ids = []

    for i, chunk in enumerate(chunks):
        texts.append(chunk)
        metadatas.append({
            "source": filename,
            "chunk_id": i
        })
        ids.append(str(uuid.uuid4()))

    vector_store = QdrantVectorStore(
        client=client,
        collection_name=QDRANT_COLLECTION,
        embedding=embeddings
    )

    vector_store.add_texts(
        texts=texts,
        metadatas=metadatas,
        ids=ids
    )

    return vector_store
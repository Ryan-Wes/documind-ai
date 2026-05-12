from fastapi import APIRouter
from pydantic import BaseModel
from app.services.retriever import search_similar_chunks
from app.services.qa import generate_answer

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str
    history: list[dict] = []


@router.post("/ask")
async def ask_question(data: QuestionRequest):
    results = search_similar_chunks(data.question, k=6)

    context_chunks = [doc.page_content for doc in results]
    answer = generate_answer(data.question, context_chunks, data.history)

    formatted_results = []
    for doc in results:
        snippet = doc.page_content[:300].strip()
        formatted_results.append({
            "source": doc.metadata.get("source", "desconhecido"),
            "chunk_id": doc.metadata.get("chunk_id"),
            "content": snippet
        })

    return {
        "question": data.question,
        "answer": answer,
        "sources": formatted_results
    }

from fastapi import APIRouter
from pydantic import BaseModel
from app.services.retriever import search_similar_chunks
from app.services.qa import generate_answer

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask_question(data: QuestionRequest):
    results = search_similar_chunks(data.question)

    context_chunks = [doc.page_content for doc in results]
    answer = generate_answer(data.question, context_chunks)

    formatted_results = []

    for doc in results:
        formatted_results.append({
            "source": doc.metadata.get("source", "desconhecido"),
            "content": doc.page_content
        })

    return {
        "question": data.question,
        "answer": answer,
        "sources": formatted_results
    }
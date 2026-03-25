from fastapi import APIRouter, UploadFile, File
import os
from app.services.loader import load_document
from app.services.chunker import split_text
from app.services.vector_store import save_chunks_to_chroma

router = APIRouter()

UPLOAD_DIR = "data/uploads"

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    text = load_document(file_path)
    chunks = split_text(text)

    save_chunks_to_chroma(chunks, file.filename)

    return {
        "filename": file.filename,
        "total_chunks": len(chunks),
        "message": "Documento processado e salvo no ChromaDB com sucesso"
    }
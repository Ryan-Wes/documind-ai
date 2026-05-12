import os
from fastapi import APIRouter, HTTPException
from app.services.vector_store import delete_chunks_by_source

router = APIRouter()

UPLOAD_DIR = "data/uploads"


@router.get("/documents")
def list_documents():
    if not os.path.exists(UPLOAD_DIR):
        return []

    files = []
    for filename in os.listdir(UPLOAD_DIR):
        path = os.path.join(UPLOAD_DIR, filename)
        if os.path.isfile(path):
            stat = os.stat(path)
            files.append({
                "filename": filename,
                "size_kb": round(stat.st_size / 1024, 1),
                "uploaded_at": stat.st_mtime,
            })

    files.sort(key=lambda f: f["uploaded_at"], reverse=True)
    return files


@router.delete("/documents/{filename}")
def delete_document(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    os.remove(file_path)
    delete_chunks_by_source(filename)

    return {"message": f"{filename} removido com sucesso"}

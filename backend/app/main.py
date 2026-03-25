from fastapi import FastAPI
from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router

app = FastAPI(title="DocuMind AI")

app.include_router(upload_router)
app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": "DocuMind AI backend is running"}
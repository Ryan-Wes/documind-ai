from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import upload, chat

app = FastAPI()

# 🔥 CORS AQUI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # depois tu pode restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# rotas
app.include_router(upload.router)
app.include_router(chat.router)
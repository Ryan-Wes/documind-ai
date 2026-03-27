import os
from dotenv import load_dotenv
from pathlib import Path

# pega o caminho da pasta backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# aponta pro .env dentro de backend
env_path = BASE_DIR / ".env"

load_dotenv(dotenv_path=env_path)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION")

# debug básico (pode tirar depois)
print("OPENAI:", "OK" if OPENAI_API_KEY else "None")
print("QDRANT URL:", QDRANT_URL)
print("QDRANT COLLECTION:", QDRANT_COLLECTION)
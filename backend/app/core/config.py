import os
from dotenv import load_dotenv
from pathlib import Path

# pega o caminho da pasta backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# aponta pro .env dentro de backend
env_path = BASE_DIR / ".env"

# só tenta carregar .env se ele existir
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
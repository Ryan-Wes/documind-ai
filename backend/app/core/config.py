import os
from dotenv import load_dotenv
from pathlib import Path

# pega o caminho da pasta backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# aponta pro .env dentro de backend
env_path = BASE_DIR / ".env"

load_dotenv(dotenv_path=env_path)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

print("API KEY carregada:", OPENAI_API_KEY[:10] if OPENAI_API_KEY else "None")
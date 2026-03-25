from openai import OpenAI
from app.core.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_answer(question: str, context_chunks: list[str]) -> str:
    context = "\n\n".join(context_chunks)

    prompt = f"""
Você é um assistente técnico especializado em documentos de obras, materiais e linha de transmissão.

Responda apenas com base no contexto fornecido.
Se a resposta não estiver clara no contexto, diga que não encontrou informação suficiente nos documentos enviados.
Seja objetivo, técnico e confiável.

Pergunta:
{question}

Contexto:
{context}
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "Você responde apenas com base nas fontes fornecidas."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    return response.choices[0].message.content
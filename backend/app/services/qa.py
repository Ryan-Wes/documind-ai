from openai import OpenAI
from app.core.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_answer(question: str, context_chunks: list[str]) -> str:
    context = "\n\n".join(context_chunks)

    prompt = f"""
Você é um assistente técnico especializado em obras, materiais e linha de transmissão.

Responda de forma clara, objetiva e técnica.

Regras:
- Use apenas o contexto fornecido
- Não invente informações
- Se não encontrar resposta, diga que não há informação suficiente
- Seja direto, sem enrolação

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
from openai import OpenAI
from app.core.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)


def generate_answer(question: str, context_chunks: list[str], history: list[dict] = None) -> str:
    context = "\n\n---\n\n".join(context_chunks)

    system_prompt = """Você é um assistente inteligente de consulta a documentos.

Regras:
- Responda com base no contexto fornecido e no histórico da conversa
- Se a pergunta for de acompanhamento ("e onde mais?", "liste elas", etc.), use o histórico para entender o que foi perguntado antes
- Se realmente não houver informação no contexto, diga claramente
- Seja direto e objetivo
- Não invente informações que não estão no documento"""

    messages = [{"role": "system", "content": system_prompt}]

    if history:
        messages.extend(history[-6:])

    messages.append({
        "role": "user",
        "content": f"Contexto do documento:\n{context}\n\nPergunta: {question}"
    })

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.2
    )

    return response.choices[0].message.content

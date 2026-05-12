# 🤖 DocuMind AI

DocuMind AI é um sistema de consulta inteligente baseado em RAG (Retrieval-Augmented Generation) que permite fazer upload de documentos e obter respostas fundamentadas em trechos reais do conteúdo, com histórico de conversa e gestão dos arquivos indexados.

## 🚀 Sobre o Projeto

O DocuMind AI foi desenvolvido para demonstrar a aplicação prática de técnicas modernas de IA, combinando:

- **Processamento de documentos** (PDF e TXT)
- **Busca semântica com embeddings** (OpenAI + ChromaDB)
- **Recuperação de contexto relevante** (k=6 chunks por query)
- **Geração de respostas com LLM** com histórico de conversa
- **Gestão da base de conhecimento** (listar e remover documentos)

### Proposta

1. 📄 Você envia um documento
2. 🤖 O sistema processa e indexa no ChromaDB
3. 💬 Você pergunta em linguagem natural
4. 📌 Ele responde com base no conteúdo + mantém contexto da conversa

## 🧠 Como Funciona

O fluxo segue o modelo clássico de RAG com memória de conversa:

1. **Upload do documento** (PDF/TXT)
2. **Extração e divisão em chunks** (800 chars, overlap 150)
3. **Geração de embeddings** via OpenAI
4. **Armazenamento em ChromaDB** (embedded, sem cluster externo)
5. **Busca semântica** nos 6 chunks mais relevantes por pergunta
6. **Envio do contexto + histórico** para o modelo de IA
7. **Geração da resposta + fontes** utilizadas

## ⚙️ Tecnologias Utilizadas

### Backend
- Python
- FastAPI
- LangChain + LangChain-Chroma
- OpenAI API (embeddings + gpt-4o-mini)
- ChromaDB (embedded)

### Frontend
- HTML + CSS + JavaScript (Vanilla)
- Layout 2 colunas (upload/docs | chat/fontes)
- Inter font

## 💡 Funcionalidades

- Upload de documentos (PDF/TXT)
- Indexação automática no ChromaDB
- **Base de conhecimento**: lista todos os documentos indexados com nome, tamanho e data
- **Remoção de documentos**: deleta o arquivo e os chunks do ChromaDB
- Chat com IA baseado no conteúdo dos documentos
- **Histórico de conversa**: perguntas de acompanhamento funcionam corretamente
- Exibição das fontes com trecho e chunk ID
- Chat bloqueado até ter pelo menos um documento indexado

## ▶️ Como Rodar Localmente

### 🔧 Backend

```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Crie um `.env` dentro de `backend/`:

```
OPENAI_API_KEY=sk-...
```

O ChromaDB cria a pasta `data/chroma/` automaticamente na primeira execução.

## ⚠️ Observação sobre Deploy

O backend está hospedado no Render (free tier), que possui **filesystem efêmero** — os dados do ChromaDB e os arquivos enviados são perdidos a cada redeploy ou restart do servidor. Após um restart, basta re-enviar os documentos pela interface para reindexá-los.

### 🌐 Frontend

```bash
cd frontend
python -m http.server 5501
```

Acesse: [http://localhost:5501](http://localhost:5501)

## 🔌 Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/upload` | Processa e indexa um documento |
| `POST` | `/ask` | Pergunta com histórico de conversa |
| `GET` | `/documents` | Lista documentos indexados |
| `DELETE` | `/documents/{filename}` | Remove documento e chunks |

## 🎯 Objetivo do Projeto

Este projeto faz parte do meu portfólio com foco em:

- Inteligência Artificial aplicada (RAG)
- Engenharia de software orientada a dados
- Construção de soluções reais com IA

## 👨‍💻 Autor

Ryan Lopes  
🔗 [LinkedIn](https://www.linkedin.com/in/wryan-lopes)  
🌐 [Portfólio](https://ryan-wes.github.io/portfolio/)

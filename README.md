# 🤖 DocuMind AI

DocuMind AI é um sistema de consulta inteligente baseado em RAG (Retrieval-Augmented Generation) que permite fazer upload de documentos técnicos e obter respostas fundamentadas em trechos reais do conteúdo.

## 🚀 Sobre o Projeto

O DocuMind AI foi desenvolvido para demonstrar a aplicação prática de técnicas modernas de IA, combinando:

- **Processamento de documentos**
- **Busca semântica com embeddings**
- **Recuperação de contexto relevante**
- **Geração de respostas com LLM**

### Proposta

1. 📄 Você envia um documento
2. 🤖 O sistema entende
3. 💬 Você pergunta
4. 📌 Ele responde com base no conteúdo

## 🧠 Como Funciona

O fluxo do sistema segue o modelo clássico de RAG:

1. **Upload do documento** (PDF/TXT)
2. **Extração e divisão em chunks**
3. **Geração de embeddings**
4. **Armazenamento em banco vetorial (Chroma)**
5. **Busca semântica baseada na pergunta**
6. **Envio do contexto para o modelo de IA**
7. **Geração da resposta + fontes utilizadas**

## ⚙️ Tecnologias Utilizadas

### Backend
- Python
- FastAPI
- LangChain
- OpenAI API
- ChromaDB

### Frontend
- HTML
- CSS
- JavaScript (Vanilla)

### Deploy
- **Frontend**: GitHub Pages
- **Backend**: (em ambiente local / em processo de deploy)

## 💡 Funcionalidades

### ✅ V1 (Implementado)
- Upload de documentos
- Processamento e indexação
- Chat funcional com IA
- Respostas baseadas em contexto
- Exibição das fontes utilizadas
- Interface responsiva e estilizada

### 🚧 V2 (Em Desenvolvimento)
- Múltiplas fontes por resposta
- Destaque do trecho relevante
- Filtro por documento
- Melhorias no chunking
- Histórico de conversa
- Ajustes finos de prompt
- Controle da base vetorial

## 🧪 Observação

Este projeto está em ambiente de demonstração. Em algumas versões públicas, os dados podem não ser persistidos entre sessões.

## ▶️ Como Rodar Localmente

### 🔧 Backend
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

### 🌐 Frontend
```bash
cd frontend
python -m http.server 5501
```

Acesse: [http://127.0.0.1:5501](http://127.0.0.1:5501)

## 🎯 Objetivo do Projeto

Este projeto faz parte do meu portfólio com foco em:

- Inteligência Artificial aplicada
- Automação de processos
- Engenharia de software voltada a dados
- Construção de soluções reais com IA

## 👨‍💻 Autor

Ryan Lopes  
🔗 [LinkedIn](https://www.linkedin.com/in/wryan-lopes)  
🌐 [Portfólio](https://ryan-wes.github.io/portfolio/)


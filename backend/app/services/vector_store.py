def save_chunks_to_chroma(chunks, filename: str):
    embeddings = OpenAIEmbeddings(
        openai_api_key=OPENAI_API_KEY
    )

    texts = []
    metadatas = []

    for i, chunk in enumerate(chunks):
        texts.append(chunk)
        metadatas.append({
            "source": filename,
            "chunk_id": i
        })

    vector_store = Chroma.from_texts(
        texts=texts,
        embedding=embeddings,
        metadatas=metadatas,
        persist_directory=CHROMA_DIR
    )

    return vector_store
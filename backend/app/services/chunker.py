def split_text(text: str, chunk_size: int = 800, overlap: int = 150):
    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size

        # tenta não cortar no meio da frase
        if end < text_length:
            while end < text_length and text[end] not in [".", "\n"]:
                end += 1

        chunk = text[start:end].strip()
        chunks.append(chunk)

        start += chunk_size - overlap

    return chunks
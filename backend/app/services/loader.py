import re
from pypdf import PdfReader

def clean_text(text: str) -> str:
    text = re.sub(r"\n+", " ", text)  # remove quebras excessivas
    text = re.sub(r"\s+", " ", text)  # remove espaços duplicados
    return text.strip()


def load_document(file_path: str) -> str:
    if file_path.endswith(".pdf"):
        return clean_text(load_pdf(file_path))
    elif file_path.endswith(".txt"):
        return clean_text(load_txt(file_path))
    else:
        raise ValueError("Formato não suportado")


def load_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + " "

    return text


def load_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()
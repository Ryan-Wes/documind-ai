const API_URL = "http://127.0.0.1:8000";

// ==========================
// ELEMENTOS
// ==========================
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const uploadStatus = document.getElementById("uploadStatus");

const sendBtn = document.getElementById("sendBtn");
const questionInput = document.getElementById("questionInput");

const messages = document.getElementById("messages");
const sourcesList = document.getElementById("sourcesList");

// ==========================
// EVENTOS INICIAIS
// ==========================
fileInput.addEventListener("change", () => {
  const selectedFile = fileInput.files[0];

  fileName.textContent = selectedFile
    ? selectedFile.name
    : "Nenhum arquivo selecionado";
});

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (!file) {
    uploadStatus.textContent = "Selecione um arquivo primeiro.";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  uploadStatus.textContent = "Enviando documento...";

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      uploadStatus.textContent = data.detail || "Erro ao enviar arquivo.";
      return;
    }

    uploadStatus.textContent =
      data.message || "Documento enviado com sucesso.";

    fileInput.value = "";
    fileName.textContent = "Nenhum arquivo selecionado";
  } catch (error) {
    uploadStatus.textContent = "Erro ao enviar arquivo.";
    console.error("Erro no upload:", error);
  }
});

sendBtn.addEventListener("click", sendQuestion);

questionInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendQuestion();
  }
});

// ==========================
// CHAT
// ==========================
async function sendQuestion() {
  const question = questionInput.value.trim();

  if (!question) {
    return;
  }

  addMessage("user", question);
  questionInput.value = "";
  questionInput.focus();

  addTypingMessage();

  try {
    const response = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    removeTypingMessage();

    if (!response.ok) {
      addMessage("bot", data.detail || "Erro ao obter resposta.");
      return;
    }

    addMessage("bot", data.answer || "Não foi possível gerar uma resposta.");
    renderSources(data.sources);
  } catch (error) {
    removeTypingMessage();
    addMessage("bot", "Erro ao obter resposta.");
    console.error("Erro na pergunta:", error);
  }
}

// ==========================
// UI HELPERS
// ==========================
function addMessage(type, text) {
  const div = document.createElement("div");
  div.classList.add("message", type);

  div.textContent = text;

  messages.appendChild(div);
  scrollMessagesToBottom();
}

function addTypingMessage() {
  removeTypingMessage();

  const div = document.createElement("div");
  div.classList.add("message", "bot");
  div.id = "typingMessage";
  div.textContent = "Analisando documento...";

  messages.appendChild(div);
  scrollMessagesToBottom();
}

function removeTypingMessage() {
  const typingMessage = document.getElementById("typingMessage");

  if (typingMessage) {
    typingMessage.remove();
  }
}

function renderSources(sources) {
  sourcesList.innerHTML = "";

  if (!sources || sources.length === 0) {
    sourcesList.innerHTML = `<p class="empty-state">Nenhuma fonte encontrada.</p>`;
    return;
  }

  sources.forEach((src) => {
    const div = document.createElement("div");
    div.classList.add("source-item");

    const sourceName = src.source || "Fonte desconhecida";
    const sourceContent = src.content || "Sem trecho disponível.";

    div.innerHTML = `
      <strong>${escapeHtml(sourceName)}</strong>
      <p>${escapeHtml(sourceContent)}</p>
    `;

    sourcesList.appendChild(div);
  });
}

function scrollMessagesToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(text) {
  const temp = document.createElement("div");
  temp.textContent = text;
  return temp.innerHTML;
}
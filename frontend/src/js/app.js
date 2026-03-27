const API_URL = "https://documind-backend-r460.onrender.com";

// ==========================
// ELEMENTOS
// ==========================
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const uploadStatus = document.getElementById("uploadStatus");
const uploadProgressWrapper = document.getElementById("uploadProgressWrapper");
const uploadProgressBar = document.getElementById("uploadProgressBar");

const sendBtn = document.getElementById("sendBtn");
const questionInput = document.getElementById("questionInput");

const messages = document.getElementById("messages");
const sourcesList = document.getElementById("sourcesList");
const chatPanel = document.querySelector(".chat-panel");

// ==========================
// ESTADO
// ==========================
let isUploading = false;
let isAsking = false;
let hasUploadedDocument = false;
let progressInterval = null;

// ==========================
// INÍCIO
// ==========================
lockChat();

fileInput.addEventListener("change", () => {
  const selectedFile = fileInput.files[0];
  fileName.textContent = selectedFile
    ? selectedFile.name
    : "Nenhum arquivo selecionado";
});

uploadBtn.addEventListener("click", handleUpload);
sendBtn.addEventListener("click", sendQuestion);

questionInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendQuestion();
  }
});

// ==========================
// UPLOAD
// ==========================
async function handleUpload() {
  if (isUploading) return;

  const file = fileInput.files[0];

  if (!file) {
    setUploadStatus("Selecione um arquivo primeiro.", "#ef4444");
    return;
  }

  isUploading = true;
  uploadBtn.disabled = true;
  uploadBtn.textContent = "Enviando...";


  clearSources();
  startFakeProgress();
  setUploadStatus("Processando documento...", "#a855f7");

  const formData = new FormData();
  formData.append("file", file);

  const uploadStartTime = Date.now();

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    const elapsedTime = Date.now() - uploadStartTime;
    const minimumVisualTime = 1500; 

    if (elapsedTime < minimumVisualTime) {
      await wait(minimumVisualTime - elapsedTime);
    }

    if (!response.ok) {
      finishProgress();
      setUploadStatus(data.detail || "Erro ao enviar arquivo.", "#ef4444");
      return;
    }

    finishProgress();

    hasUploadedDocument = true;
    unlockChat();



    setUploadStatus(
      data.message || "Documento enviado com sucesso.",
      "#22c55e"
    );

    

    fileInput.value = "";
    fileName.textContent = "Nenhum arquivo selecionado";
  } catch (error) {
    finishProgress();
    setUploadStatus("Erro ao enviar arquivo.", "#ef4444");
    console.error("Erro no upload:", error);
  } finally {
    isUploading = false;
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Enviar documento";
  }
}

// ==========================
// CHAT
// ==========================
async function sendQuestion() {
  if (!hasUploadedDocument) {
    addMessage("bot", "Envie um documento antes de fazer perguntas.");
    return;
  }

  if (isAsking) return;

  const question = questionInput.value.trim();

  if (!question) return;

  isAsking = true;
  sendBtn.disabled = true;
  questionInput.disabled = true;
  sendBtn.textContent = "Enviando...";

  addMessage("user", question);
  questionInput.value = "";
  clearSources();
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
  } finally {
    isAsking = false;
    sendBtn.disabled = false;
    questionInput.disabled = false;
    sendBtn.textContent = "Enviar";
    questionInput.focus();
  }
}

// ==========================
// STATUS E PROGRESSO
// ==========================
function setUploadStatus(message, color) {
  uploadStatus.textContent = message;
  uploadStatus.style.color = color;
}

function startFakeProgress() {
  clearInterval(progressInterval);

  uploadProgressWrapper.classList.remove("hidden");
  uploadProgressBar.style.width = "0%";

  let progress = 0;

  progressInterval = setInterval(() => {
    if (progress < 90) {
      progress += 7;
      uploadProgressBar.style.width = `${progress}%`;
    }
  }, 120);
}

function finishProgress() {
  clearInterval(progressInterval);
  uploadProgressBar.style.width = "100%";

  setTimeout(() => {
    uploadProgressWrapper.classList.add("hidden");
    uploadProgressBar.style.width = "0%";
  }, 1800);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==========================
// CHAT LOCK
// ==========================
function lockChat() {
  hasUploadedDocument = false;

  if (chatPanel) {
    chatPanel.classList.add("locked");
  }

  questionInput.disabled = true;
  sendBtn.disabled = true;
  questionInput.placeholder = "Envie um documento para liberar o chat";
}

function unlockChat() {
  hasUploadedDocument = true;

  if (chatPanel) {
    chatPanel.classList.remove("locked");
  }

  questionInput.disabled = false;
  sendBtn.disabled = false;
  questionInput.placeholder = "Digite sua pergunta...";
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

function clearSources() {
  sourcesList.innerHTML = "";
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
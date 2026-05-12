const API_URL = "https://documind-backend-r460.onrender.com";

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
const chatStatus = document.getElementById("chatStatus");

const docsList = document.getElementById("docsList");
const docsCount = document.getElementById("docsCount");

let isUploading = false;
let isAsking = false;
let hasUploadedDocument = false;
let progressInterval = null;
let conversationHistory = [];

lockChat();
loadDocuments();

fileInput.addEventListener("change", () => {
  const selected = fileInput.files[0];
  fileName.textContent = selected ? selected.name : "Nenhum arquivo selecionado";
});

uploadBtn.addEventListener("click", handleUpload);
sendBtn.addEventListener("click", sendQuestion);

questionInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") { e.preventDefault(); sendQuestion(); }
});

// ── Upload ──────────────────────────────────────────
async function handleUpload() {
  if (isUploading) return;

  const file = fileInput.files[0];
  if (!file) { setUploadStatus("Selecione um arquivo primeiro.", "#ef4444"); return; }

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
    const response = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
    const data = await response.json();

    const elapsed = Date.now() - uploadStartTime;
    if (elapsed < 1500) await wait(1500 - elapsed);

    if (!response.ok) {
      finishProgress();
      setUploadStatus(data.detail || "Erro ao enviar arquivo.", "#ef4444");
      return;
    }

    finishProgress();
    hasUploadedDocument = true;
    unlockChat();
    setUploadStatus(data.message || "Documento enviado com sucesso.", "#22c55e");

    fileInput.value = "";
    fileName.textContent = "Nenhum arquivo selecionado";
    await loadDocuments();
  } catch {
    finishProgress();
    setUploadStatus("Erro ao enviar arquivo.", "#ef4444");
  } finally {
    isUploading = false;
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Enviar documento";
  }
}

// ── Documents ────────────────────────────────────────
async function loadDocuments() {
  try {
    const response = await fetch(`${API_URL}/documents`);
    if (!response.ok) return;
    const docs = await response.json();
    renderDocuments(docs);
  } catch {
    // silently fail — backend may be cold-starting
  }
}

function renderDocuments(docs) {
  docsCount.textContent = docs.length;

  if (!docs.length) {
    docsList.innerHTML = `<p class="empty-state">Nenhum documento indexado ainda.</p>`;
    return;
  }

  docsList.innerHTML = docs.map((doc) => {
    const ext = doc.filename.split(".").pop().toUpperCase();
    const icon = ext === "PDF" ? "📄" : "📝";
    const date = new Date(doc.uploaded_at * 1000).toLocaleDateString("pt-BR");
    return `
      <div class="doc-card" data-filename="${escapeHtml(doc.filename)}">
        <span class="doc-icon">${icon}</span>
        <div class="doc-info">
          <div class="doc-name" title="${escapeHtml(doc.filename)}">${escapeHtml(doc.filename)}</div>
          <div class="doc-meta">${doc.size_kb} KB • ${date}</div>
        </div>
        <button class="doc-delete" title="Remover documento" onclick="deleteDocument('${escapeHtml(doc.filename)}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    `;
  }).join("");

  if (docs.length > 0) {
    hasUploadedDocument = true;
    unlockChat();
  }
}

async function deleteDocument(filename) {
  if (!confirm(`Remover "${filename}" da base?`)) return;

  try {
    const response = await fetch(`${API_URL}/documents/${encodeURIComponent(filename)}`, {
      method: "DELETE"
    });

    if (!response.ok) return;

    await loadDocuments();

    const remainingCards = docsList.querySelectorAll(".doc-card");
    if (remainingCards.length === 0) {
      lockChat();
    }
  } catch {
    // silently fail
  }
}

// ── Chat ─────────────────────────────────────────────
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

  addMessage("user", question);
  questionInput.value = "";
  clearSources();
  addTypingMessage();

  try {
    const response = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history: conversationHistory })
    });

    const data = await response.json();
    removeTypingMessage();

    if (!response.ok) {
      addMessage("bot", data.detail || "Erro ao obter resposta.");
      return;
    }

    const answer = data.answer || "Não foi possível gerar uma resposta.";
    addMessage("bot", answer);
    renderSources(data.sources);

    conversationHistory.push({ role: "user", content: question });
    conversationHistory.push({ role: "assistant", content: answer });
    if (conversationHistory.length > 12) conversationHistory = conversationHistory.slice(-12);
  } catch {
    removeTypingMessage();
    addMessage("bot", "Erro ao obter resposta.");
  } finally {
    isAsking = false;
    sendBtn.disabled = false;
    questionInput.disabled = false;
    questionInput.focus();
  }
}

// ── Chat lock/unlock ─────────────────────────────────
function lockChat() {
  hasUploadedDocument = false;
  chatPanel.classList.add("locked");
  questionInput.disabled = true;
  sendBtn.disabled = true;
  questionInput.placeholder = "Envie um documento para liberar o chat";
  chatStatus.textContent = "Aguardando documento";
  chatStatus.className = "chat-status locked";
}

function unlockChat() {
  hasUploadedDocument = true;
  chatPanel.classList.remove("locked");
  questionInput.disabled = false;
  sendBtn.disabled = false;
  questionInput.placeholder = "Digite sua pergunta...";
  chatStatus.textContent = "Pronto";
  chatStatus.className = "chat-status ready";
}

// ── Progress ─────────────────────────────────────────
function setUploadStatus(msg, color) {
  uploadStatus.textContent = msg;
  uploadStatus.style.color = color;
}

function startFakeProgress() {
  clearInterval(progressInterval);
  uploadProgressWrapper.classList.remove("hidden");
  uploadProgressBar.style.width = "0%";
  let progress = 0;
  progressInterval = setInterval(() => {
    if (progress < 88) { progress += 6; uploadProgressBar.style.width = `${progress}%`; }
  }, 120);
}

function finishProgress() {
  clearInterval(progressInterval);
  uploadProgressBar.style.width = "100%";
  setTimeout(() => {
    uploadProgressWrapper.classList.add("hidden");
    uploadProgressBar.style.width = "0%";
  }, 1600);
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ── UI helpers ───────────────────────────────────────
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
  document.getElementById("typingMessage")?.remove();
}

function clearSources() {
  sourcesList.innerHTML = `<p class="empty-state">As fontes aparecerão após a próxima pergunta.</p>`;
}

function renderSources(sources) {
  sourcesList.innerHTML = "";
  if (!sources || !sources.length) {
    sourcesList.innerHTML = `<p class="empty-state">Nenhuma fonte encontrada.</p>`;
    return;
  }
  sources.forEach((src) => {
    const div = document.createElement("div");
    div.classList.add("source-item");
    const chunkLabel = src.chunk_id != null ? `chunk #${src.chunk_id}` : "";
    div.innerHTML = `
      <div class="source-header">
        <span class="source-file">${escapeHtml(src.source || "Fonte desconhecida")}</span>
        ${chunkLabel ? `<span class="source-chunk">${escapeHtml(chunkLabel)}</span>` : ""}
      </div>
      <p>${escapeHtml(src.content || "Sem trecho disponível.")}</p>
    `;
    sourcesList.appendChild(div);
  });
}

function scrollMessagesToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(text) {
  const t = document.createElement("div");
  t.textContent = text;
  return t.innerHTML;
}

console.log("upload-archive.js carregado com sucesso");

// 🔹 Seletores
const dz = document.getElementById('dropzone');
const input = document.getElementById('fileInput');
const dzDefault = document.getElementById('dzDefault');
const dzConfirm = document.getElementById('dzConfirm');
const dzFilename = document.getElementById('dzFilename');
const btnSend = document.getElementById('btnSend');
const btnChange = document.getElementById('btnChange');

// 🔹 Estado interno
const state = { file: null };

// 🔹 Utilitário para exibir tamanho do arquivo
const bytes = (n) => {
  const units = ['B', 'KB', 'MB', 'GB']; let i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(i ? 1 : 0)} ${units[i]}`;
};

// 🔹 Mostra o nome do arquivo
function showConfirm(file) {
  state.file = file;
  dzFilename.textContent = `Arquivo selecionado: ${file.name} • ${bytes(file.size)}`;
  dz.classList.add('is-ready');
  dzDefault.classList.add('hidden');
  dzConfirm.classList.remove('hidden');
}

// 🔹 Reseta o estado
function resetDropzone() {
  state.file = null;
  input.value = '';
  dz.classList.remove('is-ready');
  dzConfirm.classList.add('hidden');
  dzDefault.classList.remove('hidden');
}

// 🔹 Drag & Drop
const enter = (e) => { e.preventDefault(); dz.classList.add('is-dragover'); };
const leave = (e) => { e.preventDefault(); dz.classList.remove('is-dragover'); };
['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, enter));
['dragleave', 'dragend', 'drop'].forEach(ev => dz.addEventListener(ev, leave));

dz.addEventListener('drop', (e) => {
  e.preventDefault();
  handleFiles(e.dataTransfer?.files);
});

// 🔹 Click e teclado
dz.addEventListener('click', () => {
  if (!dz.classList.contains('is-ready')) input.click();
});
dz.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && !dz.classList.contains('is-ready')) {
    e.preventDefault(); input.click();
  }
});

// 🔹 Arquivo selecionado
input.addEventListener('change', (e) => handleFiles(e.target.files));

function handleFiles(list) {
  const [file] = list || [];
  if (!file) return;
  showConfirm(file);
}

// 🔹 Botão “Escolher outro”
btnChange.addEventListener('click', () => {
  console.log("Botão Escolher outro clicado");
  resetDropzone();
});

// 🔹 Botão “Enviar”
btnSend.addEventListener('click', async () => {
  console.log("Botão Enviar clicado");

  if (!state.file) {
    alert("Por favor, selecione um arquivo antes de enviar.");
    return;
  }

  // 🔐 Recupera o token
  const token = localStorage.getItem("token");
  console.log("Token atual:", token);

  if (!token) {
    alert("Por favor, faça login antes de enviar exames.");
    window.location.href = "login.html";
    return;
  }

  const formData = new FormData();
  formData.append("file", state.file);

  btnSend.disabled = true;
  btnSend.textContent = "Enviando...";

  try {
    const res = await fetch("https://dannie-polypetalous-whirlingly.ngrok-free.dev/exams/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // JWT do login
      },
      body: formData,
    });

    console.log("Resposta do servidor:", res.status);

    if (res.status === 401) {
      alert("Sessão expirada. Faça login novamente.");
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) {
      alert("❌ Falha ao enviar o arquivo.");
      return;
    }

    const data = await res.json();
    alert(`✅ ${data.mensagem}\nResultado: ${data.analise.resultado.mensagem}`);
    resetDropzone();

  } catch (err) {
    console.error("Erro no upload:", err);
    alert("Erro de conexão com o servidor.");
  } finally {
    btnSend.disabled = false;
    btnSend.textContent = "Enviar";
  }
});
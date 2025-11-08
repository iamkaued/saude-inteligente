// --- Exibe / Oculta senha ---
const btn = document.querySelector('.toggle-pass');
const input = document.getElementById('password');
const eye = btn?.querySelector('.eye');

btn?.addEventListener('click', () => {
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  btn.setAttribute('aria-pressed', String(isPassword));
  btn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');

  eye.innerHTML = isPassword
    ? '<path fill="currentColor" d="M12 5c-5 0-9 4.5-9 7s4 7 9 7 9-4.5 9-7-4-7-9-7Zm0 11a4 4 0 1 1 .001-8.001A4 4 0 0 1 12 16Z"/>'
    : '<path fill="currentColor" d="M3 12c0 2.5 4 7 9 7 1.7 0 3.3-.5 4.7-1.3l1.6 1.6 1.4-1.4-16-16-1.4 1.4 2.5 2.5C3.6 8.4 3 10 3 12Zm6.6-2 4.4 4.4A4 4 0 0 0 9.6 10Z"/>';
});

// --- Login ---
const form = document.getElementById("loginForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("https://dannie-polypetalous-whirlingly.ngrok-free.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("❌ Falha no login. Verifique suas credenciais.");
        return;
      }

      const data = await res.json();
      console.log("🔑 Resposta do backend:", data);

      // 🔹 Detecta automaticamente o nome do campo do token
      const token = data.access_token || data.token || data.Authorization || null;

      if (!token) {
        alert("⚠️ Nenhum token recebido do servidor.");
        console.error("Resposta de login não contém token:", data);
        return;
      }

      // 🔐 Armazena token no localStorage
      localStorage.setItem("token", token);
      console.log("✅ Token salvo no localStorage:", token);

      alert("✅ Login bem-sucedido! Redirecionando...");
      window.location.href = "upload-archive.html";

    } catch (err) {
      console.error("Erro no login:", err);
      alert("Erro de conexão com o servidor.");
    }
  });
}
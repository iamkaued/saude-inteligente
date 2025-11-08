document.querySelector('.eye')?.addEventListener('click', function () {
  const input = document.getElementById('password');
  const isPwd = input.type === 'password';
  input.type = isPwd ? 'text' : 'password';
  this.setAttribute('aria-label', isPwd ? 'Ocultar senha' : 'Mostrar senha');
  this.title = isPwd ? 'Ocultar senha' : 'Mostrar senha';
});

const form = document.getElementById("signupForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("https://dannie-polypetalous-whirlingly.ngrok-free.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("❌ Erro ao registrar. Usuário já existe ou dados inválidos.");
        return;
      }

      alert("✅ Registro concluído! Você será redirecionado para o login...");
      
      // 🔁 redirecionamento garantido com delay
      setTimeout(() => {
        console.log("Redirecionando para login.html...");
        window.location.href = "login.html";
      }, 1200);
      
    } catch (err) {
      console.error("Erro no registro:", err);
      alert("Erro de conexão com o servidor.");
    }
  });
}
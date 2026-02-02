document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  if (!form) return;

  const setMsg = (text, ok = false) => {
    if (!msg) return;
    msg.textContent = text || "";
    msg.classList.toggle("text-danger", !ok);
    msg.classList.toggle("text-success", ok);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setMsg("Logging in...");

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    fetchMethod(currentUrl + "/api/auth/login", (status, res) => {
      if (status === 200 && res.token) {
        CE_AUTH.setToken(res.token);

        if (res.user) CE_AUTH.setUser(res.user);

        setMsg("Login successful!", true);

        window.location.href = "challenges.html";
      } else {
        setMsg(res.message || "Login failed.", false);
      }
    }, "POST", { email, password });
  });
});

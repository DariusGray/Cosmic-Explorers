document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const msg = document.getElementById("registerMsg");

  if (!form) return;

  const setMsg = (text, ok = false) => {
    if (!msg) return;
    msg.textContent = text || "";
    msg.classList.toggle("text-danger", !ok);
    msg.classList.toggle("text-success", ok);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;

    if (password !== confirmPassword) {
      setMsg("Passwords do not match.", false);
      return;
    }

    setMsg("Registering...");

    fetchMethod(currentUrl + "/api/auth/register", (status, res) => {
      if ((status === 200 || status === 201) && res.token) {
        CE_AUTH.setToken(res.token);

        // after backend fix, register will also return user
        if (res.user) CE_AUTH.setUser(res.user);

        setMsg("Registration successful!", true);
        window.location.href = "challenges.html";
      } else {
        setMsg(res.message || "Registration failed.", false);
      }
    }, "POST", { username, email, password });
  });
});

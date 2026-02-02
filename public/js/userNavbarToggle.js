document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginButton");
  const registerBtn = document.getElementById("registerButton");
  const profileBtn = document.getElementById("profileButton");
  const logoutBtn = document.getElementById("logoutButton");

  const greeting = document.getElementById("navGreeting");
  const navUsername = document.getElementById("navUsername");

  function show(el) { el && el.classList.remove("d-none"); }
  function hide(el) { el && el.classList.add("d-none"); }

  function getDisplayName(user) {
    if (!user) return "Explorer";
    return user.username || user.email || "Explorer";
  }

  function renderNav() {
    const user = window.CE_AUTH?.getUser?.() || null;
    const token = window.CE_AUTH?.getToken?.() || null;
    const isAuthed = !!(user && token);

    if (isAuthed) {
      hide(loginBtn);
      hide(registerBtn);
      show(profileBtn);
      show(logoutBtn);

      if (greeting && navUsername) {
        navUsername.textContent = getDisplayName(user);
        show(greeting);
      }
    } else {
      show(loginBtn);
      show(registerBtn);
      hide(profileBtn);
      hide(logoutBtn);
      hide(greeting);
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.CE_AUTH?.clear?.();
      renderNav();
      window.location.href = "login.html";
    });
  }

  renderNav();
});

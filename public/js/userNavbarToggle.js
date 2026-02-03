document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");

  const greeting = document.getElementById("navGreeting");
  const navUsername = document.getElementById("navUsername");

  function showElement(element) {
    if (element) {
      element.classList.remove("d-none");
    }
  }

  function hideElement(element) {
    if (element) {
      element.classList.add("d-none");
    }
  }

  function getStoredToken() {
    if (window.CE_AUTH && window.CE_AUTH.getToken) {
      return window.CE_AUTH.getToken();
    }
    return localStorage.getItem("token");
  }

  function getStoredUser() {
    if (window.CE_AUTH && window.CE_AUTH.getUser) {
      return window.CE_AUTH.getUser();
    }
    return null;
  }

  function renderNavbar() {
    const token = getStoredToken();
    const user = getStoredUser();

    if (token) {
      hideElement(loginButton);
      hideElement(registerButton);
      showElement(profileButton);
      showElement(logoutButton);

      if (greeting && navUsername && user) {
        navUsername.innerText = user.username || user.email || "Explorer";
        showElement(greeting);
      }
    } else {
      showElement(loginButton);
      showElement(registerButton);
      hideElement(profileButton);
      hideElement(logoutButton);
      hideElement(greeting);
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
      event.preventDefault();

      if (window.CE_AUTH && window.CE_AUTH.clear) {
        window.CE_AUTH.clear();
      }

      localStorage.removeItem("token");
      localStorage.removeItem("CE_CURRENT_THEME");

      renderNavbar();
      window.location.href = "login.html";
    });
  }

  renderNavbar();
});

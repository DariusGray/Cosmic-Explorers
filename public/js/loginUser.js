document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");

  if (loginForm == null) {
    return;
  }

  function setMessage(message, isSuccess) {
    if (loginMsg == null) {
      return;
    }

    loginMsg.innerText = message || "";

    if (isSuccess) {
      loginMsg.classList.remove("text-danger");
      loginMsg.classList.add("text-success");
    } else {
      loginMsg.classList.remove("text-success");
      loginMsg.classList.add("text-danger");
    }
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    setMessage("Logging in...", false);

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    const data = {
      email: email,
      password: password,
    };

    const callback = function (responseStatus, responseData) {
      if (responseStatus == 200 && responseData.token) {
        if (window.CE_AUTH && window.CE_AUTH.setToken) {
          window.CE_AUTH.setToken(responseData.token);
        }

        if (responseData.user && window.CE_AUTH && window.CE_AUTH.setUser) {
          window.CE_AUTH.setUser(responseData.user);
        }

        setMessage("Login successful!", true);
        window.location.href = "challenges.html";
      } else {
        setMessage(responseData.message || "Login failed.", false);
      }
    };

    fetchMethod(currentUrl + "/api/auth/login", callback, "POST", data);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const registerMsg = document.getElementById("registerMsg");

  if (registerForm == null) {
    return;
  }

  function setMessage(message, isSuccess) {
    if (registerMsg == null) {
      return;
    }

    registerMsg.innerText = message || "";

    if (isSuccess) {
      registerMsg.classList.remove("text-danger");
      registerMsg.classList.add("text-success");
    } else {
      registerMsg.classList.remove("text-success");
      registerMsg.classList.add("text-danger");
    }
  }

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const username = usernameInput ? usernameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.", false);
      return;
    }

    setMessage("Registering...", false);

    const data = {
      username: username,
      email: email,
      password: password,
    };

    const callback = function (responseStatus, responseData) {
      if ((responseStatus == 200 || responseStatus == 201) && responseData.token) {
        if (window.CE_AUTH && window.CE_AUTH.setToken) {
          window.CE_AUTH.setToken(responseData.token);
        }

        if (responseData.user && window.CE_AUTH && window.CE_AUTH.setUser) {
          window.CE_AUTH.setUser(responseData.user);
        }

        setMessage("Registration successful!", true);
        window.location.href = "challenges.html";
      } else {
        setMessage(responseData.message || "Registration failed.", false);
      }
    };

    fetchMethod(currentUrl + "/api/auth/register", callback, "POST", data);
  });
});

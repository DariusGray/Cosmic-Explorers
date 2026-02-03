//////////////////////////////////////////////////////
// AUTH HELPERS (FRONTEND)
// Stores token + user in localStorage
//////////////////////////////////////////////////////

const CE_AUTH = {
  //////////////////////////////////////////////////////
  // TOKEN
  //////////////////////////////////////////////////////
  getToken: function () {
    return localStorage.getItem("token");
  },

  setToken: function (token) {
    localStorage.setItem("token", token);
  },

  //////////////////////////////////////////////////////
  // USER
  //////////////////////////////////////////////////////
  setUser: function (user) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser: function () {
    const raw = localStorage.getItem("user");

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("CE_AUTH.getUser JSON parse error:", error);
      return null;
    }
  },

  //////////////////////////////////////////////////////
  // CLEAR AUTH
  //////////////////////////////////////////////////////
  clear: function () {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  //////////////////////////////////////////////////////
  // REQUIRE USER (redirect if not logged in)
  //////////////////////////////////////////////////////
  requireUser: function () {
  const token = this.getToken();
  const user = this.getUser();

  if (!token || !user) {
    this.clear();
    window.location.href = "login.html";
    return null;
  }

  return user;
}

};

window.CE_AUTH = CE_AUTH;

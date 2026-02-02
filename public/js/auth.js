
const CE_AUTH = {
  getToken() {
    return localStorage.getItem("token");
  },
  setToken(token) {
    localStorage.setItem("token", token);
  },
  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  },
  requireUser() {
    const u = this.getUser();
    if (!u) window.location.href = "login.html";
    return u;
  }
};

window.CE_AUTH = CE_AUTH;

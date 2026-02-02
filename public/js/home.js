// public/js/home.js
document.addEventListener("DOMContentLoaded", () => {
  const hint = document.getElementById("homeAuthHint");
  const elUser = document.getElementById("homeUsername");
  const elPoints = document.getElementById("homePoints");
  const alertBox = document.getElementById("homeAlert");

  function show(el) { el && el.classList.remove("d-none"); }
  function hide(el) { el && el.classList.add("d-none"); }

  function setText(el, value) {
    if (!el) return;
    el.textContent = value ?? "—";
  }

  function showAlert(msg) {
    if (!alertBox) return;
    alertBox.textContent = msg || "Something went wrong.";
    show(alertBox);
  }

  function clearAlert() {
    if (!alertBox) return;
    alertBox.textContent = "";
    hide(alertBox);
  }

  // If not logged in, keep it simple (no redirect on home page)
  const user = window.CE_AUTH?.getUser?.() || null;
  const token = window.CE_AUTH?.getToken?.() || null;
  const isAuthed = !!(user && token);

  if (!isAuthed) {
    hide(hint);
    return;
  }

  // Show basic info immediately
  show(hint);
  setText(elUser, user.username || user.email || "Explorer");
  setText(elPoints, "--");
  clearAlert();

  const userId = user.user_id || user.userId || user.id;
  if (!userId) {
    showAlert("Missing user id. Please log in again.");
    return;
  }

  // Build API base (consistent with your other pages)
  const base = window.currentUrl ? `${window.currentUrl}/api` : "/api";
  const url = `${base}/users/${userId}`;

  // Fetch latest points from server (source of truth)
  fetchMethod(url, (status, data) => {
    if (status !== 200) {
      console.warn("Home points fetch failed:", status, data);
      showAlert(data?.message || "Could not load your points. Is the backend running?");
      return;
    }

    const u = data.user || data;
    setText(elPoints, u.points ?? "0");
  }, "GET", null, token);
});

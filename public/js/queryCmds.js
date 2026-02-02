
function fetchMethod(url, callback, method = "GET", data = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  fetch(url, options)
    .then(async (res) => {
      let payload = {};
      try { payload = await res.json(); } catch (_) {}
      callback(res.status, payload);
    })
    .catch((err) => {
      console.error("fetch error:", err);
      callback(0, { message: "Network error. Is backend running?" });
    });
}

window.fetchMethod = fetchMethod;

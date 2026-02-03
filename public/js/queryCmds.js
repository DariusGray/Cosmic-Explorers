//////////////////////////////
// GENERIC FETCH METHOD 
//////////////////////////////
function fetchMethod(url, callback, method = "GET", data = null, token = null) {
  console.log("fetchMethod:", url, method, data, token);

  const headers = {};

  // Only set JSON header if we are sending data
  if (data !== null) {
    headers["Content-Type"] = "application/json";
  }

  // Add JWT token if provided
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const options = {
    method: method.toUpperCase(),
    headers: headers,
  };

  // Only attach body when NOT GET and data exists
  if (options.method !== "GET" && data !== null) {
    options.body = JSON.stringify(data);
  }

  fetch(url, options)
    .then((response) => {
      // 204 No Content
      if (response.status === 204) {
        callback(response.status, {});
        return;
      }

      // Try parse JSON, but don't crash if response is empty / not JSON
      response
        .json()
        .then((responseData) => callback(response.status, responseData))
        .catch(() => callback(response.status, {}));
    })
    .catch((error) => {
      console.error(`Error from ${method} ${url}:`, error);
      callback(0, { message: "Network error. Is backend running?" });
    });
}

window.fetchMethod = fetchMethod;

const currentUrl = window.location.protocol + "//" + window.location.host;
console.log("currentUrl:", currentUrl);

// Make available globally
window.currentUrl = currentUrl;

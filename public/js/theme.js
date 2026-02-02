// public/js/theme.js

const THEME_KEY = "CE_CURRENT_THEME";

function prettifyThemeName(theme) {
  return theme
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function applyTheme(themeName) {
  const theme = themeName || "neptune-observatory";
  document.body.dataset.theme = theme;

  // Works for pages that have these labels
  const label =
    document.getElementById("currentThemeLabel") ||
    document.getElementById("homeThemeLabel");

  if (label) label.textContent = prettifyThemeName(theme);
}

function getSavedTheme() {
  return localStorage.getItem(THEME_KEY);
}

function saveTheme(themeName) {
  localStorage.setItem(THEME_KEY, themeName);
}

window.CE_THEME = {
  applyTheme,
  saveTheme,
  getSavedTheme,
  prettifyThemeName, // optional export, harmless
};

// Apply saved theme immediately on every page load
applyTheme(getSavedTheme());

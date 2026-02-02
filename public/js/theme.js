const THEME_KEY = "CE_CURRENT_THEME";
const DEFAULT_THEME = "mercury-outpost";

function prettifyThemeName(theme) {
  return theme
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function applyTheme(themeName) {
  const theme = themeName || DEFAULT_THEME;
  document.body.dataset.theme = theme;

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

function applyInitialTheme() {
  const savedTheme = getSavedTheme();

  // Case 1: saved theme exists (user already unlocked something)
  if (savedTheme) {
    applyTheme(savedTheme);
    return;
  }

  // Case 2: no saved theme → check user
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  // No user OR user has 0 points
  if (!user || Number(user.points || 0) === 0) {
    applyTheme(DEFAULT_THEME);
    return;
  }

  // Fallback safety
  applyTheme(DEFAULT_THEME);
}

window.CE_THEME = {
  applyTheme,
  saveTheme,
  getSavedTheme,
  prettifyThemeName,
};

applyInitialTheme();

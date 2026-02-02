// js/profile.js
document.addEventListener("DOMContentLoaded", () => {
  // Must be logged in
  const user = window.CE_AUTH?.requireUser?.();
  if (!user) return;

  const token = window.CE_AUTH?.getToken?.();
  const userId = user.user_id || user.userId || user.id; // support common shapes

  // DOM
  const elUsername = document.getElementById("profileUsername");
  const elEmail = document.getElementById("profileEmail");
  const elPoints = document.getElementById("profilePoints");
  const elLatestPlanet = document.getElementById("latestPlanetLabel");
  const unlockedContainer = document.getElementById("unlockedPlanetsContainer");
  const themeTpl = document.getElementById("themeCardTemplate");

  // Base URL helper (works with your getCurrentURL.js if it sets currentUrl)
  function api(path) {
    const base = window.currentUrl ? `${window.currentUrl}/api` : "/api";
    return `${base}${path}`;
  }

  function setText(el, value) {
    if (!el) return;
    el.textContent = value ?? "—";
  }

  function getPlanetTitleFromCSS() {
    // cosmic.css defines --planet-title; body[data-theme="..."] overrides it
    const title = getComputedStyle(document.body).getPropertyValue("--planet-title").trim();
    // If it's quoted like "Deep Space", remove quotes
    return title.replace(/^["']|["']$/g, "") || "—";
  }

  function refreshLatestDiscoveryLabel() {
  const theme = window.CE_THEME?.getSavedTheme?.() || document.body.dataset.theme || "—";
  const pretty = window.CE_THEME?.prettifyThemeName
    ? window.CE_THEME.prettifyThemeName(theme)
    : theme;

  setText(elLatestPlanet, pretty);
}



  // Apply theme (keep compatible with theme.js by also writing localStorage)
  function applyTheme(themeKey) {
  if (!themeKey) return;

  window.CE_THEME?.saveTheme?.(themeKey);
  window.CE_THEME?.applyTheme?.(themeKey);

  refreshLatestDiscoveryLabel();
}


  // 1) Load user profile (source of truth for points)
  function loadProfile() {
    if (!userId) {
      console.warn("No userId found in stored user object:", user);
      return;
    }

    fetchMethod(api(`/users/${userId}`), (status, data) => {
      if (status !== 200) {
        console.warn("Failed to load profile:", status, data);
        return;
      }

      // Backend might return {user: {...}} or just the object
      const u = data.user || data;

      setText(elUsername, u.username || user.username || "Explorer");
      setText(elEmail, u.email || user.email || "—");
      setText(elPoints, u.points ?? "0");
    }, "GET", null, token);
  }

  // 2) Load unlocked planets/themes and render cards
  function loadUnlockedThemes() {
    if (!userId || !unlockedContainer || !themeTpl) return;

    fetchMethod(api(`/users/${userId}/planets`), (status, data) => {
      if (status !== 200) {
        console.warn("Failed to load unlocked planets:", status, data);
        // Keep the existing hint UI
        return;
      }

      // Expecting: array, or {planets: array}
      const planets = Array.isArray(data) ? data : (data.planets || []);

      // Clear container
      unlockedContainer.innerHTML = "";

      if (!planets.length) {
        unlockedContainer.innerHTML = `
          <div class="col-12">
            <div class="theme-hint p-4 text-center">
              <div class="opacity-75">Your themes will appear here.</div>
              <div class="small opacity-50">Unlock planets to gain new visual themes.</div>
            </div>
          </div>
        `;
        return;
      }

      planets.forEach((p) => {
        const node = themeTpl.content.cloneNode(true);

        // Find fields inside the template
        const nameEl = node.querySelector(".themeName");

        // Planet name field possibilities (depends on your backend)
        const displayName =
          p.planet_name || p.name || p.theme_name || p.theme || p.planet || "Planet Theme";

        if (nameEl) nameEl.textContent = displayName;

        // Determine theme key used in cosmic.css: body[data-theme="..."]
        // Use the most likely property; fallback to a slug of the name.
        const themeKey =
          p.theme_key ||
          p.themeKey ||
          p.theme_id ||
          p.themeId ||
          p.slug ||
          (typeof displayName === "string"
            ? displayName.toLowerCase().replace(/\s+/g, "-")
            : null);

        const card = node.querySelector(".planet-card");
        if (card) {
          card.addEventListener("click", () => {
            applyTheme(themeKey);
          });
        }

        unlockedContainer.appendChild(node);
      });
    }, "GET", null, token);
  }

  // Initial render
  refreshLatestDiscoveryLabel();
  loadProfile();
  loadUnlockedThemes();
});

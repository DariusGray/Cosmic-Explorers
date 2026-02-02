// public/js/planets.js

// ---------------------------
// UI helpers
// ---------------------------
function showShipLanded() {
  const alert = document.getElementById("shipLandedAlert");
  if (!alert) return;

  alert.classList.remove("d-none");

  if (showShipLanded._t) clearTimeout(showShipLanded._t);
  showShipLanded._t = setTimeout(() => alert.classList.add("d-none"), 2000);
}

function setUnlockButtonLoading(isLoading) {
  const btn = document.getElementById("unlockBtn");
  if (!btn) return;
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "Unlocking..." : "Unlock New Horizons";
}

function showHint(gridEl, title, subtitle) {
  if (!gridEl) return;
  gridEl.innerHTML = `
    <div class="col-12">
      <div class="theme-hint p-4 text-center">
        <div class="opacity-75">${title}</div>
        <div class="small opacity-50">${subtitle || ""}</div>
      </div>
    </div>
  `;
}

// ---------------------------
// Data helpers
// ---------------------------
function getPlanetThemeKey(planetName) {
  // Map DB planet "name" -> CSS theme keys you already defined in cosmic.css
  // Adjust only if your DB planet names differ.
  const n = (planetName || "").trim().toLowerCase();

  if (n.includes("mercury")) return "mercury-outpost";
  if (n.includes("asteroid")) return "asteroid-relay";
  if (n.includes("neptune")) return "neptune-observatory";
  if (n.includes("jupiter")) return "jupiter-station";
  if (n.includes("golden")) return "golden-planet";

  // fallback: convert "Neptune Observatory" => "neptune-observatory"
  return (planetName || "neptune-observatory")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function getPlanetIcon(planetName) {
  const n = (planetName || "").toLowerCase();
  if (n.includes("mercury")) return "☿️";
  if (n.includes("asteroid")) return "🛰️";
  if (n.includes("neptune")) return "🌊";
  if (n.includes("jupiter")) return "🌩️";
  if (n.includes("golden")) return "🌟";
  return "🪐";
}

function indexByPlanetId(rows) {
  const map = new Map();
  (rows || []).forEach((r) => map.set(Number(r.planet_id), r));
  return map;
}

// ---------------------------
// Render
// ---------------------------
function renderPlanets({ allPlanets, unlockedPlanets }) {
  const unlockedGrid = document.getElementById("unlockedPlanetsGrid");
  const lockedGrid = document.getElementById("lockedPlanetsGrid");
  const tpl = document.getElementById("planetCardTemplate");

  if (!unlockedGrid || !lockedGrid || !tpl) return;

  const unlockedMap = indexByPlanetId(unlockedPlanets);
  const unlocked = [];
  const locked = [];

  (allPlanets || []).forEach((p) => {
    const id = Number(p.planet_id);
    if (unlockedMap.has(id)) unlocked.push(p);
    else locked.push(p);
  });

  unlockedGrid.innerHTML = "";
  lockedGrid.innerHTML = "";

  if (unlocked.length === 0) {
    showHint(
      unlockedGrid,
      "Your unlocked planets will appear here.",
      "Complete missions to earn points and unlock new worlds."
    );
  } else {
    unlocked.forEach((p) => {
      const node = tpl.content.cloneNode(true);
      const card = node.querySelector(".planet-card");
      const icon = node.querySelector(".planet-icon");
      const name = node.querySelector(".planet-name");
      const req = node.querySelector(".planet-requirement");
      const status = node.querySelector(".planet-status");
      const landBtn = node.querySelector(".land-btn");

      const themeKey = getPlanetThemeKey(p.name);

      card.dataset.themeKey = themeKey;
      card.classList.remove("is-locked");

      icon.textContent = getPlanetIcon(p.name);
      name.textContent = p.name;
      req.textContent = `Requires: ${p.unlock_points} pts`;

      status.textContent = "Unlocked";
      status.classList.add("bg-success");

      landBtn.classList.remove("d-none");
      landBtn.dataset.theme = themeKey;

      unlockedGrid.appendChild(node);
    });
  }

  if (locked.length === 0) {
    showHint(lockedGrid, "No locked planets right now.", "You’ve unlocked everything available!");
  } else {
    locked.forEach((p) => {
      const node = tpl.content.cloneNode(true);
      const card = node.querySelector(".planet-card");
      const icon = node.querySelector(".planet-icon");
      const name = node.querySelector(".planet-name");
      const req = node.querySelector(".planet-requirement");
      const status = node.querySelector(".planet-status");
      const landBtn = node.querySelector(".land-btn");

      const themeKey = getPlanetThemeKey(p.name);

      card.dataset.themeKey = themeKey;
      card.classList.add("is-locked");

      icon.textContent = getPlanetIcon(p.name);
      name.textContent = p.name;
      req.textContent = `Requires: ${p.unlock_points} pts`;

      status.textContent = "Locked";
      status.classList.add("bg-secondary");

      landBtn.classList.add("d-none");

      lockedGrid.appendChild(node);
    });
  }
}

// ---------------------------
// API calls (using your fetchMethod wrapper)
// ---------------------------
function apiGetAllPlanets() {
  return new Promise((resolve, reject) => {
    fetchMethod("/api/planets", (status, data) => {
      if (status === 200) resolve(data);
      else reject({ status, data });
    });
  });
}

function apiGetUnlockedPlanets(userId, token) {
  return new Promise((resolve, reject) => {
    fetchMethod(`/api/users/${userId}/planets`, (status, data) => {
      if (status === 200) resolve(data);
      else reject({ status, data });
    }, "GET", null, token);
  });
}

function apiUnlockPlanets(userId, token) {
  return new Promise((resolve, reject) => {
    fetchMethod(`/api/users/${userId}/planets/unlock`, (status, data) => {
      if (status === 200) resolve(data);
      else reject({ status, data });
    }, "POST", {}, token);
  });
}

// ---------------------------
// Page init
// ---------------------------
async function initPlanetsPage() {
  // Require login
  const user = window.CE_AUTH.requireUser();
  const token = window.CE_AUTH.getToken();

  try {
    const [allPlanets, unlockedPlanets] = await Promise.all([
      apiGetAllPlanets(),
      apiGetUnlockedPlanets(user.user_id, token),
    ]);

    renderPlanets({ allPlanets, unlockedPlanets });
  } catch (err) {
    console.error("Planets init error:", err);
    const unlockedGrid = document.getElementById("unlockedPlanetsGrid");
    const lockedGrid = document.getElementById("lockedPlanetsGrid");
    showHint(unlockedGrid, "Failed to load planets.", err?.data?.message || "Try again.");
    showHint(lockedGrid, "Failed to load planets.", err?.data?.message || "Try again.");
  }
}

// ---------------------------
// Unlock button handler
// ---------------------------
async function handleUnlockClick() {
  const user = window.CE_AUTH.requireUser();
  const token = window.CE_AUTH.getToken();

  setUnlockButtonLoading(true);

  try {
    const unlockRes = await apiUnlockPlanets(user.user_id, token);

    // Re-fetch unlocked planets to refresh UI accurately
    const [allPlanets, unlockedPlanets] = await Promise.all([
      apiGetAllPlanets(),
      apiGetUnlockedPlanets(user.user_id, token),
    ]);

    renderPlanets({ allPlanets, unlockedPlanets });

    // Optional: auto-apply latest discovered planet theme if backend provides it
    // (Only if it matches your CSS theme key mapping)
    if (unlockRes?.latest_discovered_planet) {
      const themeKey = getPlanetThemeKey(unlockRes.latest_discovered_planet);
      window.CE_THEME.saveTheme(themeKey);
      window.CE_THEME.applyTheme(themeKey);
      showShipLanded();
    }
  } catch (err) {
    console.error("Unlock error:", err);
    alert(err?.data?.message || "Unlock failed.");
  } finally {
    setUnlockButtonLoading(false);
  }
}

// ---------------------------
// Land button handler (your original)
// ---------------------------
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".land-btn");
  if (!btn) return;

  if (btn.classList.contains("d-none") || btn.disabled) return;

  const card = btn.closest(".planet-card");
  const isLocked = card?.classList.contains("is-locked");
  if (isLocked) return;

  const theme = btn.dataset.theme || card?.dataset.themeKey;
  if (!theme) return;

  window.CE_THEME.saveTheme(theme);
  window.CE_THEME.applyTheme(theme);
  showShipLanded();
});

// ---------------------------
// Wire up page events
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  initPlanetsPage();

  const unlockBtn = document.getElementById("unlockBtn");
  if (unlockBtn) unlockBtn.addEventListener("click", handleUnlockClick);
});

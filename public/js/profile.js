// public/js/profile.js
// Requires: getCurrentURL.js, queryCmds.js, auth.js

function showHint(el, text) {
  if (!el) return;
  el.innerHTML = `
    <div class="col-12">
      <div class="theme-hint p-4 text-center">
        <div class="opacity-75">${text}</div>
      </div>
    </div>
  `;
}

function getPlanetThemeKey(planetName) {
  const n = (planetName || "").trim().toLowerCase();
  if (n.includes("mercury")) return "mercury-outpost";
  if (n.includes("asteroid")) return "asteroid-relay";
  if (n.includes("neptune")) return "neptune-observatory";
  if (n.includes("jupiter")) return "jupiter-station";
  if (n.includes("golden")) return "golden-planet";
  return (planetName || "mercury-outpost").trim().toLowerCase().replace(/\s+/g, "-");
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

function apiGetUnlockedPlanets(userId, token) {
  return new Promise((resolve, reject) => {
    fetchMethod(
      `/api/users/${userId}/planets`,
      (status, data) => {
        if (status === 200) resolve(data);
        else reject({ status, data });
      },
      "GET",
      null,
      token
    );
  });
}

function renderAchievements(unlockedPlanets) {
  const grid = document.getElementById("achievementGrid");
  const tpl = document.getElementById("achievementCardTemplate");

  if (!grid) return;

  if (!unlockedPlanets || unlockedPlanets.length === 0) {
    showHint(grid, "No achievements yet. Complete missions to unlock planets.");
    return;
  }

  if (!tpl) {
    // fallback rendering without template
    grid.innerHTML = "";
    unlockedPlanets.forEach((p) => {
      const themeKey = getPlanetThemeKey(p.name);
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-4";
      col.innerHTML = `
        <div class="planet-card achievement-card" data-theme-key="${themeKey}">
          <div class="planet-icon">${getPlanetIcon(p.name)}</div>
          <div class="planet-name">${p.name}</div>
          <div class="planet-requirement small opacity-75">Unlocked at ${p.unlock_points} pts</div>
        </div>
      `;
      grid.appendChild(col);
    });
    return;
  }

  grid.innerHTML = "";
  unlockedPlanets.forEach((p) => {
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector(".achievement-card");
    const icon = node.querySelector(".planet-icon");
    const name = node.querySelector(".planet-name");
    const req = node.querySelector(".planet-requirement");

    const themeKey = getPlanetThemeKey(p.name);

    if (card) card.dataset.themeKey = themeKey;
    if (icon) icon.textContent = getPlanetIcon(p.name);
    if (name) name.textContent = p.name;
    if (req) req.textContent = `Unlocked at ${p.unlock_points} pts`;

    grid.appendChild(node);
  });
}

function updateLatestDiscovery(unlockedPlanets) {
  // Latest discovery = unlocked planet with highest unlock_points
  let latest = null;

  for (let i = 0; i < (unlockedPlanets || []).length; i++) {
    const p = unlockedPlanets[i];
    if (!latest) latest = p;
    else if (Number(p.unlock_points) > Number(latest.unlock_points)) latest = p;
  }

  const latestLabel = document.getElementById("latestDiscoveryLabel");
  if (!latestLabel) return;

  if (!latest) {
    latestLabel.textContent = "None yet";
    return;
  }

  latestLabel.textContent = latest.name;
}

async function initProfilePage() {
  const user = CE_AUTH.requireUser();
  const token = CE_AUTH.getToken();

  const userId = user.user_id ?? user.id ?? user.userId;
  document.getElementById("profileUsername").textContent = user.username ?? "Explorer";
  document.getElementById("profileEmail").textContent = user.email ?? "—";
  document.getElementById("profilePoints").textContent = user.points ?? 0;

  if (!userId || !token) return;

  try {
    const unlocked = await apiGetUnlockedPlanets(userId, token);
    const unlockedPlanets = Array.isArray(unlocked) ? unlocked : (unlocked.data || unlocked.results || []);

    renderAchievements(unlockedPlanets);

    // latest discovery from actual unlocked list
    updateLatestDiscovery(unlockedPlanets);
  } catch (err) {
    console.error("Profile achievements load failed:", err);
    const grid = document.getElementById("achievementGrid");
    showHint(grid, err?.data?.message || "Could not load achievements.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initProfilePage();

});

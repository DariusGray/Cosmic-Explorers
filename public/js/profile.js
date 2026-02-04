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

function apiGetCompletedMissions(userId, token) {
  return new Promise((resolve, reject) => {
    fetchMethod(
      `/api/users/${userId}/completions`,
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

function renderCompletedMissions(items) {
  const loading = document.getElementById("completedMissionsLoading");
  const empty = document.getElementById("completedMissionsEmpty");
  const listEl = document.getElementById("completedMissionsList");
  const tpl = document.getElementById("completedMissionItemTemplate");

  if (loading) loading.classList.add("d-none");
  if (!listEl) return;

  listEl.innerHTML = "";

  const arr = Array.isArray(items) ? items : [];

  if (arr.length === 0) {
    if (empty) empty.classList.remove("d-none");
    listEl.classList.add("d-none");
    return;
  }

  if (empty) empty.classList.add("d-none");
  listEl.classList.remove("d-none");

  arr.forEach((row) => {
    const title = row.challenge_description ?? "Mission";
    const note = row.details ?? "";
    const pts = row.challenge_points ?? 0;

    if (tpl) {
      const node = tpl.content.cloneNode(true);
      const t = node.querySelector(".mission-title");
      const n = node.querySelector(".mission-note");
      const p = node.querySelector(".mission-points");

      if (t) t.textContent = title;
      if (n) n.textContent = note ? `Note: ${note}` : "Note: —";
      if (p) p.textContent = `${pts} pts`;

      listEl.appendChild(node);
      return;
    }

    // fallback without template
    const li = document.createElement("li");
    li.className = "list-group-item bg-dark text-white border-secondary";
    li.innerHTML = `
      <div class="fw-bold">${title}</div>
      <div class="small opacity-75">Note: ${note || "—"}</div>
      <div class="small opacity-50 mt-1">+${pts} pts</div>
    `;
    listEl.appendChild(li);
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

  // Achievements
  try {
    const unlocked = await apiGetUnlockedPlanets(userId, token);
    const unlockedPlanets = Array.isArray(unlocked) ? unlocked : (unlocked.data || unlocked.results || []);
    renderAchievements(unlockedPlanets);
    updateLatestDiscovery(unlockedPlanets);
  } catch (err) {
    console.error("Profile achievements load failed:", err);
    const grid = document.getElementById("achievementGrid");
    showHint(grid, err?.data?.message || "Could not load achievements.");
  }

  // Completed missions log
  try {
    const completed = await apiGetCompletedMissions(userId, token);
    renderCompletedMissions(completed);
  } catch (err) {
    console.error("Profile missions load failed:", err);

    const loading = document.getElementById("completedMissionsLoading");
    const empty = document.getElementById("completedMissionsEmpty");
    const listEl = document.getElementById("completedMissionsList");

    if (loading) loading.classList.add("d-none");
    if (listEl) listEl.classList.add("d-none");
    if (empty) {
      empty.classList.remove("d-none");
      const msgEl = empty.querySelector(".opacity-75");
      if (msgEl) msgEl.textContent = err?.data?.message || "Could not load completed missions.";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initProfilePage();
});

document.addEventListener("DOMContentLoaded", () => {
  const body = document.getElementById("leaderboardBody");
  const template = document.getElementById("leaderboardRowTemplate");

  function renderEmpty(msg) {
    body.innerHTML = `
      <tr>
        <td colspan="3" class="py-4 text-center opacity-75">${msg}</td>
      </tr>
    `;
  }

  function applyRankClass(tr, rank) {
    tr.classList.remove("rank-1", "rank-2", "rank-3");
    if (rank === 1) tr.classList.add("rank-1");
    if (rank === 2) tr.classList.add("rank-2");
    if (rank === 3) tr.classList.add("rank-3");
  }

  function loadLeaderboard() {
    fetchMethod(currentUrl + "/api/leaderboard", (status, data) => {
      if (status !== 200) {
        renderEmpty(data.message || "Couldn’t load leaderboard.");
        return;
      }

      const list = Array.isArray(data) ? data : (data.data || data.results || []);
      if (!list.length) {
        renderEmpty("No rankings yet. Complete missions to appear here.");
        return;
      }

      body.innerHTML = "";

      const currentUser = CE_AUTH.getUser();
      const currentUserId = currentUser?.user_id ?? currentUser?.id ?? currentUser?.userId;

      list.forEach((u, idx) => {
        const rank = idx + 1;
        const node = template.content.cloneNode(true);

        const tr = node.querySelector("tr");
        const rankCell = node.querySelector(".rankCell");
        const nameText = node.querySelector(".nameText");
        const pointsCell = node.querySelector(".pointsCell");

        applyRankClass(tr, rank);

        const username = u.username ?? "Explorer";
        const points = Number(u.points ?? 0);

        if (rankCell) rankCell.textContent = `#${rank}`;
        if (nameText) nameText.textContent = username;
        if (pointsCell) pointsCell.textContent = points;

        if (currentUserId && Number(u.user_id) === Number(currentUserId)) {
          tr.style.outline = "2px solid var(--theme-accent)";
          tr.style.outlineOffset = "-2px";
        }

        body.appendChild(node);
      });
    }, "GET");
  }

  if (!body || !template) return;
  loadLeaderboard();
});

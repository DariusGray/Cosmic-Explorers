function setPointsUI(points) {
  const navWrap = document.getElementById("pointsBarNav");
  const nav = document.getElementById("currentPointsNav");

  if (navWrap) navWrap.classList.remove("d-none");
  if (nav) nav.textContent = points;
}

function incrementPointsLocal(delta) {
  const user = CE_AUTH.getUser();
  if (!user) return;

  const newPoints = (Number(user.points) || 0) + (Number(delta) || 0);
  const updated = { ...user, points: newPoints };
  CE_AUTH.setUser(updated);
  setPointsUI(newPoints);
}

// Source of truth: GET user
function refreshPointsFromServer() {
  const user = CE_AUTH.getUser();
  const token = CE_AUTH.getToken();
  if (!user || !token) return;

  fetchMethod(
    `/api/users/${user.user_id}`,
    (status, data) => {
      if (status === 200 && typeof data.points === "number") {
        const updated = { ...user, points: data.points };
        CE_AUTH.setUser(updated);
        setPointsUI(data.points);
      } else {
        console.warn("Could not refresh points", status, data);
      }
    },
    "GET",
    null,
    token
  );
}

document.addEventListener("DOMContentLoaded", () => {
  // Require login
  CE_AUTH.requireUser();
  refreshPointsFromServer();

  // ===== Elements =====
  const challengesContainer = document.getElementById("challengesContainer");
  const template = document.getElementById("challengeCardTemplate");

  const loadingEl = document.getElementById("challengesLoading");
  const emptyEl = document.getElementById("challengesEmpty");

  const pageAlert = document.getElementById("pageAlert");
  const completionAlert = document.getElementById("completionAlert");

  const openCreateBtn = document.getElementById("openCreateChallengeBtn");

  // Create mission modal
  const addChallengeModalEl = document.getElementById("addChallengeModal");
  const form = document.getElementById("challengeForm");
  const taskInput = document.getElementById("taskInput");
  const pointsInput = document.getElementById("pointsInput");
  const createAlert = document.getElementById("createChallengeAlert");

  // Complete mission modal
  const completeMissionModalEl = document.getElementById("completeMissionModal");
  const completeMissionForm = document.getElementById("completeMissionForm");
  const completeMissionComment = document.getElementById("completeMissionComment");
  const completeMissionAlert = document.getElementById("completeMissionAlert");
  const confirmCompleteBtn = document.getElementById("confirmCompleteBtn");

  // Edit mission modal
  const editChallengeModalEl = document.getElementById("editChallengeModal");
  const editChallengeForm = document.getElementById("editChallengeForm");
  const editChallengeId = document.getElementById("editChallengeId");
  const editTaskInput = document.getElementById("editTaskInput");
  const editPointsInput = document.getElementById("editPointsInput");
  const editChallengeAlert = document.getElementById("editChallengeAlert");

  // Attempts modal
  const attemptsModalEl = document.getElementById("attemptsModal");
  const attemptsList = document.getElementById("attemptsList");
  const attemptsAlert = document.getElementById("attemptsAlert");

  // ===== Helpers =====
  const show = (el) => el && el.classList.remove("d-none");
  const hide = (el) => el && el.classList.add("d-none");

  function setAlert(el, message, type = "warning") {
    if (!el) return;
    el.className = `alert alert-${type} ${type === "info" ? "text-info" : ""}`;
    el.textContent = message;
    show(el);
  }

  function clearAlert(el) {
    if (!el) return;
    el.textContent = "";
    hide(el);
  }

  function showCompletionToast() {
    if (!completionAlert) return;
    show(completionAlert);
    if (showCompletionToast._t) clearTimeout(showCompletionToast._t);
    showCompletionToast._t = setTimeout(() => hide(completionAlert), 2200);
  }

  function iconForPoints(points) {
    const p = Number(points) || 0;
    if (p >= 100) return "🚀";
    if (p >= 50) return "🛰️";
    if (p >= 20) return "🌟";
    return "📡";
  }

  function setLoadingState() {
    show(loadingEl);
    hide(emptyEl);
    hide(challengesContainer);
    challengesContainer.innerHTML = "";
    clearAlert(pageAlert);
  }

  function setEmptyState() {
    hide(loadingEl);
    show(emptyEl);
    hide(challengesContainer);
  }

  function setListState() {
    hide(loadingEl);
    hide(emptyEl);
    show(challengesContainer);
  }

  function getUserAndToken() {
    const user = window.CE_AUTH?.getUser?.() || null;
    const token = window.CE_AUTH?.getToken?.() || null;
    return { user, token };
  }

  function getCurrentUserId() {
    const user = window.CE_AUTH?.getUser?.() || null;
    if (!user) return null;
    return user.user_id ?? user.id ?? user.userId ?? null;
  }

  function hideModalSafely(modalEl) {
    if (!modalEl) return;
    try {
      const modal =
        window.bootstrap?.Modal?.getInstance(modalEl) ||
        new window.bootstrap.Modal(modalEl);
      modal.hide();
    } catch (_) {}
  }

  function showModalSafely(modalEl) {
    if (!modalEl) return;
    try {
      const modal =
        window.bootstrap?.Modal?.getInstance(modalEl) ||
        new window.bootstrap.Modal(modalEl);
      modal.show();
    } catch (_) {}
  }

  // ===== Render =====
  function renderChallenges(list) {
    challengesContainer.innerHTML = "";

    const currentUserId = getCurrentUserId();

    list.forEach((c) => {
      const node = template.content.cloneNode(true);

      const icon = node.querySelector(".challenge-icon");
      const desc = node.querySelector(".challenge-description");
      const pts = node.querySelector(".challenge-points");
      const status = node.querySelector(".challenge-status");

      const completeBtn = node.querySelector(".complete-btn");

      // New buttons
      const ownerActions = node.querySelector(".owner-actions");
      const editBtn = node.querySelector(".edit-btn");
      const deleteBtn = node.querySelector(".delete-btn");
      const attemptsBtn = node.querySelector(".view-attempts-btn");

      const id = c.challenge_id ?? c.id ?? c.challengeId ?? c.challengeID;
      const description = c.description ?? "";
      const points = c.points ?? 0;
      const creatorId = c.creator_id ?? c.creatorId ?? c.creatorID ?? null;

      if (icon) icon.textContent = iconForPoints(points);
      if (desc) desc.textContent = description;
      if (pts) pts.textContent = `Reward: ${points} Pts`;
      if (status) status.textContent = "";

      // Complete button dataset
      if (completeBtn) {
        completeBtn.dataset.challengeId = String(id ?? "");
        completeBtn.dataset.rewardPoints = String(points ?? 0);
      }

      // Owner-only actions
      const isOwner =
        currentUserId !== null &&
        creatorId !== null &&
        Number(currentUserId) === Number(creatorId);

      if (ownerActions) {
        if (isOwner) ownerActions.classList.remove("d-none");
        else ownerActions.classList.add("d-none");
      }

      if (editBtn) {
        editBtn.dataset.challengeId = String(id ?? "");
        editBtn.dataset.description = description;
        editBtn.dataset.points = String(points ?? 0);
      }

      if (deleteBtn) {
        deleteBtn.dataset.challengeId = String(id ?? "");
      }

      if (attemptsBtn) {
        attemptsBtn.dataset.challengeId = String(id ?? "");
      }

      // Disable complete if missing id
      if (!id && completeBtn) {
        completeBtn.disabled = true;
        if (status) status.textContent = "Unavailable right now";
      }

      challengesContainer.appendChild(node);
    });
  }

  // ===== Load Missions =====
  function loadChallenges() {
    setLoadingState();

    fetchMethod(
      "/api/challenges",
      (status, data) => {
        if (status === 200) {
          const list = Array.isArray(data) ? data : data.challenges || data.data || [];
          if (!list.length) {
            setEmptyState();
            return;
          }
          setListState();
          renderChallenges(list);
        } else {
          setEmptyState();
          setAlert(pageAlert, data.message || "Couldn’t load missions right now. Try again.", "warning");
        }
      },
      "GET"
    );
  }

  // ===== Create Mission =====
  function setupCreateMission() {
    const { user, token } = getUserAndToken();

    if (!user || !token) {
      if (openCreateBtn) openCreateBtn.classList.add("d-none");
      return;
    }

    if (openCreateBtn) openCreateBtn.classList.remove("d-none");

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAlert(createAlert);

      const description = (taskInput?.value || "").trim();
      const points = Number(pointsInput?.value);

      if (!description) {
        setAlert(createAlert, "Please enter a mission task.", "danger");
        return;
      }
      if (!Number.isFinite(points) || points <= 0) {
        setAlert(createAlert, "Please enter a valid point reward.", "danger");
        return;
      }

      const payload = {
        description,
        points,
        user_id: user.user_id ?? user.id ?? user.userId
      };

      fetchMethod(
        "/api/challenges",
        (status, res) => {
          if (status === 200 || status === 201) {
            hideModalSafely(addChallengeModalEl);
            form.reset();
            setAlert(pageAlert, "Mission created successfully.", "info");
            loadChallenges();
          } else {
            setAlert(createAlert, res.message || "Couldn’t create mission. Please try again.", "danger");
          }
        },
        "POST",
        payload,
        token
      );
    });
  }

  // ===== Complete Mission =====
  const pendingCompletion = {
    btn: null,
    challengeId: null,
    rewardPoints: 0,
  };

  function setupCompleteMission() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".complete-btn");
      if (!btn) return;

      const challengeId = btn.dataset.challengeId;
      if (!challengeId) return;

      const rewardPoints = Number(btn.dataset.rewardPoints || 0);

      const { user, token } = getUserAndToken();
      if (!user || !token) {
        setAlert(pageAlert, "Please log in to complete missions.", "warning");
        return;
      }

      pendingCompletion.btn = btn;
      pendingCompletion.challengeId = challengeId;
      pendingCompletion.rewardPoints = rewardPoints;

      clearAlert(completeMissionAlert);
      if (completeMissionComment) completeMissionComment.value = "";

      showModalSafely(completeMissionModalEl);
      setTimeout(() => completeMissionComment?.focus?.(), 150);
    });

    if (completeMissionForm) {
      completeMissionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        clearAlert(completeMissionAlert);

        const { user, token } = getUserAndToken();
        if (!user || !token) {
          setAlert(completeMissionAlert, "You need to be logged in.", "danger");
          return;
        }

        const challengeId = pendingCompletion.challengeId;
        if (!challengeId) {
          setAlert(completeMissionAlert, "No mission selected.", "danger");
          return;
        }

        const commentRaw = (completeMissionComment?.value || "").trim();
        const details = commentRaw || "Completed mission";

        const userId = user.user_id ?? user.id ?? user.userId;

        if (confirmCompleteBtn) {
          confirmCompleteBtn.disabled = true;
          confirmCompleteBtn.textContent = "Completing…";
        }

        const payload = { user_id: userId, details };

        fetchMethod(
          `/api/challenges/${encodeURIComponent(challengeId)}`,
          (status, res) => {
            const ok = status === 200 || status === 201;

            if (!ok) {
              if (confirmCompleteBtn) {
                confirmCompleteBtn.disabled = false;
                confirmCompleteBtn.textContent = "Submit & Complete";
              }
              setAlert(
                completeMissionAlert,
                res.message || "Couldn’t complete mission. Please try again.",
                "danger"
              );
              return;
            }

            hideModalSafely(completeMissionModalEl);
            if (confirmCompleteBtn) {
              confirmCompleteBtn.disabled = false;
              confirmCompleteBtn.textContent = "Submit & Complete";
            }

            // update button
            const btn = pendingCompletion.btn;
            if (btn) {
              btn.textContent = "Completed";
              btn.disabled = true;
            }

            // normal post-complete flow
            showCompletionToast();
            incrementPointsLocal(pendingCompletion.rewardPoints);
            refreshPointsFromServer();
            loadChallenges();

            // clear pending
            pendingCompletion.btn = null;
            pendingCompletion.challengeId = null;
            pendingCompletion.rewardPoints = 0;
          },
          "POST",
          payload,
          token
        );
      });
    }

    if (completeMissionModalEl) {
      completeMissionModalEl.addEventListener("hidden.bs.modal", () => {
        if (confirmCompleteBtn) {
          confirmCompleteBtn.disabled = false;
          confirmCompleteBtn.textContent = "Submit & Complete";
        }
        clearAlert(completeMissionAlert);
      });
    }
  }

  // ===== Edit Mission (Owner only) =====
  function setupEditMission() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".edit-btn");
      if (!btn) return;

      const { user, token } = getUserAndToken();
      if (!user || !token) {
        setAlert(pageAlert, "Please log in first.", "warning");
        return;
      }

      const id = btn.dataset.challengeId;
      if (!id) return;

      if (editChallengeId) editChallengeId.value = id;
      if (editTaskInput) editTaskInput.value = btn.dataset.description || "";
      if (editPointsInput) editPointsInput.value = btn.dataset.points || "1";

      clearAlert(editChallengeAlert);
      showModalSafely(editChallengeModalEl);
    });

    if (!editChallengeForm) return;

    editChallengeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAlert(editChallengeAlert);

      const { user, token } = getUserAndToken();
      if (!user || !token) {
        setAlert(editChallengeAlert, "You need to be logged in.", "danger");
        return;
      }

      const id = (editChallengeId?.value || "").trim();
      const description = (editTaskInput?.value || "").trim();
      const points = Number(editPointsInput?.value);

      if (!id) {
        setAlert(editChallengeAlert, "Missing mission id.", "danger");
        return;
      }
      if (!description) {
        setAlert(editChallengeAlert, "Please enter a mission task.", "danger");
        return;
      }
      if (!Number.isFinite(points) || points <= 0) {
        setAlert(editChallengeAlert, "Please enter a valid point reward.", "danger");
        return;
      }

      const userId = user.user_id ?? user.id ?? user.userId;
      const payload = { user_id: userId, description, points };

      fetchMethod(
        `/api/challenges/${encodeURIComponent(id)}`,
        (status, res) => {
          if (status === 200) {
            hideModalSafely(editChallengeModalEl);
            setAlert(pageAlert, "Mission updated successfully.", "info");
            loadChallenges();
          } else {
            setAlert(editChallengeAlert, res.message || "Couldn’t update mission.", "danger");
          }
        },
        "PUT",
        payload,
        token
      );
    });
  }

  // ===== Delete Mission (Owner only) =====
  function setupDeleteMission() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".delete-btn");
      if (!btn) return;

      const { user, token } = getUserAndToken();
      if (!user || !token) {
        setAlert(pageAlert, "Please log in first.", "warning");
        return;
      }

      const id = btn.dataset.challengeId;
      if (!id) return;

      const ok = confirm("Delete this mission? This cannot be undone.");
      if (!ok) return;

      const userId = user.user_id ?? user.id ?? user.userId;

      // Backend requires user_id in body because of requireSameUserBody
      const payload = { user_id: userId };

      fetchMethod(
        `/api/challenges/${encodeURIComponent(id)}`,
        (status, res) => {
          if (status === 204) {
            setAlert(pageAlert, "Mission deleted.", "info");
            loadChallenges();
          } else {
            setAlert(pageAlert, res.message || "Couldn’t delete mission.", "warning");
          }
        },
        "DELETE",
        payload,
        token
      );
    });
  }

  // ===== View Attempts (GET /api/challenges/:challenge_id) =====
  function setupViewAttempts() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".view-attempts-btn");
      if (!btn) return;

      const id = btn.dataset.challengeId;
      if (!id) return;

      if (attemptsList) attemptsList.innerHTML = "";
      if (attemptsAlert) {
        attemptsAlert.textContent = "";
        attemptsAlert.classList.add("d-none");
      }

      fetchMethod(
        `/api/challenges/${encodeURIComponent(id)}`,
        (status, data) => {
          if (status !== 200) {
            if (attemptsAlert) {
              attemptsAlert.textContent = data.message || "No attempts found.";
              attemptsAlert.classList.remove("d-none");
            }
            showModalSafely(attemptsModalEl);
            return;
          }

          const list = Array.isArray(data) ? data : [];
          if (!list.length) {
            if (attemptsAlert) {
              attemptsAlert.textContent = "No attempts found.";
              attemptsAlert.classList.remove("d-none");
            }
            showModalSafely(attemptsModalEl);
            return;
          }

          list.forEach((row) => {
            const li = document.createElement("li");
            li.className = "list-group-item bg-dark text-white border-secondary";
            const uid = row.user_id ?? row.userId ?? "";
            const details = row.details ?? "";
            li.textContent = `User ${uid}: ${details}`;
            attemptsList.appendChild(li);
          });

          showModalSafely(attemptsModalEl);
        },
        "GET"
      );
    });
  }

  // ===== Init =====
  setupCompleteMission();
  setupCreateMission();
  setupEditMission();
  setupDeleteMission();
  setupViewAttempts(); 
  loadChallenges();
});

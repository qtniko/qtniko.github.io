(() => {
  "use strict";

  const STORAGE_KEY = "molkky-scorekeeper-v2";
  const MIN_TEAMS = 2;
  const MAX_TEAMS = 10;

  const TEAM_STYLES = [
    { label: "Red", color: "#b72d2a", soft: "#fff1ef" },
    { label: "Blue", color: "#1768a6", soft: "#edf7ff" },
    { label: "Green", color: "#267a4a", soft: "#eef9f2" },
    { label: "Yellow", color: "#8a6500", soft: "#fff8dc" },
    { label: "Purple", color: "#7345a3", soft: "#f7f0ff" },
    { label: "Orange", color: "#a94f08", soft: "#fff2e8" },
    { label: "Pink", color: "#a73969", soft: "#fff0f6" },
    { label: "Cyan", color: "#087381", soft: "#ebfbfd" },
    { label: "Lime", color: "#54730c", soft: "#f4fadd" },
    { label: "Brown", color: "#76503b", soft: "#f7f0eb" }
  ];

  const app = document.getElementById("app");
  let selectedScore = null;
  let setupError = "";
  let state = loadState() || createInitialState();

  function createInitialState() {
    return {
      view: "teamCount",
      teamCount: 2,
      teams: [],
      round: 1,
      currentTeamIndex: 0,
      roundThrowIndex: 0,
      standingsPending: false,
      history: [],
      winnerId: null,
      selectedSetupTeamId: null,
      turnOverride: null,
      pendingTurnSnapshot: null
    };
  }

  function createTeams(count) {
    return Array.from({ length: count }, (_, index) => {
      const style = TEAM_STYLES[index];
      const teamId = makeId("team");
      return {
        id: teamId,
        name: `Team ${style.label}`,
        color: style.color,
        soft: style.soft,
        total: 0,
        currentPlayerIndex: 0,
        deferredPlayerQueue: [],
        guestId: `guest-${teamId}`,
        players: []
      };
    });
  }

  function makeId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object" || !saved.view) return null;
      return normalizeState(saved);
    } catch {
      return null;
    }
  }

  function normalizeState(saved) {
    saved.currentTeamIndex = Number.isInteger(saved.currentTeamIndex)
      ? saved.currentTeamIndex
      : 0;
    saved.roundThrowIndex = Number.isInteger(saved.roundThrowIndex)
      ? saved.roundThrowIndex
      : 0;
    saved.standingsPending = Boolean(saved.standingsPending);
    saved.turnOverride = saved.turnOverride && typeof saved.turnOverride === "object"
      ? saved.turnOverride
      : null;
    saved.pendingTurnSnapshot = saved.pendingTurnSnapshot && typeof saved.pendingTurnSnapshot === "object"
      ? saved.pendingTurnSnapshot
      : null;

    if (!Array.isArray(saved.history)) saved.history = [];
    saved.history.forEach((entry) => {
      entry.isGuest = Boolean(entry.isGuest);
      entry.contribution = Number.isFinite(entry.contribution)
        ? entry.contribution
        : (entry.exceededFifty ? -25 : Number(entry.score) || 0);
    });

    if (!Array.isArray(saved.teams)) saved.teams = [];
    saved.teams.forEach((team) => {
      team.currentPlayerIndex = Number.isInteger(team.currentPlayerIndex)
        ? team.currentPlayerIndex
        : 0;
      team.guestId = team.guestId || `guest-${team.id}`;
      team.deferredPlayerQueue = Array.isArray(team.deferredPlayerQueue)
        ? [...new Set(team.deferredPlayerQueue)]
        : [];
      if (!Array.isArray(team.players)) team.players = [];

      const validPlayerIds = new Set(team.players.map((player) => player.id));
      team.deferredPlayerQueue = team.deferredPlayerQueue.filter((playerId) => validPlayerIds.has(playerId));

      if (team.players.length) {
        team.currentPlayerIndex = ((team.currentPlayerIndex % team.players.length) + team.players.length) % team.players.length;
      } else {
        team.currentPlayerIndex = 0;
      }

      team.players.forEach((player) => {
        player.hasPlayed = Boolean(player.hasPlayed);
      });
    });

    if (saved.teams.length) {
      saved.currentTeamIndex = ((saved.currentTeamIndex % saved.teams.length) + saved.teams.length) % saved.teams.length;
    } else {
      saved.currentTeamIndex = 0;
    }

    delete saved.currentTurnIndex;
    return saved;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function teamVars(team) {
    return `--team-color:${team.color};--team-soft:${team.soft}`;
  }

  function getTeam(teamId) {
    return state.teams.find((team) => team.id === teamId);
  }

  function getPlayer(team, playerId) {
    return team?.players.find((player) => player.id === playerId);
  }

  function getGuest(team) {
    return {
      id: team.guestId,
      name: "Guest",
      isGuest: true
    };
  }

  function cleanDeferredQueue(team) {
    const validIds = new Set(team.players.map((player) => player.id));
    team.deferredPlayerQueue = [...new Set(team.deferredPlayerQueue)].filter((playerId) => validIds.has(playerId));
  }

  function getBaseTurn(team) {
    if (!team || !team.players.length) return null;
    cleanDeferredQueue(team);

    const deferredPlayer = getPlayer(team, team.deferredPlayerQueue[0]);
    if (deferredPlayer) {
      return {
        team,
        actor: deferredPlayer,
        actorType: "player",
        coveragePlayer: deferredPlayer,
        consumeSource: "queue",
        substitutingForName: null
      };
    }

    if (team.currentPlayerIndex >= team.players.length) {
      team.currentPlayerIndex = 0;
    }

    const player = team.players[team.currentPlayerIndex];
    return {
      team,
      actor: player,
      actorType: "player",
      coveragePlayer: player,
      consumeSource: "regular",
      substitutingForName: null
    };
  }

  function getCurrentTurn() {
    const team = state.teams[state.currentTeamIndex];
    if (!team || !team.players.length) return null;

    const override = state.turnOverride;
    if (override && override.teamId === team.id) {
      const coveragePlayer = getPlayer(team, override.coveragePlayerId);
      if (!coveragePlayer) {
        state.turnOverride = null;
        state.pendingTurnSnapshot = null;
        return getBaseTurn(team);
      }

      const actor = override.actorType === "guest"
        ? getGuest(team)
        : getPlayer(team, override.actorPlayerId);

      if (!actor) {
        state.turnOverride = null;
        state.pendingTurnSnapshot = null;
        return getBaseTurn(team);
      }

      return {
        team,
        actor,
        actorType: override.actorType,
        coveragePlayer,
        consumeSource: override.consumeSource,
        substitutionKind: override.substitutionKind || (override.actorType === "guest" ? "guest" : "teammate"),
        substitutingForName: override.substitutingForName || null
      };
    }

    return getBaseTurn(team);
  }

  function allPlayersHavePlayed() {
    return state.teams.length > 0 && state.teams.every((team) =>
      team.players.length > 0 && team.players.every((player) => player.hasPlayed)
    );
  }

  function resetPlayedMarkers() {
    state.teams.forEach((team) => {
      team.players.forEach((player) => {
        player.hasPlayed = false;
      });
    });
  }

  function clonePlain(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function captureTurnState() {
    return {
      currentTeamIndex: state.currentTeamIndex,
      roundThrowIndex: state.roundThrowIndex,
      standingsPending: state.standingsPending,
      turnOverride: clonePlain(state.turnOverride),
      teams: state.teams.map((team) => ({
        teamId: team.id,
        currentPlayerIndex: team.currentPlayerIndex,
        deferredPlayerQueue: [...team.deferredPlayerQueue],
        players: team.players.map((player) => ({
          playerId: player.id,
          hasPlayed: player.hasPlayed
        }))
      }))
    };
  }

  function restoreTurnState(snapshot) {
    if (!snapshot) return;

    state.currentTeamIndex = Number.isInteger(snapshot.currentTeamIndex) ? snapshot.currentTeamIndex : 0;
    state.roundThrowIndex = Number.isInteger(snapshot.roundThrowIndex) ? snapshot.roundThrowIndex : 0;
    state.standingsPending = Boolean(snapshot.standingsPending);
    state.turnOverride = clonePlain(snapshot.turnOverride) || null;
    state.pendingTurnSnapshot = null;

    (snapshot.teams || []).forEach((savedTeam) => {
      const team = getTeam(savedTeam.teamId);
      if (!team) return;
      team.currentPlayerIndex = Number.isInteger(savedTeam.currentPlayerIndex)
        ? savedTeam.currentPlayerIndex
        : 0;
      team.deferredPlayerQueue = Array.isArray(savedTeam.deferredPlayerQueue)
        ? [...savedTeam.deferredPlayerQueue]
        : [];
      (savedTeam.players || []).forEach((savedPlayer) => {
        const player = getPlayer(team, savedPlayer.playerId);
        if (player) player.hasPlayed = Boolean(savedPlayer.hasPlayed);
      });
      cleanDeferredQueue(team);
    });
  }

  function getPlayerStats(playerId) {
    const throws = state.history.filter((entry) => entry.playerId === playerId);
    return {
      throws: throws.length,
      scored: throws.reduce((sum, entry) => sum + entry.contribution, 0)
    };
  }

  function formatPointTotal(value) {
    return `${value} ${Math.abs(value) === 1 ? "pt" : "pts"}`;
  }

  function getGuestStats(team) {
    return getPlayerStats(team.guestId);
  }

  function getMvpResult() {
    const candidates = state.teams.flatMap((team) => team.players.map((player) => ({
      team,
      player,
      stats: getPlayerStats(player.id)
    })));

    if (!candidates.length) return null;
    candidates.sort((a, b) =>
      b.stats.scored - a.stats.scored ||
      a.stats.throws - b.stats.throws ||
      a.player.name.localeCompare(b.player.name)
    );

    const bestScore = candidates[0].stats.scored;
    return {
      score: bestScore,
      winners: candidates.filter((candidate) => candidate.stats.scored === bestScore)
    };
  }

  function render() {
    selectedScore = null;

    switch (state.view) {
      case "teamCount":
        renderTeamCount();
        break;
      case "players":
        renderPlayerSetup();
        break;
      case "game":
        renderGame();
        break;
      case "standings":
        renderStandings();
        break;
      case "finished":
        renderFinished();
        break;
      default:
        state = createInitialState();
        saveState();
        renderTeamCount();
    }
  }

  function renderBrand(subtitle = "Fast, clear team scoring for Mölkky.") {
    return `
      <header class="brand">
        <div class="brand-mark">Mölkky</div>
        <p class="brand-subtitle">${escapeHtml(subtitle)}</p>
      </header>
    `;
  }

  function renderTeamCount() {
    app.innerHTML = `
      <main class="app-shell">
        ${renderBrand("Set up the teams, add players, and keep every throw easy to follow.")}
        <section class="panel">
          <p class="eyebrow">Stage 1 of 3</p>
          <h1>How many teams are playing?</h1>
          <p class="lead">Choose between ${MIN_TEAMS} and ${MAX_TEAMS} teams. Each team gets its own name and color.</p>

          <div class="team-stepper" aria-label="Number of teams">
            <button type="button" id="decreaseTeams" aria-label="Remove one team">−</button>
            <div class="team-count-value" id="teamCountValue">${state.teamCount}</div>
            <button type="button" id="increaseTeams" aria-label="Add one team">+</button>
          </div>

          <button type="button" class="btn btn-primary btn-block" id="continueToPlayers">Continue to players</button>
        </section>
      </main>
    `;

    document.getElementById("decreaseTeams").addEventListener("click", () => {
      state.teamCount = Math.max(MIN_TEAMS, state.teamCount - 1);
      document.getElementById("teamCountValue").textContent = state.teamCount;
      saveState();
    });

    document.getElementById("increaseTeams").addEventListener("click", () => {
      state.teamCount = Math.min(MAX_TEAMS, state.teamCount + 1);
      document.getElementById("teamCountValue").textContent = state.teamCount;
      saveState();
    });

    document.getElementById("continueToPlayers").addEventListener("click", () => {
      state.teams = createTeams(state.teamCount);
      state.selectedSetupTeamId = state.teams[0]?.id || null;
      state.view = "players";
      setupError = "";
      saveState();
      render();
    });
  }

  function pencilIcon() {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4.2L19 9.2a2.1 2.1 0 0 0 0-3L17.8 5a2.1 2.1 0 0 0-3 0L4 15.8V20Zm2-3.4 10.2-10.2 1.4 1.4L7.4 18H6v-1.4Z" fill="currentColor"/>
      </svg>
    `;
  }

  function renderPlayerSetup() {
    const teamOptions = state.teams
      .map((team) => `<option value="${team.id}" ${team.id === state.selectedSetupTeamId ? "selected" : ""}>${escapeHtml(team.name)}</option>`)
      .join("");

    const teamCards = state.teams.map((team) => {
      const players = team.players.length
        ? `<ul class="player-list">${team.players.map((player) => `
            <li class="player-chip">
              <span class="player-chip-name">${escapeHtml(player.name)}</span>
              <button type="button" class="icon-button remove-player" data-team-id="${team.id}" data-player-id="${player.id}" aria-label="Remove ${escapeHtml(player.name)}">×</button>
            </li>
          `).join("")}</ul>`
        : `<div class="player-list-empty">No players added yet.</div>`;

      return `
        <article class="setup-team-card" style="${teamVars(team)}">
          <div class="setup-team-head">
            <div class="setup-team-title-row">
              <h3 class="setup-team-name">${escapeHtml(team.name)}</h3>
              <button type="button" class="rename-team-button" data-team-id="${team.id}" aria-label="Rename ${escapeHtml(team.name)}">
                ${pencilIcon()}
              </button>
            </div>
            <span class="player-count">${team.players.length} ${team.players.length === 1 ? "player" : "players"}</span>
          </div>
          ${players}
        </article>
      `;
    }).join("");

    app.innerHTML = `
      <main class="app-shell">
        ${renderBrand("Add every player to the team you choose. Nothing is distributed automatically.")}
        <section class="panel">
          <p class="eyebrow">Stage 2 of 3</p>
          <h1>Add the players</h1>
          <p class="lead">Type a name, choose the correct team, and add the player. Uneven team sizes are completely fine.</p>

          <form id="playerForm" autocomplete="off">
            <div class="input-row">
              <div>
                <label class="field-label" for="playerName">Player name</label>
                <input id="playerName" name="playerName" type="text" maxlength="40" placeholder="Enter a name" required autofocus>
              </div>
              <div>
                <label class="field-label" for="teamSelect">Team</label>
                <select id="teamSelect" name="teamSelect">${teamOptions}</select>
              </div>
              <button type="submit" class="btn btn-primary">Add player</button>
            </div>
          </form>

          ${setupError ? `<div class="notice" role="alert">${escapeHtml(setupError)}</div>` : ""}
          <div class="setup-grid">${teamCards}</div>

          <div class="button-row">
            <button type="button" class="btn btn-secondary" id="backToTeamCount">Back</button>
            <button type="button" class="btn btn-primary" id="startGame">Done — start game</button>
          </div>
        </section>
      </main>
    `;

    const form = document.getElementById("playerForm");
    document.getElementById("teamSelect").addEventListener("change", (event) => {
      state.selectedSetupTeamId = event.target.value;
      saveState();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const nameInput = document.getElementById("playerName");
      const teamSelect = document.getElementById("teamSelect");
      const name = nameInput.value.trim();
      const team = getTeam(teamSelect.value);
      state.selectedSetupTeamId = teamSelect.value;

      if (!name || !team) return;

      team.players.push({ id: makeId("player"), name, hasPlayed: false });
      setupError = "";
      saveState();
      renderPlayerSetup();
      document.getElementById("playerName").focus();
    });

    document.querySelectorAll(".remove-player").forEach((button) => {
      button.addEventListener("click", () => {
        const team = getTeam(button.dataset.teamId);
        if (!team) return;
        team.players = team.players.filter((player) => player.id !== button.dataset.playerId);
        cleanDeferredQueue(team);
        setupError = "";
        saveState();
        renderPlayerSetup();
      });
    });

    document.querySelectorAll(".rename-team-button").forEach((button) => {
      button.addEventListener("click", () => {
        const team = getTeam(button.dataset.teamId);
        if (team) openRenameTeamDialog(team);
      });
    });

    document.getElementById("backToTeamCount").addEventListener("click", () => {
      state.view = "teamCount";
      state.teams = [];
      state.selectedSetupTeamId = null;
      setupError = "";
      saveState();
      render();
    });

    document.getElementById("startGame").addEventListener("click", () => {
      const emptyTeams = state.teams.filter((team) => team.players.length === 0);
      if (emptyTeams.length) {
        setupError = `Add at least one player to ${emptyTeams.map((team) => team.name).join(", ")}.`;
        renderPlayerSetup();
        return;
      }

      state.view = "game";
      state.round = 1;
      state.currentTeamIndex = 0;
      state.roundThrowIndex = 0;
      state.standingsPending = false;
      state.history = [];
      state.winnerId = null;
      state.turnOverride = null;
      state.pendingTurnSnapshot = null;
      state.teams.forEach((team) => {
        team.total = 0;
        team.currentPlayerIndex = 0;
        team.deferredPlayerQueue = [];
        team.players.forEach((player) => { player.hasPlayed = false; });
      });
      setupError = "";
      saveState();
      render();
    });
  }

  function renderScoreboard() {
    return `
      <div class="scoreboard-wrap">
        <div class="scoreboard" aria-label="Team scores">
          ${state.teams.map((team) => {
            const guestStats = getGuestStats(team);
            return `
              <details class="score-team" style="${teamVars(team)}">
                <summary>
                  <span class="score-name">${escapeHtml(team.name)}</span>
                  <span class="score-number">${team.total}</span>
                </summary>
                <ul class="score-roster">
                  ${team.players.map((player) => {
                    const stats = getPlayerStats(player.id);
                    return `
                      <li>
                        <span class="score-roster-name">${escapeHtml(player.name)}</span>
                        <span class="score-roster-stat">${formatPointTotal(stats.scored)} · ${stats.throws} ${stats.throws === 1 ? "throw" : "throws"}</span>
                      </li>
                    `;
                  }).join("")}
                  ${guestStats.throws ? `
                    <li class="guest-roster-row">
                      <span class="score-roster-name guest-name">Guest</span>
                      <span class="score-roster-stat">${formatPointTotal(guestStats.scored)} · ${guestStats.throws} ${guestStats.throws === 1 ? "throw" : "throws"}</span>
                    </li>
                  ` : ""}
                </ul>
              </details>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function willCompleteCoverage(turn) {
    const targetId = turn.coveragePlayer.id;
    if (turn.coveragePlayer.hasPlayed) return false;
    return state.teams.every((team) =>
      team.players.every((player) => player.id === targetId || player.hasPlayed)
    );
  }

  function renderGame() {
    const turn = getCurrentTurn();
    if (!turn) {
      state.view = "players";
      saveState();
      render();
      return;
    }

    const { team, actor, actorType, coveragePlayer, substitutionKind, substitutingForName } = turn;
    const isGuest = actorType === "guest";
    const substitutionNote = substitutionKind === "guest" && substitutingForName
      ? `Throwing for ${escapeHtml(substitutingForName)}`
      : substitutionKind === "teammate" && substitutingForName
        ? `${escapeHtml(substitutingForName)} was deferred and is first in this team’s priority queue.`
        : "";
    const isLastTeam = state.currentTeamIndex === state.teams.length - 1;
    const willShowStandings = isLastTeam && (state.standingsPending || willCompleteCoverage(turn));
    const queueNotice = team.deferredPlayerQueue.length
      ? `<span class="deferred-badge">${team.deferredPlayerQueue.length} deferred ${team.deferredPlayerQueue.length === 1 ? "turn" : "turns"}</span>`
      : "";

    app.innerHTML = `
      <main class="app-shell with-scoreboard">
        ${renderScoreboard()}

        <div class="game-topline">
          <div class="round-info">
            <span class="round-label">Round ${state.round} · Throw ${state.roundThrowIndex + 1}</span>
            ${queueNotice}
          </div>
          <button type="button" class="btn btn-secondary btn-small" id="newGame">New game</button>
        </div>

        <div class="play-layout">
          <section class="current-player-card ${isGuest ? "guest-current-player" : ""}" style="${teamVars(team)}">
            <p class="current-team">${escapeHtml(team.name)}</p>
            <h1 class="current-player ${isGuest ? "guest-name" : ""}">${escapeHtml(actor.name)}</h1>
            ${substitutionNote ? `<p class="substitution-note">${substitutionNote}</p>` : ""}
            <p class="current-total">Team total: <strong>${team.total}</strong> / 50</p>
          </section>

          <section class="score-entry-panel" style="${teamVars(team)}">
            <h2 class="score-entry-title">What did they score?</h2>
            <p class="helper" style="text-align:center">Choose 0 for a miss, or 1–12 for the throw.</p>
            <div class="score-grid" role="group" aria-label="Select score">
              ${Array.from({ length: 13 }, (_, score) => `
                <button type="button" class="score-choice" data-score="${score}" aria-pressed="false">${score === 0 ? "0 · Miss" : score}</button>
              `).join("")}
            </div>
            <div class="selected-score" id="selectedScoreText">Select a score</div>
            <button type="button" class="btn submit-score" id="submitScore" disabled>
              ${willShowStandings ? "Record score & show standings" : "Record score & next player"}
            </button>
            ${!isGuest ? `<button type="button" class="btn unavailable-button" id="playerUnavailable">Player unavailable / substitute</button>` : ""}
            ${state.pendingTurnSnapshot ? `<button type="button" class="btn cancel-substitution-button" id="cancelSubstitution">Cancel substitution</button>` : ""}
          </section>
        </div>

        <div class="game-actions">
          <button type="button" class="btn btn-secondary btn-small" id="undoThrow" ${state.history.length ? "" : "disabled"}>Undo last throw</button>
        </div>
      </main>
    `;

    document.querySelectorAll(".score-choice").forEach((button) => {
      button.addEventListener("click", () => {
        selectedScore = Number(button.dataset.score);
        document.querySelectorAll(".score-choice").forEach((choice) => {
          const active = choice === button;
          choice.classList.toggle("is-selected", active);
          choice.setAttribute("aria-pressed", String(active));
        });
        document.getElementById("selectedScoreText").innerHTML = `<span>Selected:</span> <strong>${selectedScore}</strong>`;
        document.getElementById("submitScore").disabled = false;
      });
    });

    document.getElementById("submitScore").addEventListener("click", () => {
      if (selectedScore === null) return;
      recordScore(selectedScore, turn);
    });

    document.getElementById("playerUnavailable")?.addEventListener("click", () => {
      openSubstitutionDialog(turn);
    });
    document.getElementById("cancelSubstitution")?.addEventListener("click", cancelPendingSubstitution);
    document.getElementById("undoThrow").addEventListener("click", undoLastThrow);
    document.getElementById("newGame").addEventListener("click", confirmNewGame);
  }

  function findNextAvailableTeammate(turn) {
    const { team, coveragePlayer, consumeSource } = turn;
    if (team.players.length < 2) return null;

    const currentIndex = team.players.findIndex((player) => player.id === coveragePlayer.id);
    if (currentIndex < 0) return null;

    // A priority-queue turn does not move the normal team pointer. If that queued
    // player is unavailable again, resume from the team's normally scheduled player.
    const startIndex = consumeSource === "queue"
      ? team.currentPlayerIndex
      : (currentIndex + 1) % team.players.length;
    const unavailableIds = new Set([...team.deferredPlayerQueue, coveragePlayer.id]);

    for (let offset = 0; offset < team.players.length; offset += 1) {
      const candidate = team.players[(startIndex + offset) % team.players.length];
      if (!unavailableIds.has(candidate.id)) return candidate;
    }
    return null;
  }

  function ensurePendingTurnSnapshot() {
    if (!state.pendingTurnSnapshot) {
      state.pendingTurnSnapshot = captureTurnState();
    }
  }

  function deferPlayer(team, playerId, consumeSource) {
    if (consumeSource === "queue") {
      const queueIndex = team.deferredPlayerQueue.indexOf(playerId);
      if (queueIndex >= 0) team.deferredPlayerQueue.splice(queueIndex, 1);
    }
    if (!team.deferredPlayerQueue.includes(playerId)) {
      team.deferredPlayerQueue.push(playerId);
    }
  }

  function applyTeammateSubstitution(turn) {
    const nextPlayer = findNextAvailableTeammate(turn);
    if (!nextPlayer) return;

    ensurePendingTurnSnapshot();
    deferPlayer(turn.team, turn.coveragePlayer.id, turn.consumeSource);

    const nextIndex = turn.team.players.findIndex((player) => player.id === nextPlayer.id);
    turn.team.currentPlayerIndex = nextIndex;
    state.turnOverride = {
      teamId: turn.team.id,
      actorType: "player",
      actorPlayerId: nextPlayer.id,
      coveragePlayerId: nextPlayer.id,
      consumeSource: "regular",
      substitutionKind: "teammate",
      substitutingForName: turn.coveragePlayer.name
    };

    saveState();
    render();
  }

  function applyExternalSubstitution(turn) {
    ensurePendingTurnSnapshot();
    state.turnOverride = {
      teamId: turn.team.id,
      actorType: "guest",
      actorPlayerId: turn.team.guestId,
      coveragePlayerId: turn.coveragePlayer.id,
      consumeSource: turn.consumeSource,
      substitutionKind: "guest",
      substitutingForName: turn.coveragePlayer.name
    };
    saveState();
    render();
  }

  function cancelPendingSubstitution() {
    const snapshot = clonePlain(state.pendingTurnSnapshot);
    if (!snapshot) return;
    restoreTurnState(snapshot);
    saveState();
    render();
  }

  function consumeTurn(team, coveragePlayer, consumeSource) {
    coveragePlayer.hasPlayed = true;

    if (consumeSource === "queue") {
      const queueIndex = team.deferredPlayerQueue.indexOf(coveragePlayer.id);
      if (queueIndex >= 0) team.deferredPlayerQueue.splice(queueIndex, 1);

      const pointerPlayer = team.players[team.currentPlayerIndex];
      if (pointerPlayer?.id === coveragePlayer.id) {
        team.currentPlayerIndex = (team.currentPlayerIndex + 1) % team.players.length;
      }
      return;
    }

    const playerIndex = team.players.findIndex((player) => player.id === coveragePlayer.id);
    if (playerIndex >= 0) {
      team.currentPlayerIndex = (playerIndex + 1) % team.players.length;
    }
  }

  function recordScore(score, turn) {
    const { team, actor, actorType, coveragePlayer, consumeSource } = turn;
    const previousTotal = team.total;
    const rawTotal = previousTotal + score;
    const exceededFifty = rawTotal > 50;
    const resultingTotal = exceededFifty ? 25 : rawTotal;
    const contribution = exceededFifty ? -25 : score;
    const turnStateBefore = clonePlain(state.pendingTurnSnapshot) || captureTurnState();

    team.total = resultingTotal;
    state.history.push({
      id: makeId("throw"),
      round: state.round,
      turnIndex: state.roundThrowIndex,
      teamId: team.id,
      playerId: actor.id,
      playerName: actor.name,
      coveredPlayerId: coveragePlayer.id,
      coveredPlayerName: coveragePlayer.name,
      teamName: team.name,
      score,
      contribution,
      previousTotal,
      resultingTotal,
      exceededFifty,
      isGuest: actorType === "guest",
      turnStateBefore,
      timestamp: Date.now()
    });

    consumeTurn(team, coveragePlayer, consumeSource);
    state.turnOverride = null;
    state.pendingTurnSnapshot = null;
    state.roundThrowIndex += 1;

    if (resultingTotal === 50) {
      state.winnerId = team.id;
      state.view = "finished";
      saveState();
      render();
      return;
    }

    if (allPlayersHavePlayed()) {
      state.standingsPending = true;
    }

    const isLastTeam = state.currentTeamIndex === state.teams.length - 1;
    if (isLastTeam) {
      state.currentTeamIndex = 0;
      if (state.standingsPending) {
        resetPlayedMarkers();
        state.standingsPending = false;
        state.view = "standings";
      }
    } else {
      state.currentTeamIndex += 1;
    }

    saveState();
    render();
  }

  function undoLastThrow() {
    const last = state.history.pop();
    if (!last) return;

    const team = getTeam(last.teamId);
    if (team) team.total = last.previousTotal;

    state.winnerId = null;
    state.round = last.round;
    restoreTurnState(last.turnStateBefore);
    state.view = "game";
    saveState();
    render();
  }

  function getRankedTeams() {
    return [...state.teams].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  }

  function standingsMarkup() {
    return `
      <ol class="standings-list">
        ${getRankedTeams().map((team, index) => `
          <li class="standing-row" style="${teamVars(team)}">
            <span class="standing-rank">${index + 1}</span>
            <span class="standing-team">${escapeHtml(team.name)}</span>
            <strong class="standing-score">${team.total}</strong>
          </li>
        `).join("")}
      </ol>
    `;
  }

  function renderStandings() {
    app.innerHTML = `
      <main class="app-shell with-scoreboard">
        ${renderScoreboard()}
        <section class="panel">
          <p class="eyebrow">Round ${state.round} complete</p>
          <h1>Current standings</h1>
          <p class="lead">Every player’s turn has been completed, and every team has finished the same number of team turns. Take a moment to review the scores.</p>
          ${standingsMarkup()}
          <button type="button" class="btn btn-primary btn-block" id="nextRound" style="margin-top:22px">Start round ${state.round + 1}</button>
          <div class="button-row centered">
            <button type="button" class="btn btn-secondary btn-small" id="undoThrow">Undo last throw</button>
            <button type="button" class="btn btn-secondary btn-small" id="newGame">New game</button>
          </div>
        </section>
      </main>
    `;

    document.getElementById("nextRound").addEventListener("click", () => {
      state.round += 1;
      state.roundThrowIndex = 0;
      state.view = "game";
      saveState();
      render();
    });
    document.getElementById("undoThrow").addEventListener("click", undoLastThrow);
    document.getElementById("newGame").addEventListener("click", confirmNewGame);
  }

  function renderMvp() {
    const mvp = getMvpResult();
    if (!mvp) return "";
    const tie = mvp.winners.length > 1;

    return `
      <section class="panel mvp-panel">
        <p class="eyebrow">${tie ? "MVP tie" : "Most valuable player"}</p>
        <h2>${tie ? "MVPs" : "MVP"}</h2>
        <div class="mvp-list">
          ${mvp.winners.map(({ team, player }) => `
            <div class="mvp-player" style="${teamVars(team)}">
              <span class="mvp-name">${escapeHtml(player.name)}</span>
              <span class="mvp-team">${escapeHtml(team.name)}</span>
            </div>
          `).join("")}
        </div>
        <div class="mvp-score">${formatPointTotal(mvp.score)}</div>
        <p class="helper">Over-50 resets count as −25 points for individual scoring. Guest throws are excluded.</p>
      </section>
    `;
  }

  function renderFinished() {
    const winner = getTeam(state.winnerId) || getRankedTeams()[0];
    const latestFirst = [...state.history].reverse();

    app.innerHTML = `
      <main class="app-shell with-scoreboard">
        ${renderScoreboard()}

        <section class="winner-banner" style="${teamVars(winner)}">
          <p class="eyebrow">Exactly 50 points</p>
          <div class="winner-name">${escapeHtml(winner.name)} wins</div>
          <p class="lead" style="margin:10px 0 0">Final score: <strong>${winner.total}</strong></p>
        </section>

        ${renderMvp()}

        <section class="panel">
          <h2>Final standings</h2>
          ${standingsMarkup()}
        </section>

        <section class="panel">
          <h2>Score progression</h2>
          <p class="helper">Each line shows a team’s total after each of its throws.</p>
          ${renderChart()}
        </section>

        <section class="panel">
          <h2>Throw history</h2>
          <ul class="history-list">
            ${latestFirst.map((entry) => {
              const team = getTeam(entry.teamId);
              const contributionLabel = entry.contribution === entry.score
                ? `+${entry.score}`
                : "−25";
              return `
                <li class="history-item" style="${teamVars(team)}">
                  <div class="history-main">
                    <div><span class="history-name ${entry.isGuest ? "guest-name" : ""}">${escapeHtml(entry.playerName)}</span> · ${escapeHtml(entry.teamName)}</div>
                    <div class="history-meta">Round ${entry.round}${entry.isGuest ? ` · for ${escapeHtml(entry.coveredPlayerName)}` : ""}</div>
                    <div class="history-result">${entry.previousTotal} → ${entry.resultingTotal}${entry.exceededFifty ? " · over 50, reset to 25" : ""}</div>
                  </div>
                  <strong class="history-score ${entry.isGuest ? "guest-name" : ""}" title="Individual score contribution">${contributionLabel}</strong>
                </li>
              `;
            }).join("")}
          </ul>
        </section>

        <section class="panel">
          <div class="button-row" style="margin-top:0">
            <button type="button" class="btn btn-primary" id="playAgain">Play again with same teams</button>
            <button type="button" class="btn btn-secondary" id="undoThrow">Undo winning throw</button>
            <button type="button" class="btn btn-secondary" id="newGame">Create a new game</button>
          </div>
        </section>
      </main>
    `;

    document.getElementById("playAgain").addEventListener("click", () => {
      state.teams.forEach((team) => {
        team.total = 0;
        team.currentPlayerIndex = 0;
        team.deferredPlayerQueue = [];
        team.players.forEach((player) => { player.hasPlayed = false; });
      });
      state.round = 1;
      state.currentTeamIndex = 0;
      state.roundThrowIndex = 0;
      state.standingsPending = false;
      state.history = [];
      state.winnerId = null;
      state.turnOverride = null;
      state.pendingTurnSnapshot = null;
      state.view = "game";
      saveState();
      render();
    });
    document.getElementById("undoThrow").addEventListener("click", undoLastThrow);
    document.getElementById("newGame").addEventListener("click", confirmNewGame);
  }

  function renderChart() {
    const width = 760;
    const height = 350;
    const left = 48;
    const right = 22;
    const top = 24;
    const bottom = 42;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const series = state.teams.map((team) => {
      const entries = state.history.filter((entry) => entry.teamId === team.id);
      return {
        team,
        values: [0, ...entries.map((entry) => entry.resultingTotal)]
      };
    });
    const maxPoints = Math.max(2, ...series.map((item) => item.values.length));

    const gridLines = [0, 10, 20, 30, 40, 50].map((value) => {
      const y = top + plotHeight - (value / 50) * plotHeight;
      return `
        <line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#e6e0d6" stroke-width="1" />
        <text x="${left - 10}" y="${y + 4}" text-anchor="end" fill="#737b77" font-size="12">${value}</text>
      `;
    }).join("");

    const lines = series.map(({ team, values }) => {
      const points = values.map((value, index) => {
        const x = left + (index / (maxPoints - 1)) * plotWidth;
        const y = top + plotHeight - (value / 50) * plotHeight;
        return `${x},${y}`;
      }).join(" ");

      const circles = values.map((value, index) => {
        const x = left + (index / (maxPoints - 1)) * plotWidth;
        const y = top + plotHeight - (value / 50) * plotHeight;
        return `<circle cx="${x}" cy="${y}" r="3.5" fill="${team.color}" />`;
      }).join("");

      return `<polyline points="${points}" fill="none" stroke="${team.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />${circles}`;
    }).join("");

    return `
      <div class="chart-wrap">
        <svg class="score-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Team score progression graph">
          ${gridLines}
          <line x1="${left}" y1="${top}" x2="${left}" y2="${height - bottom}" stroke="#938b7f" stroke-width="1.5" />
          <line x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}" stroke="#938b7f" stroke-width="1.5" />
          <text x="${width / 2}" y="${height - 10}" text-anchor="middle" fill="#737b77" font-size="12">Throws by each team</text>
          ${lines}
        </svg>
      </div>
      <div class="chart-legend">
        ${state.teams.map((team) => `
          <span class="legend-item" style="${teamVars(team)}"><span class="legend-dot"></span>${escapeHtml(team.name)}</span>
        `).join("")}
      </div>
    `;
  }

  function openModal(content, onReady) {
    closeModal();
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.id = "appModal";
    backdrop.innerHTML = content;
    document.body.appendChild(backdrop);
    document.body.classList.add("modal-open");

    const close = () => closeModal();
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) close();
    });
    backdrop.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", close);
    });

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    backdrop._modalKeyHandler = onKeyDown;
    document.addEventListener("keydown", onKeyDown);

    if (onReady) onReady(backdrop, close);
  }

  function closeModal() {
    const existing = document.getElementById("appModal");
    if (!existing) return;
    if (existing._modalKeyHandler) {
      document.removeEventListener("keydown", existing._modalKeyHandler);
    }
    existing.remove();
    document.body.classList.remove("modal-open");
  }

  function openRenameTeamDialog(team) {
    openModal(`
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="renameTitle">
        <p class="eyebrow">Team settings</p>
        <h2 id="renameTitle">Rename team</h2>
        <form id="renameTeamForm">
          <label class="field-label" for="renameTeamInput">Team name</label>
          <input id="renameTeamInput" type="text" maxlength="40" value="${escapeHtml(team.name)}" required>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
            <button type="submit" class="btn btn-primary">Save name</button>
          </div>
        </form>
      </section>
    `, (modal, close) => {
      const input = modal.querySelector("#renameTeamInput");
      input.focus();
      input.select();
      modal.querySelector("#renameTeamForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const name = input.value.trim();
        if (!name) return;
        team.name = name;
        saveState();
        close();
        renderPlayerSetup();
      });
    });
  }

  function openSubstitutionDialog(turn) {
    const nextTeammate = findNextAvailableTeammate(turn);
    const teammateDisabled = nextTeammate ? "" : "disabled";
    const teammateText = nextTeammate
      ? `${escapeHtml(nextTeammate.name)} throws now. ${escapeHtml(turn.coveragePlayer.name)} is queued first for ${escapeHtml(turn.team.name)}’s next turn.`
      : "No other non-deferred teammate is currently available for this option.";

    openModal(`
      <section class="modal-card substitution-modal" role="dialog" aria-modal="true" aria-labelledby="substitutionTitle">
        <p class="eyebrow">${escapeHtml(turn.team.name)}</p>
        <h2 id="substitutionTitle">Substitute for ${escapeHtml(turn.coveragePlayer.name)}</h2>
        <p class="lead modal-lead">Choose how to cover this team turn.</p>

        <button type="button" class="substitution-choice" id="nextTeammateChoice" ${teammateDisabled}>
          <span class="substitution-choice-title">Use next teammate</span>
          <span class="substitution-choice-copy">${teammateText}</span>
        </button>

        <button type="button" class="substitution-choice" id="externalGuestChoice">
          <span class="substitution-choice-title">Use external Guest</span>
          <span class="substitution-choice-copy">Guest throws for ${escapeHtml(turn.coveragePlayer.name)}. The team receives the score, but the player receives no individual points or throw.</span>
        </button>

        <button type="button" class="btn btn-secondary btn-block modal-cancel" data-close-modal>Cancel</button>
      </section>
    `, (modal, close) => {
      modal.querySelector("#nextTeammateChoice")?.addEventListener("click", () => {
        close();
        applyTeammateSubstitution(turn);
      });
      modal.querySelector("#externalGuestChoice").addEventListener("click", () => {
        close();
        applyExternalSubstitution(turn);
      });
    });
  }

  function confirmNewGame() {
    const confirmed = window.confirm("Start a new game? The current teams and scores will be cleared.");
    if (!confirmed) return;
    state = createInitialState();
    setupError = "";
    closeModal();
    saveState();
    render();
  }

  render();
})();

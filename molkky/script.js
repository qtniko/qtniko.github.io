(() => {
  "use strict";

  const STORAGE_KEY = "molkky-scorekeeper-v1";
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
      currentTurnIndex: 0,
      history: [],
      winnerId: null,
      selectedSetupTeamId: null
    };
  }

  function createTeams(count) {
    return Array.from({ length: count }, (_, index) => {
      const style = TEAM_STYLES[index];
      return {
        id: makeId("team"),
        name: `Team ${style.label}`,
        color: style.color,
        soft: style.soft,
        total: 0,
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
      return saved;
    } catch {
      return null;
    }
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

  function getTurnOrder() {
    if (!state.teams.length) return [];
    const maxPlayers = Math.max(...state.teams.map((team) => team.players.length));
    const turns = [];

    for (let playerIndex = 0; playerIndex < maxPlayers; playerIndex += 1) {
      state.teams.forEach((team) => {
        const player = team.players[playerIndex];
        if (player) {
          turns.push({ teamId: team.id, playerId: player.id });
        }
      });
    }

    return turns;
  }

  function getTeam(teamId) {
    return state.teams.find((team) => team.id === teamId);
  }

  function getPlayer(team, playerId) {
    return team.players.find((player) => player.id === playerId);
  }

  function getPlayerStats(playerId) {
    const throws = state.history.filter((entry) => entry.playerId === playerId);
    return {
      throws: throws.length,
      scored: throws.reduce((sum, entry) => sum + entry.score, 0)
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
            <h3 class="setup-team-name">${escapeHtml(team.name)}</h3>
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

      team.players.push({ id: makeId("player"), name });
      setupError = "";
      saveState();
      renderPlayerSetup();

      const nextInput = document.getElementById("playerName");
      nextInput.focus();
    });

    document.querySelectorAll(".remove-player").forEach((button) => {
      button.addEventListener("click", () => {
        const team = getTeam(button.dataset.teamId);
        if (!team) return;
        team.players = team.players.filter((player) => player.id !== button.dataset.playerId);
        setupError = "";
        saveState();
        renderPlayerSetup();
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
      state.currentTurnIndex = 0;
      state.history = [];
      state.winnerId = null;
      state.teams.forEach((team) => { team.total = 0; });
      setupError = "";
      saveState();
      render();
    });
  }

  function renderScoreboard() {
    return `
      <div class="scoreboard-wrap">
        <div class="scoreboard" aria-label="Team scores">
          ${state.teams.map((team) => `
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
                      <span class="score-roster-stat">${stats.scored} pts · ${stats.throws} ${stats.throws === 1 ? "throw" : "throws"}</span>
                    </li>
                  `;
                }).join("")}
              </ul>
            </details>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderGame() {
    const turnOrder = getTurnOrder();
    if (!turnOrder.length) {
      state.view = "players";
      saveState();
      render();
      return;
    }

    if (state.currentTurnIndex >= turnOrder.length) {
      state.currentTurnIndex = 0;
    }

    const turn = turnOrder[state.currentTurnIndex];
    const team = getTeam(turn.teamId);
    const player = getPlayer(team, turn.playerId);
    const isLastThrowOfRound = state.currentTurnIndex === turnOrder.length - 1;

    app.innerHTML = `
      <main class="app-shell with-scoreboard">
        ${renderScoreboard()}

        <div class="game-topline">
          <span class="round-label">Round ${state.round} · Throw ${state.currentTurnIndex + 1} of ${turnOrder.length}</span>
          <button type="button" class="btn btn-secondary btn-small" id="newGame">New game</button>
        </div>

        <div class="play-layout">
          <section class="current-player-card" style="${teamVars(team)}">
            <p class="current-team">${escapeHtml(team.name)}</p>
            <h1 class="current-player">${escapeHtml(player.name)}</h1>
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
              ${isLastThrowOfRound ? "Record score & show standings" : "Record score & next player"}
            </button>
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
      recordScore(selectedScore, turn, team, player, isLastThrowOfRound);
    });

    document.getElementById("undoThrow").addEventListener("click", undoLastThrow);
    document.getElementById("newGame").addEventListener("click", confirmNewGame);
  }

  function recordScore(score, turn, team, player, isLastThrowOfRound) {
    const previousTotal = team.total;
    const rawTotal = previousTotal + score;
    const exceededFifty = rawTotal > 50;
    const resultingTotal = exceededFifty ? 25 : rawTotal;

    team.total = resultingTotal;
    state.history.push({
      id: makeId("throw"),
      round: state.round,
      turnIndex: state.currentTurnIndex,
      teamId: team.id,
      playerId: player.id,
      playerName: player.name,
      teamName: team.name,
      score,
      previousTotal,
      resultingTotal,
      exceededFifty,
      timestamp: Date.now()
    });

    if (resultingTotal === 50) {
      state.winnerId = team.id;
      state.view = "finished";
    } else if (isLastThrowOfRound) {
      state.view = "standings";
    } else {
      state.currentTurnIndex += 1;
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
    state.currentTurnIndex = last.turnIndex;
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
          <p class="lead">Everyone has thrown once this round. Take a moment to review the scores.</p>
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
      state.currentTurnIndex = 0;
      state.view = "game";
      saveState();
      render();
    });
    document.getElementById("undoThrow").addEventListener("click", undoLastThrow);
    document.getElementById("newGame").addEventListener("click", confirmNewGame);
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
              return `
                <li class="history-item" style="${teamVars(team)}">
                  <div class="history-main">
                    <div><span class="history-name">${escapeHtml(entry.playerName)}</span> · ${escapeHtml(entry.teamName)}</div>
                    <div class="history-meta">Round ${entry.round}</div>
                    <div class="history-result">${entry.previousTotal} → ${entry.resultingTotal}${entry.exceededFifty ? " · over 50, reset to 25" : ""}</div>
                  </div>
                  <strong class="history-score">+${entry.score}</strong>
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
      state.teams.forEach((team) => { team.total = 0; });
      state.round = 1;
      state.currentTurnIndex = 0;
      state.history = [];
      state.winnerId = null;
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

  function confirmNewGame() {
    const confirmed = window.confirm("Start a new game? The current teams and scores will be cleared.");
    if (!confirmed) return;
    state = createInitialState();
    setupError = "";
    saveState();
    render();
  }

  render();
})();

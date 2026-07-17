(() => {
  "use strict";

  const STORAGE_KEY = "molkky-scorekeeper-v2";
  const MIN_TEAMS = 2;
  const MAX_TEAMS = 10;

  const TEAM_STYLES = [
    { key: "red", label: "Red", color: "#b72d2a", soft: "#fff1ef" },
    { key: "blue", label: "Blue", color: "#1768a6", soft: "#edf7ff" },
    { key: "green", label: "Green", color: "#267a4a", soft: "#eef9f2" },
    { key: "yellow", label: "Yellow", color: "#8a6500", soft: "#fff8dc" },
    { key: "purple", label: "Purple", color: "#7345a3", soft: "#f7f0ff" },
    { key: "orange", label: "Orange", color: "#a94f08", soft: "#fff2e8" },
    { key: "pink", label: "Pink", color: "#a73969", soft: "#fff0f6" },
    { key: "cyan", label: "Cyan", color: "#087381", soft: "#ebfbfd" },
    { key: "lime", label: "Lime", color: "#54730c", soft: "#f4fadd" },
    { key: "brown", label: "Brown", color: "#76503b", soft: "#f7f0eb" }
  ];

  const SUPPORTED_LANGUAGES = ["en", "no"];
  const LANGUAGE_LOCALES = { en: "en-GB", no: "nb-NO" };

  const TRANSLATIONS = {
    en: {
      "app.title": "Mölkky Scorekeeper",
      "app.description": "A simple, mobile-first Mölkky team score tracker.",
      "language.label": "Display language",
      "language.english": "English",
      "language.norwegian": "Norsk",
      "brand.default": "Fast, clear team scoring for Mölkky.",
      "brand.setup": "Set up the teams, add players, and keep every throw easy to follow.",
      "brand.players": "Add players automatically to the smallest team, or choose a team manually.",
      "color.red": "Red", "color.blue": "Blue", "color.green": "Green", "color.yellow": "Yellow",
      "color.purple": "Purple", "color.orange": "Orange", "color.pink": "Pink", "color.cyan": "Cyan",
      "color.lime": "Lime", "color.brown": "Brown",
      "team.default": "Team {color}",
      "team.default.red": "Team Red", "team.default.blue": "Team Blue",
      "team.default.green": "Team Green", "team.default.yellow": "Team Yellow",
      "team.default.purple": "Team Purple", "team.default.orange": "Team Orange",
      "team.default.pink": "Team Pink", "team.default.cyan": "Team Cyan",
      "team.default.lime": "Team Lime", "team.default.brown": "Team Brown",
      "team.award": "Team award",
      "guest": "Guest",
      "unit.point.one": "pt", "unit.point.other": "pts",
      "unit.player.one": "player", "unit.player.other": "players",
      "unit.throw.one": "throw", "unit.throw.other": "throws",
      "unit.turn.one": "turn", "unit.turn.other": "turns",
      "unit.win.one": "win", "unit.win.other": "wins",
      "unit.bust.one": "bust", "unit.bust.other": "busts",
      "unit.miss.one": "miss", "unit.miss.other": "misses",
      "unit.throwLed.one": "throw led", "unit.throwLed.other": "throws led",
      "value.average": "{value} avg", "value.spread": "{value} spread", "value.share": "{value}% share",
      "value.recovery": "{value}-point recovery", "value.finalBlow": "Final blow",
      "value.round": "Round {round}", "value.multipleRounds": "Multiple rounds",
      "stage.one": "Stage 1 of 3", "stage.two": "Stage 2 of 3",
      "teamCount.title": "How many teams are playing?",
      "teamCount.lead": "Choose between {min} and {max} teams. Each team gets its own name and color.",
      "teamCount.number": "Number of teams", "teamCount.remove": "Remove one team", "teamCount.add": "Add one team",
      "teamCount.continue": "Continue to players",
      "setup.title": "Add the players",
      "setup.lead": "Auto-fill is selected by default and always places the next player on a team with the fewest players. You can still select a specific team whenever needed.",
      "setup.playerName": "Player name", "setup.enterName": "Enter a name", "setup.assignment": "Team assignment",
      "setup.autoFill": "Auto-fill · fewest players", "setup.addPlayer": "Add player", "setup.noPlayers": "No players added yet.",
      "setup.removePlayer": "Remove {name}", "setup.renameTeam": "Rename {team}", "setup.deleteTeam": "Delete {team}",
      "setup.addTeam": "Add another team", "setup.shuffle": "Shuffle teams", "setup.back": "Back",
      "setup.start": "Done — start game", "setup.emptyTeams": "Add at least one player to {teams}.",
      "scoreboard.label": "Team scores", "scoreboard.remove": "Remove", "scoreboard.return": "Return",
      "scoreboard.fromGame": "from the game", "scoreboard.toGame": "to the game",
      "scoreboard.markUnavailable": "Mark unavailable", "scoreboard.returnToGame": "Return to game",
      "game.roundThrow": "Round {round} · Throw {throw}", "game.deferred": "{count} deferred {unit}",
      "game.finalTurns": "Final team turns", "game.new": "New game", "game.throwingFor": "Throwing for {name}",
      "game.deferredNote": "{name} was deferred and is first in this team’s priority queue.",
      "game.teamTotal": "Team total: {score} / 50", "game.scoreTitle": "What did they score?",
      "game.scoreHelp": "Choose 0 for a miss, or 1–12 for the throw.", "game.selectScore": "Select score",
      "game.scoreMissLabel": "Miss, zero points", "game.pointsLabel": "{score} points", "game.selected": "Selected:",
      "game.submitFinish": "Record score & finish game", "game.submitStandings": "Record score & show standings",
      "game.submitNext": "Record score & next player", "game.unavailable": "Player unavailable / substitute",
      "game.cancelSub": "Cancel substitution", "game.undo": "Undo last throw",
      "paused.eyebrow": "Game paused", "paused.title": "No active players",
      "paused.lead": "Open a team above and return a player to the game, or add a new player.",
      "standings.roundComplete": "Round {round} complete", "standings.title": "Current standings",
      "standings.lead": "Every player’s turn has been completed, and every team has finished the same number of team turns. Take a moment to review the scores.",
      "standings.next": "Start round {round}",
      "results.multipleReached": "Multiple teams reached exactly 50", "results.exactly50": "Exactly 50 points",
      "results.multipleWinners": "We have multiple winners", "results.wins": "{team} wins",
      "results.finalScore": "Final score: 50", "results.finalStandings": "Final standings",
      "results.awards": "Game awards", "results.teamStats": "Team statistics", "results.progression": "Score progression",
      "results.progressionHelp": "Each line shows a team’s total after each of its throws.",
      "results.throwHistory": "Throw history", "results.playAgain": "Play again with same teams",
      "results.shuffleReplay": "Shuffle teams & play again", "results.undoFinal": "Undo final throw",
      "results.newGame": "Create a new game", "results.over50": "over 50, reset to 25",
      "results.forPlayer": "for {name}", "results.contribution": "Individual score contribution",
      "summary.eyebrow": "At a glance", "summary.title": "Game summary", "summary.duration": "Game duration",
      "summary.totalThrows": "Total throws", "summary.rounds": "Rounds played",
      "stats.rawPoints": "Raw points", "stats.totalThrows": "Total throws", "stats.average": "Average throw",
      "stats.busts": "Busts", "stats.misses": "Misses", "stats.spread": "Throw spread",
      "stats.noRealThrows": "No real-player throws", "stats.mvp.one": "Team MVP", "stats.mvp.other": "Team MVPs",
      "session.eyebrow": "Session scoreboard", "session.title": "Rematch history", "session.noWinner": "No winner",
      "session.game": "Game {number}",
      "chart.aria": "Team score progression graph", "chart.axis": "Throws by each team", "chart.bustReset": "Bust reset",
      "chart.bustTitle": "{team} bust in round {round}: {previous} + {score}, reset to 25",
      "modal.addTitle": "Add player", "modal.cancel": "Cancel", "modal.teamSettings": "Team settings",
      "modal.renameTitle": "Rename team", "modal.teamName": "Team name", "modal.saveName": "Save name",
      "modal.subTitle": "Substitute for {name}", "modal.subLead": "Choose how to cover this team turn.",
      "modal.useTeammate": "Use next teammate", "modal.teammateAvailable": "{next} throws now. {skipped} is queued first for {team}’s next turn.",
      "modal.noTeammate": "No other non-deferred teammate is currently available for this option.",
      "modal.useGuest": "Use external Guest", "modal.guestCopy": "Guest throws for {name}. The team receives the score, but the player receives no individual points or throw.",
      "confirm.newGame": "Start a new game? The current teams and scores will be cleared.",
      "award.mvp.one": "MVP", "award.mvp.other": "MVPs", "award.mvp.desc": "Highest net individual score.",
      "award.round.one": "Round Royals", "award.round.other": "Round Royals", "award.round.desc": "Highest combined team score in one round.",
      "award.front.one": "Front-Runners", "award.front.other": "Front-Runners", "award.front.desc": "Held first place after the most throws.",
      "award.closer.one": "Closer", "award.closer.other": "Closers", "award.closer.desc": "Delivered a throw that put a winning team on 50.",
      "award.comeback.one": "Comeback Crew", "award.comeback.other": "Comeback Crews", "award.comeback.desc": "Recovered from the largest deficit to the current leader.",
      "award.steady.one": "Steady Hand", "award.steady.other": "Steady Hands", "award.steady.desc": "Smallest variation between raw throw scores.",
      "award.bust.one": "Bust Brigade", "award.bust.other": "Bust Brigades", "award.bust.desc": "Most team resets from going over 50.",
      "award.hot.one": "Hot Hand", "award.hot.other": "Hot Hands", "award.hot.desc": "Highest average raw score per throw.",
      "award.engine.one": "Team Engine", "award.engine.other": "Team Engines", "award.engine.desc": "Contributed the largest share of their team’s net score.",
      "award.dodger.one": "Pin Dodger", "award.dodger.other": "Pin Dodgers", "award.dodger.desc": "Recorded the most zero-point throws."
    },
    no: {
      "app.title": "Mölkky-poengtavle",
      "app.description": "En enkel og mobilvennlig poengteller for Mölkky.",
      "language.label": "Visningsspråk",
      "language.english": "English",
      "language.norwegian": "Norsk",
      "brand.default": "Rask og oversiktlig poengføring for Mölkky.",
      "brand.setup": "Sett opp lagene, legg til spillere og hold enkelt oversikt over hvert kast.",
      "brand.players": "Fordel spillere automatisk til laget med færrest spillere, eller velg lag selv.",
      "color.red": "Rød", "color.blue": "Blå", "color.green": "Grønn", "color.yellow": "Gul",
      "color.purple": "Lilla", "color.orange": "Oransje", "color.pink": "Rosa", "color.cyan": "Turkis",
      "color.lime": "Limegrønn", "color.brown": "Brun",
      "team.default": "{color} lag",
      "team.default.red": "Rødt lag", "team.default.blue": "Blått lag",
      "team.default.green": "Grønt lag", "team.default.yellow": "Gult lag",
      "team.default.purple": "Lilla lag", "team.default.orange": "Oransje lag",
      "team.default.pink": "Rosa lag", "team.default.cyan": "Turkist lag",
      "team.default.lime": "Limegrønt lag", "team.default.brown": "Brunt lag",
      "team.award": "Lagutmerkelse",
      "guest": "Gjest",
      "unit.point.one": "poeng", "unit.point.other": "poeng",
      "unit.player.one": "spiller", "unit.player.other": "spillere",
      "unit.throw.one": "kast", "unit.throw.other": "kast",
      "unit.turn.one": "tur", "unit.turn.other": "turer",
      "unit.win.one": "seier", "unit.win.other": "seire",
      "unit.bust.one": "tilbakestilling", "unit.bust.other": "tilbakestillinger",
      "unit.miss.one": "bom", "unit.miss.other": "bom",
      "unit.throwLed.one": "kast i tet", "unit.throwLed.other": "kast i tet",
      "value.average": "{value} i snitt", "value.spread": "{value} i spenn", "value.share": "{value} % andel",
      "value.recovery": "hentet inn {value} poeng", "value.finalBlow": "Avgjørende kast",
      "value.round": "Runde {round}", "value.multipleRounds": "Flere runder",
      "stage.one": "Steg 1 av 3", "stage.two": "Steg 2 av 3",
      "teamCount.title": "Hvor mange lag spiller?",
      "teamCount.lead": "Velg mellom {min} og {max} lag. Hvert lag får eget navn og egen farge.",
      "teamCount.number": "Antall lag", "teamCount.remove": "Fjern ett lag", "teamCount.add": "Legg til ett lag",
      "teamCount.continue": "Gå videre til spillere",
      "setup.title": "Legg til spillerne",
      "setup.lead": "Automatisk fordeling er valgt som standard og legger neste spiller på laget med færrest spillere. Du kan også velge et bestemt lag selv.",
      "setup.playerName": "Spillernavn", "setup.enterName": "Skriv inn et navn", "setup.assignment": "Velg lag",
      "setup.autoFill": "Automatisk · færrest på laget", "setup.addPlayer": "Legg til spiller", "setup.noPlayers": "Ingen spillere lagt til ennå.",
      "setup.removePlayer": "Fjern {name}", "setup.renameTeam": "Gi {team} nytt navn", "setup.deleteTeam": "Slett {team}",
      "setup.addTeam": "Legg til et lag", "setup.shuffle": "Bland lagene", "setup.back": "Tilbake",
      "setup.start": "Ferdig — start spillet", "setup.emptyTeams": "Legg til minst én spiller på {teams}.",
      "scoreboard.label": "Lagstilling", "scoreboard.remove": "Ta ut", "scoreboard.return": "Sett inn",
      "scoreboard.fromGame": "av spillet", "scoreboard.toGame": "i spillet",
      "scoreboard.markUnavailable": "Ta ut av spillet", "scoreboard.returnToGame": "Sett tilbake i spillet",
      "game.roundThrow": "Runde {round} · Kast {throw}", "game.deferred": "{count} utsatt {unit}",
      "game.finalTurns": "Siste lagturer", "game.new": "Nytt spill", "game.throwingFor": "Kaster for {name}",
      "game.deferredNote": "{name} ble utsatt og står først i lagets kø.",
      "game.teamTotal": "Lagpoeng: {score} / 50", "game.scoreTitle": "Hvor mange poeng ble det?",
      "game.scoreHelp": "Velg 0 for bom, eller 1–12 for kastet.", "game.selectScore": "Velg poeng",
      "game.scoreMissLabel": "Bom, null poeng", "game.pointsLabel": "{score} poeng", "game.selected": "Valgt:",
      "game.submitFinish": "Registrer og avslutt spillet", "game.submitStandings": "Registrer og vis stillingen",
      "game.submitNext": "Registrer og gå til neste spiller", "game.unavailable": "Spiller utilgjengelig / bruk innbytter",
      "game.cancelSub": "Avbryt innbytte", "game.undo": "Angre siste kast",
      "paused.eyebrow": "Spillet er satt på pause", "paused.title": "Ingen aktive spillere",
      "paused.lead": "Åpne et lag over og sett en spiller tilbake i spillet, eller legg til en ny spiller.",
      "standings.roundComplete": "Runde {round} fullført", "standings.title": "Stillingen nå",
      "standings.lead": "Alle spillerne har fått kastet, og alle lag har hatt like mange lagturer. Ta en liten pause og gå gjennom poengene.",
      "standings.next": "Start runde {round}",
      "results.multipleReached": "Flere lag endte på nøyaktig 50 poeng", "results.exactly50": "Nøyaktig 50 poeng",
      "results.multipleWinners": "Flere lag vinner", "results.wins": "{team} vinner",
      "results.finalScore": "Sluttpoeng: 50", "results.finalStandings": "Sluttstilling",
      "results.awards": "Utmerkelser", "results.teamStats": "Lagstatistikk", "results.progression": "Poengutvikling",
      "results.progressionHelp": "Hver linje viser lagets poengsum etter hvert kast.",
      "results.throwHistory": "Kasthistorikk", "results.playAgain": "Spill om igjen med samme lag",
      "results.shuffleReplay": "Bland lagene og spill om igjen", "results.undoFinal": "Angre siste kast",
      "results.newGame": "Start et nytt spill", "results.over50": "over 50, tilbake til 25",
      "results.forPlayer": "for {name}", "results.contribution": "Bidrag til spillerens poengsum",
      "summary.eyebrow": "Kort oppsummert", "summary.title": "Spillsammendrag", "summary.duration": "Spilletid",
      "summary.totalThrows": "Totalt antall kast", "summary.rounds": "Runder spilt",
      "stats.rawPoints": "Totalt scorede poeng", "stats.totalThrows": "Totalt antall kast", "stats.average": "Poeng per kast",
      "stats.busts": "Ganger over 50", "stats.misses": "Bomkast", "stats.spread": "Kastespenn",
      "stats.noRealThrows": "Ingen kast fra lagets spillere", "stats.mvp.one": "Lagets beste spiller", "stats.mvp.other": "Lagets beste spillere",
      "session.eyebrow": "Denne økten", "session.title": "Omkamper", "session.noWinner": "Ingen vinner",
      "session.game": "Spill {number}",
      "chart.aria": "Graf over lagenes poengutvikling", "chart.axis": "Kast per lag", "chart.bustReset": "Tilbake til 25",
      "chart.bustTitle": "{team} gikk over 50 i runde {round}: {previous} + {score}, og ble satt tilbake til 25",
      "modal.addTitle": "Legg til spiller", "modal.cancel": "Avbryt", "modal.teamSettings": "Laginnstillinger",
      "modal.renameTitle": "Gi laget nytt navn", "modal.teamName": "Lagnavn", "modal.saveName": "Lagre navn",
      "modal.subTitle": "Innbytter for {name}", "modal.subLead": "Velg hvem som skal ta lagets kast.",
      "modal.useTeammate": "La neste lagkamerat kaste", "modal.teammateAvailable": "{next} kaster nå. {skipped} står først i køen neste gang {team} skal kaste.",
      "modal.noTeammate": "Ingen andre tilgjengelige lagkamerater kan ta kastet akkurat nå.",
      "modal.useGuest": "La en gjest kaste", "modal.guestCopy": "En gjest kaster for {name}. Laget får poengene, men kastet og poengene føres ikke på spilleren.",
      "confirm.newGame": "Vil du starte et nytt spill? Lagene og poengene i dette spillet blir slettet.",
      "award.mvp.one": "Banens beste", "award.mvp.other": "Banens beste", "award.mvp.desc": "Høyest individuell poengsum etter eventuelle trekk.",
      "award.round.one": "Rundeherskerne", "award.round.other": "Rundeherskerne", "award.round.desc": "Høyest samlet lagpoeng i én runde.",
      "award.front.one": "Frontløperne", "award.front.other": "Frontløperne", "award.front.desc": "Lå på førsteplass etter flest kast.",
      "award.closer.one": "Avslutteren", "award.closer.other": "Avslutterne", "award.closer.desc": "Leverte kastet som satte et vinnerlag på 50.",
      "award.comeback.one": "Comeback-gjengen", "award.comeback.other": "Comeback-gjengene", "award.comeback.desc": "Hentet inn det største poenggapet til lederen.",
      "award.steady.one": "Stø hånd", "award.steady.other": "Stødige hender", "award.steady.desc": "Jevnest poengsummer fra kast til kast.",
      "award.bust.one": "25-klubben", "award.bust.other": "25-klubbene", "award.bust.desc": "Gikk over 50 flest ganger.",
      "award.hot.one": "Varm hånd", "award.hot.other": "Varme hender", "award.hot.desc": "Høyest gjennomsnittspoeng per kast.",
      "award.engine.one": "Lagmotoren", "award.engine.other": "Lagmotorene", "award.engine.desc": "Sto for den største andelen av lagets poengsum.",
      "award.dodger.one": "Pinneunnvikeren", "award.dodger.other": "Pinneunnvikerne", "award.dodger.desc": "Flest kast med null poeng."
    }
  };

  function getDefaultLanguage() {
    const browserLanguage = String(navigator.language || "en").toLowerCase();
    return browserLanguage.startsWith("no") || browserLanguage.startsWith("nb") || browserLanguage.startsWith("nn") ? "no" : "en";
  }

  function t(key, values = {}) {
    const language = state?.language && SUPPORTED_LANGUAGES.includes(state.language) ? state.language : getDefaultLanguage();
    const template = TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en[key] ?? key;
    return String(template).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
  }

  function unit(key, count) {
    return t(`unit.${key}.${Math.abs(Number(count)) === 1 ? "one" : "other"}`);
  }

  function currentLocale() {
    return LANGUAGE_LOCALES[state?.language] || LANGUAGE_LOCALES.en;
  }

  function formatNumber(value, options = {}) {
    return new Intl.NumberFormat(currentLocale(), options).format(value);
  }

  const AWARD_CRITERIA = {
    bestAverageMinThrows: 3,
    consistencyMinThrows: 3,
    comebackMinPoints: 15,
    unfortunateMinBusts: 2,
    mostMissesMinMisses: 3,
    teamCarryMinShare: 0.6,
    teamCarryMinPoints: 10,
    teamCarryMinThrows: 3
  };

  const app = document.getElementById("app");
  let selectedScore = null;
  let setupError = "";
  let openScoreboardTeamId = null;
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
      selectedSetupTeamId: "auto",
      turnOverride: null,
      pendingTurnSnapshot: null,
      gameStartedAt: null,
      gameEndedAt: null,
      currentGameId: null,
      sessionGames: [],
      language: getDefaultLanguage()
    };
  }

  function createTeam(index) {
    const style = TEAM_STYLES[index];
    if (!style) return null;
    const teamId = makeId("team");
    return {
      id: teamId,
      name: `Team ${style.label}`,
      customName: false,
      styleKey: style.key,
      color: style.color,
      soft: style.soft,
      total: 0,
      currentPlayerIndex: 0,
      deferredPlayerQueue: [],
      guestId: `guest-${teamId}`,
      players: []
    };
  }

  function createTeams(count) {
    return Array.from({ length: count }, (_, index) => createTeam(index)).filter(Boolean);
  }

  function getNextAvailableTeamStyleIndex() {
    const usedColors = new Set(state.teams.map((team) => team.color));
    return TEAM_STYLES.findIndex((style) => !usedColors.has(style.color));
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
    saved.winnerId = saved.winnerId || null;
    saved.selectedSetupTeamId = saved.selectedSetupTeamId || "auto";
    saved.turnOverride = saved.turnOverride && typeof saved.turnOverride === "object"
      ? saved.turnOverride
      : null;
    saved.pendingTurnSnapshot = saved.pendingTurnSnapshot && typeof saved.pendingTurnSnapshot === "object"
      ? saved.pendingTurnSnapshot
      : null;
    saved.gameStartedAt = Number.isFinite(saved.gameStartedAt) ? saved.gameStartedAt : null;
    saved.gameEndedAt = Number.isFinite(saved.gameEndedAt) ? saved.gameEndedAt : null;
    saved.currentGameId = saved.currentGameId || null;
    saved.sessionGames = Array.isArray(saved.sessionGames) ? saved.sessionGames : [];
    saved.language = SUPPORTED_LANGUAGES.includes(saved.language) ? saved.language : getDefaultLanguage();

    if (!Array.isArray(saved.history)) saved.history = [];
    saved.history.forEach((entry) => {
      entry.isGuest = Boolean(entry.isGuest);
      const score = Number(entry.score) || 0;
      const previousTotal = Number(entry.previousTotal) || 0;
      entry.contribution = entry.exceededFifty
        ? getThrowContribution(previousTotal, score)
        : (Number.isFinite(entry.contribution) ? entry.contribution : score);
    });

    if (!Array.isArray(saved.teams)) saved.teams = [];
    saved.teams.forEach((team) => {
      const style = TEAM_STYLES.find((candidate) => candidate.color === team.color);
      team.styleKey = team.styleKey || style?.key || null;
      if (typeof team.customName !== "boolean") {
        team.customName = !style || team.name !== `Team ${style.label}`;
      }
      team.currentPlayerIndex = Number.isInteger(team.currentPlayerIndex)
        ? team.currentPlayerIndex
        : 0;
      team.guestId = team.guestId || `guest-${team.id}`;
      team.deferredPlayerQueue = Array.isArray(team.deferredPlayerQueue)
        ? [...new Set(team.deferredPlayerQueue)]
        : [];
      if (!Array.isArray(team.players)) team.players = [];

      team.players.forEach((player) => {
        player.hasPlayed = Boolean(player.hasPlayed);
        player.active = player.active !== false;
      });

      cleanDeferredQueueForTeamData(team);

      if (team.players.length) {
        team.currentPlayerIndex = ((team.currentPlayerIndex % team.players.length) + team.players.length) % team.players.length;
      } else {
        team.currentPlayerIndex = 0;
      }
    });

    if (saved.teams.length) {
      saved.currentTeamIndex = ((saved.currentTeamIndex % saved.teams.length) + saved.teams.length) % saved.teams.length;
    } else {
      saved.currentTeamIndex = 0;
    }

    if (!saved.gameStartedAt && saved.history.length) {
      saved.gameStartedAt = Number(saved.history[0].timestamp) || Date.now();
    }
    if (saved.view === "finished" && !saved.gameEndedAt && saved.history.length) {
      saved.gameEndedAt = Number(saved.history[saved.history.length - 1].timestamp) || Date.now();
    }
    if ((saved.view === "game" || saved.view === "standings" || saved.view === "finished") && !saved.currentGameId) {
      saved.currentGameId = makeId("game");
    }

    delete saved.currentTurnIndex;
    return saved;
  }

  function cleanDeferredQueueForTeamData(team) {
    const activeIds = new Set(team.players.filter((player) => player.active !== false).map((player) => player.id));
    team.deferredPlayerQueue = [...new Set(team.deferredPlayerQueue || [])].filter((playerId) => activeIds.has(playerId));
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

  function parseHexColor(hex) {
    const normalized = String(hex).replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(normalized)) return { r: 104, g: 113, b: 109 };
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function toHexChannel(value) {
    return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
  }

  function averageTeamColor(teams) {
    if (!teams.length) return "#68716d";
    const total = teams.reduce((sum, team) => {
      const color = parseHexColor(team.color);
      return { r: sum.r + color.r, g: sum.g + color.g, b: sum.b + color.b };
    }, { r: 0, g: 0, b: 0 });
    return `#${toHexChannel(total.r / teams.length)}${toHexChannel(total.g / teams.length)}${toHexChannel(total.b / teams.length)}`;
  }

  function softenColor(hex, whiteRatio = 0.9) {
    const color = parseHexColor(hex);
    const mix = (channel) => channel * (1 - whiteRatio) + 255 * whiteRatio;
    return `#${toHexChannel(mix(color.r))}${toHexChannel(mix(color.g))}${toHexChannel(mix(color.b))}`;
  }

  function getTeam(teamId) {
    return state.teams.find((team) => team.id === teamId);
  }

  function getTeamDisplayName(team) {
    if (!team) return "";
    if (team.customName) return team.name;
    const style = TEAM_STYLES.find((candidate) => candidate.key === team.styleKey)
      || TEAM_STYLES.find((candidate) => candidate.color === team.color);
    if (!style) return team.name;
    const localizedDefault = t(`team.default.${style.key}`);
    return localizedDefault === `team.default.${style.key}`
      ? t("team.default", { color: t(`color.${style.key}`) })
      : localizedDefault;
  }

  function getRecordedTeamName(record) {
    const liveTeam = record?.id ? getTeam(record.id) : null;
    return liveTeam ? getTeamDisplayName(liveTeam) : (record?.name || "");
  }

  function getPlayer(team, playerId) {
    return team?.players.find((player) => player.id === playerId);
  }

  function getGuest(team) {
    return {
      id: team.guestId,
      name: t("guest"),
      isGuest: true
    };
  }

  function cleanDeferredQueue(team) {
    cleanDeferredQueueForTeamData(team);
  }

  function getActivePlayers(team) {
    return team.players.filter((player) => player.active !== false);
  }

  function getNextActivePlayerIndex(team, startIndex = 0, excludedIds = new Set()) {
    if (!team.players.length) return -1;

    for (let offset = 0; offset < team.players.length; offset += 1) {
      const index = (startIndex + offset + team.players.length) % team.players.length;
      const player = team.players[index];
      if (player.active !== false && !excludedIds.has(player.id)) return index;
    }
    return -1;
  }

  function getBaseTurn(team) {
    if (!team || !getActivePlayers(team).length) return null;
    cleanDeferredQueue(team);

    const deferredPlayer = getPlayer(team, team.deferredPlayerQueue[0]);
    if (deferredPlayer && deferredPlayer.active !== false) {
      return {
        team,
        actor: deferredPlayer,
        actorType: "player",
        coveragePlayer: deferredPlayer,
        consumeSource: "queue",
        substitutingForName: null
      };
    }

    const nextIndex = getNextActivePlayerIndex(team, team.currentPlayerIndex);
    if (nextIndex < 0) return null;
    team.currentPlayerIndex = nextIndex;

    const player = team.players[nextIndex];
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
      if (!coveragePlayer || coveragePlayer.active === false) {
        state.turnOverride = null;
        state.pendingTurnSnapshot = null;
        return getBaseTurn(team);
      }

      const actor = override.actorType === "guest"
        ? getGuest(team)
        : getPlayer(team, override.actorPlayerId);

      if (!actor || (override.actorType !== "guest" && actor.active === false)) {
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
    const activePlayers = state.teams.flatMap((team) => getActivePlayers(team));
    return activePlayers.length > 0 && activePlayers.every((player) => player.hasPlayed);
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
      winnerId: state.winnerId,
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
    state.winnerId = snapshot.winnerId || null;
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
    return `${formatNumber(value)} ${unit("point", value)}`;
  }

  function getThrowContribution(previousTotal, score) {
    return previousTotal + score > 50
      ? Math.max(0, 50 - previousTotal) - 25
      : score;
  }

  function getGuestStats(team) {
    return getPlayerStats(team.guestId);
  }

  function getRealPlayerEntries(playerId) {
    return state.history.filter((entry) => !entry.isGuest && entry.playerId === playerId);
  }

  function getPlayerCandidates() {
    return state.teams.flatMap((team) => team.players.map((player) => {
      const entries = getRealPlayerEntries(player.id);
      return {
        id: player.id,
        team,
        player,
        entries,
        stats: {
          throws: entries.length,
          scored: entries.reduce((sum, entry) => sum + entry.contribution, 0),
          rawScored: entries.reduce((sum, entry) => sum + entry.score, 0),
          misses: entries.filter((entry) => entry.score === 0).length,
          busts: entries.filter((entry) => entry.exceededFifty).length
        }
      };
    }));
  }

  function nearlyEqual(a, b, epsilon = 1e-9) {
    return Math.abs(a - b) <= epsilon;
  }

  function signedPointTotal(value) {
    if (value > 0) return `+${value}`;
    if (value < 0) return `−${Math.abs(value)}`;
    return "0";
  }

  function formatDuration(milliseconds) {
    const totalSeconds = Math.max(0, Math.round((Number(milliseconds) || 0) / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours) return `${hours}h ${minutes}m`;
    if (minutes) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }

  function getGameDurationMs() {
    const startedAt = state.gameStartedAt || state.history[0]?.timestamp || Date.now();
    const endedAt = state.gameEndedAt || state.history[state.history.length - 1]?.timestamp || Date.now();
    return Math.max(0, endedAt - startedAt);
  }

  function getStandardDeviation(values) {
    if (!values.length) return 0;
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  function makePlayerRecipients(candidates) {
    return candidates.map((candidate) => ({
      id: candidate.player.id,
      name: candidate.player.name,
      subtitle: getTeamDisplayName(candidate.team),
      color: candidate.team.color,
      soft: candidate.team.soft
    }));
  }

  function makeTeamRecipients(candidates) {
    return candidates.map((candidate) => {
      const team = candidate.team || candidate;
      return {
        id: team.id,
        name: getTeamDisplayName(team),
        subtitle: t("team.award"),
        color: team.color,
        soft: team.soft
      };
    });
  }

  function getMvpAward() {
    const candidates = getPlayerCandidates().filter((candidate) => candidate.stats.throws > 0);
    if (!candidates.length) return null;
    const bestScore = Math.max(...candidates.map((candidate) => candidate.stats.scored));
    const winners = candidates.filter((candidate) => candidate.stats.scored === bestScore);
    return {
      id: "mvp",
      domain: "player",
      mandatory: true,
      singular: t("award.mvp.one"),
      plural: t("award.mvp.other"),
      description: t("award.mvp.desc"),
      criteria: "All real players with at least one throw; Guest is excluded.",
      recipients: makePlayerRecipients(winners),
      value: formatPointTotal(bestScore)
    };
  }

  function getBestRoundAward() {
    const totals = new Map();
    state.history.forEach((entry) => {
      const key = `${entry.teamId}::${entry.round}`;
      totals.set(key, (totals.get(key) || 0) + entry.score);
    });

    const candidates = [];
    totals.forEach((score, key) => {
      const [teamId, roundText] = key.split("::");
      const team = getTeam(teamId);
      if (team) candidates.push({ team, round: Number(roundText), score });
    });

    if (!candidates.length) {
      const fallbackTeams = state.teams.length ? state.teams : [];
      return fallbackTeams.length ? {
        id: "best-round",
        domain: "team",
        mandatory: true,
        singular: t("award.round.one"),
        plural: t("award.round.other"),
        description: t("award.round.desc"),
        criteria: "Always awarded to the top team round; raw throw scores are added together.",
        recipients: makeTeamRecipients(fallbackTeams),
        value: formatPointTotal(0)
      } : null;
    }

    const bestScore = Math.max(...candidates.map((candidate) => candidate.score));
    const winningRounds = candidates.filter((candidate) => candidate.score === bestScore);
    const bestByTeam = new Map();
    winningRounds.forEach((candidate) => {
      if (!bestByTeam.has(candidate.team.id)) bestByTeam.set(candidate.team.id, candidate);
    });
    const winners = [...bestByTeam.values()];
    const roundLabels = [...new Set(winners.map((winner) => winner.round))];
    return {
      id: "best-round",
      domain: "team",
      mandatory: true,
      singular: t("award.round.one"),
      plural: t("award.round.other"),
      description: t("award.round.desc"),
      criteria: "Always awarded to the top team round; raw throw scores are added together.",
      recipients: makeTeamRecipients(winners),
      value: `${formatPointTotal(bestScore)} · ${roundLabels.length === 1 ? t("value.round", { round: roundLabels[0] }) : t("value.multipleRounds")}`
    };
  }

  function getCloserAward() {
    const winningTeamIds = new Set(getWinningTeams().map((team) => team.id));
    const candidates = [];
    const seenPlayers = new Set();
    state.history.forEach((entry) => {
      if (!entry.isGuest && entry.resultingTotal === 50 && winningTeamIds.has(entry.teamId) && !seenPlayers.has(entry.playerId)) {
        const team = getTeam(entry.teamId);
        const player = getPlayer(team, entry.playerId);
        if (team && player) {
          candidates.push({ team, player });
          seenPlayers.add(player.id);
        }
      }
    });
    if (!candidates.length) return null;
    return {
      id: "closer",
      domain: "player",
      singular: t("award.closer.one"),
      plural: t("award.closer.other"),
      description: t("award.closer.desc"),
      criteria: "The throw must finish a team on exactly 50; Guest throws are excluded.",
      recipients: makePlayerRecipients(candidates),
      value: t("value.finalBlow")
    };
  }

  function getBestAverageAward() {
    const candidates = getPlayerCandidates()
      .filter((candidate) => candidate.stats.throws >= AWARD_CRITERIA.bestAverageMinThrows)
      .map((candidate) => ({ ...candidate, average: candidate.stats.rawScored / candidate.stats.throws }));
    if (!candidates.length) return null;
    const best = Math.max(...candidates.map((candidate) => candidate.average));
    const winners = candidates.filter((candidate) => nearlyEqual(candidate.average, best));
    return {
      id: "best-average",
      domain: "player",
      singular: t("award.hot.one"),
      plural: t("award.hot.other"),
      description: t("award.hot.desc"),
      criteria: `At least ${AWARD_CRITERIA.bestAverageMinThrows} throws; bust penalties do not alter the raw throw average.`,
      recipients: makePlayerRecipients(winners),
      value: t("value.average", { value: formatNumber(best, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) })
    };
  }

  function getModeInfo(scores) {
    const counts = new Map();
    scores.forEach((score) => counts.set(score, (counts.get(score) || 0) + 1));
    const highestFrequency = Math.max(0, ...counts.values());
    return {
      highestFrequency,
      modes: [...counts.entries()].filter(([, count]) => count === highestFrequency).map(([score]) => score)
    };
  }

  function getConsistencyAward() {
    const candidates = getPlayerCandidates()
      .filter((candidate) => candidate.stats.throws >= AWARD_CRITERIA.consistencyMinThrows)
      .map((candidate) => {
        const scores = candidate.entries.map((entry) => entry.score);
        const modeInfo = getModeInfo(scores);
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + ((score - mean) ** 2), 0) / scores.length;
        return { ...candidate, modeInfo, deviation: Math.sqrt(variance) };
      })
      .filter((candidate) => !candidate.modeInfo.modes.includes(0));
    if (!candidates.length) return null;
    const best = Math.min(...candidates.map((candidate) => candidate.deviation));
    const winners = candidates.filter((candidate) => nearlyEqual(candidate.deviation, best));
    return {
      id: "consistency",
      domain: "player",
      singular: t("award.steady.one"),
      plural: t("award.steady.other"),
      description: t("award.steady.desc"),
      criteria: `At least ${AWARD_CRITERIA.consistencyMinThrows} throws, and 0 must not be one of the player’s modes.`,
      recipients: makePlayerRecipients(winners),
      value: t("value.spread", { value: formatNumber(best, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })
    };
  }

  function getMostUnfortunateAward() {
    const candidates = state.teams
      .map((team) => ({
        team,
        busts: state.history.filter((entry) => entry.teamId === team.id && entry.exceededFifty).length
      }))
      .filter((candidate) => candidate.busts >= AWARD_CRITERIA.unfortunateMinBusts);
    if (!candidates.length) return null;
    const mostBusts = Math.max(...candidates.map((candidate) => candidate.busts));
    const winners = candidates.filter((candidate) => candidate.busts === mostBusts);
    return {
      id: "unfortunate",
      domain: "team",
      singular: t("award.bust.one"),
      plural: t("award.bust.other"),
      description: t("award.bust.desc"),
      criteria: `At least ${AWARD_CRITERIA.unfortunateMinBusts} over-50 resets by the team.`,
      recipients: makeTeamRecipients(winners),
      value: `${formatNumber(mostBusts)} ${unit("bust", mostBusts)}`
    };
  }

  function getMostMissesAward() {
    const candidates = getPlayerCandidates().filter((candidate) => candidate.stats.misses >= AWARD_CRITERIA.mostMissesMinMisses);
    if (!candidates.length) return null;
    const mostMisses = Math.max(...candidates.map((candidate) => candidate.stats.misses));
    const winners = candidates.filter((candidate) => candidate.stats.misses === mostMisses);
    return {
      id: "misses",
      domain: "player",
      singular: t("award.dodger.one"),
      plural: t("award.dodger.other"),
      description: t("award.dodger.desc"),
      criteria: `At least ${AWARD_CRITERIA.mostMissesMinMisses} misses.`,
      recipients: makePlayerRecipients(winners),
      value: `${formatNumber(mostMisses)} ${unit("miss", mostMisses)}`
    };
  }

  function getTeamCarryAward() {
    const candidates = getPlayerCandidates()
      .filter((candidate) => candidate.team.total > 0)
      .map((candidate) => ({ ...candidate, share: candidate.stats.scored / candidate.team.total }))
      .filter((candidate) =>
        candidate.stats.throws >= AWARD_CRITERIA.teamCarryMinThrows &&
        candidate.stats.scored >= AWARD_CRITERIA.teamCarryMinPoints &&
        candidate.share >= AWARD_CRITERIA.teamCarryMinShare
      );
    if (!candidates.length) return null;
    const best = Math.max(...candidates.map((candidate) => candidate.share));
    const winners = candidates.filter((candidate) => nearlyEqual(candidate.share, best));
    return {
      id: "team-carry",
      domain: "player",
      singular: t("award.engine.one"),
      plural: t("award.engine.other"),
      description: t("award.engine.desc"),
      criteria: `At least ${Math.round(AWARD_CRITERIA.teamCarryMinShare * 100)}% of the team score, ${AWARD_CRITERIA.teamCarryMinPoints} net points, and ${AWARD_CRITERIA.teamCarryMinThrows} throws.`,
      recipients: makePlayerRecipients(winners),
      value: t("value.share", { value: formatNumber(Math.round(best * 100)) })
    };
  }

  function getComebackAward() {
    const runningTotals = new Map(state.teams.map((team) => [team.id, 0]));
    const maxDeficits = new Map(state.teams.map((team) => [team.id, 0]));
    const recoveries = new Map(state.teams.map((team) => [team.id, 0]));

    state.history.forEach((entry) => {
      runningTotals.set(entry.teamId, entry.resultingTotal);
      const leaderScore = Math.max(...runningTotals.values());
      state.teams.forEach((team) => {
        const deficit = leaderScore - (runningTotals.get(team.id) || 0);
        const previousMax = maxDeficits.get(team.id) || 0;
        maxDeficits.set(team.id, Math.max(previousMax, deficit));
        recoveries.set(team.id, Math.max(recoveries.get(team.id) || 0, previousMax - deficit));
      });
    });

    const candidates = state.teams
      .map((team) => ({ team, recovery: recoveries.get(team.id) || 0 }))
      .filter((candidate) => candidate.recovery >= AWARD_CRITERIA.comebackMinPoints);
    if (!candidates.length) return null;
    const best = Math.max(...candidates.map((candidate) => candidate.recovery));
    const winners = candidates.filter((candidate) => candidate.recovery === best);
    return {
      id: "comeback",
      domain: "team",
      singular: t("award.comeback.one"),
      plural: t("award.comeback.other"),
      description: t("award.comeback.desc"),
      criteria: `Must erase at least ${AWARD_CRITERIA.comebackMinPoints} points of an earlier deficit.`,
      recipients: makeTeamRecipients(winners),
      value: t("value.recovery", { value: formatNumber(best) })
    };
  }

  function getFrontRunnersAward() {
    if (!state.history.length || !state.teams.length) return null;
    const runningTotals = new Map(state.teams.map((team) => [team.id, 0]));
    const leadSnapshots = new Map(state.teams.map((team) => [team.id, 0]));

    state.history.forEach((entry) => {
      runningTotals.set(entry.teamId, entry.resultingTotal);
      const leaderScore = Math.max(...runningTotals.values());
      if (leaderScore <= 0) return;
      state.teams.forEach((team) => {
        if ((runningTotals.get(team.id) || 0) === leaderScore) {
          leadSnapshots.set(team.id, (leadSnapshots.get(team.id) || 0) + 1);
        }
      });
    });

    const best = Math.max(...leadSnapshots.values());
    if (best <= 0) return null;
    const winners = state.teams.filter((team) => leadSnapshots.get(team.id) === best);
    return {
      id: "front-runners",
      domain: "team",
      singular: t("award.front.one"),
      plural: t("award.front.other"),
      description: t("award.front.desc"),
      criteria: "Awarded to the team or teams leading after the most recorded throws.",
      recipients: makeTeamRecipients(winners),
      value: `${formatNumber(best)} ${unit("throwLed", best)}`
    };
  }

  function selectDisplayedAwards() {
    return [
      getMvpAward(),
      getBestRoundAward(),
      getFrontRunnersAward(),
      getCloserAward(),
      getComebackAward(),
      getConsistencyAward(),
      getMostUnfortunateAward(),
      getBestAverageAward(),
      getTeamCarryAward(),
      getMostMissesAward()
    ].filter(Boolean);
  }

  function mountLanguagePicker() {
    document.documentElement.lang = state.language === "no" ? "nb" : "en";
    document.title = t("app.title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("app.description"));

    let picker = document.getElementById("languagePicker");
    if (!picker) {
      picker = document.createElement("div");
      picker.id = "languagePicker";
      picker.className = "language-picker";
      document.body.appendChild(picker);
    }
    picker.innerHTML = `
      <label class="sr-only" for="languageSelect">${escapeHtml(t("language.label"))}</label>
      <select id="languageSelect" aria-label="${escapeHtml(t("language.label"))}" title="${escapeHtml(t("language.label"))}">
        <option value="en" ${state.language === "en" ? "selected" : ""}>EN</option>
        <option value="no" ${state.language === "no" ? "selected" : ""}>NO</option>
      </select>
    `;
    picker.querySelector("select").addEventListener("change", (event) => {
      state.language = SUPPORTED_LANGUAGES.includes(event.target.value) ? event.target.value : "en";
      setupError = "";
      saveState();
      render();
    });
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
      default: {
        const language = state?.language || getDefaultLanguage();
        state = createInitialState();
        state.language = language;
        saveState();
        renderTeamCount();
      }
    }
    mountLanguagePicker();
  }

  function renderBrand(subtitle = t("brand.default")) {
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
        ${renderBrand(t("brand.setup"))}
        <section class="panel">
          <p class="eyebrow">${escapeHtml(t("stage.one"))}</p>
          <h1>${escapeHtml(t("teamCount.title"))}</h1>
          <p class="lead">${escapeHtml(t("teamCount.lead", { min: MIN_TEAMS, max: MAX_TEAMS }))}</p>

          <div class="team-stepper" aria-label="${escapeHtml(t("teamCount.number"))}">
            <button type="button" id="decreaseTeams" aria-label="${escapeHtml(t("teamCount.remove"))}">−</button>
            <div class="team-count-value" id="teamCountValue">${state.teamCount}</div>
            <button type="button" id="increaseTeams" aria-label="${escapeHtml(t("teamCount.add"))}">+</button>
          </div>

          <button type="button" class="btn btn-primary btn-block" id="continueToPlayers">${escapeHtml(t("teamCount.continue"))}</button>
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
      state.selectedSetupTeamId = "auto";
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

  function getAutoFillTeam() {
    if (!state.teams.length) return null;
    return [...state.teams].sort((a, b) => a.players.length - b.players.length || state.teams.indexOf(a) - state.teams.indexOf(b))[0];
  }

  function shuffleArray(values) {
    for (let index = values.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
    }
    return values;
  }

  function shuffleTeams() {
    const players = shuffleArray(state.teams.flatMap((team) => team.players));
    state.teams.forEach((team) => {
      team.players = [];
      team.currentPlayerIndex = 0;
      team.deferredPlayerQueue = [];
    });

    players.forEach((player) => {
      player.hasPlayed = false;
      player.active = true;
      getAutoFillTeam()?.players.push(player);
    });

    setupError = "";
    saveState();
    renderPlayerSetup();
  }

  function renderPlayerSetup() {
    if (!state.selectedSetupTeamId || (state.selectedSetupTeamId !== "auto" && !getTeam(state.selectedSetupTeamId))) {
      state.selectedSetupTeamId = "auto";
    }

    const teamOptions = `
      <option value="auto" ${state.selectedSetupTeamId === "auto" ? "selected" : ""}>${escapeHtml(t("setup.autoFill"))}</option>
      ${state.teams
        .map((team) => `<option value="${team.id}" ${team.id === state.selectedSetupTeamId ? "selected" : ""}>${escapeHtml(getTeamDisplayName(team))}</option>`)
        .join("")}
    `;

    const totalPlayers = state.teams.reduce((sum, team) => sum + team.players.length, 0);
    const teamCards = state.teams.map((team) => {
      const players = team.players.length
        ? `<ul class="player-list">${team.players.map((player) => `
            <li class="player-chip">
              <span class="player-chip-name">${escapeHtml(player.name)}</span>
              <button type="button" class="icon-button remove-player" data-team-id="${team.id}" data-player-id="${player.id}" aria-label="${escapeHtml(t("setup.removePlayer", { name: player.name }))}">×</button>
            </li>
          `).join("")}</ul>`
        : `<div class="player-list-empty">${escapeHtml(t("setup.noPlayers"))}</div>`;

      return `
        <article class="setup-team-card" style="${teamVars(team)}">
          <div class="setup-team-head">
            <div class="setup-team-title-row">
              <h3 class="setup-team-name">${escapeHtml(getTeamDisplayName(team))}</h3>
              <button type="button" class="rename-team-button" data-team-id="${team.id}" aria-label="${escapeHtml(t("setup.renameTeam", { team: getTeamDisplayName(team) }))}">
                ${pencilIcon()}
              </button>
            </div>
            <div class="setup-team-meta">
              <span class="player-count">${formatNumber(team.players.length)} ${unit("player", team.players.length)}</span>
              ${team.players.length === 0 && state.teams.length > MIN_TEAMS ? `
                <button type="button" class="delete-team-button" data-team-id="${team.id}" aria-label="${escapeHtml(t("setup.deleteTeam", { team: getTeamDisplayName(team) }))}">×</button>
              ` : ""}
            </div>
          </div>
          ${players}
        </article>
      `;
    }).join("");

    app.innerHTML = `
      <main class="app-shell">
        ${renderBrand(t("brand.players"))}
        <section class="panel">
          <p class="eyebrow">${escapeHtml(t("stage.two"))}</p>
          <h1>${escapeHtml(t("setup.title"))}</h1>
          <p class="lead">${escapeHtml(t("setup.lead"))}</p>

          <form id="playerForm" autocomplete="off">
            <div class="input-row">
              <div>
                <label class="field-label" for="playerName">${escapeHtml(t("setup.playerName"))}</label>
                <input id="playerName" name="playerName" type="text" maxlength="40" placeholder="${escapeHtml(t("setup.enterName"))}" required autofocus>
              </div>
              <div>
                <label class="field-label" for="teamSelect">${escapeHtml(t("setup.assignment"))}</label>
                <select id="teamSelect" name="teamSelect">${teamOptions}</select>
              </div>
              <button type="submit" class="btn btn-primary">${escapeHtml(t("setup.addPlayer"))}</button>
            </div>
          </form>

          ${setupError ? `<div class="notice" role="alert">${escapeHtml(setupError)}</div>` : ""}
          <div class="setup-tools">
            <button type="button" class="btn btn-secondary" id="addTeam" ${state.teams.length >= MAX_TEAMS ? "disabled" : ""}>${escapeHtml(t("setup.addTeam"))}</button>
            <button type="button" class="btn btn-secondary" id="shuffleTeams" ${totalPlayers < 2 ? "disabled" : ""}>${escapeHtml(t("setup.shuffle"))}</button>
          </div>
          <div class="setup-grid">${teamCards}</div>

          <div class="button-row">
            <button type="button" class="btn btn-secondary" id="backToTeamCount">${escapeHtml(t("setup.back"))}</button>
            <button type="button" class="btn btn-primary" id="startGame">${escapeHtml(t("setup.start"))}</button>
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
      state.selectedSetupTeamId = teamSelect.value;
      const team = teamSelect.value === "auto" ? getAutoFillTeam() : getTeam(teamSelect.value);

      if (!name || !team) return;

      team.players.push({ id: makeId("player"), name, hasPlayed: false, active: true });
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

    document.querySelectorAll(".delete-team-button").forEach((button) => {
      button.addEventListener("click", () => {
        const teamId = button.dataset.teamId;
        const team = getTeam(teamId);
        if (!team || team.players.length > 0 || state.teams.length <= MIN_TEAMS) return;

        state.teams = state.teams.filter((candidate) => candidate.id !== teamId);
        state.teamCount = state.teams.length;
        if (state.selectedSetupTeamId === teamId) state.selectedSetupTeamId = "auto";
        setupError = "";
        saveState();
        renderPlayerSetup();
      });
    });

    document.getElementById("addTeam").addEventListener("click", () => {
      if (state.teams.length >= MAX_TEAMS) return;
      const styleIndex = getNextAvailableTeamStyleIndex();
      const team = createTeam(styleIndex);
      if (!team) return;
      state.teams.push(team);
      state.teamCount = state.teams.length;
      setupError = "";
      saveState();
      renderPlayerSetup();
    });

    document.getElementById("shuffleTeams").addEventListener("click", shuffleTeams);

    document.getElementById("backToTeamCount").addEventListener("click", () => {
      state.view = "teamCount";
      state.teams = [];
      state.selectedSetupTeamId = "auto";
      setupError = "";
      saveState();
      render();
    });

    document.getElementById("startGame").addEventListener("click", () => {
      const emptyTeams = state.teams.filter((team) => team.players.length === 0);
      if (emptyTeams.length) {
        setupError = t("setup.emptyTeams", { teams: emptyTeams.map(getTeamDisplayName).join(", ") });
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
      state.gameStartedAt = Date.now();
      state.gameEndedAt = null;
      state.currentGameId = makeId("game");
      state.sessionGames = [];
      state.teams.forEach((team) => {
        team.total = 0;
        team.currentPlayerIndex = 0;
        team.deferredPlayerQueue = [];
        team.players.forEach((player) => {
          player.hasPlayed = false;
          player.active = true;
        });
      });
      setupError = "";
      saveState();
      render();
    });
  }

  function activePlayerIcon(active) {
    return active
      ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0v1H5v-1Zm14-8h5v2h-5v-2Z" fill="currentColor"/></svg>`
      : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0v1H5v-1Zm15-8v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3Z" fill="currentColor"/></svg>`;
  }

  function renderScoreboard(editable = false) {
    return `
      <div class="scoreboard-wrap ${editable ? "editable-scoreboard" : ""}">
        <div class="scoreboard" aria-label="${escapeHtml(t("scoreboard.label"))}">
          ${state.teams.map((team) => {
            const guestStats = getGuestStats(team);
            return `
              <details class="score-team" style="${teamVars(team)}" data-team-details="${team.id}" ${openScoreboardTeamId === team.id || openScoreboardTeamId === "__all__" ? "open" : ""}>
                <summary>
                  <span class="score-name">${escapeHtml(getTeamDisplayName(team))}</span>
                  <span class="score-number">${team.total}</span>
                </summary>
                <div class="score-roster-panel">
                  <ul class="score-roster">
                    ${team.players.map((player) => {
                      const stats = getPlayerStats(player.id);
                      const active = player.active !== false;
                      return `
                        <li class="score-roster-row ${active ? "" : "inactive-player-row"}">
                          <span class="score-roster-name">${escapeHtml(player.name)}</span>
                          <span class="score-roster-stat">${formatPointTotal(stats.scored)} · ${formatNumber(stats.throws)} ${unit("throw", stats.throws)}</span>
                          ${editable ? `
                            <button type="button" class="roster-toggle-button" data-team-id="${team.id}" data-player-id="${player.id}" aria-label="${escapeHtml(`${active ? t("scoreboard.remove") : t("scoreboard.return")} ${player.name} ${active ? t("scoreboard.fromGame") : t("scoreboard.toGame")}`)}" title="${escapeHtml(active ? t("scoreboard.markUnavailable") : t("scoreboard.returnToGame"))}">
                              ${activePlayerIcon(active)}
                            </button>
                          ` : ""}
                        </li>
                      `;
                    }).join("")}
                    ${guestStats.throws ? `
                      <li class="score-roster-row guest-roster-row">
                        <span class="score-roster-name guest-name">${escapeHtml(t("guest"))}</span>
                        <span class="score-roster-stat">${formatPointTotal(guestStats.scored)} · ${formatNumber(guestStats.throws)} ${unit("throw", guestStats.throws)}</span>
                        ${editable ? `<span class="roster-button-spacer" aria-hidden="true"></span>` : ""}
                      </li>
                    ` : ""}
                  </ul>
                  ${editable ? `<button type="button" class="add-live-player-button" data-team-id="${team.id}">${escapeHtml(t("setup.addPlayer"))}</button>` : ""}
                </div>
              </details>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function bindScoreboardControls(editable = false, synchronizeAll = false) {
    let synchronizing = false;
    document.querySelectorAll("[data-team-details]").forEach((details) => {
      details.addEventListener("toggle", () => {
        if (synchronizing) return;
        const teamId = details.dataset.teamDetails;

        if (synchronizeAll) {
          const shouldOpen = details.open;
          const allDetails = [...document.querySelectorAll("[data-team-details]")];
          const alreadySynchronized = allDetails.every((other) => other.open === shouldOpen);
          openScoreboardTeamId = shouldOpen ? "__all__" : null;
          if (!alreadySynchronized) {
            synchronizing = true;
            allDetails.forEach((other) => { other.open = shouldOpen; });
            synchronizing = false;
          }
          return;
        }

        if (details.open) {
          openScoreboardTeamId = teamId;
          document.querySelectorAll("[data-team-details]").forEach((other) => {
            if (other !== details) other.open = false;
          });
        } else if (openScoreboardTeamId === teamId) {
          openScoreboardTeamId = null;
        }
      });
    });

    if (!editable) return;

    document.querySelectorAll(".roster-toggle-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openScoreboardTeamId = button.dataset.teamId;
        toggleLivePlayer(button.dataset.teamId, button.dataset.playerId);
      });
    });

    document.querySelectorAll(".add-live-player-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openScoreboardTeamId = button.dataset.teamId;
        const team = getTeam(button.dataset.teamId);
        if (team) openAddPlayerDialog(team);
      });
    });
  }

  function willCompleteCoverage(turn) {
    const targetId = turn.coveragePlayer.id;
    if (turn.coveragePlayer.hasPlayed || turn.coveragePlayer.active === false) return false;
    return state.teams.every((team) =>
      getActivePlayers(team).every((player) => player.id === targetId || player.hasPlayed)
    );
  }

  function allTeamsInactive() {
    return state.teams.every((team) => getActivePlayers(team).length === 0);
  }

  function buildCompletedGameRecord() {
    const winners = getWinningTeams();
    return {
      id: state.currentGameId || makeId("game"),
      number: state.sessionGames.length + 1,
      startedAt: state.gameStartedAt || state.history[0]?.timestamp || Date.now(),
      endedAt: state.gameEndedAt || Date.now(),
      durationMs: getGameDurationMs(),
      totalThrows: state.history.length,
      winners: winners.map((team) => ({ id: team.id, name: getTeamDisplayName(team), color: team.color })),
      standings: getRankedTeams().map((team) => ({ id: team.id, name: getTeamDisplayName(team), color: team.color, score: team.total }))
    };
  }

  function recordCompletedGame() {
    if (!state.currentGameId) state.currentGameId = makeId("game");
    if (!Array.isArray(state.sessionGames)) state.sessionGames = [];
    if (state.sessionGames.some((game) => game.id === state.currentGameId)) return false;
    state.sessionGames.push(buildCompletedGameRecord());
    return true;
  }

  function finishCurrentGame() {
    state.view = "finished";
    if (!state.gameEndedAt) state.gameEndedAt = Date.now();
    recordCompletedGame();
  }

  function advanceTeamPosition() {
    const isLastTeam = state.currentTeamIndex === state.teams.length - 1;

    if (isLastTeam) {
      state.currentTeamIndex = 0;
      if (state.winnerId) {
        finishCurrentGame();
        return;
      }
      if (state.standingsPending) {
        resetPlayedMarkers();
        state.standingsPending = false;
        state.view = "standings";
        return;
      }
    } else {
      state.currentTeamIndex += 1;
    }

    state.view = "game";
  }

  function advancePastInactiveTeams() {
    if (allTeamsInactive()) return false;

    let checked = 0;
    while (state.view === "game" && checked < state.teams.length && !getCurrentTurn()) {
      advanceTeamPosition();
      checked += 1;
    }
    return state.view === "game" && Boolean(getCurrentTurn());
  }

  function renderGame() {
    if (allTeamsInactive()) {
      if (state.winnerId) {
        finishCurrentGame();
        saveState();
        render();
        return;
      }
      renderNoActivePlayers();
      return;
    }

    if (!advancePastInactiveTeams()) {
      saveState();
      render();
      return;
    }

    const turn = getCurrentTurn();
    if (!turn) {
      renderNoActivePlayers();
      return;
    }

    const { team, actor, actorType, substitutionKind, substitutingForName } = turn;
    const isGuest = actorType === "guest";
    const substitutionNote = substitutionKind === "guest" && substitutingForName
      ? escapeHtml(t("game.throwingFor", { name: substitutingForName }))
      : substitutionKind === "teammate" && substitutingForName
        ? escapeHtml(t("game.deferredNote", { name: substitutingForName }))
        : "";
    const isLastTeam = state.currentTeamIndex === state.teams.length - 1;
    const willShowStandings = !state.winnerId && isLastTeam && (state.standingsPending || willCompleteCoverage(turn));
    const queueNotice = team.deferredPlayerQueue.length
      ? `<span class="deferred-badge">${escapeHtml(t("game.deferred", { count: formatNumber(team.deferredPlayerQueue.length), unit: unit("turn", team.deferredPlayerQueue.length) }))}</span>`
      : "";
    const finalTurnNotice = state.winnerId
      ? `<span class="finish-badge">${escapeHtml(t("game.finalTurns"))}</span>`
      : "";

    app.innerHTML = `
      <main class="app-shell with-scoreboard game-screen">
        ${renderScoreboard(true)}

        <div class="game-topline">
          <div class="round-info">
            <span class="round-label">${escapeHtml(t("game.roundThrow", { round: state.round, throw: state.roundThrowIndex + 1 }))}</span>
            ${queueNotice}
            ${finalTurnNotice}
          </div>
          <button type="button" class="btn btn-secondary btn-small" id="newGame">${escapeHtml(t("game.new"))}</button>
        </div>

        <div class="play-layout">
          <section class="current-player-card ${isGuest ? "guest-current-player" : ""}" style="${teamVars(team)}">
            <p class="current-team">${escapeHtml(getTeamDisplayName(team))}</p>
            <h1 class="current-player ${isGuest ? "guest-name" : ""}">${escapeHtml(actor.name)}</h1>
            ${substitutionNote ? `<p class="substitution-note">${substitutionNote}</p>` : ""}
            <p class="current-total">${escapeHtml(t("game.teamTotal", { score: team.total }))}</p>
          </section>

          <section class="score-entry-panel" style="${teamVars(team)}">
            <h2 class="score-entry-title">${escapeHtml(t("game.scoreTitle"))}</h2>
            <p class="helper score-helper" style="text-align:center">${escapeHtml(t("game.scoreHelp"))}</p>
            <div class="score-grid" role="group" aria-label="${escapeHtml(t("game.selectScore"))}">
              ${Array.from({ length: 13 }, (_, score) => `
                <button type="button" class="score-choice" data-score="${score}" aria-label="${escapeHtml(score === 0 ? t("game.scoreMissLabel") : t("game.pointsLabel", { score }))}" aria-pressed="false">${score}</button>
              `).join("")}
            </div>
            <div class="selected-score" id="selectedScoreText">${escapeHtml(t("game.selectScore"))}</div>
            <button type="button" class="btn submit-score" id="submitScore" disabled>
              ${escapeHtml(state.winnerId && isLastTeam ? t("game.submitFinish") : willShowStandings ? t("game.submitStandings") : t("game.submitNext"))}
            </button>
            <div class="compact-secondary-actions">
              ${!isGuest ? `<button type="button" class="btn unavailable-button" id="playerUnavailable">${escapeHtml(t("game.unavailable"))}</button>` : ""}
              ${state.pendingTurnSnapshot ? `<button type="button" class="btn cancel-substitution-button" id="cancelSubstitution">${escapeHtml(t("game.cancelSub"))}</button>` : ""}
            </div>
          </section>
        </div>

        <div class="game-actions">
          <button type="button" class="btn btn-secondary btn-small" id="undoThrow" ${state.history.length ? "" : "disabled"}>${escapeHtml(t("game.undo"))}</button>
        </div>
      </main>
    `;

    bindScoreboardControls(true);

    document.querySelectorAll(".score-choice").forEach((button) => {
      button.addEventListener("click", () => {
        selectedScore = Number(button.dataset.score);
        document.querySelectorAll(".score-choice").forEach((choice) => {
          const active = choice === button;
          choice.classList.toggle("is-selected", active);
          choice.setAttribute("aria-pressed", String(active));
        });
        document.getElementById("selectedScoreText").innerHTML = `<span>${escapeHtml(t("game.selected"))}</span> <strong>${selectedScore}</strong>`;
        const submitButton = document.getElementById("submitScore");
        submitButton.disabled = false;
        const reachesFifty = team.total + selectedScore === 50;
        if (isLastTeam && (state.winnerId || reachesFifty)) {
          submitButton.textContent = t("game.submitFinish");
        } else if (!state.winnerId && willShowStandings && !reachesFifty) {
          submitButton.textContent = t("game.submitStandings");
        } else {
          submitButton.textContent = t("game.submitNext");
        }
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

  function renderNoActivePlayers() {
    app.innerHTML = `
      <main class="app-shell with-scoreboard game-screen no-active-screen">
        ${renderScoreboard(true)}
        <section class="panel no-active-panel">
          <p class="eyebrow">${escapeHtml(t("paused.eyebrow"))}</p>
          <h1>${escapeHtml(t("paused.title"))}</h1>
          <p class="lead">${escapeHtml(t("paused.lead"))}</p>
          <button type="button" class="btn btn-secondary" id="newGame">${escapeHtml(t("game.new"))}</button>
        </section>
      </main>
    `;
    bindScoreboardControls(true);
    document.getElementById("newGame").addEventListener("click", confirmNewGame);
  }

  function findNextAvailableTeammate(turn) {
    const { team, coveragePlayer, consumeSource } = turn;
    if (getActivePlayers(team).length < 2) return null;

    const currentIndex = team.players.findIndex((player) => player.id === coveragePlayer.id);
    if (currentIndex < 0) return null;

    const startIndex = consumeSource === "queue"
      ? team.currentPlayerIndex
      : (currentIndex + 1) % team.players.length;
    const unavailableIds = new Set([...team.deferredPlayerQueue, coveragePlayer.id]);
    const candidateIndex = getNextActivePlayerIndex(team, startIndex, unavailableIds);
    return candidateIndex >= 0 ? team.players[candidateIndex] : null;
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
    const contribution = getThrowContribution(previousTotal, score);
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
      teamName: getTeamDisplayName(team),
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

    if (resultingTotal === 50 && !state.winnerId) {
      state.winnerId = team.id;
      state.standingsPending = false;
    }

    if (!state.winnerId && allPlayersHavePlayed()) {
      state.standingsPending = true;
    }

    advanceTeamPosition();
    saveState();
    render();
  }

  function undoLastThrow() {
    const last = state.history.pop();
    if (!last) return;

    if (state.currentGameId && Array.isArray(state.sessionGames)) {
      state.sessionGames = state.sessionGames.filter((game) => game.id !== state.currentGameId);
    }
    state.gameEndedAt = null;

    const team = getTeam(last.teamId);
    if (team) team.total = last.previousTotal;

    state.round = last.round;
    restoreTurnState(last.turnStateBefore);
    state.view = "game";
    saveState();
    render();
  }

  function getRankedTeams() {
    return [...state.teams].sort((a, b) => b.total - a.total || getTeamDisplayName(a).localeCompare(getTeamDisplayName(b), currentLocale()));
  }

  function getWinningTeams() {
    const exactWinners = state.teams.filter((team) => team.total === 50);
    return exactWinners.length ? exactWinners : [getRankedTeams()[0]].filter(Boolean);
  }

  function standingsMarkup() {
    return `
      <ol class="standings-list">
        ${getRankedTeams().map((team, index) => `
          <li class="standing-row" style="${teamVars(team)}">
            <span class="standing-rank">${index + 1}</span>
            <span class="standing-team">${escapeHtml(getTeamDisplayName(team))}</span>
            <strong class="standing-score">${team.total}</strong>
          </li>
        `).join("")}
      </ol>
    `;
  }

  function renderStandings() {
    app.innerHTML = `
      <main class="app-shell with-scoreboard">
        ${renderScoreboard(true)}
        <section class="panel">
          <p class="eyebrow">${escapeHtml(t("standings.roundComplete", { round: state.round }))}</p>
          <h1>${escapeHtml(t("standings.title"))}</h1>
          <p class="lead">${escapeHtml(t("standings.lead"))}</p>
          ${standingsMarkup()}
          <button type="button" class="btn btn-primary btn-block" id="nextRound" style="margin-top:22px">${escapeHtml(t("standings.next", { round: state.round + 1 }))}</button>
          <div class="button-row centered">
            <button type="button" class="btn btn-secondary btn-small" id="undoThrow">${escapeHtml(t("game.undo"))}</button>
            <button type="button" class="btn btn-secondary btn-small" id="newGame">${escapeHtml(t("game.new"))}</button>
          </div>
        </section>
      </main>
    `;

    bindScoreboardControls(true);

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

  function renderAwards() {
    const awards = selectDisplayedAwards();
    if (!awards.length) return "";

    return `
      <details class="panel history-panel awards-panel">
        <summary class="history-summary">
          <span>${escapeHtml(t("results.awards"))} <span class="history-count">(${awards.length})</span></span>
          <span class="history-toggle-icon" aria-hidden="true">›</span>
        </summary>
        <div class="award-grid">
          ${awards.map((award) => {
            const title = award.recipients.length > 1 ? award.plural : award.singular;
            return `
              <article class="award-card ${award.mandatory ? "mandatory-award" : ""}">
                <div class="award-heading">
                  <h3>${escapeHtml(title)}</h3>
                  <strong class="award-value">${escapeHtml(award.value)}</strong>
                </div>
                <p class="award-description">${escapeHtml(award.description)}</p>
                <div class="award-recipient-list">
                  ${award.recipients.map((recipient) => `
                    <div class="award-recipient" style="--team-color:${recipient.color};--team-soft:${recipient.soft}">
                      <span class="award-recipient-name">${escapeHtml(recipient.name)}</span>
                      <span class="award-recipient-team">${escapeHtml(recipient.subtitle)}</span>
                    </div>
                  `).join("")}
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </details>
    `;
  }

  function getTeamStatistics(team) {
    const entries = state.history.filter((entry) => entry.teamId === team.id);
    const rawPoints = entries.reduce((sum, entry) => sum + entry.score, 0);
    const throws = entries.length;
    const busts = entries.filter((entry) => entry.exceededFifty).length;
    const misses = entries.filter((entry) => entry.score === 0).length;
    const scores = entries.map((entry) => entry.score);
    const minimum = scores.length ? Math.min(...scores) : 0;
    const maximum = scores.length ? Math.max(...scores) : 0;
    const average = throws ? rawPoints / throws : 0;
    const deviation = getStandardDeviation(scores);

    const playerCandidates = team.players
      .map((player) => {
        const playerEntries = getRealPlayerEntries(player.id);
        return {
          player,
          throws: playerEntries.length,
          score: playerEntries.reduce((sum, entry) => sum + entry.contribution, 0)
        };
      })
      .filter((candidate) => candidate.throws > 0);

    const bestPlayerScore = playerCandidates.length
      ? Math.max(...playerCandidates.map((candidate) => candidate.score))
      : null;
    const teamMvps = bestPlayerScore === null
      ? []
      : playerCandidates.filter((candidate) => candidate.score === bestPlayerScore);

    return {
      team,
      finalScore: team.total,
      rawPoints,
      throws,
      busts,
      misses,
      average,
      minimum,
      maximum,
      deviation,
      teamMvps,
      bestPlayerScore
    };
  }

  function renderGameSummary() {
    const roundsPlayed = state.history.length
      ? Math.max(...state.history.map((entry) => Number(entry.round) || 1))
      : 0;
    return `
      <section class="panel results-summary-panel">
        <p class="eyebrow">${escapeHtml(t("summary.eyebrow"))}</p>
        <h2>${escapeHtml(t("summary.title"))}</h2>
        <div class="results-metric-grid">
          <div class="results-metric">
            <span>${escapeHtml(t("summary.duration"))}</span>
            <strong>${escapeHtml(formatDuration(getGameDurationMs()))}</strong>
          </div>
          <div class="results-metric">
            <span>${escapeHtml(t("summary.totalThrows"))}</span>
            <strong>${formatNumber(state.history.length)}</strong>
          </div>
          <div class="results-metric">
            <span>${escapeHtml(t("summary.rounds"))}</span>
            <strong>${formatNumber(roundsPlayed)}</strong>
          </div>
        </div>
      </section>
    `;
  }

  function renderTeamStatistics() {
    const statistics = state.teams.map(getTeamStatistics);
    return `
      <details class="panel history-panel team-statistics-panel">
        <summary class="history-summary">
          <span>${escapeHtml(t("results.teamStats"))} <span class="history-count">(${statistics.length})</span></span>
          <span class="history-toggle-icon" aria-hidden="true">›</span>
        </summary>
        <div class="team-statistics-list">
          ${statistics.map((stats) => {
            const mvpNames = stats.teamMvps.length
              ? stats.teamMvps.map((candidate) => escapeHtml(candidate.player.name)).join(", ")
              : t("stats.noRealThrows");
            const mvpScore = stats.bestPlayerScore === null ? "" : ` · ${escapeHtml(formatPointTotal(stats.bestPlayerScore))}`;
            return `
              <article class="team-statistics-card" style="${teamVars(stats.team)}">
                <div class="team-statistics-heading">
                  <h3>${escapeHtml(getTeamDisplayName(stats.team))}</h3>
                  <strong>${escapeHtml(formatPointTotal(stats.finalScore))}</strong>
                </div>
                <div class="team-stat-grid">
                  <div class="team-stat-item"><span>${escapeHtml(t("stats.rawPoints"))}</span><strong>${formatNumber(stats.rawPoints)}</strong></div>
                  <div class="team-stat-item"><span>${escapeHtml(t("summary.totalThrows"))}</span><strong>${formatNumber(stats.throws)}</strong></div>
                  <div class="team-stat-item"><span>${escapeHtml(t("stats.average"))}</span><strong>${formatNumber(stats.average, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</strong></div>
                  <div class="team-stat-item"><span>${escapeHtml(t("stats.busts"))}</span><strong>${formatNumber(stats.busts)}</strong></div>
                  <div class="team-stat-item"><span>${escapeHtml(t("stats.misses"))}</span><strong>${formatNumber(stats.misses)}</strong></div>
                  <div class="team-stat-item"><span>${escapeHtml(t("stats.spread"))}</span><strong>${stats.throws ? `${stats.minimum}–${stats.maximum}` : "—"}</strong></div>
                </div>
                <div class="team-mvp-line">
                  <span>${escapeHtml(t(`stats.mvp.${stats.teamMvps.length === 1 ? "one" : "other"}`))}</span>
                  <strong>${mvpNames}${mvpScore}</strong>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </details>
    `;
  }

  function renderRematchHistory() {
    if (!Array.isArray(state.sessionGames) || state.sessionGames.length < 2) return "";

    const winCounts = new Map();
    state.sessionGames.forEach((game) => {
      (game.winners || []).forEach((winner) => {
        const existing = winCounts.get(winner.id) || { ...winner, wins: 0 };
        existing.wins += 1;
        winCounts.set(winner.id, existing);
      });
    });
    const leaders = [...winCounts.values()].sort((a, b) => b.wins - a.wins || getRecordedTeamName(a).localeCompare(getRecordedTeamName(b), currentLocale()));

    return `
      <section class="panel rematch-history-panel">
        <p class="eyebrow">${escapeHtml(t("session.eyebrow"))}</p>
        <h2>${escapeHtml(t("session.title"))}</h2>
        <div class="session-win-list">
          ${leaders.map((team) => `
            <span class="session-win-chip" style="--team-color:${team.color};--team-soft:${softenColor(team.color)}">
              <span>${escapeHtml(getRecordedTeamName(team))}</span>
              <strong>${formatNumber(team.wins)} ${unit("win", team.wins)}</strong>
            </span>
          `).join("")}
        </div>
        <ol class="rematch-game-list">
          ${state.sessionGames.map((game, index) => {
            const winnerText = (game.winners || []).map(getRecordedTeamName).join(" & ") || t("session.noWinner");
            const scoreText = (game.standings || []).map((team) => `${getRecordedTeamName(team)} ${team.score}`).join(" · ");
            return `
              <li class="rematch-game-row">
                <div>
                  <strong>${escapeHtml(t("session.game", { number: index + 1 }))}</strong>
                  <span>${escapeHtml(winnerText)}</span>
                </div>
                <div class="rematch-game-meta">${escapeHtml(formatDuration(game.durationMs))} · ${formatNumber(game.totalThrows)} ${unit("throw", game.totalThrows)}</div>
                <div class="rematch-game-scores">${escapeHtml(scoreText)}</div>
              </li>
            `;
          }).join("")}
        </ol>
      </section>
    `;
  }

  function resetForReplay({ shufflePlayers = false } = {}) {
    if (state.view === "finished") recordCompletedGame();
    if (shufflePlayers) {
      const activePlayers = shuffleArray(state.teams.flatMap((team) => team.players.filter((player) => player.active !== false)));
      const inactivePlayers = shuffleArray(state.teams.flatMap((team) => team.players.filter((player) => player.active === false)));

      state.teams.forEach((team) => {
        team.players = [];
      });

      activePlayers.forEach((player) => {
        getAutoFillTeam()?.players.push(player);
      });
      inactivePlayers.forEach((player) => {
        getAutoFillTeam()?.players.push(player);
      });
    }

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
    state.gameStartedAt = Date.now();
    state.gameEndedAt = null;
    state.currentGameId = makeId("game");
    state.view = "game";
    openScoreboardTeamId = null;
    saveState();
    render();
  }

  function renderFinished() {
    openScoreboardTeamId = null;
    if (!state.gameEndedAt) state.gameEndedAt = state.history[state.history.length - 1]?.timestamp || Date.now();
    const addedSessionRecord = recordCompletedGame();
    if (addedSessionRecord) saveState();
    const winners = getWinningTeams();
    const multipleWinners = winners.length > 1;
    const blendedColor = averageTeamColor(winners);
    const blendedSoft = softenColor(blendedColor);
    const latestFirst = [...state.history].reverse();
    const winnerNames = winners.map(getTeamDisplayName);

    app.innerHTML = `
      <main class="app-shell with-scoreboard">
        ${renderScoreboard(false)}

        <section class="winner-banner" style="--team-color:${blendedColor};--team-soft:${blendedSoft}">
          <p class="eyebrow">${escapeHtml(multipleWinners ? t("results.multipleReached") : t("results.exactly50"))}</p>
          <div class="winner-name">${multipleWinners ? escapeHtml(t("results.multipleWinners")) : escapeHtml(t("results.wins", { team: winnerNames[0] }))}</div>
          ${multipleWinners ? `
            <div class="winner-team-list">
              ${winners.map((team) => `
                <span class="winner-team-chip" style="${teamVars(team)}">${escapeHtml(getTeamDisplayName(team))}</span>
              `).join("")}
            </div>
          ` : ""}
          <p class="lead" style="margin:10px 0 0">${escapeHtml(t("results.finalScore"))}</p>
        </section>

        <section class="panel">
          <h2>${escapeHtml(t("results.finalStandings"))}</h2>
          ${standingsMarkup()}
        </section>

        ${renderGameSummary()}

        ${renderTeamStatistics()}

        ${renderAwards()}

        <section class="panel">
          <h2>${escapeHtml(t("results.progression"))}</h2>
          <p class="helper">${escapeHtml(t("results.progressionHelp"))}</p>
          ${renderChart()}
        </section>

        ${renderRematchHistory()}

        <details class="panel history-panel">
          <summary class="history-summary">
            <span>${escapeHtml(t("results.throwHistory"))} <span class="history-count">(${state.history.length})</span></span>
            <span class="history-toggle-icon" aria-hidden="true">›</span>
          </summary>
          <ul class="history-list">
            ${latestFirst.map((entry) => {
              const team = getTeam(entry.teamId);
              const contributionLabel = signedPointTotal(entry.contribution);
              return `
                <li class="history-item" style="${teamVars(team)}">
                  <div class="history-main">
                    <div><span class="history-name ${entry.isGuest ? "guest-name" : ""}">${escapeHtml(entry.playerName)}</span> · ${escapeHtml(team ? getTeamDisplayName(team) : entry.teamName)}</div>
                    <div class="history-meta">${escapeHtml(t("value.round", { round: entry.round }))}${entry.isGuest ? ` · ${escapeHtml(t("results.forPlayer", { name: entry.coveredPlayerName }))}` : ""}</div>
                    <div class="history-result">${entry.previousTotal} → ${entry.resultingTotal}${entry.exceededFifty ? ` · ${escapeHtml(t("results.over50"))}` : ""}</div>
                  </div>
                  <strong class="history-score ${entry.isGuest ? "guest-name" : ""}" title="${escapeHtml(t("results.contribution"))}">${contributionLabel}</strong>
                </li>
              `;
            }).join("")}
          </ul>
        </details>

        <section class="panel">
          <div class="button-row" style="margin-top:0">
            <button type="button" class="btn btn-primary" id="playAgain">${escapeHtml(t("results.playAgain"))}</button>
            <button type="button" class="btn btn-secondary" id="shuffleAndPlayAgain">${escapeHtml(t("results.shuffleReplay"))}</button>
            <button type="button" class="btn btn-secondary" id="undoThrow">${escapeHtml(t("results.undoFinal"))}</button>
            <button type="button" class="btn btn-secondary" id="newGame">${escapeHtml(t("results.newGame"))}</button>
          </div>
        </section>
      </main>
    `;

    bindScoreboardControls(false, true);

    document.getElementById("playAgain").addEventListener("click", () => resetForReplay());
    document.getElementById("shuffleAndPlayAgain").addEventListener("click", () => resetForReplay({ shufflePlayers: true }));
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
        entries,
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

    const lines = series.map(({ team, entries, values }) => {
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

      const bustMarkers = entries.map((entry, entryIndex) => {
        if (!entry.exceededFifty) return "";
        const pointIndex = entryIndex + 1;
        const x = left + (pointIndex / (maxPoints - 1)) * plotWidth;
        const y = top + plotHeight - (entry.resultingTotal / 50) * plotHeight;
        return `
          <g class="bust-marker">
            <title>${escapeHtml(t("chart.bustTitle", { team: getTeamDisplayName(team), round: entry.round, previous: entry.previousTotal, score: entry.score }))}</title>
            <rect x="${x - 6}" y="${y - 6}" width="12" height="12" rx="1.5" fill="#fff" stroke="${team.color}" stroke-width="3" transform="rotate(45 ${x} ${y})" />
            <circle cx="${x}" cy="${y}" r="2.2" fill="${team.color}" />
          </g>
        `;
      }).join("");

      return `<polyline points="${points}" fill="none" stroke="${team.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />${circles}${bustMarkers}`;
    }).join("");

    return `
      <div class="chart-wrap">
        <svg class="score-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${escapeHtml(t("chart.aria"))}">
          ${gridLines}
          <line x1="${left}" y1="${top}" x2="${left}" y2="${height - bottom}" stroke="#938b7f" stroke-width="1.5" />
          <line x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}" stroke="#938b7f" stroke-width="1.5" />
          <text x="${width / 2}" y="${height - 10}" text-anchor="middle" fill="#737b77" font-size="12">${escapeHtml(t("chart.axis"))}</text>
          ${lines}
        </svg>
      </div>
      <div class="chart-legend">
        ${state.teams.map((team) => `
          <span class="legend-item" style="${teamVars(team)}"><span class="legend-dot"></span>${escapeHtml(getTeamDisplayName(team))}</span>
        `).join("")}
        ${state.history.some((entry) => entry.exceededFifty) ? `
          <span class="legend-item"><span class="legend-bust-marker" aria-hidden="true"></span>${escapeHtml(t("chart.bustReset"))}</span>
        ` : ""}
      </div>
    `;
  }

  function toggleLivePlayer(teamId, playerId) {
    const team = getTeam(teamId);
    const player = getPlayer(team, playerId);
    if (!team || !player) return;

    const turningOff = player.active !== false;
    player.active = !turningOff;

    if (turningOff) {
      team.deferredPlayerQueue = team.deferredPlayerQueue.filter((queuedId) => queuedId !== player.id);
      if (state.turnOverride?.teamId === team.id && (
        state.turnOverride.coveragePlayerId === player.id || state.turnOverride.actorPlayerId === player.id
      )) {
        state.turnOverride = null;
        state.pendingTurnSnapshot = null;
      }
    } else {
      player.hasPlayed = false;
      const playerIndex = team.players.findIndex((candidate) => candidate.id === player.id);
      if (getActivePlayers(team).length === 1 && playerIndex >= 0) {
        team.currentPlayerIndex = playerIndex;
      }
    }

    cleanDeferredQueue(team);
    state.standingsPending = !state.winnerId && allPlayersHavePlayed();
    saveState();
    render();
  }

  function openAddPlayerDialog(team) {
    openModal(`
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="addPlayerTitle">
        <p class="eyebrow">${escapeHtml(getTeamDisplayName(team))}</p>
        <h2 id="addPlayerTitle">${escapeHtml(t("modal.addTitle"))}</h2>
        <form id="addLivePlayerForm">
          <label class="field-label" for="addLivePlayerInput">${escapeHtml(t("setup.playerName"))}</label>
          <input id="addLivePlayerInput" type="text" maxlength="40" placeholder="${escapeHtml(t("setup.enterName"))}" required>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" data-close-modal>${escapeHtml(t("modal.cancel"))}</button>
            <button type="submit" class="btn btn-primary">${escapeHtml(t("setup.addPlayer"))}</button>
          </div>
        </form>
      </section>
    `, (modal, close) => {
      const input = modal.querySelector("#addLivePlayerInput");
      input.focus();
      modal.querySelector("#addLivePlayerForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const name = input.value.trim();
        if (!name) return;
        const hadActivePlayers = getActivePlayers(team).length > 0;
        const player = { id: makeId("player"), name, hasPlayed: false, active: true };
        team.players.push(player);
        if (!hadActivePlayers) team.currentPlayerIndex = team.players.length - 1;
        state.standingsPending = false;
        saveState();
        close();
        render();
      });
    });
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
        <p class="eyebrow">${escapeHtml(t("modal.teamSettings"))}</p>
        <h2 id="renameTitle">${escapeHtml(t("modal.renameTitle"))}</h2>
        <form id="renameTeamForm">
          <label class="field-label" for="renameTeamInput">${escapeHtml(t("modal.teamName"))}</label>
          <input id="renameTeamInput" type="text" maxlength="40" value="${escapeHtml(getTeamDisplayName(team))}" required>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" data-close-modal>${escapeHtml(t("modal.cancel"))}</button>
            <button type="submit" class="btn btn-primary">${escapeHtml(t("modal.saveName"))}</button>
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
        team.customName = true;
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
      ? escapeHtml(t("modal.teammateAvailable", { next: nextTeammate.name, skipped: turn.coveragePlayer.name, team: getTeamDisplayName(turn.team) }))
      : escapeHtml(t("modal.noTeammate"));

    openModal(`
      <section class="modal-card substitution-modal" role="dialog" aria-modal="true" aria-labelledby="substitutionTitle">
        <p class="eyebrow">${escapeHtml(getTeamDisplayName(turn.team))}</p>
        <h2 id="substitutionTitle">${escapeHtml(t("modal.subTitle", { name: turn.coveragePlayer.name }))}</h2>
        <p class="lead modal-lead">${escapeHtml(t("modal.subLead"))}</p>

        <button type="button" class="substitution-choice" id="nextTeammateChoice" ${teammateDisabled}>
          <span class="substitution-choice-title">${escapeHtml(t("modal.useTeammate"))}</span>
          <span class="substitution-choice-copy">${teammateText}</span>
        </button>

        <button type="button" class="substitution-choice" id="externalGuestChoice">
          <span class="substitution-choice-title">${escapeHtml(t("modal.useGuest"))}</span>
          <span class="substitution-choice-copy">${escapeHtml(t("modal.guestCopy", { name: turn.coveragePlayer.name }))}</span>
        </button>

        <button type="button" class="btn btn-secondary btn-block modal-cancel" data-close-modal>${escapeHtml(t("modal.cancel"))}</button>
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
    const confirmed = window.confirm(t("confirm.newGame"));
    if (!confirmed) return;
    const language = state.language;
    state = createInitialState();
    state.language = language;
    setupError = "";
    closeModal();
    saveState();
    render();
  }

  render();
})();

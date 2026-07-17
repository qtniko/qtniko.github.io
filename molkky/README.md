# Mölkky Scorekeeper

A framework-free, mobile-first Mölkky team scoring web app for GitHub Pages.

## Install on an existing GitHub Pages site

Copy the entire `molkky` folder into the repository that powers the site, then commit and push it.

The page will normally be available at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/molkky/
```

For a user/organization site named `YOUR-USERNAME.github.io`, it will normally be:

```text
https://YOUR-USERNAME.github.io/molkky/
```

## Included behavior

- Custom Mölkky-pin SVG favicon matching the in-page brand mark
- English and Norwegian display languages, switchable at any point with a compact selector
- Default team names, controls, dialogs, statistics, accessibility labels, and award titles follow the selected language
- 2–10 color-coded teams named Team Red, Team Blue, and so on
- Team names can be edited during player setup
- Auto-fill places each new player on a team with the fewest players by default
- Add more teams directly during player setup, up to the 10-team limit
- A Shuffle teams button randomizes all names and evenly auto-fills the teams
- Manual team assignment remains available
- Strict team rotation: Team Red → Team Blue → Team Green → repeat
- Each team independently rotates through its own active player list
- Teams always receive the same number of turns, even with uneven player counts
- Players can join while the game is running
- Players can be marked inactive without deleting their scores, then returned later
- Inactive players are automatically skipped and are not placed in the deferred-turn queue
- Unavailable players can instead be deferred to a per-team priority queue
- Another teammate can cover the current team turn while the unavailable player is queued next
- An external Guest can replace a turn without adding points or a throw to the original player's individual stats
- Guest scoring is grouped into one gray Guest entry per team and excluded from MVP
- A standings screen appears after every active player has completed a turn and the current team cycle is complete
- Reaching exactly 50 starts the final team cycle; all remaining teams finish, and every team ending that cycle on 50 shares the win
- Going over 50 resets the team to 25
- Individual bust scoring credits the points needed to reach 50, then applies the −25 reset penalty
- End-game awards include mandatory MVP and Round Royals results plus every qualifying player/team highlight
- Persistent team scores at the top with expandable live player controls
- Compact in-game phone layout keeps the current player and all scoring controls on one screen
- Undo last throw, including substitution, deferred-queue, and pending-winner state
- Local browser saving, including refresh recovery
- Final standings, pluralized game awards, collapsible throw history, and a fully responsive score progression graph
- Game duration, total throws, detailed per-team statistics, and bust markers on the graph
- Session rematch history appears after a second completed game
- Replay with the same teams or reshuffle players while keeping inactive players inactive

- Game awards and team statistics use collapsible result sections

No build step or dependencies are required.

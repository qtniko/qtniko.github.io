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

- 2–10 color-coded teams named Team Red, Team Blue, and so on
- Team names can be edited during player setup
- Auto-fill places each new player on a team with the fewest players by default
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
- The first team to reach exactly 50 wins, but every remaining team in that team cycle finishes its turn before the result screen
- Going over 50 resets the team to 25
- Individual scoring treats an over-50 reset as −25 points
- Final MVP display based on the highest individual score
- Persistent team scores at the top with expandable live player controls
- Compact in-game phone layout keeps the current player and all scoring controls on one screen
- Undo last throw, including substitution, deferred-queue, and pending-winner state
- Local browser saving, including refresh recovery
- Final standings, history, and score progression graph

No build step or dependencies are required.

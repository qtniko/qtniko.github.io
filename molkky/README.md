# Mölkky Scorekeeper

A framework-free, mobile-first Mölkky team scoring web app for GitHub Pages.

## Install on an existing GitHub Pages site

Copy the entire `molkky` folder into the repository that powers the site, then commit and push it.

The page will normally be available at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/molkky/
```

For a user/organization site repository named `YOUR-USERNAME.github.io`, it will normally be:

```text
https://YOUR-USERNAME.github.io/molkky/
```

## Included behavior

- 2–10 color-coded teams named Team Red, Team Blue, and so on
- Team names can be edited during player setup
- Manual player assignment
- Strict team rotation: Team Red → Team Blue → Team Green → repeat
- Each team independently rotates through its own player list
- Teams always receive the same number of turns, even with uneven player counts
- Unavailable players can be deferred to a per-team priority queue
- Another teammate can cover the current team turn while the unavailable player is queued next
- An external Guest can replace a turn without adding points or a throw to the original player's individual stats
- Guest scoring is grouped into one gray Guest entry per team and excluded from MVP
- A standings screen after every player's turn has been completed and the current team cycle is complete
- Exact-50 winning rule
- Going over 50 resets the team to 25
- Individual scoring treats an over-50 reset as −25 points
- Final MVP display based on the highest individual score
- Persistent team scores at the top with expandable player details
- Undo last throw, including substitution and deferred-queue state
- Local browser saving, including refresh recovery
- Final standings, history, and score progression graph

No build step or dependencies are required.

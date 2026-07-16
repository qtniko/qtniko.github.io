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
- Manual player assignment
- Interleaved turn order across teams
- A standings screen after every player has thrown once
- Exact-50 winning rule
- Going over 50 resets the team to 25
- Persistent team scores at the top with expandable player details
- Undo last throw
- Local browser saving, including refresh recovery
- Final standings, history, and score progression graph

No build step or dependencies are required.

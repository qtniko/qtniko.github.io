# Gokémon Po Evaluation Index v1.5

Static Pokémon GO-style evaluation index.

## v1.5 changes

- Reverted the visible/database rating system from 0-10 numeric scores back to class labels: `bad`, `budget`, `decent`, `strong`, `top-tier`.
- Kept the v1.3 cleanup changes:
  - simplified actions: `keep`, `keep one`, `trade`, `transfer`
  - single-stage Pokémon use `single` stage
  - special flags such as `legendary`, `mythical`, `ultra beast`, `regional`, `shadow`, and `mega` are searchable
  - no visible action legend
  - no visible export button
  - no “no special flags” chip
  - no loaded bundled database status line
- Export remains available in the console as `window.exportFilteredCsv()`.

## Run locally

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

The app first tries to load `pokemon_evaluations.csv` and `evolutions.csv` from the same folder. If blocked, it uses the embedded fallback data inside `app.js`.


## v1.5 changes

- Added auto-generated type strengths and weaknesses.
- Hidden legacy move row when no legacy move is listed.
- Highlighted strongest non-league use cards in the side panel.
- Added semantic usefulness search aliases such as raids, gym attack, gym defense, atk, def, defence, and league.
- Reclassified stages dynamically from evolution links, ignoring baby Pokémon and Mega evolution links.

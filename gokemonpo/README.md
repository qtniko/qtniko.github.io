# Gokémon Po Evaluation Web App - Full v1

Generated: 2026-06-30

This package contains a best-effort full Gokémon Po evaluation database and the static searchable web app.

## Files

- `index.html` - static app shell
- `app.js` - search/filter/render logic
- `styles.css` - UI styling
- `data/pokemon_evaluations.csv` - one row per relevant Pokémon/stage/form/variant
- `data/evolutions.csv` - one row per evolution/Mega relationship

## Generation choices

- Costumes are skipped.
- Shiny and XXL/XXS variants are skipped because they do not change battle value.
- Regional/battle forms are included when they materially affect typing, stats, moves, evolution, or evaluation.
- Mega/Primal-style temporary evolutions are separate rows where Game Master data exposes temp evolution overrides.
- Shadow variants are added for rows where Shadow relevance appears meaningful.
- Purified variants are added only for notable Return cases like Sableye/Wobbuffet.

## Caveats

Ratings are hybrid/heuristic: raw Gokémon Po stats, moves, forms, candy costs, and Mega energy come from the Game Master parse, but meta labels like `strong`/`top-tier` include curated heuristics and should be reviewed over time.

Run locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

Rows: 1514 evaluation rows, 625 evolution rows.


## v1.1 changes

- Bundled `app.js` and `styles.css` into the full package.
- App tries CSV files from the same directory first, then `data/`, then falls back to embedded CSV strings inside `app.js`.
- Visitors no longer need to upload CSV files for normal use.
- Removed the visible filtered-CSV export button. The export function remains available as `window.exportFilteredCsv()` in the browser console.
- Search no longer indexes evolution candy/Mega costs or arbitrary notes text; numeric-only search is treated as Pokédex number lookup.

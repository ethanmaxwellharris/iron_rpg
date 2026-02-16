# Iron Legends

Iron Legends is a vibe-coded prototype for **Iron RPG / Barbell Legends**.

It combines:
- Historical lifting milestones
- RPG-style character sheets
- Quest arcs, passives, artifacts, and progression lore

## Run locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy to GitHub Pages

Yes — this project can run on GitHub Pages.

This repo now includes a workflow at `.github/workflows/deploy-pages.yml` that deploys the static site.

### One-time repo settings
1. Push this repo to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Ensure your default branch is `main` (or update the workflow trigger branch).

### Deploy
- Push to `main`, or run the workflow manually from the **Actions** tab.
- GitHub will publish the site at:
  - `https://<your-username>.github.io/<repo-name>/`

## Project structure

- `data/ethan_profile.json`: Canonical character + world payload
- `index.html`: Main app shell
- `styles.css`: Visual style inspired by "shed sanctuary" aesthetics
- `app.js`: Renders character stats, progression, quests, and milestones dynamically
- `app.js`: Renders character stats, progression, and quests dynamically

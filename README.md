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

## Project structure

- `data/ethan_profile.json`: Canonical character + world payload
- `index.html`: Main app shell
- `styles.css`: Visual style inspired by "shed sanctuary" aesthetics
- `app.js`: Renders character stats, progression, and quests dynamically

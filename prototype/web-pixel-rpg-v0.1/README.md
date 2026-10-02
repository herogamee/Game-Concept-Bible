# Web Pixel RPG Prototype v0.1

Playable first implementation for **Adventurer Life**.

## Play
Open `index.html` in a modern browser. No install and no external assets are required.

## Included
- starter village + slime field
- WASD/arrow movement
- NPC interaction
- first quest: kill 3 slimes
- real-time melee combat
- HP / EXP / level / gold
- potion + merchant
- item drop + inventory
- map portal
- local browser save

## Next
Migrate this validated loop to **RPGJS v5 + TypeScript + Tiled/RPGJS Studio**, then add authoritative multiplayer, accounts, chat and server-side saves.

RPGJS v5 official quick start:
```bash
npx degit rpgjs/starter#v5 adventurer-life-online
cd adventurer-life-online
npm install
npm run dev
```

AI-agent skill:
```bash
npx skills add https://github.com/RSamaium/RPG-JS#v5
```

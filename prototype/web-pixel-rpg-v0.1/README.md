# Web Pixel RPG v0.1.1 — Visual Baseline

A local-first fantasy pixel RPG with original Willowbrook artwork. Open `index.html` directly, or use Node.js 18+:

```
npm run dev
npm test
npm run build
```

Dev URL: http://localhost:4173. Build output: `dist/`, deployable to any static host. No install, external runtime, network asset request or backend is required.

WASD/arrows move; E/Enter talks; Z/Space attacks; I opens inventory; 1 uses a potion. Talk to the elder, enter the south portal, defeat three slimes and return for 50 gold / 20 EXP. Merchant sells potions for 10 gold. Slime kills immediately add gel and gold, preserving the original drop behavior.

## Visual architecture

- `assets/pixel-art.js`: original cached bitmap sprites: 32px tiles, 64px directional actor frames, animated slime and scenery.
- `src/world.js`: ground tile layer and decoration/obstacle placements.
- `src/game.js`: preserved progression, input, NPC/merchant, combat, inventory and save loop.
- `src/render.js`: camera, Y sorting, actor/obstacle foreground overlap and lightweight effects.
- `src/style.css`: responsive fantasy HUD, HP/EXP bars, quest, dialogue and item slots.

The 1280×720 canvas presents a 640×360 pixel viewport into a 960×540 world. Trees collide at their trunks; crowns overlap actors according to their feet Y. Sprite bitmaps and map ground are generated once and cached. Canvas smoothing is disabled; CSS uses pixelated scaling. Noninteger browser sizes may produce uneven pixel widths, but no texture smoothing.

Save key stays `al-web-rpg-v01`; existing saves carry over. Automatic save every 15 seconds and on page hide. No accounts or online services. `?preview=field` and `?preview=dialogue` are screenshot fixtures using temporary state; they never write over a real save.

## Validation and limits

`npm test` runs the real gameplay functions in a deterministic Node VM harness: movement, collision, NPC, full quest/reward, combat/drop, merchant, potion, inventory, save/load and both portals; it also executes the renderer and checks syntax. Browser smoke testing covered rendered village/meadow, dialogue/inventory, console and responsive layout. See `VALIDATION.md` for scope. Safari and physical iMac 2017 hardware were not available; 60 FPS on those devices is a target, not a measured guarantee.

Screenshots: [village](screenshots/village.jpg), [slime field](screenshots/slime-field.jpg), [inventory / dialogue](screenshots/inventory-dialogue.jpg).

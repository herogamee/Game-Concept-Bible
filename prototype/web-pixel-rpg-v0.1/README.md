# Web Pixel RPG v0.1.1 — Visual Baseline

A local-first fantasy pixel RPG with original Willowbrook artwork. Open `index.html` directly, or use Node.js 18+:

```
npm run dev
npm test
npm run build
```

Dev URL: http://localhost:4173. Build output: `dist/`, deployable to any static host. No install, external runtime, third-party asset request or backend is required. Compact PNG assets load from the same folder.

Left-click the ground to walk there (routes around obstacles; blocked targets choose the nearest reachable point). WASD/arrows take over and cancel the mouse route; E/Enter talks; Z/Space attacks; I opens inventory; 1 uses a potion. Talk to the elder, enter the south portal, defeat three slimes and return for 50 gold / 20 EXP. Merchant sells potions for 10 gold. Slime kills immediately add gel and gold, preserving the original drop behavior.

## Visual architecture

- `assets/pixel-art.js`: original cached bitmap sprites: 32px tiles, 64px directional actor frames, animated slime and scenery.
- `src/world.js`: ground tile layer and decoration/obstacle placements.
- `src/navigation.js`: click coordinates, collision-aware routes and destination marker.
- `src/game.js`: preserved progression, input, NPC/merchant, combat, inventory and save loop.
- `src/render.js`: camera, Y sorting, actor/obstacle foreground overlap and lightweight effects.
- `src/style.css`: responsive fantasy HUD, HP/EXP bars, quest, dialogue and item slots.

The 1280×720 canvas now presents an 800×450 logical viewport into a 960×540 world. Trees collide at their trunks; crowns overlap actors according to their feet Y. Sprite bitmaps and map ground are generated once and cached. Canvas smoothing is disabled; CSS uses pixelated scaling. Noninteger browser sizes may produce uneven pixel widths, but no texture smoothing.

Save key stays `al-web-rpg-v01`; existing saves carry over. Automatic save every 15 seconds and on page hide. No accounts or online services. `?preview=field` and `?preview=dialogue` are screenshot fixtures using temporary state; they never write over a real save.

## Validation and limits

`npm test` runs the real gameplay functions in a deterministic Node VM harness: movement, collision, NPC, full quest/reward, combat/drop, merchant, potion, inventory, save/load and both portals; it also executes the renderer and checks syntax. Browser smoke testing covered rendered village/meadow, dialogue/inventory, console and responsive layout. See `VALIDATION.md` for scope. Safari and physical iMac 2017 hardware were not available; 60 FPS on those devices is a target, not a measured guarantee.

Screenshots: [village](screenshots/village.jpg), [slime field](screenshots/slime-field.jpg), [inventory / dialogue](screenshots/inventory-dialogue.jpg).

## Monster combat and leveling

Click a monster to approach and slash repeatedly, or press Z/Space in melee range. Click ground or move with WASD/arrows to cancel targeting. Slime Lv.1: 3 HP / 8 EXP / 2 gold; azure slime Lv.3: 9 HP / 18 EXP / 5 gold; boar Lv.5: 18 HP / 32 EXP / 9 gold. Monsters respawn after 5 seconds. Higher-tier creatures stay passive until attacked by low-level players. ATK equals player level; level-up adds 5 max HP and restores health. EXP thresholds grow by 1.45×, with leftover EXP retained. Levels, HP, EXP and gold use the existing local save.

## Illustrated Willowbrook art pass

Original generated bitmap sprites now replace the key village props, player, three NPCs and slime. Assets are in `assets/painted/`, adapted through `assets/painted-art.js`. Eight walking and eight attack frames per direction are used for the adventurer. Slime idle/move/hit/death use four frames each. Runtime artwork totals 745 KiB; larger authoring sheets remain in the repo but are excluded from dist. Decoder completion gates game startup, and frame images are cached.

Exact prompts, production notes and tool choice: [ART-DIRECTION.md](ART-DIRECTION.md). The new sprites use illustrated fantasy shading, not a strict limited-color pixel palette. The boar is unchanged in this focused pass.

Updated screenshots: [village](screenshots/village-polished.jpg), [field](screenshots/field-polished.jpg), [dialogue](screenshots/dialogue-polished.jpg).

## Audio

Original music and effects are synthesized locally with Web Audio in `src/audio.js`: a warm village theme, a meadow theme, sword swish, damage impact and level-up chime. No audio downloads or commercial tracks. Audio starts after a click/key gesture; the header button and volume slider control both music/effects and persist separately from the game save. Switching tabs suspends audio; returning resumes it when enabled. Browsers without Web Audio keep gameplay working silently.

The hurt/cooldown timers clamp at zero and never persist across reload. The player stays opaque during damage feedback (a brief red ground ring); old negative timers no longer leave the sprite faded.

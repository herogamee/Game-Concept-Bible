# Character Lab — 2026-10-03

Open `http://localhost:5173/lab.html` while the dev server runs, or choose Character Lab in game settings. Production builds include this separate entry and support deployment subpaths.

## Review workflow

- Choose the actual character atlas, action and direction. Slow time to 0.25×, pause, step or click filmstrip frames. Enable adjacent-frame overlays, frame bounds and the foot baseline. Moving-grid mode compares foot motion with world travel. Actual walk: eight frames, 800 ms, 128 units travelled at 160 units/second. Inspector changes do not change game settings.
- **ชุด / ใบหน้า** accepts matching transparent atlas layers for face, eyes, pants, shoes, shirt, hair, hat and weapon, with offsets and front/back order. Current baked clothing cannot be removed; a modular base/wardrobe still needs artwork.
- **จังหวะต่อสู้** uses shared sword range, arc and phase rules. Preview damage is one HP/swing; real-game damage uses player ATK. Sprite duration is 400 ms versus 350 ms of combat phases: this difference is exposed for review.
- **ต่อสู้ในเกมจริง** runs actual RPGJS maps, movement, Slime AI, combat and rewards. WASD/click move, Z attacks, 1 uses a potion. Fresh Lab saves start in the meadow; later visits resume saved progress, including village recovery after death. Reload does not erase progress. Leaving the tab unloads the embedded game.

Normal save remains `adventurer-rpgjs-v02-slots1`. Exact query `characterLab=1` selects `adventurer-character-lab-slots1`. Notes have a separate local key. Saves remain browser/origin-specific, not durable online accounts.

## Importing new class art

Expand the PNG section, choose a local atlas, and supply JSON:

```json
{"name":"ตัวทดลอง","frameWidth":192,"frameHeight":192,"worldFrame":64,"anchor":[0.5,0.625],"clips":{"idle":{"row":0,"count":1,"fps":10,"directions":true},"walk":{"row":0,"count":8,"fps":10,"directions":true},"slash":{"row":4,"count":8,"fps":24,"directions":true}}}
```

Rows are zero-based; directional order is south, west, east, north. `directions:false` uses one row. Allowed clips: idle, walk, slash, hurt, dead, shoot, thrust, spellcast. Declare only actual clips. Imports/layers remain in the current Lab session and are not installed into the game. Changing the base clears layers. Layers must match the selected atlas dimensions/grid.

Existing hero art supports idle/walk/slash; unavailable hero hurt/death, shooting, spellcasting and thrust are explicitly marked. Slime has dedicated hurt/death images. Classes, projectiles and skill effects remain unimplemented.

PNG capture and JSON review buttons use browser downloads. JSON includes settings, layer filenames/offsets and notes, not image bytes. The automation browser did not return a completed JSON download event; delivery needs a normal-browser check.

## Acceptance record

TypeScript, 38 focused tests and production root/subpath smoke passed. Tests cover actual frame timing/final attack hold, missing clips, imported atlas validation, save separation and shared sword hit rules. RPGJS HTML injection is filtered for the inspector entry.

Browser review exercised pause/step/filmstrip, direction/time controls, preview active-window damage, missing-action status and local PNG atlas import. Embedded runtime showed Lv.1 EXP8, Gold22 and Gel1 following an actual Slime reward; the main tab showed its separate higher-level character. This is standalone evidence, not multiplayer acceptance.

[Motion screenshot](evidence/character-lab/motion-fullhd.png) records frame four and all eight walk frames. A large-screen viewport override was requested during inspection and reset; capture reflects the browser page size, not a hardware performance benchmark.

Gait artwork has not been redrawn here. Owner animation/feel acceptance is pending. Use the Lab to identify alternating leg poses, weight/contact changes and travel cadence before authoring replacement frames.

# Changelog

## 2026-10-02 — Player visibility fix and original audio

- Fixed hurt timer underflow causing the player to remain faded; clamp timers and reset transient combat state on load/save. Keep the player opaque with a red hit indicator.
- Added original Web Audio village/meadow music, slash/hurt effects, level chime, gesture activation, saved mute/volume controls and tab suspension.
- Added audio scheduling/control tests and opacity regression checks.


## 2026-10-02 — Illustrated Willowbrook art pass

- Integrated original image-generated RGBA environment props, directional adventurer, NPC idle frames and animated slime into the playable game.
- Added an orange cottage, teal cottage, lush oak, market stall, flower beds, well, fence, lantern, barrels and rune stone; preserved collision and Y depth behavior.
- Adventurer walks and attacks in eight-frame cycles across four directions; slime has idle, move, hit and death frames. NPCs use their own illustrated sprites and dialogue portraits.
- Refined seeded terrain, road margins, contact shadows, pollen, sword trails, fantasy panels and camera framing.
- Added an asset decoder startup gate, asset validation, exact generation prompts, preserved source sheets and reproducible extraction scripts. Build omits authoring images.

## 2026-10-02 — Monster tiers and melee progression

- Added Lv.1 slime, Lv.3 azure slime and Lv.5 boar with distinct HP, attack, movement, EXP and gold rewards.
- Click monsters to approach and repeatedly slash; keyboard movement or clicking the ground cancels targeting.
- Player ATK equals level; each level adds 5 max HP and heals. EXP rolls over and levels persist in the existing save.
- Higher-tier monsters retaliate when attacked and remain passive toward low-level beginners.


## 2026-10-02 — Click-to-move

- Added left-click movement with obstacle routing, destination marker and keyboard override; clear routes on portal travel or defeat.
- Validated arrival, water detour, blocked target, keyboard takeover and portal cancellation.


## Web Pixel RPG v0.1.1 — Visual Baseline — 2026-10-02

- Added original pixel terrain, village scenery, four-direction adventurer frames, distinct elder/merchant/guide and animated slime.
- Added fantasy HUD, health/experience bars, gold, quest tracker, dialogue, item slots and nearby E prompt.
- Added bounded camera follow, ground/decorations, Y-sorted obstacles/actors, trunk collision, swing, hit flash, damage, knockback and death fade.
- Preserved original controls, combat/progression/rewards, merchant, inventory, immediate drops, map portals and browser save key.
- Extracted artwork, world, game, renderer and stylesheet; added dependency-free dev/build and regression harness.
- Added asset credits/license, screenshot fixtures and three browser captures.

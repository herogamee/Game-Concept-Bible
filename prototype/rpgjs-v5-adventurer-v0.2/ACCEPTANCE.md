# Acceptance record — 2026-10-02

Historical record for the first LPC implementation. For the current original-art/control slice and its remaining gates, read [PARITY-REVIEW.md](PARITY-REVIEW.md). The observations below retain their original test count, actor IDs and map coordinates.

Local Windows Node 22.23.2, RPGJS 5.0.0, in-app browser. This is a prototype gate, not production deployment certification.

## Standalone gate

Observed on http://localhost:5173/: village/meadow loaded; click navigation walked to the south portal and changed to meadow at (320,72). Slime targeting entered windup/active/recovery, reduced HP, killed and awarded EXP/Gold/Gel. Player took damage, reached death and revived in village. Elder quest accepted and counted three server-confirmed kills; turn-in produced Lv.2, HP 35/35, EXP 14/43, 76 Gold, Gel 3 and completed quest. Inventory showed the actual counts. Full-HP potion refusal did not consume an item; successful consumption/healing was additionally observed in online mode (same authoritative gameplay implementation).

Saved via K; browser reload preserved Lv.2, 76 Gold, Gel 3, quest completed and village position (320,224), with phase idle. Browser storage sanitizes a past public ID before hydration. Departed room actors are excluded from step/auto-save/HUD to prevent stale room snapshots overwriting destination progress.

Keyboard override and wall detouring are covered by focused tests; visual movement checks used the actual game controls. Audio toggle invokes original Web Audio synthesis; no external audio assets. No claim of a measured listening-quality or low-end-device performance assessment.

## Online gate

Observed two independent tabs on http://localhost:5174/ using the Node MMORPG server. Final proof actors were `uAdT` and `WXH3`; each list marked a different player as self. Both started (320,224), observed each other's movement, passed the portal, and joined meadow (320,72). Both targeted `slime-001`.

Both DOM snapshots showed `slime-001 · HP 0/3 · dead`. `WXH3` had EXP 8/30, 22 Gold and Gel 1; `uAdT` had EXP 0/30, 20 Gold and Gel 0. Thus the contested death awarded one reward. Both displayed the same two positions around (280,173)/(280,170), and HP 27/30 for the injured actor. Five-second respawn returned slime HP to 3. Potion use showed the success notice and reduced the injured actor's count from 2 to 1; subsequent slime attacks could reduce HP again.

Earlier races also yielded exactly one reward. A deterministic two-actor server runtime test additionally verifies the atomic reward claim and no re-award on repeated active ticks. Gameplay requests cannot supply arbitrary HP, Gold, kills or damage multipliers.

## Automated checks

- 18/18 focused rules/runtime tests passed.
- TypeScript check passed; production builds passed inside the root/subpath smoke test.
- Production HTTP smoke passed root and `/quest/` map/theme paths.
- `git diff 5b812b7 -- prototype/web-pixel-rpg-v0.1` was empty: v0.1 code/assets were preserved after importing the owner's latest main.

## Limits

Online slots are server in-memory; no authenticated accounts or durable database. NPCs share temporary LPC appearance. Tiled maps and server content registry are generated together, so edit the authored generator. Death uses the documented south hurt-frame fallback. No class trees, crafting, guild systems, large dungeon generation or MMO scaling work was started.


## Saved evidence

`evidence/standalone.png` shows the restored Lv.2/completed quest and opaque LPC player after a ground click. Final screenshot race repeated with `KLyd` and `fRRG`: both images show slime-001 HP 0/dead; A has 8 EXP/1 Gel and B 0 EXP/0 Gel. See `evidence/online-a.png` and `evidence/online-b.png`. Separate instances were closed after capture. The prior injured-player Potion observation remains recorded above.

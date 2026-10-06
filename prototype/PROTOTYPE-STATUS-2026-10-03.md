# Prototype Status — 2026-10-03

## Known playable baseline

`prototype/web-pixel-rpg-v0.1/index.html`

Verified repository content includes:
- browser movement;
- NPC interaction;
- starter quest;
- simple real-time melee combat;
- HP/EXP/level/gold;
- potion/merchant;
- slime drop;
- inventory;
- map transition;
- local browser save.

This remains the preserved playable baseline.

## RPGJS migration status

Target folder:

`prototype/rpgjs-v5-adventurer-v0.2/`

**Repository check on 2026-10-03:** the target RPGJS folder/README is not yet present.

Therefore:
- do not claim RPGJS migration is implemented;
- do not claim v0.3 combat code is playable yet;
- first executable task is to bootstrap the official RPGJS v5 target per the v0.2 migration handoff.

## Active design target

v0.3 Combat & Classes Candidate now defines:
- one shared real-time combat kernel;
- Fighter/Sword;
- Scout/Spear;
- Ranger/Bow;
- Mage/Staff-Focus;
- shared prototype Effort;
- defense per loadout;
- server-authoritative online result;
- playtest gates.

## Exact next implementation order

1. Bootstrap `prototype/rpgjs-v5-adventurer-v0.2/` from official RPGJS v5 starter.
2. Preserve/document asset licensing.
3. Implement Sword-only kernel.
4. Pass combat state/reward tests.
5. Add Spear/Bow/Staff-Focus through the same kernel.
6. Build one comparison scene.
7. Run playtest scorecard.
8. Only then consider Gate-2 techniques.
9. Only after standalone stability, run the two-client authority proof.

## Do not expand

Until the gates pass:
- no class trees;
- no new economy systems;
- no housing expansion;
- no crafting expansion;
- no mounts/pets;
- no PvP;
- no full dungeon generation;
- no new currencies/ranks.

The current problem is implementation evidence, not more design breadth.

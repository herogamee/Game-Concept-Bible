# CODEX HANDOFF — v0.3 Combat Kernel & Four-Loadout Validation

**Date:** 2026-10-03
**Repository:** herogamee/Game-Concept-Bible
**Authority order:** v0.2.1 -> Integration Guardrails -> Consolidation Audit -> v0.3 Combat & Classes Candidate

## Mission

Implement the smallest playable combat comparison that can validate the v0.3 candidate.

Do **not** add unrelated systems.

Primary documents:
- `bible/GAME-CONCEPT-BIBLE-v0.3.md`
- `design/COMBAT-KERNEL-v0.1.md`
- `design/COMBAT-APTITUDE-PROTOTYPE-MATRIX-v0.1.md`
- `design/vertical-slice.md`
- `world/magic-system.md`

Existing architecture handoff:
- `prototype/web-pixel-rpg-v0.1/CODEX-HANDOFF-RPGJS-v0.2.md`

## Repository behavior

Preserve:
- `prototype/web-pixel-rpg-v0.1/`

Target:
- `prototype/rpgjs-v5-adventurer-v0.2/`

If the RPGJS v5 migration folder is absent, create it according to the existing v0.2 handoff before claiming the v0.3 combat implementation is complete.

Do not modify the old v0.1 prototype as a shortcut.

## Phase 1 — Sword kernel only

Implement:
- explicit combat state machine;
- data-driven attack definition;
- Sword Slash;
- Sword Guard;
- one slime/light enemy;
- hurt;
- enemy death;
- player downed/rescue reset;
- Effort;
- reward-once logic;
- required tests.

Do not add the other weapons until this passes.

## Phase 2 — Shared weapon adapters

Add through the same kernel:
- Spear Thrust + Brace;
- Bow Shot + Evade Step;
- Staff/Focus Impulse Pattern + Ward.

No copy-pasted combat engines per class.

Weapon differences belong in data/config and small behavior adapters.

## Phase 3 — one comparison scene

Build one tiny test map with:
- open lane;
- narrow lane/obstacle;
- retreat route;
- light enemy;
- readable charge/approach enemy if feasible;
- one utility interaction.

Switch loadout from a test NPC/menu.

This is a developer/playtest selector, not the final character-creation UI.

## Phase 4 — Gate-2 techniques

Only after Phase 1–3 tests pass:
- Fighter Lunge;
- Scout Sweep;
- Ranger Aimed Shot;
- Mage Impulse Burst.

Do not build trees.

## Phase 5 — online authority proof

Two clients:
- see same enemy;
- attack same enemy;
- server owns HP/state;
- one death event;
- one reward settlement;
- both clients converge on result.

## Required code organization

Keep separate concepts:

```text
combat/
  state/
  attacks/
  defenses/
  techniques/
  hit-resolution/
  effort/
  rewards/

data/
  attacks/
  loadouts/

adapters/
  animation/
```

Exact framework directories may differ, but do not put timing/damage magic numbers directly in input handlers.

## Required tests

At minimum:

1. windup cannot damage;
2. active can damage;
3. recovery cannot damage;
4. hit-once per attack instance;
5. dead targets ignored;
6. invalid re-attack rejected;
7. Effort lower bound;
8. defense Effort requirement;
9. player hp=0 -> downed;
10. death event reward settles once;
11. same deathEventId cannot increment quest twice;
12. potion cannot exceed max HP.

## Controls

Keyboard target:
- Move WASD/arrows
- Attack Z/Space
- Defend X
- Technique C
- Interact E/Enter
- Item 1
- Inventory I

Keep architecture compatible with a small mobile button budget.

## Explicit prohibitions

Do not add:
- extra currencies;
- mana bar;
- level-locked class trees;
- advanced Disciplines;
- crafting expansion;
- housing expansion;
- PvP;
- pets/mounts;
- gear score;
- procedural skills;
- full dungeon generation;
- Phaser;
- Colyseus;

unless a documented blocker/approved change exists.

## Evidence required before marking complete

Commit:
- exact run command;
- exact test command;
- screenshot or textual test evidence where repository workflow permits;
- list of implemented phases;
- known gaps;
- confirmation that v0.1 was preserved;
- confirmation that no duplicate reward race remains in the tested path.

Do not update the root Changelog to claim the playable combat gate passed until tests/build/play are actually verified.

## Definition of done

The v0.3 implementation candidate is ready for playtest when:

- four loadouts run on one combat kernel;
- each primary and defense works;
- Sword/Spear/Bow/Staff-Focus feel mechanically different;
- one F-style encounter is completable by each;
- player can retreat;
- server authority proof passes if online phase is reached;
- no new major system was introduced.

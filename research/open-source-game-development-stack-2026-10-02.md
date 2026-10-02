# Open-Source Game Development Stack Research — 2026-10-02

Status: **Technical research / implementation guidance**
Project: **Adventurer Life RPG**
Target: **browser-first, low-spec, 2D pixel RPG that can grow into a lightweight shared-world online game**

## Executive decision

Keep **RPGJS v5 + TypeScript** as the primary implementation stack.

RPGJS v5 reached stable v5.0.0 on 2026-09-28 and already includes the expensive infrastructure we would otherwise have to assemble ourselves: Tiled maps, events, dialogue, inventory, skills, real-time action battle, save/load, UI, mobile controls, authoritative multiplayer, client prediction/reconciliation, accounts and chat.

Use the tools in this document to fill the gaps around **art, animation, map production, custom AI and content authoring**.

Do **not** switch the project to Phaser merely because Phaser is larger/more popular. Phaser is an excellent low-level 2D framework, but switching now would mean rebuilding many RPG/MMORPG systems that RPGJS already provides.

---

## Recommended production stack

| Layer | Adopt | Why | License / caution |
|---|---|---|---|
| RPG/MMORPG framework | **RPGJS v5** | Browser RPG/MMORPG, TypeScript, action battle, inventory, Tiled, server-authoritative multiplayer | MIT |
| Character generator + 2D animations | **Universal LPC Spritesheet Character Generator** | Modular bodies/hair/clothes/weapons; walk, slash, thrust, shoot, hurt, spellcast; broader LPC assets add jump/run/idle/sit | Mixed open licenses per layer; preserve generated credits |
| Map editor | **Tiled** | Mature tile-map editor; arbitrary layers/objects/properties; directly supported by RPGJS | Editor is GPL; map/content licensing follows the assets used |
| Pixel art / sprite editing | **Pixelorama** | Open-source sprite, tiles and animation editor; spritesheet export | MIT |
| Temporary/free art | **Kenney CC0 packs** | Fast greybox/prototype tiles, UI, characters and icons with simple licensing | CC0 |
| Narrative scripting | **ink / inkjs** | Branching dialogue and quest text can live outside combat code | MIT |
| Procedural dungeon / FOV | **rot.js** | Dungeon generation, FOV and roguelike utilities | BSD-3-Clause |
| NPC navigation (only if RPGJS pathing is insufficient) | **EasyStar.js** | Small asynchronous grid A* library | MIT |
| Advanced NPC AI (later) | **Yuka** | FSM/goal AI, steering, navigation, perception, triggers | MIT |
| Combat state orchestration (optional) | **XState** | Explicit, testable state machines for complex custom combat logic | MIT |
| Alternative base engine | **Phaser** | Excellent HTML5 2D framework if RPGJS becomes a blocker | MIT; do not migrate without a concrete blocker |
| Alternative multiplayer layer | **Colyseus** | Strong authoritative Node.js multiplayer framework | MIT; redundant while RPGJS multiplayer is retained |

---

# 1. RPGJS v5 — PRIMARY ENGINE

Repository: https://github.com/RSamaium/RPG-JS  
Starter: https://github.com/rpgjs/starter/tree/v5  
Docs/site: https://rpgjs.dev/

Why it fits this project:

- TypeScript and browser-first.
- One codebase can run as standalone RPG or MMORPG.
- Gameplay model is server-owned in MMORPG mode.
- Maps become synchronized rooms.
- Client prediction/reconciliation already exists.
- Tiled is supported.
- Real-time action battle, projectiles, items, skills, states, classes, hotbar and save/load are built in.
- Accounts, chat, mobile controls and gamepad support already exist.
- Node and Cloudflare deployment options fit our low-cost web-first goal.
- It ships an AI-assistant skill specifically intended for coding agents.

Current bootstrap:

```bash
npx degit rpgjs/starter#v5 adventurer-life-online
cd adventurer-life-online
npm install
npm run dev
```

Agent skill:

```bash
npx skills add https://github.com/RSamaium/RPG-JS#v5
```

**Decision:** build the next playable migration on RPGJS v5 before evaluating another engine.

---

# 2. Universal LPC Spritesheet Character Generator — PRIMARY 2D CHARACTER SOURCE

Primary repository:
https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator

Historic universal sheet:
https://github.com/makrohn/Universal-LPC-spritesheet

This is the strongest match found for the exact request: create customizable humanoid characters that already understand common RPG actions.

Core animation families include:

- spellcast
- thrust
- walk
- slash
- shoot
- hurt

The broader LPC ecosystem also contains compatible assets for:

- jump
- run
- idle
- sit
- tools such as axe / hammer / pickaxe / hoe / shovel
- many humanoid/fantasy heads, clothes and equipment layers

### Sword combat fit

For the first prototype:

- sword attack → **slash**
- spear/dagger thrust → **thrust**
- bow → **shoot**
- movement → **walk**
- taking damage → **hurt**
- magic → **spellcast**

Do not start by drawing a custom full animation set. First prove combat timing and feel with LPC. Replace/retouch the art after the gameplay is stable.

### Licensing rule

LPC generator artwork uses multiple licenses depending on the selected layer: CC0, CC-BY, CC-BY-SA, OGA-BY and GPL can appear.

For this project:

1. Always export and store the generator's credits/license file next to the generated spritesheet.
2. Prefer **CC0 / CC-BY / OGA-BY** layers during early development.
3. Avoid GPL and ShareAlike layers unless we intentionally accept their requirements.
4. Never assume the entire generated character is CC0 because one layer is CC0.

Create a future folder such as:

```text
assets/characters/lpc/
  player-base.png
  player-base.credits.txt
  LICENSE-NOTES.md
```

---

# 3. Pixelorama — PRIMARY SPRITE EDITOR

Repository:
https://github.com/Orama-Interactive/Pixelorama

Use it for:

- editing LPC output
- creating hair/clothes unique to our IP
- weapon sprite cleanup
- frame-by-frame attack fixes
- spritesheet export
- tiles and UI pixel art

Why it wins for this project:

- MIT license
- Windows/Linux/macOS/Web
- sprite animation workflow
- PNG / spritesheet / animated export
- command-line automation can later help the asset build pipeline

LibreSprite is also good, but Pixelorama has the simpler licensing fit for our toolchain and is actively focused on pixel-art production.

LibreSprite alternative:
https://github.com/LibreSprite/LibreSprite

---

# 4. Tiled — PRIMARY MAP EDITOR

Repository:
https://github.com/mapeditor/tiled

Use Tiled for:

- villages
- roads
- forests
- interiors
- collision objects
- NPC/event spawn points
- portals
- quest trigger zones
- combat arenas
- dungeon rooms

Tiled supports arbitrary properties on maps/layers/tiles/objects. Use those properties rather than hard-coding map-specific logic.

Suggested custom object properties:

```text
type: npc | monster | portal | quest_trigger | harvest | chest
id: stable-content-id
spawnGroup: optional-group
questId: optional-quest
targetMap: optional-map
targetX / targetY
```

RPGJS v5 already supports Tiled, so no translation layer should be invented unless necessary.

---

# 5. Kenney — PRIMARY GREYBOX / PLACEHOLDER ASSETS

Site:
https://kenney.nl/assets

Useful CC0 packs verified during research include:

- RPG Base
- Roguelike Characters
- RPG Urban Pack
- UI Pack
- UI Pack RPG Expansion
- Pixel UI Pack
- Development Essentials

Use Kenney for temporary UI/world assets where LPC does not cover the need.

**Rule:** prototype quickly with CC0 assets, then replace only the visuals that matter to the final identity. Do not block gameplay on final art.

---

# 6. Combat architecture for Codex

Do not bind combat logic directly to animation frame names.

Use an explicit combat state model:

```text
IDLE
  -> MOVE
  -> ATTACK_WINDUP
  -> ATTACK_ACTIVE
  -> ATTACK_RECOVERY
  -> IDLE

ANY ALIVE STATE
  -> HURT
  -> IDLE

HP <= 0
  -> DEAD
```

Minimum attack definition:

```ts
type AttackDefinition = {
  id: string
  animation: 'slash' | 'thrust' | 'shoot' | 'spellcast'
  windupMs: number
  activeMs: number
  recoveryMs: number
  range: number
  arcDegrees?: number
  damageMultiplier: number
  staminaCost?: number
  hitOncePerTarget: boolean
}
```

For v0.2 prototype:

- one sword
- one basic slash
- one slime
- four facing directions
- attack hitbox only exists during ATTACK_ACTIVE
- target can only be hit once per swing
- movement slowed or locked during ATTACK_ACTIVE
- damage and animation are driven by the same state but remain separate systems

This gives us a clean base for combo chains, dodge, block, skills and PvP later.

XState can model this if the custom combat logic becomes complex:
https://github.com/statelyai/xstate

Do **not** add XState solely to make the dependency list look sophisticated. RPGJS/native TypeScript state is enough for the first migration.

---

# 7. EasyStar.js — OPTIONAL GRID PATHFINDING

Repository:
https://github.com/prettymuchbryce/easystarjs

Use only if the RPGJS/Tiled movement layer does not already solve an NPC navigation case.

Good uses:

- villager walks between home and shop
- guard patrol
- monster follows player around walls
- companion walks to a destination

It is asynchronous A* and MIT licensed.

Avoid calculating a new global path every frame. Recalculate on destination changes, obstacle changes, or a timed interval.

---

# 8. Yuka — LATER ADVANCED NPC AI

Repository:
https://github.com/Mugen87/yuka

Capabilities include:

- state-driven agents
- goal-driven agents
- steering
- graph search and navmesh navigation
- perception / vision / memory
- triggers
- fuzzy logic

This is useful later for believable guards, animals, companions and monsters.

It is **not** needed for the current Player-First prototype. NPCs should not become expensive autonomous bot players.

---

# 9. rot.js — DUNGEON / FOV TOOLBOX

Repository:
https://github.com/ondras/rot.js

Use later for:

- procedural dungeon layouts
- field of view
- dungeon pathing
- seeded random generation
- roguelike utilities

This is a strong candidate for generating layouts for the long-term 100-floor dungeon without hand-authoring every room.

Keep authored landmarks/boss rooms separate from procedural connective rooms.

---

# 10. ink / inkjs — DIALOGUE AND QUEST TEXT

Main language:
https://github.com/inkle/ink

JavaScript runtime:
https://github.com/inkle/inkjs

Use for content that becomes awkward inside TypeScript:

- branching NPC conversation
- quest decisions
- reputation-gated dialogue
- hidden clues
- multi-step story events

Do not move core combat/economy authority into Ink. Treat it as narrative logic/content, while gameplay outcomes are validated by RPGJS/server code.

---

# 11. Phaser — FALLBACK / LOWER-LEVEL ALTERNATIVE

Repository:
https://github.com/phaserjs/phaser

Phaser remains an excellent choice for pure browser 2D games and has a very large ecosystem.

Use Phaser only if we find a concrete RPGJS blocker such as:

- rendering limitation we cannot extend
- networking constraint incompatible with our design
- plugin/architecture limitation that materially blocks production

If we pivot to Phaser, a likely replacement stack is:

```text
Phaser
+ Tiled
+ LPC
+ EasyStar.js
+ ink
+ Colyseus
+ optional XState
```

This is flexible but creates more integration and maintenance work than RPGJS for our specific RPG/MMORPG goal.

---

# 12. Colyseus — MULTIPLAYER ALTERNATIVE, NOT CURRENT DEPENDENCY

Repository:
https://github.com/colyseus/colyseus

Colyseus is an MIT-licensed authoritative multiplayer framework with room architecture, matchmaking, reconnection and state synchronization.

It is excellent if we build on Phaser or another client-only engine.

**Do not add it to RPGJS v5 now.** RPGJS already has server authority and synchronized map rooms. Running both would duplicate networking responsibilities.

---

# 13. 3D option — NOT FOR THE CURRENT PROTOTYPE

If the project later moves to lightweight 3D, two unusually useful CC0 sources were found.

## Quaternius Universal Animation Library

https://quaternius.itch.io/universal-animation-library

- 120+ humanoid animations
- 8-direction locomotion
- jog/sprint
- combat
- gun
- emotes
- crawling/swimming/sitting/death
- root-motion and non-root-motion versions
- GLB/FBX/Blend workflows
- CC0

Universal Animation Library 2 adds more combat/parkour/farming/zombie motion:
https://quaternius.itch.io/universal-animation-library-2

## KayKit Character Animations

https://kaylousberg.itch.io/kaykit-character-animations

- GLTF/FBX
- locomotion / character animation packs
- CC0
- designed to work with KayKit characters

These are excellent future options, but switching to 3D now would conflict with the current low-spec pixel prototype goal.

---

# Recommended implementation order

## Phase A — v0.2 movement + LPC animation

1. Bootstrap RPGJS v5 in a new prototype folder.
2. Recreate one map and movement from v0.1.
3. Add one LPC player sprite.
4. Implement four-direction idle/walk.
5. Preserve the existing v0.1 folder untouched as a reference.

## Phase B — sword combat

1. Add the combat state model.
2. Bind slash animation to attack state.
3. Add timed hitbox.
4. Add one slime with HP / hurt / death.
5. Add EXP/drop.
6. Add hit cooldown and anti-double-hit.

## Phase C — RPG loop

1. NPC interaction.
2. first quest
3. merchant
4. inventory/potion
5. portal/map transition
6. save/load

## Phase D — online proof

1. Run the same map in RPGJS MMORPG mode.
2. Two browser clients.
3. Verify server-owned movement/combat state.
4. Verify both clients see monster death consistently.
5. Add account/save only after sync is correct.

## Phase E — content tools

1. Tiled content conventions.
2. LPC asset credits pipeline.
3. Ink dialogue experiment.
4. Pixelorama art refinement.
5. rot.js procedural dungeon spike.

---

# What Codex should NOT do yet

- Do not build the full 100-floor dungeon.
- Do not implement thousands of concurrent users before a 2–10 player test works.
- Do not introduce Phaser + Colyseus beside RPGJS without a documented blocker.
- Do not build autonomous NPC adventurers that consume player quests/economy.
- Do not create a bespoke character animation system before testing LPC.
- Do not replace working gameplay with a graphics rewrite.
- Do not copy copyrighted game assets from Ragnarok, DDTank, BOOMZ or other commercial games.
- Do not assume open-source code license equals asset license.

---

# First acceptance gate

The next prototype is accepted when two builds exist:

1. **Standalone:** open the game, move, attack with a sword, kill slime, receive EXP/drop, talk to quest NPC, save.
2. **Online proof:** two browser clients can join the same map and observe consistent player/monster combat state controlled by the server.

Art can still be temporary.

That is the point at which we should spend more time on custom character art, classes, combo depth and shared-world scale.

---

# Sources checked 2026-10-02

- RPGJS: https://github.com/RSamaium/RPG-JS
- RPGJS stable release: https://rpgjs.dev/blog/rpgjs-v5-stable-release/
- RPGJS starter: https://github.com/rpgjs/starter/tree/v5
- Phaser: https://github.com/phaserjs/phaser
- Universal LPC Generator: https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator
- Historic LPC sheet: https://github.com/makrohn/Universal-LPC-spritesheet
- Tiled: https://github.com/mapeditor/tiled
- Pixelorama: https://github.com/Orama-Interactive/Pixelorama
- LibreSprite: https://github.com/LibreSprite/LibreSprite
- EasyStar.js: https://github.com/prettymuchbryce/easystarjs
- Yuka: https://github.com/Mugen87/yuka
- rot.js: https://github.com/ondras/rot.js
- XState: https://github.com/statelyai/xstate
- ink: https://github.com/inkle/ink
- inkjs: https://github.com/inkle/inkjs
- Colyseus: https://github.com/colyseus/colyseus
- Kenney: https://kenney.nl/assets
- Quaternius Universal Animation Library: https://quaternius.itch.io/universal-animation-library
- KayKit Character Animations: https://kaylousberg.itch.io/kaykit-character-animations

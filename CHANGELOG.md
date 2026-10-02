# Changelog

## 2026-10-02 — RPGJS one-scene presentation and control pass

- Reused v0.1 original painted hero, distinct NPCs, slime, props and deterministic village/meadow terrain through reproducible adapters; preserved v0.1 runtime and save.
- Added the 800×450 camera, compact parchment HUD, optional debug telemetry, destination marker, opaque hurt feedback, slash arc and damage numbers. Restored the original village/meadow audio with independent preferences.
- Corrected CSS-scaled mouse coordinates; added eight-way routes with hitbox clearance/corner guards and a shared footprint collision mask. Matched the 350ms sword cycle while retaining authoritative active-window damage.
- Repaired old v0.2 save locations only when inside new blockers; added monster home leashes for persistent online maps. Rendered ground as one bitmap instead of 2,040 visible tile components.
- Kept retreat navigation usable during hurt, added physics-bounded slime knockback, fixed logical renderer dimensions across transfers and prevented focus from scrolling the game frame. Disabled client movement prediction for consistent server-driven routes.
- Verification and owner review status are recorded in the candidate PARITY-REVIEW.md; product acceptance remains pending.

## 2026-10-02 — Quality-first repository reset

- Owner authorized revising the earlier engine migration guidance after rejecting v0.2's presentation/control regression. Restored v0.1 as the recommended playable reference; retained RPGJS v0.2 as a technical experiment.
- Added root agent instructions, prototype index, implementation decision review and a one-scene parity handoff. Marked earlier research/handoff engine/LPC exclusivity as superseded while retaining source/license research and historical evidence.
- Kept production engine selection open; allowed an isolated Phaser 4 comparison if justified by comparative fit/cost evidence. No engine pivot or new runtime dependency implemented in this reset.
- Added owner visual/feel review and measured browser-cost gates alongside functional/authoritative online gates. v0.1 runtime/assets/save are unchanged; no scope expansion.


## 2026-10-02 — RPGJS v5 Adventurer prototype v0.2

- Imported latest main including v0.2.3 research/handoff and created a separate `prototype/rpgjs-v5-adventurer-v0.2/`; preserved the playable v0.1.
- Added RPGJS 5.0.0/TypeScript, Tiled village/meadow content IDs, actual Universal LPC layers with OGA-BY 3.0 credit exports and semantic animation adapter.
- Implemented phased sword combat, slime AI/death/respawn, authoritative EXP/drop and single-claim reward, three-kill quest/turn-in/level-up, inventory/potion, portals and isolated standalone save slots. Added original synthesized music/slash/hurt audio.
- Verified two MMORPG clients sharing movement and the same dead slime; the contested death granted one reward. Verified standalone quest turn-in and save/reload. Fixed ID hydration and departed-room autosave regressions.
- Added 18 focused tests and production map/theme HTTP smoke. README/acceptance document server authority, reproduction commands, guest/in-memory online-save limitations and art/death placeholders. No MMO-scale scope expansion.


## 2026-10-02 — Player visibility fix and original audio

- Fixed hurt timer underflow causing the player to remain faded; clamp timers and reset transient combat state on load/save. Keep the player opaque with a red hit indicator.
- Added original Web Audio village/meadow music, slash/hurt effects, level chime, gesture activation, saved mute/volume controls and tab suspension.
- Added audio scheduling/control tests and opacity regression checks.


## 2026-10-02 — Playable Willowbrook art-quality pass

- Replaced key prototype scenery, adventurer, NPCs and slime with original illustrated sprites and directional animation sheets.
- Improved village composition, terrain, camera, UI and melee feedback while preserving gameplay/save compatibility.
- Added generation prompts, asset provenance, extraction tools and runtime asset checks. See prototype/web-pixel-rpg-v0.1/ART-DIRECTION.md.

## 2026-10-02 — Monster tiers and melee progression

- Added Lv.1 slime, Lv.3 azure slime and Lv.5 boar with distinct HP, attack, movement, EXP and gold rewards.
- Click monsters to approach and repeatedly slash; keyboard movement or clicking the ground cancels targeting.
- Player ATK equals level; each level adds 5 max HP and heals. EXP rolls over and levels persist in the existing save.
- Higher-tier monsters retaliate when attacked and remain passive toward low-level beginners.


## 2026-10-02 — Click-to-move

- Added left-click movement with obstacle routing, destination marker and keyboard override; clear routes on portal travel or defeat.
- Validated arrival, water detour, blocked target, keyboard takeover and portal cancellation.


## Web Pixel RPG v0.1.1 — 2026-10-02 — Visual Baseline

- Replaced prototype rendering with original pixel tiles, directional actors, animated slime and fantasy UI.
- Added camera follow, Y depth sorting, collision aligned with artwork and combat feedback while preserving the original game loop/save key.
- Added modular source files, asset license/credits, dev/build scripts, regression checks and three screenshots.
- Details: prototype/web-pixel-rpg-v0.1/CHANGELOG.md.
## v0.2.4 — 2026-10-02 — Commercial-Safe Game Audio Research

- Added `research/game-audio-sources-2026-10-02.md`, covering commercial-safe game music, SFX, ambience and open-source sound generators.
- Added `research/evidence/game-audio-source-matrix-2026-10-02.csv` so Codex/CI can consume source, license, attribution and accept/review/reject status as structured data.
- Selected Kenney CC0, Sonniss GameAudioGDC, OpenGameArt CC0, Freesound CC0 and itch.io CC0 as the primary external audio path.
- Added the unified `uncle-sheepsky/duru-ai-cc0-bgm` repository as the canonical DURU/HYAK CC0 music source.
- Selected jfxr as the preferred SFX generator because its README explicitly grants unrestricted commercial use of generated sounds; retained jsfxr and rFXGen with provenance requirements.
- Documented the critical Mixkit split: the Sound Effects Free License allows video games, while the Stock Music Free License explicitly does not.
- Added review rules for Pixabay, ZapSplat Basic and ccMixter CC-BY, with hard rejection of NC/ND/unknown-license material.
- Added an audio folder plan, per-file metadata contract, automatic attribution requirement and Codex/CI license gate.
- Recorded Sonniss GameAudioGDC v2.0's commercial/no-attribution grant, raw-redistribution limits, download-date license-version rule and AI/ML-training prohibition.
- Linked the new audio research and machine-readable matrix from the README evidence map.

## v0.2.3 — 2026-10-02 — Open-Source Toolchain Research & Codex Handoff

- Researched current open-source/browser game tooling for character creation, walk/combat/sword animations, maps, AI, pathfinding, procedural dungeons, narrative and multiplayer.
- Confirmed RPGJS v5.0.0 as the primary next architecture because it now provides stable TypeScript browser RPG/MMORPG support with action battle, Tiled, authoritative multiplayer, prediction/reconciliation, accounts and chat.
- Added `research/open-source-game-development-stack-2026-10-02.md` with adoption guidance for RPGJS v5, Universal LPC, Tiled, Pixelorama, Kenney, ink, rot.js, EasyStar.js, Yuka, XState, Phaser, Colyseus and optional 3D CC0 animation libraries.
- Selected Universal LPC as the first character-animation source for walk/slash/thrust/shoot/hurt/spellcast and documented the mixed-license/credits requirement.
- Added `prototype/web-pixel-rpg-v0.1/CODEX-HANDOFF-RPGJS-v0.2.md` with a concrete migration mission, sword-combat state contract, multiplayer proof, tests and acceptance gates.
- Kept Phaser + Colyseus as a fallback stack only; they should not be added beside RPGJS without a documented blocker.
- Preserved `prototype/web-pixel-rpg-v0.1/` as the known playable baseline.

## v0.2.2 — 2026-10-02 — First Playable Web Pixel RPG Prototype

- Added `prototype/web-pixel-rpg-v0.1/index.html`, the first directly playable browser prototype.
- Locked a gameplay-first, low-spec direction for the technical prototype: art quality is intentionally minimal for now.
- Implemented movement, NPC interaction, starter quest, slime combat, HP/EXP/level, gold, potion/merchant, item drop, inventory, map transition and local browser save.
- Added `AGENTS.md` so ChatGPT/Codex/Claude can continue the prototype consistently.
- Selected RPGJS v5 + TypeScript + Tiled/RPGJS Studio as the next online architecture target after validating the loop.
- Multiplayer, accounts, chat and server-side persistence remain next milestones; v0.1 is intentionally zero-dependency and local-first.

## v0.2.1 — 2026-10-01 — Player / NPC Boundary Correction

- Locked the **Player-First Adventurer World** principle: real players remain the primary adventurers and NPCs must not consume the core game loop in their place.
- Reframed adventurer NPCs into four roles: World NPC, Ambient Adventurer, Story Adventurer and Companion.
- Removed the direction where NPCs autonomously reserve player-facing contracts, settle a parallel adventurer economy, grind qualification evidence or drive promotion as bot players.
- Separated Player Contract Pool from NPC Narrative Activity so NPC atmosphere does not remove meaningful player content.
- Made Main Dungeon breakthroughs, major bosses, first discoveries, prestige and important world-event outcomes player-centric.
- Bounded NPC economy to services, authored shortages and world presentation rather than continuous bot farming/trading.
- Clarified that persistent NPC state means continuity of identity/story/relationship/availability, not continuous autonomous player simulation.
- Added owner direction toward a **lightweight shared-world Adventurer RPG** with web-first ambitions, ordinary-PC accessibility, zones/channels/instances and scalable online play.
- Kept engine, networking stack, backend, exact concurrency model and final platform matrix open pending technical prototypes.
- Retained the offline solo vertical-slice harness strictly as a development tool, not the final product vision.
- Preserved v0.1 and v0.2 as historical concept checkpoints; v0.2.1 supersedes only conflicting Player/NPC and shared-world assumptions.
- v0.3 Combat & Classes remains the next planned concept version; no v0.3 work was started in this correction.

## v0.2 — 2026-10-01 — World, Guild, Factions & Starter Region

### Checkpoint 1 — world and professional foundation

- Added v0.2 overview with explicit working-proposal and tuning status; preserved all v0.1 locks and the complete v0.1 document.
- Proposed three world names, historical layers, three landmasses, starter kingdom and regional route graph.
- Specified one city, three villages, secondary town, surface resources, small dungeon and distinct main floors 1–3.
- Added ten factions, three candidate peoples, bounded magic, currency and worked early budgets.
- Defined physical Guild operations, license/contract lifecycle, risk eligibility, emergency duties, appeals and practical F → E assessment.
- Cast, quest integration, market evidence and final verification were pending at this checkpoint.

### Checkpoint 2 — people, contracts and playable progression

- Added 28 original working NPCs with goals, relationships, secrets and development; distinguished 14 persistent adventurers from support cast.
- Specified saved career ticks, protected reservations, independent promotion/retirement and observable world changes.
- Added 18 authored contracts covering six quest families, explicit rewards, retreat routes and qualification alternatives.
- Connected several first-ten-hour paths, affordable upgrades, first dungeon trip and practical promotion.
- Added bounded vertical-slice content, implementation-neutral data contracts, production gates, usability criteria and scope exclusions.
- Market evidence, decision register and final cross-document audit were pending at this checkpoint.

### Checkpoint 3 — research, integration and handoff

- Completed v0.2 overview and role-based README navigation across the canonical detail documents.
- Researched fourteen game comparators with direct Steam API counts dated 2026-10-01; retained exact filters, timestamps and source URLs in CSV.
- Separated product facts, 19 multilingual review opinions, Reddit demand signals, market-gap inference and our design proposals.
- Covered Thailand, Japan, China, Korea, Europe and America with explicit evidence limits; distinguished reception from sales and service discontinuation from unverified financial loss.
- Mapped all 18 requested media references to transferable design hypotheses and Original IP boundaries; disclosed premise/video/access limits.
- Added open-decision register, four Proposed Change records and requirements/consistency audit.
- Verified local links, stable IDs, metrics arithmetic and worked budgets; preserved the v0.1 foundation unchanged.
- No gameplay implementation or playtest is claimed. v0.3 Combat & Classes remains the next concept version.

## v0.1 — 2026-10-01 — Foundation

Initial Game Concept Bible.

Established:
- Adventurer Life RPG identity.
- F → S guild rank ladder.
- One-rank-above quest risk rule.
- Separate character power and guild rank.
- Living Adventurer Guild.
- Starting profession framework.
- Promotion exam philosophy.
- Six quest families.
- Dynamic and hidden quest direction.
- Expanding world by adventurer rank.
- Purpose-driven towns and villages.
- 100-floor dungeon split into 10 strata.
- NPC adventurer career simulation.
- Multi-dimensional reputation.
- Economy and equipment philosophy.
- Dynamic world events.
- First-hour player experience.
- Inspiration study map.
- Initial market positioning.
- Multiplayer, combat, and art kept open.
- Vertical-slice scope guardrails.
- v0.2 world-building questions.

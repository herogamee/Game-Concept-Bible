# Game Concept Bible

Canonical design repository for the original fantasy **Adventurer Life RPG** project.

## Current direction

The player begins as an ordinary **F-rank adventurer**, chooses a profession, joins an Adventurer Guild, accepts ranked quests, travels through towns and villages, forms relationships and parties, grows toward S-rank, and explores a mysterious 100-floor dungeon.

The core fantasy is not "be the chosen hero immediately." It is:

> **Live the life of an adventurer, start from nothing, earn your name, and discover a world that changes with you.**

## Current Bible

- [Game Concept Bible v0.2.1 — Player / NPC Boundary Correction](bible/GAME-CONCEPT-BIBLE-v0.2.1.md)
- [Game Concept Bible v0.2 — preserved world/Guild proposal](bible/GAME-CONCEPT-BIBLE-v0.2.md)
- [Game Concept Bible v0.1 — preserved foundation](bible/GAME-CONCEPT-BIBLE-v0.1.md)
- [Changelog](CHANGELOG.md)

v0.2.1 is the current direction correction. It preserves v0.2's useful world/Guild work while locking a **Player-First Adventurer World**: NPCs enrich the world but do not autonomously consume the core player loop. The long-term product direction is a lightweight shared-world Adventurer RPG with web-first ambitions and low hardware requirements; engine and networking technology remain open. Documents remain in English for continuity with v0.1; project discussion may be Thai.

## Start here by role

| Reader | Suggested sequence |
|---|---|
| New team member | v0.2.1 correction → v0.2 overview → vertical slice → first ten hours |
| Producer / programmer | Slice → contracts → NPC simulation → rank/promotion → economy |
| World / narrative designer | World → starter region → factions → cast → magic/species |
| Research / product reviewer | Market → community → reference study → decision register |

## Document map

- World: [foundation](world/world-overview.md), [starter region and routes](world/starter-region.md), [ten factions](world/factions.md), [peoples/species](world/species.md), [magic](world/magic-system.md), [economy and budgets](world/economy.md).
- Guild: [organization and physical hall](guild/adventurer-guild.md), [rank/eligibility](guild/rank-system.md), [promotion and practical exam](guild/promotion-system.md).
- People: [28 starter NPCs](characters/starter-npcs.md), [player-first NPC roles and persistence](design/npc-simulation.md).
- Playable planning: [first ten hours](design/first-10-hours.md), [18 authored contracts](design/starter-quests.md), [bounded vertical slice](design/vertical-slice.md).
- Evidence: [market comparison](research/game-market-research.md), [community demand](research/community-demand.md), [reference study](research/anime-reference-study.md), [open-source implementation stack](research/open-source-game-development-stack-2026-10-02.md), [commercial-safe game audio resources](research/game-audio-sources-2026-10-02.md), [audio source/license matrix](research/evidence/game-audio-source-matrix-2026-10-02.csv), [dated Steam counts](research/evidence/steam-review-counts-2026-10-01.csv), [individual review index](research/evidence/community-review-index-2026-10-01.csv).
- Review: [open decisions and Proposed Changes](design/decisions.md), [requirements coverage and audit](design/requirements-and-audit.md).

## Source of truth and workflow

Preserve previous Bible versions. Foundation locks and explicit owner approvals take priority; v0.2.1 supersedes v0.2 only where Player/NPC boundaries and shared-world direction conflict. v0.2 remains the current integrated world/Guild proposal, with linked specialist documents owning detailed rules. Research is supporting evidence, not canonical lore. The [decision register](design/decisions.md) records proposals before locked concepts change.

For each meaningful checkpoint, update the current Bible and CHANGELOG, check references and consistency, commit with a clear message and push to this repository. Never treat documentation completeness as proof that a mechanic is balanced or implemented.

The next concept step after this correction is v0.3 Combat & Classes, supported by a small greybox career loop and combat comparison. The active [implementation reset](design/implementation-reset-2026-10-02.md) keeps v0.1 as the playable quality reference and RPGJS v0.2 as a technical experiment. Final engine selection awaits comparable visual/control and browser-cost evidence; read the [current handoff](prototype/CODEX-HANDOFF-QUALITY-PARITY.md). Shared-world intent does not justify MMO-scale implementation yet; avoid building networking at scale or the remaining 97 floors before the core loop is validated.

## Design pillars

1. Start small — F-rank should genuinely feel weak and poor.
2. Adventurer Guild is a living social hub, not just a quest menu.
3. Guild rank and character power are separate progression systems.
4. The world changes around the player, while real players remain the primary adventurers; NPCs provide continuity, story, services, atmosphere and companion support rather than autonomous bot progression.
5. Exploration and preparation matter as much as combat.
6. The 100-floor dungeon is a long-term mystery, not the entire world.
7. Hidden quests and discoveries reward curiosity rather than map-marker chasing.
8. Original IP first — inspirations are studied as design references, not copied.

## Versioning

The Bible uses semantic-style concept versions:

- v0.1 — Foundation
- v0.2 — World & Factions
- v0.2.1 — Player / NPC Boundary Correction
- v0.3 — Combat & Classes
- v0.4 — Quest/NPC Simulation
- v0.5 — Dungeon & Exploration
- v0.6 — Economy/Crafting
- v0.7 — Multiplayer/Social direction
- v0.8 — Art/UX direction
- v0.9 — Prototype specification
- v1.0 — First complete pre-production Bible

Last updated: 2026-10-02

## Playable prototypes and current direction

See [implemented game status](PROJECT-STATUS.md) and [setup on another computer](DEVELOPING.md). The current source/preview branch is `codex/rpgjs-v0.2`; prototype implementation is separate from Bible version numbers.

Start with **[v0.1 — illustrated Willowbrook](prototype/web-pixel-rpg-v0.1/README.md)**, the recommended playable and presentation/control reference. See the [prototype index](prototype/README.md) and [current implementation handoff](prototype/CODEX-HANDOFF-QUALITY-PARITY.md).

[Willowbrook Adventurer v0.2](prototype/rpgjs-v5-adventurer-v0.2/readme.md) is a technical experiment that has not passed product parity. It uses RPGJS v5, TypeScript and Tiled with original v0.1 illustrated art; inactive Universal LPC assets retain credits. It is separate from the preserved v0.1. The candidate includes a phased sword/slime loop, three-kill quest, inventory/potion, EXP/drop, portals/save, a local server-authoritative two-client mode, display-density choices, saved adjustable camera framing, continuous diagonal movement, authored scenery anchoring and a durable appearance foundation. See its README and evidence records for run commands and limitations.

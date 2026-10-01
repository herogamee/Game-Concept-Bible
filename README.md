# Game Concept Bible

Canonical design repository for the original fantasy **Adventurer Life RPG** project.

## Current direction

The player begins as an ordinary **F-rank adventurer**, chooses a profession, joins an Adventurer Guild, accepts ranked quests, travels through towns and villages, forms relationships and parties, grows toward S-rank, and explores a mysterious 100-floor dungeon.

The core fantasy is not "be the chosen hero immediately." It is:

> **Live the life of an adventurer, start from nothing, earn your name, and discover a world that changes with you.**

## Current Bible

- [Game Concept Bible v0.2 — World, Guild, Factions & Starter Region](bible/GAME-CONCEPT-BIBLE-v0.2.md)
- [Game Concept Bible v0.1 — preserved foundation](bible/GAME-CONCEPT-BIBLE-v0.1.md)
- [Changelog](CHANGELOG.md)

v0.2 is a complete **documentation proposal**, with working names and prototype tuning explicitly marked. It preserves v0.1's locks; it does not silently approve final combat, platforms, multiplayer, death rules or commercial model. Documents remain in English for continuity with v0.1; the project brief and discussion may be Thai.

## Start here by role

| Reader | Suggested sequence |
|---|---|
| New team member | v0.2 overview → vertical slice → first ten hours |
| Producer / programmer | Slice → contracts → NPC simulation → rank/promotion → economy |
| World / narrative designer | World → starter region → factions → cast → magic/species |
| Research / product reviewer | Market → community → reference study → decision register |

## Document map

- World: [foundation](world/world-overview.md), [starter region and routes](world/starter-region.md), [ten factions](world/factions.md), [peoples/species](world/species.md), [magic](world/magic-system.md), [economy and budgets](world/economy.md).
- Guild: [organization and physical hall](guild/adventurer-guild.md), [rank/eligibility](guild/rank-system.md), [promotion and practical exam](guild/promotion-system.md).
- People: [28 starter NPCs](characters/starter-npcs.md), [14-adventurer career simulation](design/npc-simulation.md).
- Playable planning: [first ten hours](design/first-10-hours.md), [18 authored contracts](design/starter-quests.md), [bounded vertical slice](design/vertical-slice.md).
- Evidence: [market comparison](research/game-market-research.md), [community demand](research/community-demand.md), [reference study](research/anime-reference-study.md), [dated Steam counts](research/evidence/steam-review-counts-2026-10-01.csv), [individual review index](research/evidence/community-review-index-2026-10-01.csv).
- Review: [open decisions and Proposed Changes](design/decisions.md), [requirements coverage and audit](design/requirements-and-audit.md).

## Source of truth and workflow

Preserve previous Bible versions. Foundation locks and explicit owner approvals take priority; v0.2 supplies the current integrated proposal, with linked specialist documents owning detailed rules. Research is supporting evidence, not canonical lore. The [decision register](design/decisions.md) records proposals before locked concepts change.

For each meaningful checkpoint, update the current Bible and CHANGELOG, check references and consistency, commit with a clear message and push to this repository. Never treat documentation completeness as proof that a mechanic is balanced or implemented.

The next reasonable production step is the slice's greybox career loop and a small combat comparison for v0.3. Avoid expanding into MMO scope or building the remaining 97 floors before the loop is validated.

## Design pillars

1. Start small — F-rank should genuinely feel weak and poor.
2. Adventurer Guild is a living social hub, not just a quest menu.
3. Guild rank and character power are separate progression systems.
4. Towns, villages, NPC adventurers, factions, and quests continue to change.
5. Exploration and preparation matter as much as combat.
6. The 100-floor dungeon is a long-term mystery, not the entire world.
7. Hidden quests and discoveries reward curiosity rather than map-marker chasing.
8. Original IP first — inspirations are studied as design references, not copied.

## Versioning

The Bible uses semantic-style concept versions:

- v0.1 — Foundation
- v0.2 — World & Factions
- v0.3 — Combat & Classes
- v0.4 — Quest/NPC Simulation
- v0.5 — Dungeon & Exploration
- v0.6 — Economy/Crafting
- v0.7 — Multiplayer/Social direction
- v0.8 — Art/UX direction
- v0.9 — Prototype specification
- v1.0 — First complete pre-production Bible

Last updated: 2026-10-01

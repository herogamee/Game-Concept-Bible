# Game Concept Bible

Canonical design repository for the original fantasy **Adventurer Life RPG** project.

## Current direction

The current character-authoring priority is the owner's [fixed-template asset standard](prototype/rpgjs-v5-adventurer-v0.2/CHARACTER-APPEARANCE.md#owner-defined-fixed-template-asset-standard--2026-10-06): one normal head and body, fixed registration, separate eye sets (eyes/brows/mouth) and face sets, integrated clothing sets, and full-costume replacement. This supersedes the old generic face/eyes and shirt/pants/shoes target. A front-pose subset now exists; the full authoring standard and legacy runtime integration remain unfinished. Establish a repeatable production process before projecting a catalog of thousands or moving the art study into another engine.

The [fixed-front clothing follow-up](prototype/rpgjs-v5-adventurer-v0.2/evidence/fixed-template-v1/CLOTHING-REVIEW.md) runs at `http://127.0.0.1:5199/fixed-template`: the original outfit plus exactly two new knight/mage clothing bundles, three eye/brow/mouth sets and two cheek-detail face sets plus none. All share one published head and protected exposed-body regions at the same registration. Select categories independently, remove hair, hide eyes and compare three outfits/nine head pairs. All 108 composition/visibility cases passed technical checks. Owner art acceptance, broader clothing/equipment topology, animation coverage and mass-production throughput remain pending.

The RPGJS candidate now has a **[Character Lab](prototype/rpgjs-v5-adventurer-v0.2/CHARACTER-LAB.md)** at `http://localhost:5173/lab.html` for frame inspection, local costume/face layers, sword timing and actual-game Slime testing with a separate save. Gait art and class gameplay remain pending review/development.

The local modular limb experiment failed owner visual review. Its [review record](prototype/rpgjs-v5-adventurer-v0.2/evidence/modular/REVIEW.md) includes a front-only continuous-body and head/hair registration study; these review PNGs are not integrated animation assets or an accepted replacement for the playable character.

A [new complete front character candidate](prototype/rpgjs-v5-adventurer-v0.2/evidence/character-master/front-v1-review.png) starts the art review again from one coherent drawing. Its [source and provenance](prototype/rpgjs-v5-adventurer-v0.2/assets/character-master/PROVENANCE.md) record the generated PNG and exact prompt. A [first original head/hair proof](prototype/rpgjs-v5-adventurer-v0.2/evidence/character-master/head-hair/REVIEW.md) now toggles one separate hairstyle at `http://127.0.0.1:5199/original`, using a reconstructed scalp and three fixed-frame layers. Owner design review, alternate hairstyles/clothing and animation remain pending.

A separate [registered-layer web proof](prototype/rpgjs-v5-adventurer-v0.2/evidence/registered-character/REVIEW.md) now changes face, hair and clothing using local 4.0 reference images without part fitting. Sixteen combinations and male/female Godot-reference pixel comparisons were checked. It reads commercial reference images externally; the original-art wardrobe remains unresolved.

The owner requires independent eye-set/face-set/hair/clothing choices to persist across every supported motion and action. The earlier eight-combination walking study remains evidence; it does not pass the current fixed-template production standard or implement separate eye and face sets.

A [first original side-walk study](prototype/rpgjs-v5-adventurer-v0.2/evidence/walk-side-v1/REVIEW.md) now runs at `http://127.0.0.1:5199/walk`: two face variants, two hairstyles and two outfit colourways through eight frames, with live changes that preserve position/phase. All 64 composition cases were checked. Natural gait, source-edge quality and owner acceptance remain pending; neutral idle, other views and combat actions are not implemented for this character.

The player begins as an ordinary **F-rank adventurer**, chooses a profession, joins an Adventurer Guild, accepts ranked quests, travels through towns and villages, forms relationships and parties, grows toward S-rank, and explores a mysterious 100-floor dungeon.

The core fantasy is not "be the chosen hero immediately." It is:

> **Live the life of an adventurer, start from nothing, earn your name, and discover a world that changes with you.**

## Current Bible

- [Game Concept Bible v0.3 — Combat & Classes Candidate](bible/GAME-CONCEPT-BIBLE-v0.3.md) — active prototype candidate; combat balance/final class structure not yet locked
- [Game Concept Bible v0.2.1 — Player / NPC Boundary Correction](bible/GAME-CONCEPT-BIBLE-v0.2.1.md)
- [Game Concept Bible v0.2 — preserved world/Guild proposal](bible/GAME-CONCEPT-BIBLE-v0.2.md)
- [Game Concept Bible v0.1 — preserved foundation](bible/GAME-CONCEPT-BIBLE-v0.1.md)
- [Changelog](CHANGELOG.md)

v0.2.1 is the current direction correction. It preserves v0.2's useful world/Guild work while locking a **Player-First Adventurer World**: NPCs enrich the world but do not autonomously consume the core player loop. The long-term product direction is a lightweight shared-world Adventurer RPG with web-first ambitions and low hardware requirements; engine and networking technology remain open. Documents remain in English for continuity with v0.1; project discussion may be Thai.

## Start here by role

| Reader | Suggested sequence |
|---|---|
| New team member | v0.2.1 correction → integration guardrails → consolidation audit → vertical slice → first ten hours |
| Producer / programmer | Slice → contracts → NPC simulation → rank/promotion → economy |
| World / narrative designer | Main story/world mystery → world expansion → starter region → factions → cast → magic/species |
| Research / product reviewer | Market → community → reference study → decision register |

## Document map

- Narrative: [main story and world mystery](story/MAIN-STORY-AND-WORLD-MYSTERY-v0.1.md), [post-S and life endgame](design/POST-S-AND-LIFE-ENDGAME-v0.1.md).
- World: [foundation](world/world-overview.md), [world expansion](world/WORLD-EXPANSION-v0.1.md), [starter region and routes](world/starter-region.md), [ten factions](world/factions.md), [peoples/species](world/species.md), [magic](world/magic-system.md), [economy and budgets](world/economy.md).
- Guild: [organization and physical hall](guild/adventurer-guild.md), [rank/eligibility](guild/rank-system.md), [promotion and practical exam](guild/promotion-system.md).
- People: [28 starter NPCs](characters/starter-npcs.md), [player-first NPC roles and persistence](design/npc-simulation.md).
- Playable planning: [first ten hours](design/first-10-hours.md), [18 authored contracts](design/starter-quests.md), [bounded vertical slice](design/vertical-slice.md).
- Progression & combat: [v0.3 combat/classes candidate](bible/GAME-CONCEPT-BIBLE-v0.3.md), [combat kernel](design/COMBAT-KERNEL-v0.1.md), [four-loadout matrix](design/COMBAT-APTITUDE-PROTOTYPE-MATRIX-v0.1.md), [playtest scorecard](design/COMBAT-PLAYTEST-SCORECARD-v0.1.md), [hybrid skills and mastery](design/SKILLS-AND-MASTERY-v0.1.md).
- Creatures: [monster and boss design bible](creatures/MONSTER-AND-BOSS-BIBLE-v0.1.md).
- Economy & treasure systems: [currency and money](economy/CURRENCY-AND-MONEY-v0.1.md), [treasures/artifacts/relics](items/TREASURES-ARTIFACTS-AND-RELICS-v0.1.md), [manuals/techniques/inheritance](items/MANUALS-TECHNIQUES-AND-INHERITANCE-v0.1.md), [hidden realms](world/HIDDEN-REALMS-AND-INHERITANCE-v0.1.md), [trade/auction/market](design/TRADE-AUCTION-AND-MARKET-v0.1.md).
- Authored content Set 01: [50 treasures/relics](items/catalogues/ORAVEL-TREASURE-CATALOGUE-SET-01.md), [30 manuals/techniques](items/catalogues/ORAVEL-MANUALS-TECHNIQUES-SET-01.md), [10 hidden realms](world/catalogues/ORAVEL-HIDDEN-REALMS-SET-01.md), [rare materials and expedition medicines](items/catalogues/ORAVEL-RARE-MATERIALS-MEDICINES-SET-01.md).
- Weapons & equipment: [equipment bible](items/WEAPONS-ARMOR-AND-EQUIPMENT-v0.1.md), [40-item equipment catalogue](items/catalogues/ORAVEL-WEAPONS-EQUIPMENT-SET-01.md), [Signature Gear and equipment legacy](design/SIGNATURE-GEAR-AND-EQUIPMENT-LEGACY-v0.1.md).
- Artisan life: [crafting/gathering bible](design/CRAFTING-GATHERING-AND-ARTISAN-LIFE-v0.1.md), [blacksmithing](crafting/BLACKSMITHING-AND-EQUIPMENT-CRAFT-v0.1.md), [alchemy/apothecary](crafting/ALCHEMY-APOTHECARY-AND-MEDICINE-v0.1.md), [cooking/provisioning](crafting/COOKING-FOOD-AND-PROVISIONING-v0.1.md), [gathering/ecology](gathering/GATHERING-ECOLOGY-AND-STEWARDSHIP-v0.1.md), [first recipe/resource catalogue](crafting/catalogues/ORAVEL-ARTISAN-RECIPES-RESOURCES-SET-01.md).
- Integration: [world/system guardrails](design/WORLD-SYSTEM-INTEGRATION-GUARDRAILS-v0.1.md), [current consolidation audit](design/CONSOLIDATION-AUDIT-2026-10-03.md), [historical 2026-10-02 expansion agenda](design/NEXT-DESIGN-FRONTIER-2026-10-02.md).
- Evidence: [economy/treasure/xianxia systems research](research/ECONOMY-TREASURE-XIANXIA-SYSTEMS-RESEARCH-v0.1.md), [Chinese-fantasy treasure/manual/hidden-realm deep study](research/CHINESE-FANTASY-TREASURE-MANUAL-HIDDEN-REALM-STUDY-v0.1.md), [machine-readable Chinese-fantasy pattern matrix](research/evidence/chinese-fantasy-system-patterns-v0.1.csv), [market comparison](research/game-market-research.md), [community demand](research/community-demand.md), [reference study](research/anime-reference-study.md), [open-source implementation stack](research/open-source-game-development-stack-2026-10-02.md), [commercial-safe game audio resources](research/game-audio-sources-2026-10-02.md), [audio source/license matrix](research/evidence/game-audio-source-matrix-2026-10-02.csv), [dated Steam counts](research/evidence/steam-review-counts-2026-10-01.csv), [individual review index](research/evidence/community-review-index-2026-10-01.csv).
- Review: [open decisions and Proposed Changes](design/decisions.md), [requirements coverage and audit](design/requirements-and-audit.md).

## Coherence gate

Before proposing another major system, use [World & System Integration Guardrails](design/WORLD-SYSTEM-INTEGRATION-GUARDRAILS-v0.1.md). New mechanics must identify their in-world location/owner, reuse existing progression language where possible, connect to the Adventurer Life loop, and define a bounded playable version before expanding. Housing/life-space work begins with [Ternhaven Housing, Workshop & Social Life](design/TERNHAVEN-HOUSING-WORKSHOP-SOCIAL-LIFE-v0.1.md), not a continent-wide property simulator.

## Source of truth and workflow

Preserve previous Bible versions. Foundation locks and explicit owner approvals take priority; v0.2.1 supersedes v0.2 only where Player/NPC boundaries and shared-world direction conflict. v0.2 remains the current integrated world/Guild proposal, with linked specialist documents owning detailed rules. Research is supporting evidence, not canonical lore. The new story, world-expansion, skills, creature and post-S documents are working proposals layered on top of the current Bible; they do not silently lock Floor 100's final truth, final classes or combat balance. The [decision register](design/decisions.md) records proposals before locked concepts change.

For each meaningful checkpoint, update the current Bible and CHANGELOG, check references and consistency, commit with a clear message and push to this repository. Never treat documentation completeness as proof that a mechanic is balanced or implemented.

The active concept step is v0.3 Combat & Classes Candidate, with a bounded four-loadout comparison. Feature breadth remains frozen while the core loop is validated. The implementation reset keeps v0.1 as the playable quality reference and RPGJS v0.2 as a technical experiment; original illustrated art is allowed and LPC is optional. Read design/implementation-reset-2026-10-02.md and prototype/CODEX-HANDOFF-QUALITY-PARITY.md before the historical migration and combat handoffs. Engine selection and product parity still require measured evidence and owner visual/control review. Shared-world intent does not justify MMO-scale scope or the remaining 97 floors.

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

Last updated: 2026-10-06

## Playable prototypes and current direction

See [implemented game status](PROJECT-STATUS.md) and [setup on another computer](DEVELOPING.md). The current source/preview branch is `codex/rpgjs-v0.2`; prototype implementation is separate from Bible version numbers.

Start with **[v0.1 — illustrated Willowbrook](prototype/web-pixel-rpg-v0.1/README.md)**, the recommended playable and presentation/control reference. See the [prototype index](prototype/README.md) and [current implementation handoff](prototype/CODEX-HANDOFF-QUALITY-PARITY.md).

[Willowbrook Adventurer v0.2](prototype/rpgjs-v5-adventurer-v0.2/readme.md) is a technical experiment that has not passed product parity. It uses RPGJS v5, TypeScript and Tiled with original v0.1 illustrated art; inactive Universal LPC assets retain credits. It is separate from the preserved v0.1. The candidate includes a phased sword/slime loop, three-kill quest, inventory/potion, EXP/drop, portals/save, a local server-authoritative two-client mode, display-density choices, saved adjustable camera framing, continuous diagonal movement, authored scenery anchoring and a durable appearance foundation. See its README and evidence records for run commands and limitations.

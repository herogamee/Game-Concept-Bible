# v0.2 coverage and consistency audit

**Date:** 2026-10-01. Documentation review only; no playable prototype or player test exists in this repository.

| Requested area | Authoritative detail | Coverage / scope |
|---|---|---|
| World foundation | [World](../world/world-overview.md) | Three name options, history, landmasses/countries, Veyr, threats, Guild rationale, faith, technology/calendar |
| Starter region | [Region](../world/starter-region.md) | City, three villages, secondary town, woods, mountains, river, mine, small dungeon, main entrance, trade graph and economic purposes |
| Adventurer Guild | [Guild](../guild/adventurer-guild.md), [rank](../guild/rank-system.md), [promotion](../guild/promotion-system.md) | Origin, staff/rooms, license, board, eligibility, exams, branches, emergency, reward, punishment, appeals and politics |
| Factions | [Factions](../world/factions.md) | Ten groups with goals, interests, allies, opponents and player requests |
| Race/species | [Peoples](../world/species.md) | Three proposed groups with economic/social/play roles; final roster open |
| Magic | [Magic](../world/magic-system.md) | Source, learning, limits/cost, hazards, forbidden use, healing, enchanting/items |
| Economy | [Economy](../world/economy.md) | Currency, income, services, consumables, fee/shares, materials/trade and recovery budgets |
| First cast | [NPCs](../characters/starter-npcs.md), [simulation](npc-simulation.md) | 28 named people; goal, relationships, private tension, arc; 14 persistent adventurers |
| Ten-hour progression | [Pacing](first-10-hours.md), [contracts](starter-quests.md) | Several paths, first funds/upgrade/party/dungeon, F → E readiness and failure recovery |
| Vertical slice | [Slice](vertical-slice.md) | Explicit caps, excluded scope, build gates, data contracts and proposed playtest criteria |
| Current market / community | [Market](../research/game-market-research.md), [opinion samples](../research/community-demand.md) | Fourteen games, six requested geographic perspectives, positive and negative reception, operational failure case and cautious gap inference |
| Inspiration / Original IP | [Reference study](../research/anime-reference-study.md) | All 18 named works mapped to potential appeal, independent application and imitation boundary; reading/access limits explicit |
| Open decisions / changes | [Register](decisions.md) | Final decisions distinguished from prototype assumptions; four Proposed Change records |

## Cross-document checks

- Foundation preserved: F–S ladder, personal one-above ceiling, separate power/rank, physical Guild, surface world, 100-floor target, independent peers, discovery and Original IP.
- Exactly 28 cast IDs N01–N28; exactly 14 adventurer IDs N15–N28. Staff are not counted to inflate persistent adventurer scope.
- Exactly 18 authored contract IDs Q01–Q18; F/E progression only, six foundation families covered.
- Three villages exist in region lore; only Aldermead is playable. Ten factions exist in context; only a limited subset needs full slice interaction.
- Four aptitudes are the slice subset, not silent deletion of the foundation's six archetypes.
- Rank conditions prohibit an F player joining D work even with a C leader. Emergency jobs retain personal eligibility.
- Promotion needs separate contract-count, family and merit requirements; a six-job minimum alone may not give 30 merit.
- Solo and party budget examples deduct the Guild fee once, avoid double-charging food/rations and communal supplies, and leave recovery work feasible.
- Free floor-1 orientation is narrower than the E-ranked paid survey; main floor 3 is not an exam prerequisite.
- Discrete saved ticks protect reservations and single settlement; temporary injury/retirement cannot silently introduce permanent NPC death.
- Metrics use all-language/all-purchase Steam API totals; review samples and regional statements do not imply sales or nationality.

## Verification performed

The final checkpoint reviewed all 23 Markdown documents and both evidence CSVs. Automated document checks confirmed local links resolve, 28 unique NPC IDs, 18 unique contract IDs, ten faction IDs, fourteen metric rows, nineteen unique review references, matching percentages/table values and the stated budget/evidence arithmetic. Manual review checked each cast row's goal, relationship, private tension and development, as well as the rank/scope boundaries above. Diff formatting was checked and the v0.1 blob matched the original foundation commit. Clean Git state and matching local/remote commit are checked after push.

This verifies document structure and stated arithmetic. It does **not** verify combat fun, economic balance, actual traversal duration, NPC implementation, audience conversion, final name clearance or every comparator through play. Those need the prototype and later empirical research.

## Responsible stopping point

v0.2's requested documentation is written, organized and committed. The next practical phase is a combat/platform/team decision followed by the greybox career loop in the slice specification. Do not add national simulation, more races or 97 extra floors merely to continue producing text. Keep the unanswered major decisions visible and preserve this checkpoint for team review.

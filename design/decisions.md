# Decision register and proposed changes

**Date:** 2026-10-01. Owner approval is distinct from a writer using a coherent working draft.

## Owner direction added in v0.2.1

**Locked principle — Player-First Adventurer World:** real players are the primary adventurers. NPCs provide world life, story, services, rivals, mentors and companion support; they do not autonomously consume the core player contract/progression loop.

**Product direction — Lightweight Shared World:** the intended final game is not single-player-only. It should pursue low hardware requirements, web-first accessibility where viable, real-player parties/social spaces and scalable zones/channels/instances. Exact engine, network stack, backend and concurrency architecture remain open pending prototypes.

## Foundation compatibility

v0.1 is preserved byte-for-byte. Its §29 locked direction remains the basis of v0.2. No locked concept is replaced. The draft proposes detail where v0.1 was open; implementation convenience does not turn an open decision into a permanent lock.

| ID | Decision / working direction | State | Reason / next evidence |
|---|---|---|---|
| OD-01 | Final title and world name; Oravel used temporarily | Open | Owner preference, pronunciation and naming clearance |
| OD-02 | Reedmark, Veyr, settlement names/history and ten factions | Proposed | Coherent first region; revise after map and narrative review |
| OD-03 | Three peoples; human player presentation in slice | Proposed / open final roster | Rig, dialogue and economic-role cost before expanding |
| OD-04 | Bounded pattern magic, uncertain divine ontology | Proposed | Preserve everyday professions and preparation; utility prototype |
| OD-05 | Exact combat model | Open | Compare candidate greyboxes and support-role solo viability |
| OD-06 | Final product social mode | **Direction locked: lightweight shared world; exact implementation open** | Final game should support real-player social/party play; offline harness remains a temporary test tool |
| OD-07 | Player death, permanent NPC death | Open | Slice uses temporary injury/rescue/retirement only |
| OD-08 | Four slice aptitudes; final six or expanded classes | Proposed subset | v0.1 six-archetype foundation retained; combat validation first |
| OD-09 | Prices, merit, exam scores and time targets | Tuning assumption | Budget checks are mathematical, not playtested balance |
| OD-10 | Authored/procedural dungeon mixture and final 100th-floor truth | Open | Three authored floors prove differentiation; no full-floor backlog |
| OD-11 | Platforms, engine, team size and visual fidelity | **Web-first / ordinary-PC product goal; technology open** | Validate browser performance and production constraints before locking engine or platform matrix |
| OD-12 | Commercial model and price | Open | No sales/wishlist evidence sufficient to choose |
| OD-13 | Calendar, technology and civic religious institutions | Proposed | Supports couriers, recovery and cultural context; no doctrine lock |
| OD-14 | Player/NPC boundary | **Locked owner direction** | Player contracts, Main Dungeon breakthroughs, major bosses, prestige and important world-event outcomes remain player-centric; NPC activity is supportive/narrative |

## Proposed Change PC-01 — prototype class subset

**Current design:** v0.1 §8 offers Fighter, Ranger, Mage, Rogue, Cleric and Scout; §27 expects 3–4 starting classes in the slice.

**Proposed design:** test Fighter/Ranger/Mage/Scout, with mundane first aid and limited support magic; retain Rogue/Cleric for later design. No final class is deleted.

**Reason:** four different practical roles fit the scope cap without building separate stealth, advanced clerical and six combat trees before selecting combat.

**Advantages:** manageable authoring, direct test of navigation and preparation, fewer unique rigs/animations.

**Risks:** insufficient representation of stealth/support fantasy; Mage may absorb too much utility. Compare support play explicitly, and reconsider if test feedback favors Cleric or Rogue.

**Decision:** Open production proposal; selecting the subset is not owner approval of a final class roster.

## Proposed Change PC-02 — slice time model

**Current design:** v0.1 describes schedules, changing world and advancing simulation, without committing the clock model.

**Proposed design:** saved discrete travel/rest/action ticks for player deadlines and authored world milestones; dialogue, menus and idle time do not advance deadlines. NPCs do not use these ticks to run a hidden autonomous player career loop.

**Reason:** allows understandable contract consequences and reliable persistence with a small cast.

**Advantages:** repeatable debugging, accessible reading pace, bounded authoring, clear overdue-party causes and deterministic authored NPC state changes.

**Risks:** routines may feel mechanical; resting may become an exploit. Tie regional states and authored character milestones to clear saved triggers, and show consequences before advancement without turning NPCs into background bot players.

**Decision:** Open final time model; proposed for the first harness only.

## Proposed Change PC-03 — temporary offline harness

**Current design:** v0.1 leaves solo/co-op/shared-world direction open and cautions against MMO scope.

**Proposed design:** offline solo slice with companion NPCs as a development harness; final product direction is a lightweight shared world while architecture and commercial mode remain unresolved.

**Reason:** isolate the career/relationship/combat loop before paying multiplayer complexity, without treating solo-only play as the final product.

**Advantages:** quicker iteration and clear attribution of systemic failures.

**Risks:** deferred shared-world constraints could require redesign; tests may overvalue authored solo relationships. Keep stable state IDs and explicit party agreements, avoid autonomous NPC systems that substitute for future real players, and conduct networking/browser feasibility work before final production.

**Decision:** Development-tool assumption only. The final product is not to be designed as single-player-only.

## Proposed Change PC-04 — bounded faction/supply response

**Current design:** v0.1 describes dynamic events influencing routes, prices, quests and NPCs, without simulation depth.

**Proposed design:** two authored regional chains and normal/disrupted supply states in the slice.

**Reason:** visible consequences are more valuable than invisible high-detail simulation at this stage.

**Advantages:** understandable feedback, controllable budgets and fewer cascading progression blocks.

**Risks:** repetitive state transitions; world may seem static outside the two chains. Make independent NPC changes visible and expand only if the core loop warrants it.

**Decision:** Open scale decision; no reduction of the final living-world pillar.

## v0.2.1 interpretation rule

Where earlier v0.2 text implies NPC adventurers independently reserve player-facing contracts, settle a parallel adventurer economy, grind merit or push Main Dungeon progress, v0.2.1 overrides that interpretation. Persistent NPCs retain continuity and authored life changes without needing autonomous player simulation.

## Future decision practice

Record current design, proposed design, reason, advantages, risks and disposition before altering any locked premise. A later approved decision identifies approver/date and affected documents. A completed documentation version does not imply every proposal is approved or implemented.

## Implementation review — 2026-10-02

Owner rejected the RPGJS v0.2 presentation/control regression and authorized revising previous implementation instructions. [Active reset](implementation-reset-2026-10-02.md) and [current handoff](../prototype/CODEX-HANDOFF-QUALITY-PARITY.md) supersede engine/LPC exclusivity. OD-11 remains technology-open: v0.1 is the primary playable reference; RPGJS is an isolated candidate and Phaser 4 may receive a bounded comparison. Functional/two-client gates do not replace visual/feel acceptance. This changes implementation guidance, not locked Player-First/shared-world principles.

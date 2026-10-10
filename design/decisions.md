# Decision register and proposed changes

**Original register:** 2026-10-03. **Latest owner UI/visual checkpoint:** 2026-10-10. Owner approval is distinct from a writer using a coherent working draft.

## Owner-approved visual and Hub decisions — 2026-10-10

**LOCKED until an explicit later owner change:** Use the exact two owner-supplied images (logo and Sky Castle Login) as the current NewLife Quest branding/login visual baselines. Source filenames, actual dimensions, SHA-256, production/localization constraints and **pending binary asset import** are in [the approved visual baseline](../docs/product/OWNER-APPROVED-LOGIN-AND-LOGO-2026-10-10.md). Do not replace/redesign either visual without owner approval.

**LOCKED product interaction direction:** (A) City Hub is the default after character creation; (A2) City Hub provides daily services while Living City adds walkable NPC/optional hidden discoveries; (B2) significant Living City interiors are walkable while ordinary service buildings may open UI; (C1) the whole town is presented in a single desktop 1920×1080 City Hub composition, with actual building click/tap regions. No player avatar is displayed in City Hub. Desktop lower-left is reserved for in-game chat, and the inn must remain unobstructed. Landscape responsive web on desktop/mobile and full Thai/English coverage are required. See [the detailed agreed Hub decisions](../docs/product/CITY-HUB-LIVING-CITY-DIRECTION-2026-10-10.md) and [localization Issue #6](https://github.com/herogamee/NewLife-Quest/issues/6).

**EXPLICITLY NOT LOCKED:** Final Home/City Hub mockup, any existing generated Home screenshot, exact building positions, and final Living City 2.5D vs 3D implementation. The owner will return to Home design later. Recording these decisions is **not** authorization to replace the current game Home, deploy, or merge without normal approval.

## Owner direction added in v0.2.1

**Locked principle — Player-First Adventurer World:** real players are the primary adventurers. NPCs provide world life, story, services, rivals, mentors and companion support; they do not autonomously consume the core player contract/progression loop.

**Product direction — Lightweight Shared World:** the intended final game is not single-player-only. It should pursue low hardware requirements, web-first accessibility where viable, real-player parties/social spaces and scalable zones/channels/instances. Exact engine, network stack, backend and concurrency architecture remain open pending prototypes.

**Locked principle — One-World System Coherence:** new mechanics must strengthen the same Adventurer Life world rather than accumulate as disconnected feature sets. Reuse existing ranks, currencies, reputations, institutions, settlements and progression language where possible; attach new systems to an in-world place/actor/purpose before expanding scope.

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
| OD-15 | Long-form story escalation F→S with Underfold/world-network mystery | Proposed / owner-requested framework | Add a narrative spine while preserving ordinary-life stories and avoiding chosen-one structure |
| OD-16 | S-rank as gateway to legendary/unknown-world play; no automatic SS/SSS ladder | Proposed / owner-requested framework | Preserve meaningful endgame through discovery, legacy, mastery and world mysteries instead of pure number inflation |
| OD-17 | Hybrid skill model: Weapon + Discipline + Learned Skill + Pattern Magic + Life Skill | Proposed for v0.3 validation | Supports flexible identity, world-discovered techniques and future rare-manual/mentor systems |
| OD-18 | Ecology-first monsters, Named Monsters and non-kill boss resolutions | Proposed | Make creatures part of the world and reduce boss design to more than HP checks |
| OD-19 | Future Chinese-fantasy/xianxia inspiration pass for treasures, manuals, hidden realms and inheritance | Research direction requested 2026-10-02 | Translate structural appeal into original IP; do not copy protected names, characters, techniques, artifacts or lore |
| OD-20 | One-World System Coherence: new systems must connect to the existing Adventurer Life world and reuse shared concepts before inventing parallel currencies/ranks/reputations | **Locked owner direction** | Owner explicitly requested that growing documentation remain one coherent game rather than systems becoming increasingly mixed/disconnected; use the integration guardrails before future expansion |
| OD-21 | v0.3 prototype combat direction: readable real-time action kernel, four Starter Aptitude loadouts (Sword/Spear/Bow/Staff-Focus), shared Effort resource, no permanent class lock | **Proposed for prototype validation** | Continues the existing playable real-time prototype while preserving web/mobile input limits and bounded Pattern Magic; promote only after combat gates/playtest evidence |

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

## Proposed Change PC-05 — narrative and post-S framework

**Current design:** v0.1 establishes F→S, the 100-floor mystery, hidden discovery and the emotional arc from Nobody to Living Legend, but does not define a complete Main Story or post-S play loop.

**Proposed design:** progressively connect local anomalies to a buried world-network mystery; treat Floor 100 as a possible junction rather than a default final-boss room; use S-rank as trusted access to legendary uncertain content, discovery, legacy, crafting/collection/social goals and unknown regions.

**Reason:** players need long-horizon curiosity and reasons to remain in the world after reaching professional rank cap.

**Advantages:** preserves the meaning of the S ceiling, avoids endless SS/SSS inflation, supports years of expansion and keeps small-town/lifestyle play relevant.

**Risks:** world mystery could overshadow ordinary adventurer life; too many hidden systems could become wiki-dependent; high-rank content could become mandatory raid pressure.

**Decision:** Working proposal approved for documentation and future validation, not final lore lock. Floor 100 truth remains open.

## Proposed Change PC-06 — world-discovered mastery

**Current design:** v0.1 names six archetypes and example evolutions but final class/skill implementation remains open.

**Proposed design:** hybrid Weapon Skills + Adventurer Disciplines + Learned Skills + Pattern Magic + Life Skills. Important techniques may come from mentors, books, factions, hidden quests, ruins, achievements and future original rare-manual systems.

**Reason:** makes progression part of the player's story and allows future treasure/secret-technique content without forcing permanent class lock-in.

**Risks:** excessive freedom may blur roles or create balance complexity.

**Decision:** Proposal for v0.3 Combat & Classes prototyping. Do not build the full tree before combat feel is validated.

## Owner-requested design agenda — 2026-10-02 (integration status updated 2026-10-03)

The requested pass on currency, equipment, treasure, manuals, hidden realms, trade/auction, crafting, housing/social life, anti-conflict safeguards and Chinese-fantasy reference research now exists as **working proposals/research**.

This does not promote those documents into locked canon. Under OD-20, further breadth expansion is paused in favor of consolidation and v0.3 Combat & Classes validation. No standalone universal Social Reputation system will be added; existing contextual recognition concepts are reused.

## v0.2.1 interpretation rule

Where earlier v0.2 text implies NPC adventurers independently reserve player-facing contracts, settle a parallel adventurer economy, grind merit or push Main Dungeon progress, v0.2.1 overrides that interpretation. Persistent NPCs retain continuity and authored life changes without needing autonomous player simulation.

## Future decision practice

Record current design, proposed design, reason, advantages, risks and disposition before altering any locked premise. A later approved decision identifies approver/date and affected documents. A completed documentation version does not imply every proposal is approved or implemented.

# Vertical slice — the journey from F to E

**Status:** Proposed build scope and gates. No engine, headcount, budget or delivery date assumed.

## Goal and boundary

Prove that selecting a job, preparing, traveling, handling uncertainty, reporting, earning a living and seeing other adventurers change is satisfying for one short campaign. The Guild must feel like a home, and rank must reward professional competence.

Working test harness is an offline solo build with companion NPCs. This is strictly a **development tool**, not the final product vision. The owner direction is toward a lightweight shared-world Adventurer RPG; networking technology and live-service architecture remain outside this slice.

| Area | Build cap | Required behavior |
|---|---|---|
| City | One small Ternhaven district; Guild, shared inn/market/clinic interaction zones | Navigable loop with repeated encounters and service access |
| Guild | One branch, board, yard, party area, archive, dispatch contact | Register, reserve, report, settle, train, recruit, examine |
| Village | Aldermead only; shelter, fields, culvert | Economy/social consequence visible on return |
| Surface | One connected road/woodland route, shelters and return shortcut | Navigation, clues, gathering, controlled hazard |
| Small dungeon | Siltwell, two chambers plus entrance | First preparation, light, mapping and retreat test |
| Main dungeon | Floors 1–3, compact distinct layouts | Drain/root/weir identities; floor-3 bounded capstone |
| Player ranks | F and E | Restricted E attempt while F; one promotion |
| Starting aptitudes | Fighter, Ranger, Mage, Scout | v0.3 prototype loadouts: Fighter/Sword, Scout/Spear, Ranger/Bow, Mage/Staff-Focus; these are starting packages, not permanent class locks |
| Contracts | 18 templates in starter-quests | Six families, noncombat solutions and honest retreat |
| Adventurer NPC cast | 14 IDs N15–N28 across ambient/story/companion roles | Persistent identity and at least two visible authored state changes; no autonomous bot-player career loop |
| Support cast | 14 IDs N01–N14 with tiered presentation | Eight major full-conversation characters across whole cast |
| NPC/world state | Saved authored milestones plus two regional event chains | NPC continuity is visible; NPCs never consume core player contracts or softlock progression |
| Exam | One F → E practical test | Multiple aptitude-compatible methods and feedback/retake |

Four aptitudes are a selected subset of v0.1's six starting archetypes. Under the v0.3 candidate, they are presented as **Starter Aptitudes**: initial training/loan-kit packages rather than permanent class locks. The combat comparison uses Fighter/Sword, Scout/Spear, Ranger/Bow and Mage/Staff-Focus on one shared combat kernel. Rogue and Cleric remain future identity directions; Mage support tools and mundane first aid allow important utility to be tested without committing separate class trees. No advanced-class evolution tree yet.

## Production sequence with exit gates

1. **Greybox career loop:** Guild board → single road task → return ledger → rest/save. Gate: a new tester can complete it, explain fees and recover from retreat.
2. **Combat/interaction comparison:** implement the v0.3 real-time action candidate in one tiny scene using the shared combat kernel. Compare Sword, Spear, Bow and Staff-Focus for readability, commitment, defense, retreat, solo viability, input accessibility and authoring cost. Do not choose a 'best class'; validate that the four weapon languages are distinct and viable before expanding techniques.
3. **Social/world loop:** eight major conversations, persistent state for the named adventurer cast, ambient departures/news and companion support. Gate: at least two NPC state changes are noticed without a debug interface, with no autonomous NPC contract consumption.
4. **Travel and dungeon:** surface shelters, Siltwell, distinct main floors and approved party rules. Gate: preparation changes outcomes and danger supports justified retreat.
5. **Qualification loop:** enough contract families and merit, exam stations, retake, E unlock. Gate: a player can promote after varied work without kill-count grinding.
6. **Presentation and stability:** concise UI, readable silhouettes, save versioning, audio cues and localization glossary. Gate: core campaign completes with no progression blocker or repeated settlement.

No calendar estimate until team capacity, combat approach, visual fidelity and platform are known. Each gate is independently reviewable; scale down decoration before removing the professional-life loop.

## Shared-world direction guardrail

The final product is not being designed as single-player-only. Long-term direction favors web-first accessibility, ordinary-PC performance, real-player parties, social Guild spaces and scalable zone/channel/instance structures. None of that is implemented in this offline slice. The slice should avoid architectural assumptions that require replacing future real players with autonomous NPC adventurers.

## Minimal data contracts

- Contract: stable ID/instance, version, issuer, objective state, rank, confidence, reward, fee policy, evidence, route, restrictions, reservation owner, deadline tick, salvage policy and settlement ID.
- Adventurer NPC: persistent identity plus player-facing state specified in npc-simulation; role category, rank and capability remain separate fields. A full autonomous quest/economy ledger is not required.
- Region: route accessibility, supply state, evidence flags, event-chain stage and last applied tick.
- Promotion: credited distinct contract objectives, family evidence, merit, practice records, examiner result and review restrictions.
- Save: schema version, tick, resolved event IDs, contract settlements, NPC ledgers, party agreements and pending actions.

This is an implementation-neutral contract, not a demand for a particular engine/database. Keep one authoritative owner for every monetary settlement and use stable IDs across documents/content.

## Acceptance and validation

Use an initial convenience playtest of 8–12 people including newcomers and fantasy-RPG players; this is usability feedback, not a statistically representative market survey. Suggested gates:

- Most testers can explain rank versus power after their first return; target at least 8/10 when ten participate.
- At least 8/10 can tell whether their last job earned a surplus and why.
- At least 7/10 notice one believable NPC state change and name the NPC.
- At least 7/10 describe a personal early-game moment beyond damage/loot.
- Every tested aptitude can complete paid F work and all critical exam stations.
- A failed first field job recovers in two safe jobs or fewer; no loan-kit or clinic softlock.
- Two different contract routes reach qualification; no missing NPC can block essential progression.
- Save/load preserves unresolved work, funds, relationships and qualifications; no duplicated escrow or rerolled resolved career outcome.

If failed, revise the relevant loop rather than expanding floor count. Quantitative thresholds are proposed exit criteria, not research results already observed.

## Deliberate exclusions

No playable Bellcross/Fenwick/Highmere, all 100 floors, national wars, autonomous global supply chains, playable shop management, Guild Master progression, romance system, large procedural quest generator, full crafting tree, pets/mounts, permanent NPC death, or final multiplayer/commercial decision. Reference these through writing only where it helps the existing slice.

## Key risks and mitigations

| Risk | Early signal | Response |
|---|---|---|
| Living NPCs feel like background decoration | Players cannot name a changed colleague | Add one visible routine/kit change and personal report before more agents |
| F feels like punishment | Repeated insolvency or compulsory grind | Improve safe earnings, cost visibility and loan equipment |
| Guild becomes menu bureaucracy | Most time spent filling forms | Put conversations and practical decisions on a short physical route |
| Too much lore / world-building | First paid work delayed by exposition | Deliver needed rules at action points; archive holds optional depth |
| NPC activity competes with player content | Player-facing work disappears or feels bot-driven | Keep Player Contract Pool separate from NPC Narrative Activity; NPC state changes never require consuming core contracts |
| 3 floors still cost too much | Loop fun but asset throughput poor | Compact layouts/shared kit; evaluate equivalent scenes as an explicit proposed scope change |

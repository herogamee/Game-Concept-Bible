# GAME CONCEPT BIBLE v0.2.1 — Player / NPC Boundary Correction

**Date:** 2026-10-01  
**Status:** Owner-direction correction; supersedes only the Player/NPC boundary and related shared-world assumptions in v0.2  
**Predecessors:** [v0.2](GAME-CONCEPT-BIBLE-v0.2.md), [v0.1](GAME-CONCEPT-BIBLE-v0.1.md)

## 1. Why v0.2.1 exists

v0.2 correctly established the world, Guild, starter region, factions, economy, early progression and a bounded F → E slice. One area moved too far: persistent adventurer NPCs were described with a full autonomous career loop that could evaluate posted work, reserve contracts, complete jobs, settle rewards, buy equipment and pursue promotion in parallel with the player.

That model risks turning NPC adventurers into bot players.

This correction restores the intended fantasy:

> **Real players come to this world to live as adventurers. NPCs make that life richer; they do not play the core game in place of the players.**

All v0.1 locks remain. v0.2 worldbuilding remains a working proposal unless explicitly superseded here.

## 2. Locked owner principle — Player-First Adventurer World

The following is now an owner-approved direction:

> **NPCs make the world feel alive, but must not take away the reasons real players enter the game.**

Real players are the primary actors for:

- meaningful Adventurer Guild contracts;
- Guild-rank progression;
- Main Dungeon progression;
- major boss encounters;
- first-clear and first-discovery achievements;
- important world-event objectives;
- legendary rewards and prestige;
- long-term community progression;
- player-facing economy and social play.

NPCs may support, witness, contextualize and participate in these systems, but they must not autonomously consume or complete the core progression loop in place of real players.

## 3. Four NPC categories

### 3.1 World NPC

Examples: Guild receptionist, branch master, blacksmith, merchant, innkeeper, alchemist, healer, villager, guard, noble, priest.

Purpose:

- services;
- worldbuilding;
- quest sources;
- information;
- economy support;
- story and faction context.

They are not simulated adventurer players.

### 3.2 Ambient Adventurer NPC

These make Guild halls, towns and roads feel populated.

They may visibly:

- read the board;
- train;
- prepare gear;
- leave town;
- return tired or injured;
- celebrate;
- argue about shares;
- discuss rumors;
- change seats, schedules or equipment.

These are presentation states, authored events or lightweight simulation. They do **not** need to consume the player's real contract instances, farm the economy or independently clear major content.

### 3.3 Story Adventurer NPC

A small named cast can be rivals, friends, veterans, mentors and recurring adventurers.

They may:

- change rank;
- recover from injuries;
- retire;
- move settlement;
- change party;
- develop relationships;
- appear in personal or regional stories.

Their progression comes from authored milestones, world-state milestones, player interaction or explicit state changes. The game does not need to simulate a complete hidden player-like quest ledger for them unless a specific story requires it.

### 3.4 Companion NPC

Companions support solo players, low-population periods or missing party roles.

They may have:

- combat AI;
- skills;
- equipment;
- personality;
- relationships;
- limited commands.

They exist to help the **player** participate in content. They must not become autonomous substitute players who independently drive the Main Dungeon, the Guild economy or major progression.

## 4. Quest Board correction

The Adventurer Guild Quest Board is primarily player content.

Separate two ideas:

### Player Contract Pool

Real contract instances that players accept, perform, report and settle.

### NPC Narrative Activity

Background or authored events that create the impression of other adventurers working in the world.

An ambient NPC may say:

- a party left for the northern road;
- someone returned injured;
- wolf work is popular this week;
- a veteran is preparing an expedition.

This does not require removing a real player contract from the board.

NPC activity must not create a design problem where the game needs fallback quests merely because NPC bots consumed the player's progression content.

## 5. Main Dungeon ownership

The approximately 100-floor Main Dungeon remains one of the central player fantasies.

NPCs may establish historical context:

- old expedition records;
- previously mapped safe floors;
- lost parties;
- veteran testimony;
- abandoned camps;
- Guild maps.

But new meaningful progression during live play should primarily be driven by real players.

Example:

- Floor 30 — mapped
- Floors 31–35 — incomplete records
- Floor 36+ — unknown

If Floor 36 is newly discovered during the active game world, that should be a player or player-community achievement, not something an autonomous NPC party silently completes while players are offline.

## 6. Major bosses and world events

NPCs can make large events feel alive.

During a raid, guards may hold a gate, healers may treat casualties and NPC adventurers may fight in supporting areas.

The decisive objectives should remain player-facing:

- defeat or repel the major threat;
- rescue priority targets;
- close a breach;
- secure an artifact;
- discover the cause;
- choose between meaningful outcomes.

NPCs support the event. Players change its important result.

## 7. Economy boundary

Do not build a large hidden bot economy where NPC adventurers continuously farm, trade, manipulate auction prices or dominate resource supply.

NPC economic behavior is appropriate for:

- shop stock;
- regional shortages;
- story events;
- authored supply changes;
- believable services.

As the game moves toward a shared world, player activity should matter increasingly to the player-facing economy.

## 8. Persistent does not mean autonomous player

“Persistent Adventurer NPC” remains a valid term only when it means the character has continuity.

Persistent state may include:

- identity;
- current rank;
- relationship;
- injury;
- location;
- story state;
- role;
- visible equipment;
- availability;
- authored milestone flags.

Persistence does **not** require:

- continuously selecting real player quests;
- accumulating a hidden player economy;
- grinding merit;
- independently clearing major dungeon content;
- competing for player prestige.

## 9. Shared-world product direction

The intended long-term product direction is now:

> **A lightweight shared-world Adventurer RPG with web-first ambitions and low client hardware requirements.**

The desired product qualities are:

- playable on ordinary computers;
- web-first where technically viable;
- real players visible in social spaces;
- parties and co-operative adventuring;
- zones, channels and instances where needed;
- towns and Guild halls that can contain real players;
- Dungeon instances that keep simulation bounded;
- server capacity that can scale horizontally as population and revenue grow.

This direction means the game should **not** be designed as single-player-only.

It also does **not** lock an engine, networking framework, backend vendor or final architecture in v0.2.1.

Engine and networking choices remain open until technical prototyping validates them.

## 10. Offline vertical-slice harness

The temporary offline solo harness remains useful as a development tool.

Its purpose is to test:

- the F-rank career loop;
- Guild readability;
- quests;
- preparation;
- combat candidates;
- reporting;
- promotion;
- companions.

It is not a declaration that the final game is single-player.

NPC companions in the harness approximate party support for testing. They should not lead the design toward an autonomous bot-MMO.

## 11. NPC population and real players

In a future shared world, real players should become much of the visible adventurer population.

Ambient NPC density may be adjusted by location or population so the Guild still feels alive when few players are online without flooding a populated server with unnecessary artificial adventurers.

This is a presentation and scalability direction, not a requirement to implement dynamic NPC-density technology in the first prototype.

## 12. v0.2 systems retained

This correction does not discard the useful work in v0.2.

Still retained as working proposals:

- Oravel / Veyr / Reedmark / Ternhaven working world structure;
- Guild institution and rank ladder;
- F → E prototype promotion;
- starter region;
- factions;
- species proposals;
- bounded magic;
- economy tuning;
- 18 starter contract templates;
- starter NPC cast;
- first-ten-hour pacing;
- bounded vertical-slice scope;
- research and market evidence.

NPC-related details in those files are interpreted through v0.2.1 where conflicts exist.

## 13. What remains open

- final engine;
- final networking stack;
- backend/database architecture;
- exact combat model;
- final class roster;
- visual fidelity and art pipeline;
- final platform matrix;
- exact shared-world concurrency design;
- death policy;
- commercial model;
- final world names and lore approvals.

## 14. Gate before v0.3

v0.3 may begin only after repository-wide wording is consistent with these rules:

1. No NPC competes for core player contract instances.
2. No NPC requires a full autonomous player career loop.
3. Main Dungeon breakthroughs remain player-centric.
4. Major bosses and prestige remain player-centric.
5. Companion NPCs support rather than replace players.
6. Shared-world intent is recorded without prematurely locking technology.

After this correction, the next planned concept version remains **v0.3 — Combat & Classes**.

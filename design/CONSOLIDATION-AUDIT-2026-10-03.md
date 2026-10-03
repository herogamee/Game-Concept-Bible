# Consolidation Audit — 2026-10-03

**Status:** Active repository audit  
**Scope:** Working-system expansion through checkpoint v0.2.12  
**Canonical Bible:** v0.2.1 remains the current canonical correction. This audit does not promote working proposals into canon.

## Purpose

Recent work added useful depth quickly: story, post-S play, treasure, manuals, economy, trade, equipment, Signature Gear, crafting, gathering and bounded housing.

The immediate design task is now **consolidation, not feature expansion**.

This audit identifies semantic collisions, duplicated progression concepts, stale planning language and system boundaries so Codex and future design work treat the repository as one coherent Adventurer Life RPG.

---

# 1. Authoritative concept map

| Concept | Primary authority | Interpretation |
|---|---|---|
| Player/NPC boundary | Bible v0.2.1 | Real players own the core adventurer loop; NPCs support it |
| F→S Guild Rank | Bible + Guild docs | Professional trust/eligibility, not combat level |
| Character growth | Skills & Mastery | Weapon + Discipline + Learned Skills + Pattern Magic + Life Skills |
| Magic | world/magic-system.md | Bounded Pattern Magic using ambient Drift |
| Ordinary money | world/economy.md + Currency & Money | Copper/Silver/Gold only for now |
| Professional promotion evidence | Guild docs | Not tradeable currency |
| Local social response | Integration Guardrails | Local standing, not universal morality/social level |
| Craft recognition | Crafting + Guardrails | Artisan reputation, not Guild Rank |
| Equipment quality | Weapons & Equipment | Workmanship: Serviceable/Fine/Masterwork |
| Equipment wear | Weapons & Equipment | Condition: Good/Worn/Damaged/Critical |
| Historical significance | Treasure/Relic system | Relic categories do not equal DPS tiers |
| Owner relationship to gear | Signature Gear | Signature != Relic |
| Rare knowledge | Manuals/Techniques | Availability/provenance, not automatic power |
| Secret adventure spaces | Hidden Realms | Clue-driven bounded spaces, not random portals |
| Player trade | Trade/Auction/Market | Common Exchange + Specialist Exchange + Curated Auction |
| Housing | Ternhaven Housing | Starts as bounded Ternhaven life-space; not land simulation |
| Main long mystery | Main Story proposal | Underfold/world-network hypothesis remains proposal |
| Floor 100 | Decision Register | Final truth remains open; junction is a working direction |
| World name Oravel | Decision Register OD-01 | Working name, not final lock |

---

# 2. Conflicts found and resolved

## CA-01 — "Worn" had two meanings

**Problem:** Equipment documents used Worn both as a workmanship band and a condition state.

**Resolution:**
- Workmanship = Serviceable / Fine / Masterwork.
- Condition = Good / Worn / Damaged / Critical.

This avoids one field changing meaning between crafting and repair systems.

## CA-02 — Generic social reputation risk

**Problem:** Several planning passages used broad phrases such as "social reputation," which could become a redundant universal progression bar.

**Resolution:**
Reuse:
- professional evidence / Guild standing;
- local standing;
- artisan reputation;
- named relationships.

No universal Social Level is introduced.

## CA-03 — Signature Gear vs Relic

**Resolution:**
- Signature = relationship/history between owner and item.
- Relic = historical/world significance/function.
- An item may be one, both or neither.

Neither term is a combat rarity tier.

## CA-04 — Workmanship vs rarity vs condition

**Resolution:**
Do not collapse these into one color:
- workmanship = how well it was made;
- condition = current physical state;
- material = physical properties;
- modification = intentional alteration;
- provenance/relic significance = history/world meaning.

## CA-05 — Guild Rank vs character power

**Resolution:**
F→S remains professional trust.
Combat/craft/knowledge capability comes from mastery.
Equipment cannot buy Guild Rank.

## CA-06 — Functional magical resource

**Problem:** Pattern Shard appeared as a useful working example and could be mistaken for a locked second currency.

**Resolution:**
It remains a placeholder concept only.
Copper/Silver/Gold remain the only established ordinary money.
A functional magical resource must first prove an in-world material role before naming/tiering.

## CA-07 — Housing / farming / player shop expansion

**Resolution:**
Housing is bounded to Ternhaven first.
Home gardening is small-scale and cannot replace Aldermead agriculture.
Home craft cannot replace Bellcross/specialist facilities.
Player selling reuses Market + Commission + Escrow rather than adding an AFK shop economy.

## CA-08 — Rare techniques vs power tiers

**Resolution:**
Technique labels describe availability/provenance.
Rare or lost techniques may be narrow, difficult or noncombat.
They do not automatically overpower common trained techniques.

## CA-09 — Hidden realms vs disconnected fantasy content

**Resolution:**
Every Hidden Realm needs:
- a geographic/world anchor;
- clues;
- an access reason;
- a consequence or connection.

Do not add generic random portals solely to host loot.

## CA-10 — Old "future system" documents became stale

**Problem:** Post-S and Next Design Frontier still described currency, weapons, trade, housing and xianxia research as future work.

**Resolution:**
Retain those documents as historical planning records, but point readers to current specialist documents and the integration guardrails.

---

# 3. Systems merged conceptually — do not split again

## Economy cluster
One connected cluster:
- coin;
- contracts;
- trade;
- commissions;
- repair;
- crafting;
- requisitions;
- travel/lodging;
- housing/storage sinks.

Do not create a separate unrelated economy for housing, crafting or auctions.

## Social cluster
One contextual model:
- Guild professional evidence;
- local standing;
- artisan reputation;
- personal relationships.

Do not add a universal social XP bar.

## Item cluster
One item identity model:
- base form;
- workmanship;
- condition;
- material;
- modifications;
- provenance;
- Signature relationship;
- Relic significance.

Do not add another generic rarity ladder on top.

## Knowledge cluster
One discovery/mastery model:
- learned skill;
- manual/codex;
- mentor;
- field knowledge;
- profession knowledge;
- Pattern theory.

Do not add a second "cultivation" progression framework.

---

# 4. Current integrated player loop

> Register with Guild -> accept understandable work -> prepare -> travel/explore -> solve danger/problem -> gather evidence/resources -> return/report -> receive money/professional evidence -> repair/craft/trade/study -> improve mastery/relationships/home identity -> take broader work -> discover deeper world mysteries.

Lifestyle systems feed this same loop:

- fishing supplies food/collection/trade;
- blacksmithing supplies adventurers and maintains Signature Gear;
- cooking supports travel/social life;
- housing displays the history earned through adventure;
- markets connect regional/player specialization;
- treasure opens knowledge, routes and stories.

If a future feature cannot connect to this loop, it needs strong justification.

---

# 5. Current production priority

The repository has enough breadth for now.

## Priority A — v0.3 Combat & Classes validation

Resolve through prototype/evidence:
- action timing;
- hit/recovery feel;
- weapon distinction;
- defense;
- stamina/effort question;
- first 3–4 player combat identities;
- support solo viability;
- browser/mobile control budget.

## Priority B — vertical-slice integration

Use only a small subset:
- Ternhaven;
- Aldermead/Brackenwood/Siltwell;
- Underfold floors 1–3;
- F→E;
- a few weapons;
- a few recipes/materials;
- one market/commission flow;
- one rented-room concept only if it supports testing.

## Priority C — balance validation

Do not expand catalogues before testing:
- money flow;
- repair;
- loot/material value;
- crafting demand;
- beginner affordability.

---

# 6. Explicit design freeze

Until v0.3 combat evidence exists, avoid creating major new standalone systems for:

- mounts;
- pets;
- large farming;
- land ownership;
- guild territory;
- kingdom management;
- player politics;
- marriage/family simulation;
- transport networks;
- naval systems;
- procedural world generation;
- extra currencies;
- extra rank ladders;
- large housing construction;
- new continents beyond existing outline;
- dozens of new professions.

These are not rejected forever.

They are **not the current problem**.

---

# 7. Document maintenance rule

When a specialist document gains a newer integrated interpretation:

1. preserve historical source where useful;
2. add a status/supersession note;
3. point to the current authority;
4. fix direct terminology conflicts;
5. do not rewrite old evidence to pretend it was always final.

This keeps the repository auditable without forcing readers to reconcile contradictions themselves.

---

# 8. Consolidation result

The recent systems can coexist coherently without changing the game's identity if they remain subordinate to:

> **Player-First Adventurer World + F→S professional Guild life + bounded mastery + meaningful preparation/exploration + one shared economy + one shared world.**

No additional major system is required before Combat & Classes validation.

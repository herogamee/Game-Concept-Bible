# GAME CONCEPT BIBLE v0.3 — Combat & Classes Candidate

Implementation checkpoint (2026-10-07): the owner-locked [modular character standard v1](../design/DDTANK-CHARACTER-STANDARD-v1.md) preserves the current stand/walk/wardrobe/blink/aura study and its incomplete contexts. This is an asset/renderer working baseline, not approval of a production engine, combat animation coverage or expanded gameplay scope.

**Date:** 2026-10-03  
**Status:** Current combat/class prototype candidate — working proposal, not final balance lock  
**Predecessors:** v0.2.1 Player/NPC Boundary Correction, v0.2 World/Guild proposal  
**Governance:** Must comply with OD-20 One-World System Coherence and the 2026-10-03 Consolidation Audit.

## 1. What v0.3 resolves

v0.3 narrows the previously open combat question enough to build and compare a real prototype.

Prototype direction:

> **Readable real-time action combat with explicit attack phases, small input budget, distinct weapons and no permanent class lock.**

This is a **prototype combat decision**, not a promise that every timing/value below is final.

v0.3 does not add a new progression ladder, new currency, new world region or new life-simulation system.

---

## 2. Combat north star

Combat should feel like field work performed by an adventurer.

The desired player thoughts are:

- "I committed too early."
- "The spear kept it outside my safe distance."
- "I waited for a clear shot."
- "My ward bought enough time to retreat."
- "Preparation made this safer."
- "Retreating was the professional decision."

Avoid:
- animation spam;
- dozens of active hotbar skills;
- enemies that are only HP bags;
- mandatory tank/healer/DPS composition;
- rank-colored damage inflation.

---

## 3. Starter Aptitudes — not permanent classes

For the F→E slice, keep the four previously selected starting aptitudes:

1. **Fighter**
2. **Ranger**
3. **Mage**
4. **Scout**

An Aptitude is:

> an initial training package, loan kit and practical emphasis chosen at registration.

It is **not**:
- a permanent class prison;
- Guild Rank;
- an exclusive equipment license;
- the player's final Discipline.

Players can cross-train later.

Rogue and Cleric from the v0.1 foundation remain future identity directions; they are not deleted.

---

## 4. Prototype combat loadouts

To compare four weapon languages with one shared kernel:

| Aptitude | Prototype weapon | Immediate identity | Field identity |
|---|---|---|---|
| Fighter | Sword | balanced commitment, guard, counter opportunity | dependable general field combat |
| Scout | Spear | reach control, brace, spacing | route probing, safe-distance creature work |
| Ranger | Bow | ranged preparation, aim, positioning | hunting, tracking, signaling |
| Mage | Staff / Focus | bounded Pattern attack/support, ward, diagnosis | sensing, Pattern utility |

This mapping is for prototype clarity.

It does not declare that Scouts must always use spears or Fighters cannot learn spears.

---

## 5. One shared combat state machine

Player combat states:

```text
free
 ├─> attack_windup
 │    -> attack_active
 │    -> attack_recovery
 │    -> free
 ├─> defense
 │    -> defense_recovery
 │    -> free
 ├─> technique_windup
 │    -> technique_active
 │    -> technique_recovery
 │    -> free
 └─> hurt
      -> free

hp <= 0 -> downed/rescue outcome in the F→E slice
```

Enemy states:

```text
idle -> wander -> alert -> chase -> attack
                       -> hurt -> recover
hp <= 0 -> dead -> respawn/reset where appropriate
```

The slice does not resolve final player-death policy.

---

## 6. Shared attack rules

Every attack definition has:

- id;
- weapon family;
- animation;
- windup;
- active time;
- recovery;
- hit shape;
- reach;
- movement commitment;
- effort cost;
- damage/effect;
- target-hit policy.

Rules:

1. damage only during `active`;
2. one attack instance cannot hit the same target repeatedly unless explicitly designed;
3. dead targets cannot take new damage;
4. held input cannot restart attacks every render frame;
5. hurt/death interrupts are explicit;
6. server owns final combat result in online mode.

---

## 7. Prototype resource — Effort

Use one shared prototype resource:

> **Effort** represents short-term physical/mental exertion.

Initial test envelope:

- maximum: 100;
- normal walking: no cost;
- basic primary attacks: free or negligible cost;
- defense/evade/brace: meaningful cost;
- signature techniques: meaningful cost;
- Pattern techniques: Effort plus focus/Pattern restrictions;
- regeneration begins after a short non-spending delay.

Why one resource first:

- keeps browser/mobile UI readable;
- tests commitment without inventing separate stamina + mana + class gauges;
- matches bounded Pattern Magic where casting also requires bodily attention/effort.

**Effort is a prototype mechanic.** Final naming and values require playtest.

Pattern Magic still depends on focus condition, knowledge, local stability and materials where relevant. Effort does not replace those world rules.

---

## 8. Initial normalized weapon test

Use the same low-health test enemy so the first comparison measures feel rather than gear math.

Initial target:
- simple slime/test creature;
- approximately three clean basic hits from each loadout;
- no elemental weakness in the first comparison.

### Sword — starter slash

Working tuning:

- windup: 90 ms
- active: 120 ms
- recovery: 220 ms
- reach: short
- shape: broad frontal arc
- movement commitment: medium
- basic damage unit: 1

Defense:
- **Guard**
- frontal mitigation/deflection test
- consumes Effort when absorbing pressure.

Purpose:
balanced reference weapon.

### Spear — starter thrust

Working tuning:

- windup: 140 ms
- active: 90 ms
- recovery: 260 ms
- reach: long
- shape: narrow forward lane
- movement commitment: medium-high
- basic damage unit: 1

Defense:
- **Brace**
- short prepared stance;
- rewards facing and timing;
- can stagger a charging light target;
- costs Effort.

Purpose:
test reach control versus sword flexibility.

### Bow — starter shot

Working tuning:

- draw/windup: 180 ms minimum
- projectile release window: short
- recovery: 300 ms
- practical test range: long
- movement while drawing: reduced
- basic damage unit: 1

Defense:
- **Evade Step**
- short reposition;
- bounded avoidance window;
- costs Effort.

Purpose:
test positioning and preparation without making range free safety.

Prototype note:
training comparison does not decide final ammunition economy. Field ammunition policy remains a later balance question tied to existing early costs.

### Staff / Focus — Impulse Pattern

Working tuning:

- windup: 220 ms
- active/release: 80 ms
- recovery: 320 ms
- range: medium-long
- basic damage unit: 1
- small light-target stagger
- costs some Effort.

Defense:
- **Ward**
- short bounded Pattern defense;
- costs Effort;
- no permanent shield.

Purpose:
test readable bounded combat magic without introducing a separate Mana bar.

---

## 9. Gate 2 — one signature technique each

Only after the basic four-loadout test is stable.

### Fighter — Lunge
Short forward commitment and narrow reach extension.

### Scout — Sweep
Close defensive spacing tool that trades reach for wider control.

### Ranger — Aimed Shot
Longer preparation for higher impact/precision; movement heavily limited during aim.

### Mage — Impulse Burst
Short cone/control Pattern used to create space rather than pure DPS escalation.

These are prototype techniques, not final class trees.

---

## 10. Utility identity outside combat

Each aptitude must prove one useful noncombat strength.

### Fighter
- safe obstacle handling;
- brace/help carry;
- practical first aid remains available.

### Scout
- terrain probing;
- route marking;
- short-range signs/track interpretation.

### Ranger
- tracking;
- hunting signs;
- ranged signaling/line delivery.

### Mage
- bounded Sensing;
- Pattern diagnosis;
- one practical support Pattern.

Every critical F→E objective needs at least one path not requiring a specific aptitude.

---

## 11. Defense and retreat

Defense is not an afterthought.

The prototype must support:
- disengaging;
- moving back to safer ground;
- using terrain;
- reporting a threat honestly.

No combat arena should require killing every creature merely to exit unless the fiction clearly justifies it.

Professional retreat remains compatible with Guild progression.

---

## 12. Party model

Expected party size remains 1–4.

Do not build a rigid holy trinity for the slice.

Useful contributions can include:
- front control;
- ranged pressure;
- interruption;
- support;
- scouting;
- field medicine;
- navigation;
- monster knowledge.

Every starting aptitude must be able to finish ordinary paid F work solo with appropriate preparation.

Some dangerous optional objectives may strongly reward parties.

---

## 13. Armor test

Do not implement a full armor catalogue for v0.3.

Test three profiles:

### Flexible
- highest movement freedom;
- lowest physical protection.

### Reinforced
- balanced profile.

### Heavy
- higher protection/stability;
- higher movement/effort/heat burden.

Armor profile must not change Guild Rank or class identity.

Exact mitigation formula remains tuning work.

---

## 14. Hit and hurt readability

Minimum feedback:

- attack startup is visible;
- active hit has clear audio/visual confirmation;
- damaged target reacts;
- blocked/guarded hit looks different from clean damage;
- downed/dead state is unmistakable;
- no reward appears before server-confirmed death in online mode.

Avoid excessive screen shake/flash that obscures positioning.

---

## 15. Input budget

Browser/keyboard prototype:

- Move — WASD / arrows
- Primary Attack — Z / Space
- Defend — X
- Technique — C
- Interact — E / Enter
- Quick Item — 1
- Inventory — I

Mobile target:

- movement stick;
- Attack;
- Defend;
- Technique;
- Item;
- contextual Interact.

Do not require a 10-button MMO hotbar.

---

## 16. Progression during the slice

The prototype should NOT build the full skill tree.

F→E progression can show:

- familiarity with chosen weapon;
- one learned technique;
- one field utility;
- improved player understanding;
- equipment purchase/repair.

Promotion evaluates professional competence and evidence, not DPS.

Do not require grinding weapon mastery bars to qualify for E.

---

## 17. What happens to "classes"

Working v0.3 interpretation:

- **Starting Archetype from v0.1** -> presented in slice as **Starter Aptitude**.
- **Advanced class names** -> candidate future **Disciplines**, mentors/schools or identity paths.
- **Weapon actions** -> Weapon Skills.
- **Books/mentors/secret records** -> Learned Skills/Techniques.
- **Pattern practices** -> Pattern Magic.
- **Craft/gather/social expertise** -> Life Skills.

This resolves duplicate progression systems while preserving v0.1 fantasies.

No final advanced-class roster is locked here.

---

## 18. RPGJS/server authority requirement

Online proof remains small.

Server owns:
- accepted attack start;
- authoritative combat state;
- target hit validation;
- HP;
- down/death transition;
- kill/reward event;
- quest kill credit.

Client may predict:
- local animation;
- immediate input feel;
- cosmetic hit anticipation.

Two clients must never receive duplicated kill rewards from one enemy death.

---

## 19. Combat validation gates

### Gate A — Kernel
Sword only:
- phases work;
- hit-once works;
- enemy hurts player;
- guard works;
- defeat/rescue resets cleanly.

### Gate B — Weapon distinction
Add Spear/Bow/Staff-Focus.

Success if testers can identify the weapon from feel even with placeholder art.

### Gate C — Aptitude solo viability
Same simple F contract can be completed by Fighter/Scout/Ranger/Mage.

### Gate D — Preparation/retreat
At least one encounter where:
- preparation changes safety;
- retreat is understandable;
- report can succeed without total kill.

### Gate E — Online authority
Two clients share one enemy state with one authoritative reward.

Only after these pass should v0.3 expand techniques.

---

## 20. Explicit exclusions

Do not implement for v0.3 kernel:

- full six-class trees;
- advanced disciplines;
- hundreds of spells;
- PvP;
- raids;
- combo meter systems;
- ultimate gauges;
- elemental resistance matrix;
- procedural skill generation;
- gear score;
- +99 enhancement;
- mounts/pets;
- full crafting economy;
- full 100-floor combat content.

---

## 21. Decisions still open after v0.3 candidate

- final Effort name/regen values;
- final player death policy;
- final armor mitigation;
- final ammunition handling;
- dual wield;
- two-handed weapon rules;
- weapon swap during combat;
- exact advanced Disciplines;
- whether final combat uses four-direction or finer aiming;
- final Pattern offensive repertoire.

---

## 22. v0.3 success definition

v0.3 succeeds when:

> **The same small encounter feels meaningfully different with Sword, Spear, Bow and Staff-Focus; every aptitude can survive ordinary F work; combat supports retreat and preparation; and the implementation remains simple enough for a low-spec browser shared-world game.**

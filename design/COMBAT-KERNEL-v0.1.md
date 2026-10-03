# Combat Kernel Specification v0.1

**Date:** 2026-10-03  
**Status:** Prototype implementation contract for v0.3  
**Target:** RPGJS v5 + TypeScript

## 1. Canonical prototype state enums

```ts
type ActorCombatState =
  | 'free'
  | 'attack_windup'
  | 'attack_active'
  | 'attack_recovery'
  | 'defense'
  | 'defense_recovery'
  | 'technique_windup'
  | 'technique_active'
  | 'technique_recovery'
  | 'hurt'
  | 'downed'
  | 'dead'
```

Players use `downed` for the current F→E rescue/defeat harness.
Enemies may use `dead`.

## 2. Attack data contract

```ts
type HitShape =
  | { kind: 'arc'; range: number; degrees: number }
  | { kind: 'line'; range: number; width: number }
  | { kind: 'projectile'; range: number; speed: number; radius: number }
  | { kind: 'cone'; range: number; degrees: number }

interface AttackDefinition {
  id: string
  weaponFamily: 'sword' | 'spear' | 'bow' | 'staff-focus'
  animation: 'slash' | 'thrust' | 'shoot' | 'spellcast'
  windupMs: number
  activeMs: number
  recoveryMs: number
  effortCost: number
  movementScaleDuringWindup: number
  hitShape: HitShape
  damageUnits: number
  staggerUnits?: number
  hitOncePerTarget: boolean
}
```

## 3. Initial attack definitions

```ts
export const STARTER_ATTACKS = {
  swordSlash: {
    id: 'starter-sword-slash',
    weaponFamily: 'sword',
    animation: 'slash',
    windupMs: 90,
    activeMs: 120,
    recoveryMs: 220,
    effortCost: 0,
    movementScaleDuringWindup: 0.65,
    hitShape: { kind: 'arc', range: 36, degrees: 100 },
    damageUnits: 1,
    hitOncePerTarget: true
  },
  spearThrust: {
    id: 'starter-spear-thrust',
    weaponFamily: 'spear',
    animation: 'thrust',
    windupMs: 140,
    activeMs: 90,
    recoveryMs: 260,
    effortCost: 0,
    movementScaleDuringWindup: 0.55,
    hitShape: { kind: 'line', range: 64, width: 22 },
    damageUnits: 1,
    hitOncePerTarget: true
  },
  bowShot: {
    id: 'starter-bow-shot',
    weaponFamily: 'bow',
    animation: 'shoot',
    windupMs: 180,
    activeMs: 50,
    recoveryMs: 300,
    effortCost: 0,
    movementScaleDuringWindup: 0.35,
    hitShape: { kind: 'projectile', range: 260, speed: 320, radius: 6 },
    damageUnits: 1,
    hitOncePerTarget: true
  },
  impulsePattern: {
    id: 'starter-impulse-pattern',
    weaponFamily: 'staff-focus',
    animation: 'spellcast',
    windupMs: 220,
    activeMs: 80,
    recoveryMs: 320,
    effortCost: 12,
    movementScaleDuringWindup: 0.25,
    hitShape: { kind: 'projectile', range: 170, speed: 250, radius: 9 },
    damageUnits: 1,
    staggerUnits: 1,
    hitOncePerTarget: true
  }
} satisfies Record<string, AttackDefinition>
```

These are test values, not final balance.

## 4. Effort contract

Initial:
- max = 100;
- defense/techniques spend Effort;
- base attacks normally do not;
- starter Impulse Pattern spends 12 as a deliberate bounded-magic test;
- regen pauses briefly after spending;
- no negative Effort;
- server owns current value online.

Suggested first tuning:
- regen delay: 500 ms;
- regen: 30 per second.

Do not add Mana in this prototype.

## 5. Defense data

### Sword Guard
- frontal;
- mitigates/deflects a portion of eligible light attacks;
- each successful pressure event spends Effort;
- cannot guard from behind.

### Spear Brace
- short timed frontal state;
- if a valid light charging attacker enters brace space, apply stagger;
- costs Effort on activation.

### Bow Evade Step
- short directional displacement;
- limited avoidance window;
- costs Effort;
- cannot chain infinitely.

### Staff Ward
- short frontal/near-body Pattern protection;
- costs Effort;
- one bounded window, not passive shielding.

Exact percentages/windows remain tuning constants in one config module.

## 6. Hit-instance safety

Each accepted attack creates:
- attackInstanceId;
- ownerActorId;
- definitionId;
- startTick/time;
- Set of alreadyHitTargetIds.

Server rejects:
- target already hit by same instance;
- target dead/down where invalid;
- hit outside active phase;
- impossible distance/shape;
- attack started while actor state forbids it.

## 7. Reward safety

Enemy death produces one authoritative `deathEventId`.

Rewards/quest credit reference that ID.

A deathEventId can settle reward once.

This prevents duplicate EXP/drop/kill-count from client races.

## 8. Facing

Prototype supports:
- north;
- west;
- south;
- east.

Movement may be diagonal, but attack facing resolves to a cardinal direction for current LPC compatibility.

Do not spread sprite row numbers into combat logic.

## 9. Input queue

Keep small:
- allow at most one buffered primary/defense input near recovery end if needed for feel;
- no infinite combo queue;
- clear buffer on hurt/downed/map change.

Start without buffering if simpler, then add only after playtest shows input loss.

## 10. Player defeat

For the slice:
- hp <= 0 -> downed;
- freeze combat inputs;
- trigger authored rescue/return;
- apply only approved temporary consequences;
- never decide permanent death here.

## 11. Tests

Required logic tests:

- no damage in windup;
- damage allowed in active;
- no damage in recovery;
- same target hit once per attack instance;
- dead target ignored;
- actor cannot start another attack during forbidden state;
- effort cannot go below zero;
- defense rejects activation without enough Effort;
- projectile range ends correctly;
- death event settles reward once;
- player zero HP enters downed, not permanent death;
- two reward requests using same deathEventId settle once.

## 12. Telemetry for playtest

Record per short encounter:
- weapon/loadout;
- encounter duration;
- damage taken;
- attacks attempted;
- attacks landed;
- defense uses;
- technique uses;
- effort minimum;
- retreats;
- defeats.

No behavioral monetization telemetry is implied.

The purpose is tuning weapon feel and survivability.

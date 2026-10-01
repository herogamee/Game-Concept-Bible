# Economy — early money must mean a choice

**Status:** Prototype tuning assumptions, not validated balance. All calculations use copper units (c).

## Currency and starting state

1 silver (s) = 100c; 1 gold (g) = 100s = 10,000c. Prices should display familiar denominations but settlement logic uses integer copper to avoid rounding drift. Silver is still a meaningful early milestone. These names are ordinary denominations, not final coin branding.

Player starts with **60c**, clothes, a bed voucher for the first night, a usable loan kit matched to their aptitude, a waterskin and first-aid instruction. License issuance is initially free; registration is not a paywall that consumes the only food budget. Loan gear cannot be sold, remains adequate for F work and may be returned after a permanent replacement. A replacement loan follows a recovery task if lost; it does not leave the player unarmed.

## Baseline price list

| Item / service | Price | Assumption and choice |
|---|---:|---|
| Simple meal | 4c | Three meals/day = 12c |
| Shared bunk/night | 8c | Most prepared beginner days include this cost |
| Private inn room | 25c | Comfort choice, not basic recovery requirement |
| One day ration kit | 12c | Replaces the day's three meals; do not charge both |
| Bandage | 6c | Consumable; clean reusable cloth is a slower alternative |
| Basic lantern oil / excursion | 4c | Required underground; can share one party lamp |
| Arrow replenishment / typical trip | 5c | Tuning envelope; actual use recorded |
| Light kit repair / normal excursion | 8c | Wear-derived; shown before next job |
| Emergency heavy repair | 25c | Failure cost, never a surprise recurring normal cost |
| Stabilizing potion | 35c | Saves immediate risk, does not cure all injury |
| Clinic routine treatment | 20c | Reduces recovery time; assistance path if poor |
| Used permanent weapon/focus | 120c | First purchase target; common quality |
| Fine ordinary weapon/focus | 280c | Later goal with identity and repair history |
| Protective kit | 180c | Alternative early saving target |
| Nearby ferry crossing | 6c | Region expansion, not necessary for slice core |
| Local map copy | 10c | Player can earn a usable sketch through survey |

Class parity matters: no mage must buy a 300c focus before earning 60c, and no ranger pays more recurring costs than their expected contract income can support. The loan kit covers the same baseline function for all slice aptitudes.

## Contracts, fees and party agreement

F gross reward envelope: **60–110c** per ordinary solo contract, depending on time, risk and consumables. E solo-equivalent: **110–180c**. Party objectives scale total contracted work and payout explicitly; do not simply split a solo 90c job four ways and call it sustainable.

Guild handling fee: 10% of the **gross contract cash reward**, rounded down once at settlement. No daily membership tax. Material sale revenue has a published buy price including merchant margin and does not incur the contract fee again. The client deposits escrow; withdrawal before departure returns it. Equipment loans and penalties are separate ledger entries.

Default party rule: fee first, reimburse pre-agreed communal expenses second, split remainder equally among participating adventurers third. Personal meals, lodging and personal wear come from personal shares. The player can propose a different division before departure; NPCs may refuse. No retroactive secret leader cut. Salvage rights are agreed separately: quest items belong to client; legal unclaimed salvage sold into party pool. Record who actually participated.

**Party example:** four-person E contract 400c; Guild fee 40c; approved oil and communal medical supplies 40c; distributable 320c; each receives **80c**. Personal meals + bunk + normal repair = 28c, leaving **52c** each. Communal supplies have already been reimbursed and are not deducted twice. Equal-size solo jobs do not require hiring four NPCs.

## Worked budgets

| Solo scenario | Ledger | Result |
|---|---|---:|
| Prepared F delivery | 80 gross − 8 fee − 12 food − 8 bunk − 8 wear | **44c surplus** |
| F field collection, one bandage used | 90 − 9 − 12 − 8 − 8 − 6 | **47c surplus** |
| Same field collection, potion used | 90 − 9 − 12 − 8 − 8 − 6 − 35 | **12c surplus** |
| Failed field trip, no reward | 0 − 12 food − 8 bunk − 8 wear − 6 bandage | **34c loss** |
| Recovery work at city depot | 50 − 5 fee − 12 food − 8 bunk; no field wear | **25c surplus** |

First delivery under the normal-cost budget: cash 60 + 72 net payout − 28 expenses = **104c**. This deliberately ignores the first-night voucher; redeeming it adds 8c to the first-day balance. A second similar normal-cost day reaches **148c**, enough for a 120c weapon but leaving only 28c. Waiting for a third day preserves a buffer. The desired choice is confidence versus safety, not an automatic purchase at a scripted minute.

A potion costs roughly one normal day's surplus. Food and rest remain relevant after the first weapon. A failed first trip leaves 26c under the stated ledger; recovery work restores it. If actual failure costs exceed this, the clinic/loan/safe-work floor must still permit recovery without selling essential tools.

## Materials and resource limits

| Material | Working buy value | Source and constraint |
|---|---:|---|
| Clean medicinal bundle | 5c | Safe woodland edge; finite regrowth |
| Gel binder sample | 4c | Seepage galleries; contamination lowers value |
| Cave beetle shell | 7c | Useful reinforcement; harvesting risks habitat |
| Sorted iron scrap | 3c/unit | Heavy; permit and carrying capacity matter |
| Intact old pattern plate | Appraisal only | Evidence/ownership first; not a predictable loot jackpot |

These are modest supplements to contract income, not endless gold generators. The core slice does not implement a commodity exchange, player-run shop or global supply-chain optimizer. A trader's goods manifest explains why the economy exists without requiring every production unit to be simulated.

## Regional changes and trading

Two authored supply states: normal and disrupted. Food disruption raises meal/ ration prices by at most 25% in the slice; safe depot rewards rise to compensate after one tick. Medicine shortages affect available bottle count before escalating price. A displayed reason—ferry delayed, mine stopped—links changes to observed events.

Buy price must remain above resale payout after fees on the same item; selling stolen loan gear is disabled. Markets have limited restock budgets, and travel/rest advances a tick with consequences. Repeating safe work is permitted but should provide money without promotion evidence, rare materials or identical scripted accolades.

## Balance acceptance questions

Can a beginner understand net earnings before departure? Can each aptitude afford three ordinary expeditions? Does a failed first quest recover in two safe jobs or fewer? Does splitting a legitimate party contract still support members? Does floor-1 salvage outperform every surface contract? If so, adjust values and cost visibility before adding crafting tiers.

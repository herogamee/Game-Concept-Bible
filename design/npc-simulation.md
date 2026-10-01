# Persistent adventurers — bounded career simulation

**Status:** Slice implementation proposal, extending v0.1's three simulation tiers. No permanent NPC death.

## Minimum state

For N15–N28 save: ID, rank, qualification evidence, capability band, aptitude, party ID, goal, risk preference, funds, kit condition, temporary injury, current job, location, relevant relationships, event flags, next planned action and last processed tick. Store stable IDs rather than duplicating display names in state.

Support characters use authored schedules and event flags. Background crowds do not need personal economics. A portrait-only veteran still needs a ledger if their career is persistent.

## Tick and state transitions

Travel completion, explicit rest and an expedition's return advance discrete world ticks. Pause, dialogue and browsing never do. UI warns before the player advances time with an active deadline. Save/load restores tick number and outcomes; loading cannot reroll resolved NPC work.

Idle → Evaluate jobs → Reserve suitable Posted job → Prepare → Depart → Resolve → Recover/report → Settle → Evaluate promotion/goal. NPC selection respects personal rank, the one-above rule, supplies, expected earnings, relationships and risk preference. A C cameo can do off-screen regional work without creating a playable C contract.

Reserve and settle a contract exactly once. Player-reserved contracts are excluded. Two parties cannot both claim the same escrow. When a job expires or a route closes, release/reassess reservations explicitly. Maintain a recovery job and several qualification alternatives for the player.

## Outcome design

The slice uses a small authored outcome table keyed by readiness and route state, not thousands of agents. Suitable party plus safe conditions usually succeeds; missing gear leads to delayed departure; known disruption can cause retreat or temporary injury. Seed future unresolved choices at campaign start and save their state. Explain meaningful outcomes through news and conversation.

Money changes at actual settlement, not every animation. An NPC cannot upgrade a 120c weapon without savings or recorded support. Injured adventurers take one or two recovery ticks before field work; clinic duty/porter work can substitute. Promotion requires evidence and an exam event, not a daily probability that skips qualifications.

## Two independently visible careers

1. N15 accepts a farm delivery on the first available rest tick, buys a better blade after enough surplus, and submits for E assessment when evidence is sufficient. Player intervention can invite them along but is not required for the state changes.
2. N20 alternates clinic shifts with beginner work, then chooses a clinic apprenticeship after supported conversation or a financial trigger. Retirement removes field availability while adding clinic familiarity and a news item. This is progress toward their goal, not an NPC failure state.

A rival's promotion should not occur after one trivial errand while the player needs six varied jobs. Pre-campaign evidence may explain a veteran or near-ready newcomer; publish that context. F beginners with no prior evidence follow comparable rules.

## Observation and missing NPCs

Departure sign, empty usual table, report on the news wall, changed kit, altered greeting and a license entry are separate cues. Do not require the player to inspect debug statistics to perceive life. At least one outcome must be understandable without opening the news UI.

If an NPC is overdue, the branch follows its search protocol. Slice outcome is found safe, temporary injury, voluntary departure or retirement. Permanent death remains an open decision; “missing” is not a hidden way to enable it. Essential services have a substitute contact if an authored character leaves.

## Acceptance scenarios

- Advance two ticks without recruiting anyone: one novice accepts and settles separate work, and a second NPC changes goal or recovery state.
- Save before a tick, process it, save/load afterward: no duplicated rewards or newly rerolled outcome.
- Reserve Q04 for the player: no NPC removes it; other posted contracts still change.
- Invite injured N26: refusal cites recovery and offers later availability.
- Let N20 retire: field recruitment changes, clinic relationship persists, promotion route remains feasible.
- Close a route: affected NPC jobs reassess; the economy exposes the reason without global cascading collapse.

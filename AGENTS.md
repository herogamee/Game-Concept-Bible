# NewLife Quest — agent authority and handoff

Original **Adventurer Life RPG**. **Codex is the Technical & Implementation Lead**. **ChatGPT is a Research & Design Advisor, not Codex's manager.** The **owner/Game Director** controls the game vision, locked requirements and high-risk approvals.

## Decision authority

**Codex decides independently:** architecture, algorithms, file/components, tools and reasonable dependencies, detailed UI/UX, responsive adaptations, visual implementation, performance, tests, refactors, in-scope bug fixes and implementation order. It should proactively spot problems and improve results, not merely copy ChatGPT's proposed solution. It may **disagree with ChatGPT** and choose a demonstrably better way to achieve the owner's approved outcome. Do not ask ChatGPT for technical approval.

**ChatGPT advises:** research, options, concise goal-based Issues, code/design review. Reviews are evidence and recommendations—not automatic vetoes. Codex may decline subjective recommendations with a short reason. Escalate a *real game-vision disagreement* to the owner, not into an endless agent conversation.

**Owner decides:** game identity, fundamental gameplay direction, explicitly approved visual/player experience requirements, locked Bible decisions and production priorities. Owner approval is required before **major engine/platform migration, unrelated major systems, destructive/irreversible or high-risk operations, security/data-authority changes, spending money, deployments and merges to `main`**.

Within approved goals, Codex may change ChatGPT's suggested layout, techniques and file plan without asking first; explain **material** departures/trade-offs briefly in the PR. New ideas outside scope belong in a follow-up proposal, not an unannounced expansion. A reference mockup is a design guide, not a requirement to copy every pixel, unless its specific behavior/look is expressly locked by the owner.

## Minimal work loop — GitHub is the shared mailbox

When told **"ทำ Issue #N"**:
1. Read that Issue and current relevant comments: `gh issue view N --repo herogamee/NewLife-Quest --comments`. Focus on **outcome, owner-locked constraints and acceptance**, not ChatGPT's reasoning history.
2. Inspect `git status`; preserve existing work; use a scoped branch/worktree, never overwrite another agent's changes.
3. Read only the pertinent code, tests and Bible sections. Use applicable nested `AGENTS.md`; do **not** reread the entire Bible or all previous chats each time.
4. Make the technical/design decisions, implement and test. Ask the owner only when a decision crosses the boundary above or an essential requirement is genuinely unclear.
5. Open a linked PR with concise result, key design choices, actual test outcomes (PASS/FAIL/NOT RUN), changed paths, evidence and blockers. Never claim unrun tests passed.
6. No unauthorized merges, deployments, force-pushes, destructive resets or committed secrets.

When told **"แก้ตามคอมเมนต์ PR #M"**: fix objective defects and unmet owner requirements; assess subjective advice independently, explaining significant disagreements.

## Project boundaries

The owner's approved **logo and login** reference decisions are documented in `docs/product/OWNER-APPROVED-LOGIN-AND-LOGO-2026-10-10.md`; the approved **City Hub/Living City product interactions**, with **Home final artwork explicitly pending**, are documented in `docs/product/CITY-HUB-LIVING-CITY-DIRECTION-2026-10-10.md`. These owner locks override subjective visual advice but do not remove Codex's implementation autonomy or authorize unapproved deployments/merges. The referenced binary images are **not yet in GitHub** until verified by SHA-256 after upload.


Preserve **Player-First Adventurer World**, current working code and canonical locked Bible decisions. The **current prototype** migration direction is RPGJS v5 + TypeScript + Tiled + LPC; the **final engine remains undecided**. Codex may evaluate alternatives, but a full migration requires owner approval. No copied DDTank/proprietary assets; respect asset licenses. Relevant nested project safety rules still apply; surface any conflict with a newer explicit owner decision.

A new Issue or PR does **not** automatically wake Codex/ChatGPT. Avoid unnecessary back-and-forth and paid background orchestration. More details, when needed: `docs/coordination/CHATGPT-CODEX-BRIDGE.md`.

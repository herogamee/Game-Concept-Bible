# ChatGPT ↔ Codex App (Windows) — goal-based, low-quota workflow

Repository: `herogamee/Game-Concept-Bible`

## Purpose and roles

The owner talks and brainstorms freely in **ordinary ChatGPT Chat** without copying the discussion into Codex. When a plan is approved, ChatGPT posts a **concise goal-based GitHub Issue**; Codex App reads the Issue and independently chooses the best design/implementation from the actual codebase.

- **Owner — Game Director:** defines outcomes, locked creative direction and major boundaries; decides vision disagreements and high-risk approvals.
- **Codex — Technical & Implementation Lead:** owns technical design, code/asset integration, practical UI/UX details, debugging, tests and delivery. Can reject or improve ChatGPT proposals while meeting the owner's goal.
- **ChatGPT — Research & Design Advisor:** explores options, supplies useful references and reviews results; **cannot require Codex to obey its suggestions or approve each technical decision**.

**A mockup or implementation idea from ChatGPT is not a literal source-code specification**. If the owner explicitly approves a visual requirement, protect its intended appearance/behavior while letting Codex choose how to implement and adapt it for real devices. The goal is a cohesive game, not pixel-perfect copying of a static image at any cost.

## Confirmed connection and limits

The two-way GitHub Issue handshake was confirmed in [Issue #4](https://github.com/herogamee/Game-Concept-Bible/issues/4) (`CODEX_HANDSHAKE_OK` / `CHATGPT_HANDSHAKE_OK`). This proves each side can read/write this asynchronous mailbox, **not** that they can converse live or wake each other automatically.

No ChatGPT Work, polling bot, paid API service or continuous AI-to-AI discussion is needed for the basic workflow. GitHub access on ChatGPT and `gh` authentication in the Windows Codex App are separate.

## Daily workflow — two short prompts and a PR review

1. In ChatGPT discuss the idea until the owner is happy; then say:
   > ส่งงานนี้ให้ Codex

2. ChatGPT creates one **goal-based implementation brief** in a GitHub Issue. For straightforward tasks, aim for about 150–350 words. Include:
   - **Outcome**: what the game/user should be able to do or see;
   - **Non-negotiables**: only owner-locked behavior, visual direction, security or compatibility constraints;
   - **References**: precise Bible/source/mockup URLs *accessible to Codex*;
   - **Acceptance**: observable play/build/test outcomes;
   - **Design freedom**: explicitly delegate technical approach, code structure and practical UI details to Codex.
   
   Do NOT paste the entire discussion, abandoned designs or speculative implementation steps as commands. If an image only exists in ChatGPT, the owner/agent must place a usable image asset/reference in the repository or Issue; a chat-local image path is not accessible to Codex automatically.

3. In **Codex App on Windows**, type:
   > ทำ Issue #N

   Codex reads that Issue and relevant project files, independently selects the method, implements/tests, and opens a linked PR. Codex should proactively solve in-scope problems without requesting ChatGPT approval or reopening already-locked decisions.

4. Back here in ChatGPT, type:
   > ตรวจ PR #M

   ChatGPT reviews the actual diff, build/test evidence and the owner's outcomes, not whether Codex followed ChatGPT's suggested file tree. Reviewer feedback should be marked:
   - **Must fix**: demonstrated regression, missing approved acceptance, security/data risk, licensing or failed test;
   - **Suggestion**: aesthetic preference, alternate implementation or optional enhancement; not automatically blocking.
   
   Codex is free to respond with evidence, select a better solution, or decline a suggestion. If disagreement changes the owner's intended player experience, ask the owner; don't start an endless agent argument.

5. For a needed fix, the owner can tell Codex:
   > แก้ตามคอมเมนต์ PR #M

   Only the owner authorizes the merge/deploy or other high-risk action. Repeat this cycle only for concrete defects/decisions, not continuous discussion.

## Decision model

| Topic | Default decision maker |
| --- | --- |
| Code architecture, algorithms, component boundaries, tool/library choices | Codex |
| Detailed UI/UX implementation, layout adaptations and performance | Codex |
| Better approach than ChatGPT suggested, within approved outcomes | Codex |
| Relevant bug fixes, tests, contained refactors | Codex |
| Research, alternatives, nonbinding review | ChatGPT |
| Game identity, major gameplay direction, locked Bible/visual requirements | Owner |
| Major engine migration, risky destructive changes, deployment, merge to main | Owner approval |

Codex should **briefly report meaningful changes of direction in the PR**: what changed, why it is better for the goal, what was tested, and any trade-off. No approval request for every small adjustment.

Proactively discovered major new gameplay systems should be proposed as a separate Issue or PR for owner prioritization; do not smuggle them into unrelated changes. This preserves Codex's creativity without making the game incoherent.

## Brief example — Ternhaven first-screen scene

**Outcome:** Create a beautiful, playable opening scene in Ternhaven fitting the Player-First Adventurer World and chosen bright chibi/fantasy UI direction. Guild, market and NPCs should feel like a functioning town, not a static building picker.

**Non-negotiables:** Preserve working systems; starter-world identity and browser/low-spec goal; original assets and licenses. A saved style mockup guides visual direction, but is not a demand for exact implementation.

**References:** precise relevant Bible files, current game source, accessible approved mockup.

**Acceptance:** player can enter, move/interact with at least one meaningful town service; UI is readable at target resolutions; actual build/play evidence submitted.

**Codex authority:** choose camera/scene composition, responsive layout, reusable UI elements, technical integration and sensible optimizations. Explain substantial deviations from the discussed reference. Seek owner approval only for a new **fundamental** game flow or major engine pivot.

## Windows one-time readiness

In Codex App's local repo terminal:
```powershell
git status
git remote -v
gh auth status
```
If `gh` is not installed: `winget install --id GitHub.cli -e`, reopen terminal, then `gh auth login` via browser. Do not paste access tokens into chats/issues. Codex already reported a successful `gh` handshake in Issue #4; only repeat setup when the local environment changes.

Useful commands (Codex may run directly):
```powershell
gh issue view N --repo herogamee/Game-Concept-Bible --comments
gh pr create --repo herogamee/Game-Concept-Bible --base main --head <branch> --title "<title>" --body "Refs #N"
gh pr view M --repo herogamee/Game-Concept-Bible --comments
```

## Quota and safety

- A small approved Issue avoids having Codex ingest lengthy ChatGPT debates.
- Codex still must inspect enough code and run tests for correctness. Savings are **not guaranteed** and depend on task complexity.
- No ChatGPT Work required; GitHub Issues/PRs do not trigger agent runs unless a separate supported automation is configured.
- Preserve existing working trees, secrets and player data; work on branches and get owner approval for merges/deploys.
- A GitHub PR is an auditable change proposal, not evidence of a successful game build.

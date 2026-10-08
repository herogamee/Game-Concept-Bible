# ChatGPT → GitHub Issue → Codex App (Windows) — low-quota workflow

**Goal:** Discuss/design extensively in **ordinary ChatGPT Chat**, but send Codex only the **approved implementation brief**, not a pasted conversation. No ChatGPT Work requirement and no automatic back-and-forth.

Repo: `herogamee/Game-Concept-Bible`

## One-time setup (Windows Codex App)

Open the local repository in Codex App and confirm the terminal can use GitHub:
```powershell
git remote -v
git status
gh auth status
```
If GitHub CLI is missing: `winget install --id GitHub.cli -e`, restart terminal, then `gh auth login` via browser. Do not copy PATs or passwords into chats/issues.

**Already verified:** on 2026-10-08, Codex replied with `CODEX_HANDSHAKE_OK` in [Issue #4](https://github.com/herogamee/Game-Concept-Bible/issues/4). Its report says GitHub CLI auth succeeded. This is evidence of **asynchronous Issue read/comment**, not automatic Codex activation.

## Daily use — only two short messages

**(A) Here in ChatGPT, after we finish designing:** say:
> ส่งงานนี้ให้ Codex

ChatGPT should create **one** concise GitHub Issue, normally 150–350 words for a straightforward task. Include only:
- Goal / the change to implement.
- Current repository path/baseline and **direct links to relevant source specs/mockups**.
- Exact must-do / must-not-do.
- Acceptance checks and tests.
- Any remaining decision **explicitly marked as undecided**.

Do not copy debate, abandoned ideas or the entire chat into the Issue. Avoid redundant long context and reopening locked decisions. An image visible only in ChatGPT is not automatically accessible to Codex; attach or commit the actual asset/reference to GitHub when needed.

**(B) In the Codex App conversation**, type just:
> ทำ Issue #N

Root `AGENTS.md` defines what this means. Codex reads the Issue, relevant files only, works on a scoped branch, runs tests and opens a linked PR. The owner can write the Issue URL instead of N. Codex does not need to read the ChatGPT conversation.

**(C) Here in ChatGPT, after Codex reports a PR:** say:
> ตรวจ PR #M

ChatGPT checks the actual diff, relevant Bible rules and test evidence; it comments on the PR as authorized. If revisions are needed, in Codex App say:
> แก้ตามคอมเมนต์ PR #M

**Only the owner approves merges.** Repeat review cycles only when there are concrete defects or untested acceptance conditions.

## Why this minimizes Codex consumption

- Ordinary design discussion stays in ChatGPT Chat; Codex receives only the final task.
- One implementation brief per approved task; no chained AI debates, monitoring loop or repeated long summaries.
- Codex still **must read necessary source files and run tests**; do not sacrifice correctness to shorten inputs.
- This is expected to reduce unnecessary context, but actual Codex quota consumption depends on task/model/tool usage, and **no fixed savings are guaranteed**.
- Manual one-line kickoff is intentional. Making Codex poll GitHub or run on every Issue could **increase quota consumption**.

## Brief format

```markdown
### เป้าหมาย
[ผลลัพธ์เดียวที่ต้องการ]
### จุดอ้างอิง
- [ลิงก์ Bible / mockup / source file ที่เกี่ยวข้องเท่านั้น]
### ทำ
- ...
### ห้ามเปลี่ยน
- ...
### ผ่านเมื่อ
- [ ] ...
- [ ] รายงานคำสั่งทดสอบและผลจริง
```

If work is large, split into independently testable Issues **only where the owner approves**; do not expand scope by default.

## Useful direct commands (Codex can run them)

```powershell
gh issue view N --repo herogamee/Game-Concept-Bible --comments
gh issue comment N --repo herogamee/Game-Concept-Bible --body "BLOCKED: <specific question>"
gh pr create --repo herogamee/Game-Concept-Bible --base main --head <task-branch> --title "<short title>" --body "Refs #N"
gh pr view M --repo herogamee/Game-Concept-Bible --comments
```

## Limits and safety

- GitHub is the **shared mailbox**, not a live agent-to-agent chat.
- New Issues/PRs do not wake up an existing Codex App conversation or ChatGPT by themselves.
- ChatGPT's connected GitHub permissions and Codex's local GitHub CLI login are independent.
- Do not merge `main`, deploy, or change the working project without owner approval.
- Do not place credentials or local sensitive data into the shared mailbox.
- Keep results short: changed paths, test evidence, screenshots if necessary, exact blocker, PR URL.

## What is installed in this proposal?

Root `AGENTS.md`, this guide, an Issue template, and a PR template. No bot, paid API automation, scheduler or game-code change is included.

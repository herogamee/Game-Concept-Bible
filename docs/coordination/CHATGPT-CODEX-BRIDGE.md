# ChatGPT ↔ Codex App (Windows) — GitHub handoff

Repository: `herogamee/Game-Concept-Bible`
Purpose: eliminate long copy/paste between ChatGPT and Codex while retaining owner review and a durable technical trail.

> **Important limitation:** ChatGPT and a Codex App conversation are NOT one shared live chat. A GitHub push/Issue/comment does NOT by itself cause either agent to wake up. Use a one-line prompt to tell Codex to check the Issue/PR, or explicitly configure a supported scheduled/event-triggered workflow. Do not describe this as automatic until tested.

## 1) One-time setup on Windows (owner)

1. Sign into the **Codex App** with the same ChatGPT account, and open the local `Game-Concept-Bible` folder as the project.
2. Confirm Git and repository in the app's terminal/PowerShell:
   ```powershell
   git status
   git remote -v
   ```
   The origin should be `https://github.com/herogamee/Game-Concept-Bible.git` or an equivalent authorized SSH remote. If no local checkout exists, clone it in a normal development folder first.
3. Ensure **GitHub CLI** is installed:
   ```powershell
   gh --version
   ```
   If missing, install with `winget install --id GitHub.cli -e`, then reopen the terminal/app.
4. Authorize GitHub CLI (this is separate from signing into Codex):
   ```powershell
   gh auth login
   gh auth status
   gh repo view herogamee/Game-Concept-Bible
   ```
   Use GitHub's interactive browser sign-in. **Never paste a token into an Issue or repo file**.
5. Update the local branch without losing work. Ask Codex to inspect `git status` first; only pull when safe.
6. ChatGPT needs authorized repository access on the GitHub connector as well. ChatGPT may read Issues/PRs and, *when the connected tool supports it*, write comments or create task Issues. Permissions may vary by product/account.

## 2) Standard handoff: ChatGPT → Codex

1. The owner describes the feature/bug in ChatGPT.
2. ChatGPT checks the current Bible and creates a scoped GitHub Issue (or gives the owner an issue template if write access is unavailable).
3. The Issue contains: context, task, constraints, acceptance tests, references, ownership and open questions.
4. In Codex App, the owner sends **only one short command** (replace `<N>`):
   ```text
   ใน repo herogamee/Game-Concept-Bible อ่าน AGENTS.md และ GitHub Issue #<N> รวมทุกคอมเมนต์ล่าสุดด้วย gh; ตรวจสถานะ repo ก่อน แล้ววางแผน/ลงมือทำเฉพาะขอบเขตที่อนุมัติ ทดสอบจริง สร้าง branch และ PR อ้าง Issue นี้ รายงานผล/ลิงก์ PR ลง Issue ห้าม merge หรือแก้ main เอง
   ```
5. Codex works in a separate branch/worktree, commits, pushes, opens a PR and links the Issue.

Useful CLI commands (Codex can run these itself):
```powershell
gh issue view <N> --repo herogamee/Game-Concept-Bible --comments
gh pr create --repo herogamee/Game-Concept-Bible --base main --head <branch> --title "<title>" --body "Refs #<N>"
gh pr view <PR> --repo herogamee/Game-Concept-Bible --comments
```
If `gh` is unavailable, open the Issue in the browser and give Codex the Issue URL; install/authorize `gh` for the no-copy workflow later. Do not invent PR numbers or claim publishing succeeded if GitHub access fails.

## 3) Standard handoff: Codex → ChatGPT

Codex reports in the Issue/PR:
- Status: DONE / NEEDS_REVIEW / BLOCKED.
- Commit SHA, branch and PR URL.
- Changed files and reason.
- Build/test commands with PASS/FAIL and evidence (screenshots/logs where relevant).
- What was deliberately *not* implemented.
- Outstanding questions.

The owner can then tell ChatGPT: **"ตรวจ PR #<N> ของ Game-Concept-Bible"**. ChatGPT reads the PR diff/comments, compares it with the Bible and posts actionable feedback when authorized. For an additional revision, owner tells Codex: **"อ่านคอมเมนต์ล่าสุด PR #<N> แล้วแก้ตามนั้น"**.

**Do not depend on the other agent seeing a new comment until asked to refresh**, unless separate automation has been confirmed active.

## 4) Review / merge rule

1. ChatGPT or reviewer checks behavior, data, security, compliance, visual match and the acceptance list.
2. Codex fixes on the *same task branch* unless a new Issue is explicitly created.
3. Codex posts new test evidence and updates the PR.
4. **Only owner-approved PRs are merged.** Update `README.md`/`CHANGELOG.md` for meaningful project changes. Follow the existing repo's source-of-truth hierarchy.
5. After merge, Codex fetches/pulls the approved changes before beginning the next task.

## 5) How to reduce copy/paste further

- Save the one-line Codex instruction above in a pinned chat / reusable prompt.
- Use a PR link or number in ChatGPT, not screenshots of code or copied diffs.
- Use the Issue template and PR template in `.github/`.
- For recurring review, eligible ChatGPT **Work** setups can create GitHub PR-event-triggered tasks with authorized repository access. Set trigger/condition explicitly, test it, and keep a human merge gate.
- Codex's own automations/goals can assist with repeat checks, where supported, but must be separately configured and tested. GitHub Actions alone cannot directly message an existing ChatGPT chat.
- For a completely hands-free multi-agent loop, build an explicit API/webhook orchestration system later, with permission limits, idempotency and audit logs. **This file does not implement such a bridge.**

## 6) First handshake test — zero code modification

1. Create an Issue titled `[Bridge test] Verify Codex App GitHub handoff`.
2. Open the repo in Codex App; ask it to read that Issue using `gh issue view ... --comments`.
3. Ask Codex to comment **"Codex App อ่าน Issue นี้สำเร็จ; repo=<name>; branch=<branch>"** using `gh issue comment <N> --repo herogamee/Game-Concept-Bible --body "<message>"`.
4. Ask ChatGPT to **"อ่าน Issue #<N> และสรุปข้อความของ Codex"**.
5. If both directions work, test a harmless docs-only branch/PR. Only then consider PR-triggered automation.

## 7) Failure checklist

- Codex shows the wrong project: inspect current folder, `git remote -v`, and selected worktree.
- `gh` not found: install GitHub CLI; reopen terminal.
- Authentication 401/403: `gh auth status` then browser login and check repo permission.
- PR not visible in ChatGPT: confirm GitHub connector has access, repo name and PR number.
- Codex did not start after an Issue changed: expected until a task is explicitly started or automation configured.
- Do not paste access tokens, PATs or secrets in ChatGPT, Codex, Issues or committed files.

# Next implementation handoff — visual and control parity

Active 2026-10-02; supersedes the earlier mandatory RPGJS/LPC migration order. Read root AGENTS.md and `design/implementation-reset-2026-10-02.md` first.

## Scope

Bring one RPGJS village/meadow slice up to the v0.1 presentation/control baseline before adding features. Work in the existing isolated RPGJS candidate; preserve v0.1 runtime/assets/save. Use its original artwork as the comparison reference, retaining provenance. A Phaser 4 experiment is allowed in a separate folder only when a documented comparison need justifies its cost; no full rewrite or Colyseus integration merely to improve artwork.

Read v0.1 `README.md`, `ART-DIRECTION.md`, `assets/painted-art.js`, `src/render.js`, `src/navigation.js`, `src/game.js`, `src/audio.js` and the current candidate equivalents before changes. Read applicable engine skill and official API docs.

## Work order

1. Capture v0.1 village and meadow at the same browser viewport. Record walk speed, click arrival/destination feedback, attack timing/arc, target cancellation, hurt feedback and UI flow from actual code/play. Preserve the comparison fixtures' no-save behavior.
2. Adapt existing actor frames, props and ground composition to RPGJS. Keep distinct NPCs, player readability, Y sorting and camera framing. Keep debug telemetry behind a developer toggle. Do not replace UI presentation with diagnostic panels.
3. Match click navigation and keyboard takeover, slime targeting and combat feedback; preserve musical identity and separate audio preferences. Keep server validation; cosmetic animation timing is not damage authority.
4. Verify quest/progression/potion, map transfer, save/reload and two-client results after these changes. Collect before/after screenshots and observations. Log measured browser cost, with honest hardware limits.
5. Write `PARITY-REVIEW.md` in the candidate: matched behaviors, regressions, remaining limitations, actual fixes/extensions and evidence paths. Product parity remains awaiting owner review until explicitly accepted. Do not mark it passed solely from automated tests.

## If RPGJS remains a poor fit

Document the concrete visual/control requirement, current code/reproduction, attempted fix, residual problem and estimated additional integration work. Distinguish implementation mistakes from engine limitations. Under the owner's latest authorization, build at most the same one-scene experiment in a separate Phaser 4 folder, with the same assets/viewport/inputs. Compare presentation, control, loading/frame timings, maintainability and networking effort before picking the production stack. No requirement to invent an engine blocker and no permission to declare Phaser automatically better.

## Completion

The deliverable is a reviewable one-scene parity result and a measured recommendation, not more features. v0.1 stays the default until the owner accepts the candidate. Server-authoritative online outcomes, license records, small scope and incremental commits remain required.

# Implementation reset — 2026-10-02

Status: **Active development direction, authorized by the owner in chat on 2026-10-02. Final production engine remains open.**

The owner rejected the v0.2 experience as worse than v0.1 and explicitly authorized disagreement with, and revision of, the previous handoff. This reset changes implementation guidance, not the Player-First/shared-world concept foundation. It supersedes the primary-engine/LPC exclusivity in the earlier research and handoff.

## Assessment of the prior prompt

Good constraints: preserve the working prototype, narrow the slice, retain asset licenses, define combat phases, validate server authority and avoid premature MMO scope.

Weak constraints: lock an engine before testing the desired presentation/input; make a character generator the mandatory art source; prioritize functional gates without a no-regression visual/feel gate. Framework feature availability was treated as if it guaranteed fit, without verifying integration cost for this game's actual loop. The age/name of the model that drafted a prompt is not evidence for or against its recommendation.

Implementation responsibility: the v0.2 author replaced the illustrated v0.1 world with generic tiles/LPC placeholders and exposed a debugging HUD. Runtime movement/save extensions also took substantial work. Those results demonstrate this implementation's regression; they do not prove RPGJS cannot deliver a good-looking game or that Phaser would automatically solve it. The previous “complete” delivery overstated product readiness: functional evidence remains valid, visual/feel readiness does not.

## Current choice

Keep **v0.1 as the primary playable reference**. Keep RPGJS v0.2 as an isolated technical experiment. Do not continue adding systems to it. The next engineering task is a single-scene parity experiment using the existing illustrated assets and interaction behavior. This is the cheapest useful next evidence because the RPGJS scaffold and two-client proof already exist; it is not a commitment to ship RPGJS.

If that comparison exposes poor fit or excessive integration cost, a bounded Phaser 4 comparison is authorized without requiring a fabricated hard blocker. Production migration requires comparative evidence and owner acceptance. Avoid switching engines merely to undo an art regression that can be repaired without switching.

Phaser's official download page lists v4.2.1 dated 2026-07-09, checked 2026-10-02: https://phaser.io/download/phaser4. It is a real current candidate, not an unimplemented claim that the repo already uses it. Neither playable folder currently depends on Phaser. v0.1 uses custom Canvas/JavaScript; v0.2 uses RPGJS/CanvasEngine/PixiJS. Pixelorama is a possible authoring tool, not yet part of the artwork workflow. Pixel art is a style choice; the current v0.1 art is illustrated fantasy with pixelated scaling, not a strict limited-color palette.

## Preserve and reuse

Preserve village/meadow composition, original painted actors/props, distinct NPCs, opaque player, destination marker, camera/Y overlap, fantasy HUD, combat feedback and music/SFX. Carry source provenance and audio preferences. LPC remains useful for prototyping or missing animation states, but its layout does not justify discarding better existing art. A renderer adapter can translate the authored sprite frames without forcing a wholesale asset conversion.

Keep v0.1 save key/data readable by v0.1. Any engine candidate gets its own saves and never silently overwrites existing progress. Content IDs and combat/progression data should be portable where practical; do not write a universal engine abstraction in advance.

## Decision gates

1. Product parity: comparable screenshots and the same walking/targeting/attack/dialogue/inventory/audio loop; owner judges image and feel at least as good as v0.1. Until then the recommended playable remains v0.1.
2. Functional parity: quest, potion, EXP/drop/level, death/revival, both portals and stable reload. Retest after migration; earlier passing tests do not certify later artwork/input changes.
3. Online proof: two players observe consistent movement/HP/death and one reward claim, with server-owned outcomes. Persistence/reconnect must be described honestly.
4. Browser cost: measure the same viewport and scenario, cold load/runtime asset sizes, frame-time samples and stalls on the available machine. Record machine/browser, duration and method. Low-spec/60 FPS remains a target until measured on relevant hardware.

Review candidates by results, not dependency counts: presentation/control fit, required custom extensions, debugging/maintenance cost, browser cost and authoritative networking/persistence effort. Report tradeoffs; do not claim future MMO scale from two clients.

## Next authorized work

See `prototype/CODEX-HANDOFF-QUALITY-PARITY.md`. This reset prepares the repository and does not itself implement a new renderer or a Phaser migration. No new gameplay features are promised by this documentation change.

# Locked character checkpoint

Read `../../design/DDTANK-CHARACTER-STANDARD-v1.md`, `contract.json`, and `baseline-lock.json` before changing character authoring, registration or renderers. This is the owner's 2026-10-07 working baseline, superseding failed historical walking trials as the current character-study reference.

Preserve the v1 snapshot byte-for-byte. Do not regenerate its lock to silence a failing check. An owner-authorized revision must be a new version, keep v1 available for comparison, and carry registration, walking, blink, icon and visual evidence. New cosmetics keep the template and export transforms; no item-specific runtime fitting.

Run `python characters/ddtank-lab-v1/tools/verify_standard.py --self-test` from the repository root. When editing the external live lab, also run `--live-root D:/Codex/DDtank`, Godot `--modular-comparison-test`, and inspect actual composition. Hash checks do not certify natural gait or art quality.

Keep installed DDTank sprites, SWFs, converted commercial atlases and decompiled source outside this repository. `godot/scripts/` is an adapter snapshot requiring the external lab; it is not a complete standalone Godot game. Glasses, custom wings/full costumes, other directions and combat poses remain incomplete for the new character. Do not present the snapshot as a production engine migration or 100% Flash interchange.

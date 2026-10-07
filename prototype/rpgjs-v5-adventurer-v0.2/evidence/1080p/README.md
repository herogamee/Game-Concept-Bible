# 1920×1080 follow-up

Tested 2026-10-02 in Codex in-app browser with an explicit 1920×1080 viewport. HUD telemetry confirmed 1920×1080 canvas backing in smooth mode. The override was reset afterwards.

- Before: slime-003 showed server HP 0/dead, +8 EXP/+2 Gold/+1 Gel, but its live sprite remained on screen. Empty graphic arrays did not reliably remove the cached visible sprite in this integration.
- After: `slime-dead.png` shows the target absent with HP 0/dead and reward changed once (Lv3 EXP3→11, Gold84→86, Gel7→8). The live graphic is restored after five seconds by server logic; its timing and single-claim behavior are covered by the extended runtime regression test.
- Static scenery now has no character animation sheet. Image-only custom event components retain authored positions and event sorting; server prop events no longer assign an animated graphic. Two idle captures are `static-a.png` and `static-b.png`.
- Pixel comparison in the two captures: left fence (80,325,140,90) and right fence (1560,325,310,100) both had zero changed pixels. Rock region (1790,825,125,120) had 153 changed pixels of 15,000; therefore these captures alone do not certify perfectly identical rock pixels. No visible position shift was observed. Browser screenshot scaling/compression varies and makes some HUD text softer than others.
- Tiled blockers now use a fully transparent 16×16 collision image. Registry/cell comparison verifies unchanged blocked locations, without ground fragments repainting over props.

25 focused tests, typecheck and production build passed. Root/subpath production asset smoke passed. No new two-client online visual check in this follow-up; earlier online authority evidence remains recorded separately. Owner visual acceptance remains pending. High-resolution source artwork and modular animation remain future work; see `design/art-reference/README.md` at repo root.

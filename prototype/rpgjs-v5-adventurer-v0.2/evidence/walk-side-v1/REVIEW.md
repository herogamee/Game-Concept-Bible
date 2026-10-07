# Walk and independent appearance — local study, 2026-10-06

The local `/walk` page now animates original registered layers and changes face, hair and dressed body without resetting motion. This is a bounded reviewable prototype, **not owner-approved natural animation or a complete character system**.

## Run and inspect

From the candidate directory:

```powershell
npm run assets:walk-side
npm run verify:walk-side
npm run lab:registered -- D:/Codex/DDtank 5199
```

Open `http://127.0.0.1:5199/walk`. Select face/hair/outfit while playing; pause, step, slow the clip, remove hair, restore independent defaults, click a destination or use A/D and left/right arrows. All eight comparison cards show the same current frame and can select their combination. Expand the layer inspector to see the actual separate source bands.

The authoring clip has eight 384×512 cells in a 1536×1024 atlas. The shared compositor draws each layer at (0,0); no item change modifies the frame rectangle, position or animation phase. A whole-character display scale and estimated 330px source stride drive horizontal motion. Left-facing preview mirrors the whole right-facing composition; it is not a separately authored view. The existing loopback server still requires the external DDTank Lab at startup, but `/walk` uses only project original art.

## Verification

`npm run verify:walk-side` passed all 64 rendered cases (eight wardrobe combinations × eight frames). [verification.json](verification.json) contains their hashes and source dimensions. It checks nonempty layer coverage in every frame, identical protected iris/ear/mouth/body pixels when removing hair, unchanged head/hair pixels when swapping bodies, and unchanged dressed-body pixels when swapping faces. The base head/body partition reassembles the corrected bald source exactly: maximum alpha and premultiplied colour difference both 0.

Motion-model checks verify that equipment changes retain position, phase and destination; paused motion does not advance; stepping advances one frame; unsupported slot/ID/frame/clip requests are rejected without replacing valid selection. Null basic slots resolve independently to defaults without overwriting null selections. These are technical composition/interaction checks, not a pose/anatomy validator.

In the actual browser, selecting calm face/silver hair/blue outfit while paused retained frame 6, phase 542.60ms and x220.00. Stepping advanced all eight gallery canvases to frame index 6. While moving right, changing outfit and hair retained active motion: x303.83→351.71 and phase150.40→350.50ms, with the newly selected IDs. The final source correction was then reloaded and inspected at frame 3; the first blue source's displaced scarf seam is unused. Resetting all three selections to null retained phase200.00ms/frame index2 and x220.00, with the default items visibly restored. Removing and re-equipping hair exposed the bald head and restored the hairstyle on that same pose. The preview was left playing with calm face/silver hair/blue outfit.

See [all-64-frames.png](all-64-frames.png), [eight-combinations.png](eight-combinations.png), [blue-calm-all-frames.png](blue-calm-all-frames.png), [head-hair-source-review.png](head-hair-source-review.png), [browser-walk.png](browser-walk.png), and [browser-matrix.png](browser-matrix.png). Exact ImageGen prompts, retained failed inputs and export masks are recorded in [asset provenance](../../assets/walk-side-v1/PROVENANCE.md).

## Visual limits and unfinished actions

- The generated walk includes similar poses in the two half-cycles. Near/far-leg alternation, contact timing and planted-foot quality require further animation review; source stride is estimated rather than a foot-lock measurement. Do not call natural gait passed from 64 different image hashes.
- Hair extraction masks/neck seams are specific to this one right-facing source. Minor fringe/outline edges and RGB changes from generated variants remain review concerns. There is a fixed common scarf; the blue clothing is a colourway of the same silhouette, not general new-shape retargeting.
- Pausing freezes a walk pose. No neutral side idle, walk↔idle transition, front/back motion, independently authored left view, female character, sword/gun action or other original action coverage was added. The full owner requirement for independent customization in every pose/action remains unfinished.
- The page is a local preview with in-memory selections and horizontal movement. It does not add inventory ownership, saves, collision, combat, server-authoritative gameplay or an accepted replacement for the preserved playable character.

The first walking gate has measurable original-layer coverage. Natural motion and owner visual acceptance remain pending; the next art decisions must be based on viewing this prototype, not expanding action/item counts automatically.

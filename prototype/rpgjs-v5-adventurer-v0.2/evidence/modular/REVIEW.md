# Modular limb experiment — rejected by owner, 2026-10-06

**Visual gate: FAIL. Do not ship or promote this rig.** The owner supplied front and side screenshots showing disconnected shoulders/sleeves, segmented elbows/knees and overlapping side-view limbs. The earlier assistant assessment that the composed character looked usable was incorrect. New players now retain the previous painted appearance; the limb experiment remains explicitly selectable for diagnosis. Existing saved appearances are not erased.

**The owner also rejected the subsequent continuous-body and head/hair v2 reviews.** They are failed review evidence, not an accepted starting character. Reframing independently generated pieces onto equally sized canvases after guessed placement does not establish that they were authored against a common character template. Do not treat the v2 exports as the production layer contract.

Following the owner's request to start with one complete front drawing, a separate candidate is now in `assets/character-master/front-v1.png`, reviewed on a light background in `evidence/character-master/front-v1-review.png`. It was generated as one full character, without compositing any of this experiment's parts. Design review remains pending; it is not yet a layered wardrobe master or a gameplay asset.

The source and runtime changes are preserved research work, committed/pushed in checkpoint `148c623` alongside the later registered-layer studies. They remain rejected as product art. Publication of this diagnostic code does not establish completed game/production-art acceptance.

## Why the result differs from the working DDTank Lab

Verified against local `D:/Codex/DDtank/scripts/character_composer.gd`, especially `compose()` (lines 183–217), the original 4.0 cloth/face PNGs and `tests/starter-m-show.png`:

- The Lab's portrait uses a 250×342 canvas. Its cloth layer already contains an authored continuous dressed body: torso, arms/hands, legs and footwear. The face/head and hair are separate registered layers. It does not assemble that portrait from independent upper-arm, forearm, thigh and shin cylinders.
- The Lab composites corresponding frame rectangles at the same origin without independently cropping each visible part to its alpha bounds and stretching it into a guessed body proportion. Game mode uses 114×95 frames, thirteen columns, with action/frame metadata; its frames are authored art rather than the procedural limb rotations used here.
- Layer order is mode-specific. Hair A/B is selected to match the hat. This is a character authoring contract, not an arbitrary list of cosmetic PNGs.

This experiment instead generated detached outlined limb pieces, independently cropped their alpha bounds, scaled them into hard-coded bone lengths and overlaid sleeve/torso images generated independently. The outlines on the ends become visible joint rings. Sleeves miss the shoulder openings; the side silhouette stacks two limbs without an authored occlusion design. Matching code coordinates only makes those defects repeat consistently.

## Corrective production gate

1. Return to one authored standing character and validate its silhouette, proportions, continuous shoulders/arms/hands/legs and side overlap against the Lab before creating more animations or equipment.
2. Define a shared untrimmed canvas/origin and author corresponding face/head, hair, complete dressed-body/clothing and equipment layers in that template. Do not normalize each layer's bounding box independently.
3. Prove one wardrobe change keeps exactly the same body proportions and registration. If separate sleeves or footwear are needed, author masks/overlaps in the same master character rather than stretching generic limb parts.
4. Only then author compatible animation frames or a properly prepared/deformable rig. Walk cycles, weapon sockets, four views and networking do not compensate for a failed standing pose.

### Minimum evidence before another original-art export

- Establish one owner-reviewable original front character master first, with fixed silhouette, face/ear/neck/shoulder placement and foot baseline. Do not use the rejected cutout collection as its anatomical template.
- Author head/face, two hairstyles and two complete dressed bodies against that same master. All corresponding layer pixels must share the same canvas, pose and origin at authoring time. A shared output canvas added after independent generation is insufficient.
- Demonstrate all four hair/body combinations in one view using identical compositor coordinates, plus empty-slot fallback. Item changes may select a layer; they must not change head/body placement or require per-combination scale/offset repair.
- Inspect the source layers and actual composed result, including ear/temple/neck overlap and clean alpha edges. Reject incompatible artwork instead of accommodating it by stretching parts. Crop packing is allowed only when its original frame offset is retained and faithfully restored.
- Treat this as an art-authoring gate. A compositor, manifest, PNG count or passing test does not manufacture compatible art or establish owner acceptance.

The final game should retain original project art. The original DDTank files remain a local reference and are not copied into this repository. This gate does not mean DDTank uses the same approach for every possible character/action; it records the verified Lab portrait and its bitmap composition.

## Technical results and their limits

The owner subsequently rejected the head/hair alignment in the first continuous-body correction too. `head-hair-registration-comparison-v2.png` records a front-only placement correction: uniform source scaling, crown covering the scalp, and separate head/hair exports with the same untrimmed canvas/origin. `head-hair-layers-v2.png` exposes the individual layers; `standing-front-registered-v2.png` shows the whole front pose. Existing masters and the rejected comparison remain preserved. This is not a gameplay replacement or owner acceptance. Edge cleanup and the other directions/actions remain unresolved.

After the rejection, a **single front-pose correction** was exported as `standing-front-corrected.png` and `standing-front-comparison.png`. It uses a new continuous dressed-body component behind the preserved original head/hair. This removes the separate limb assembly from that review image. It is not integrated into gameplay, not accepted by the owner, and does not supply side/back/walk/attack frames. Inputs, exact prompt and registration are in `assets/standing-review/`. This deliberately stops at a reviewable standing pose rather than declaring the wardrobe solved.

Before owner rejection, 44 logic/asset checks passed, including stable joints across equipment changes, PNG composition equivalence within alpha-rounding tolerance and transparent gutters for all sixteen combinations. Typecheck/build and root/subpath HTTP smoke passed at their respective checkpoints. Browser checks showed equip/default fallback, old-body selection, reload persistence and a second online client displaying changed hair/shirt/hat. These checks establish integration only. They did not establish good anatomy, acceptable animation or visual parity.

Preserved screenshots `wardrobe-silver-blue.jpg`, `wardrobe-walk-east.jpg`, `wardrobe-defaults.jpg`, `wardrobe-legacy.jpg` and `online-peer-appearance.jpg` are evidence of this **rejected** checkpoint. Some precede the final minor sword/hat spacing adjustment. The owner's screenshots are the decisive visual feedback; they are not bundled into the repository without a separate need.

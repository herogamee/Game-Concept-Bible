# Original side-walk authoring study — 2026-10-06

Scope: one male adventurer, eight right-facing walk frames, two face variants, two hairstyles and two outfit colourways. Built-in OpenAI ImageGen supplied the artwork. This is an original-art local composition study; natural gait, layer-edge quality and owner acceptance remain pending. No commercial-game image was supplied or copied into these assets.

## Preserved generated inputs and exact prompts

Original outputs remain under `C:/Users/Gamee/.codex/generated_images/01a10f4c-08c6-74b0-a73d-a7aa1e81e592/`. The project copies below preserve those outputs. Each adjacent `*-PROMPT.txt` contains the complete submitted prompt.

| Project source | Original output filename | Role |
|---|---|---|
| `base-generated.png` / `base-PROMPT.txt` | `exec-4242997b-d621-440c-ba7e-1d8cad682470.png` | First bald walk sheet; repeated half-cycle poses prompted a correction. Unused by exporter. |
| `base-corrected.png` / `base-corrected-PROMPT.txt` | `exec-31470386-b42a-43fc-9bee-260da77b6e21.png` | Current 1536×1024, 4×2 canonical source. |
| `face-calm-generated.png` / `face-calm-PROMPT.txt` | `exec-09a5cd26-9ff2-4e8d-b2aa-763feb273948.png` | Green-eyed calm face edit of the canonical source. |
| `hair-chestnut-generated.png` / `hair-chestnut-PROMPT.txt` | `exec-52296e34-2bd0-46a4-8f2a-2f8a5ed9f2e7.png` | Chestnut hair edit; head/body pixels in this source are not used as replacement layers. |
| `hair-silver-generated.png` / `hair-silver-PROMPT.txt` | `exec-c031f551-a63c-455b-afb1-3105b0e87dac.png` | Silver-blue side-parted hair edit. |
| `body-blue-generated.png` / `body-blue-PROMPT.txt` | `exec-4ab53106-19c5-40a3-b687-49f99291b475.png` | Unused initial outfit edit: third-frame head/scarf displacement caused a visible split at the neck band. |
| `body-blue-registered-generated.png` / `body-blue-registered-PROMPT.txt` | `exec-3fca03d7-b5c4-4217-b516-ce19b49ef40c.png` | Corrected blue outfit colourway; exporter uses its dressed-body band. |

The first sheet used the existing original `../character-master/front-v1.png` as an identity/style reference. The corrected sheet edited the first sheet. Face/hair/outfit variants edited the corrected sheet. Chestnut hair also referenced that original front illustration for style. The final blue correction used the corrected bald sheet as target and the first blue edit only as a palette reference. Earlier rejected limb-cutout sprites were not source inputs.

## Native exports

`tools/build-walk-side.mjs` exports six full-size **1536×1024** layer atlases, with eight untrimmed **384×512** cells. All layers share the source grid, origin and frame index. There are no per-combination placement fixes, independent scaling, limb rotations or bounding-box fitting. The browser scales/mirrors the complete composed character for display.

- `face-amber.png` and `face-calm.png`: native head/face bands above local row 238.
- `body-traveler.png` and `body-blue.png`: complete dressed-body bands below row 238, including authored arm/leg motion. The blue outfit retains the same garment silhouette, scarf and boots; this is not a second independently redesigned costume.
- `hair-chestnut.png` and `hair-silver.png`: original hair-source pixels isolated with a traced canonical support, colour seeds, crown-connected component and protected eye/ear/brow exclusions. Enclosed highlights retain pixels from the same generated source. These masks are specific to this drawing, view and palette, not a generic extraction tool.

The head band includes a small common upper scarf strip at the neck seam. Scarf replacement is not implemented; a production source would need an authored neck/occlusion boundary for independent scarf equipment. Generated edits can alter pixels and geometry beyond the requested region; equal PNG dimensions are not proof of alignment. The unused first blue edit demonstrates that limitation. Visual frame review remains required.

Rebuild with `npm run assets:walk-side`. [layers.json](layers.json) records item IDs, defaults, source frames and the one supported clip. [Measured review and browser evidence](../../evidence/walk-side-v1/REVIEW.md) document what works and what remains incomplete. None of these atlases replaces the playable RPGJS character.

# Fixed head, independent eye and face sets — 2026-10-06

The new local `/fixed-template` page implements the first **front-pose subset** of the owner's [fixed-template contract](../../CHARACTER-APPEARANCE.md). It uses one unchanged published head and the previous dressed body/hair, with three eye/brow/mouth sets and two cheek-detail face sets plus no face set. Owner art acceptance remains pending.

## Run and review

From the candidate directory:

```powershell
npm run assets:fixed-template
npm run verify:fixed-template
npm run lab:registered -- D:/Codex/DDtank 5199
```

Open `http://127.0.0.1:5199/fixed-template`. Eye and face selectors are independent. Remove hair to inspect the common head; hide the eye set to inspect face details alone. The nine catalog cards show three eye sets × three face states on the same bald head and can select a pair. Reference crosses are display-only. Reset restores default eye/hair/clothing without overwriting null selections.

The existing local server still requires the external DDTank lab at startup. This page's eight runtime PNGs use **only original project artwork**. The existing reference, original and walk pages are preserved; their new navigation links point to this proof. Raw generation sources are not public static routes.

## Technical checks

`npm run verify:fixed-template` passed **36 rendered cases**: three eye sets × three face states × hair on/off × eye set shown/hidden. The 18 combinations with visible eyes are distinct. [verification.json](verification.json) contains each selection/hash and the tested geometry.

- All runtime files are 1254 × 1254 and draw full-frame at (0,0). A single fixed head file is used in every composition.
- Published blank-head alpha matches the inherited head exactly. Pixels outside the common eye-set authoring regions match the inherited head exactly.
- Hair and the complete dressed-body PNG are byte-identical to their original sources.
- Across all combinations, pixels outside the common feature regions and nonzero alpha footprints are unchanged for each hair-visibility state. Eye swaps do not change pixels outside eye zones; face swaps do not change pixels outside face zones. The initial two cheek-set masks do not overlap the eye zones.
- Final face layers contain visible scar/freckle ink: 570 / 576 qualifying pixels. The [nine-head image](nine-head-combinations.png) was also inspected; hashes/counts alone are not art acceptance.
- Wrong slot/item/template requests are rejected; changing eye selection preserves the face ID. Null basics resolve independently to defaults; the optional null face set stays absent.
- Constant full-character/head display rectangles include visible inherited head/hair/boots. The first display crop clipped the hair tip and was replaced by a common larger rectangle. The display check uses alpha >16/255 because inherited PNGs contain a few faint stray pixels outside the artwork; alpha preservation itself checks every pixel.

Syntax checks passed for the builder, client, model, verification script and local server. HTTP smoke returned 200 for the preserved root/original/walk pages and new page/API/modules/PNG routes; an unlisted raw generation source returned 404. Existing gameplay test counts and builds are historical; they were not rerun for this isolated lab addition.

## Actual browser observations

[Browser checks](browser-checks.json) record the selection datasets:

- Green eyes + scars → joyful eyes retained `face-scar`, the same template and (0,0) origin.
- Hiding hair and eyes retained the selected eye/face IDs while showing the blank head with cheek details. Hidden-eye status explicitly reports that the selection is retained.
- Clicking a joyful-eye/scar catalog card updated both independent IDs and retained the bald preview. Guide crosses used the same reference coordinates.
- Reset restored all stored item selections to null and eye/hair visibility to true. Default amber eyes, hair and clothing returned.
- Final preview: green determined eyes, blush/freckles, original hair/body. No warning/error console entries were observed during these checks.

See [actual page screenshot](browser-fixed-template.png), [face-only screenshot](browser-face-only.png) and [guide screenshot](browser-guides.png). The page was inspected at the browser's normal size, without a viewport override, and left open for the owner.

## Authoring limits

Generated images can alter anatomy outside the requested feature. This exporter discards those pixels and uses shared masks rather than moving the template. The first two cheek attempts were too high; numeric corrections also did not reliably meet the intended registration. Final guide-based edits put the marks inside the fixed cheek zones. All attempts and prompts are retained in [provenance](../../assets/fixed-template-v1/PROVENANCE.md).

The published eye/face atlases include bounded skin underpainting. They are not a general automatic segmentation solution, and shading/feather seams need owner review. Existing hair extraction is inherited from one drawing. The “clothing” example is the previous complete dressed body, not a naked-body plus newly authored integrated garment.

No new clothing silhouette, hairstyle, glasses, hat, wings, full costume, sex-specific default, alternate pose or animation was added. This front proof does not yet connect its independent IDs to `/walk`, saves, inventory ownership or the playable engine. Full action compatibility, natural gait and repeated authoring/repair throughput remain unresolved; do not project thousands-item production capacity from this trial.

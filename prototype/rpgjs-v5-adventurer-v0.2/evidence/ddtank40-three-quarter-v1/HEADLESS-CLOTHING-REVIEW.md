# Body-only clothing sources — 2026-10-06

The owner rejected the clothing cut from a headed portrait: it retained a chin strip/face outline and lost the scarf's upper fold. A second attempt at contour masks still left facial ink. The owner explicitly required creating clothing without a head/face from the outset. This review supersedes the earlier neck-count acceptance claim.

## Sources and prompts

Built-in ImageGen created three transparent 1254×1254 body-only sources. Each input portrait was a reference for costume, style, pose and original canvas registration. Each prompt required a complete neck and collar, no head/face/chin/jaw/hair, empty upper canvas and no recentering or item fitting.

| Outfit | Source in `assets/ddtank40-three-quarter-v1/` | Exact prompt |
|---|---|---|
| Traveler | `clothing-traveler-headless-v2.png` | `clothing-traveler-headless-v2-PROMPT.txt` |
| Knight | `clothing-knight-headless-v2.png` | `clothing-knight-headless-v2-PROMPT.txt` |
| Mage | `clothing-mage-headless-v2.png` | `clothing-mage-headless-v2-PROMPT.txt` |

The original 17 PNGs/prompts remain preserved. Headed knight/mage sources are now superseded. Native `layers/clothing-*.png` copies the respective new PNG byte-for-byte. There is no clothing head/jaw cut, copied chin, scarf extraction, neck repair or limb patch. The single blank-head layer retains its complete jaw below the previous y627 cut. All exports use the unchanged shared uniform matrix, canonical dimensions and (0,0) origins. Clothing renders before the face.

## Review and checks

- `clothing-before-chin-fix.png` preserves the rejected original-only clothing layer.
- `clothing-chin-scarf-comparison.png` compares that rejected layer with the new body-only clothing.
- `neck-collar-detail.png` shows the complete new neck/scarf/collars at large scale; `original-standing-gallery.png` shows assembly with hair/cap/outfit variants.
- Source/native byte identity checks prevent future top cuts or repair masks. Empty head-region and narrow neck fixtures reject a headed source/wide chin cap. The small premultiplied PNG artefacts in transparent pixels are not treated as painted anatomy.
- Registered neck/collar fixtures and 765 native jaw/neck join pixels pass. All 162 original compositions, three expressions sharing one head alpha, ear/cap checks, 33 canonical file sizes/hashes and 12 render substitutions pass. Installed male/female reference defaults retain exact pixels.
- `body-only-verification.json` records the current checks and actual browser review of traveler/knight/mage selection, clothing-only preview, reset and an empty warning/error log. The final browser screenshot is `D:/Codex/DDtank/research/compatibility-4.0/body-only-clothing-lab.png`.
- The former 5874 exact limb pixel comparisons are replaced by opaque anatomy landmarks at the same registered positions. The old opaque limb patches caused sleeve seams; the new entire source is retained. This is **not** proof of exact anatomical invariance: generated outfit edges and ground positions vary slightly, and prompts did not make all lower-body pixels identical. No item-specific fitting hides that variation.

The native source visibly addresses the cropped chin/scarf failure. Owner visual acceptance, exact shared anatomical artwork, natural animation/all poses, female originals, manufacturing scale and original Flash registration remain pending. The UI/source comparison and commercial screenshots are kept outside the repository in `D:/Codex/DDtank/research/compatibility-4.0/`.

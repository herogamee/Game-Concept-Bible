# Willowbrook character direction — 2026-10-02

The owner supplied eight chibi/anime references and asked for Boomz-like clarity at 1920×1080. Commercial references remain external; none of their sprites are copied into this repository.

Official reference checked: [BOOMZ Thailand store screenshots](https://play.google.com/store/apps/details?id=com.gamehunt.boomzth), [GameHunt Boomz](https://boomzth.gamehunt.asia/). Visual observation: large expressive heads, strong silhouettes, clean dark outlines and distinct costume colors are useful design principles. Menu portraits/advertising closeups do not demonstrate the same detail on small moving map sprites. The attached images are not all verified as Boomz.

`willowbrook-chibi-concept-v1.png` is an original AI-generated design reference created with the built-in imagegen tool on 2026-10-02. It is not a commercial-game asset, a transparent runtime sprite, an animation sheet or separable clothing layers. Its shaded presentation background must not be used as a map sprite. It has not replaced the playable hero.

## Production target

- Clean 2D illustrated chibi, not mandatory pixel art. Author a neutral character base and genuinely separate body/face/eyes/hair/hat/shirt/trousers/shoes/weapon layers.
- Use the existing versioned appearance catalog and common rig/timeline contract. Draw all layers on the same frame origin; preserve feet and weapon socket. Account for front/back hair and weapon occlusion.
- Prototype 256×256 source frames displayed at the current 64-world-unit size. At a 1920-wide 800-unit view that is about 154 screen pixels per frame, so new art is downsampled rather than enlarging 64-pixel originals. Exact frame density must be selected after an in-game readability/memory comparison.
- Make four-direction idle/walk/slash/hurt/death first. Review actual moving gameplay at 1920×1080, then expand cosmetic variants. Keep a separate 1024+ portrait source for equipment previews; do not simply stretch map sprites.
- Redraw props/terrain to the same line/shading style after the actor slice is accepted. A renderer resolution change cannot invent missing texture detail.

Gameplay remains the existing bounded village/meadow slice. The concept does not certify art parity, complete animation, modular equipment or owner acceptance.

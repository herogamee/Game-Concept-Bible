# Cutout authoring draft — 2026-10-07

Not a runtime asset or an accepted rig. `traveler-parts.png` is a built-in ImageGen attempt to author nine independent body parts from the original headless traveler reference and `part-guide.png`. The exact prompt is preserved. No head/face extraction was used.

Visual inspection found that generated thigh/shin parts did not retain the guide's compact bone lengths and density relative to the torso. The generated sheet is1254px square rather than the requested1536px square, and the torso crosses the nominal first cell edge. Equal grid cells do not guarantee equal anatomical scale. Do not crop cells blindly, fit each part to hide drift, or replace current standing layers with this draft.

The earlier mesh walk was owner-rejected. Natural motion remains unfinished. Both the mesh test and this draft use our own authored landmarks, not measured DDTank motion anchors. No Godot/Phaser adapter or engine integration has been implemented.

`traveler-keyframes-draft.png` is a second built-in ImageGen experiment, authoring four whole headless-body keyframes instead of warping standing art. Its exact prompt is preserved in `keyframes-PROMPT.txt`. Inspection found that frames1/3 reuse the same lead-leg contact and2/4 reuse the same raised knee, despite asking for opposite phases. Neck position and body length also drift. It therefore cannot form the requested alternating gait and is not exported or used in the lab. These drafts do not establish a scalable animation-asset pipeline.

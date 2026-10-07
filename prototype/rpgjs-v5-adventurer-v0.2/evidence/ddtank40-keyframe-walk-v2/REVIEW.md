# Eight-frame live trial — 2026-10-07

The owner requested8frames in the existing walking lab. `/fixed-template-walk` now loads `eight-pose-keyframe-walk-v2`:8distinct authored body drawings,90ms/frame,720ms/cycle. This is not a duplicated four-frame sheet or interpolation of the rejected standing-texture mesh. Existing head, expression, brown/paired-blue hair and cap remain independent and unchanged.

Built-in ImageGen produced a new headless4×2 master from the previous outfit reference. Two targeted limb corrections followed. Exact prompts are in `assets/ddtank40-keyframe-walk-v2/`. The final1774×887 PNG is preserved byte-for-byte. All frames receive the same uniform import `[0.345,0,0,0.345,26.135,149.645]`, with atlas column edges0/443/887/1330/1774, crop divider443 and lower-row logical origin414. No per-frame body fit, head move, anatomical cutout, skin repair or texture deformation occurs. Output is an auxiliary2000×342 sheet,8cells250×342; the4-frame asset/export remains preserved.

## Actual limits

The prompting did **not** fully achieve opposite lead legs in the second half. Contacts still resemble the same leading leg; frame7 lifts the near boot more noticeably. The generated torso/arms also vary slightly; registration does not make these anatomical drawings identical. Phase names in the manifest describe the intended sequence, not successful motion-capture labels. Publish as an explicit8-frame trial for owner review, not a corrected natural gait. More frames alone do not resolve the joint/gait problem. One outfit; no Godot/Phaser or DDTank battle/virtual integration, and no rig on the separate part atlas.

## Validation

`assets:ddt40-keyframe-walk8` / `verify:ddt40-keyframe-walk8` pass:8distinct frame hashes, original master hash,482985 painted source pixels retained within registration, exact import alpha and zero premultiplied colour error,96compositions and288neck/jaw samples,8-frame clock wrapping. The old4-frame verification also passes. These are technical gates, not owner animation acceptance.

Live browser confirms the new source URL and stepping1/2/3/4/5/6/7/0 with phases90/180/270/360/450/540/630/0. Hair/eye/cap swaps, movement and source links are reviewed separately. Browser proof: `D:/Codex/DDtank/research/compatibility-4.0/eight-frame-walk-browser.png`.

Paused frame1/phase90/x480 remains unchanged while switching paired-blue hair, green eye set and cap; hair variant becomesA. Left and right movement use the new source (direction−1/+1); no console errors/warnings. Restore brown/amber/no-cap and leave in-place playback enabled for the owner. Source prompt and both correction prompts plus rejected intermediate PNGs are preserved with the final master. Verification does not certify the requested limb correction succeeded.

## External gait research requested by owner — 2026-10-07

Owner rejected the leg alternation and requested other sources, including GitHub. Research reads actual upstream code and exported rig data, not just repository descriptions. No animation or engine change is included in this research checkpoint.

### Sources inspected

- [ProceduralWalking.cs](https://github.com/mradovic38/ik-proc-anim-2d/blob/c5f32c36d6febf81871f7b310cd08b4beef3526c/Assets/Scripts/ProceduralWalking.cs), MIT Unity demonstration. `_frontFootCanMove` / `_backFootCanMove` gate the next step on the other foot completing its step. `calculateStep` captures start/end positions and a raised midpoint; nested interpolation describes a swing arc. Useful alternating support-foot scheduling reference, not a drop-in Canvas/Phaser/Godot implementation or validated production dependency. `FootPositioner.cs` was also read; its per-update multiplication of `FootDisplacementOnX` when facing left deserves correction before reuse. Source inspection is not a Unity execution test.
- [Official Spineboy rig explanation](https://esotericsoftware.com/spine-examples-spineboy#Legs) and [actual exported rig](https://github.com/EsotericSoftware/spine-runtimes/blob/4.3/examples/spineboy/export/spineboy-pro.json). Confirmed in JSON: hip and front/rear foot-targets are children of root; thigh→shin chains remain children of hip; walk exists, with independent front/rear leg constraint timelines. Upstream explanation uses two-bone thigh/shin IK, then foot IK, with a foot-tip constraint to avoid ground penetration. Moving hip does not drag the foot targets. Use the rig principle, not this character's proportions or texture.
- [Official Mix-and-match example](https://esotericsoftware.com/spine-examples-mix-and-match) and [skins documentation](https://esotericsoftware.com/spine-skins). Equipment comprises separate attachment groups on shared animation; overlapping limbs need authored source geometry, weights and draw-order control. Limb images are prepared for deformation. This matches our independent equipment goal; our clothing remains one selected bundle even if its authoring skin contains multiple internal images.
- [Godot cutout documentation](https://docs.godotengine.org/en/stable/tutorials/animation/cutout_animation.html): parent hierarchy, joint pivots, draw order and combining cutout with replacement drawings for hands/feet. Page explicitly warns it may be outdated for4.7; treat as workflow reference, not verified current runtime-IK instructions.
- [Spine runtime README/license](https://github.com/EsotericSoftware/spine-runtimes#licensing): examples are evaluable, but runtime redistribution has Spine license requirements. No runtime/art/code has been vendored or dependency installed for this research.

### Diagnosis against our two implementations

Active playback has only a clock and8body raster frames. There are no controlled left/right limb identities in those drawings; generated repeated leading-leg images remain wrong whatever the frame count or timing. Declared phase names and passing dimension/source tests cannot repair or validate the pictured gait.

The older mesh trial ALREADY has two-bone IK and a half-cycle phase shift (`phase+i*.5`). Therefore simply adding IK/180-degree shift again is not a new solution. Its intact standing-clothing image has visible/hidden limb surfaces baked together; the coordinate-based weighting/split cannot reliably articulate the intended limb and preserve silhouette/occlusion. The unrigged nine-part draft also has unaccepted lengths/registration. Correct motion data and correctly authored/bound artwork are separate gates.

### Recommended bounded proof

1. Build one fixed-proportion skeleton using distinct immutable leg identities, explicit hip/knee/ankle pivots and fixed bone lengths. Display near/far legs in different colours. Head/eye/hair/hat keep their canonical local attachments.
2. Author the eight phases as data: left-contact/down, right-passing/up, right-contact/down, left-passing/up. The second contact must visibly exchange support and swing roles without mirroring the torso or swapping limb identity. Half-cycle offset is a scheduling rule, not proof that the art obeys it.
3. Use planted foot targets during support, low swing arcs, explicit knee bend direction and reach limits. In translation mode, ground-contact world coordinates stay fixed while the body moves; derive phase/speed from the same step distance and cycle duration. In-place mode uses backward local stance motion. Chibi projection/near-far depths must be declared rather than forcing source pixels onto guessed pivots.
4. Review the coloured skeleton and contact frames before applying painted art. Then author proper overlapping thigh/shin/boot parts around the bind-pose pivots; control rigid limb/soft joint weights and draw order. Do not warp the rejected intact standing texture or resize each part to conceal anatomical drift.
5. Bake the approved skeleton motion to8registered250×342 frames per outfit with unchanged local equipment anchors, category/Pic paths and family export. Independent clothing bundles reuse the motion only when bind-pose/topology fits. This remains an auxiliary sheet until actual DDTank game/virtual coverage and registration are implemented.

Acceptance requires opposite lead legs at contacts1/5, opposite swing legs at passing3/7, constant bone lengths, visible knees with consistent bending, no ground penetration or contact sliding, correct occlusion/joint joins and owner's visual approval. Numerical checks cannot replace that approval. The research supports this approach; it does not claim the final rig or natural gait has already been implemented.

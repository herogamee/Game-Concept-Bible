# Eight-frame live trial — 2026-10-07

The owner requested8frames in the existing walking lab. `/fixed-template-walk` now loads `eight-pose-keyframe-walk-v2`:8distinct authored body drawings,90ms/frame,720ms/cycle. This is not a duplicated four-frame sheet or interpolation of the rejected standing-texture mesh. Existing head, expression, brown/paired-blue hair and cap remain independent and unchanged.

Built-in ImageGen produced a new headless4×2 master from the previous outfit reference. Two targeted limb corrections followed. Exact prompts are in `assets/ddtank40-keyframe-walk-v2/`. The final1774×887 PNG is preserved byte-for-byte. All frames receive the same uniform import `[0.345,0,0,0.345,26.135,149.645]`, with atlas column edges0/443/887/1330/1774, crop divider443 and lower-row logical origin414. No per-frame body fit, head move, anatomical cutout, skin repair or texture deformation occurs. Output is an auxiliary2000×342 sheet,8cells250×342; the4-frame asset/export remains preserved.

## Actual limits

The prompting did **not** fully achieve opposite lead legs in the second half. Contacts still resemble the same leading leg; frame7 lifts the near boot more noticeably. The generated torso/arms also vary slightly; registration does not make these anatomical drawings identical. Phase names in the manifest describe the intended sequence, not successful motion-capture labels. Publish as an explicit8-frame trial for owner review, not a corrected natural gait. More frames alone do not resolve the joint/gait problem. One outfit; no Godot/Phaser or DDTank battle/virtual integration, and no rig on the separate part atlas.

## Validation

`assets:ddt40-keyframe-walk8` / `verify:ddt40-keyframe-walk8` pass:8distinct frame hashes, original master hash,482985 painted source pixels retained within registration, exact import alpha and zero premultiplied colour error,96compositions and288neck/jaw samples,8-frame clock wrapping. The old4-frame verification also passes. These are technical gates, not owner animation acceptance.

Live browser confirms the new source URL and stepping1/2/3/4/5/6/7/0 with phases90/180/270/360/450/540/630/0. Hair/eye/cap swaps, movement and source links are reviewed separately. Browser proof: `D:/Codex/DDtank/research/compatibility-4.0/eight-frame-walk-browser.png`.

Paused frame1/phase90/x480 remains unchanged while switching paired-blue hair, green eye set and cap; hair variant becomesA. Left and right movement use the new source (direction−1/+1); no console errors/warnings. Restore brown/amber/no-cap and leave in-place playback enabled for the owner. Source prompt and both correction prompts plus rejected intermediate PNGs are preserved with the final master. Verification does not certify the requested limb correction succeeded.

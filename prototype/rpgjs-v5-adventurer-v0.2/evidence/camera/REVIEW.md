# Camera, scenery and movement follow-up — 2026-10-02

Owner reported interrupted walking, scenery moving independently, and an overly close desktop camera.

Changes:
- Steering heartbeats renew the server lease without cancelling active motion. WASD and arrows share the same normalized diagonal input path, at 160 world units/second, with a 250ms lost-input lease.
- Click routes remove collinear grid waypoints while retaining collision-safe turns. Arrival consumes nearby waypoints within the same step instead of inserting a stopped frame. Final movement duration is bounded by remaining distance.
- Static prop event bodies were observed 1–7px away from authored coordinates despite disabled locomotion (examples: village rock 809,409 became 809,416; fence 57,263 became 64,263). Terrain collision can depenetrate these event bodies. Image-only props now cancel their parent's live translation each render tick and stay at authored world coordinates; collision remains in the existing static Tiled mask. Server prop locomotion is disabled too.
- Custom camera pauses the built-in viewport clamp/follow plugins, uses the logical viewport dimensions, and adds frame-time easing plus an optional 32-world-unit dead zone. World labels update on the render clock with camera motion, rather than at the 100ms HUD cadence.
- Settings save camera distance (80–150%), vertical player framing (50–75%) and steady/follow choice under willowbrook-camera-v02, separate from gameplay saves. Default distance is 125% for browser widths >=600px, 100% below that. Uniform scale fits within the authored 960x540 map; 125% at 1920x1080 already shows the whole map, so farther distance/vertical framing cannot reveal beyond its edges. These are 2D zoom/framing controls, not a new tilted projection.

Verification on this computer: Windows, AMD Ryzen 3 PRO 4350G, AMD Radeon integrated graphics, Codex in-app Chromium browser, localhost development server. Visual inspection covered the village at the real changing panel sizes and an explicit 1920x1080 viewport. A click route from about 749,277 back toward the central road exercised camera movement and arrival. Default framing showed view 960x540 at 1920x1080; changed settings showed 800x450 without stretched units. Render-clock rolling windows of 600 frames (~10 seconds at 60Hz) reported 60 FPS and p95 17.6–20.0ms after loading; motion updates observed ~55–60Hz. Registered scenery image anchors were measured in viewport-local world space with maximum drift 0.00px while walking, compared with the earlier live event offsets above.

These are local observations, not an A/B GPU benchmark or a low-end/network guarantee. Startup/HMR samples had temporary stalls. Owner feel acceptance remains pending; online two-client visual/input regression was not rerun for this checkpoint. Existing server combat authority is preserved.

Typecheck, 31 focused tests, build and root/subpath production smoke pass. Tests cover heartbeat continuity, bounded/normalized steering, same-step waypoint continuation, collision-safe compressed routes and distance/aspect/map limits. The tracked portable ZIP is the earlier checkpoint; current testing uses editable source at port 5173.

Official documentation inspected: https://v5.rpgjs.dev/guide/create-movement.md, https://v5.rpgjs.dev/api/client/rpg-client-engine.md, https://canvasengine.net/components/viewport.md, https://canvasengine.net/concepts/lifecycle.md, RPGJS physic and UI CSS package READMEs. Installed engine/physics implementation was also inspected to verify movement durations and viewport behavior.

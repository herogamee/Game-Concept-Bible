# Responsive and mobile foundation — 2026-10-02

This is a browser prototype targeting Android Chrome and iOS Safari. Native APK/IPA packaging, installable PWA/offline support and real-device acceptance are not implemented.

- The game fills the actual CSS viewport (`100dvh`), respects safe-area insets and crops the reference 800×450 camera without distorting world units. Pointer coordinates and overhead labels use the same cropped viewport. Rotation recalculates framing.
- Inventory/settings fit available width/height and scroll internally. The action dock stays in a corner; utility controls are in settings. UI/overhead text scale is independently saved at 85–130%. Touch targets are at least 44 CSS pixels.
- Touch controls appear automatically for coarse pointers, with an explicit show/hide preference. Pointer capture, release/cancel, focus loss and page visibility clear held input. WASD/touch send cardinal direction requests; server steering leases expire after 180ms without refresh. The server validates directions, world limits and movement; RPGJS physics retains Tiled collisions. Diagonal keyboard parity remains open.
- Actual server movement selects continuous walking animation only when its phase changes, preserving leg cadence. Finite slash/hurt/death animations unlock locomotion control.
- Smooth mode caps physical resolution at 3× logical density; existing 64×64 source art still limits detail. No commercial-quality replacement sprites are claimed.

Verification: 28 focused tests, TypeScript, production build and root/subpath smoke passed. Browser evidence covers 1920×1080, 1024×768, 390×844, 844×390 and 320×568, including 130% text and scrolling settings. Walking screenshots show separate poses. Browser automation became background-throttled during joystick drag checks; sustained touch movement/release performance still needs foreground and real-device verification. Server lease expiry and bounds are covered by tests.

Before mobile acceptance, check Android/iOS touch movement, simultaneous joystick/attack, canceled touches, safe-area/rotation, browser toolbar resizing, text overlap, audio activation after a gesture, frame time/memory on modest devices and reconnect behavior. Online guest/in-memory saves remain unsuitable for durable accounts. Product visual/control acceptance remains with the owner.

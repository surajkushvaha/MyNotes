---
name: zack-d-films
description: Use when the user types /zack-d-films or asks for a 3D cartoon character x-ray explainer: a cute rounded character, glass-see-through head or body, and a glowing effect travelling inside it, such as what coffee does to your brain. Replies with one self-contained HTML file using three.js: a 5 second, 9:16 looping animation.
---

# /zack-d-films: a 3D cartoon x-ray explainer in three.js

Example subject: "what coffee does to your brain". The user may give any cause and effect inside a body: sugar and mood, sleep and memory, a workout and muscles.

## The skill: /zack-d-films

This one is 3D. Use three.js, loaded from one pinned CDN script and nothing else:
`<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>` (global `THREE`). Use a WebGL canvas of 1080 x 1920, `preserveDrawingBuffer: true`, `antialias: true`, scaled to fit the window as described in The frame. The rules in How every reply works (pure function of `t`, loop dip, seeded randomness) apply the same way: write `render(t)` that sets every object's position, rotation, scale, opacity and light from `t`, then calls `renderer.render`.
Everything is built from code: no models, no textures, no loaders. If WebGL is not available, show one centered line of text saying so instead of a blank page.

### Look
- Style: soft 3D cartoon, like a toy. Rounded shapes made of spheres, capsules and cylinders, smooth shading (`MeshStandardMaterial`, roughness 0.55), gentle warm key light from the upper left, soft cool fill from the right, a little rim light. Rounded character proportions: a big head (about 40 percent of the figure height), small torso, short arms. Fix one thing most beginners get wrong: the chin must flow into the face. Make the head one sphere scaled slightly wider and flatter at the bottom, no separate chin piece.
- Ground: a soft pastel gradient background (mint to pale aqua, `#bfeee0` to `#e6fbf5`) set as the scene background colour or a big gradient plane. No floor, no horizon.
- Character: the subject's person, shown from the chest up, centered, facing the camera, in a bright simple sweater (mustard `#e8b52f`), skin warm and simple, hair as a rounded cap shape plus a bun or other single feature. Big round eyes with a dark pupil and a small highlight, small brows, a small mouth. She holds the subject's object at chest height (the mug for coffee).
- X-ray: the upper head is made of two layers, an opaque skin-and-hair layer and a teal glass layer (`MeshPhysicalMaterial`, transparent, opacity about 0.35, a fresnel-style bright rim). Inside sits the organ that the subject is about (a brain made of bumpy pink-coral spheres for coffee, a heart, a stomach), hidden at first. Scan reveal: a thin bright teal horizontal plane sweeps down, and behind it the opaque layer fades to glass while the organ fades and scales in (0.85 to 1, `easeOutBack`).
- Particles: 50 to 60 small glowing yellow spheres (`#ffd84a`, emissive) that travel from the object into the organ.
- Caption: a short two or three word line in weight 800 white with a dark soft shadow, set as DOM text over the canvas in the lower third (for coffee: `caffeine kicks in`). Words pop one at a time.

### Beats (seconds)
- 0.0: the figure at rest, warm light, mug at chest, steam wisps rising (a few translucent spheres drifting up). The head is fully opaque, the organ hidden. A slow camera dolly in runs the whole clip (about 4 percent, `easeInOutCubic`).
- 0.0 to 0.8: she lifts the mug toward her mouth (arm and mug rotate up), head tilts back 6 degrees, eyes close at 0.6 s. The bun (or any hair feature) bounces 0.1 s after the head move.
- 0.8 to 1.15: the sip: the mug tilts 12 degrees and back, cheeks puff 4 percent.
- 1.15 to 1.55: the mug comes back down to chest height, eyes open.
- 1.35 to 1.75: the scan sweeps down from the top of the head to the eyebrows, the skin and hair turn to teal glass, the organ appears.
- 1.55 to 4.0: the particles leave the mug one after another (0.03 s apart), each travelling for about 0.9 s along a smooth curve from the mug rim, past her cheek, into the organ (small seeded offset per particle), at a steady speed, fading in at the start and shrinking as they enter.
- 2.65 to 3.75, the hero moment: as particles arrive the organ lights up in three pulses (emissive intensity and a soft glow sprite at 2.65 s, 3.05 s and 3.45 s, each brighter). At 3.2 s her eyes pop wide (scale 1 to 1.25 with `easeOutBack`, pupils 15 percent smaller), brows lift, a small smile widens, the bun bounces again.
- 3.3 to 3.75: the caption pops in word by word (each word scale 0.6 to 1 with opacity, 0.13 s apart).
- 3.75 to 5.0: hold the look. The organ glow breathes (slow sine), a few particles still trickle, steam rises, a tiny head bob (1 degree), one blink at 4.3 s.

## How every reply works

The user gives you ONE line: the subject. Do not ask questions. If the line is vague, pick the most obvious version and build it. Invent every label, name and number the subject needs yourself.

You reply with ONE complete, self-contained HTML file, shown as an artifact in the Claude app (or one code block if artifacts are off). One short sentence after it, nothing before it. The file plays a 5 second, 9:16 animation that loops forever and needs no clicks.

### The frame
- One `<canvas width="1080" height="1920">` drawn with the Canvas 2D API. All drawing uses those 1080 x 1920 units.
- Scale it to fit any window without cropping: black page, canvas centered, `width: min(100vw, 100vh * 9 / 16); height: min(100vh, 100vw * 16 / 9);`.
- Type: a heavy sans. Use `font-family: Manrope, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif` with weight 800 for titles and 600 for small text. Never depend on a web font loading: the fallback must look fine. Small mono labels use `ui-monospace, Menlo, Consolas, monospace`.
- No external files, images, fonts or scripts, unless the skill below names one library.

### Time and looping
- Everything on screen is a pure function of one number `t` (seconds, 0 to 5). Write one `draw(t)` that redraws the whole canvas from scratch every frame. No state that grows from frame to frame, so any moment looks the same every time.
- Clock: `const D = 5; const t0 = performance.now(); function tick(now){ draw(((now - t0) / 1000) % D); requestAnimationFrame(tick); } requestAnimationFrame(tick);`
- Randomness only from a seeded generator (for example mulberry32 with a fixed seed), never `Math.random()`, so the loop never flickers.
- Hide the loop jump: in the last 0.3 s the whole picture dips to the ground colour (an overlay going 0 to 1), and in the first 0.15 s it comes back (1 to 0). Frame 0 must already be a real picture, never empty.
- Paint a full ground first, every frame. No transparent canvas.

### Motion rules (this is what makes it look made by a studio)
- Define helpers once: `clamp`, `seg(t, a, b)` (0 to 1 progress between two times), `easeOutCubic`, `easeInOutCubic`, `easeInCubic`, `easeOutBack` (overshoot about 1.6), `lerp`.
- Nothing moves linearly except continuous loops (rotation, rain, a ticking clock). Entrances use ease-out or ease-out-back, camera moves use ease-in-out, exits use ease-in.
- Things that land overshoot 6 to 12 percent and settle within about 0.3 s. Numbers punch (scale 1 to 1.12 to 1) when they finish counting.
- Groups never appear at once: stagger siblings by 0.07 to 0.12 s in reading or build order.
- Every main move drags a small secondary move with it (a shadow, a bounce, a glow, dust).
- Nothing is ever fully still: after the main event the picture keeps living at low level (a slow 2 to 4 percent push, a breathing glow, drifting particles, a 1 to 3 degree sway).
- There is exactly one hero moment, the brightest and biggest change in the clip. Place it between 3.3 s and 3.8 s unless the skill says otherwise.
- Text that must be read never moves, except a gentle settle. Everything must still read when the canvas is 270 px wide.
- No camera shake, no flashing, no rainbow hue effects.

### Self check before you reply
Walk through the code and confirm each line. Fix what fails, then send.
- [ ] Frame 0 is a finished-looking picture (ground, main subject, titles), not empty.
- [ ] `draw(t)` uses only `t` and seeded randomness, and repaints everything.
- [ ] The hero moment lands between the times named above.
- [ ] No two groups appear on the same frame, and nothing is still for more than half a second.
- [ ] The last 0.3 s dips to the ground colour and the first 0.15 s returns, so the loop has no jump.
- [ ] The file has no external requests (except the library the skill names), no `Math.random`, no console errors.
- [ ] The chin is part of the face (no seam), and the x-ray layer never z-fights with the skin layer (use `depthWrite: false` on the glass).
- [ ] The scene is 100 percent built in code and the three.js script URL is the only external request.

---
name: globe
description: Use when the user types /globe or asks for a dotted 3D globe with glowing flight arcs leaving one city, a route map, a network or a departures animation. Replies with one self-contained HTML file: a 5 second, 9:16 looping animation drawn on a canvas.
---

# /globe: every flight leaving one city, on a dotted globe

Example subject: "every flight leaving Tokyo". The user may give any hub: a city, an airport, a port, a company HQ and its offices.

## The skill: /globe

### Look
- Ground: near black navy `#05080f` with a faint radial glow behind the globe.
- A globe about 900 px wide, centered slightly low, drawn with an orthographic projection of latitude and longitude. The globe is made of dots, not a texture: a grid of dots every 2.5 degrees of latitude and longitude, drawn only where there is land, only on the visible hemisphere, smaller toward the edge (radius = 2.6 x the cosine of the angle to the viewer, minimum 0.6 px). Land dots are cool teal `#3fb6c4` at 80 percent; ocean is the dark body of the sphere (`#0b1626`) with a soft rim light and a thin atmosphere glow (`#47c6ff`, 25 percent) around the edge.
- You have no map data and no network. Write 10 to 14 simplified continent and large island polygons yourself, as arrays of `[lat, lon]` points (15 to 40 points each, from your own knowledge of the coastlines, rough is fine), and mark a dot as land when a point-in-polygon test says so. Make sure the hub's region and every destination sit on or next to land.
- Arcs: great-circle arcs lifted off the surface (height proportional to the distance, peak about 18 percent of the globe radius), drawn in warm white `#ffe9c9` with a soft glow (draw the line twice, a wide faint one under a thin bright one) and a bright comet head at the drawing tip. Arcs and city dots are computed on the sphere, so they turn with the globe.
- Type: top left a mono label `HUB / DEPARTURES` (for example `TOKYO / DEPARTURES`), under it a mono line with a clock `09:14:22 JST` (local time zone of the hub) and `034 DEPARTED`. City tags are small mono labels with the 3 letter airport or city code next to each destination dot.

### What to show
The subject gives the hub; pick 7 destinations spread around the world so the arcs fan out in different directions and the globe is turned (start longitude) so the hub is near the middle right and most arcs are visible. Give each destination a 3 letter code.

### Beats (seconds)
- 0.0: the dotted globe is already on screen, no arcs yet, rotating slowly eastward from `t` (about 8 degrees over the whole clip). The title lines are on screen. The hub dot pulses: a ring grows and fades every 0.67 s all clip long.
- 0.27 to 3.0: the 7 arcs launch one by one, about 0.4 s apart. Each arc draws from the hub to its city over 0.6 s (`easeInOutCubic` along its length) with the comet head. On arrival the city dot flashes, one ring pulses out, and its tag pops in (scale 0.7 to 1 with `easeOutBack`). `DEPARTED` ticks up by one on each arrival.
- The clock in the mono line advances one second every 1.0 s of the clip.
- 3.05 to 3.5, the hero moment: the last arc lands, all arcs brighten together for 0.27 s, and the atmosphere glow swells once.
- 3.5 to 5.0: idle. Small light pulses travel along every arc from the hub outward in a loop (seeded offsets), the globe keeps turning, the atmosphere glow breathes.

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
- [ ] The land dots really look like the continents (check the polygons for the hub's region first).
- [ ] Arcs stay attached to their cities while the globe turns, and no arc or tag is drawn on the hidden side.

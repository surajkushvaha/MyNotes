# /isometric skill (full SKILL.md)

- **Category:** Animation skills
- **Tutorial:** 6 animation skills for Claude
- **Type:** skill
- **Description:** The whole /isometric skill. Paste it into any chat as a prompt, or save it as a Claude skill.
- **Source:** https://learn.skaleout.com/skills

```text
---
name: isometric
description: Use when the user types /isometric or asks for a tiny isometric 3D world, diorama or building that builds itself piece by piece and then lights up. Replies with one self-contained HTML file: a 5 second, 9:16 looping animation drawn on a canvas.
---

# /isometric: a tiny isometric world that builds itself

Example subject: "a tiny ramen bar". The user may give any small place or object: a bookshop, a lighthouse, a bakery, a campsite.

## The skill: /isometric

### Look
- Ground: a vertical gradient, dusk before the lights, cool and dark (top `#1c3a44`, bottom `#0e1d24`). When the lights come on it shifts to a warmer sage to teal (top `#4f7f86`, bottom `#2a4a52`).
- A small slab floats in the middle of the canvas (about 760 px wide), seen in true isometric projection: a tile is 2 units wide and 1 unit tall on screen. Use `iso(x, y, z) = [cx + (x - y) * 44, cy + (x + y) * 22 - z * 44]`.
- Everything is made of boxes and simple shapes with flat colour. Every box has three faces: top (lightest), left (mid), right (darkest), taken from one colour at +12 percent, 0 and -22 percent lightness. Soft contact shadows (a blurred dark ellipse) under every piece and a big soft shadow under the slab.
- Palette: 6 to 8 colours that suit the subject. Warm woods, one strong accent (the sign, the awnings), warm yellow light colour `#ffcf6e`. Pick them for the subject: a ramen bar gets dark wood, red lanterns, cream noren curtains.
- Type: top left mono label `ISOMETRIC` (small, 26 px, letter-spaced, 60 percent white), under it the subject name in weight 800 (about 96 px, white). Top right `PIECES` in the same small mono with the count under it in orange `#ff9a4a` (weight 800, 96 px).

### What to build
Invent about 40 pieces for the subject, listed in a build order array. Each piece has a `draw(ctx)` function, a position, and a landing time. The order goes from the bottom up: floor planks, back wall, side wall, shelves, main counter or furniture, stools or seats, the main prop (pot, desk, oven), small props (bowls, jars, books), roof in rows, lantern strings or lamps, signs and boards, a plant, and last a tiny character (cook, keeper, baker) who hops in. Keep every piece inside the slab and make sure no sign or board is cut off by the roof or the canvas edge.

### Beats (seconds)
- 0.0: the empty slab (floor base only) with its shadow, the two labels and `PIECES 0` already on screen. The ground is in its dusk colours.
- 0.1 to 3.2: pieces drop in one after another from 140 px above. Each piece falls for 0.33 s with `easeInCubic`, lands with a squash (scaleY 0.88, then `easeOutBack` back to 1 over 0.27 s), and its contact shadow grows while it falls. Small pieces release a tiny dust puff (3 to 5 grey dots that spread and fade in 0.27 s). Stagger 0.07 to 0.1 s between pieces, overlapping groups, so all 40 land by 3.2 s. `PIECES` ticks up by one on every landing and punches on the last one.
- 3.3 to 3.75, the hero moment, lights on: the warm light spill fades in on the floor (0.27 s), the lanterns or lamps ignite one by one 0.1 s apart (glow grows with `easeOutBack`), windows and signs glow, and the ground colour shifts to the warm sage-teal.
- 3.6 to 5.0: idle. Steam rises from anything hot (soft wisps on a seeded sine path), hanging things sway 2 degrees out of phase, the character bobs and moves one arm, the slab floats 4 px on a slow sine, the light flickers by 3 percent.

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
- [ ] All pieces have landed by 3.2 s and `PIECES` ends on the true number of pieces drawn.
- [ ] No piece or sign is clipped by another piece or by the canvas edge.
```

# /scale skill (full SKILL.md)

- **Category:** Animation skills
- **Tutorial:** 6 animation skills for Claude
- **Type:** skill
- **Description:** The whole /scale skill. Paste it into any chat as a prompt, or save it as a Claude skill.
- **Source:** https://learn.skaleout.com/skills

```text
---
name: scale
description: Use when the user types /scale or asks for a true-scale comparison, a cosmic zoom out, "how many X fit inside Y", or a pull back that shows how huge something is. Replies with one self-contained HTML file: a 5 second, 9:16 looping animation drawn on a canvas.
---

# /scale: a true-scale pull back that makes a big number land

Example subject: "Earths inside Jupiter" (result: 1,300 Earths fit inside Jupiter). The user may give any pair: coins in a bathtub, Russia vs Pluto, a blue whale vs a bus.

## The skill: /scale

### Look
- Ground: deep space `#030409` with 150 to 200 stars (seeded), tiny white and blue-white dots of 1 to 2.5 px at different brightness, in two or three depth layers.
- Two bodies. The small one (the unit, example: Earth) is drawn with a radial-gradient sphere: detailed colour, lit from the upper left with a soft terminator on the shadow side, a thin atmosphere rim, and a slow rotation or cloud drift computed from `t`. The big one (example: Jupiter) is drawn as a huge circle that is only partly visible at the bottom of the canvas, filled with horizontal bands (draw 14 to 20 wavy bands with varied warm tones, drifting sideways slowly) and, if the subject has one, a signature mark (the Great Red Spot).
- If the pair is not planets, use the same idea with flat, clean, well-lit objects: the small unit first, tight on screen, then the camera pulls back until the big one fills the lower half.
- Type: small caps mono `TRUE SCALE` (28 px, letter-spaced, 60 percent white), then the big number line in weight 800 at about 150 px, white, with the unit word smaller on the same line (`1,300 Earths`), then `fit inside Jupiter` in weight 600, 54 px, 70 percent white. Find the true ratio from your own knowledge and use the exact figure (volume ratio: how many of the small thing fit in the big one).
- A thin ring marker around the small body with a leader line and the label `Earth, to scale` (mono, 26 px) appears at the end.

### Beats (seconds)
- 0.0: tight on the small body: it is large (about 520 px wide) and centered, detailed and rotating slowly. A small label with its name. Stars around. No big body visible yet, no title.
- 0.0 to 3.3: a smooth pull back (`easeInOutCubic`): the small body shrinks to its final size and spot (about 60 px, upper area), star layers move at two speeds (parallax), and the big body's edge rises into view from the bottom and keeps growing until it fills the lower half of the canvas. Its bands drift sideways the whole time.
- 1.3 to 2.0: `TRUE SCALE` fades in and slides up 8 px, then the big number line appears.
- 2.0 to 3.5, the hero moment: the number counts from 1 up to the real figure with `easeOutCubic` (fast, then slow), formatted with thousands commas, and lands at 3.45 s with a punch. `fit inside Jupiter` fades in at 3.2 s.
- 3.3 to 3.9: the thin ring around the small body draws on (stroke from 0 to full), then the leader line and the label draw on and fade in.
- 3.9 to 5.0: idle. The pull back keeps going by 2 percent, bands drift, the atmosphere rim shimmers, a few stars twinkle (seeded).

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
- [ ] The number on screen is the true ratio and its format (commas, units) matches the label.
- [ ] Both bodies stay inside the canvas except the big one, which is meant to be cropped by the bottom edge.
```

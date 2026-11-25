---
name: versus
description: Use when the user types /versus or asks for a split screen comparison of two opposite things shown by two animated stick figures, such as motivation vs discipline, hype vs habit, day 1 vs day 100. Replies with one self-contained HTML file: a 5 second, 9:16 looping animation drawn on a canvas.
---

# /versus: a split screen of two stick figures, hype against habit

Example subject: "hype vs habit" (top: a figure who quits on day 3 in the rain; bottom: a runner who is still running on day 112). The user may give any pair of opposites.

## The skill: /versus

### Look
- The canvas is split into two halves with a thin horizontal line in the middle (4 px, `#ffffff` at 35 percent) and a small `VS` pill centered on it (white outline, 56 px tall, 34 px weight 800 text).
- Top half (the weak side): near black `#0d0e12`, grey tones only. Bottom half (the strong side): dark warm `#140c08` that grows an orange sun glow from the right edge as the clip goes on (`#ff7a2f`).
- Both figures are simple stick figures drawn with round line caps: 10 px white lines, a ring for the head. No faces except one small gesture (a tired mouth, a smile). No fill. Rain is drawn as thin diagonal lines moving down, in both halves, from seeded positions.
- Labels: each half has a mono caption top left (`HYPE`, `HABIT`: use the two words from the subject, 28 px, 60 percent white) and a counter top right on the top half (`DAY 3`, grey) and at the bottom of the lower half the big orange counter (`DAY 112`, weight 800, about 150 px) with a small line under it (`412 km`).
- Keep the lower half's figure and its counter at least 40 px apart at every moment.

### Beats (seconds)
- 0.0: both halves, labels, the split line and the `VS` pill are already on screen. Counters read `DAY 1` (top, grey) and `DAY 1`, `0 km` (bottom, orange). Rain already falls in both halves.
- 0.0 to 0.35: the `VS` pill pops (scale 0.6 to 1 with `easeOutBack`) and its outline glows once.
- Top, the weak side: 0.0 to 0.7 the counter ticks from 1 to 3 and stops. 0.7 to 1.3 the figure gives up: it sighs (shoulders rise and drop), pulls off one shoe and drops it beside the curb (it falls and bounces once), the head sinks. The rain cloud darkens slightly. After 1.3 s only small idle: rain, a slow head shake at 3.3 s, the cloud drifting 10 px.
- Bottom, the strong side: the runner runs in place the whole clip with a real run cycle (stride about 0.53 s, thighs and shins at two joints, arms swinging opposite, body bob 6 px, a slight forward lean), drawn parametrically from `t`. The ground scrolls left under it (ground ticks, puddles, distance markers move at a steady speed) so it reads as moving forward. A footprint is stamped at every foot strike and scrolls away with the ground, fading with distance.
- The big counter ticks from 1 to the final day and `km` from 0 to the final distance from 0.0 to 3.5 s with `easeOutCubic`. At 3.5 s the number lands with a punch (scale 1 to 1.12 to 1) and the orange glow flares once: this is the hero moment. The rain on the bottom thins out from 2.0 s and the warm light grows from the right edge.
- 3.7 to 5.0: idle. The run cycle continues, footprints keep forming, rain on top keeps falling.

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
- [ ] The shoes are drawn as clear sneaker shapes, not blobs, and the seated figure has room around it.
- [ ] The run cycle loops cleanly every stride (feet never slide against the ground speed).

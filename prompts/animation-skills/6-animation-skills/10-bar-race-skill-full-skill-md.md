# /bar-race skill (full SKILL.md)

- **Category:** Animation skills
- **Tutorial:** 6 animation skills for Claude
- **Type:** skill
- **Description:** The whole /bar-race skill. Paste it into any chat as a prompt, or save it as a Claude skill.
- **Source:** https://learn.skaleout.com/skills

```text
---
name: bar-race
description: Use when the user types /bar-race or asks for a bar chart race, a ranking over time, "most X from year A to year B", or an animated leaderboard. Replies with one self-contained HTML file: a 5 second, 9:16 looping animation drawn on a canvas.
---

# /bar-race: a bar chart race that ends on an overtake

Example subject: "most visited cities 2000 to 2026". The user may give any ranking: richest companies, biggest languages, most streamed artists.

## The skill: /bar-race

### Look
- Ground: near black graphite `#0e0f12` with a faint vertical gradient to `#17181c`.
- Type: top left the title in weight 800 (about 84 px, white, for example `Most visited cities`), under it a sub line in weight 600 (34 px, 55 percent white, for example `Visitors per year, 2000 to 2026`). The big year bottom right in weight 800, about 300 px, in `#c9ccd3` at 90 percent, with a gentle drop shadow.
- Eight rows, each 105 px tall with 20 px gap, from about y = 360. Each row: a rounded 3 letter tag chip on the left (34 px mono text in a dark chip), then a bar whose length is the value, then the full name inside the bar start and the value at the end of the bar (`32.4M`, weight 800). Bars are neutral grey `#8a8f99` with a lighter top edge, except the winner, which turns orange `#ff8a3d`.
- A light axis at the top with 3 ticks and grid lines (`10M`, `20M`, `30M`) that slide and rescale as the maximum grows.

### Data
Make up 8 realistic entries and a yearly value series for each from the first year to the last (27 values for 2000 to 2026). Use your own knowledge for the shape of the story: the final year values should be real or very close, the first year order should be different, and one entry must climb from the middle of the pack to first place around 70 to 75 percent of the way through (that is the overtake). Interpolate between the yearly values with a smooth curve (not steps).

### Beats (seconds)
- 0.0: title, sub line, axis and all 8 rows already on screen at the first year's values, in grey. The first year shows big.
- 0.0 to 4.3: the year runs from the first to the last year at an even pace (about 0.16 s per year). The year text changes on whole years with a 6 px upward slide and a fade. Bar widths and value labels interpolate continuously. Rows re-rank by value: a row slides vertically to its new rank (`easeInOutCubic`, 0.27 s) the moment it passes another, and two crossing rows never overlap text. The axis rescales smoothly as the maximum grows.
- The hero moment, about 3.4 s: the climbing entry passes the leader and takes first place. Its bar turns orange (colour tween over 0.2 s with a brief brighter flash), a small `#1` badge pops next to its name (`easeOutBack`), and the year number punches (scale 1 to 1.1 to 1).
- 4.3 to 5.0: hold on the last year (the counter lands exactly on it). Idle: a shimmer travels across the orange bar, labels stay steady.

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
- [ ] The final year's order and values are the ones you intend, and the overtake happens once, near 3.4 s.
- [ ] Value labels never overlap the name or the edge of the canvas, even for the longest bar.
```

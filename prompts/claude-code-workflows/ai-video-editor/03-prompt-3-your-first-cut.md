# Prompt 3: your first cut

- **Category:** Claude Code workflows
- **Tutorial:** Your own AI video editor in Claude
- **Type:** prompt
- **Source:** https://learn.skaleout.com/setup

```text
Make a first cut of my video. This chat is open on my folder "my-edits", which holds "raw clips" (my footage), "references" (with STYLE.md, my style notes) and "renders" (where finished videos go). The tools are installed: FFmpeg (with ffprobe), Whisper (the "whisper" command, or whisper.cpp through "npx hyperframes transcribe"), HyperFrames and Remotion (both run with npx). Read references/STYLE.md first and follow it. If STYLE.md is missing, tell me to run prompt 2 first and stop.

What to edit:
- If I wrote an animation idea at the very end of this message, build that animation (see "If I described an animation" below).
- Otherwise take the newest video file in "raw clips" (the one changed most recently). If the folder is empty, tell me and stop. Never change or delete my original files: work on copies.

Steps for my video:
1. Check it with ffprobe: length, size, frame rate, rotation, audio.
2. Transcribe it with word timings: whisper "<file>" --model small --word_timestamps True --output_format json --output_dir renders/<name>-work (or npx hyperframes transcribe "<file>" if only whisper.cpp is installed). <name> is the file name without its extension.
3. Find what to cut: silences longer than about 0.4 seconds (FFmpeg silencedetect, about -35 dB) and false starts, where I start a sentence and then say it again. Keep the last, cleanest take of each line. Keep about 0.1 seconds of air around every cut so words are not clipped.
4. Write the plan to renders/<name>-work/cuts.md: each kept part with its start and end time and its words, and each removed part with the reason.
5. Cut the video with FFmpeg into renders/<name>-work/cut.mp4, then transcribe cut.mp4 again so the caption timings match the new edit.
6. Build the edit as a 1080x1920 (9:16) video at 30 fps with HyperFrames:
   npx hyperframes init renders/<name>-project --video renders/<name>-work/cut.mp4 --resolution portrait --non-interactive --skip-transcribe
   Read the AGENTS.md that init writes into the project, it lists the commands. If HyperFrames does not work, use Remotion instead: copy the "remotion-starter" folder to renders/<name>-project (if it is missing, run npx create-video@latest --yes --blank renders/<name>-project) and build the same edit there.
   - The video fills the frame. If it is not 9:16, crop it to fill (never squash it).
   - Word timed captions in the STYLE.md look: font, size, position, colours, words per caption, the way words appear. Use the timings from step 5. Keep captions inside the middle of the frame, away from the top and bottom edges where Instagram puts its buttons.
   - Motion from STYLE.md (punch-ins, zooms) only where it helps, and at the cut pace STYLE.md measured.
   - Music only from a file I put in "references/music" (mp3, wav or m4a). If there is one, play it under my voice about 18 dB quieter, fade it in and out, and end it with the video. If that folder is empty or missing, add no music and tell me so.
7. Render it to renders/<name>-first-cut.mp4. Check the file with ffprobe (1080x1920, 30 fps, sound) and look at 3 frames from it (start, middle, end) to make sure the captions are readable and nothing is cut off. Fix what is wrong and render again.

If I described an animation:
- Build it with HyperFrames as a 1080x1920 video at 30 fps in the STYLE.md colours and fonts. Length: what I wrote, or 10 seconds. Text on screen only if I asked for it. Music only from references/music, as above.
- Render it to renders/animation-first-cut.mp4 and check it the same way.

When the first cut is done:
- Tell me the file path, its length, and in one line each: what you cut, how the captions look, whether there is music.
- Then tell me: "Want changes? Tell me in plain words, for example: the hook needs more punch, make the captions bigger, cut the part about pricing, music quieter." For every change, edit the same project and render a new numbered file (first-cut-2.mp4, first-cut-3.mp4, ...). Never overwrite an earlier render.

My animation idea (leave empty to edit my newest video):
```

# Open Claude and let it set up the rest

- **Category:** Animation skills
- **Tutorial:** Claude can be your animation studio
- **Type:** prompt
- **Source:** https://learn.skaleout.com/draw

```text
Set up my computer for the animation skill. I just dropped animation-skill.zip in here. Check whether Node.js 18 or newer and ffmpeg are installed. If either is missing, install it without admin rights and without asking for my password: download the official Node.js build and a ready-made ffmpeg build into a folder called tools in my user folder, and make sure you and new Claude sessions can find them. Do not use Homebrew or anything that needs my password. Then install the skill from the zip where Claude Code finds skills (on a Mac ~/.claude/skills/animation/, on Windows %USERPROFILE%\.claude\skills\animation\, with SKILL.md directly in that folder). Finally check that Node.js and ffmpeg both work, tell me their versions and where the skill is, and if anything failed tell me exactly what to do.
```

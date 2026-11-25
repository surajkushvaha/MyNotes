# Prompt 1: Claude installs the five tools

- **Category:** Claude Code workflows
- **Tutorial:** Your own AI video editor in Claude
- **Type:** prompt
- **Source:** https://learn.skaleout.com/setup

```text
Set up this folder as my video editing workspace. This chat is open on my folder "my-edits". It should hold three folders: "raw clips", "references" and "renders". Create any of the three that are missing. Do not change or delete any other file on my computer.

Install these tools and check that each one works:
1. Node.js 22 or newer (HyperFrames needs 22 or newer, Remotion runs on it too)
2. Python 3
3. FFmpeg, including ffprobe
4. Whisper, OpenAI's free speech to text (the openai-whisper package). If it will not install, use whisper.cpp instead.
5. yt-dlp, the free video downloader
6. Remotion and HyperFrames, the two free tools that turn code into video, set up in this folder

How to work:
- First find out my operating system and its version, and which of these tools are already installed and which version. Show me a short table: tool, found or missing, version. Then list the exact commands you will run for the missing ones and wait for my OK.
- Never type or ask for my password. If a step needs an administrator password, stop, give me the one command to paste into my own Terminal window (Mac) or PowerShell window (Windows), say what it will ask me, and wait until I write "done".
- Install one tool at a time and check it right after by printing its version. If a step fails, read the error and try the fix the tool's official docs give. If it still fails, tell me in plain words what failed and what I can do, then go on with the next tool.

On a Mac:
- Use Homebrew. If the command "brew" is not found, ask me to install Homebrew myself by pasting this into the Terminal app (it asks for my Mac password once):
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  When it finishes it prints "Next steps" with one or two commands that add brew to the PATH. Tell me to run those too, then continue.
- Install only what is missing with: brew install node python ffmpeg yt-dlp openai-whisper
- If openai-whisper fails, run: brew install whisper.cpp
- Remotion needs macOS 15 (Sequoia) or newer. On an older macOS skip Remotion, tell me, and use HyperFrames alone.

On Windows:
- Use winget (it comes with Windows 10 and 11 as "App Installer"). If winget is missing, tell me to install "App Installer" from the Microsoft Store and wait.
- Install what is missing, one at a time, with: winget install --id <id> -e
  Node.js: OpenJS.NodeJS.LTS. Python: Python.Python.3.12. FFmpeg: Gyan.FFmpeg. yt-dlp: yt-dlp.yt-dlp.
  Windows may show a "Do you want to allow this app to make changes" box. I click Yes myself, so tell me when to expect it.
- Then Whisper: py -3.12 -m pip install -U openai-whisper
  If the "whisper" command is not found afterwards, use "py -3.12 -m whisper" instead.
- A tool installed a moment ago is often "not found" until the app restarts. If that happens, tell me to quit and reopen the Claude app, start a new local chat on this folder and paste this prompt again. It skips what is already installed.

Remotion and HyperFrames (Mac and Windows, run inside this folder):
- HyperFrames: run "npx hyperframes skills update" (this adds HyperFrames' own instructions for Claude), then "npx hyperframes doctor". Doctor checks Node.js, FFmpeg and Chrome. Fix every line it marks as failing with the hint it prints.
- Remotion: run "npx create-video@latest --yes --blank remotion-starter". This makes a folder "remotion-starter" with an empty Remotion project. Then, inside remotion-starter, run "npx remotion skills add".
- If npx asks "Ok to proceed? (y)", answer y.

Last check:
- Print a final checklist with one line per tool: name, version, OK or FAILED. For every FAILED line add one sentence on how I can fix it.
- Test Whisper without a real video: run its help command (whisper --help, or whisper-cli --help for whisper.cpp). Tell me that the first real transcription downloads a speech model once, so it takes longer.
- Then tell me: "Setup done. Start a new local chat on this folder and paste prompt 2." A new chat loads the instructions HyperFrames and Remotion just added.
```

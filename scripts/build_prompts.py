"""Turn the raw crawl of learn.skaleout.com into an organised prompt library.

Reads  raw/skaleout/*.html + raw/skaleout/variants.json
Writes prompts/<category>/<tutorial>/<NN-name>.md   one file per prompt
       prompts/<category>/README.md                 category overview
       prompts/README.md                            full table of contents
       prompts/prompts.json                         data for index.html

Run:  python3 scripts/build_prompts.py
"""
import json
import os
import re
import shutil

from bs4 import BeautifulSoup

RAW = os.path.join("raw", "skaleout")
OUT = "prompts"
BASE = "https://learn.skaleout.com"

CATEGORIES = {
    "animation-loops": {
        "name": "Animation loops",
        "description": "One prompt for Claude or ChatGPT that writes a looping 9:16 animation as a single HTML file. "
                       "Every tutorial has ten ready styles: pick one, copy, paste.",
    },
    "animation-skills": {
        "name": "Animation skills",
        "description": "Claude skills that turn one line into a finished animation, and the prompts to set them up.",
    },
    "image-generation": {
        "name": "Image generation",
        "description": "Prompts for ChatGPT image generation: study graphics and product posters.",
    },
    "claude-code-workflows": {
        "name": "Claude Code workflows",
        "description": "Prompts that make Claude Code set up tools, edit videos, publish websites and manage limits.",
    },
    "writing": {
        "name": "Writing",
        "description": "Make Claude's writing sound like a person wrote it.",
    },
}

# page path -> (category, tutorial slug)
PAGES = {
    "/video": ("animation-loops", "flying-whale"),
    "/video/fly": ("animation-loops", "what-if-you-could-fly"),
    "/video/car": ("animation-loops", "drift-on-a-cliff-road"),
    "/video/dragon": ("animation-loops", "baby-dragon"),
    "/styles": ("animation-loops", "one-ball-ten-styles"),
    "/animation-styles": ("animation-loops", "10-animation-styles"),
    "/skills": ("animation-skills", "6-animation-skills"),
    "/draw": ("animation-skills", "animation-studio-skill"),
    "/study": ("image-generation", "10-study-graphics"),
    "/poster": ("image-generation", "product-poster"),
    "/setup": ("claude-code-workflows", "ai-video-editor"),
    "/ship": ("claude-code-workflows", "put-a-site-online"),
    "/tools": ("claude-code-workflows", "3-tools-for-longer-limits"),
    "/tokens": ("claude-code-workflows", "apinex-setup"),
    "/human": ("writing", "write-like-a-human"),
}

NOTES = {
    "/tokens": "Third-party service (APInex), not Anthropic. Check who runs it and its terms before you give it an API key.",
}


ZIPS = os.path.join(RAW, "zips")

# Files inside the downloaded zips that add new text (the 6 single-skill zips on /skills
# repeat the SKILL.md text already on the page, so they are only copied, not listed twice).
# page path -> [(zip folder, file inside it, prompt name, description, kind)]
ZIP_PROMPTS = {
    "/draw": [
        ("draw__animation-skill", "animation/SKILL.md", "/animation skill (full SKILL.md)",
         "The skill inside animation-skill.zip: how Claude plans, draws, voices and renders the MP4.", "skill"),
        ("draw__animation-skill", "animation/README.md", "animation-skill.zip README",
         "Setup and usage notes that ship with the skill.", "doc"),
    ],
    "/poster": [
        ("poster__poster-prompt-skill", "poster-prompt/SKILL.md", "/poster-prompt skill (full SKILL.md)",
         "The skill inside poster-prompt-skill.zip: Claude picks the six fields and writes the poster prompt for you.",
         "skill"),
    ],
    "/human": [
        ("human__humanizer", "humanizer-main/SKILL.md", "Humanizer skill (full SKILL.md)",
         "The Humanizer skill by blader (MIT licence), from the GitHub zip the tutorial links to.", "skill"),
    ],
}

# Whole skill folders copied next to the prompts so they can be downloaded and installed.
# page path -> [(zip folder, sub folder or file inside it, target folder under skill-files/)]
ZIP_COPY = {
    "/draw": [("draw__animation-skill", "animation", "animation")],
    "/poster": [("poster__poster-prompt-skill", "poster-prompt", "poster-prompt")],
    "/skills": [("skills__motion-skills", n, n) for n in
                ("isometric", "globe", "scale", "bar-race", "versus", "zack-d-films")],
    "/human": [("human__humanizer", "humanizer-main/SKILL.md", "humanizer"),
               ("human__humanizer", "humanizer-main/LICENSE", "humanizer")],
}


def zip_downloads(path):
    """Original zip links for a page, from raw/skaleout/zips/_zips.json."""
    try:
        manifest = json.load(open(os.path.join(ZIPS, "_zips.json"), encoding="utf-8"))
    except FileNotFoundError:
        return []
    return [u for u, v in manifest.items() if v.get("page") == page_file(path)]


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]


def page_file(path: str) -> str:
    return path.strip("/").replace("/", "_") or "index"


def heading_before(el):
    h = el.find_previous(["h2", "h3", "h4"])
    return h.get_text(" ", strip=True) if h else ""


def first_sentence(text: str) -> str:
    m = re.match(r"(.+?[.?!])(\s|$)", text.strip())
    return (m.group(1) if m else text.strip())[:120]


def tidy(text: str) -> str:
    text = text.replace("\r\n", "\n").replace(" ", " ")
    return re.sub(r"\n{3,}", "\n\n", text).strip() + "\n"


def collect(path, soup, variants):
    """Return a list of prompt dicts for one page."""
    items = []
    url = BASE + path

    if url in variants:  # pages with a style / format picker
        chips = variants[url]["chips"]
        for chip in chips:
            for pid, text in chip["pres"].items():
                if path == "/animation-styles":
                    step = "1 Paint the still" if pid == "p1" else "2 Animate it"
                    name = f"{chip['label']} - {step}"
                    desc = f"Style: {chip['label']}. Step {step[0]} of 3: " + (
                        "paste in a new chat to paint the still picture." if pid == "p1"
                        else "paste in the same chat to bring the painting to life.")
                elif path == "/study":
                    name = chip["label"]
                    desc = f"Study graphic format: {chip['label']}. Replace the topic (how a rocket reaches orbit) with yours."
                else:
                    name = chip["label"]
                    desc = f"Style: {chip['label']}. Paste into a new Claude or ChatGPT chat."
                items.append({"name": name, "description": desc, "kind": "prompt", "text": text})
        if path == "/animation-styles":  # step 3: polish follow-ups
            for i in range(1, 7):
                el = soup.find(id=f"f{i}")
                if el:
                    t = el.get_text(" ", strip=True)
                    items.append({"name": f"Polish {i} - {first_sentence(t).rstrip('.')}",
                                  "description": "Step 3 follow-up: send in the same chat when you see this problem.",
                                  "kind": "prompt", "text": t})
        return items

    for pre in soup.find_all("pre"):
        pid = pre.get("id")
        if not pid:
            continue  # folder diagrams etc.
        text = pre.get_text()
        head = heading_before(pre)
        kind = "command" if text.strip().startswith(("/", "npx ")) and len(text) < 120 else "prompt"
        if path == "/skills":
            skill = pid.split("-", 1)[1]
            if pid.startswith("sk-"):
                name, desc, kind = f"/{skill} skill (full SKILL.md)", \
                    f"The whole /{skill} skill. Paste it into any chat as a prompt, or save it as a Claude skill.", "skill"
            else:
                name, desc, kind = f"/{skill} example", f"Example one-liner for the /{skill} skill.", "command"
        else:
            name = head or pid
            desc = ""
        items.append({"name": name, "description": desc, "kind": kind, "text": text})
    return items


def main():
    variants = json.load(open(os.path.join(RAW, "variants.json"), encoding="utf-8"))
    # tutorial titles as the site's home page lists them
    home = BeautifulSoup(open(os.path.join(RAW, "index.html"), encoding="utf-8").read(), "html.parser")
    cards = {a["href"]: a.find(["h2", "h3"]).get_text(" ", strip=True)
             for a in home.find_all("a", href=True) if a.find(["h2", "h3"])}
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    library = {"source": BASE, "categories": []}
    cat_index = {}
    for key, meta in CATEGORIES.items():
        c = {"id": key, "name": meta["name"], "description": meta["description"], "tutorials": []}
        library["categories"].append(c)
        cat_index[key] = c

    for path, (cat, tslug) in PAGES.items():
        soup = BeautifulSoup(open(os.path.join(RAW, page_file(path) + ".html"), encoding="utf-8").read(),
                             "html.parser")
        title = cards.get(path, soup.find("h1").get_text(" ", strip=True))
        md = soup.find("meta", attrs={"name": "description"})
        tdesc = md["content"] if md else ""
        items = collect(path, soup, variants)
        for zfolder, zfile, name, desc, kind in ZIP_PROMPTS.get(path, []):
            zp = os.path.join(ZIPS, zfolder, zfile)
            if os.path.exists(zp):
                items.append({"name": name, "description": desc, "kind": kind,
                              "text": open(zp, encoding="utf-8").read()})
        tdir = os.path.join(OUT, cat, tslug)
        os.makedirs(tdir, exist_ok=True)
        skill_files = []
        for zfolder, sub, target in ZIP_COPY.get(path, []):
            src = os.path.join(ZIPS, zfolder, sub)
            dst = os.path.join(tdir, "skill-files", target)
            if os.path.isdir(src):
                shutil.copytree(src, dst, dirs_exist_ok=True)
            elif os.path.isfile(src):
                os.makedirs(dst, exist_ok=True)
                shutil.copy2(src, dst)
            else:
                continue
            for root, _, files in os.walk(dst):
                skill_files += [os.path.join(root, f).replace(os.sep, "/") for f in sorted(files)]
        tut = {"id": tslug, "title": title, "description": tdesc, "url": BASE + path,
               "note": NOTES.get(path, ""), "downloads": zip_downloads(path),
               "skill_files": sorted(set(skill_files)), "prompts": []}
        for n, it in enumerate(items, 1):
            fname = f"{n:02d}-{slugify(it['name'])}.md"
            fpath = os.path.join(tdir, fname)
            body = tidy(it["text"])
            fence = "````" if "```" in body else "```"
            lines = [f"# {it['name']}", "",
                     f"- **Category:** {CATEGORIES[cat]['name']}",
                     f"- **Tutorial:** {title}",
                     f"- **Type:** {it['kind']}"]
            if it["description"]:
                lines.append(f"- **Description:** {it['description']}")
            lines += [f"- **Source:** {BASE + path}", "", f"{fence}text", body.rstrip("\n"), fence, ""]
            with open(fpath, "w", encoding="utf-8") as f:
                f.write("\n".join(lines))
            tut["prompts"].append({"name": it["name"], "description": it["description"], "kind": it["kind"],
                                   "file": fpath.replace(os.sep, "/"), "text": body})
        cat_index[cat]["tutorials"].append(tut)

    # READMEs
    total = 0
    toc = ["# Prompt library", "",
           f"Every prompt from [{BASE.split('//')[1]}]({BASE}), sorted by category. "
           "Open `index.html` (GitHub Pages) to search, filter and copy them.", ""]
    for c in library["categories"]:
        n = sum(len(t["prompts"]) for t in c["tutorials"])
        total += n
        toc += [f"## [{c['name']}]({c['id']}/README.md) ({n})", "", c["description"], ""]
        cr = [f"# {c['name']}", "", c["description"], ""]
        for t in c["tutorials"]:
            toc.append(f"- **{t['title']}** ({len(t['prompts'])}): {t['description']}")
            cr += [f"## {t['title']}", "", t["description"], "", f"Source: {t['url']}", ""]
            if t["note"]:
                cr += [f"> Note: {t['note']}", ""]
            for p in t["prompts"]:
                rel = os.path.relpath(p["file"], os.path.join(OUT, c["id"])).replace(os.sep, "/")
                cr.append(f"- [{p['name']}]({rel})" + (f": {p['description']}" if p["description"] else ""))
            cr.append("")
            if t["skill_files"]:
                cr.append("Skill files (unpacked from the zip downloads, ready to drop into `~/.claude/skills/`):")
                cr.append("")
                for sf in t["skill_files"]:
                    rel = os.path.relpath(sf, os.path.join(OUT, c["id"])).replace(os.sep, "/")
                    cr.append(f"- [{rel.split('skill-files/', 1)[1]}]({rel})")
                cr.append("")
            if t["downloads"]:
                cr.append("Original downloads: " + ", ".join(f"[{u.rsplit('/', 1)[1]}]({u})" for u in t["downloads"]))
                cr.append("")
        toc.append("")
        with open(os.path.join(OUT, c["id"], "README.md"), "w", encoding="utf-8") as f:
            f.write("\n".join(cr))
    toc.insert(4, f"**{total} prompts** in {len(library['categories'])} categories.\n")
    with open(os.path.join(OUT, "README.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(toc))
    with open(os.path.join(OUT, "prompts.json"), "w", encoding="utf-8") as f:
        json.dump(library, f, indent=1, ensure_ascii=False)
    print(f"{total} prompts written")


if __name__ == "__main__":
    main()

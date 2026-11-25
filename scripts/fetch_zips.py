"""Download every .zip linked from the crawled pages and unpack it.

Output: raw/skaleout/zips/<page>__<zip name>/...   (extracted files)
        raw/skaleout/zips/_zips.json                (zip url -> folder, file list)
"""
import io
import json
import os
import re
import urllib.request
import zipfile
from urllib.parse import urljoin, urlparse

RAW = os.path.join("raw", "skaleout")
OUT = os.path.join(RAW, "zips")
BASE = "https://learn.skaleout.com/"
MAX_FILE = 2_000_000  # skip big media files inside zips


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    found = {}
    for name in sorted(os.listdir(RAW)):
        if not name.endswith(".html"):
            continue
        page = name[:-5]
        html = open(os.path.join(RAW, name), encoding="utf-8").read()
        for href in re.findall(r'href="([^"]+\.zip)"', html):
            found.setdefault(urljoin(BASE, href), page)
    manifest = {}
    for url, page in found.items():
        folder = page + "__" + os.path.basename(urlparse(url).path)[:-4]
        if "github.com" in url:  # e.g. a GitHub repo archive
            folder = page + "__" + urlparse(url).path.strip("/").split("/")[1]
        dest = os.path.join(OUT, folder)
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            data = urllib.request.urlopen(req, timeout=60).read()
            files = []
            with zipfile.ZipFile(io.BytesIO(data)) as z:
                for info in z.infolist():
                    if info.is_dir() or info.file_size > MAX_FILE or "__MACOSX" in info.filename:
                        continue
                    target = os.path.normpath(os.path.join(dest, info.filename))
                    if not target.startswith(os.path.abspath(dest)) and not target.startswith(dest):
                        continue  # no path traversal
                    os.makedirs(os.path.dirname(target), exist_ok=True)
                    with open(target, "wb") as f:
                        f.write(z.read(info))
                    files.append(info.filename)
            manifest[url] = {"page": page, "folder": folder, "files": files}
            print(f"OK {url}: {len(files)} files")
        except Exception as e:
            manifest[url] = {"page": page, "error": str(e)}
            print(f"FAIL {url}: {e}")
    with open(os.path.join(OUT, "_zips.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=1)


if __name__ == "__main__":
    main()

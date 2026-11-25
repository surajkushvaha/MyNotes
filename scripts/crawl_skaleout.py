"""Crawl learn.skaleout.com with headless Chromium and save every page.

Runs inside GitHub Actions (.github/workflows/crawl-skaleout.yml).
Output: raw/skaleout/<slug>.html (rendered DOM) and <slug>.txt (visible text),
plus raw/skaleout/_index.json listing every crawled URL.
"""
import json
import os
import re
import sys
from collections import deque
from urllib.parse import urljoin, urldefrag, urlparse

from playwright.sync_api import sync_playwright

START = "https://learn.skaleout.com/"
HOST = urlparse(START).netloc
OUT = os.path.join("raw", "skaleout")
MAX_PAGES = int(os.environ.get("MAX_PAGES", "400"))
SKIP_EXT = re.compile(r"\.(png|jpe?g|gif|webp|svg|ico|mp4|webm|mp3|pdf|zip|css|js|woff2?|ttf)$", re.I)
# scripts are saved separately under raw/skaleout/assets/


def slug_for(url: str) -> str:
    path = urlparse(url).path.strip("/") or "index"
    q = urlparse(url).query
    s = re.sub(r"[^A-Za-z0-9._-]+", "_", path + ("_" + q if q else ""))
    return s[:150]


def main() -> int:
    os.makedirs(OUT, exist_ok=True)
    seen, queue, index, assets = set(), deque([START]), [], set()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36")
        while queue and len(seen) < MAX_PAGES:
            url = queue.popleft()
            if url in seen:
                continue
            seen.add(url)
            try:
                resp = page.goto(url, wait_until="networkidle", timeout=45000)
                page.wait_for_timeout(1000)
                # expand any <details> / accordions so hidden prompt text is in the DOM text
                page.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")
                html = page.content()
                text = page.inner_text("body")
                links = page.eval_on_selector_all("a[href]", "els => els.map(e => e.href)")
                scripts = page.eval_on_selector_all("script[src]", "els => els.map(e => e.src)")
                for src in scripts:
                    su = urlparse(src)
                    if su.netloc == HOST and src not in assets:
                        assets.add(src)
                        try:
                            body = page.request.get(src).text()
                            ap = os.path.join(OUT, "assets", su.path.strip("/").replace("/", "__"))
                            os.makedirs(os.path.dirname(ap), exist_ok=True)
                            with open(ap, "w", encoding="utf-8") as f:
                                f.write(body)
                            print(f"ASSET {src}")
                        except Exception as e:
                            print(f"FAIL asset {src}: {e}", file=sys.stderr)
            except Exception as e:  # keep crawling on single-page failures
                print(f"FAIL {url}: {e}", file=sys.stderr)
                index.append({"url": url, "error": str(e)})
                continue
            slug = slug_for(url)
            with open(os.path.join(OUT, slug + ".html"), "w", encoding="utf-8") as f:
                f.write(html)
            with open(os.path.join(OUT, slug + ".txt"), "w", encoding="utf-8") as f:
                f.write(text)
            index.append({"url": url, "slug": slug, "status": resp.status if resp else None,
                          "title": page.title()})
            print(f"OK {len(seen)} {url}")
            for href in links:
                href = urldefrag(urljoin(url, href))[0]
                u = urlparse(href)
                if u.scheme in ("http", "https") and u.netloc == HOST and not SKIP_EXT.search(u.path):
                    if href not in seen:
                        queue.append(href)
        browser.close()
    with open(os.path.join(OUT, "_index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, indent=1)
    print(f"Crawled {len(index)} pages")
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""For every crawled page that has a style/format picker (#chips .chip), click each
chip and record the text of every prompt block (<pre id=...>) it produces.

Output: raw/skaleout/variants.json
  { url: { "chips": [ {"label": ..., "pres": {pre_id: text}} ... ] } }
"""
import json
import os

from playwright.sync_api import sync_playwright

OUT = os.path.join("raw", "skaleout")


def main() -> None:
    index = json.load(open(os.path.join(OUT, "_index.json"), encoding="utf-8"))
    urls = [x["url"] for x in index if "slug" in x and not x["url"].endswith(".txt")]
    result = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        for url in urls:
            page.goto(url, wait_until="networkidle", timeout=45000)
            chips = page.query_selector_all("#chips .chip")
            if not chips:
                continue
            entries = []
            for i in range(len(chips)):
                chip = page.query_selector_all("#chips .chip")[i]
                if chip.get_attribute("data-own") == "true":
                    continue
                label = chip.inner_text().strip()
                chip.click()
                page.wait_for_timeout(250)
                pres = page.eval_on_selector_all(
                    "pre[id]", "els => Object.fromEntries(els.map(e => [e.id, e.innerText]))")
                entries.append({"label": label, "pres": pres})
            result[url] = {"chips": entries}
            print(f"{url}: {len(entries)} variants")
        browser.close()
    with open(os.path.join(OUT, "variants.json"), "w", encoding="utf-8") as f:
        json.dump(result, f, indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()

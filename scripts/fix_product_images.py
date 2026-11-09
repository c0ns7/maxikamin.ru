# -*- coding: utf-8 -*-
"""Re-download Madeira + Dantex/Brunner/AVES images with working URLs."""
from __future__ import annotations

import re
import time
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA_TS = ROOT / "src" / "lib" / "data.ts"
OUT = ROOT / "public" / "images" / "catalog"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read().decode("utf-8", "replace")


def download(url: str, dest: Path) -> Path | None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    headers = {"User-Agent": UA, "Referer": f"{urlparse(url).scheme}://{urlparse(url).netloc}/"}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=35) as r:
            data = r.read()
            ctype = r.headers.get("Content-Type", "")
        if len(data) < 1200:
            return None
        out = dest
        if "webp" in ctype:
            out = dest.with_suffix(".webp")
        elif "png" in ctype:
            out = dest.with_suffix(".png")
        out.write_bytes(data)
        return out
    except Exception as e:
        print("  fail", url[:80], e)
        return None


def norm(s: str) -> str:
    s = s.lower().replace("ё", "е").replace("chokolate", "chocolate").replace("gialo", "giallo")
    return re.sub(r"[^a-zа-я0-9]+", " ", s).strip()


def tokens(s: str) -> set[str]:
    stop = {"топка", "каминная", "портал", "облицовка", "печь", "камин", "madeira", "la", "nordica", "solzaima", "mcz", "пристенная", "угловая"}
    return {t for t in norm(s).split() if len(t) > 2 and t not in stop}


def score(a: str, b: str) -> float:
    ta, tb = tokens(a), tokens(b)
    if not ta or not tb:
        na, nb = norm(a), norm(b)
        if na in nb or nb in na:
            return 0.55
        return 0.0
    inter = len(ta & tb)
    return inter / max(len(ta), len(tb) * 0.85) if inter else 0.0


def parse_products():
    text = DATA_TS.read_text(encoding="utf-8")
    return [
        {"id": m.group(1), "name": m.group(2), "brand": m.group(3)}
        for m in re.finditer(
            r'id:\s*"(\d+)",\s*name:\s*"([^"]+)",\s*brand:\s*"([^"]+)"',
            text,
        )
    ]


def parse_mos(html: str, base: str = "") -> list[tuple[str, str]]:
    pairs = []
    for chunk in re.split(r'class="[^"]*product-layout', html)[1:]:
        name_m = re.search(r'class="name"[^>]*>\s*<a[^>]+>([^<]+)</a>', chunk)
        img_m = re.search(
            r'(?:data-src|src)="(https://mos-camin\.ru/image/cache/catalog/[^"]+\.(?:jpg|jpeg|png|webp))"',
            chunk,
            re.I,
        )
        if name_m and img_m and "transparent" not in img_m.group(1):
            pairs.append((re.sub(r"\s+", " ", name_m.group(1)).strip(), img_m.group(1)))
    return pairs


def parse_dantex(html: str, base: str) -> list[tuple[str, str]]:
    pairs = []
    # h3 title then pic img
    for m in re.finditer(
        r"<h3>\s*<a[^>]+>([^<]+)</a>\s*</h3>[\s\S]{0,500}?<img[^>]+src=\"(/upload/iblock/[^\"]+)\"",
        html,
        re.I,
    ):
        pairs.append((re.sub(r"\s+", " ", m.group(1)).strip(), urljoin(base, m.group(2))))
    if len(pairs) < 5:
        for m in re.finditer(
            r'<img[^>]+src="(/upload/iblock/[^"]+)"[^>]*>[\s\S]{0,700}?<a[^>]+href="/catalog/[^"]+"[^>]*>([^<]{5,140})</a>',
            html,
            re.I,
        ):
            pairs.append((re.sub(r"\s+", " ", m.group(2)).strip(), urljoin(base, m.group(1))))
    return pairs


def parse_brunner(html: str, base: str) -> list[tuple[str, str]]:
    pairs = []
    for m in re.finditer(
        r"<h3[^>]*>\s*([^<]{5,120})\s*</h3>[\s\S]{0,1200}?<img[^>]+src=\"([^\"]+\.(?:jpg|jpeg|png|webp))\"",
        html,
        re.I,
    ):
        img = m.group(2)
        if img.startswith("/"):
            img = urljoin(base, img)
        pairs.append((re.sub(r"\s+", " ", m.group(1)).strip(), img))
    for m in re.finditer(
        r'src="([^"]+/uploads/[^"]+\.(?:jpg|jpeg|png|webp))"[^>]*alt="([^"]*)"',
        html,
        re.I,
    ):
        img = m.group(1)
        if img.startswith("/"):
            img = urljoin(base, img)
        alt = m.group(2).strip() or Path(urlparse(img).path).stem
        pairs.append((alt, img))
    return pairs


def parse_generic_catalog(html: str, base: str) -> list[tuple[str, str]]:
    pairs = []
    for m in re.finditer(
        r'alt="([^"]{4,120})"[^>]{0,80}src="([^"]+\.(?:jpg|jpeg|png|webp))"',
        html,
        re.I,
    ):
        img = m.group(2)
        if img.startswith("/"):
            img = urljoin(base, img)
        if any(x in img.lower() for x in ("logo", "icon", "sprite")):
            continue
        pairs.append((re.sub(r"\s+", " ", m.group(1)).strip(), img))
    return pairs


SOURCES = [
    ("Madeira", "https://mos-camin.ru/kaminy/kaminnye-oblicovki/kaminnye-oblicovki-madeira/", parse_mos),
    ("Madeira", "https://mos-camin.ru/kaminy/kaminnye-portaly/", parse_mos),
    ("La Nordica", "https://dantexgroup.ru/catalog/kaminy/drovyanye-kaminy/pechi/la-nordica/", parse_dantex),
    ("Solzaima", "https://dantexgroup.ru/catalog/kaminy/drovyanye-kaminy/pechi/solzaima/", parse_dantex),
    ("MCZ", "https://dantexgroup.ru/catalog/kaminy/drovyanye-kaminy/kaminnye-topki/mcz/", parse_dantex),
    ("Brunner", "https://brunner.ru/kaminnye-topki-brunner/", parse_brunner),
    ("AVES", "https://aves.ru/catalog/", parse_generic_catalog),
    ("Schmid", "https://www.schmid.de/ru/produkte/kamineinsaetze/", parse_generic_catalog),
]


def main():
    scraped: dict[str, list[tuple[str, str]]] = {}
    for brand, url, parser in SOURCES:
        print("FETCH", brand, url)
        try:
            html = fetch(url)
            pairs = parser(html, url)
            scraped.setdefault(brand, []).extend(pairs)
            print(" ->", len(pairs))
        except Exception as e:
            print(" !!", e)
        time.sleep(0.4)

    products = [p for p in parse_products() if p["brand"] in scraped]
    updates = {}
    for p in products:
        best = None
        best_sc = 0.0
        for name, img in scraped.get(p["brand"], []):
            sc = score(p["name"], name)
            if sc > best_sc:
                best_sc, best = sc, (name, img)
        # also match model codes in slug-ish names
        if (not best or best_sc < 0.35) and p["brand"] in ("La Nordica", "Solzaima", "MCZ", "Brunner"):
            for name, img in scraped.get(p["brand"], []):
                sc = score(p["name"], name)
                # boost if key model word present
                for tok in tokens(p["name"]):
                    if tok in norm(name) and len(tok) > 3:
                        sc = max(sc, 0.45)
                if sc > best_sc:
                    best_sc, best = sc, (name, img)
        if not best or best_sc < 0.32:
            continue
        brand_dir = re.sub(r"[^\w]+", "-", p["brand"].lower()).strip("-")
        dest = OUT / brand_dir / f"{p['id']}.jpg"
        saved = download(best[1], dest)
        if saved:
            rel = "/" + saved.relative_to(ROOT / "public").as_posix()
            updates[p["id"]] = rel
            print(f"OK #{p['id']} {best_sc:.2f} {p['name'][:45]}")
        time.sleep(0.05)

    # pool leftover for brand products still on granite/hero/pool-cycling
    text = DATA_TS.read_text(encoding="utf-8")
    for brand, items in scraped.items():
        brand_dir = re.sub(r"[^\w]+", "-", brand.lower()).strip("-")
        pool_paths = []
        for i, (name, img) in enumerate(items[:30]):
            dest = OUT / brand_dir / f"fix-{i}.jpg"
            saved = download(img, dest)
            if saved:
                pool_paths.append("/" + saved.relative_to(ROOT / "public").as_posix())
        # assign pool to products of brand without good unique image
        brand_products = [p for p in parse_products() if p["brand"] == brand]
        for i, p in enumerate(brand_products):
            if p["id"] in updates:
                continue
            if not pool_paths:
                break
            # if current image is pool cycling or placeholder
            m = re.search(rf'id:\s*"{p["id"]}",[\s\S]*?image:\s*"([^"]+)"', text)
            cur = m.group(1) if m else ""
            if "/catalog/" in cur and f"/{p['id']}." in cur:
                continue
            updates[p["id"]] = pool_paths[i % len(pool_paths)]
            print(f"POOL #{p['id']} {p['name'][:45]}")

    for pid, path in updates.items():
        text, n = re.subn(
            rf'(id:\s*"{pid}",[\s\S]*?image:\s*")([^"]+)(")',
            rf"\1{path}\3",
            text,
            count=1,
        )
    DATA_TS.write_text(text, encoding="utf-8")
    print("Updated", len(updates))


if __name__ == "__main__":
    main()

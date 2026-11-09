# -*- coding: utf-8 -*-
"""
Scrape product images from supplier catalogs, download locally,
and rewrite image paths in src/lib/data.ts
"""
from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA_TS = ROOT / "src" / "lib" / "data.ts"
OUT_DIR = ROOT / "public" / "images" / "catalog"
MAP_JSON = ROOT / "scripts" / "product_image_map.json"

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)

SOURCES = [
    {
        "brand": "Madeira",
        "url": "https://mos-camin.ru/kaminy/kaminnye-oblicovki/kaminnye-oblicovki-madeira/",
        "parser": "mos_camin",
    },
    {
        "brand": "Madeira",
        "url": "https://mos-camin.ru/kaminy/kaminnye-portaly/",
        "parser": "mos_camin",
    },
    {
        "brand": "Экокамин",
        "url": "https://www.ecokamin.ru/catalog/kaminnye_topki/",
        "parser": "ecokamin",
    },
    {
        "brand": "Экокамин",
        "url": "https://www.ecokamin.ru/catalog/pechi_kaminy/",
        "parser": "ecokamin",
    },
    {
        "brand": "Экокамин",
        "url": "https://www.ecokamin.ru/catalog/kaminy/",
        "parser": "ecokamin",
    },
    {
        "brand": "Kratki",
        "url": "https://belfortkamin.ru/category/fire-chambers/?proizvoditel=2780",
        "parser": "belfort",
    },
    {
        "brand": "Kratki",
        "url": "https://belfortkamin.ru/category/Pechi-kaminy-kaminokomlekty/?proizvoditel=2780",
        "parser": "belfort",
    },
    {
        "brand": "Kratki",
        "url": "https://belfortkamin.ru/category/biokaminy/",
        "parser": "belfort",
    },
    {
        "brand": "Kratki",
        "url": "https://belfortkamin.ru/category/gazovye-topki/?proizvoditel=2780",
        "parser": "belfort",
    },
    {
        "brand": "ABX",
        "url": "https://belfortkamin.ru/category/fire-chambers/?proizvoditel=6",
        "parser": "belfort",
    },
    {
        "brand": "ABX",
        "url": "https://belfortkamin.ru/category/Pechi-kaminy-kaminokomlekty/?proizvoditel=6",
        "parser": "belfort",
    },
    {
        "brand": "IldNord",
        "url": "https://belfortkamin.ru/category/fire-chambers/?proizvoditel=10746",
        "parser": "belfort",
    },
    {
        "brand": "IldNord",
        "url": "https://belfortkamin.ru/category/Pechi-kaminy-kaminokomlekty/?proizvoditel=10746",
        "parser": "belfort",
    },
    {
        "brand": "FireBird",
        "url": "https://belfortkamin.ru/category/fire-chambers/?proizvoditel=1710",
        "parser": "belfort",
    },
    {
        "brand": "FireBird",
        "url": "https://belfortkamin.ru/category/Pechi-kaminy-kaminokomlekty/?proizvoditel=1710",
        "parser": "belfort",
    },
    {
        "brand": "FireBird",
        "url": "https://belfortkamin.ru/category/biokaminy/?proizvoditel=1710",
        "parser": "belfort",
    },
    {
        "brand": "La Nordica",
        "url": "https://dantexgroup.ru/catalog/kaminy/drovyanye-kaminy/pechi/la-nordica/",
        "parser": "dantex",
    },
    {
        "brand": "Solzaima",
        "url": "https://dantexgroup.ru/catalog/kaminy/drovyanye-kaminy/pechi/solzaima/",
        "parser": "dantex",
    },
    {
        "brand": "MCZ",
        "url": "https://dantexgroup.ru/catalog/kaminy/drovyanye-kaminy/kaminnye-topki/mcz/",
        "parser": "dantex",
    },
    {
        "brand": "Brunner",
        "url": "https://brunner.ru/kaminnye-topki-brunner/",
        "parser": "brunner",
    },
    {
        "brand": "Hoxter",
        "url": "https://www.mokadom.ru/Producers/Hoxter/",
        "parser": "hoxter",
    },
    {
        "brand": "AVES",
        "url": "https://aves.ru/catalog/",
        "parser": "aves",
    },
    {
        "brand": "Феникс",
        "url": "https://fluesystems.ru/katalog/",
        "parser": "fenik",
    },
]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "ru-RU,ru;q=0.9"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return resp.read().decode("utf-8", "replace")


def slugify(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[\s_]+", "-", s)
    return s[:80] or "item"


def normalize_name(s: str) -> str:
    s = s.lower().replace("ё", "е")
    s = s.replace("chokolate", "chocolate").replace("gialo", "giallo")
    s = re.sub(r"[^a-zа-я0-9]+", " ", s, flags=re.IGNORECASE)
    return re.sub(r"\s+", " ", s).strip()


def enlarge_mos(url: str) -> str:
    # Prefer larger cache or original
    u = re.sub(r"-\d+x\d+[wh]?\.(jpg|jpeg|png|webp)$", r".\1", url, flags=re.I)
    u = u.replace("/image/cache/catalog/", "/image/catalog/")
    return u


def parse_mos_camin(html: str, base: str) -> list[tuple[str, str]]:
    pairs: list[tuple[str, str]] = []
    # product-layout chunks
    for chunk in re.split(r'class="[^"]*product-layout', html)[1:]:
        name_m = re.search(
            r'class="name"[^>]*>\s*<a[^>]+>([^<]+)</a>',
            chunk,
            re.I,
        )
        if not name_m:
            name_m = re.search(r'title="([^"]+)"', chunk)
        img_m = re.search(
            r'(?:data-src|src)="(https?://[^"]+/image/(?:cache/)?catalog/[^"]+\.(?:jpg|jpeg|png|webp))"',
            chunk,
            re.I,
        )
        if name_m and img_m:
            name = re.sub(r"\s+", " ", name_m.group(1)).strip()
            img = enlarge_mos(img_m.group(1))
            if "transparent" not in img and "journal3/categories" not in img:
                pairs.append((name, img))
    # fallback pairs
    if len(pairs) < 5:
        for m in re.finditer(
            r'data-src="(https://mos-camin\.ru/image/cache/catalog/[^"]+)"[\s\S]{0,900}?class="name"[^>]*>\s*<a[^>]+>([^<]+)</a>',
            html,
            re.I,
        ):
            pairs.append((re.sub(r"\s+", " ", m.group(2)).strip(), enlarge_mos(m.group(1))))
    return pairs


def parse_ecokamin(html: str, base: str) -> list[tuple[str, str]]:
    pairs = []
    # Bitrix catalog items
    for chunk in re.split(r'class="[^"]*(?:product-item|catalog-item|bx_catalog)[^"]*"', html, flags=re.I)[1:]:
        name_m = re.search(r'(?:product-item-title|item-title|product-title)[^>]*>[\s\S]*?>([^<]{5,160})<', chunk, re.I)
        if not name_m:
            name_m = re.search(r'title="([^"]{5,160})"', chunk)
        img_m = re.search(
            r'(?:data-src|src)="((?:https?:)?//[^"]+\.(?:jpg|jpeg|png|webp)|/upload/[^"]+\.(?:jpg|jpeg|png|webp))"',
            chunk,
            re.I,
        )
        if name_m and img_m:
            img = img_m.group(1)
            if img.startswith("//"):
                img = "https:" + img
            elif img.startswith("/"):
                img = urljoin(base, img)
            name = re.sub(r"\s+", " ", name_m.group(1)).strip()
            if "logo" not in img.lower():
                pairs.append((name, img))
    # broader: title near upload images
    if len(pairs) < 5:
        for m in re.finditer(
            r'(?:data-src|src)="(/upload/[^"]+\.(?:jpg|jpeg|png|webp))"[^>]{0,200}alt="([^"]{5,160})"',
            html,
            re.I,
        ):
            pairs.append((re.sub(r"\s+", " ", m.group(2)).strip(), urljoin(base, m.group(1))))
        for m in re.finditer(
            r'alt="([^"]{5,160})"[^>]{0,120}(?:data-src|src)="(/upload/[^"]+\.(?:jpg|jpeg|png|webp))"',
            html,
            re.I,
        ):
            pairs.append((re.sub(r"\s+", " ", m.group(1)).strip(), urljoin(base, m.group(2))))
    return pairs


def parse_belfort(html: str, base: str) -> list[tuple[str, str]]:
    pairs = []
    for chunk in re.split(r'class="[^"]*product(?:-item|-card|_item)?[^"]*"', html, flags=re.I)[1:]:
        name_m = re.search(r'<a[^>]+class="[^"]*title[^"]*"[^>]*>([^<]{3,160})</a>', chunk, re.I)
        if not name_m:
            name_m = re.search(r'<h[23][^>]*>\s*<a[^>]+>([^<]{3,160})</a>', chunk, re.I)
        if not name_m:
            name_m = re.search(r'title="([^"]{3,160})"', chunk)
        img_m = re.search(
            r'(?:data-src|src)="((?:https?:)?(?://)?[^"]+\.(?:jpg|jpeg|png|webp))"',
            chunk,
            re.I,
        )
        if name_m and img_m:
            img = img_m.group(1)
            if img.startswith("//"):
                img = "https:" + img
            elif img.startswith("/"):
                img = urljoin(base, img)
            name = re.sub(r"\s+", " ", name_m.group(1)).strip()
            if all(x not in img.lower() for x in ("logo", "icon", "brand", "abx.png")):
                pairs.append((name, img))
    # fallback: product links with images in listing
    if len(pairs) < 5:
        for m in re.finditer(
            r'<img[^>]+(?:data-src|src)="([^"]+\.(?:jpg|jpeg|png|webp))"[^>]*>[\s\S]{0,600}?<a[^>]+href="[^"]*(?:product|item)[^"]*"[^>]*>([^<]{3,160})</a>',
            html,
            re.I,
        ):
            img = m.group(1)
            if img.startswith("/"):
                img = urljoin(base, img)
            pairs.append((re.sub(r"\s+", " ", m.group(2)).strip(), img))
    return pairs


def parse_dantex(html: str, base: str) -> list[tuple[str, str]]:
    pairs = []
    for m in re.finditer(r"###\s+(.+?)\n", html):
        # markdown from webfetch won't be here — raw HTML
        pass
    # HTML cards
    for chunk in re.split(r'class="[^"]*(?:catalog-item|product-item|product-card|goods-item)[^"]*"', html, flags=re.I)[1:]:
        name_m = re.search(r'<a[^>]+>([^<]{5,180})</a>', chunk)
        img_m = re.search(
            r'(?:data-src|src)="((?:https?:)?(?://)?[^"]+\.(?:jpg|jpeg|png|webp)|/[^"]+\.(?:jpg|jpeg|png|webp))"',
            chunk,
            re.I,
        )
        if name_m and img_m:
            img = img_m.group(1)
            if img.startswith("//"):
                img = "https:" + img
            elif img.startswith("/"):
                img = urljoin(base, img)
            pairs.append((re.sub(r"\s+", " ", name_m.group(1)).strip(), img))
    if len(pairs) < 3:
        for m in re.finditer(
            r'alt="([^"]{5,180})"[^>]+src="([^"]+\.(?:jpg|jpeg|png|webp))"',
            html,
            re.I,
        ):
            name, img = m.group(1), m.group(2)
            if img.startswith("/"):
                img = urljoin(base, img)
            if "logo" not in img.lower() and "og-image" not in img.lower():
                pairs.append((re.sub(r"\s+", " ", name).strip(), img))
    return pairs


def parse_brunner(html: str, base: str) -> list[tuple[str, str]]:
    pairs = []
    for m in re.finditer(
        r'<img[^>]+src="([^"]+\.(?:jpg|jpeg|png|webp))"[^>]*(?:alt="([^"]*)")?',
        html,
        re.I,
    ):
        img, alt = m.group(1), m.group(2) or ""
        if img.startswith("/"):
            img = urljoin(base, img)
        if "uploads" in img and ("bkh" in img.lower() or "stil" in img.lower() or "urfeuer" in img.lower() or "brunner" in img.lower() or alt):
            name = alt.strip() or Path(urlparse(img).path).stem
            pairs.append((name, img))
    # headings near images
    for m in re.finditer(
        r'<h3[^>]*>([^<]{5,120})</h3>[\s\S]{0,800}?<img[^>]+src="([^"]+\.(?:jpg|jpeg|png|webp))"',
        html,
        re.I,
    ):
        img = m.group(2)
        if img.startswith("/"):
            img = urljoin(base, img)
        pairs.append((re.sub(r"\s+", " ", m.group(1)).strip(), img))
    return pairs


def parse_hoxter(html: str, base: str) -> list[tuple[str, str]]:
    pairs = []
    for m in re.finditer(
        r'<a[^>]+href="([^"]+)"[^>]*>\s*(?:<img[^>]+src="([^"]+\.(?:jpg|jpeg|png|webp))"[^>]*>)?\s*([^<]*Hoxter[^<]*)',
        html,
        re.I,
    ):
        href, img, name = m.group(1), m.group(2), re.sub(r"\s+", " ", m.group(3)).strip()
        if not img:
            continue
        if img.startswith("/"):
            img = urljoin(base, img)
        pairs.append((name or Path(urlparse(img).path).stem, img))
    for m in re.finditer(
        r'(Каминная топка Hoxter[^<]{0,80})[\s\S]{0,400}?src="([^"]+\.(?:jpg|jpeg|png|webp))"',
        html,
        re.I,
    ):
        img = m.group(2)
        if img.startswith("/"):
            img = urljoin(base, img)
        pairs.append((re.sub(r"\s+", " ", m.group(1)).strip(), img))
    # producer gallery
    for m in re.finditer(
        r'src="((?:https?:)?(?://)?[^"]*(?:Hoxter|hoxter|Producer)[^"]*\.(?:jpg|jpeg|png|webp))"',
        html,
        re.I,
    ):
        img = m.group(1)
        if img.startswith("//"):
            img = "https:" + img
        elif img.startswith("/"):
            img = urljoin(base, img)
        pairs.append((Path(urlparse(img).path).stem, img))
    return pairs


def parse_aves(html: str, base: str) -> list[tuple[str, str]]:
    return parse_dantex(html, base)  # similar card markup often


def parse_fenik(html: str, base: str) -> list[tuple[str, str]]:
    pairs = []
    for m in re.finditer(
        r'src="([^"]+\.(?:jpg|jpeg|png|webp))"[^>]*(?:alt="([^"]*)")?',
        html,
        re.I,
    ):
        img, alt = m.group(1), m.group(2) or ""
        if img.startswith("/"):
            img = urljoin(base, img)
        if any(k in img.lower() for k in ("katalog", "catalog", "dymah", "chimney", "pipe", "product", "upload")):
            pairs.append((alt.strip() or Path(urlparse(img).path).stem, img))
    return pairs


PARSERS = {
    "mos_camin": parse_mos_camin,
    "ecokamin": parse_ecokamin,
    "belfort": parse_belfort,
    "dantex": parse_dantex,
    "brunner": parse_brunner,
    "hoxter": parse_hoxter,
    "aves": parse_aves,
    "fenik": parse_fenik,
}


def download(url: str, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 2000:
        return True
    headers = {"User-Agent": UA, "Referer": f"{urlparse(url).scheme}://{urlparse(url).netloc}/"}
    candidates = [url]
    # mos-camin enlarge fallbacks
    if "mos-camin.ru" in url:
        candidates = [
            enlarge_mos(url),
            re.sub(r"-\d+x\d+[wh]?", "-500x500", url),
            re.sub(r"-\d+x\d+[wh]?", "-800x800", url),
            url,
        ]
    for cand in candidates:
        try:
            req = urllib.request.Request(cand, headers=headers)
            with urllib.request.urlopen(req, timeout=40) as resp:
                data = resp.read()
                ctype = resp.headers.get("Content-Type", "")
            if len(data) < 1500:
                continue
            out = dest
            if "png" in ctype and out.suffix.lower() != ".png":
                out = out.with_suffix(".png")
            elif "webp" in ctype and out.suffix.lower() != ".webp":
                out = out.with_suffix(".webp")
            out.write_bytes(data)
            if out != dest and dest.exists():
                dest.unlink(missing_ok=True)
            # normalize caller path via rename if needed
            if out != dest:
                dest = out
            return True
        except Exception:
            continue
    return False


def token_set(s: str) -> set[str]:
    stop = {
        "топка",
        "каминная",
        "каминный",
        "портал",
        "облицовка",
        "печь",
        "камин",
        "madeira",
        "kratki",
        "abx",
        "ildnord",
        "firebird",
        "экокамин",
        "la",
        "nordica",
        "solzaima",
        "mcz",
        "brunner",
        "hoxter",
        "пристенная",
        "угловая",
        "для",
        "из",
        "с",
        "и",
        "на",
        "the",
        "tuv",
    }
    return {t for t in normalize_name(s).split() if len(t) > 2 and t not in stop}


def score_match(product_name: str, scraped_name: str) -> float:
    a = token_set(product_name)
    b = token_set(scraped_name)
    if not a or not b:
        return 0.0
    inter = len(a & b)
    if inter == 0:
        # substring fallback for model codes
        pn = normalize_name(product_name)
        sn = normalize_name(scraped_name)
        if sn and sn in pn:
            return 0.55
        if pn and pn in sn:
            return 0.5
        return 0.0
    return inter / max(len(a), len(b) * 0.85)


def parse_products_from_ts() -> list[dict]:
    text = DATA_TS.read_text(encoding="utf-8")
    products = []
    for m in re.finditer(
        r'id:\s*"(\d+)",\s*name:\s*"([^"]+)",\s*brand:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*price:\s*(\d+),\s*image:\s*"([^"]+)"',
        text,
    ):
        products.append(
            {
                "id": m.group(1),
                "name": m.group(2),
                "brand": m.group(3),
                "category": m.group(4),
                "price": int(m.group(5)),
                "image": m.group(6),
            }
        )
    return products


def main():
    scraped: dict[str, list[tuple[str, str]]] = {}
    for src in SOURCES:
        brand = src["brand"]
        url = src["url"]
        parser = PARSERS[src["parser"]]
        print(f"FETCH {brand}: {url}")
        try:
            html = fetch(url)
            pairs = parser(html, url)
            # dedupe by name
            seen = set()
            clean = []
            for name, img in pairs:
                key = normalize_name(name)
                if key in seen or not name:
                    continue
                seen.add(key)
                clean.append((name, img))
            scraped.setdefault(brand, []).extend(clean)
            print(f"  -> {len(clean)} items")
        except Exception as e:
            print(f"  !! fail: {e}")
        time.sleep(0.6)

    # save scrape dump
    dump = {b: [{"name": n, "img": i} for n, i in items] for b, items in scraped.items()}
    MAP_JSON.write_text(json.dumps(dump, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Scraped brands:", {b: len(v) for b, v in scraped.items()})

    products = parse_products_from_ts()
    print("Products in data.ts:", len(products))

    # granite keep local
    granite_map = {
        "плитка": "/images/granite/products/tile-sample.jpg",
        "брусчатка": "/images/granite/products/paver-closeup.jpg",
        "подоконник": "/images/granite/products/tile-sample.jpg",
        "ступени": "/images/granite/production/warehouse-steps.jpg",
        "столешница": "/images/granite/products/slab-polished.jpg",
        "входная": "/images/granite/production/yard-curbs.jpg",
    }

    updates: dict[str, str] = {}  # id -> local path
    unmatched = []

    for p in products:
        if p["brand"] == "Елизаветинский":
            nl = p["name"].lower()
            for key, path in granite_map.items():
                if key in nl:
                    updates[p["id"]] = path
                    break
            continue

        candidates = scraped.get(p["brand"], [])
        # also search all if brand thin
        best = None
        best_score = 0.0
        for name, img in candidates:
            sc = score_match(p["name"], name)
            if sc > best_score:
                best_score = sc
                best = (name, img)
        if best_score < 0.34:
            # try fuzzy across all scraped for same category keywords
            for brand_items in scraped.values():
                for name, img in brand_items:
                    sc = score_match(p["name"], name)
                    if sc > best_score:
                        best_score = sc
                        best = (name, img)
        if not best or best_score < 0.34:
            unmatched.append(p)
            continue

        # download
        ext = Path(urlparse(best[1]).path).suffix.lower() or ".jpg"
        if ext not in {".jpg", ".jpeg", ".png", ".webp"}:
            ext = ".jpg"
        brand_slug = slugify(p["brand"])
        dest = OUT_DIR / brand_slug / f"{p['id']}{ext}"
        ok = download(best[1], dest)
        if not ok:
            # try original best url without enlarge
            ok = download(best[1].replace("/image/catalog/", "/image/cache/catalog/"), dest)
        if ok and dest.exists():
            # find actual file (ext may change)
            found = dest if dest.exists() else next(dest.parent.glob(f"{p['id']}.*"), None)
            if found:
                rel = "/" + found.relative_to(ROOT / "public").as_posix()
                updates[p["id"]] = rel
                print(f"OK #{p['id']} {p['name'][:50]} <- {best[0][:40]} ({best_score:.2f})")
            else:
                unmatched.append(p)
        else:
            unmatched.append(p)

    # For unmatched brands with any scraped images, assign by order within brand
    by_brand_left: dict[str, list[str]] = {}
    for brand, items in scraped.items():
        paths = []
        for i, (name, img) in enumerate(items[:40]):
            ext = Path(urlparse(img).path).suffix.lower() or ".jpg"
            if ext not in {".jpg", ".jpeg", ".png", ".webp"}:
                ext = ".jpg"
            dest = OUT_DIR / slugify(brand) / f"pool-{i}{ext}"
            if download(img, dest):
                found = dest if dest.exists() else next(dest.parent.glob(f"pool-{i}.*"), None)
                if found:
                    paths.append("/" + found.relative_to(ROOT / "public").as_posix())
        by_brand_left[brand] = paths

    still = []
    brand_idx: dict[str, int] = {}
    for p in unmatched:
        if p["id"] in updates:
            continue
        pool = by_brand_left.get(p["brand"], [])
        idx = brand_idx.get(p["brand"], 0)
        if pool:
            updates[p["id"]] = pool[idx % len(pool)]
            brand_idx[p["brand"]] = idx + 1
            print(f"POOL #{p['id']} {p['name'][:50]}")
        else:
            still.append(p)

    # rewrite data.ts image fields
    text = DATA_TS.read_text(encoding="utf-8")

    def repl_image(m: re.Match) -> str:
        pid = m.group(1)
        old = m.group(2)
        new = updates.get(pid, old)
        return f'id: "{pid}",' + m.group(0)[m.group(0).index(",") : m.group(0).rindex("image:")] + f'image: "{new}"'

    # safer: replace per-product block image line
    for pid, path in updates.items():
        text2, n = re.subn(
            rf'(id:\s*"{pid}",[\s\S]*?image:\s*")([^"]+)(")',
            rf"\1{path}\3",
            text,
            count=1,
        )
        if n:
            text = text2

    DATA_TS.write_text(text, encoding="utf-8")
    print(f"\nUpdated images: {len(updates)} / {len(products)}")
    print(f"Still without remote image: {len(still)}")
    for p in still[:30]:
        print(" -", p["brand"], p["name"])


if __name__ == "__main__":
    main()

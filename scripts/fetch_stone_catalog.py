# -*- coding: utf-8 -*-
"""Expand Елизаветинский stone catalog + download product photos."""
from __future__ import annotations

import re
import time
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "lib" / "data.ts"
OUT = ROOT / "public" / "images" / "catalog" / "elizavetinsky"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"

PAGES = [
    "https://shop.baltkz.ru/granit-elizovskoe/",
    "https://baltkz.ru/mestorozhdenie/elizovskoe",
    "https://graniteh.ru/catalog/stone/dymovskiy-elizovskiy-c5guz",
    "https://naturakarelica.ru/granites/elizovskij",
    "https://www.mramor23.ru/online/granit/granit-elizovskiy/",
]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "ru"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode("utf-8", "replace")


def download(url: str, dest: Path) -> Path | None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 8000:
        return dest
    headers = {"User-Agent": UA, "Referer": f"{urlparse(url).scheme}://{urlparse(url).netloc}/"}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=35) as r:
            data = r.read()
            ctype = r.headers.get("Content-Type", "")
        if len(data) < 4000:
            return None
        out = dest
        if "webp" in ctype:
            out = dest.with_suffix(".webp")
        elif "png" in ctype:
            out = dest.with_suffix(".png")
        out.write_bytes(data)
        return out
    except Exception as e:
        print("  dl fail", e, url[-70:])
        return None


def collect_images(html: str, base: str) -> list[str]:
    urls = []
    for m in re.finditer(
        r'(?:src|data-src|data-lazy-src|href)="([^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)"',
        html,
        re.I,
    ):
        u = m.group(1)
        if u.startswith("//"):
            u = "https:" + u
        elif u.startswith("/"):
            u = urljoin(base, u)
        low = u.lower()
        if any(x in low for x in ("logo", "icon", "sprite", "favicon", "1x1", "pixel", "svg")):
            continue
        if any(
            x in low
            for x in (
                "elizov",
                "елиз",
                "dymov",
                "granit",
                "brus",
                "plit",
                "slab",
                "upload",
                "product",
                "catalog",
                "wp-content",
                "iblock",
                "shop",
                "stone",
                "kamen",
            )
        ):
            urls.append(u.split("?")[0])
    # dedupe keep order
    seen = set()
    out = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


# Expanded stone assortment (client lines)
STONE_PRODUCTS = [
    # Плитка
    dict(
        name="Плитка гранит Елизаветинский полировка 300×300×20",
        price=8900,
        line="Плитка",
        desc="Полированная плитка для пола и зон у камина. Цена за м².",
        specs={"Формат": "300×300×20 мм", "Поверхность": "Полировка", "Цена за": "м²"},
        kind="tile",
    ),
    dict(
        name="Плитка гранит Елизаветинский полировка 600×300×20",
        price=9200,
        line="Плитка",
        desc="Облицовочная / напольная плитка. Цена за м².",
        specs={"Формат": "600×300×20 мм", "Поверхность": "Полировка", "Цена за": "м²"},
        kind="tile",
    ),
    dict(
        name="Плитка гранит Елизаветинский термо 600×300×30",
        price=10500,
        line="Плитка",
        desc="Термообработанная плитка с антислипом для улицы и крыльца. Цена за м².",
        specs={"Формат": "600×300×30 мм", "Поверхность": "Термо", "Цена за": "м²"},
        kind="tile",
    ),
    dict(
        name="Плита мощения Елизаветинский 600×300×40",
        price=11800,
        line="Плитка",
        desc="Плита мощения для дорожек и площадок. Цена за м².",
        specs={"Формат": "600×300×40 мм", "Поверхность": "Термо / пиленая", "Цена за": "м²"},
        kind="tile",
    ),
    dict(
        name="Облицовочная плита Елизаветинский 600×400×20",
        price=9800,
        line="Плитка",
        desc="Облицовка цоколя и фасада. Цена за м².",
        specs={"Формат": "600×400×20 мм", "Поверхность": "Полировка / шлифовка", "Цена за": "м²"},
        kind="tile",
    ),
    # Брусчатка
    dict(
        name="Брусчатка Елизаветинский колотая 100×100×50",
        price=4200,
        line="Брусчатка",
        desc="Классическая колотая брусчатка. Морозостойкая. Цена за м².",
        specs={"Формат": "100×100×50 мм", "Фактура": "Колотая", "Цена за": "м²"},
        kind="paver",
    ),
    dict(
        name="Брусчатка Елизаветинский колотая 100×100×100",
        price=4800,
        line="Брусчатка",
        desc="Толстая колотая брусчатка для интенсивных нагрузок. Цена за м².",
        specs={"Формат": "100×100×100 мм", "Фактура": "Колотая", "Цена за": "м²"},
        kind="paver",
    ),
    dict(
        name="Брусчатка Елизаветинский пилено-колотая 100×200×50",
        price=5600,
        line="Брусчатка",
        desc="Пилено-колотая брусчатка ровной высоты. Цена за м².",
        specs={"Формат": "100×200×50 мм", "Фактура": "Пилено-колотая", "Цена за": "м²"},
        kind="paver",
    ),
    dict(
        name="Брусчатка Елизаветинский термо 100×200×30",
        price=6100,
        line="Брусчатка",
        desc="Термообработанная брусчатка с антислипом. Цена за м².",
        specs={"Формат": "100×200×30 мм", "Поверхность": "Термо", "Цена за": "м²"},
        kind="paver",
    ),
    dict(
        name="Брусчатка Елизаветинский термо 100×100×30",
        price=5800,
        line="Брусчатка",
        desc="Квадратная термо-брусчатка для дорожек. Цена за м².",
        specs={"Формат": "100×100×30 мм", "Поверхность": "Термо", "Цена за": "м²"},
        kind="paver",
    ),
    # Подоконники
    dict(
        name="Подоконник Елизаветинский полировка 30 мм",
        price=28500,
        line="Подоконники",
        desc="Подоконник под размер окна, полировка, фаски. Цена ориентир за изделие.",
        specs={"Толщина": "30 мм", "Поверхность": "Полировка"},
        kind="sill",
    ),
    dict(
        name="Подоконник Елизаветинский полировка 20 мм",
        price=22500,
        line="Подоконники",
        desc="Тонкий подоконник из гранита, аккуратные торцы.",
        specs={"Толщина": "20 мм", "Поверхность": "Полировка"},
        kind="sill",
    ),
    dict(
        name="Подоконник Елизаветинский матовый 30 мм",
        price=27500,
        line="Подоконники",
        desc="Матовая шлифовка — меньше бликов, спокойный вид.",
        specs={"Толщина": "30 мм", "Поверхность": "Шлифовка"},
        kind="sill",
    ),
    # Ступени
    dict(
        name="Ступень Елизаветинский термо антислип",
        price=12500,
        line="Ступени",
        desc="Ступень с термообработкой. Цена за погонный метр.",
        specs={"Цена за": "п.м.", "Поверхность": "Термо / антислип"},
        kind="steps",
    ),
    dict(
        name="Ступень Елизаветинский полировка с валиком",
        price=14800,
        line="Ступени",
        desc="Полированная ступень с безопасным валиком. Цена за п.м.",
        specs={"Цена за": "п.м.", "Поверхность": "Полировка"},
        kind="steps",
    ),
    dict(
        name="Подступенок Елизаветинский",
        price=6900,
        line="Ступени",
        desc="Подступенок в комплекте к ступеням. Цена за п.м.",
        specs={"Цена за": "п.м.", "Элемент": "Подступенок"},
        kind="steps",
    ),
    dict(
        name="Площадка лестницы Елизаветинский",
        price=18500,
        line="Ступени",
        desc="Площадка из гранита под размер проёма. Цена ориентир за м².",
        specs={"Цена за": "м²", "Элемент": "Площадка"},
        kind="steps",
    ),
    # Столешницы
    dict(
        name="Столешница Елизаветинский полировка 30 мм",
        price=68000,
        line="Столешницы",
        desc="Кухонная / каминная столешница под размер, полировка.",
        specs={"Толщина": "30 мм", "Поверхность": "Полировка"},
        kind="counter",
    ),
    dict(
        name="Столешница Елизаветинский с вырезом под мойку",
        price=82000,
        line="Столешницы",
        desc="Столешница с вырезами и кромкой. Изготовление по чертежу.",
        specs={"Толщина": "30 мм", "Опции": "Вырезы, кромка"},
        kind="counter",
    ),
    dict(
        name="Столешница остров Елизаветинский 40 мм",
        price=115000,
        line="Столешницы",
        desc="Массивная столешница 40 мм для острова или барной стойки.",
        specs={"Толщина": "40 мм", "Поверхность": "Полировка"},
        kind="counter",
    ),
    dict(
        name="Полка / каминная доска Елизаветинский",
        price=42000,
        line="Столешницы",
        desc="Каминная полка или доска из елизаветинского гранита.",
        specs={"Назначение": "Каминная полка", "Поверхность": "Полировка"},
        kind="counter",
    ),
    # Уличные входные группы
    dict(
        name="Входная группа Елизаветинский стандарт",
        price=185000,
        line="Уличные входные группы",
        desc="Комплект: ступени, площадка, бордюры. Под размер объекта.",
        specs={"Состав": "Ступени + площадка + бордюры"},
        kind="entrance",
    ),
    dict(
        name="Входная группа Елизаветинский с пандусом",
        price=245000,
        line="Уличные входные группы",
        desc="Входная группа с пандусом и ограждением из гранита.",
        specs={"Состав": "Ступени + пандус + бордюры"},
        kind="entrance",
    ),
    dict(
        name="Бордюр гранитный Елизаветинский ГП-1",
        price=3200,
        line="Уличные входные группы",
        desc="Дорожный / садовый бордюр. Цена за погонный метр.",
        specs={"Тип": "ГП-1", "Цена за": "п.м."},
        kind="entrance",
    ),
    dict(
        name="Бордюр гранитный Елизаветинский ГП-5",
        price=4100,
        line="Уличные входные группы",
        desc="Бордюр усиленного профиля. Цена за п.м.",
        specs={"Тип": "ГП-5", "Цена за": "п.м."},
        kind="entrance",
    ),
    dict(
        name="Курдюк / элемент входной группы Елизаветинский",
        price=8900,
        line="Уличные входные группы",
        desc="Угловой / декоративный элемент входной группы.",
        specs={"Элемент": "Курдюк"},
        kind="entrance",
    ),
]


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main():
    all_imgs: list[str] = []
    for url in PAGES:
        print("FETCH", url)
        try:
            html = fetch(url)
            imgs = collect_images(html, url)
            print("  imgs", len(imgs))
            all_imgs.extend(imgs)
        except Exception as e:
            print("  !!", e)
        time.sleep(0.5)

    # also reuse client granite photos as high-quality unique set
    local = list((ROOT / "public" / "images" / "granite").rglob("*"))
    local_urls = [
        "/" + f.relative_to(ROOT / "public").as_posix()
        for f in local
        if f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    ]
    print("local granite", len(local_urls))

    # download remote into pool
    remote_paths: list[str] = []
    for i, url in enumerate(all_imgs[:80]):
        dest = OUT / f"src-{i:02d}.jpg"
        saved = download(url, dest)
        if saved:
            remote_paths.append("/" + saved.relative_to(ROOT / "public").as_posix())
            print("OK", i, saved.name, saved.stat().st_size)
        time.sleep(0.08)

    print("downloaded", len(remote_paths))

    # map kinds to preferred image pools
    kind_pool = {
        "tile": [],
        "paver": [],
        "sill": [],
        "steps": [],
        "counter": [],
        "entrance": [],
    }
    # heuristic by filename
    for p in remote_paths + local_urls:
        low = p.lower()
        if any(k in low for k in ("brus", "paver", "kolot", "100x", "trotuar")):
            kind_pool["paver"].append(p)
        elif any(k in low for k in ("stup", "step", "lest", "warehouse-steps")):
            kind_pool["steps"].append(p)
        elif any(k in low for k in ("bord", "curb", "yard", "vhod", "entrance")):
            kind_pool["entrance"].append(p)
        elif any(k in low for k in ("stol", "counter", "slab", "sleb", "polir", "workshop-polished")):
            kind_pool["counter"].append(p)
        elif any(k in low for k in ("podokon", "sill", "window")):
            kind_pool["sill"].append(p)
        elif any(k in low for k in ("plit", "tile", "mozh", "oblic", "thermo", "tile-sample")):
            kind_pool["tile"].append(p)
        else:
            # general stone photos
            kind_pool["tile"].append(p)
            kind_pool["counter"].append(p)

    # ensure non-empty pools
    fallback = remote_paths + local_urls
    for k, v in kind_pool.items():
        if not v:
            kind_pool[k] = fallback[:]

    # Build stone products TS blocks with unique images cycling per kind
    kind_idx = {k: 0 for k in kind_pool}
    stone_items = []
    for i, sp in enumerate(STONE_PRODUCTS):
        kind = sp["kind"]
        pool = kind_pool[kind]
        img = pool[kind_idx[kind] % len(pool)]
        kind_idx[kind] += 1
        # prefer unique: if same as previous in same kind, skip ahead
        for _ in range(min(5, len(pool))):
            if img not in [x["image"] for x in stone_items[-3:]]:
                break
            kind_idx[kind] += 1
            img = pool[kind_idx[kind] % len(pool)]
        stone_items.append({**sp, "image": img, "tmp_id": i + 1})

    # Replace existing Елизаветинский products in data.ts
    text = DATA.read_text(encoding="utf-8")

    # Find max product id
    ids = [int(x) for x in re.findall(r'id:\s*"(\d+)"', text)]
    next_id = max(ids) + 1 if ids else 1

    # Remove old Елизаветинский product objects
    # Match product blocks containing brand Елизаветинский
    pattern = re.compile(
        r"\s*\{\s*id:\s*\"\d+\",\s*name:\s*\"[^\"]+\",\s*brand:\s*\"Елизаветинский\",[\s\S]*?\},",
        re.M,
    )
    text2, n = pattern.subn("", text)
    print("removed old stone products", n)

    # Insert new stone products after `export const products: Product[] = [`
    blocks = []
    for sp in stone_items:
        pid = str(next_id)
        next_id += 1
        specs_lines = ",\n        ".join(
            f'"{esc(k)}": "{esc(v)}"' for k, v in sp["specs"].items()
        )
        blocks.append(
            f"""  {{
    id: "{pid}",
    name: "{esc(sp['name'])}",
    brand: "Елизаветинский",
    category: "Камень",
    price: {sp['price']},
    image: "{sp['image']}",
    description: "{esc(sp['desc'])}",
    specs: {{
        {specs_lines},
      }},
    line: "{esc(sp['line'])}",
  }},"""
        )

    insert = "\n".join(blocks) + "\n"
    marker = "export const products: Product[] = ["
    if marker not in text2:
        raise SystemExit("products array not found")
    text2 = text2.replace(marker, marker + "\n" + insert, 1)
    DATA.write_text(text2, encoding="utf-8")
    print("inserted", len(stone_items), "stone products")


if __name__ == "__main__":
    main()

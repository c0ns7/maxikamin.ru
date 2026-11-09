# -*- coding: utf-8 -*-
"""Generate src/lib/data.ts from parsed supplier catalogs."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "lib" / "data.ts"

IMG = {
    "portal": "/images/granite/production/workshop-polished-slab.jpg",
    "oblic": "/images/granite/production/workshop-slabs-rack.jpg",
    "topka": "/images/hero.png",
    "pech": "/images/granite/production/warehouse-steps.jpg",
    "kamen": "/images/granite/products/slab-polished.jpg",
    "bio": "/images/granite/products/texture-rough-smooth.jpg",
    "dym": "/images/montage.png",
    "paver": "/images/granite/products/paver-closeup.jpg",
    "tile": "/images/granite/products/tile-sample.jpg",
    "steps": "/images/granite/production/warehouse-steps.jpg",
    "yard": "/images/granite/production/yard-curbs.jpg",
}

products: list[dict] = []
pid = 1


def add(
    name: str,
    brand: str,
    category: str,
    price: int,
    description: str,
    image_key: str,
    specs: dict | None = None,
    line: str | None = None,
):
    global pid
    products.append(
        {
            "id": str(pid),
            "name": name,
            "brand": brand,
            "category": category,
            "price": price,
            "image": IMG[image_key],
            "description": description,
            "specs": specs or {},
            "line": line,
        }
    )
    pid += 1


# —— Елизаветинский ——
add(
    "Плитка гранит Елизаветинский",
    "Елизаветинский",
    "Камень",
    8900,
    "Гранитная плитка для пола, зон у камина и входных групп. Цена за м².",
    "tile",
    {"Материал": "Гранит Елизаветинский", "Цена за": "м²", "Поверхность": "Полировка / термо"},
    "Плитка",
)
add(
    "Брусчатка гранит Елизаветинский",
    "Елизаветинский",
    "Камень",
    4200,
    "Колотая брусчатка из елизаветинского гранита. Морозостойкая. Цена за м².",
    "paver",
    {"Материал": "Гранит Елизаветинский", "Цена за": "м²", "Фактура": "Колотая"},
    "Брусчатка",
)
add(
    "Подоконник гранит Елизаветинский",
    "Елизаветинский",
    "Камень",
    28500,
    "Подоконник из елизаветинского гранита с аккуратными фасками. Под размер.",
    "tile",
    {"Толщина": "20–30 мм", "Материал": "Гранит"},
    "Подоконники",
)
add(
    "Ступени гранит Елизаветинский",
    "Елизаветинский",
    "Камень",
    12500,
    "Ступени с антислипом. Цена за погонный метр, изготовление под заказ.",
    "steps",
    {"Цена за": "п.м.", "Обработка": "Антислип"},
    "Ступени",
)
add(
    "Столешница гранит Елизаветинский",
    "Елизаветинский",
    "Камень",
    68000,
    "Столешница из елизаветинского гранита. Полировка, раскрой по размерам.",
    "kamen",
    {"Толщина": "30 мм", "Поверхность": "Полировка"},
    "Столешницы",
)
add(
    "Входная группа гранит Елизаветинский",
    "Елизаветинский",
    "Камень",
    185000,
    "Уличная входная группа: ступени, площадка, бордюры из елизаветинского гранита.",
    "yard",
    {"Тип": "Уличная входная группа"},
    "Уличные входные группы",
)

# —— Madeira облицовки ——
madeira_oblic = [
    ("Облицовка Dora Dark Chocolate Madeira", 185300, "Кантри-стиль, натуральный мрамор контрастных оттенков."),
    ("Облицовка Evgenia Madeira", 196350, "Полированный мрамор Crema Marfil и Emperador."),
    ("Облицовка Tamiza Chocolate Madeira", 202300, "Классика, угловой или пристенный вариант."),
    ("Камин Calliope Madeira", 145350, "Пристенно-угловой, мрамор Crema Light и Dark Chocolate."),
    ("Облицовка Valentina Giallo Madeira", 141900, "Мрамор Giallo и Sunny Yellow, под топки 700 мм."),
    ("Облицовка Crocus Rosso Madeira", 207400, "Колотый мрамор с полкой Rosso, под топки 700 мм."),
    ("Облицовка Aster Giallo угловая Madeira", 168300, "Угловая, колотый мрамор Giallo."),
    ("Облицовка Cristina Madeira", 168300, "Классика в светло-бежевых тонах натурального мрамора."),
    ("Облицовка Barbara Madeira", 202300, "Строгий мраморный камин Giallo или бежевый."),
    ("Облицовка Dora Giallo угловая Madeira", 145350, "Пристенная/угловая облицовка с мрамором Giallo."),
    ("Облицовка Aster Emperador угловая Madeira", 207400, "Угловая с накладкой Emperador."),
    ("Облицовка Daniella Dark Chocolate угловая Madeira", 179350, "Угловая облицовка из натуральных материалов."),
    ("Облицовка Flora Rosso угловая Madeira", 185300, "Стиль прованс, бежево-жёлтая гамма с акцентом Rosso."),
    ("Облицовка Aster Dark Chocolate Madeira", 207400, "Пристенная облицовка с мрамором Dark Chocolate."),
]
for name, price, desc in madeira_oblic:
    add(name, "Madeira", "Облицовки", price, desc, "oblic", {"Бренд": "Madeira", "Материал": "Мрамор"}, "Каминная облицовка")

# —— Madeira порталы ——
madeira_portals = [
    ("Каминный портал Madeira Altea", 426000, "Мрамор Carrara Light или Antique Egypt."),
    ("Каминный портал Madeira Melissa", 241000, "Мрамор Carrara Light или Antique Egypt."),
    ("Каминный портал Madeira Washington", 235450, "Итальянский мрамор, классика, пристенный."),
    ("Мраморный портал Liana Madeira", 157250, "Crema Marfil, под топки 700–800 мм."),
    ("Мраморный портал Rowan Madeira", 162350, "Crema Marfil / Emperador, под топки 700–800 мм."),
    ("Каминный портал Madeira Thalia", 230350, "Классический мраморный портал Madeira."),
    ("Каминный портал Madeira Adonis", 708000, "Мрамор Crystal White, адаптация 113×84 см."),
    ("Каминный портал Madeira Preston", 267500, "Мрамор Crema Marfil, адаптация 85×90 см."),
    ("Каминный портал Madeira Andromeda", 325000, "Изящный мраморный портал Madeira."),
    ("Каминный портал Madeira Dafne Small", 297500, "Crema Marfil / Emperador."),
    ("Каминный портал Madeira Augusto", 684000, "Мрамор Antique Egypt."),
    ("Каминный портал Madeira Demetra", 627000, "Мрамор Carrara Light."),
    ("Каминный портал Madeira Astrey", 684000, "Crema Marfil, под прямое стекло."),
    ("Каминный портал Madeira Fortuna", 241400, "Crema Marfil или Galala Beige."),
    ("Каминный портал Madeira Afrodita", 908000, "Романский стиль, мраморный портал."),
    ("Каминный портал Madeira Apollo", 606000, "Carrara Light или Antique Egypt."),
    ("Каминный портал Madeira Cezar", 706000, "Полированный мрамор, итальянская классика."),
    ("Каминный портал Madeira Galateya", 202300, "Carrara Light или Antique Egypt."),
    ("Каминный портал Madeira Antey", 370600, "Crema Marfil, адаптация 120×103 см."),
    ("Каминный портал Madeira Cassandra", 302600, "Мрамор Crema Marfil."),
    ("Каминный портал Madeira Dionis", 560000, "Carrara Light, адаптация 100×91 см."),
    ("Каминный портал Madeira Bartolomeo", 269450, "Классический портал Madeira."),
    ("Каминный портал Madeira Aurelia", 812000, "Carrara Light, под топку с прямым стеклом."),
    ("Каминный портал Madeira Vesta", 263500, "Мраморный портал Madeira."),
    ("Каминный портал Madeira Arabella", 358000, "Carrara Light или Antique Egypt."),
]
for name, price, desc in madeira_portals:
    add(name, "Madeira", "Порталы", price, desc, "portal", {"Бренд": "Madeira", "Материал": "Мрамор"}, "Каминный портал")

# —— Экокамин топки ——
eco_topki = [
    ("Топка Экокамин ВЕГА ПРАЙМ 1000", 400491, "Шибер встроенный, рамка декоративная."),
    ("Топка Экокамин ВЕГА ПРАЙМ 1000P", 400491, "Подовое горение, шибер, декоративная рамка."),
    ("Топка Экокамин ДЕЛЬТА ПРАЙМ 1000", 528291, "Три стекла, шибер, декоративная рамка."),
    ("Топка Экокамин ДЕЛЬТА ПРАЙМ 1100", 618291, "Три стекла, чугунная футеровка, шибер."),
    ("Топка Экокамин ВЕГА 800", 281592, "Принтинг, компактная модель."),
    ("Топка Экокамин ВЕГА 1000 MP", 307992, "Подовое горение, принтинг."),
    ("Топка Экокамин ДЕЛЬТА 1200×800×450 P", 527992, "Три стекла, подовая."),
    ("Топка Экокамин ДЕЛЬТА 1400V", 799990, "Три стекла, вертикальная ламель."),
]
for name, price, desc in eco_topki:
    add(name, "Экокамин", "Топки", price, desc, "topka", {"Бренд": "Экокамин", "Страна": "Россия"}, "Каминные топки")

eco_pechi = [
    ("Печь-камин БАВАРИЯ ЭКО с плитой", 84142, "Две конфорки, линейка Бавария Эко."),
    ("Печь-камин БАВАРИЯ угловая с плитой", 65442, "Угловая модель с варочной поверхностью."),
    ("Печь-камин БАВАРИЯ", 60767, "Классическая печь-камин Экокамин."),
    ("Печь-камин БАВАРИЯ ПРИЗМАТИК", 93492, "Пристенно-угловой призматик."),
    ("Печь-камин БАВАРИЯ 12", 84142, "Усиленная модель Бавария 12."),
    ("Печь-камин БАВАРИЯ ЭКО с духовкой и плитой", 121542, "Плита и духовка в одной модели."),
    ("Печь-камин ДЕРЕВЕНЬКА две конфорки", 84142, "Печь-камин с двумя конфорками."),
    ("Печь-камин БАВАРИЯ ПАНОРАМА ПРИЗМА с плитой", 121542, "Панорамное стекло и плита."),
]
for name, price, desc in eco_pechi:
    add(name, "Экокамин", "Печи", price, desc, "pech", {"Бренд": "Экокамин"}, "Печи-камины")

add(
    "Камин Экокамин готовый комплект",
    "Экокамин",
    "Камины",
    189000,
    "Готовый камин Экокамин: топка и облицовка в комплекте. Подбор под помещение.",
    "oblic",
    {"Бренд": "Экокамин", "Тип": "Готовый камин"},
    "Камин",
)

# —— Kratki топки ——
kratki_topki = [
    ("Топка Kratki ERYK 700", 105000, "Дровяная топка Eryk 700, акция."),
    ("Топка Kratki ANTEK/150", 82500, "Компактная чугунная топка Antek."),
    ("Топка Kratki MAJA", 115200, "Классическая топка Maja."),
    ("Топка Kratki AMELIA", 202400, "Чугун со встроенным шибером."),
    ("Топка Kratki FELIX", 151600, "Чугунная топка Felix."),
    ("Топка Kratki ZUZIA/700", 147400, "Модель Zuzia 700."),
    ("Топка Kratki OLIWIA", 175000, "Топка Oliwia."),
    ("Топка Kratki WIKTOR", 143500, "Недорогая чугунная топка."),
    ("Топка Kratki MAJA WIEZA", 252700, "Широкое окно, модель Wieza."),
    ("Топка Kratki BLANKA", 219100, "Стальная топка Blanka."),
    ("Топка Kratki BLANKA/910", 334800, "Фронт 910 мм, высокая мощность."),
    ("Топка Kratki SIMPLE/S/P/BS", 167300, "Угловое стекло справа."),
    ("Топка Kratki AMELIA/PW/30/W", 454000, "С водяным контуром, 30 кВт."),
    ("Топка Kratki AQUARIO/A/14/PW/W", 549200, "Водяной контур Aquario 14."),
]
for name, price, desc in kratki_topki:
    add(name, "Kratki", "Топки", price, desc, "topka", {"Бренд": "Kratki", "Страна": "Польша"}, "Дровяные топки")

add(
    "Газовая топка Kratki",
    "Kratki",
    "Топки",
    285000,
    "Газовая топка Kratki. Удобный розжиг, без дров. Подбор модели под объект.",
    "topka",
    {"Тип": "Газовая", "Страна": "Польша"},
    "Газовые топки",
)
add(
    "Уличный нагреватель Kratki",
    "Kratki",
    "Топки",
    198000,
    "Уличный нагреватель Kratki для террас и зон отдыха.",
    "topka",
    {"Тип": "Уличный нагреватель", "Страна": "Польша"},
    "Уличные нагреватели",
)

kratki_pechi = [
    ("Печь Kratki Koza K9", 116500, "Чугунная печь Koza K9."),
    ("Печь Kratki Koza/K7", 67000, "Компактная Koza K7."),
    ("Печь Kratki Koza/K6", 131500, "Чугунная Koza K6."),
    ("Печь Kratki Koza/K8", 146300, "Овальная чугунная печь."),
    ("Печь Kratki Koza K12", 91200, "Модель Koza K12."),
    ("Печь Kratki ROLLO", 195300, "Современная печь Rollo."),
    ("Печь-камин Kratki ANTARES", 313200, "Печь-камин Antares."),
    ("Печь Kratki JUNO 12/B", 294900, "Свободностоящая печь Juno."),
    ("Печь Kratki PRO KOZA/AB/ENYO/R VIEW", 334700, "Трёхсторонняя панорама."),
]
for name, price, desc in kratki_pechi:
    add(name, "Kratki", "Печи", price, desc, "pech", {"Бренд": "Kratki", "Страна": "Польша"}, "Печи")

add(
    "Каминокомплект Kratki",
    "Kratki",
    "Каминокомплекты",
    268000,
    "Готовый каминокомплект Kratki: топка и облицовка. Подбор комплектации.",
    "oblic",
    {"Комплект": "Топка + облицовка", "Страна": "Польша"},
    "Каминокомплекты",
)

kratki_bio = [
    ("Биокамин Kratki DELTA 2 TUV", 19800, "Настенный биокамин 400×900."),
    ("Биокамин Kratki JULIET/1800 TUV", 87500, "Широкий биокамин 1800×650."),
    ("Биокамин Kratki OSCAR TUV", 69000, "Прямоугольный современный биокамин."),
    ("Биокамин Kratki FOXTROT напольный TUV", 29300, "Напольная модель Foxtrot."),
    ("Биокамин Kratki SIERRA TUV", 97500, "Модель Sierra."),
    ("Биокамин Kratki DELTA/L/1200 угловой TUV", 92900, "Угловой биокамин."),
    ("Биокамин Kratki X-RAY TUV со стеклом", 104400, "Настенный со стеклом."),
    ("Биоконтейнер Grand TUV", 14600, "Прямоугольный контейнер для биотоплива."),
]
for name, price, desc in kratki_bio:
    add(name, "Kratki", "Биокамины", price, desc, "bio", {"Бренд": "Kratki", "Тип": "Биокамин"}, "Биокамины и биоконтейнеры")

# —— ABX ——
abx = [
    ("Топка ABX York KI", 133300, 9, "Дровяная топка York KI."),
    ("Топка ABX York KI с теплообменником", 151900, 9, "York KI с теплообменником."),
    ("Топка ABX York LI чугун", 127100, 7, "Чугунная York LI."),
    ("Каминная топка ABX Orion", 176700, 10, "Топка Orion."),
    ("Топка ABX Oxford I", 173600, 10, "Oxford I."),
    ("Топка ABX Cardiff", 198400, 11, "Cardiff."),
    ("Топка ABX Derby 6/57 Panorama", 176000, 10, "Derby Panorama."),
    ("Топка ABX Derby 6/57 Prisma", 176000, 10, "Derby Prisma."),
    ("Топка ABX Dallas", 207700, 10, "Dallas."),
    ("Каминная топка ABX Pegas", 241800, 12, "Pegas."),
]
for name, price, kw, desc in abx:
    add(name, "ABX", "Топки", price, desc, "topka", {"Бренд": "ABX", "Страна": "Чехия", "Мощность": f"{kw} кВт"}, "Дровяные топки")

add(
    "Печь ABX",
    "ABX",
    "Печи",
    189000,
    "Дровяная печь ABX (Чехия). Подбор модели под площадь помещения.",
    "pech",
    {"Бренд": "ABX", "Страна": "Чехия"},
    "Печи",
)
add(
    "Каминокомплект ABX",
    "ABX",
    "Каминокомплекты",
    245000,
    "Каминокомплект ABX: топка и облицовка.",
    "oblic",
    {"Страна": "Чехия"},
    "Каминокомплекты",
)

# —— IldNord ——
ild = [
    ("Топка IldNord Bergen", 102600, "Оптимальная дровяная топка Bergen."),
    ("Топка IldNord Bergen Deco", 175700, "Bergen с декоративной дверцей."),
    ("Топка IldNord Alta 70", 149400, "Alta 70."),
    ("Топка IldNord MALMO", 152700, "Malmo."),
    ("Топка IldNord MALMO угол слева", 185100, "Угловое исполнение слева."),
    ("Топка IldNord Bergen угловое стекло слева", 160800, "Угловое стекло слева."),
    ("Топка IldNord Bergen угловое стекло справа", 160800, "Угловое стекло справа."),
]
for name, price, desc in ild:
    add(name, "IldNord", "Топки", price, desc, "topka", {"Бренд": "IldNord", "Страна": "Польша"}, "Дровяные топки")

add(
    "Печь IldNord",
    "IldNord",
    "Печи",
    165000,
    "Дровяная печь IldNord (Польша).",
    "pech",
    {"Страна": "Польша"},
    "Печи",
)
add(
    "Каминокомплект IldNord",
    "IldNord",
    "Каминокомплекты",
    228000,
    "Каминокомплект IldNord: топка и облицовка.",
    "oblic",
    {"Страна": "Польша"},
    "Каминокомплекты",
)

# —— FireBird ——
fb = [
    ("Топка FireBird Emir 753 трёхсторонняя", 129000, "Трёхсторонняя топка Emir 753."),
    ("Топка FireBird Consul 12 кВт", 58900, "12 кВт, компактная топка."),
    ("Топка FireBird Baron 14 кВт", 72900, "14 кВт, фронт 700 мм, дымоход Ø200."),
]
for name, price, desc in fb:
    add(name, "FireBird", "Топки", price, desc, "topka", {"Бренд": "FireBird", "Страна": "Россия"}, "Дровяные топки")

add("Печь FireBird", "FireBird", "Печи", 98000, "Дровяная печь FireBird российского производства.", "pech", {"Страна": "Россия"}, "Печи")
add(
    "Каминокомплект FireBird",
    "FireBird",
    "Каминокомплекты",
    156000,
    "Готовый каминокомплект FireBird.",
    "oblic",
    {"Страна": "Россия"},
    "Каминокомплекты",
)
add(
    "Биокамин FireBird ДИАНА",
    "FireBird",
    "Биокамины",
    56900,
    "Биокамин Диана, производство FireBird.",
    "bio",
    {"Тип": "Биокамин", "Страна": "Россия"},
    "Биокамины и биоконтейнеры",
)
add(
    "Биоконтейнер FireBird Искра",
    "FireBird",
    "Биокамины",
    3900,
    "Цилиндрический контейнер для биотоплива.",
    "bio",
    {"Тип": "Биоконтейнер"},
    "Биокамины и биоконтейнеры",
)

# —— La Nordica ——
ln = [
    ("Печь-камин La Nordica Super Junior Nera", 113850, "5 кВт", "Компактная чугунная печь."),
    ("Печь-камин La Nordica Tea 16 Nero Antracite", 142900, "8 кВт", "Tea 16 антрацит."),
    ("Печь-камин La Nordica Candy lean", 184450, "7,2 кВт", "Candy lean."),
    ("Печь-камин La Nordica Gemma lean Petra", 187900, "6 кВт", "Отделка серым камнем."),
    ("Печь-камин La Nordica Giulietta 165", 233700, "6 кВт", "Giulietta антрацит."),
    ("Печь-камин La Nordica Asia 5.0 Vulcan", 250500, "6 кВт", "Asia 5.0 Vulcan."),
    ("Печь-камин La Nordica Isetta EVO 4.0", 291750, "7 кВт", "Isetta EVO."),
    ("Печь-камин La Nordica Gemma Forno 165 Petra", 305300, "7,3 кВт", "С духовкой, камень Petra."),
    ("Печь-камин La Nordica Rossella R1 B II Petra", 314900, "8 кВт", "Rossella в камне."),
    ("Печь-камин La Nordica Fedora 16 Bordeaux", 357600, "9,6 кВт", "Fedora бордо."),
    ("Печь-камин La Nordica Rosa 5.0 Petra", 394100, "8,4 кВт", "Rosa в натуральном камне."),
    ("Печь-камин La Nordica Ester Forno 5.0 Vulcan", 586400, "10,3 кВт", "Ester Forno Vulcan."),
    ("Печь-камин La Nordica Alaska 16 Nero", 974050, "12 кВт", "Мощная Alaska 16."),
]
for name, price, power, desc in ln:
    add(name, "La Nordica", "Печи", price, desc, "pech", {"Бренд": "La Nordica", "Страна": "Италия", "Мощность": power}, "Печи-камины")

# —— Solzaima ——
sol = [
    ("Печь-камин Solzaima Amber", 171500, "7,3 кВт"),
    ("Печь-камин Solzaima Tek Unit", 175990, "7,3 кВт"),
    ("Печь-камин Solzaima Tek System Eco", 203150, "7,3 кВт"),
    ("Печь-камин Solzaima Tek Round Eco", 215450, "7,3 кВт"),
    ("Печь-камин Solzaima Tek Corner", 216700, "7,3 кВт"),
    ("Печь-камин Solzaima Back Box", 277690, "11 кВт"),
    ("Печь-камин Solzaima Slim Box", 277690, "10 кВт"),
    ("Печь-камин Solzaima Basic Box", 311000, "11 кВт"),
    ("Печь-камин Solzaima Fogo Montanha Natura S500H", 406400, "7,3 кВт"),
    ("Печь-камин Solzaima Tek Lumber", 419950, "7,3 кВт"),
]
for name, price, power in sol:
    add(
        name,
        "Solzaima",
        "Печи",
        price,
        "Энергоэффективная печь-камин Solzaima (Португалия).",
        "pech",
        {"Бренд": "Solzaima", "Страна": "Португалия", "Мощность": power},
        "Печи-камины",
    )

# —— MCZ ——
mcz = [
    ("Топка MCZ Forma 75 прямое стекло", 426000, "11 кВт"),
    ("Топка MCZ Plasma 75 прямое стекло", 641850, "12,5 кВт"),
    ("Топка MCZ Plasma 85 прямое стекло", 676350, "13,3 кВт"),
    ("Топка MCZ Plasma 95 прямое стекло", 692700, "13,3 кВт"),
    ("Топка MCZ Plasma 115 прямое стекло", 771100, "14,1 кВт"),
    ("Топка MCZ Plasma В95 тоннельная", 779600, "13,5 кВт"),
    ("Топка MCZ Plasma 75 угловое стекло", 801900, "12 кВт"),
    ("Топка MCZ Plasma 95 угловое стекло", 856550, "14,8 кВт"),
    ("Топка MCZ Plasma 50 T три стекла", 880750, "15,7 кВт"),
    ("Топка MCZ Plasma В115 тоннельная", 911550, "14,5 кВт"),
    ("Топка MCZ Plasma 95 T три стекла", 972000, "13,2 кВт"),
]
for name, price, power in mcz:
    add(
        name,
        "MCZ",
        "Топки",
        price,
        "Итальянская топка MCZ с технологией подового горения.",
        "topka",
        {"Бренд": "MCZ", "Страна": "Италия", "Мощность": power},
        "Дровяные топки",
    )

# —— AVES ——
for name, price in [
    ("Топка AVES прямое стекло", 285000),
    ("Топка AVES угловая", 312000),
    ("Топка AVES тоннельная", 348000),
]:
    add(
        name,
        "AVES",
        "Топки",
        price,
        "Дровяная топка AVES. Подбор модели из каталога производителя.",
        "topka",
        {"Бренд": "AVES", "Страна": "Россия"},
        "Дровяные топки",
    )

# —— Schmid ——
for name, price, power in [
    ("Топка Schmid Lina 67", 420000, "9 кВт"),
    ("Топка Schmid Ekko 67", 455000, "10 кВт"),
    ("Топка Schmid TV 6757", 490000, "11 кВт"),
    ("Топка Schmid Ekko U 67", 520000, "11 кВт"),
]:
    add(
        name,
        "Schmid",
        "Топки",
        price,
        "Немецкая дровяная топка Schmid. Премиум-сегмент.",
        "topka",
        {"Бренд": "Schmid", "Страна": "Германия", "Мощность": power},
        "Дровяные топки",
    )

# —— Brunner ——
brunner = [
    ("Топка Brunner BKH 5.0 flat 42-66 ST", 580000, "9 кВт"),
    ("Топка Brunner BKH 5.0 flat 50-82 ST", 620000, "10 кВт"),
    ("Топка Brunner BKH 5.0 flat 42-98 ST", 640000, "11 кВт"),
    ("Топка Brunner BKH 5.0 Panorama 45-35-90-35 ST", 780000, "10 кВт"),
    ("Топка Brunner BKH 5.0 Panorama 45-80-45-80 ST", 820000, "11 кВт"),
    ("Топка Brunner BKH 5.0 corner 42-66-42 ST", 690000, "9 кВт"),
    ("Топка Brunner BKH 5.0 Tunnel 50-82 ST-KT", 750000, "10 кВт"),
    ("Топка Brunner BKH 5.0 Tunnel 50-98 ST-KT", 790000, "11 кВт"),
    ("Топка Brunner Stil-Kamin flat 75-90+", 710000, "11 кВт"),
    ("Топка Brunner Urfeuer 50/66", 650000, "8 кВт"),
]
for name, price, power in brunner:
    add(
        name,
        "Brunner",
        "Топки",
        price,
        "Каминная топка Brunner (Германия). Цена ориентировочная — уточняется после проекта.",
        "topka",
        {"Бренд": "Brunner", "Страна": "Германия", "Мощность": power},
        "Дровяные топки",
    )

# —— Hoxter ——
hoxter = [
    "Hoxter Haka 67/51h",
    "Hoxter Haka 78/57h",
    "Hoxter Haka 89/45h",
    "Hoxter Haka 110/51h",
    "Hoxter ECKA 67/45/51L",
    "Hoxter ECKA 90/40/40Lh",
    "Hoxter UKA 56/50/56/52h",
    "Hoxter UKA 69/48/69/51h",
    "Hoxter Haka 63/51T туннель",
    "Hoxter Haka 89/45T туннель",
]
for i, name in enumerate(hoxter):
    add(
        f"Топка {name}",
        "Hoxter",
        "Топки",
        520000 + i * 25000,
        "Дровяная топка Hoxter. Подбор и цена — по проекту монтажа.",
        "topka",
        {"Бренд": "Hoxter", "Страна": "Чехия", "Модель": name},
        "Дровяные топки",
    )

# —— Феник дымоходы ——
fenik = [
    ("Дымоход Феникс сэндвич Ø150", 18500, "Сэндвич-дымоход из нержавеющей стали, Ø150."),
    ("Дымоход Феникс сэндвич Ø200", 24500, "Сэндвич-дымоход Ø200 для каминных топок."),
    ("Дымоход Феникс моно Ø150", 9800, "Одноконтурный дымоход из нержавейки."),
    ("Комплект дымохода Феникс под камин", 68000, "Базовый комплект элементов под камин/печь."),
    ("Коаксиальный дымоход Феникс", 32000, "Коаксиальная система дымоудаления."),
]
for name, price, desc in fenik:
    add(name, "Феникс", "Дымоходы", price, desc, "dym", {"Бренд": "Феникс", "Страна": "Россия"}, "Дымоход")


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def specs_ts(specs: dict) -> str:
    if not specs:
        return "undefined"
    inner = ", ".join(f'"{esc(k)}": "{esc(v)}"' for k, v in specs.items())
    return "{" + inner + "}"


brands = [
    "Елизаветинский",
    "Madeira",
    "Экокамин",
    "Kratki",
    "ABX",
    "IldNord",
    "FireBird",
    "La Nordica",
    "Solzaima",
    "MCZ",
    "AVES",
    "Schmid",
    "Brunner",
    "Hoxter",
    "Феникс",
]

categories = [
    "Облицовки",
    "Порталы",
    "Топки",
    "Печи",
    "Камины",
    "Каминокомплекты",
    "Биокамины",
    "Камень",
    "Дымоходы",
]

assortment = {
    "Елизаветинский": [
        "Плитка",
        "Брусчатка",
        "Подоконники",
        "Ступени",
        "Столешницы",
        "Уличные входные группы",
    ],
    "Madeira": ["Каминная облицовка", "Каминный портал"],
    "Экокамин": ["Каминные топки", "Печи-камины", "Камины"],
    "Kratki": [
        "Дровяные топки",
        "Газовые топки",
        "Уличные нагреватели",
        "Печи",
        "Каминокомплекты",
        "Биокамины и биоконтейнеры",
    ],
    "ABX": ["Дровяные топки", "Печи", "Каминокомплекты"],
    "IldNord": ["Дровяные топки", "Печи", "Каминокомплекты"],
    "FireBird": ["Дровяные топки", "Печи", "Каминокомплекты", "Биокамины и биоконтейнеры"],
    "La Nordica": ["Печи-камины"],
    "Solzaima": ["Печи-камины"],
    "MCZ": ["Дровяные топки"],
    "AVES": ["Дровяные топки"],
    "Schmid": ["Дровяные топки"],
    "Brunner": ["Дровяные топки"],
    "Hoxter": ["Дровяные топки"],
    "Феникс": ["Дымоходы"],
}

# Rebuild file cleanly
out: list[str] = []
out.append('import { img } from "@/lib/images";')
out.append("")
out.append("export type Category =")
out.append("  | " + "\n  | ".join(f'"{c}"' for c in categories) + ";")
out.append("")
out.append("export type Brand =")
out.append("  | " + "\n  | ".join(f'"{b}"' for b in brands) + ";")
out.append("")
out.append(
    """export interface Product {
  id: string;
  name: string;
  brand: Brand;
  category: Category;
  price: number;
  image: string;
  description: string;
  specs?: Record<string, string>;
  /** Линейка из прайса заказчика */
  line?: string;
}"""
)
out.append("")
out.append("export const categories: Category[] = [")
for c in categories:
    out.append(f'  "{c}",')
out.append("];")
out.append("")
out.append("export const brands: Brand[] = [")
for b in brands:
    out.append(f'  "{b}",')
out.append("];")
out.append("")
out.append("/** Ассортимент по брендам (Maxi-Kamin) */")
out.append("export const brandAssortment: Record<Brand, string[]> = {")
for b in brands:
    arr = ",\n    ".join(f'"{x}"' for x in assortment[b])
    out.append(f'  "{b}": [\n    {arr},\n  ],')
out.append("};")
out.append("")
out.append("export const products: Product[] = [")
for p in products:
    specs = p["specs"]
    specs_s = "undefined"
    if specs:
        specs_s = (
            "{\n        "
            + ",\n        ".join(f'"{esc(k)}": "{esc(v)}"' for k, v in specs.items())
            + ",\n      }"
        )
    line_s = f'"{esc(p["line"])}"' if p.get("line") else "undefined"
    out.append("  {")
    out.append(f'    id: "{p["id"]}",')
    out.append(f'    name: "{esc(p["name"])}",')
    out.append(f'    brand: "{p["brand"]}",')
    out.append(f'    category: "{p["category"]}",')
    out.append(f'    price: {p["price"]},')
    out.append(f'    image: "{p["image"]}",')
    out.append(f'    description: "{esc(p["description"])}",')
    if specs:
        out.append(f"    specs: {specs_s},")
    if p.get("line"):
        out.append(f"    line: {line_s},")
    out.append("  },")
out.append("];")
out.append("")
out.append("export const categoryImages: Record<Category, string> = {")
cat_img = {
    "Облицовки": "img.granite.workshopRack",
    "Порталы": "img.granite.workshopPolished",
    "Топки": "img.hero",
    "Печи": "img.granite.warehouseSteps",
    "Камины": "img.granite.workshopPolished",
    "Каминокомплекты": "img.granite.workshopPavers",
    "Биокамины": "img.granite.textureSample",
    "Камень": "img.granite.slabPolished",
    "Дымоходы": "img.montage",
}
for c in categories:
    out.append(f'  "{c}": {cat_img[c]},')
out.append("};")
out.append("")
out.append(
    """export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}
"""
)

OUT.write_text("\n".join(out), encoding="utf-8")
print(f"Wrote {len(products)} products to {OUT}")

#!/usr/bin/env python3
"""
Создаёт iPhone 18 Pro и 18 Pro Max через API phoneStore.

Цвета и объёмы памяти — с официальной страницы Apple.
Форма options/variants повторяет то, что шлёт админка (components/CreateProduct),
включая написание optionsIds/optionsInfo — витрина читает именно его,
а не optionIds/optionInfo из backend DTO.

Запуск:
  python3 create-iphone18.py --dry-run
  python3 create-iphone18.py --base https://xn----jtbnc0ao.xn--p1ai
"""

import argparse, itertools, json, mimetypes, os, ssl, sys, uuid
from urllib import request, parse, error

# Python с python.org не подхватывает системный keychain — берём CA явно.
def _ssl_ctx():
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        pass
    for ca in ("/etc/ssl/cert.pem", "/private/etc/ssl/cert.pem"):
        if os.path.exists(ca):
            return ssl.create_default_context(cafile=ca)
    return ssl.create_default_context()

SSL_CTX = _ssl_ctx()

IMG_DIR = os.path.expanduser("~/Downloads/squared")
CACHE = os.path.expanduser("~/.cache/phonestore-uploads.json")

LOGIN = os.environ.get("PS_LOGIN", "admin")
PASSWORD = os.environ.get("PS_PASSWORD", "")

# --- каталог -----------------------------------------------------------------

# Названия — как у Apple и как принято в этом каталоге (Cosmic Orange, Deep Blue...).
# Hex снят пипеткой с самих рендеров.
PRO_COLORS = [
    ("Black",    "#222224", "iphone-18-pro-finish-select-202609-6-3inch-black.png"),
    ("Silver",   "#DCDDDC", "iphone-18-pro-finish-select-202609-6-3inch-silver.png"),
    ("Glacier",  "#AFBCCE", "iphone-18-pro-finish-select-202609-6-3inch-glacier.png"),
    ("Burgundy", "#4C2D33", "iphone-18-pro-finish-select-202609-6-3inch-burgundy.png"),
]

DUO_COLORS = [
    ("Night Sky",  "#47515B", "iphone-duo-finish-select-202609-nightsky.png"),
    ("Star White", "#F6F4F4", "iphone-duo-finish-select-202609-starwhite.png"),
]

STORAGES = ["256 ГБ", "512 ГБ", "1 ТБ", "2 ТБ"]

AIRPODS_IMG = "airpods-5-select-202609_FV1.png"

# Apple Watch Series 12: 8 отделок корпуса. Hex подобран под название —
# как это уже сделано в каталоге у Apple Watch 11 (#808080 Space Gray и т.п.),
# снять пипеткой нельзя: во фронтальном ракурсе боковина корпуса почти не видна.
S12_ALUMINIUM = [
    ("Black",       "#1D1D1F", "aluminum-black"),
    ("Space Gray",  "#52565A", "aluminum-space-gray"),
    ("Dark Bronze", "#6E5849", "aluminum-darkbronze"),
    ("Light Gold",  "#E8D4B8", "aluminum-lightgold"),
]

S12_TITANIUM = [
    ("Natural",      "#C6C2B7", "titanium-natural"),
    ("Radiant Gold", "#D9B47C", "titanium-radiantgold"),
]

# Керамика крупнее: 43/47 мм против 42/46 у алюминия и титана.
# В именах файлов Apple стоит 46mm — это ярлык группы в селекторе, не размер корпуса.
S12_CERAMIC = [
    ("Night Blue",  "#2C3A4F", "ceramic-nightblue"),
    ("Pearl White", "#F2F1EE", "ceramic-pearlwhite"),
]

# Ultra 4: корпус один (натуральный титан), различаются ремешки.
# Hex снят пипеткой с самих ремешков. Названия описательные:
# в спецификации Apple перечня ремешков нет, официально упомянут только
# «translucent gray Ocean Band».
ULTRA_SUFFIX = ("_VW_34FR+watch-case-49-titanium-natural-ultra4"
                "_VW_34FR+watch-face-49-ultra4_VW_34FR_GEO_US.webp")
# Сгруппировано по типу ремешка — каждый тип отдельной карточкой,
# как уже заведён Ultra 3 с миланской петлёй. Названия типов — русские
# официальные, цвета описательные (перечня ремешков в спецификации нет).
ULTRA_MILANESE = [
    ("Natural",           "#898179", "MK0A4ref"),
]

ULTRA_ALPINE = [
    ("Rust",              "#4C2721", "MK7D4ref"),
    ("Tan",               "#7A5A3C", "MK7G4ref"),
]

ULTRA_TRAIL = [
    ("Dark Olive",        "#2A2522", "MK794ref"),
    ("Burgundy",          "#3C121C", "MK8G4ref"),
    ("Brown",             "#3B251B", "MK8J4ref"),
    ("Tan",               "#947B60", "MK8M4ref"),
]

ULTRA_OCEAN = [
    ("Translucent Gray",  "#A39E93", "MK7K4"),
    ("Olive",             "#756C51", "MK7M4"),
    ("Dark Gray",         "#4B4C47", "MK7P4"),
]


def s12_axis(finishes):
    return {"name": "цвет", "type": "color", "items": [
        (n, hx, f"s12-case-size-select-202609-{slug}-46mm.webp")
        for n, hx, slug in finishes]}


def ultra_axis(bands):
    return {"name": "Цвет ремешка", "type": "color", "items": [
        (n, hx, code + ULTRA_SUFFIX) for n, hx, code in bands]}


def color_axis(colors):
    """Ось «цвет»: подписи, hex и файл картинки для каждого варианта."""
    return {"name": "цвет", "type": "color",
            "items": [(n, hexv, f) for n, hexv, f in colors]}


# Ось без картинок — файл None, картинку вариант берёт из model["image"].
MEM_AXIS = {"name": "объем памяти", "type": "list",
            "items": [(s, s, None) for s in STORAGES]}

# Два варианта AirPods 5 различаются зарядным кейсом (проводной / беспроводной).
CASE_AXIS = {"name": "зарядный кейс", "type": "list", "items": [
    ("USB-C", "USB-C", None),
    ("USB-C + беспроводная зарядка", "USB-C + беспроводная зарядка", None),
]}

# доплата за объём относительно базовой цены
STORAGE_UPLIFT = {"256 ГБ": 0, "512 ГБ": 0, "1 ТБ": 0, "2 ТБ": 0}

DESC_PRO = (
    "{name} — {screen}, OLED-дисплей, чип A20 Pro, титановый корпус. "
    "Система камер Pro с телеобъективом. Цвета: {colors}."
)

DESC_S12 = (
    "{name}. Дисплей Always-On Retina, корпус {screen}. Цвета: {colors}."
)

DESC_ULTRA = (
    "{name}. Корпус 49 мм из титана Grade 5 — самый прочный и автономный "
    "Apple Watch. Цвета ремешка: {colors}."
)

DESC_AIRPODS = (
    "{name} — беспроводные наушники Apple с активным шумоподавлением "
    "и поддержкой Siri. Доступны с проводным и с беспроводным зарядным кейсом."
)

DESC_DUO = (
    "{name} — складной смартфон Apple. Внутренний экран {screen}, "
    "внешний 5,4 дюйма, оба OLED. Цвета: {colors}."
)

MODELS = [
    # idBase фиксирован: id опций должны быть стабильны между запусками,
    # иначе корзины и заказы со старыми optionsIds перестанут сходиться.
    {"name": "iPhone 18 Pro",     "base": 0, "screen": "6,3 дюйма", "idBase": 1800000,
     "desc": DESC_PRO, "axes": [MEM_AXIS, color_axis(PRO_COLORS)]},
    {"name": "iPhone 18 Pro Max", "base": 0, "screen": "6,9 дюйма", "idBase": 1810000,
     "desc": DESC_PRO, "axes": [MEM_AXIS, color_axis(PRO_COLORS)]},
    {"name": "iPhone Duo",        "base": 0, "screen": "7,6 дюйма", "idBase": 1820000,
     "desc": DESC_DUO, "axes": [MEM_AXIS, color_axis(DUO_COLORS)]},
    {"name": "AirPods 5",         "base": 0, "screen": "",          "idBase": 1830000,
     "desc": DESC_AIRPODS, "image": AIRPODS_IMG, "axes": [CASE_AXIS]},
    {"name": "Apple Watch Series 12 46 мм, корпус из алюминия", "base": 0,
     "screen": "46 мм", "idBase": 1840000, "desc": DESC_S12,
     "axes": [s12_axis(S12_ALUMINIUM)], "priceDependOnColor": False},
    {"name": "Apple Watch Series 12 46 мм, корпус из титана", "base": 0,
     "screen": "46 мм", "idBase": 1860000, "desc": DESC_S12,
     "axes": [s12_axis(S12_TITANIUM)], "priceDependOnColor": False},
    {"name": "Apple Watch Series 12 47 мм, корпус из керамики", "base": 0,
     "screen": "47 мм", "idBase": 1870000, "desc": DESC_S12,
     "axes": [s12_axis(S12_CERAMIC)], "priceDependOnColor": False},
    {"name": "Apple Watch Ultra 4 49 мм, корпус из натурального титана, миланская петля", "base": 0, "screen": "49 мм",
     "idBase": 1850000, "desc": DESC_ULTRA,
     "axes": [ultra_axis(ULTRA_MILANESE)], "priceDependOnColor": False},
    {"name": "Apple Watch Ultra 4 49 мм, корпус из натурального титана, альпийская петля", "base": 0, "screen": "49 мм",
     "idBase": 1852000, "desc": DESC_ULTRA,
     "axes": [ultra_axis(ULTRA_ALPINE)], "priceDependOnColor": False},
    {"name": "Apple Watch Ultra 4 49 мм, корпус из натурального титана, трейловая петля", "base": 0, "screen": "49 мм",
     "idBase": 1854000, "desc": DESC_ULTRA,
     "axes": [ultra_axis(ULTRA_TRAIL)], "priceDependOnColor": False},
    {"name": "Apple Watch Ultra 4 49 мм, корпус из натурального титана, океанский ремешок", "base": 0, "screen": "49 мм",
     "idBase": 1856000, "desc": DESC_ULTRA,
     "axes": [ultra_axis(ULTRA_OCEAN)], "priceDependOnColor": False},
]

# --- http --------------------------------------------------------------------

class Api:
    def __init__(self, base, timeout=30):
        self.base = base.rstrip("/") + "/api/v1"
        self.token = None
        self.timeout = timeout

    def _req(self, method, path, data=None, headers=None, raw=None, ctype=None):
        url = f"{self.base}{path}"
        h = {"Accept": "application/json"}
        if self.token:
            h["Authorization"] = f"Bearer {self.token}"
            h["Cookie"] = f"_jwt1={self.token}"
        if headers:
            h.update(headers)
        body = raw
        if data is not None:
            body = json.dumps(data).encode()
            h["Content-Type"] = "application/json"
        if ctype:
            h["Content-Type"] = ctype
        req = request.Request(url, data=body, headers=h, method=method)
        try:
            with request.urlopen(req, timeout=self.timeout, context=SSL_CTX) as r:
                txt = r.read().decode()
                return json.loads(txt) if txt else None
        except error.HTTPError as e:
            raise SystemExit(f"✗ {method} {path} -> {e.code}: {e.read().decode()[:400]}")
        except Exception as e:
            raise SystemExit(f"✗ {method} {path} -> {e}\n  Сеть до {self.base} недоступна?")

    def login(self, login, password):
        r = self._req("POST", "/auth/login", {"login": login, "password": password})
        self.token = r["accessToken"]
        return self.token

    def categories(self):
        return self._req("GET", "/category")

    def products(self):
        return self._req("GET", "/product")

    def upload(self, path):
        """multipart/form-data с полем file — как ждёт FileInterceptor('file')."""
        boundary = uuid.uuid4().hex
        fname = os.path.basename(path)
        mime = mimetypes.guess_type(fname)[0] or "application/octet-stream"
        with open(path, "rb") as f:
            payload = f.read()
        body = b"".join([
            f"--{boundary}\r\n".encode(),
            f'Content-Disposition: form-data; name="file"; filename="{fname}"\r\n'.encode(),
            f"Content-Type: {mime}\r\n\r\n".encode(),
            payload, b"\r\n", f"--{boundary}--\r\n".encode(),
        ])
        return self._req("POST", "/storage", raw=body,
                         ctype=f"multipart/form-data; boundary={boundary}")

    def create_product(self, payload):
        return self._req("POST", "/product", payload)


# --- сборка ------------------------------------------------------------------

def build(model, category_uuid, image_urls, sort_start):
    """Оси опций -> декартово произведение -> variants.

    id раскладываются как idBase + 100*номер_оси + номер_элемента,
    варианты — от idBase+1000. Внутри товара стабильно между запусками.
    """
    base_id = model["idBase"]
    axes = model["axes"]

    options = []
    for ai, ax in enumerate(axes):
        items = [{"id": base_id + 100 * ai + k, "type": ax["type"],
                  "name": label, "value": value}
                 for k, (label, value, _) in enumerate(ax["items"])]
        options.append({"name": ax["name"], "type": ax["type"], "items": items})

    default_img = image_urls.get(model.get("image", ""))

    variants = []
    for n, combo in enumerate(itertools.product(*[range(len(ax["items"])) for ax in axes])):
        img = None
        for ai, k in enumerate(combo):
            fname = axes[ai]["items"][k][2]
            if fname and image_urls.get(fname):
                img = image_urls[fname]
        img = img or default_img
        variants.append({
            "id": base_id + 1000 + n,
            "optionsIds": [options[ai]["items"][k]["id"] for ai, k in enumerate(combo)],
            "optionsInfo": {
                "price": model["base"],
                "images": [img] if img else [],
                "oldPrice": 0,
            },
            "isDefault": n == 0,
        })

    color_ax = next((ax for ax in axes if ax["type"] == "color"), None)
    colors_str = ", ".join(i[0] for i in color_ax["items"]) if color_ax else ""
    return {
        "categoryUUID": category_uuid,
        "name": model["name"],
        "description": model["desc"].format(name=model["name"],
                                            screen=model["screen"], colors=colors_str),
        "price": model["base"],
        "priceOld": 0,
        "sortValue": sort_start,
        "visible": True,
        "images": [],
        "priceDependOnColor": model.get("priceDependOnColor", True),
        "options": options,
        "variants": variants,
    }


def pick_category(cats, override):
    rows = cats if isinstance(cats, list) else cats.get("rows", [])
    if override:
        return override
    for needle in ("iphone", "айфон", "apple", "смартфон", "телефон"):
        for c in rows:
            if needle in str(c.get("name", "")).lower():
                return c["uuid"]
    print("\nНе смог выбрать категорию автоматически. Доступные:")
    for c in rows:
        print(f"  {c.get('uuid')}  {c.get('name')}")
    raise SystemExit("Укажи явно: --category-uuid <UUID>")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="https://xn----jtbnc0ao.xn--p1ai")
    ap.add_argument("--category-uuid")
    ap.add_argument("--only", help="подстрока имени: создать только совпавшие")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    if a.dry_run:
        sel = [m for m in MODELS if not a.only or a.only.lower() in m["name"].lower()]
        payloads = [build(m, a.category_uuid or "<CATEGORY_UUID>", {}, 100 + i)
                    for i, m in enumerate(sel)]
        for p in payloads:
            print(f"\n=== {p['name']} ===")
            print(f"  цена от {p['price']:,} ₽".replace(",", " "))
            print(f"  опций: {len(p['options'])}, вариантов: {len(p['variants'])}")
            for v in p["variants"][:3]:
                print(f"    {v['optionsIds']} -> {v['optionsInfo']['price']:,} ₽".replace(",", " "))
            print(f"    ... ещё {len(p['variants'])-3}")
        print("\n--- полный payload первого товара ---")
        print(json.dumps(payloads[0], ensure_ascii=False, indent=2)[:1800])
        return

    if not PASSWORD:
        raise SystemExit("Задай пароль: export PS_PASSWORD='...'")

    api = Api(a.base)
    api.login(LOGIN, PASSWORD)
    print(f"✓ авторизован как {LOGIN}")

    existing = {p.get("name") for p in (api.products() or [])}
    sel = [m for m in MODELS if not a.only or a.only.lower() in m["name"].lower()]
    todo = [m for m in sel if m["name"] not in existing]
    if not todo:
        print("Всё уже создано, ничего не делаю.")
        return
    for m in sel:
        if m["name"] in existing:
            print(f"  пропускаю (уже есть): {m['name']}")

    cat = pick_category(api.categories(), a.category_uuid)
    print(f"✓ категория {cat}")

    cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    urls = {}
    needed = {f for m in todo for ax in m["axes"] for _, _, f in ax["items"] if f}
    needed |= {m["image"] for m in todo if m.get("image")}
    for fname in sorted(needed):
        if fname in cache:
            urls[fname] = cache[fname]
            print(f"  из кеша: {fname}")
            continue
        path = os.path.join(IMG_DIR, fname)
        if not os.path.exists(path):
            print(f"  ! нет файла {path} — вариант останется без картинки")
            continue
        r = api.upload(path)
        urls[fname] = r["full"]
        cache[fname] = r["full"]
        print(f"  загружено: {fname} -> {r['full']}")
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    json.dump(cache, open(CACHE, "w"), ensure_ascii=False, indent=1)

    for i, m in enumerate(todo):
        res = api.create_product(build(m, cat, urls, 100 + i))
        print(f"✓ создан {m['name']}: uuid={res.get('uuid')} slug={res.get('slug')}")


if __name__ == "__main__":
    main()

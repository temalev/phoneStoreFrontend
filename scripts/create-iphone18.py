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

import argparse, json, mimetypes, os, ssl, sys, uuid
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

# доплата за объём относительно базовой цены
STORAGE_UPLIFT = {"256 ГБ": 0, "512 ГБ": 0, "1 ТБ": 0, "2 ТБ": 0}

DESC_PRO = (
    "{name} — {screen}, OLED-дисплей, чип A20 Pro, титановый корпус. "
    "Система камер Pro с телеобъективом. Цвета: {colors}."
)

DESC_DUO = (
    "{name} — складной смартфон Apple. Внутренний экран {screen}, "
    "внешний 5,4 дюйма, оба OLED. Цвета: {colors}."
)

MODELS = [
    # idBase фиксирован: id опций должны быть стабильны между запусками,
    # иначе корзины и заказы со старыми optionsIds перестанут сходиться.
    {"name": "iPhone 18 Pro",     "base": 0, "screen": "6,3 дюйма", "idBase": 1800000,
     "colors": PRO_COLORS, "desc": DESC_PRO},
    {"name": "iPhone 18 Pro Max", "base": 0, "screen": "6,9 дюйма", "idBase": 1810000,
     "colors": PRO_COLORS, "desc": DESC_PRO},
    {"name": "iPhone Duo",        "base": 0, "screen": "7,6 дюйма", "idBase": 1820000,
     "colors": DUO_COLORS, "desc": DESC_DUO},
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
    """options + декартово произведение цвет x память -> variants."""
    base_id = model["idBase"]

    color_items, mem_items = [], []
    colors = model["colors"]
    for i, (cname, chex, cfile) in enumerate(colors):
        color_items.append({"id": base_id + i, "type": "color", "name": cname, "value": chex})
    for j, s in enumerate(STORAGES):
        mem_items.append({"id": base_id + 100 + j, "type": "list", "name": s, "value": s})

    options = [
        {"name": "объем памяти", "type": "list",  "items": mem_items},
        {"name": "цвет",         "type": "color", "items": color_items},
    ]

    variants, n = [], 0
    for i, (cname, chex, cfile) in enumerate(colors):
        for j, s in enumerate(STORAGES):
            price = model["base"] + STORAGE_UPLIFT[s]
            variants.append({
                "id": base_id + 1000 + n,
                "optionsIds": [mem_items[j]["id"], color_items[i]["id"]],
                "optionsInfo": {
                    "price": price,
                    "images": [image_urls[cfile]] if image_urls.get(cfile) else [],
                    "oldPrice": 0,
                },
                "isDefault": n == 0,
            })
            n += 1

    return {
        "categoryUUID": category_uuid,
        "name": model["name"],
        "description": model["desc"].format(name=model["name"], screen=model["screen"],
                                            colors=", ".join(c[0] for c in colors)),
        "price": model["base"],
        "priceOld": 0,
        "sortValue": sort_start,
        "visible": True,
        "images": [],
        "priceDependOnColor": True,
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
        print("Оба товара уже есть, ничего не делаю.")
        return
    for m in sel:
        if m["name"] in existing:
            print(f"  пропускаю (уже есть): {m['name']}")

    cat = pick_category(api.categories(), a.category_uuid)
    print(f"✓ категория {cat}")

    cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    urls = {}
    needed = {c[2] for m in todo for c in m["colors"]}
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

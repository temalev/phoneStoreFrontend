#!/usr/bin/env python3
"""
Добавляет ось «SIM» (eSIM / Nano SIM + eSIM) товарам iPhone 18 Pro и 18 Pro Max —
так же, как она устроена у iPhone 17 Pro и 17 Pro Max.

Что делает:
  — дописывает третью ось опций, повторяя форму и порядок items у 17-х
    (в списке eSIM идёт первым, хотя id у него больше — так в каталоге);
  — раздваивает каждый вариант: 16 → 32. Цена, старая цена и картинки
    копируются один в один, то есть витрина не меняется ни на рубль;
  — старые id вариантов остаются за веткой «Nano SIM + eSIM», новые выдаются
    ветке eSIM. Так `isDefault` остаётся на том же сочетании памяти и цвета,
    и страница товара выбирает его как раньше.

Идемпотентен: товар, у которого ось SIM уже есть, пропускается.

Запуск:
  python3 scripts/add-sim-option.py --dry-run
  PS_PASSWORD=... python3 scripts/add-sim-option.py
  PS_PASSWORD=... python3 scripts/add-sim-option.py --only iphone-18-pro
"""

import argparse
import copy
import json
import os
import ssl
import sys
from urllib import error, request


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

LOGIN = os.environ.get("PS_LOGIN", "admin")
PASSWORD = os.environ.get("PS_PASSWORD", "")

# Слаг → база для новых id. Схема та же, что в create-iphone18.py:
# idBase + 100 * номер_оси + номер_элемента. SIM — третья ось, отсюда +200.
TARGETS = {
    "iphone-18-pro": 1800000,
    "iphone-18-pro-max": 1810000,
}

# Порядок и написание — как у 17 Pro: сначала eSIM, следом комбинированная.
SIM_ITEMS = [
    ("eSIM", "eSIM"),
    ("Nano SIM + eSIM", "Nano SIM + eSIM"),
]

SIM_AXIS_NAME = "SIM"


class Api:
    def __init__(self, base, timeout=30):
        self.base = base.rstrip("/") + "/api/v1"
        self.token = None
        self.timeout = timeout

    def _req(self, method, path, data=None):
        url = f"{self.base}{path}"
        h = {"Accept": "application/json"}
        if self.token:
            h["Authorization"] = f"Bearer {self.token}"
            h["Cookie"] = f"_jwt1={self.token}"
        body = None
        if data is not None:
            body = json.dumps(data).encode()
            h["Content-Type"] = "application/json"
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

    def products(self):
        return self._req("GET", "/product")

    def update_product(self, uuid, payload):
        return self._req("PUT", f"/product/{uuid}", payload)


def has_sim_axis(product):
    return any((o.get("name") or "").strip().lower() == "sim"
               for o in (product.get("options") or []))


def build_update(product, id_base):
    """Возвращает (payload, отчёт) — или (None, причина), если делать нечего."""
    if has_sim_axis(product):
        return None, "ось SIM уже есть"

    options = copy.deepcopy(product.get("options") or [])
    variants = copy.deepcopy(product.get("variants") or [])
    if not options or not variants:
        return None, "нет опций или вариантов — трогать нечего"

    sim_base = id_base + 100 * len(options)
    used_item_ids = {i["id"] for o in options for i in o["items"]}
    if used_item_ids & {sim_base, sim_base + 1}:
        return None, f"id {sim_base}/{sim_base + 1} уже заняты — нужна ручная разводка"

    sim_items = [
        {"id": sim_base + k, "type": "list", "name": name, "value": value}
        for k, (name, value) in enumerate(SIM_ITEMS)
    ]
    options.append({"name": SIM_AXIS_NAME, "type": "list", "items": sim_items})

    esim_id = next(i["id"] for i in sim_items if i["name"] == "eSIM")
    nano_id = next(i["id"] for i in sim_items if i["name"] == "Nano SIM + eSIM")

    # Новые id вариантов — следом за максимальным существующим, чтобы не
    # пересечься ни со старыми, ни с id элементов опций.
    next_id = max(v["id"] for v in variants) + 1

    new_variants = []
    for v in variants:
        # Ветка Nano SIM + eSIM наследует id и isDefault исходного варианта:
        # страница товара выбирает вариант по isDefault, и он обязан содержать
        # id новой оси, иначе SIM останется без выбранного значения.
        keep = copy.deepcopy(v)
        keep["optionsIds"] = list(v["optionsIds"]) + [nano_id]
        new_variants.append(keep)

        clone = copy.deepcopy(v)
        clone["id"] = next_id
        next_id += 1
        clone["optionsIds"] = list(v["optionsIds"]) + [esim_id]
        clone["isDefault"] = False
        new_variants.append(clone)

    # Набор полей — как у админки (components/cardProduct/edit.vue), плюс
    # priceOld и visible: админка их не шлёт, но если бэкенд заменяет сущность
    # целиком, а не сливает поля, товар молча уедет в priceOld 0 и visible false.
    payload = {
        "name": product["name"],
        "variants": new_variants,
        "price": product.get("price", 0),
        "priceOld": product.get("priceOld", 0),
        "description": product.get("description", ""),
        "priceDependOnColor": product.get("priceDependOnColor", False),
        "images": product.get("images") or [],
        "sortValue": product.get("sortValue", 0),
        "visible": product.get("visible", True),
        "options": options,
    }
    report = {
        "было_вариантов": len(variants),
        "стало_вариантов": len(new_variants),
        "id_eSIM": esim_id,
        "id_nano": nano_id,
        "новые_id_вариантов": f"{max(v['id'] for v in variants) + 1}..{next_id - 1}",
    }
    return payload, report


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="https://xn----jtbnc0ao.xn--p1ai")
    ap.add_argument("--dry-run", action="store_true",
                    help="ничего не писать, только показать план")
    ap.add_argument("--only", action="append",
                    help="ограничиться слагом (можно повторять)")
    args = ap.parse_args()

    targets = dict(TARGETS)
    if args.only:
        unknown = set(args.only) - set(targets)
        if unknown:
            raise SystemExit(f"✗ неизвестные слаги: {', '.join(sorted(unknown))}")
        targets = {k: v for k, v in targets.items() if k in args.only}

    api = Api(args.base)
    if not args.dry_run:
        if not PASSWORD:
            raise SystemExit("✗ нет PS_PASSWORD в окружении — без него писать некуда")
        api.login(LOGIN, PASSWORD)
        print(f"✓ вход как {LOGIN}")

    products = {(p.get("slug") or p["uuid"]): p
                for p in (api.products() or []) if not p.get("isDeleted")}

    plans = []
    for slug, id_base in targets.items():
        p = products.get(slug)
        if not p:
            print(f"⚠ {slug}: не найден в каталоге, пропуск")
            continue
        payload, report = build_update(p, id_base)
        if payload is None:
            print(f"• {slug}: {report}, пропуск")
            continue
        plans.append((slug, p, payload, report))

    if not plans:
        print("Нечего делать.")
        return

    for slug, p, payload, report in plans:
        print(f"\n=== {slug} ({p['uuid']}) ===")
        for k, v in report.items():
            print(f"  {k}: {v}")
        names = {i["id"]: i["name"] for o in payload["options"] for i in o["items"]}
        print("  первые четыре варианта:")
        for v in payload["variants"][:4]:
            label = " / ".join(names.get(x, str(x)) for x in v["optionsIds"])
            price = (v.get("optionsInfo") or {}).get("price")
            star = " ★default" if v.get("isDefault") else ""
            print(f"    id {v['id']:<8} {label:<46} {price}{star}")

    if args.dry_run:
        print("\n--dry-run: ничего не записано.")
        return

    print()
    for slug, p, payload, _ in plans:
        api.update_product(p["uuid"], payload)
        print(f"✓ {slug} обновлён")

    # Перечитываем каталог: проверяем то, что реально лежит в базе, а не то,
    # что мы отправили. Ответ PUT может отличаться от сохранённого состояния.
    print("\nПроверка по свежей выдаче API:")
    fresh = {(p.get("slug") or p["uuid"]): p
             for p in (api.products() or []) if not p.get("isDeleted")}
    ok = True
    for slug, before, payload, _ in plans:
        f = fresh.get(slug)
        if not f:
            print(f"  ✗ {slug}: пропал из каталога")
            ok = False
            continue
        axes = [o["name"] for o in (f.get("options") or [])]
        n = len(f.get("variants") or [])
        want = len(payload["variants"])
        # Цены сверяем поштучно: раздвоение вариантов не должно ничего сдвинуть.
        was_prices = sorted((v.get("optionsInfo") or {}).get("price") or 0
                            for v in (before.get("variants") or []))
        now_prices = sorted((v.get("optionsInfo") or {}).get("price") or 0
                            for v in (f.get("variants") or []))
        prices_ok = now_prices == sorted(was_prices * 2)
        checks = {
            "ось SIM": has_sim_axis(f),
            f"вариантов {want}": n == want,
            "цены удвоились без сдвига": prices_ok,
            "visible": bool(f.get("visible")),
            "категория на месте": f.get("categoryUUID") == before.get("categoryUUID"),
        }
        bad = [k for k, v in checks.items() if not v]
        if bad:
            ok = False
            print(f"  ✗ {slug}: оси {axes}, вариантов {n} — не сошлось: {', '.join(bad)}")
        else:
            print(f"  ✓ {slug}: оси {axes}, вариантов {n}, цены и видимость целы")
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()

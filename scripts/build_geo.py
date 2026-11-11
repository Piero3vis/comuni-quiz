#!/usr/bin/env python3
"""Genera data/geo.json da data/map.json: comuni confinanti, mare dei comuni costieri, comuni delle isole.

  seas  i sei mari: Ligure, Tirreno, Ionio, Adriatico, Canale di Sicilia, Mar di Sardegna
  sea   per ogni comune l'indice del mare (-1 per i comuni non costieri, cioe' non in map.co)
  nb    per ogni comune i confinanti con indice maggiore, come differenze positive (j - i): la lista completa si ricava in app.js
  ins   indici dei comuni delle isole: non collegati alla penisola, tranne l'exclave di Campione d'Italia

Due comuni confinano se i loro confini in map.json hanno almeno un segmento in comune (mapshaper semplifica i confini condivisi
allo stesso modo da entrambi i lati). Un segmento che appartiene a un solo comune sta sul bordo esterno: per i comuni costieri
e' la costa, e ogni tratto si assegna a un mare con le regole di sea_of(); vince il mare con la costa piu' lunga.
Va rieseguito dopo ogni rigenerazione di data/map.json.

Requisiti: Python 3.9+, solo libreria standard.
Uso:  python3 scripts/build_geo.py [--out data/geo.json]
"""
import argparse
import json
import math
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
K = math.cos(math.radians(41.9))  # stessa proiezione di build_data.py: x = lon*K*800, y = -lat*800
SEAS = ["Ligure", "Tirreno", "Ionio", "Adriatico", "Canale di Sicilia", "Mar di Sardegna"]
L, T, I, A, C, S = range(len(SEAS))
ADRIATIC = {"Friuli-Venezia Giulia", "Veneto", "Emilia-Romagna", "Marche", "Abruzzo", "Molise"}
EXCLAVES = {"Campione d'Italia"}           # staccata dall'Italia, ma non un'isola
OVERRIDE = {"Messina": I}                  # costa per meta' tirrenica, ma citta' e porto sono sullo Stretto
# comuni di riferimento: lo script si ferma se le regole li assegnano a un altro mare
CHECK = {"Rimini": A, "Napoli": T, "Taranto": I, "Genova": L, "Palermo": T, "Catania": I, "Agrigento": C, "Alghero": S,
         "Olbia": T, "Livorno": L, "Follonica": T, "Gallipoli": I, "Otranto": A, "Reggio di Calabria": I,
         "Villa San Giovanni": T, "Messina": I, "Milazzo": T, "Cagliari": T, "Mazara del Vallo": C, "Porto Torres": S}


def sea_of(lon, lat, reg, prov):
    """Mare di un tratto di costa. Punti di confine: Piombino, Santa Maria di Leuca, Stretto di Messina (Capo Peloro),
    Capo Passero, Capo Lilibeo, Capo Teulada; la Calabria si divide per provincia e longitudine."""
    if reg == "Liguria":
        return L
    if reg == "Toscana":
        return L if lat >= 42.96 else T                      # Piombino
    if reg in ("Lazio", "Campania"):
        return T
    if reg in ADRIATIC:
        return A
    if reg == "Basilicata":
        return T if prov == "PZ" else I                      # Maratea / costa ionica di Matera
    if reg == "Puglia":
        if prov == "TA":
            return I
        if prov == "LE":
            return I if lon < 18.36 and lat < 40.32 else A   # Santa Maria di Leuca
        return A
    if reg == "Calabria":
        if prov == "VV":
            return T
        if prov == "KR":
            return I
        if prov == "CS":
            return T if lon < 16.25 else I
        if prov == "CZ":
            return T if lon < 16.40 else I
        return T if lon < 15.98 and lat > 38.19 else I       # RC: da Villa San Giovanni a nord Tirreno, Reggio e oltre Ionio
    if reg == "Sicilia":
        if lon > 15.5:
            return T if lat >= 38.25 else I                  # Capo Peloro
        if lon >= 15.05 and lat < 38.08:
            return I                                         # costa orientale fino a Capo Passero
        if lat >= 37.93 or (lon < 12.55 and lat >= 37.78):
            return T                                         # costa nord e ovest fino a Capo Lilibeo
        return C
    if reg == "Sardegna":
        return T if lon > 9.15 or (lat < 39.30 and lon > 8.64) else S   # costa est e sud fino a Capo Teulada
    raise ValueError(f"regione senza mare: {reg}")


def rings(path):
    for seg in path.split("z"):
        if not seg:
            continue
        m = re.match(r"^M(-?\d+) (-?\d+)l?(.*)$", seg)
        x, y = int(m.group(1)), int(m.group(2))
        pts = [(x, y)]
        v = m.group(3).split()
        for k in range(0, len(v) - 1, 2):
            x += int(v[k])
            y += int(v[k + 1])
            pts.append((x, y))
        if pts[0] != pts[-1]:
            pts.append(pts[0])
        yield pts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "data" / "geo.json"))
    args = ap.parse_args()
    m = json.loads((ROOT / "data" / "map.json").read_text(encoding="utf-8"))
    n = len(m["n"])

    owners = defaultdict(set)
    for i, path in enumerate(m["d"]):
        for pts in rings(path):
            for a, b in zip(pts, pts[1:]):
                if a != b:
                    owners[(a, b) if a < b else (b, a)].add(i)
    adj = [set() for _ in range(n)]
    outer = defaultdict(list)
    for seg, own in owners.items():
        if len(own) == 1:
            outer[next(iter(own))].append(seg)
        for a in own:
            adj[a] |= own - {a}

    # gruppi collegati: il piu' grande e' la penisola
    group, sizes = [-1] * n, []
    for s in range(n):
        if group[s] < 0:
            group[s], stack, size = len(sizes), [s], 0
            while stack:
                u = stack.pop()
                size += 1
                for v in adj[u]:
                    if group[v] < 0:
                        group[v] = len(sizes)
                        stack.append(v)
            sizes.append(size)
    main_group = max(range(len(sizes)), key=lambda g: sizes[g])
    ins = [i for i in range(n) if group[i] != main_group and m["n"][i] not in EXCLAVES]

    sea = [-1] * n
    for i in m["co"]:
        reg, prov = m["regs"][m["r"][i]], m["p"][i]
        w = [0.0] * len(SEAS)
        for (x1, y1), (x2, y2) in outer[i]:
            w[sea_of((x1 + x2) / 2 / (K * 800), -(y1 + y2) / 2 / 800, reg, prov)] += math.hypot(x2 - x1, y2 - y1)
        if not any(w):
            sys.exit(f"comune costiero senza costa: {m['n'][i]}")
        best = max(range(len(SEAS)), key=lambda k: (w[k], -k))
        second = max((k for k in range(len(SEAS)) if k != best), key=lambda k: w[k])
        if w[second] > 0.15 * sum(w):
            print(f"  costa su due mari: {m['n'][i]} ({prov}) {SEAS[best]} {w[best] / sum(w):.0%}, {SEAS[second]} {w[second] / sum(w):.0%}")
        sea[i] = OVERRIDE.get(m["n"][i], best)

    wrong = [f"{nm}: {SEAS[sea[m['n'].index(nm)]]} invece di {SEAS[s]}" for nm, s in CHECK.items() if sea[m["n"].index(nm)] != s]
    if wrong:
        sys.exit("mari non attesi: " + "; ".join(wrong))

    data = {"seas": SEAS, "sea": sea, "nb": [sorted(j - i for j in adj[i] if j > i) for i in range(n)], "ins": ins}
    Path(args.out).write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    counts = {SEAS[k]: sea.count(k) for k in range(len(SEAS))}
    print(f"{n} comuni, {sum(map(len, adj)) // 2} coppie di confinanti, {len(ins)} comuni sulle isole, costieri: {counts} -> {args.out}")


if __name__ == "__main__":
    main()

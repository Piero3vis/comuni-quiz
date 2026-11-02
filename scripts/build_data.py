#!/usr/bin/env python3
"""Rigenera data/map.json a partire dai dati sorgente.

Passi:
  1. scarica i confini dei comuni (openpolis/geojson-italy) e quelli degli Stati (Natural Earth) in scripts/cache/
  2. semplifica i comuni con mapshaper e ne ricava i contorni di regioni e province (dissolve)
  3. proietta (equirettangolare, scala con cos(41.9 gradi)) e comprime i poligoni in stringhe SVG relative a interi
  4. calcola i comuni costieri (bordo esterno dell'Italia meno i confini di terra con gli Stati vicini)
  5. scrive data/map.json

Requisiti: Python 3.9+, `pip install shapely`, Node.js (usa `npx mapshaper`).
Uso:  python3 scripts/build_data.py [--out data/map.json]
"""
import argparse
import json
import math
import shutil
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "scripts" / "cache"

URL_COMUNI = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_municipalities.geojson"
URL_NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson"

SIMPLIFY = "4%"          # piu' basso = file piu' piccolo e forme piu' rozze
SCALE = 800              # unita' per grado: 1 unita' ~ 140 m
K = math.cos(math.radians(41.9))

# Regioni senza mare: i falsi positivi lungo i confini alpini si scartano.
NO_SEA_REGIONS = {"Piemonte", "Lombardia", "Valle d'Aosta/Vallée d'Aoste", "Trentino-Alto Adige/Südtirol"}
# Comuni liguri di confine con la Francia che il calcolo geometrico conta per errore.
NOT_COASTAL = {"Airole", "Olivetta San Michele", "Pigna", "Rocchetta Nervina", "Triora"}
NEIGHBOURS = ("FRA", "CHE", "AUT", "SVN", "SMR", "VAT", "MCO")
BORDER_BUFFER_DEG = 0.02


def download(url, dest):
    if dest.exists():
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"scarico {url}")
    urllib.request.urlretrieve(url, dest)


def mapshaper(*args):
    exe = shutil.which("mapshaper")
    cmd = [exe] if exe else ["npx", "--yes", "mapshaper"]
    subprocess.run(cmd + list(args), check=True, cwd=CACHE)


def project(c):
    return (round(c[0] * K * SCALE), round(-c[1] * SCALE))


def ring_path(ring):
    pts = [project(c) for c in ring]
    q = [pts[0]]
    for a in pts[1:]:
        if a != q[-1]:
            q.append(a)
    if len(q) < 3:
        return None, q
    px, py = q[0]
    rel = []
    for x, y in q[1:]:
        rel.append(f"{x - px} {y - py}")
        px, py = x, y
    return f"M{q[0][0]} {q[0][1]}l" + " ".join(rel) + "z", q


def geometry_path(geom):
    polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
    out, pts_all = [], []
    for poly in polys:
        for ring in poly:
            s, q = ring_path(ring)
            if s:
                out.append(s)
                pts_all.extend(q)
    return "".join(out), pts_all


def compute_coast(features):
    from shapely.geometry import LineString, box, shape
    from shapely.ops import unary_union

    geoms = [shape(f["geometry"]).buffer(0) for f in features]
    union = unary_union(geoms)
    polys = list(union.geoms) if union.geom_type == "MultiPolygon" else [union]
    exterior = unary_union([LineString(p.exterior.coords) for p in polys])

    ne = json.load(open(CACHE / "ne.geojson"))
    window = box(5, 35, 20, 49)
    neighbours = unary_union([
        shape(f["geometry"]).buffer(0).intersection(window)
        for f in ne["features"] if f["properties"]["ADM0_A3"] in NEIGHBOURS
    ]).buffer(BORDER_BUFFER_DEG)
    coast_buf = exterior.difference(neighbours).buffer(2e-5)

    coastal = []
    for i, g in enumerate(geoms):
        props = features[i]["properties"]
        if props["reg_name"] in NO_SEA_REGIONS or props["name"] in NOT_COASTAL:
            continue
        if g.boundary.intersection(coast_buf).length > 0.002:
            coastal.append(i)
    return coastal


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "data" / "map.json"))
    args = ap.parse_args()

    download(URL_COMUNI, CACHE / "com.geojson")
    download(URL_NE, CACHE / "ne.geojson")

    mapshaper("com.geojson", "-simplify", SIMPLIFY, "keep-shapes",
              "-filter-fields", "name,prov_acr,reg_name", "-o", "precision=0.001", "out.geojson")
    mapshaper("out.geojson", "-dissolve", "reg_name", "-o", "precision=0.001", "reg.geojson")
    mapshaper("out.geojson", "-dissolve", "prov_acr", "-o", "precision=0.001", "prov.geojson")

    comuni = json.load(open(CACHE / "out.geojson"))["features"]
    regs = sorted({f["properties"]["reg_name"] for f in comuni})

    names, provs, rids, paths = [], [], [], []
    xs, ys = [], []
    for f in comuni:
        p = f["properties"]
        path, pts = geometry_path(f["geometry"])
        names.append(p["name"])
        provs.append(p["prov_acr"])
        rids.append(regs.index(p["reg_name"]))
        paths.append(path)
        xs += [x for x, _ in pts]
        ys += [y for _, y in pts]

    def outline(name):
        feats = json.load(open(CACHE / name))["features"]
        return "".join(geometry_path(f["geometry"])[0] for f in feats)

    data = {
        "n": names, "p": provs, "r": rids, "regs": regs, "d": paths,
        "bb": [min(xs), min(ys), max(xs), max(ys)],
        "rb": outline("reg.geojson"),
        "pb": outline("prov.geojson"),
        "co": compute_coast(comuni),
    }
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(names)} comuni, {len(data['co'])} costieri -> {args.out}")


if __name__ == "__main__":
    main()

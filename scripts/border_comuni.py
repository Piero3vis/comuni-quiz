#!/usr/bin/env python3
"""Elenca i comuni di confine con ciascuno Stato estero, nel formato di data/groups.json ("confini").

Un comune confina con uno Stato se un tratto del suo confine sta sul bordo esterno dell'Italia (unione di tutti i comuni,
buchi compresi: San Marino e Vaticano) entro BUFFER_DEG dallo Stato (Natural Earth, confini approssimati).
EXTRA aggiunge i comuni il cui tratto di confine estero e' troppo corto per il calcolo, confermati dal box "Comuni confinanti"
di Wikipedia (novembre 2026). I nomi doppi si scrivono "Nome (SIGLA)".

Requisiti: shapely, i file in scripts/cache/ (com.geojson da build_extra.py o build_data.py; ne.geojson si scarica).
Uso:  python3 scripts/border_comuni.py            stampa l'elenco
      python3 scripts/border_comuni.py --write    lo scrive in data/groups.json ("confini")
"""
import json
import sys
from collections import Counter
import urllib.request
from pathlib import Path

from shapely.geometry import box, shape
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "scripts" / "cache"
URL_NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson"
STATES = [("FRA", "Francia"), ("CHE", "Svizzera"), ("AUT", "Austria"), ("SVN", "Slovenia"), ("SMR", "San Marino"), ("VAT", "Città del Vaticano")]
BUFFER_DEG = 0.02     # ~2 km: assorbe l'approssimazione di Natural Earth
MIN_LEN_DEG = 0.002   # ~200 m di confine in comune, per scartare i contatti di un punto
EXTRA = {
    "Francia": [("Airole", "IM"), ("Dolceacqua", "IM")],
    "Svizzera": [("Livo", "CO"), ("Prato allo Stelvio/Prad am Stilfserjoch", "BZ"), ("Saint-Oyen", "AO"), ("Trasquera", "VB")],
    "Slovenia": [("Torreano", "UD")],
}


def main():
    ne_path = CACHE / "ne.geojson"
    if not ne_path.exists():
        print(f"scarico {URL_NE}", file=sys.stderr)
        urllib.request.urlretrieve(URL_NE, ne_path)
    feats = json.loads((CACHE / "com.geojson").read_text(encoding="utf-8"))["features"]
    geoms = [shape(f["geometry"]).buffer(0) for f in feats]
    edge = unary_union(geoms).boundary
    window = box(5, 35, 20, 49)
    ne = {f["properties"]["ADM0_A3"]: shape(f["geometry"]).buffer(0).intersection(window)
          for f in json.loads(ne_path.read_text(encoding="utf-8"))["features"]}
    dup = {n for n, c in Counter(f["properties"]["name"] for f in feats).items() if c > 1}
    out = []
    for code, name in STATES:
        near = edge.intersection(ne[code].buffer(BUFFER_DEG)).buffer(2e-5)
        hits = {(f["properties"]["name"], f["properties"]["prov_acr"]) for f, g in zip(feats, geoms)
                if g.boundary.intersection(near).length > MIN_LEN_DEG}
        extra = set(EXTRA.get(name, [])) - hits
        hits = sorted(hits | extra)
        print(f"{name}: {len(hits)} comuni ({len(extra)} da EXTRA): " + ", ".join(f"{n} ({p})" for n, p in hits), file=sys.stderr)
        out.append({"name": name, "comuni": [f"{n} ({p})" if n in dup else n for n, p in hits]})
    if "--write" in sys.argv:
        path = ROOT / "data" / "groups.json"
        groups = json.loads(path.read_text(encoding="utf-8"))
        groups["confini"] = out
        path.write_text(json.dumps(groups, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"-> {path}", file=sys.stderr)
    else:
        print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Genera data/extra.json: dati ISTAT allineati agli indici di data/map.json.

  pop  popolazione residente al 1 gennaio 2025 per ogni comune (ISTAT, POSAS 2025)
  cap  indici dei comuni capoluogo di provincia / citta' metropolitana / libero consorzio (flag dell'elenco comuni ISTAT)
  rec  indici dei comuni da record: piu' a nord/sud/est/ovest e piu' grande/piccolo (dai confini openpolis non semplificati),
       piu' e meno popoloso (da pop)

I comuni si abbinano per (nome, sigla) a openpolis (codice catastale e codice ISTAT), poi al codice catastale dell'elenco ISTAT
(flag capoluogo, codice 2017-2025) e infine al codice di POSAS 2025. I comuni gia' fusi nel 2026, assenti dall'elenco ISTAT in vigore,
usano il codice ISTAT di openpolis. Esce con errore se un comune resta senza popolazione.
Va rieseguito dopo ogni rigenerazione di data/map.json.

Requisiti: Python 3.9+, solo libreria standard, accesso a internet (i file scaricati restano in scripts/cache/).
Uso:  python3 scripts/build_extra.py [--out data/extra.json]
"""
import argparse
import csv
import io
import json
import math
import sys
import urllib.request
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_istat import URL_ISTAT, column, read_xlsx  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "scripts" / "cache"
URL_COMUNI = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_municipalities.geojson"
URL_POSAS = "https://demo.istat.it/data/posas/POSAS_2025_it_Comuni.zip"


def download(url, name):
    dest = CACHE / name
    if not dest.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        print(f"scarico {url}")
        urllib.request.urlretrieve(url, dest)
    return dest


def ring_area_km2(ring):
    """Area di un anello lon/lat in km2 (proiezione locale equivalente, sufficiente per confrontare i comuni)."""
    lat0 = math.radians(sum(c[1] for c in ring) / len(ring))
    kx, ky = 111.32 * math.cos(lat0), 110.574
    a = 0.0
    for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
        a += (x1 * kx) * (y2 * ky) - (x2 * kx) * (y1 * ky)
    return abs(a) / 2


def geometry_stats(geom):
    polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
    area, pts = 0.0, []
    for poly in polys:
        for k, ring in enumerate(poly):
            ring = [tuple(c[:2]) for c in ring]
            area += ring_area_km2(ring) * (1 if k == 0 else -1)
            pts += ring
    return area, pts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "data" / "extra.json"))
    args = ap.parse_args()

    m = json.loads((ROOT / "data" / "map.json").read_text(encoding="utf-8"))
    idx = {(n, p): i for i, (n, p) in enumerate(zip(m["n"], m["p"]))}
    N = len(m["n"])

    # openpolis: stessi confini usati per map.json, non semplificati
    feats = json.loads(download(URL_COMUNI, "com.geojson").read_text(encoding="utf-8"))["features"]
    catasto, istat_code, area = [None] * N, [None] * N, [0.0] * N
    north = south = east = west = None
    for f in feats:
        p = f["properties"]
        i = idx.get((p["name"], p["prov_acr"]))
        if i is None:
            sys.exit(f"comune openpolis non presente in map.json: {p['name']} ({p['prov_acr']})")
        catasto[i], istat_code[i] = p["com_catasto_code"], int(p["com_istat_code_num"])
        area[i], pts = geometry_stats(f["geometry"])
        lat_hi, lat_lo = max(c[1] for c in pts), min(c[1] for c in pts)
        lon_hi, lon_lo = max(c[0] for c in pts), min(c[0] for c in pts)
        if north is None or lat_hi > north[0]: north = (lat_hi, i)
        if south is None or lat_lo < south[0]: south = (lat_lo, i)
        if east is None or lon_hi > east[0]: east = (lon_hi, i)
        if west is None or lon_lo < west[0]: west = (lon_lo, i)
    if None in catasto:
        sys.exit("comuni di map.json senza confini openpolis: " + ", ".join(m["n"][i] for i in range(N) if catasto[i] is None))

    # elenco comuni ISTAT in vigore: flag capoluogo e codice 2017-2025 (quello di POSAS 2025)
    rows = read_xlsx(download(URL_ISTAT, "elenco.xlsx").read_bytes())
    h = rows[0]
    c_cat, c_cap, c_code = column(h, "Codice Catastale"), column(h, "Flag Comune capoluogo"), column(h, "Codice Comune numerico con 107 Province")
    elenco = {r[c_cat]: r for r in rows[1:] if len(r) > max(c_cat, c_cap, c_code)}
    cap, code2025, not_in_elenco = [], [], []
    for i in range(N):
        r = elenco.get(catasto[i])
        if r is None:
            not_in_elenco.append(m["n"][i])
            code2025.append(istat_code[i])
            continue
        code2025.append(int(r[c_code]))
        if r[c_cap].strip() == "1":
            cap.append(i)

    # POSAS 2025: righe per eta' (0..100) piu' una riga totale (eta' 999)
    with zipfile.ZipFile(download(URL_POSAS, "posas2025.zip")) as z:
        text = z.read(z.namelist()[0]).decode("utf-8-sig")
    lines = text.splitlines()
    reader = csv.DictReader(io.StringIO("\n".join(lines[1:])), delimiter=";")
    pop_by_code = {}
    for r in reader:
        if r["Età"] == "999":
            pop_by_code[int(r["Codice comune"])] = int(r["Totale"])
    pop = [pop_by_code.get(c) for c in code2025]
    missing = [m["n"][i] for i in range(N) if pop[i] is None]
    if missing:
        sys.exit("comuni senza popolazione: " + ", ".join(missing))

    big, small = max(range(N), key=area.__getitem__), min(range(N), key=area.__getitem__)
    most, least = max(range(N), key=pop.__getitem__), min(range(N), key=pop.__getitem__)
    rec = {"nord": north[1], "sud": south[1], "est": east[1], "ovest": west[1],
           "grande": big, "piccolo": small, "popoloso": most, "spopolato": least}

    out = {"pop": pop, "cap": cap, "rec": rec}
    Path(args.out).write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    name = lambda i: f"{m['n'][i]} ({m['p'][i]})"
    print(f"popolazione totale {sum(pop):,}; non nell'elenco ISTAT in vigore (fusi nel 2026): {', '.join(not_in_elenco) or '-'}")
    print(f"{len(cap)} capoluoghi: " + ", ".join(sorted(name(i) for i in cap)))
    for k, i in rec.items():
        extra = f"{area[i]:.2f} km2" if k in ("grande", "piccolo") else f"{pop[i]:,} ab." if k in ("popoloso", "spopolato") else ""
        print(f"  {k}: {name(i)} {extra}")
    print(f"-> {args.out}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Confronta data/map.json e i nomi delle province in app.js con l'elenco dei comuni ISTAT in vigore.

Segnala:
  - le coppie (comune, sigla provincia) presenti solo nei dati o solo nell'elenco ISTAT (fusioni, cambi di provincia, nomi)
  - i nomi delle province in app.js (PN) diversi da quelli ISTAT (solo informativo)
  - differenze tra le citta' metropolitane ISTAT e l'insieme CM in app.js
Esce con codice 1 se ci sono differenze sulle coppie (comune, sigla).

Requisiti: Python 3.9+, solo libreria standard, accesso a internet.
Uso:  python3 scripts/check_istat.py [--xlsx file-locale.xlsx]
"""
import argparse
import io
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
URL_ISTAT = "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.xlsx"
NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"

COL_NAME = "Denominazione (Italiana e straniera)"
COL_SIGLA = "Sigla automobilistica"
COL_UTS = "Denominazione dell'Unità territoriale sovracomunale"
COL_TYPE = "Tipologia di Unità territoriale sovracomunale"
TYPE_CM = "3"  # citta' metropolitana


def read_xlsx(data):
    """Prima scheda di un .xlsx come lista di righe (stringhe), senza dipendenze esterne."""
    z = zipfile.ZipFile(io.BytesIO(data))
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).iter(NS + "si"):
            shared.append("".join(t.text or "" for t in si.iter(NS + "t")))
    rows = []
    for r in ET.fromstring(z.read("xl/worksheets/sheet1.xml")).iter(NS + "row"):
        row = {}
        for c in r.iter(NS + "c"):
            col = 0
            for ch in re.match(r"[A-Z]+", c.get("r")).group():
                col = col * 26 + ord(ch) - 64
            t, v = c.get("t"), c.find(NS + "v")
            if t == "inlineStr":
                row[col - 1] = "".join(x.text or "" for x in c.iter(NS + "t"))
            elif v is not None:
                row[col - 1] = shared[int(v.text)] if t == "s" else v.text
        rows.append([row.get(i, "") for i in range(max(row) + 1)] if row else [])
    return rows


def column(header, prefix):
    for i, h in enumerate(header):
        if " ".join(h.split()).startswith(prefix):
            return i
    sys.exit(f"Colonna non trovata nel file ISTAT: {prefix!r}")


def js_const(js, name):
    m = re.search(r"const " + name + r" = (.*?);\n", js)
    if not m:
        sys.exit(f"Costante {name} non trovata in app.js")
    return m.group(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--xlsx", help="file ISTAT gia' scaricato (altrimenti lo scarica)")
    args = ap.parse_args()

    if args.xlsx:
        data = Path(args.xlsx).read_bytes()
    else:
        print(f"scarico {URL_ISTAT}")
        data = urllib.request.urlopen(URL_ISTAT, timeout=60).read()
    rows = read_xlsx(data)
    header = rows[0]
    ci = {k: column(header, k) for k in (COL_NAME, COL_SIGLA, COL_UTS, COL_TYPE)}
    istat = [{k: r[i] for k, i in ci.items()} for r in rows[1:] if len(r) > max(ci.values())]

    m = json.loads((ROOT / "data" / "map.json").read_text(encoding="utf-8"))
    ours = Counter(zip(m["n"], m["p"]))
    theirs = Counter((r[COL_NAME], r[COL_SIGLA]) for r in istat)
    only_ours, only_istat = sorted((ours - theirs).elements()), sorted((theirs - ours).elements())
    print(f"comuni: {len(m['n'])} nei dati, {len(istat)} ISTAT; province: {len(set(m['p']))} nei dati, "
          f"{len(set(r[COL_SIGLA] for r in istat))} ISTAT")
    for label, items in (("solo nei dati", only_ours), ("solo ISTAT", only_istat)):
        for name, sigla in items:
            print(f"  {label}: {name} ({sigla})")

    js = (ROOT / "app.js").read_text(encoding="utf-8")
    pn = json.loads(js_const(js, "PN"))
    official = {r[COL_SIGLA]: r[COL_UTS] for r in istat}
    for sigla in sorted(set(pn) | set(official)):
        a, b = pn.get(sigla), official.get(sigla)
        if a != b:
            bilingual = a and b and b.split("/")[0] == a
            print(f"  nome provincia {sigla}: app.js {a!r}, ISTAT {b!r}" + (" (solo informativo)" if bilingual else ""))

    cm_istat = {r[COL_SIGLA] for r in istat if r[COL_TYPE].strip() == TYPE_CM}
    cm_app = set(re.findall(r"'([A-Z]{2})'", js_const(js, "CM")))
    if cm_istat != cm_app:
        print(f"  citta' metropolitane: mancano in app.js {sorted(cm_istat - cm_app)}, in piu' {sorted(cm_app - cm_istat)}")

    if only_ours or only_istat:
        print("DIFFERENZE: aggiornare scripts/build_data.py e rigenerare data/map.json")
        sys.exit(1)
    print("OK: comuni e province coincidono con ISTAT")


if __name__ == "__main__":
    main()

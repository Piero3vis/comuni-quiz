#!/usr/bin/env python3
"""Genera dist/quiz.html: un unico file con CSS, JS e dati incorporati (si apre anche con doppio clic).

Uso:  python3 scripts/build_single_file.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
read = lambda p: (ROOT / p).read_text(encoding="utf-8")

html = read("index.html")
css = read("style.css")
js = read("app.js")
data = json.dumps(
    {"map": json.loads(read("data/map.json")), "groups": json.loads(read("data/groups.json")),
     "extra": json.loads(read("data/extra.json"))},
    ensure_ascii=False, separators=(",", ":"),
).replace("</", "<\\/")

html = html.replace('<link rel="stylesheet" href="style.css">', "<style>\n" + css + "</style>")
html = html.replace('<script src="app.js"></script>',
                    '<script id="data" type="application/json">' + data + "</script>\n<script>\n" + js + "</script>")
assert 'href="style.css"' not in html and 'src="app.js"' not in html

out = ROOT / "dist" / "quiz.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"{out} ({out.stat().st_size / 1024:.0f} KB)")

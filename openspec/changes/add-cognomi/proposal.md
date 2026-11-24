## Why

Many comuni share the end of their name with their neighbours (Pieve di Cadore, San Vito di Cadore…; Caldaro and Termeno sulla strada del vino). Collecting a whole "family" is a fun goal, and the player asked for a "VINOOH!!" achievement for the strada del vino.

## What Changes

- New list `cognomi` in `data/groups.json`: 25 groups, each `{ name, comuni, nota }`. Same historical area: sulla strada del vino (8), Agordino (9), di Cadore (19, with Vodo Cadore), Monferrato (30), Canavese (25), Sannio (22), Sabina (17), Brianza (13), Irpinia (12), Lucania (11), Lomellina (9), Cilento (8), Lario (8), Marsica (7), Polesine (6), Salento (6), Matese (5), del Grappa (5), in Chianti (4), Aspromonte (4), Gargano (4). Themes: Terme (46), ed Uniti (9), della Battaglia (5), Sopra e sotto (the 12 pairs, 24).
- Namesakes from other areas are left out: Polesine Zibello (Parma), Sannicandro di Bari, Sannicola, Canosa Sannita.
- New category **🏷️ Stesso cognome** in Geografia, after Laghi: one achievement per group (`cg:<gi>`, through `TG`), unlocked when the group is complete; the toast shows the funny `nota` ("🍷 VINOOH!!", "🥟 Casunziei par duto el Cadore!").

## Capabilities

### New Capabilities
- `cognomi`: same-surname achievements.

## Impact

`data/groups.json`, `app.js` (`withGroups`, `TG`, `achCats`, `ACHG`), `tests/smoke.js`, `CLAUDE.md`, `README.md`.

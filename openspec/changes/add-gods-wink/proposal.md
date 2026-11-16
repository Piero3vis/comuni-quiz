## Why

The strategy winks reward players who go through a theme (santi, galli, cervi, parole). Comuni named after a god are a natural, funny theme the player suggested.

## What Changes

- New secret wink **🔱 Olimpo** (`sw:dei`): three comuni named after a god, one after the other. Toast "Only Giano can judge me.", detail "Tre comuni con il nome di una divinità, di fila."
- The comuni are a fixed list (`DEI`): Giove, Collegiove, Campo di Giove, Casagiove, Portovenere, Castelvenere, Giano dell’Umbria, Giano Vetusto, Nettuno, Spigno Saturnia, Cefalà Diana, Minervino Murge, Minervino di Lecce, Ercolano. Names that only contain the letters (Martello, Martellago, Ceresole, Serdiana, Candiana, Silvano d’Orba) do not count; Apollosa and Ceres are left out as doubtful.
- Same rules as the other winks: a correct new guess outside the theme resets the streak, wrong and duplicate guesses do not; saved in `a`.

## Capabilities

### Modified Capabilities
- `streak-winks`: one more theme.

## Non-goals

- Lakes, food products and plants: possible later themes (CLAUDE.md ideas).

## Impact

`app.js` (`DEI`, `WINKS`), `tests/smoke.js`, `CLAUDE.md`. Not listed in README or DEVELOPMENT.md (secret).

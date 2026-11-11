# geo-data Specification

## Purpose
TBD - created by archiving change add-coast-and-giro-challenges. Update Purpose after archive.
## Requirements
### Requirement: Comune adjacency is generated from the map
`scripts/build_geo.py` SHALL write `data/geo.json` from `data/map.json` using only the Python standard library. Two comuni SHALL be neighbours when their boundaries share at least one segment.

#### Scenario: Known neighbours
- **WHEN** the neighbours of Bologna are read
- **THEN** they are Anzola dell'Emilia, Calderara di Reno, Casalecchio di Reno, Castel Maggiore, Castenaso, Granarolo dell'Emilia, Pianoro, San Lazzaro di Savena, Sasso Marconi and Zola Predosa

#### Scenario: Islands have no mainland neighbours
- **WHEN** the neighbours of Messina are read
- **THEN** none of them is in Calabria

#### Scenario: Data aligned to the map
- **WHEN** `data/geo.json` has a different number of comuni than `data/map.json`
- **THEN** the page fails to load with an error asking to regenerate it

### Requirement: Each coastal comune faces one sea
Every comune in `co` SHALL be assigned exactly one of Ligure, Tirreno, Ionio, Adriatico, Canale di Sicilia, Mar di Sardegna, by the majority of its coastline under the documented cut points; inland comuni have none.

#### Scenario: Reference comuni
- **WHEN** the seas are read
- **THEN** Rimini is Adriatico, Gallipoli Ionio, Villa San Giovanni Tirreno, Reggio di Calabria Ionio, Messina Ionio, Agrigento Canale di Sicilia, Alghero Mar di Sardegna, Olbia Tirreno, Livorno Ligure and Follonica Tirreno

### Requirement: Island comuni are identified
Comuni not connected through neighbours to the peninsula SHALL be marked as island comuni, except the exclave Campione d'Italia.

#### Scenario: Islands and exclave
- **WHEN** island comuni are read
- **THEN** Palermo, Cagliari, Portoferraio and Lipari are islands and Campione d'Italia and Venezia are not


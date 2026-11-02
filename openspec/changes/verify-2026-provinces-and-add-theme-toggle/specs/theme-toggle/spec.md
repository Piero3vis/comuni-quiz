## ADDED Requirements

### Requirement: Theme button cycles auto, light and dark
The top bar SHALL contain a theme button that cycles through three modes in this order: automatic (follows the OS), light, dark. In automatic mode the root element SHALL have no `data-theme` attribute. In light and dark modes `data-theme` SHALL be set to `light` or `dark`. The button SHALL show an icon for the current mode, and its Italian `aria-label`/`title` SHALL name that mode ("Tema: automatico", "Tema: chiaro", "Tema: scuro").

#### Scenario: Cycling from automatic
- **WHEN** the theme is automatic and the player clicks the theme button
- **THEN** `document.documentElement.dataset.theme` becomes `light`; a second click makes it `dark`; a third click removes the attribute

### Requirement: Theme choice is remembered
The selected mode SHALL be saved in `localStorage` under `comuniQuizTheme` (`light`, `dark`, or the key removed for automatic) and applied on the next load before the map is first drawn. Storage errors SHALL be ignored, falling back to automatic. Saved quiz progress (`comuniQuizV1`) SHALL NOT be affected.

#### Scenario: Reload keeps the theme
- **WHEN** the player selects dark and reloads the page
- **THEN** the page and the map open in dark mode

#### Scenario: Storage unavailable
- **WHEN** `localStorage` throws on read or write
- **THEN** the page loads in automatic mode and the button still switches the theme for the current session

### Requirement: Map follows the active theme
The canvas map SHALL be redrawn with the colours of the new theme as soon as the theme changes, whether through the button or, in automatic mode, through a change of the OS colour scheme.

#### Scenario: OS switches to dark during a session
- **WHEN** the theme is automatic and the OS colour scheme changes from light to dark
- **THEN** the map is redrawn with the dark-theme colours without a reload

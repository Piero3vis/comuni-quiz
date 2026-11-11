## Context

`index.html` has a footer `.foot` (data attribution + "Nessun cookie…") and a side panel `.side` with two tabs. `README.md` promises no cookies, ads or statistics; `CLAUDE.md` says no cookies, analytics or external resources; `tests/smoke.js` asserts the single file has no `<script src>` or stylesheet link. Platform research (2026, third-party comparisons, to re-check on the official pages before signing up): Ko-fi charges no platform fee on donations on its free plan, only payment-processing fees; Buy Me a Coffee takes 5% on top.

## Goals / Non-Goals

**Goals:** a gentle, always-available way to support the project; zero change to the privacy promise; one URL to maintain.

**Non-Goals:** widgets, tracking, supporter perks, end-of-game prompts, tax set-up.

## Decisions

- **Ko-fi, via a plain link.** Lowest cost per donation for a one-person hobby project. The official button/widget needs third-party script or iframe, which would break the "no external resources" rule, so the page only links out.
- **Footer + side panel only.** A full game is practically unreachable, so an end-of-game ask would almost never show. The footer is where attribution and the privacy note already are; the side panel's bottom line catches people who use the regions/achievements lists. Both are passive text.
- **No game-event triggers.** The ask never appears in toasts, popups, overlays or on milestones. People who just unlocked something are happy, but a pop-up still interrupts; the quiz's tone ("senza registrazione, senza pubblicità") is the thing worth protecting.
- **One URL.** The footer anchor `#support` holds the URL; `#supportSide` has no `href` in the HTML and `app.js` copies it at load (`$('supportSide').href = $('support').href`). The side-panel link is created hidden-safe: if the footer link is missing, the side line stays hidden.
- **`rel="noopener noreferrer"`, `target="_blank"`.** No referrer is sent to Ko-fi, and the quiz stays open in its own tab so progress is not lost to a misclick.
- **Say it is external.** The footer text states that the link opens Ko-fi, "un sito esterno", so the "nessun dato inviato" claim stays accurate: nothing is sent unless the player chooses to click.
- **FUNDING.yml.** GitHub shows a Sponsor button from `.github/FUNDING.yml` (`ko_fi: diocastoro`); free, and no change to the app.
- **Reconciling with `publishing`.** That requirement (in `add-data-licence-and-privacy-note`) says the only external URLs in the single file are ordinary footer links. This change widens it to "ordinary links: the footer ones and the support link in the side panel". If that change is archived first, edit its wording in the same PR; otherwise archive this change second.

## Risks / Trade-offs

- [Low conversion from a quiet link] → accepted; the goal is to keep the experience clean, not to maximise donations. Wording and placement can be tuned later without touching the architecture.
- [The Ko-fi page URL changes or the account is closed] → one URL in `index.html`; the smoke test checks its shape (`https://ko-fi.com/<name>`), not that it is online.
- [Platform terms and fees change] → re-check the Ko-fi fee page when setting up the account.
- [Tax treatment of tips in Italy] → outside the code; ask a commercialista before the amounts matter.
- [Forks showing the author's Ko-fi link] → README tells forks to change the URL and `FUNDING.yml`.

## 1. Prerequisites (author)

- [x] 1.1 Ko-fi page and username chosen: `https://ko-fi.com/diocastoro` (the author should still check the fee page on ko-fi.com and that PayPal or Stripe is connected)
- [ ] 1.2 Ask a commercialista how tips received through Ko-fi are treated before the amounts become significant (not a code task)

## 2. Page

- [x] 2.1 `index.html`: footer line after the privacy note: "Il quiz è gratuito e senza pubblicità. Se ti diverte, puoi <a id="support" href="https://ko-fi.com/diocastoro" target="_blank" rel="noopener noreferrer">☕ offrirmi un caffè</a> (si apre Ko-fi, un sito esterno)."
- [x] 2.2 `index.html`: inside `.side`, after the two panes, `<p class="support"><a id="supportSide" target="_blank" rel="noopener noreferrer" title="Si apre Ko-fi (sito esterno)">…</a></p>` with the text "☕ Ti piace il quiz? Offrimi un caffè", hidden by default
- [x] 2.3 `app.js`: at load, copy `#support`'s `href` into `#supportSide` and unhide the line; if `#support` is missing, leave it hidden
- [x] 2.4 `style.css`: `.support` muted, small (like `.msg`), a little top margin, `a` inherits colour with underline on hover; works in light and dark themes

## 2b. Repository

- [x] 2b.1 `.github/FUNDING.yml`: `ko_fi: diocastoro`
- [x] 2b.2 `README.md`: short "Sostieni il progetto" section (free forever, optional, link; forks change the link and FUNDING.yml)
- [x] 2b.3 `CLAUDE.md`: footer conventions: the only external links allowed are ordinary `<a>`s (attribution, and the Ko-fi support link in footer and side panel); no widgets, iframes, scripts or images from Ko-fi; the support link is never triggered by game events. `DEVELOPMENT.md`: note the "Reconciling with `publishing`" decision

## 3. Tests (`tests/smoke.js`, both variants)

- [x] 3.1 `#support` exists in `.foot`, text includes "caffè", `href` matches `^https://ko-fi\.com/[A-Za-z0-9_]+$` (fails while the placeholder is still in place), `target="_blank"`, `rel` has `noopener` and `noreferrer`
- [x] 3.2 `#supportSide` is inside `.side`, `href` equals `#support`'s, same `rel`/`target`, still there after switching tabs
- [x] 3.3 No `iframe`, no external `img`, no `script[src]`/stylesheet in the single file; `document.cookie` empty after playing
- [x] 3.4 After guessing comuni until an achievement toast appears, no toast text contains "caffè" or "Ko-fi", and `document.querySelectorAll('a[href*="ko-fi"]').length === 2`
- [x] 3.5 Existing footer checks (attribution, licence link, "Nessun cookie") still pass

## 4. Verification

- [x] 4.1 `npm test` (rebuilds `dist/quiz.html`, runs both variants)
- [ ] 4.2 Manual check on a phone: footer line and side-panel line readable in light and dark theme, links open Ko-fi in a new tab
- [x] 4.3 `openspec validate add-support-link --strict`

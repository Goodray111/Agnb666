# Learning the Web — my-site

A five-page site written from scratch for the Web Technologies course at Hainan Bielefeld
University of Applied Sciences. No framework, no build step: HTML, one stylesheet, and
JavaScript with no dependencies.

**Live:** https://goodray111.github.io/Agnb666/

## The five pages

| Page | What is on it |
| --- | --- |
| `index.html` | Hero image, an overview of the site, a short build log and what the site practises |
| `notes.html` | Three build notes, a reading-progress bar and “mark as read” |
| `quotes.html` | Eighteen quotes, search, theme filters, favourites and a random quote |
| `project.html` | Eight project ideas with status, size, skills and a plan dialog |
| `machine.html` | A useless machine that switches itself off, and a bug-catching game |

Plus `404.html`, which GitHub Pages serves for any address that does not exist.

## What each page can do

- **Notes** — the reading bar fills as you scroll; each entry has a real reading time and
  a “mark as read” button that survives a reload (`localStorage`).
- **Quotes** — search by word or author, filter by theme or by favourites, press the heart
  on a quote to keep it, and ask for a random quote.
- **Ideas** — filter by status, sort by size, open any idea for its first three steps,
  and mark one as “next up”.
- **Machine** — a switch that opens the lid, sends out a hand and turns itself off; below
  it, a thirty-second game with a score and a best score.
- **Dark theme** — one button in the header, a full set of dark tokens, the choice
  remembered, and the system preference followed when no choice has been made.

## Files

```
my-site/
├── index.html
├── notes.html
├── quotes.html
├── project.html
├── machine.html
├── 404.html
├── nav.html          the navigation, written once
├── css/style.css     one stylesheet, organised in numbered sections
├── js/
│   ├── nav.js        loads nav.html into every page and marks the current page
│   ├── main.js       reveal on scroll, back to top, footer year
│   ├── theme.js      the light/dark toggle and the remembered choice
│   ├── notes.js      reading progress, reading times, read marks
│   ├── quotes.js     search, filters, favourites, count, random quote
│   ├── projects.js   filter, sort, the plan dialog and the next-up choice
│   └── machine.js    the useless machine and the game
├── images/           hero, cover, screenshots (light and dark), icons
└── docs/             project notes, accessibility notes, hand-in checklist
```

## Run it locally

The navigation is loaded with `fetch()`, so the pages need a server — opening
`index.html` directly with `file://` will show the `<noscript>` fallback menu instead.

```bash
python -m http.server 8000
# then open http://localhost:8000
```

In VS Code, the Live Server extension does the same thing.

## How the navigation stays DRY

The markup lives in `nav.html` only. Every page has an empty `<nav id="site-nav">`
and `js/nav.js` fetches the partial, injects it, and adds `aria-current="page"` to the
link that matches `<body data-page="…">`. Changing a link means changing one file.

## Built with care

- Semantic landmarks on every page, one `h1` per page, no skipped heading levels.
- A skip link, visible focus rings, keyboard support in the game, `prefers-reduced-motion`.
- Alt text on every image; every text colour pair checked against WCAG AA.
- Three breakpoints (62rem, 46rem, 30rem); tested from 320 px to 1920 px.
- Dark theme, print styles, and a 404 page that helps instead of apologising.
- No console errors, no broken links, no placeholder text.

See [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) for what was checked and what is
still missing.

## History

Twenty-nine commits: fourteen on 8 November, seven on 9 November, six on 10 November,
plus the publishing notes.

## Author

Goodray · 2026 · course project for Web Technologies

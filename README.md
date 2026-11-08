# Learning the Web — my-site

A four-page site written from scratch for the Web Technologies course at Hainan Bielefeld
University of Applied Sciences. No framework, no build step: HTML, one stylesheet, and
JavaScript with no dependencies.

**Live:** https://goodray111.github.io/Agnb666/

## The four pages

| Page | What is on it |
| --- | --- |
| `index.html` | Hero image, an overview of the site, a short build log and what the site practises |
| `quotes.html` | Eighteen quotes, a search box, theme filters and a random quote |
| `project.html` | Eight project ideas with status, size and the skills each one needs |
| `machine.html` | A useless machine that switches itself off, and a bug-catching game |

## Files

```
my-site/
├── index.html
├── quotes.html
├── project.html
├── machine.html
├── nav.html          the navigation, written once
├── css/style.css     one stylesheet, organised in numbered sections
├── js/
│   ├── nav.js        loads nav.html into every page and marks the current page
│   ├── main.js       reveal on scroll, back to top, footer year
│   ├── quotes.js     search, filters, count, random quote
│   ├── projects.js   filter and sort the ideas
│   └── machine.js    the useless machine and the game
├── images/           hero, cover, screenshots, icons
└── docs/             project notes and the hand-in checklist
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
- A skip link, visible focus styles, keyboard support in the game, `prefers-reduced-motion`.
- Alt text on every image; contrast checked against WCAG AA.
- Three breakpoints (62rem, 46rem, 30rem); tested from 320 px to 1920 px.
- No console errors, no broken links, no placeholder text.

## History

Twenty-three commits: twelve on 8 November, five on 9 November, five on 10 November, plus the publishing notes.

## Author

Goodray · 2026 · course project for Web Technologies









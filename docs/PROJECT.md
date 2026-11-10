# Project notes — Learning the Web

## What this site is

A four-page site that documents learning web development. Every page is an excuse to
practise one part of the course: structure and semantics on the home page, lists and
searching on the quotes page, filtering and state on the ideas page, and interaction on
the machine page.

The site is deliberately small and finished. It has no framework, no build step, no
database and no accounts, and every page works on a phone.

## The fourteen items from the brief

| # | Item | Where |
| --- | --- | --- |
| 1 | Index page with a hero image and an overview of the site | `index.html` |
| 2 | Quotes page with at least 15 quotes (18) | `quotes.html` |
| 3 | DRY navigation, written once and injected with JavaScript | `nav.html`, `js/nav.js` |
| 4 | Project page with at least 5 project ideas (8) | `project.html` |
| 5 | Quotes page styled, with a hero that shows a random quote | `quotes.html`, `css/style.css` |
| 6 | Useless machine page | `machine.html` |
| 7 | Machine page with an interactive game | `machine.html`, `js/machine.js` |
| 8 | Whole site styled and finalised | every page |
| 9 | A code agent (AI) set up in VS Code | tools, see `AI-USAGE.md` |
| 10 | Git installed — `git --version` answers | environment |
| 11 | Website folder initialised — `git init` inside `my-site` | repository |
| 12 | A GitHub account | `Goodray111` |
| 13 | Remote repository connected and the code pushed | `github.com/Goodray111/my-site` |
| 14 | Site live at a real address | GitHub Pages |

## Structure

```
web-projects/
└── my-site/          <- the Git repository lives here, not one level up
    ├── .git/
    ├── index.html
    ├── quotes.html
    ├── project.html
    ├── machine.html
    ├── nav.html
    ├── css/style.css
    ├── js/*.js
    ├── images/
    └── docs/
```

## Design decisions

**One stylesheet, numbered sections.** `style.css` is organised as tokens → base →
navigation → layout → home → quotes → ideas → machine → footer/print. The tokens are
CSS custom properties, so the palette and the type scale can change in one place.

**Mobile-first breakpoints that mean something.** At 62rem the two-column hero and the
machine stack; at 46rem the navigation becomes a menu button and the cards go to one
column; at 30rem the brand text hides. Nothing else needed a breakpoint.

**Progressive enhancement.** The pages are complete HTML. JavaScript adds the shared
navigation, the filters, the random quote and the game. Without JavaScript the quotes are
still readable, the ideas are still listed, and a `<noscript>` menu replaces the injected
navigation.

**The reveal animation is opt-in.** The hidden state only applies when `<html>` has the
class `js`, which is set by a one-line script in the head. If the script fails, nothing
is hidden.

**Colour and contrast.** Ink `#0f172a` on paper `#f7f5f0` is about 16:1. The accent
`#c2410c` on paper is about 5.4:1, which passes AA for normal text. Focus rings use the
accent at 3:1 against both light and dark surfaces.

**Motion is a suggestion.** `prefers-reduced-motion` removes the machine hand, the reveal
animation and smooth scrolling, but never removes information.

## What I would change with more time

- Move the quotes into a small JSON file and render them, so adding a quote is one line.
- Add a "copy quote" button and a share link with the quote in the URL hash.
- Give the machine a second machine on the same page, or a tiny scoreboard of how often it
  switched itself off.
- Add a proper 404 page for GitHub Pages.

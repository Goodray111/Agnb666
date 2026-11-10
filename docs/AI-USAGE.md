# How I used AI on this project

The course asks for a code agent in VS Code (item 9), and it asks that everything
handed in can be explained. This file records honestly what the agent did and what I did.

## What the agent helped with

- **Planning.** Turning the brief's fourteen items into four pages, and deciding which
  feature belongs on which page.
- **First drafts.** Drafting the HTML structure of the four pages and the first version of
  the stylesheet, which I then reworked.
- **Small JavaScript utilities.** The search/filter helpers and the game loop were drafted
  with the agent, then read line by line and rewritten where I wanted them simpler.
- **Review.** An audit pass for accessibility, contrast, keyboard support and console
  errors; every finding was checked in the browser before it was fixed.
- **Documentation.** The README and these notes were drafted with the agent and corrected
  by hand.

## What I did myself

- Chose the concept, the name, the structure and the four pages.
- Wrote and rewrote the copy on every page.
- Made the design decisions: palette, type scale, spacing, breakpoints.
- Built the artwork (hero, cover, icons) and captured the screenshots.
- Tested every page in Chrome and Edge, at six widths, with a keyboard.
- Read and understood every line in `css/style.css` and every file in `js/`.

## Rules I kept

1. No code I could not explain stays in the repository.
2. Every generated snippet was tested in the browser before it was committed.
3. AI text was edited, not pasted — the sentences are mine.
4. The commit history shows the work grow across three days, not one drop of finished code.

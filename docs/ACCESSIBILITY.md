# Accessibility notes

The course asks for caring work, not perfect work. These are the things I checked, the
things I fixed, and the things I know are still missing.

## What was checked

| Check | How | Result |
| --- | --- | --- |
| Colour contrast | computed every text/background pair from the tokens | all pass WCAG AA (lowest: 4.75:1, accent on paper) |
| Focus visible | keyboard only, tabbing through every page | every interactive element shows a 3 px outline |
| Skip link | first Tab on every page | visible immediately, jumps to `#main` |
| Keyboard only | Tab / Shift+Tab / Enter / Space / Escape | all features usable except the game’s “catch” in the field, which also works with Enter |
| Dialog | open with the keyboard, Escape to close | focus moves into the dialog and returns to the button that opened it |
| Heading order | `h1` → `h2` → `h3`, no skips | every page passes |
| Images | every `<img>` has `alt` | yes; the decorative hero caption is text, not an image |
| Motion | `prefers-reduced-motion` | reveals, the machine hand and smooth scrolling switch off |
| Zoom | 200 % at 1440 px | no horizontal scrolling; cards reflow |

## What was fixed in this pass

1. **Focus rings on every control.** The first version only styled `:focus-visible` in
   general; the dark theme made the orange ring too dim. Every interactive element now
   gets an explicit 3 px ring, and the dark theme uses a lighter orange.
2. **The idea dialog ignored focus.** Opening it left focus on the page behind the
   dialog. Focus now moves to the close button, Escape closes the dialog, and focus
   returns to the “Read the plan” button that opened it.
3. **The game score was silent.** The scoreboard is now `aria-live="polite"` with
   `aria-atomic="true"`, so a screen reader hears “3 caught” instead of nothing.
4. **Printing was messy.** Notes, the reading bar and every button are hidden when the
   page is printed, so the text is what remains.
5. **The dark theme was hard-coded in JavaScript.** The theme is applied by a tiny inline
   script in `<head>` before the stylesheet loads, so there is no flash of the wrong
   colour, and the choice is remembered in `localStorage`.

## Known gaps

- I have tested with a keyboard, not with a screen reader. NVDA or VoiceOver is the next
  step, and I would expect at least one surprise there.
- The game is hard with a keyboard: the field catches the bug wherever it is, which is
  generous but not precise. A proper keyboard mode would move a cursor.
- The quote cards use `blockquote` + `cite`; a stricter reading would use a `figure` with
  a `figcaption`. The information is exposed correctly either way, but the semantics
  could be nicer.
- The mobile menu does not trap focus while open. It closes when a link is chosen, but a
  Tab can still reach the page behind it.

## How to reproduce the checks

```bash
python -m http.server 8000
# open http://localhost:8000, then:
#   Tab through the page — every stop must show a ring
#   Open an idea with Enter — focus must land in the dialog
#   Press Escape — focus must return to the button
#   Toggle the theme — the choice must survive a reload
```

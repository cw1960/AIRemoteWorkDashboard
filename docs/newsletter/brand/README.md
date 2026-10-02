# Brand assets — AI Remote Work Today

Images for Beehiiv and social sharing, built from the website's design tokens
(`src/styles/tokens.css`) so the newsletter and the dashboard look like one
family. Usage rules are in `../style-guide.md` §10.

| File            | Size      | Use                                                |
| --------------- | --------- | -------------------------------------------------- |
| `logo.png`      | 1024×1024 | Beehiiv logo, favicon, social avatars              |
| `banner.png`    | 1500×500  | Email header (top of every issue)                  |
| `thumbnail.png` | 1200×630  | Beehiiv thumbnail, link previews on social and web |

Sizes follow Beehiiv's guidance (logo 800×800 or larger, thumbnail 1200×630,
header 3:1).

## Editing

The sources are plain HTML and CSS in `src/` (one file per image, shared
styles in `src/_base.css`). Open one in Chrome at its size, then capture it
(DevTools → Device toolbar at the image's size → "Capture screenshot"), or
render it headless with Playwright. The font is Plus Jakarta Sans (SIL Open
Font License), loaded from Google Fonts; if that's unreachable, install the
font locally first or the images fall back to a system font.

Change colours in `src/_base.css` only, and keep them in step with
`src/styles/tokens.css`.

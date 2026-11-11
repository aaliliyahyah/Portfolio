# Aaliyah — Portfolio

Personal portfolio for Aaliyah Shandice R. Catolico, UI/UX Designer and Front-End Developer. Built with semantic HTML, Tailwind CSS, and vanilla JavaScript.

## Local development

Run `npm install`, `npm run build`, and `npm run dev`. Open http://127.0.0.1:5173. Use `npm run watch` while editing styles. CSS source is `src/styles.css`; commit the generated `assets/styles.css` with changes.

## Code organization and formatting

- `index.html`: page content and semantic sections.
- `src/styles.css`: Tailwind entry point and ordered stylesheet imports.
- `src/styles/`: theme and base rules (`foundation.css`), shared components, responsive defaults, layout, hero/navigation, toolkit, photocard, decorations, section styles, and final refinements. Imports retain cascade order; keep `refinements.css` last.
- `assets/script.js`: feature initializers for navigation, contact, photocard, scroll animations, pointer effects, toolkit, and background spotlight.
- `assets/*.svg`: logos, cursors, decorations, and project illustrations.
- `assets/styles.css`: generated Tailwind output; rebuild instead of editing directly.

Run `npm run format` to format the source with Prettier and `npm run format:check` to verify formatting. Configuration lives in `.prettierrc.json`; `.prettierignore` excludes dependencies and generated CSS. After changing styles, run `npm run build` and commit the generated CSS alongside the source.

## Content

About, toolkit, education, contact details, and social links use Aaliyah’s supplied information. Hero wording and supplied photos are retained. The three projects are clearly labeled sample concepts pending real project details. Profile links open in a new tab.

The contact form opens a prefilled email draft addressed to aaliyahshandicecatolico@gmail.com. Visitors review and send it in their email app. The website does not send or store messages.

## Design and interaction

Matching cherry blossom decorations, a Cupid heart cursor with an arrowhead click point, pastel colors, a fixed cherry blossom navigation, a full-screen hero, toolkit hover effects, and downward-only scroll entrances. Tap or click the About Me photocard to flip it and reveal Aaliyah’s portrait; tap again to turn it back. The button also supports Enter and Space. A dotted background spotlight responds to precise pointers; touch and reduced-motion users see a static grid. All content remains visible without JavaScript, and reduced-motion users can flip the card without animation.

Design references: [sskd.tech](https://sskd.tech/) and [Jooeun Lee](https://jooeunlee.com/). Design guidance researched from [frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) and [ui-animation](https://github.com/mblode/agent-skills/blob/main/skills/ui-animation/SKILL.md).

Publish `index.html` and `assets/` to a static host. No deployment is configured.

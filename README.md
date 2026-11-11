# Aaliyah — Portfolio

I'm Aaliyah Shandice R. Catolico, a UI/UX Designer and Front-End Developer. I built my personal portfolio with semantic HTML, Tailwind CSS, and vanilla JavaScript.

## Local development

I run `npm install`, `npm run build`, and `npm run dev`, then open http://127.0.0.1:5173 to preview my portfolio locally. I use `npm run watch` while editing styles. My CSS source is `src/styles.css`, and I commit the generated `assets/styles.css` with my changes.

## Code organization and formatting

- `index.html`: page content and semantic sections.
- `src/styles.css`: Tailwind entry point and ordered stylesheet imports.
- `src/styles/`: theme and base rules (`foundation.css`), shared components, responsive defaults, layout, hero/navigation, toolkit, photocard, decorations, section styles, and final refinements. I preserve the cascade order by keeping `refinements.css` last.
- `assets/script.js`: feature initializers for navigation, contact, photocard, scroll animations, pointer effects, toolkit, and background spotlight.
- `assets/*.svg`: logos, cursors, decorations, and project illustrations.
- `assets/styles.css`: generated Tailwind output, which I rebuild whenever I change the source styles.

I use `npm run format` to format my source with Prettier and `npm run format:check` to verify formatting. My configuration lives in `.prettierrc.json`; `.prettierignore` excludes dependencies and generated CSS. After changing styles, I run `npm run build` and commit the generated CSS alongside the source.

## Content

I share my background, toolkit, education, contact details, and social links throughout my portfolio. I use my own hero wording and photos. I showcase Student Discipline Office, Cozy Loops, and Cozy Stitch with screenshots, descriptions, technology tags, and GitHub links. I display two portrait screenshots side by side for Cozy Loops and include a link to the live Student Discipline Office application. My profile links open in a new tab.

My contact form opens a prefilled email draft addressed to aaliyahshandicecatolico@gmail.com. Visitors review and send it in their email app. My website does not send or store messages.

## Design and interaction

I designed my portfolio with matching cherry blossom decorations, a Cupid heart cursor with an arrowhead click point, pastel colors, fixed cherry blossom navigation, a full-screen hero, toolkit hover effects, and downward-only scroll entrances. I added an About Me photocard that visitors can tap or click to reveal my portrait, then tap again to turn it back. I also support Enter and Space on the button. My dotted background spotlight responds to precise pointers, while touch and reduced-motion users see a static grid. I keep all content visible without JavaScript and let reduced-motion users flip the card without animation.

I can publish `index.html` and `assets/` to a static host. I haven't configured deployment yet.

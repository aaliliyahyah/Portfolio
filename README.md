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

I share my background, toolkit, education, contact details, and social links throughout my portfolio. I use my own hero wording and photos. I showcase Student Discipline Office, Cozy Loops, and Cozy Stitch with screenshots, descriptions, technology tags, and GitHub links. I display two portrait screenshots side by side for Cozy Loops and include links to the live Student Discipline Office application and Cozy Stitch website. My profile links open in a new tab.

My contact form opens a prefilled Gmail draft in a new tab addressed to aaliyahshandicecatolico@gmail.com. Visitors sign in to Gmail if needed, then review and send it there. The contact email link also opens Gmail directly, bypassing the browser’s default email handler. My website does not send or store messages.

## Design and interaction

I designed my portfolio with matching cherry blossom decorations, a Cupid heart cursor with an arrowhead click point, pastel colors, fixed cherry blossom navigation, a full-screen hero, toolkit hover effects, and downward-only scroll entrances. Project photo compositions gently enlarge when hovered or focused with the keyboard, then return to their original size. On hover, the individual screens also keep their original upward and sideways movement, settling back when the pointer leaves. I added an About Me photocard that visitors can tap or click to reveal my portrait, then tap again to turn it back. I also support Enter and Space on the button. The photocard gently lifts and follows precise pointers with a tilt on either face, returning to rest when the pointer leaves. My dotted background spotlight responds to precise pointers, while touch users see a static grid. I keep all content visible without JavaScript.

## Deployment

Animations are always enabled, regardless of device preferences or previously saved motion settings. Mouse effects also support touchscreen laptops with an attached mouse or trackpad. Scroll entrances use CSS animations, with a scroll fallback when IntersectionObserver is unavailable, so they also work without the Web Animations API. Run `npm test` for animation compatibility regression checks.

I deploy to Vercel using the repository root as the project's Root Directory. The committed `vercel.json` selects the Other framework preset, runs `npm run build` to generate the CSS, and serves the project root (`.`), which contains `index.html` and `assets/`. The build does not create a `public/` directory.

After pushing these files to the connected Git branch, Vercel can deploy the new commit with these settings automatically.

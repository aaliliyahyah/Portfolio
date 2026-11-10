# Your Name — Developer Portfolio

A responsive pastel scrapbook portfolio built with semantic HTML, Tailwind CSS, and vanilla JavaScript. Personal details and project concepts are editable examples, not claims about a real person.

## Run locally

Requires Node.js/npm and Python 3 for the preview server.

```sh
npm install
npm run build
npm run dev
```

Open http://127.0.0.1:5173. Run `npm run watch` in another terminal while editing styles. Compiled `assets/styles.css` is included, so you can also open `index.html` directly without installing dependencies.

## Personalize

- In `index.html`, replace `Your Name`, `yourname.dev`, the introduction, example skills, education entries, goals, email display, and footer details. Update the document title and description too.
- Replace sample projects with real descriptions, screenshots, technologies, and meaningful links. Remove sample labels after replacing the content. No fake demo or source links are included.
- Replace `assets/profile.svg` with your own image and update its descriptive `alt`, width, and height. All provided SVG illustrations are original local assets.
- Set the contact form’s `data-recipient=""` attribute to your real email address, and update the visible email address. Optionally make the visible address a `mailto:` link after configuring it.
- Once configured, replace the initial `#form-status` text with “Required fields are marked with an asterisk.” The submit handler also validates the recipient at runtime.
- Theme tokens and responsive styles are in `src/styles.css`. Rebuild CSS after changing HTML classes or styles. Commit the compiled stylesheet alongside source changes.

## Contact behavior

The form checks required fields and email format. It opens a prefilled draft in the visitor’s configured email app; the visitor must send that email themselves. There is no backend, storage, or delivery confirmation. Text is preserved in the form. With an empty or example-domain recipient, a configuration message appears and no draft opens. Without JavaScript, the submit button stays disabled with an explanation.

## Included requirements

Header, navigation, About Me, Technical Skills, Educational Background, Projects, Career Goals, Contact Me, and footer. Includes heading hierarchy, paragraphs, links, ordered/unordered lists, a captioned table, labeled form controls, descriptive image alternatives, skip navigation, keyboard focus, responsive navigation, and reduced-motion support. Small screens scroll the table within its labeled container.

Google Fonts optionally supplies Bricolage Grotesque and DM Sans; system sans-serif fonts remain available offline. Everything else is served locally. Publish `index.html` and `assets/` to a static host. No hosting or analytics is configured.

## Design references and research

- [Jooeun Lee](https://jooeunlee.com/): dotted background, split hero, developer-inspired panels.
- [sskd.tech](https://sskd.tech/): expressive headings, hand-drawn accents, and distinct chapters.
- [Anthropic frontend-design skill](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md): researched for typography, composition, accessibility, and restrained motion. No external skill package was installed.
- [Tailwind CLI documentation](https://tailwindcss.com/docs/installation/tailwind-cli).

Original illustrations and a pastel palette reinterpret the references without copying their branding or images.

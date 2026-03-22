# Plainframe

Plainframe is a minimal design portfolio template for visual designers, product designers, art directors, and creative technologists.

It is built for portfolios that want strong typography, large spacing, and a simple work-first structure.

## Structure

- `content/site.js`: site-wide copy, hero text, navigation, about content, and contact info
- `content/projects/*.js`: one file per design project
- `content/projects/_template.js`: starter file for a new project
- `scripts/build.js`: generates the static site
- `assets/`: shared CSS and images
- `index.html`, `about/index.html`, `projects/index.html`, and `projects/*/index.html`: generated output

## Quick Start

```bash
npm run build
npm run preview
```

Then open [http://localhost:8889](http://localhost:8889).

## Editing Content

Most edits happen in:

- `content/site.js`
- `content/projects/*.js`

Then rebuild:

```bash
npm run build
```

## What Is Included

- A minimal homepage with a large typographic hero
- A dedicated projects index
- A short About page
- Clean project detail pages with left-column section labels
- Static output that works well on GitHub Pages

## License

MIT

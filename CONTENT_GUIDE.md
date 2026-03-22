# Content Guide

Plainframe is edited through data files, not by hand-editing generated HTML.

## 1. Site-wide content

Edit `content/site.js` for:

- site title and meta description
- nav labels and links
- homepage hero and intro
- about page content
- contact information

## 2. Projects

Each file in `content/projects/` defines one project.

Important fields:

- `slug`: output folder under `projects/`
- `title`: project title
- `year`: year shown on cards and project pages
- `discipline`: short category label
- `summary`: short homepage and index summary
- `thumbnail`: project card image
- `order`: ordering across the homepage and projects index
- `page`: full project page content

## 3. Build output

Run:

```bash
npm run build
```

This regenerates:

- `index.html`
- `about/index.html`
- `projects/index.html`
- `projects/<slug>/index.html`

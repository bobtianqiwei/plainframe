<!-- README.md developed by Bob Tianqi Wei -->
# Plainframe

Plainframe is a minimal design portfolio template.

It is made for designers who want a calm homepage, simple project pages, and an easy way to put a personal website online without learning a full web framework.

Free to use and modify. Keeping the small footer credit is appreciated.

## What This Template Looks Like

- A large homepage hero
- A visual project grid
- One page per project
- A small top pill navigation
- `CV` and `About` shown as modal panels instead of separate pages

## The Only Files You Really Need To Edit

If you want the short version, edit these files:

- `content/site.js`
- `content/projects/*.js`
- `assets/images/design/art/*`

That is enough for most people.

## Folder Guide

- `content/site.js`: your site title, intro text, section names, CV text, About text, and contact info
- `content/projects/*.js`: one file per project
- `content/projects/_template.js`: a starter file for making a new project
- `assets/images/design/art/`: your project cover images
- `assets/css/plainframe.css`: main styling
- `scripts/build.js`: generates the static HTML files
- `index.html` and `projects/*/index.html`: generated output files

## Before You Start

You need:

- Node.js installed
- A terminal
- A GitHub account if you want to publish on GitHub Pages

## First-Time Setup

Open the project folder in Terminal, then run:

```bash
npm install
npm run build
npm run preview
```

Then open:

[http://localhost:8889](http://localhost:8889)

If the page opens, the template is working.

## The Easiest Way To Customize The Site

### 1. Change the main site text

Open:

`content/site.js`

This file controls:

- site title
- homepage intro text
- section titles
- designer name
- bio
- CV content
- About modal content
- contact links

If you only want to replace the demo text with your own text, this is the main file.

### 2. Change the projects

Open:

`content/projects/`

Each `.js` file is one project.

You can edit:

- project title
- year
- discipline
- summary
- cover image path
- project page text

If you want a new project, duplicate:

`content/projects/_template.js`

Then rename it and fill in your own content.

### 3. Replace the demo images

Put your own images into:

`assets/images/design/art/`

Then update the image path in each project file inside:

`content/projects/*.js`

Important:

- Keep image file names simple
- Use `.jpg` if possible
- Compress large images before publishing

### 4. Rebuild the site

After you edit text or images, run:

```bash
npm run build
```

This updates the generated HTML files.

## A Very Simple Editing Workflow

If you do not want to think too much, follow this exact order:

1. Edit `content/site.js`
2. Replace images in `assets/images/design/art/`
3. Edit the files in `content/projects/`
4. Run `npm run build`
5. Run `npm run preview`
6. Check the site in your browser
7. Push to GitHub

## How To Put The Site Online With GitHub Pages

This project builds to plain static files, so GitHub Pages is the easiest option.

### Option A: Personal site

Use this if you want your site at:

`https://yourname.github.io`

Steps:

1. Create a GitHub repository named `yourname.github.io`
2. Put this project inside that repository
3. Run:

```bash
npm install
npm run build
```

4. Commit everything
5. Push to GitHub
6. Open the repository on GitHub
7. Go to `Settings` -> `Pages`
8. Set the source to `Deploy from a branch`
9. Choose branch `main` and folder `/ (root)`
10. Save

Then wait a minute and open:

`https://yourname.github.io`

### Option B: Project site

Use this if your repository is not named `yourname.github.io`.

Then your site URL will usually be:

`https://yourname.github.io/repository-name/`

The GitHub Pages setup steps are the same.

## How To Use Your Own Domain

If you bought a domain, do this after GitHub Pages is already working.

1. Open your GitHub repository
2. Go to `Settings` -> `Pages`
3. Add your custom domain
4. Save
5. Go to your domain provider
6. Add the DNS records GitHub Pages asks for

For `www.yourdomain.com`, this usually means:

- add a `CNAME` record
- point `www` to `yourname.github.io`

For `yourdomain.com`, GitHub usually asks for `A` records.

If you are not sure, read GitHub’s official guide before changing DNS.

## If You Are Confused, Do Only This

If you want the most foolproof version:

1. Replace the text in `content/site.js`
2. Replace the files in `assets/images/design/art/`
3. Replace the text in `content/projects/*.js`
4. Run `npm run build`
5. Push to GitHub
6. Turn on GitHub Pages

That is enough to launch the site.

## Common Mistakes

- You edited the content files but forgot to run `npm run build`
- You replaced an image but forgot to update its file path
- You used very large image files and the site became slow
- You changed generated HTML by hand instead of editing `content/site.js` or `content/projects/*.js`

## Commands You Will Actually Use

Install dependencies:

```bash
npm install
```

Build the site:

```bash
npm run build
```

Preview the site locally:

```bash
npm run preview
```

## Good To Know

- `preview` runs on port `8889`
- The site is static HTML, so you do not need a backend
- `CV` and `About` are modals, not separate pages
- Most people never need to touch `scripts/build.js`

## Suggested Use With Coding Tools

This template works well with tools like Codex, Claude Code, and Cursor.

You can ask them to:

- replace all demo text with your own content
- add projects
- rewrite your About and CV content
- compress images
- change colors and typography
- prepare the site for GitHub Pages

## References

- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [About custom domains and GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)

## License

MIT

// build.js developed by Bob Tianqi Wei
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const siteConfig = require(path.join(repoRoot, "content", "site.js"));
const projectsDir = path.join(repoRoot, "content", "projects");

function loadProjects() {
  return fs
    .readdirSync(projectsDir)
    .filter((fileName) => fileName.endsWith(".js") && !fileName.startsWith("_"))
    .sort()
    .map((fileName) => require(path.join(projectsDir, fileName)))
    .sort((a, b) => a.order - b.order);
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(relativePath, content) {
  const outputPath = path.join(repoRoot, relativePath);
  ensureDir(outputPath);
  fs.writeFileSync(outputPath, content);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getPrefix(relativePath) {
  const outputDir = path.dirname(path.join(repoRoot, relativePath));
  const relative = path.relative(outputDir, repoRoot).replace(/\\/g, "/");
  return relative || ".";
}

function resolveHref(relativePath, href) {
  if (/^(https?:|mailto:|#)/.test(href)) {
    return href;
  }

  const prefix = getPrefix(relativePath);
  return `${prefix}/${href}`.replace(/\/\.\//g, "/");
}

function resolveAsset(relativePath, assetPath) {
  const prefix = getPrefix(relativePath);
  return `${prefix}/${assetPath}`.replace(/\/\.\//g, "/");
}

function renderParagraphs(paragraphs) {
  return (paragraphs || [])
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function renderProjectLink(relativePath, project, imageClass, titleClass) {
  return `<a href="${escapeHtml(resolveHref(relativePath, `projects/${project.slug}/index.html`))}" class="work-image-link w-inline-block">
  <div class="w-layout-blockcontainer w-container"><img src="${escapeHtml(resolveAsset(relativePath, project.thumbnail))}" loading="lazy" alt="${escapeHtml(project.thumbnailAlt)}" class="${imageClass}">
    <div class="${titleClass}">${escapeHtml(project.title)}</div>
  </div>
</a>`;
}

function renderColumnProject(relativePath, project) {
  return `<div class="w-container">
  <a href="${escapeHtml(resolveHref(relativePath, `projects/${project.slug}/index.html`))}" class="project-link-block w-inline-block">
    <img src="${escapeHtml(resolveAsset(relativePath, project.thumbnail))}" loading="lazy" alt="${escapeHtml(project.thumbnailAlt)}" class="image-38">
    <div class="work-page-project-name">${escapeHtml(project.title)}</div>
  </a>
</div>`;
}

function renderHomeSection(relativePath, section, projectMap) {
  const featureRows = (section.featureRows || [])
    .map((row) => `<div class="work-essentials-columns w-row">
${row
  .map((slug) => projectMap[slug])
  .filter(Boolean)
  .map(
    (project) => `  <div class="work-column w-col w-col-6">
    ${renderProjectLink(relativePath, project, "image-100", "project-name-link")}
  </div>`
  )
  .join("\n")}
</div>`)
    .join("\n");

  const columns = (section.columns || [])
    .map((items, index) => `  <div class="column-${13 + index} w-col w-col-4">
${items
  .map((slug) => projectMap[slug])
  .filter(Boolean)
  .map((project) => `    ${renderColumnProject(relativePath, project)}`)
  .join("\n")}
  </div>`)
    .join("\n");

  return `<h1 id="${escapeHtml(section.id)}" class="works-page-heading">${escapeHtml(section.title)}</h1>
${featureRows ? `<div class="work-essentials-copy">
${featureRows}
</div>` : ""}
${columns ? `<div class="work-columns w-row">
${columns}
</div>` : ""}`;
}

function renderHomeFooter(relativePath) {
  return `<footer class="design-ekphrasis-footer">
  <div class="design-ekphrasis-footer-left">
    <a href="#works-head" class="design-ekphrasis-logo-link" aria-label="Back to hero">
      <div class="design-ekphrasis-logo-mark">P</div>
    </a>
    <div class="design-ekphrasis-wordmark">Plainframe</div>
  </div>
  <div class="design-ekphrasis-footer-center">
    <a href="#design-vision" class="design-ekphrasis-link">Vision</a>
    <a href="#design-id" class="design-ekphrasis-link">Objects</a>
    <a href="#design-software" class="design-ekphrasis-link">Interfaces</a>
    <a href="#design-installations" class="design-ekphrasis-link">Installations</a>
  </div>
  <div class="design-ekphrasis-footer-right">
    <a href="${escapeHtml(resolveHref(relativePath, "about/index.html"))}" class="design-ekphrasis-link">About</a>
    <a href="${escapeHtml(resolveHref(relativePath, siteConfig.site.footerLinkHref))}" target="_blank" rel="noreferrer" class="design-ekphrasis-link">${escapeHtml(siteConfig.site.footerLinkLabel)}</a>
  </div>
</footer>`;
}

function renderProjectFooter(relativePath) {
  return `<footer class="design-ekphrasis-footer">
  <div class="design-ekphrasis-footer-left">
    <a href="${escapeHtml(resolveHref(relativePath, "index.html"))}" class="design-ekphrasis-logo-link" aria-label="Back to design index">
      <div class="design-ekphrasis-logo-mark">P</div>
    </a>
    <div class="design-ekphrasis-wordmark">Plainframe</div>
    <a href="${escapeHtml(resolveHref(relativePath, "index.html"))}" class="design-ekphrasis-link design-ekphrasis-link-icon design-project-back" aria-label="BACK TO DESIGN">
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10.5 3.75L6.25 8L10.5 12.25" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </div>
  <div class="design-ekphrasis-footer-center">
    <a href="${escapeHtml(resolveHref(relativePath, "index.html#design-vision"))}" class="design-ekphrasis-link">Vision</a>
    <a href="${escapeHtml(resolveHref(relativePath, "index.html#design-id"))}" class="design-ekphrasis-link">Objects</a>
    <a href="${escapeHtml(resolveHref(relativePath, "index.html#design-software"))}" class="design-ekphrasis-link">Interfaces</a>
    <a href="${escapeHtml(resolveHref(relativePath, "index.html#design-installations"))}" class="design-ekphrasis-link">Installations</a>
  </div>
  <div class="design-ekphrasis-footer-right">
    <a href="${escapeHtml(resolveHref(relativePath, "about/index.html"))}" class="design-ekphrasis-link">About</a>
    <a href="${escapeHtml(resolveHref(relativePath, siteConfig.site.footerLinkHref))}" target="_blank" rel="noreferrer" class="design-ekphrasis-link">${escapeHtml(siteConfig.site.footerLinkLabel)}</a>
  </div>
</footer>`;
}

function pageShell({ relativePath, title, description, bodyAttributes = "", bodyClass = "", body }) {
  return `<!-- index.html developed by Bob Tianqi Wei -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&display=swap" rel="stylesheet">
  <link href="${escapeHtml(resolveAsset(relativePath, "assets/css/normalize.css"))}" rel="stylesheet" type="text/css">
  <link href="${escapeHtml(resolveAsset(relativePath, "assets/css/theme-toggle.css"))}" rel="stylesheet" type="text/css">
  <link href="${escapeHtml(resolveAsset(relativePath, "assets/css/webflow.css"))}" rel="stylesheet" type="text/css">
  <link href="${escapeHtml(resolveAsset(relativePath, "assets/css/bobtianqiwei.webflow.css"))}" rel="stylesheet" type="text/css">
  <link href="${escapeHtml(resolveAsset(relativePath, "assets/css/project-pages.css"))}" rel="stylesheet" type="text/css">
  <link href="${escapeHtml(resolveAsset(relativePath, "assets/css/project-pages-design.css"))}" rel="stylesheet" type="text/css">
  <link href="${escapeHtml(resolveAsset(relativePath, "assets/css/plainframe.css"))}" rel="stylesheet" type="text/css">
</head>
<body${bodyAttributes ? ` ${bodyAttributes}` : ""} class="${escapeHtml(bodyClass)}">
${body}
</body>
</html>
`;
}

function renderHome(projects) {
  const relativePath = "index.html";
  const projectMap = Object.fromEntries(projects.map((project) => [project.slug, project]));
  const heroLines = siteConfig.hero.titleLines || [siteConfig.hero.title];

  return pageShell({
    relativePath,
    title: siteConfig.site.metaTitle,
    description: siteConfig.site.metaDescription,
    bodyAttributes: 'data-scroll-time="0"',
    bodyClass: "body-4 design-portfolio-page",
    body: `<div class="design-portfolio-scroll">
  <article class="work-page-div-block">
    <section class="design-hero">
      <div class="design-hero-inner">
        <h1 id="works-head" class="design-page-title design-hero-title">
${heroLines.map((line) => `          <span class="design-hero-title-line">${escapeHtml(line)}</span>`).join("\n")}
        </h1>
        <p class="name-text design-hero-name">${escapeHtml(siteConfig.hero.subtitle)}</p>
      </div>
      <a href="#design-vision" class="design-hero-scroll" aria-label="Scroll down">
        <svg viewBox="0 0 12 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 1V35" stroke="currentColor" stroke-width="1"/>
          <path d="M1.5 30.5L6 35L10.5 30.5" stroke="currentColor" stroke-width="1"/>
        </svg>
      </a>
    </section>
    <section id="design-vision" class="design-vision">
      <div class="design-vision-grid">
        <div class="design-vision-media">
          <img src="${escapeHtml(resolveAsset(relativePath, siteConfig.vision.image))}" loading="lazy" alt="${escapeHtml(siteConfig.vision.imageAlt)}" class="design-vision-image">
          <div class="design-vision-caption">${escapeHtml(siteConfig.vision.caption)}</div>
          <div class="design-vision-references">${siteConfig.vision.references.map((item) => escapeHtml(item)).join("<br>")}</div>
        </div>
        <div class="design-vision-copy">
          <h2 class="design-vision-heading">${escapeHtml(siteConfig.intro.title)}</h2>
          <div class="design-vision-text">${renderParagraphs(siteConfig.intro.paragraphs)}</div>
        </div>
      </div>
      <a href="#design-id" class="design-hero-scroll" aria-label="Scroll down">
        <svg viewBox="0 0 12 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 1V35" stroke="currentColor" stroke-width="1"/>
          <path d="M1.5 30.5L6 35L10.5 30.5" stroke="currentColor" stroke-width="1"/>
        </svg>
      </a>
    </section>
${siteConfig.homeSections.map((section) => `    ${renderHomeSection(relativePath, section, projectMap)}`).join("\n")}
    <section class="design-testimonials">
      <div class="design-testimonials-inner">
        <h2 class="design-testimonials-heading">Testimonials</h2>
        <div class="design-testimonials-list">
${siteConfig.testimonials
  .map(
    (item) => `          <article class="design-testimonial">
            <p class="design-testimonial-quote">"${escapeHtml(item.quote)}"</p>
            <p class="design-testimonial-credit">${escapeHtml(item.credit)}</p>
          </article>`
  )
  .join("\n")}
        </div>
      </div>
    </section>
  </article>
</div>
${renderHomeFooter(relativePath)}`
  });
}

function renderAbout() {
  const relativePath = "about/index.html";

  return pageShell({
    relativePath,
    title: `About | ${siteConfig.site.title}`,
    description: siteConfig.aboutPage.headline,
    bodyClass: "design-project-page",
    body: `<div class="design-project-shell design-project-page">
  <main class="design-project-main">
    <header class="design-project-header">
      <div>
        <h1 class="design-project-title">${escapeHtml(siteConfig.designer.name)}</h1>
        <p class="design-project-headline">${escapeHtml(siteConfig.aboutPage.headline)}</p>
      </div>
      <div>
        <p class="design-project-meta">${escapeHtml(siteConfig.designer.role)}<br>${escapeHtml(siteConfig.designer.location)}<br>${escapeHtml(siteConfig.contact[0].value)}</p>
      </div>
    </header>
${siteConfig.aboutPage.sections
  .map(
    (section) => `    <section class="design-project-section">
      <div class="design-project-section-head">
        <h2 class="design-project-section-title">${escapeHtml(section.title)}</h2>
      </div>
      <div class="design-project-section-body">
        <div class="design-project-richtext">${renderParagraphs(section.paragraphs)}</div>
      </div>
    </section>`
  )
  .join("\n")}
  </main>
${renderProjectFooter(relativePath)}
</div>`
  });
}

function renderProjectsIndex(projects) {
  const relativePath = "projects/index.html";
  const objects = siteConfig.homeSections.find((section) => section.id === "design-id");
  const projectMap = Object.fromEntries(projects.map((project) => [project.slug, project]));

  return pageShell({
    relativePath,
    title: `Work | ${siteConfig.site.title}`,
    description: siteConfig.site.metaDescription,
    bodyClass: "body-4 design-portfolio-page",
    body: `<div class="design-portfolio-scroll">
  <article class="work-page-div-block">
    <section class="design-hero">
      <div class="design-hero-inner">
        <h1 class="design-page-title design-hero-title">
          <span class="design-hero-title-line">Selected Work</span>
        </h1>
        <p class="name-text design-hero-name">${escapeHtml(siteConfig.hero.subtitle)}</p>
      </div>
    </section>
    ${renderHomeSection(relativePath, objects, projectMap)}
  </article>
</div>
${renderHomeFooter(relativePath)}`
  });
}

function renderProjectPage(project) {
  const relativePath = `projects/${project.slug}/index.html`;
  const sections = project.page.sections || [];
  const overview = sections[0];
  const remainingSections = sections.slice(1);

  return pageShell({
    relativePath,
    title: `${project.title} | ${siteConfig.site.title}`,
    description: project.summary,
    bodyClass: "design-project-page",
    body: `<div class="design-project-shell design-project-page">
  <main class="design-project-main">
    <header class="design-project-header">
      <div>
        <h1 class="design-project-title">${escapeHtml(project.title)}</h1>
        <p class="design-project-headline">${escapeHtml(project.page.headline)}</p>
      </div>
      <div>
        <p class="design-project-meta">${escapeHtml(siteConfig.designer.name)}<br>${escapeHtml(project.discipline)}<br>${escapeHtml(project.year)}</p>
      </div>
    </header>
    <figure class="project-figure">
      <img src="${escapeHtml(resolveAsset(relativePath, project.thumbnail))}" loading="lazy" alt="${escapeHtml(project.thumbnailAlt)}" class="design-project-gallery-image">
    </figure>
${overview
  ? `    <section class="design-project-section design-project-section-intro">
      <div class="design-project-section-head">
        <h2 class="design-project-section-title">${escapeHtml(overview.title)}</h2>
      </div>
      <div class="design-project-section-body">
        <div class="design-project-richtext">${renderParagraphs(overview.paragraphs)}</div>
      </div>
    </section>`
  : ""}
${remainingSections
  .map(
    (section) => `    <section class="design-project-section">
      <div class="design-project-section-head">
        <h2 class="design-project-section-title">${escapeHtml(section.title)}</h2>
      </div>
      <div class="design-project-section-body">
        <div class="design-project-richtext">${renderParagraphs(section.paragraphs)}</div>
      </div>
    </section>`
  )
  .join("\n")}
  </main>
${renderProjectFooter(relativePath)}
</div>`
  });
}

function main() {
  const projects = loadProjects();
  fs.rmSync(path.join(repoRoot, "projects"), { recursive: true, force: true });
  fs.rmSync(path.join(repoRoot, "about"), { recursive: true, force: true });

  writeFile("index.html", renderHome(projects));
  writeFile("about/index.html", renderAbout());
  writeFile("projects/index.html", renderProjectsIndex(projects));

  projects.forEach((project) => {
    writeFile(`projects/${project.slug}/index.html`, renderProjectPage(project));
  });
}

main();

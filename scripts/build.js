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

function pageShell({ relativePath, title, description, bodyClass, body }) {
  return `<!-- index.html developed by Bob Tianqi Wei -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="${escapeHtml(resolveAsset(relativePath, "assets/css/plainframe.css"))}" rel="stylesheet" type="text/css">
</head>
<body class="${escapeHtml(bodyClass)}">
${body}
</body>
</html>
`;
}

function renderFooter(relativePath, currentLabel) {
  return `<footer class="design-ekphrasis-footer">
  <div class="design-ekphrasis-footer-left">
    <a href="${escapeHtml(resolveHref(relativePath, "index.html"))}" class="design-ekphrasis-logo-link" aria-label="Back to Plainframe home">
      <div class="design-ekphrasis-logo-mark">P</div>
    </a>
    <div class="design-ekphrasis-wordmark">Plainframe</div>
  </div>
  <div class="design-ekphrasis-footer-center">
    <a href="${escapeHtml(resolveHref(relativePath, "index.html#design-vision"))}" class="design-ekphrasis-link">${currentLabel || "Vision"}</a>
    <a href="${escapeHtml(resolveHref(relativePath, "projects/index.html"))}" class="design-ekphrasis-link">Work</a>
    <a href="${escapeHtml(resolveHref(relativePath, "about/index.html"))}" class="design-ekphrasis-link">About</a>
  </div>
  <div class="design-ekphrasis-footer-right">
    <a href="${escapeHtml(resolveHref(relativePath, siteConfig.site.footerLinkHref))}" target="_blank" rel="noreferrer" class="design-ekphrasis-link">${escapeHtml(siteConfig.site.footerLinkLabel)}</a>
  </div>
</footer>`;
}

function renderHome(projects) {
  const relativePath = "index.html";
  const heroImage = projects[0] ? resolveAsset(relativePath, projects[0].thumbnail) : "";
  const heroImageAlt = projects[0] ? projects[0].thumbnailAlt : "";

  return pageShell({
    relativePath,
    title: siteConfig.site.metaTitle,
    description: siteConfig.site.metaDescription,
    bodyClass: "design-portfolio-page",
    body: `<div class="design-portfolio-scroll">
  <section class="design-hero" id="design-hero">
    <div class="design-hero-inner">
      <p class="design-hero-eyebrow">${escapeHtml(siteConfig.hero.eyebrow)}</p>
      <h1 class="design-hero-title"><span class="design-hero-title-line">${escapeHtml(siteConfig.hero.title)}</span></h1>
      <p class="design-hero-name">${escapeHtml(siteConfig.hero.subtitle)}</p>
    </div>
    <a href="#design-vision" class="design-hero-scroll" aria-label="Scroll to next section">
      <svg viewBox="0 0 12 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 1V37" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M2 33L6 38L10 33" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </section>
  <section class="design-vision" id="design-vision">
    <div class="design-vision-grid">
      <div class="design-vision-media">
        <img src="${escapeHtml(heroImage)}" alt="${escapeHtml(heroImageAlt)}" class="design-vision-image">
      </div>
      <div class="design-vision-copy">
        <h2 class="design-vision-heading">${escapeHtml(siteConfig.intro.title)}</h2>
        <div class="design-vision-text">${renderParagraphs(siteConfig.intro.paragraphs)}</div>
      </div>
    </div>
  </section>
  <section class="design-work" id="design-work">
    <div class="design-work-inner">
      <h2 class="design-testimonials-heading">Selected Work</h2>
      <div class="design-project-grid">
${projects
  .map(
    (project) => `        <div class="design-project-grid-item">
          <a href="${escapeHtml(resolveHref(relativePath, `projects/${project.slug}/index.html`))}" class="design-unified-card">
            <img src="${escapeHtml(resolveAsset(relativePath, project.thumbnail))}" alt="${escapeHtml(project.thumbnailAlt)}">
            <div class="design-card-overlay">${escapeHtml(project.title)}</div>
          </a>
        </div>`
  )
  .join("\n")}
      </div>
    </div>
  </section>
  <section class="design-testimonials" id="design-about">
    <div class="design-testimonials-inner">
      <h2 class="design-testimonials-heading">About</h2>
      <div class="design-testimonials-list">
        <article class="design-testimonial">
          <p class="design-testimonial-quote">${escapeHtml(siteConfig.designer.name)}</p>
          <p class="design-testimonial-credit">${escapeHtml(siteConfig.designer.role)}<br>${escapeHtml(siteConfig.designer.location)}</p>
        </article>
        <article class="design-testimonial">
          <p class="design-testimonial-quote">“${escapeHtml(siteConfig.hero.statement)}”</p>
          <p class="design-testimonial-credit">${escapeHtml(siteConfig.designer.bio)}</p>
        </article>
      </div>
    </div>
  </section>
</div>
${renderFooter(relativePath, "Vision")}`
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
${renderFooter(relativePath, "About") }
</div>`
  });
}

function renderProjectsIndex(projects) {
  const relativePath = "projects/index.html";

  return pageShell({
    relativePath,
    title: `Work | ${siteConfig.site.title}`,
    description: siteConfig.site.metaDescription,
    bodyClass: "design-portfolio-page",
    body: `<div class="design-portfolio-scroll">
  <section class="design-hero design-hero-compact">
    <div class="design-hero-inner">
      <p class="design-hero-eyebrow">Projects</p>
      <h1 class="design-hero-title"><span class="design-hero-title-line">Selected Work</span></h1>
      <p class="design-hero-name">${escapeHtml(siteConfig.hero.subtitle)}</p>
    </div>
  </section>
  <section class="design-work design-work-listing">
    <div class="design-work-inner">
      <div class="design-project-grid">
${projects
  .map(
    (project) => `        <div class="design-project-grid-item">
          <a href="${escapeHtml(resolveHref(relativePath, `${project.slug}/index.html`))}" class="design-unified-card">
            <img src="${escapeHtml(resolveAsset(relativePath, project.thumbnail))}" alt="${escapeHtml(project.thumbnailAlt)}">
            <div class="design-card-overlay">${escapeHtml(project.title)}</div>
          </a>
        </div>`
  )
  .join("\n")}
      </div>
    </div>
  </section>
</div>
${renderFooter(relativePath, "Work")}`
  });
}

function renderProjectPage(project) {
  const relativePath = `projects/${project.slug}/index.html`;

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
${project.page.sections
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
${renderFooter(relativePath, "Vision")}
</div>`
  });
}

function main() {
  const projects = loadProjects();
  fs.rmSync(path.join(repoRoot, "projects"), { recursive: true, force: true });
  fs.rmSync(path.join(repoRoot, "about"), { recursive: true, force: true });
  fs.rmSync(path.join(repoRoot, "publications"), { recursive: true, force: true });

  writeFile("index.html", renderHome(projects));
  writeFile("about/index.html", renderAbout());
  writeFile("projects/index.html", renderProjectsIndex(projects));

  projects.forEach((project) => {
    writeFile(`projects/${project.slug}/index.html`, renderProjectPage(project));
  });
}

main();

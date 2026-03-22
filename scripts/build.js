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

function getPrimaryEmail() {
  return siteConfig.contact.find((item) => item.href && item.href.startsWith("mailto:")) || null;
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

function renderHomeSection(relativePath, section, projectMap) {
  const slugs = [...(section.featureRows || []).flat(), ...(section.columns || []).flat()];
  const seen = new Set();
  const items = slugs
    .filter((slug) => {
      if (seen.has(slug)) {
        return false;
      }
      seen.add(slug);
      return true;
    })
    .map((slug) => projectMap[slug])
    .filter(Boolean);

  return `<h1 id="${escapeHtml(section.id)}" class="works-page-heading">${escapeHtml(section.title)}</h1>
<div class="design-project-grid">
${items
  .map(
    (project) => `  <div class="design-project-grid-item">
    <a href="${escapeHtml(resolveHref(relativePath, `projects/${project.slug}/index.html`))}" class="design-unified-card">
      <img src="${escapeHtml(resolveAsset(relativePath, project.thumbnail))}" loading="lazy" alt="${escapeHtml(project.thumbnailAlt)}">
      <div class="design-card-overlay">${escapeHtml(project.title)}</div>
    </a>
  </div>`
  )
  .join("\n")}
</div>`;
}

function renderFooterNav(relativePath) {
  const visionHref = relativePath === "index.html" ? "#design-vision" : resolveHref(relativePath, "index.html#design-vision");

  return [
    `<a href="${escapeHtml(visionHref)}" class="design-ekphrasis-link">Vision</a>`,
    ...siteConfig.homeSections.map(
      (section) => {
        const sectionHref = relativePath === "index.html" ? `#${section.id}` : resolveHref(relativePath, `index.html#${section.id}`);
        return `<a href="${escapeHtml(sectionHref)}" class="design-ekphrasis-link">${escapeHtml(section.title)}</a>`;
      }
    )
  ].join("\n    ");
}

function renderProfileModals(relativePath) {
  const email = getPrimaryEmail();
  const websiteHref = siteConfig.modalProfile?.websiteHref;
  const websiteLabel = siteConfig.modalProfile?.websiteLabel;

  return `  <div class="design-about-modal-overlay" data-design-about-modal>
    <div class="design-about-modal" role="dialog" aria-modal="true" aria-labelledby="design-about-title">
      <button type="button" class="design-about-modal-close" aria-label="Close" data-design-about-close>&times;</button>
      <div class="design-about-modal-grid">
        <div>
          <h2 id="design-about-title" class="design-about-name">${escapeHtml(siteConfig.designer.name)}</h2>
          <p class="design-about-bio">${escapeHtml(siteConfig.designer.bio)}</p>
${email ? `          <p class="design-about-email"><a href="${escapeHtml(email.href)}">${escapeHtml(email.value)}</a></p>` : ""}
${websiteHref && websiteLabel ? `          <p class="design-about-link"><a href="${escapeHtml(websiteHref)}" target="_blank" rel="noreferrer">${escapeHtml(websiteLabel)}</a></p>` : ""}
${siteConfig.modalProfile?.note ? `          <p class="design-about-note">${escapeHtml(siteConfig.modalProfile.note)}</p>` : ""}
          ${renderBuiltWith(relativePath, "design-built-with design-built-with-modal")}
        </div>
        <div class="design-about-sections">
${siteConfig.aboutPage.sections
  .map(
    (section) => `          <section class="design-about-section">
            <h3 class="design-about-section-title">${escapeHtml(section.title)}</h3>
            <div class="design-about-section-copy">${renderParagraphs(section.paragraphs)}</div>
          </section>`
  )
  .join("\n")}
        </div>
      </div>
    </div>
  </div>
  <div class="design-about-modal-overlay" data-design-cv-modal>
    <div class="design-cv-modal" role="dialog" aria-modal="true" aria-labelledby="design-cv-title">
      <button type="button" class="design-cv-modal-close" aria-label="Close" data-design-cv-close>&times;</button>
      <div class="design-cv-grid">
${siteConfig.cvSections
  .map(
    (section, index) => `        <div class="design-cv-section">
          <h3${index === 0 ? ' id="design-cv-title"' : ""} class="design-cv-section-title">${escapeHtml(section.title)}</h3>
${section.items
  .map(
    (item) => `          <p class="design-cv-item"><strong>${escapeHtml(item.heading)}</strong>${escapeHtml(item.body)}</p>`
  )
  .join("\n")}
        </div>`
  )
  .join("\n")}
      </div>
    </div>
  </div>`;
}

function renderModalScript() {
  return `<script>
document.addEventListener("DOMContentLoaded", function () {
  var aboutOpen = document.querySelector("[data-design-about-open]");
  var aboutModal = document.querySelector("[data-design-about-modal]");
  var aboutClose = document.querySelector("[data-design-about-close]");
  var cvOpen = document.querySelector("[data-design-cv-open]");
  var cvModal = document.querySelector("[data-design-cv-modal]");
  var cvClose = document.querySelector("[data-design-cv-close]");

  function openModal(modal) {
    if (!modal) {
      return;
    }
    modal.classList.add("show");
    document.body.classList.add("design-modal-open");
  }

  function closeModal(modal) {
    if (!modal) {
      return;
    }
    modal.classList.remove("show");
    if (!document.querySelector(".design-about-modal-overlay.show")) {
      document.body.classList.remove("design-modal-open");
    }
  }

  if (aboutOpen && aboutModal && aboutClose) {
    aboutOpen.addEventListener("click", function () {
      openModal(aboutModal);
    });

    aboutClose.addEventListener("click", function () {
      closeModal(aboutModal);
    });

    aboutModal.addEventListener("click", function (event) {
      if (event.target === aboutModal) {
        closeModal(aboutModal);
      }
    });
  }

  if (cvOpen && cvModal && cvClose) {
    cvOpen.addEventListener("click", function () {
      openModal(cvModal);
    });

    cvClose.addEventListener("click", function () {
      closeModal(cvModal);
    });

    cvModal.addEventListener("click", function (event) {
      if (event.target === cvModal) {
        closeModal(cvModal);
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }
    closeModal(aboutModal);
    closeModal(cvModal);
  });
});
</script>`;
}

function renderBuiltWith(relativePath, className = "design-built-with") {
  return `<p class="${className}">Built with <a href="${escapeHtml(resolveHref(relativePath, "https://github.com/bobtianqiwei/plainframe"))}" target="_blank" rel="noreferrer">github.com/bobtianqiwei/plainframe</a></p>`;
}

function renderHomeFooter(relativePath) {
  return `<footer class="design-ekphrasis-footer">
  <div class="design-ekphrasis-footer-left">
    <div class="design-ekphrasis-wordmark">Plainframe</div>
  </div>
  <div class="design-ekphrasis-footer-center">
    ${renderFooterNav(relativePath)}
  </div>
  <div class="design-ekphrasis-footer-right">
    <button type="button" class="design-ekphrasis-link" data-design-cv-open>CV</button>
    <button type="button" class="design-ekphrasis-link" data-design-about-open>About</button>
  </div>
  ${renderBuiltWith(relativePath)}
</footer>
${renderProfileModals(relativePath)}`;
}

function renderProjectFooter(relativePath) {
  return `<footer class="design-ekphrasis-footer">
  <div class="design-ekphrasis-footer-left">
    <div class="design-ekphrasis-wordmark">Plainframe</div>
    <a href="${escapeHtml(resolveHref(relativePath, "index.html"))}" class="design-ekphrasis-link design-ekphrasis-link-icon design-project-back" aria-label="BACK TO DESIGN">
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10.5 3.75L6.25 8L10.5 12.25" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </div>
  <div class="design-ekphrasis-footer-center">
    ${renderFooterNav(relativePath)}
  </div>
  <div class="design-ekphrasis-footer-right">
    <button type="button" class="design-ekphrasis-link" data-design-cv-open>CV</button>
    <button type="button" class="design-ekphrasis-link" data-design-about-open>About</button>
  </div>
  ${renderBuiltWith(relativePath)}
</footer>
${renderProfileModals(relativePath)}`;
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
${renderModalScript()}
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
  writeFile("projects/index.html", renderProjectsIndex(projects));

  projects.forEach((project) => {
    writeFile(`projects/${project.slug}/index.html`, renderProjectPage(project));
  });
}

main();

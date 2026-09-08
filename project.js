const projects = window.PROJECTS || {};
const projectOrder = (window.PROJECT_ORDER || Object.keys(projects)).filter(
  (key) => projects[key]
);
const requestedKey = new URLSearchParams(window.location.search).get("project");
const projectKey = projects[requestedKey] ? requestedKey : projectOrder[0];
const project = projects[projectKey];

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function createProjectMark(projectData, className = "") {
  const wrapper = document.createElement("div");
  wrapper.className = className;

  if (projectData.logo) {
    const image = document.createElement("img");
    image.src = projectData.logo;
    image.alt = projectData.title;
    wrapper.append(image);
  } else {
    const wordmark = document.createElement("span");
    wordmark.className = "project-wordmark";
    wordmark.textContent = projectData.wordmark || projectData.title;
    wrapper.append(wordmark);
  }

  return wrapper;
}

function createLabel(text) {
  const label = document.createElement("p");
  label.className = "slide-label";
  label.textContent = text;
  return label;
}

function frameLabel(frameNumber, label) {
  return `${String(frameNumber).padStart(2, "0")} / ${label}`;
}

function createIdentitySlide(projectData, frameNumber) {
  const slide = document.createElement("article");
  slide.className = "showcase-slide slide-identity";
  slide.dataset.slideTitle = "Identity system";

  const copy = document.createElement("div");
  copy.className = "slide-identity-copy slide-animate";
  copy.append(createLabel(frameLabel(frameNumber, "Identity System")));

  const statement = document.createElement("p");
  statement.textContent = projectData.designLine;
  copy.append(statement);

  const stage = document.createElement("div");
  stage.className = "slide-identity-stage";

  const watermark = document.createElement("span");
  watermark.className = "slide-watermark";
  watermark.setAttribute("aria-hidden", "true");
  watermark.textContent = projectData.title;

  const mark = createProjectMark(projectData, "slide-mark slide-animate");
  stage.append(watermark, mark);
  slide.append(copy, stage);
  return slide;
}

function createMediaSlide(asset, frameNumber) {
  const slide = document.createElement("article");
  slide.className = `showcase-slide slide-media slide-media--${asset.fit || "cover"}`;
  slide.dataset.slideTitle = asset.title;

  const figure = document.createElement("figure");
  figure.className = "slide-media-figure";

  const artwork = document.createElement("div");
  artwork.className = "slide-media-artwork";
  if (asset.background) artwork.style.backgroundColor = asset.background;

  const image = document.createElement("img");
  image.className = "slide-media-image";
  image.src = asset.src;
  image.alt = asset.alt;
  image.loading = "lazy";
  image.decoding = "async";
  if (asset.position) image.style.objectPosition = asset.position;
  artwork.append(image);

  const caption = document.createElement("figcaption");
  caption.className = "slide-media-caption slide-animate";

  const heading = document.createElement("div");
  heading.append(createLabel(frameLabel(frameNumber, asset.label || "Selected Work")));

  const title = document.createElement("h3");
  title.textContent = asset.title;
  heading.append(title);

  const description = document.createElement("p");
  description.textContent = asset.caption;
  caption.append(heading, description);

  figure.append(artwork, caption);
  slide.append(figure);
  return slide;
}

function createIndexSlide(projectData, asset, frameNumber) {
  const slide = document.createElement("article");
  slide.className = "showcase-slide slide-index";
  slide.dataset.slideTitle = asset.title;

  const copy = document.createElement("div");
  copy.className = "slide-index-copy slide-animate";
  copy.append(createLabel(frameLabel(frameNumber, asset.label || "Archive Index")));

  const title = document.createElement("h3");
  title.textContent = asset.title;

  const caption = document.createElement("p");
  caption.textContent = asset.caption;
  copy.append(title, caption);

  const index = document.createElement("ol");
  index.className = "slide-index-list slide-animate";
  asset.items.forEach((item, itemIndex) => {
    const row = document.createElement("li");

    const number = document.createElement("span");
    number.textContent = String(itemIndex + 1).padStart(2, "0");

    const label = document.createElement("strong");
    label.textContent = item;

    row.append(number, label);
    index.append(row);
  });

  const mark = createProjectMark(projectData, "slide-index-mark slide-animate");
  slide.append(copy, index, mark);
  return slide;
}

function createScopeSlide(projectData, frameNumber) {
  const slide = document.createElement("article");
  slide.className = "showcase-slide slide-scope";
  slide.dataset.slideTitle = "Operating scope";

  const heading = document.createElement("div");
  heading.className = "slide-scope-heading slide-animate";
  heading.append(createLabel(frameLabel(frameNumber, "Operating Scope")));

  const title = document.createElement("h3");
  title.textContent = "How I shaped the work";
  heading.append(title);

  const body = document.createElement("div");
  body.className = "slide-scope-body slide-animate";

  const role = document.createElement("p");
  role.textContent = projectData.role;

  const tags = document.createElement("ul");
  tags.className = "slide-tags";
  projectData.tags.forEach((tag) => {
    const item = document.createElement("li");
    item.textContent = tag;
    tags.append(item);
  });

  body.append(role, tags);
  slide.append(heading, body);
  return slide;
}

function createImpactSlide(projectData, frameNumber) {
  const slide = document.createElement("article");
  slide.className = "showcase-slide slide-impact";
  slide.dataset.slideTitle = "Signal and impact";

  const copy = document.createElement("div");
  copy.className = "slide-impact-copy slide-animate";

  const heading = document.createElement("div");
  heading.append(createLabel(frameLabel(frameNumber, "Signal")));

  const title = document.createElement("h3");
  title.textContent = "Why it matters";
  heading.append(title);

  const impact = document.createElement("p");
  impact.textContent = projectData.impact;
  copy.append(heading, impact);

  const metrics = document.createElement("div");
  metrics.className = "slide-metrics slide-animate";
  const proofPoints = projectData.metrics.length
    ? projectData.metrics
    : projectData.tags.map((tag) => ({ value: tag, label: "Focus area" }));
  metrics.style.setProperty("--metric-count", Math.min(proofPoints.length, 4));

  proofPoints.forEach((metric) => {
    const item = document.createElement("div");

    const value = document.createElement("span");
    value.className = "metric-value";
    value.textContent = metric.value;

    const label = document.createElement("span");
    label.className = "metric-label";
    label.textContent = metric.label;

    item.append(value, label);
    metrics.append(item);
  });

  slide.append(copy, metrics);
  return slide;
}

function populateProjectPage() {
  if (!project) return;

  document.documentElement.style.setProperty("--project-accent", project.accent);
  document.body.dataset.project = projectKey;
  document.title = `${project.title} - Project Portfolio - Phillip Wright`;

  const description = document.querySelector("meta[name='description']");
  description?.setAttribute("content", project.summary);

  setText("[data-project-route]", `PW / Project ${project.number}`);
  setText("[data-project-group]", project.group);
  setText("[data-project-number]", project.number);
  setText("[data-project-category]", project.category);
  setText(
    "[data-project-stamp]",
    [project.position, project.status].filter(Boolean).join(" / ")
  );
  const titleNode = document.querySelector("[data-project-title]");
  if (titleNode) {
    titleNode.textContent = project.title;
    titleNode.classList.toggle(
      "project-title--long",
      ["strasbourg", "brainstorm"].includes(projectKey)
    );
  }
  setText("[data-project-summary]", project.summary);
  setText("[data-project-design-line]", project.designLine);
  setText("[data-project-role]", project.role);
  setText("[data-project-impact]", project.impact);
  setText("[data-year]", new Date().getFullYear());

  const creditRow = document.querySelector("[data-project-credit-row]");
  if (project.credit && creditRow) {
    setText("[data-project-credit]", project.credit);
    creditRow.hidden = false;
  }

  const heroMark = document.querySelector("[data-project-mark]");
  heroMark?.append(...createProjectMark(project).childNodes);

  const externalActions = document.querySelector("[data-project-actions]");
  const externalLabels = { website: "Website", instagram: "Instagram" };
  Object.entries(project.links)
    .filter(([type, href]) => type !== "portfolio" && href)
    .forEach(([type, href]) => {
      const link = document.createElement("a");
      link.className = "project-external-link";
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = externalLabels[type] || type;
      externalActions?.append(link);
    });

  if (externalActions?.children.length) {
    externalActions.hidden = false;
  }

  const track = document.querySelector("[data-carousel-track]");
  const gallery = project.gallery || [];
  const slides = [
    createIdentitySlide(project, 1),
    ...gallery.map((asset, index) =>
      asset.type === "index"
        ? createIndexSlide(project, asset, index + 2)
        : createMediaSlide(asset, index + 2)
    ),
    createScopeSlide(project, gallery.length + 2),
    createImpactSlide(project, gallery.length + 3),
  ];

  slides.forEach((slide, index) => {
    slide.id = `showcase-frame-${index + 1}`;
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${index + 1} of ${slides.length}`);
    track?.append(slide);
  });

  const currentIndex = projectOrder.indexOf(projectKey);
  const previousKey =
    projectOrder[(currentIndex - 1 + projectOrder.length) % projectOrder.length];
  const nextKey = projectOrder[(currentIndex + 1) % projectOrder.length];
  const previousLink = document.querySelector("[data-previous-project]");
  const nextLink = document.querySelector("[data-next-project]");

  previousLink?.setAttribute("href", `project.html?project=${previousKey}`);
  previousLink?.setAttribute(
    "aria-label",
    `View previous project: ${projects[previousKey].title}`
  );
  nextLink?.setAttribute("href", `project.html?project=${nextKey}`);
  nextLink?.setAttribute(
    "aria-label",
    `View next project: ${projects[nextKey].title}`
  );
  setText("[data-previous-title]", projects[previousKey].title);
  setText("[data-next-title]", projects[nextKey].title);
}

function initializeCarousel() {
  const carousel = document.querySelector("[data-carousel]");
  const viewport = carousel?.querySelector(".showcase-viewport");
  const track = carousel?.querySelector("[data-carousel-track]");
  const slides = Array.from(track?.children || []);
  const dotsContainer = carousel?.querySelector("[data-carousel-dots]");
  const currentNode = carousel?.querySelector("[data-carousel-current]");
  const totalNode = carousel?.querySelector("[data-carousel-total]");

  if (!carousel || !viewport || !track || !slides.length || !dotsContainer) return;

  let activeIndex = 0;
  let pointerStart = null;

  const dots = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-controls", slide.id);
    dot.setAttribute(
      "aria-label",
      `Show frame ${index + 1}: ${slide.dataset.slideTitle || "Project detail"}`
    );
    dot.addEventListener("click", () => goTo(index));
    dotsContainer.append(dot);
    return dot;
  });

  function goTo(index) {
    activeIndex = (index + slides.length) % slides.length;
    track.style.transform = `translate3d(-${activeIndex * 100}%, 0, 0)`;

    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", String(slideIndex !== activeIndex));
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-selected", String(dotIndex === activeIndex));
      dot.tabIndex = dotIndex === activeIndex ? 0 : -1;
    });

    if (currentNode) currentNode.textContent = String(activeIndex + 1).padStart(2, "0");
  }

  carousel
    .querySelector("[data-carousel-previous]")
    ?.addEventListener("click", () => goTo(activeIndex - 1));
  carousel
    .querySelector("[data-carousel-next]")
    ?.addEventListener("click", () => goTo(activeIndex + 1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  });

  viewport.addEventListener("pointerdown", (event) => {
    pointerStart = event.clientX;
  });

  viewport.addEventListener("pointerup", (event) => {
    if (pointerStart === null) return;
    const movement = event.clientX - pointerStart;
    pointerStart = null;

    if (Math.abs(movement) < 48) return;
    goTo(movement > 0 ? activeIndex - 1 : activeIndex + 1);
  });

  viewport.addEventListener("pointercancel", () => {
    pointerStart = null;
  });

  if (totalNode) totalNode.textContent = String(slides.length).padStart(2, "0");
  goTo(0);
}

populateProjectPage();
initializeCarousel();

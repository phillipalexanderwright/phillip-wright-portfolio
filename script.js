const contactEmail = "phillipalexanderwright@gmail.com";
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll("[href^='mailto:'], [data-email-link]").forEach((link) => {
  const currentHref = link.getAttribute("href") || "";
  const queryString =
    currentHref.startsWith("mailto:") && currentHref.includes("?")
      ? currentHref.slice(currentHref.indexOf("?"))
      : "";

  link.setAttribute("href", `mailto:${contactEmail}${queryString}`);
  if (link.matches("[data-email-link]")) {
    link.textContent = contactEmail;
  }
});

const yearNode = document.querySelector("[data-year]");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const revealNodes = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && !motionPreference.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("reveal-pending");
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -24px 0px", threshold: 0 }
  );

  revealNodes.forEach((node) => {
    // First-screen content is always visible, even if scripts load late.
    if (node.getBoundingClientRect().top >= window.innerHeight) {
      revealObserver.observe(node);
      node.classList.add("reveal-pending");
    }
  });

  motionPreference.addEventListener("change", (event) => {
    if (!event.matches) return;
    revealObserver.disconnect();
    revealNodes.forEach((node) => node.classList.remove("reveal-pending"));
  });

  document.addEventListener("focusin", (event) => {
    const pending = event.target.closest(".reveal-pending");
    if (!pending) return;
    pending.classList.remove("reveal-pending");
    revealObserver.unobserve(pending);
  });
}

const sections = document.querySelectorAll("[data-section]");
const railLinks = document.querySelectorAll("[data-section-link]");
const siteHeader = document.querySelector(".site-header");
let activeSectionId;

function activateSection(sectionId) {
  if (sectionId === activeSectionId) return;
  activeSectionId = sectionId;
  document.body.classList.toggle("show-section-rail", sectionId !== "top");

  railLinks.forEach((link) => {
    const isActive = link.dataset.sectionLink === sectionId;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function syncPagePosition() {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 24);

  // Track section starts, not visibility ratios: Work spans several screens.
  const readingLine = Math.max((siteHeader?.offsetHeight || 0) + 24, window.innerHeight * 0.28);
  let currentSection = sections[0];
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= readingLine) currentSection = section;
  });
  if (currentSection) activateSection(currentSection.dataset.section);
}

let positionFrame = null;
function schedulePositionSync() {
  if (positionFrame !== null) return;
  positionFrame = window.requestAnimationFrame(() => {
    positionFrame = null;
    syncPagePosition();
  });
}

syncPagePosition();
window.addEventListener("scroll", schedulePositionSync, { passive: true });
window.addEventListener("resize", schedulePositionSync);
window.addEventListener("pageshow", schedulePositionSync);
window.addEventListener("load", schedulePositionSync);
document.addEventListener("toggle", schedulePositionSync, true);

if ("ResizeObserver" in window) {
  const layoutObserver = new ResizeObserver(schedulePositionSync);
  sections.forEach((section) => layoutObserver.observe(section));
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        sectionObserver.unobserve(entry.target);
      });
    },
    { threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  sections.forEach((section) => section.classList.add("is-inview"));
}

const archiveItems = document.querySelectorAll(".archive-item");

archiveItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    archiveItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.open = false;
      }
    });
  });
});

const projectLinkLabels = {
  portfolio: "Portfolio",
  website: "Website",
  instagram: "Instagram",
};

document.querySelectorAll("[data-project-links]").forEach((container) => {
  const project = window.PROJECTS?.[container.dataset.projectLinks];
  const destinations = project?.links || {};
  const availableLinks = Object.entries(destinations).filter(([, href]) => href);

  const projectCopy = container.closest(".case-copy, .archive-project-copy");
  const summary = projectCopy?.classList.contains("case-copy")
    ? projectCopy.querySelector(".case-signal")
    : projectCopy?.querySelector(":scope > p");
  const stamp = [project?.position, project?.status].filter(Boolean).join(" / ");
  if (summary && stamp) {
    const stampNode = document.createElement("span");
    stampNode.className = "project-stamp";
    stampNode.textContent = stamp;
    summary.prepend(stampNode);
  }

  availableLinks.forEach(([type, href]) => {
    const link = document.createElement("a");
    link.className = "project-link";
    link.href = href;
    link.dataset.linkType = type;

    if (type !== "portfolio") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    link.textContent = projectLinkLabels[type] || type;
    container.append(link);
  });

  container.hidden = availableLinks.length === 0;
});

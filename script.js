const contactEmail = "phillipalexanderwright@gmail.com";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const siteHeader = document.querySelector(".site-header");

function syncHeaderState() {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 24);
}

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

const revealNodes = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  revealNodes.forEach((node, index) => {
    if (!prefersReducedMotion) {
      node.style.setProperty("--reveal-delay", `${Math.min((index % 4) * 70, 210)}ms`);
    }
    revealObserver.observe(node);
  });
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

const sections = document.querySelectorAll("[data-section]");
const railLinks = document.querySelectorAll("[data-section-link]");

function activateSection(sectionId) {
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

if ("IntersectionObserver" in window && sections.length) {
  const sectionVisibility = new Map();
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sectionVisibility.set(entry.target, entry.intersectionRatio);
        entry.target.classList.toggle("is-inview", entry.isIntersecting);
      });

      let activeSection = null;
      let activeRatio = 0;

      sections.forEach((section) => {
        const ratio = sectionVisibility.get(section) || 0;
        if (ratio > activeRatio) {
          activeSection = section;
          activeRatio = ratio;
        }
      });

      if (activeSection && activeRatio > 0.1) {
        activateSection(activeSection.dataset.section);
      }
    },
    {
      rootMargin: "-24% 0px -44% 0px",
      threshold: [0, 0.12, 0.24, 0.4, 0.6],
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  document.querySelector(".section")?.classList.add("is-inview");
  activateSection("top");
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

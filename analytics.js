(() => {
  window.va =
    window.va ||
    function () {
      (window.vaq = window.vaq || []).push(arguments);
    };

  const hostname = window.location.hostname;
  const isLocal =
    window.location.protocol === "file:" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1";

  if (!isLocal && !document.querySelector("script[data-vercel-analytics]")) {
    const script = document.createElement("script");
    script.defer = true;
    script.src = "/_vercel/insights/script.js";
    script.dataset.vercelAnalytics = "true";
    document.head.append(script);
  }

  function track(name, data = {}) {
    window.va("event", { name, data });
  }

  function interactionLocation(link) {
    return (
      link.closest("section")?.id ||
      (link.closest("footer") ? "footer" : "navigation")
    );
  }

  document.addEventListener("click", (event) => {
    const link =
      event.target instanceof Element ? event.target.closest("a") : null;
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const location = interactionLocation(link);

    if (href.startsWith("mailto:")) {
      track("Email Click", { location });
      return;
    }

    const url = new URL(href, window.location.href);
    if (url.pathname.toLowerCase().endsWith(".pdf")) {
      track("Resume Download", { location });
    }
  });

  const project = new URLSearchParams(window.location.search).get("project");
  if (project && window.location.pathname.endsWith("project.html")) {
    track("Project Open", { project });
  }
})();

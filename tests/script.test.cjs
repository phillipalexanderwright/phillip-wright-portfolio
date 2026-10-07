const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");

const source = readFileSync(resolve(__dirname, "../script.js"), "utf8");

function createNode(dataset = {}) {
  const classes = new Set();
  const attributes = new Map();
  return {
    dataset,
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      contains: (name) => classes.has(name),
      toggle(name, enabled) {
        if (enabled) classes.add(name);
        else classes.delete(name);
      },
    },
    setAttribute: (name, value) => attributes.set(name, value),
    getAttribute: (name) => attributes.get(name),
    removeAttribute: (name) => attributes.delete(name),
  };
}

// A minimal DOM harness tests position logic without a browser or dependencies.
function setup({ reducedMotion = false, observers = true, scrollY = 0 } = {}) {
  const windowEvents = {};
  const documentEvents = {};
  const motionEvents = {};
  const frames = [];
  const intersections = [];
  const resizes = [];
  const window = {
    innerHeight: 900,
    scrollY,
    matchMedia: () => ({
      matches: reducedMotion,
      addEventListener: (name, fn) => { motionEvents[name] = fn; },
    }),
    addEventListener: (name, fn) => { windowEvents[name] = fn; },
    requestAnimationFrame: (fn) => frames.push(fn),
  };
  const sectionStarts = [0, 900, 1700, 6400, 7300];
  const sections = ["top", "about", "work", "resume", "contact"].map((id, index) => {
    const node = createNode({ section: id });
    node.getBoundingClientRect = () => ({ top: sectionStarts[index] - window.scrollY });
    return node;
  });
  const links = sections.map((section) => createNode({ sectionLink: section.dataset.section }));
  const header = { ...createNode(), offsetHeight: 80 };
  const reveals = [100, 1400].map((top) => ({
    ...createNode(),
    getBoundingClientRect: () => ({ top: top - window.scrollY }),
  }));
  const body = createNode();
  const document = {
    body,
    querySelector: (selector) => selector === ".site-header" ? header : null,
    querySelectorAll: (selector) => ({
      "[data-section]": sections,
      "[data-section-link]": links,
      "[data-reveal]": reveals,
    }[selector] || []),
    addEventListener: (name, fn) => { documentEvents[name] = fn; },
  };
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.targets = new Set(); intersections.push(this); }
    observe(node) { this.targets.add(node); }
    unobserve(node) { this.targets.delete(node); }
    disconnect() { this.targets.clear(); }
  }
  class ResizeObserver {
    constructor(callback) { resizes.push(callback); }
    observe() {}
  }
  const context = { window, document };
  if (observers) {
    Object.assign(window, { IntersectionObserver, ResizeObserver });
    Object.assign(context, { IntersectionObserver, ResizeObserver });
  }
  runInNewContext(source, context);
  return {
    window, sections, sectionStarts, links, reveals, body, header,
    windowEvents, documentEvents, motionEvents, intersections, resizes, frames,
    flush() { while (frames.length) frames.shift()(); },
    active: () => links.filter((link) => link.getAttribute("aria-current") === "location")
      .map((link) => link.dataset.sectionLink),
  };
}

test("the long Work section stays active throughout its full length", () => {
  const app = setup();
  for (const [scroll, expected] of [[0, "top"], [900, "about"], [1700, "work"],
    [4000, "work"], [6000, "work"], [6400, "resume"], [7300, "contact"], [1800, "work"], [0, "top"]]) {
    app.window.scrollY = scroll;
    app.windowEvents.scroll();
    app.flush();
    assert.deepEqual(app.active(), [expected]);
    assert.equal(app.body.classList.contains("show-section-rail"), expected !== "top");
  }
});

test("deep links initialize the correct section before a scroll event", () => {
  assert.deepEqual(setup({ scrollY: 3500 }).active(), ["work"]);
});

test("layout changes and back-forward restores update navigation", () => {
  const app = setup({ scrollY: 6500 });
  assert.deepEqual(app.active(), ["resume"]);
  app.sectionStarts[3] = 7400;
  app.sectionStarts[4] = 8300;
  app.resizes[0]();
  app.flush();
  assert.deepEqual(app.active(), ["work"]);
  app.window.scrollY = 0;
  app.windowEvents.pageshow();
  app.flush();
  assert.deepEqual(app.active(), ["top"]);
});

test("scroll events are batched into one animation frame", () => {
  const app = setup();
  for (let i = 0; i < 20; i += 1) app.windowEvents.scroll();
  assert.equal(app.frames.length, 1);
  app.flush();
});

test("above-fold content stays visible and offscreen content reveals once", () => {
  const app = setup();
  const observer = app.intersections[0];
  assert.equal(app.reveals[0].classList.contains("reveal-pending"), false);
  assert.equal(app.reveals[1].classList.contains("reveal-pending"), true);
  observer.callback([{ target: app.reveals[1], isIntersecting: true }]);
  assert.equal(app.reveals[1].classList.contains("reveal-pending"), false);
  assert.equal(app.reveals[1].classList.contains("is-visible"), true);
  assert.equal(observer.targets.size, 0);
});

test("keyboard focus reveals a pending container immediately", () => {
  const app = setup();
  app.documentEvents.focusin({ target: { closest: () => app.reveals[1] } });
  assert.equal(app.reveals[1].classList.contains("reveal-pending"), false);
  assert.equal(app.intersections[0].targets.size, 0);
});

test("reduced motion keeps all content visible, including preference changes", () => {
  const app = setup({ reducedMotion: true });
  assert.ok(app.reveals.every((node) => !node.classList.contains("reveal-pending")));
  const changed = setup();
  changed.motionEvents.change({ matches: true });
  assert.ok(changed.reveals.every((node) => !node.classList.contains("reveal-pending")));
  assert.equal(changed.intersections[0].targets.size, 0);
});

test("navigation and visible content survive unavailable observer APIs", () => {
  const app = setup({ observers: false, scrollY: 3500 });
  assert.deepEqual(app.active(), ["work"]);
  assert.ok(app.sections.every((node) => node.classList.contains("is-inview")));
  assert.ok(app.reveals.every((node) => !node.classList.contains("reveal-pending")));
});

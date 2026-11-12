const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const script = readFileSync(path.join(root, 'assets/script.js'), 'utf8');
test('generated CSS parses without warnings or unresolved build directives', () => {
  const { transform } = require('lightningcss');
  const code = readFileSync(path.join(root, 'assets/styles.css'));
  const result = transform({ filename: 'styles.css', code, errorRecovery: false });
  assert.deepEqual(result.warnings, []);
  assert.doesNotMatch(code.toString(), /@(?:variant|custom-variant|slot)\b/);
  assert.doesNotMatch(code.toString(), /prefers-reduced-motion|data-motion/);
});

function setupEntrances({ observer = true, reduce = false } = {}) {
  const classes = new Set();
  const properties = new Map();
  const target = new EventTarget();
  let top = 1000;
  target.classList = {
    add: (name) => classes.add(name),
    remove: (name) => classes.delete(name),
  };
  target.style = {
    setProperty: (name, value) => properties.set(name, value),
    removeProperty: (name) => properties.delete(name),
  };
  target.getBoundingClientRect = () => ({ top, bottom: top + 300 });
  target.contains = (element) => element === target;
  const document = new EventTarget();
  document.documentElement = { dataset: {} };
  document.querySelector = () => null;
  document.querySelectorAll = () => [target];
  const window = new EventTarget();
  window.scrollY = 0;
  window.innerHeight = 800;
  window.matchMedia = () => ({ matches: reduce });
  let notify;
  class Observer {
    constructor(callback) {
      notify = (isIntersecting) => callback([{ target, isIntersecting }]);
    }
    observe() {}
  }
  if (observer) window.IntersectionObserver = Observer;
  const frames = [];
  const context = vm.createContext({
    document,
    window,
    Event,
    EventTarget,
    IntersectionObserver: Observer,
    getComputedStyle: () => ({ transform: 'matrix(1, 0, 0, 1, 0, 0)' }),
    requestAnimationFrame: (callback) => frames.push(callback),
  });
  vm.runInContext(script.split('// The script is deferred')[0], context);
  vm.runInContext('initScrollAnimations()', context);
  return {
    classes,
    properties,
    target,
    window,
    document,
    enter() {
      top = 500;
      if (observer) notify(true);
    },
    leave() {
      top = 1000;
      if (observer) notify(false);
    },
    scroll(y) {
      window.scrollY = y;
      window.dispatchEvent(new Event('scroll'));
      frames.splice(0).forEach((callback) => callback());
    },
  };
}

for (const observer of [true, false]) {
  test(`entrances work without Web Animations APIs (${observer ? 'observer' : 'scroll fallback'})`, () => {
    const page = setupEntrances({ observer });
    assert.equal(page.classes.has('scroll-enter'), false);
    page.enter();
    page.scroll(100);
    if (observer) {
      page.leave();
      page.enter();
    }
    assert.equal(page.classes.has('scroll-enter'), true);
    assert.equal(page.properties.get('--entrance-transform'), 'matrix(1, 0, 0, 1, 0, 0)');
    page.scroll(50);
    assert.equal(page.classes.has('scroll-enter'), false);
    page.leave();
    page.enter();
    page.scroll(25);
    assert.equal(page.classes.has('scroll-enter'), false);
  });

  test(`device reduced-motion settings do not suppress entrances (${observer ? 'observer' : 'scroll fallback'})`, () => {
    const page = setupEntrances({ observer, reduce: true });
    page.scroll(100);
    page.enter();
    page.scroll(200);
    assert.equal(page.classes.has('scroll-enter'), true);
  });
}

test('focus, anchor navigation, and completion settle entrances', () => {
  for (const reason of ['focus', 'hash', 'end']) {
    const page = setupEntrances();
    page.scroll(100);
    page.enter();
    assert.equal(page.classes.has('scroll-enter'), true);
    if (reason === 'focus') {
      const event = new Event('focusin');
      Object.defineProperty(event, 'target', { value: page.target });
      page.document.dispatchEvent(event);
    } else if (reason === 'hash') page.window.dispatchEvent(new Event('hashchange'));
    else {
      const event = new Event('animationend');
      event.animationName = 'scroll-enter';
      page.target.dispatchEvent(event);
    }
    assert.equal(page.classes.has('scroll-enter'), false, reason);
    assert.equal(page.properties.size, 0, reason);
  }
});

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const script = readFileSync(path.join(root, 'assets/script.js'), 'utf8');
const bootstrap = readFileSync(path.join(root, 'assets/motion-preference.js'), 'utf8');

function setup({ reduce = false, stored = null, blocked = false, legacy = false } = {}) {
  const data = new Map(stored ? [['portfolio-motion', stored]] : []);
  const query = new EventTarget();
  query.matches = reduce;
  query.addListener = (listener) =>
    EventTarget.prototype.addEventListener.call(query, 'change', listener);
  if (legacy) query.addEventListener = undefined;
  const label = { hidden: true };
  const control = new EventTarget();
  control.closest = () => label;
  const status = {};
  const document = {
    documentElement: { dataset: {} },
    querySelector: (selector) =>
      ({ '#motion-setting': control, '#motion-status': status })[selector] || null,
  };
  const context = vm.createContext({
    document,
    window: { matchMedia: () => query },
    EventTarget,
    Event,
    localStorage: {
      getItem(key) {
        if (blocked) throw Error('Storage blocked');
        return data.get(key) ?? null;
      },
      setItem(key, value) {
        if (blocked) throw Error('Storage blocked');
        data.set(key, value);
      },
    },
  });
  vm.runInContext(bootstrap, context);
  // Load the production functions, then initialize only the preference control.
  vm.runInContext(script.split('// The script is deferred')[0], context);
  vm.runInContext('initMotionPreference()', context);
  return {
    query,
    control,
    status,
    label,
    data,
    document,
    reduced: () => vm.runInContext('motionPreference.matches', context),
    choose(value) {
      control.value = value;
      control.dispatchEvent(new Event('change'));
    },
  };
}

test('device setting, explicit overrides, and returning to device setting stay synchronized', () => {
  for (const reduce of [false, true]) {
    const page = setup({ reduce });
    assert.equal(page.reduced(), reduce);
    assert.equal(page.control.value, 'system');
    assert.equal(page.label.hidden, false);
    page.choose('full');
    assert.equal(page.reduced(), false);
    assert.equal(page.document.documentElement.dataset.motion, 'full');
    assert.equal(page.status.textContent, 'Animations are on.');
    page.choose('reduced');
    assert.equal(page.reduced(), true);
    assert.equal(page.status.textContent, 'Reduced motion is on.');
    page.choose('system');
    assert.equal(page.reduced(), reduce);
    assert.equal(page.document.documentElement.dataset.motion, undefined);
    page.query.matches = !reduce;
    page.query.dispatchEvent(new Event('change'));
    assert.equal(page.reduced(), !reduce);
    assert.equal(page.status.textContent, !reduce ? 'Reduced motion is on.' : 'Animations are on.');
  }
});

test('explicit choices persist and restore before the stylesheet loads', () => {
  for (const stored of ['full', 'reduced']) {
    const page = setup({ reduce: stored === 'full', stored });
    assert.equal(page.control.value, stored);
    assert.equal(page.reduced(), stored === 'reduced');
    page.choose('system');
    assert.equal(page.data.get('portfolio-motion'), 'system');
  }
  assert.equal(setup({ stored: 'invalid' }).control.value, 'system');
});

test('blocked storage preserves a working preference for this visit', () => {
  const page = setup({ reduce: true, blocked: true });
  page.choose('full');
  assert.equal(page.reduced(), false);
  page.choose('reduced');
  assert.equal(page.reduced(), true);
});

test('legacy media-query listeners respond to device changes', () => {
  const page = setup({ legacy: true });
  page.query.matches = true;
  page.query.dispatchEvent(new Event('change'));
  assert.equal(page.status.textContent, 'Reduced motion is on.');
});

test('generated CSS parses without warnings or unresolved build directives', () => {
  const { transform } = require('lightningcss');
  const code = readFileSync(path.join(root, 'assets/styles.css'));
  const result = transform({ filename: 'styles.css', code, errorRecovery: false });
  assert.deepEqual(result.warnings, []);
  assert.doesNotMatch(code.toString(), /@(?:variant|custom-variant|slot)\b/);
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
    reduce() {
      document.documentElement.dataset.motion = 'reduced';
      vm.runInContext("motionPreference.dispatchEvent(new Event('change'))", context);
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

  test(`reduced motion suppresses entrances (${observer ? 'observer' : 'scroll fallback'})`, () => {
    const page = setupEntrances({ observer, reduce: true });
    page.scroll(100);
    page.enter();
    page.scroll(200);
    assert.equal(page.classes.has('scroll-enter'), false);
  });
}

test('focus, anchor navigation, motion changes, and completion settle entrances', () => {
  for (const reason of ['focus', 'hash', 'reduce', 'end']) {
    const page = setupEntrances();
    page.scroll(100);
    page.enter();
    assert.equal(page.classes.has('scroll-enter'), true);
    if (reason === 'focus') {
      const event = new Event('focusin');
      Object.defineProperty(event, 'target', { value: page.target });
      page.document.dispatchEvent(event);
    } else if (reason === 'hash') page.window.dispatchEvent(new Event('hashchange'));
    else if (reason === 'reduce') page.reduce();
    else {
      const event = new Event('animationend');
      event.animationName = 'scroll-enter';
      page.target.dispatchEvent(event);
    }
    assert.equal(page.classes.has('scroll-enter'), false, reason);
    assert.equal(page.properties.size, 0, reason);
  }
});

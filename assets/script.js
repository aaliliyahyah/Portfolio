// Shared references and user preferences.
const menuButton = document.querySelector('.menu-toggle');
const menuDialog = document.querySelector('#mobile-menu');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

function initNavigation() {
  const siteHeader = document.querySelector('.site-header');
  // Anchor offsets follow the actual fixed header, including its border and responsive size.
  function updateHeaderHeight() {
    document.documentElement.style.setProperty(
      '--header-height',
      `${siteHeader.getBoundingClientRect().height}px`,
    );
  }
  updateHeaderHeight();
  if ('ResizeObserver' in window) new ResizeObserver(updateHeaderHeight).observe(siteHeader);
  else window.addEventListener('resize', updateHeaderHeight);

  if (menuButton && menuDialog && typeof menuDialog.showModal === 'function') {
    siteHeader.classList.add('js-menu');
    menuButton.hidden = false;
    const closeMenu = () => menuDialog.close();
    menuButton.addEventListener('click', () => {
      menuDialog.showModal();
      menuButton.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('menu-visible');
    });
    menuDialog.querySelector('.menu-close').addEventListener('click', closeMenu);
    menuDialog.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    menuDialog.addEventListener('close', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('menu-visible');
      menuButton.focus({ preventScroll: true });
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', (event) => {
      if (event.matches && menuDialog.open) closeMenu();
    });
  }

  // Mark the section currently being read without intercepting anchor navigation.
  if ('IntersectionObserver' in window) {
    const navigationLinks = document.querySelectorAll('#main-nav a, .mobile-links a');
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting);
        if (!current) return;
        navigationLinks.forEach((link) => {
          if (link.hash === '#' + current.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
    );
    document
      .querySelectorAll('main section[id]')
      .forEach((section) => sectionObserver.observe(section));
  }
}

function initContactForm() {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const submitButton = document.querySelector('#contact-submit');

  if (form && status && submitButton) {
    submitButton.disabled = false;
    form.addEventListener(
      'invalid',
      (event) => {
        event.target.setAttribute('aria-invalid', 'true');
        status.textContent = 'Please complete the required fields and enter a valid email address.';
      },
      true,
    );
    form.addEventListener('input', (event) => {
      if (event.target.matches('input, textarea') && event.target.validity.valid) {
        event.target.removeAttribute('aria-invalid');
      }
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const recipient = form.dataset.recipient.trim();
      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient) ||
        /example\.(com|org|net)$|\[|\]/i.test(recipient)
      ) {
        status.textContent =
          'This portfolio is a template. Add a real recipient email to enable email drafts. Your message has not been sent.';
        return;
      }
      const fields = new FormData(form);
      const name = fields.get('name').trim();
      const subject = fields.get('subject').trim();
      const message = fields.get('message').trim();
      if (!name || !subject || !message) {
        const emptyField = ['name', 'subject', 'message'].find(
          (field) => !fields.get(field).trim(),
        );
        form.elements.namedItem(emptyField).setAttribute('aria-invalid', 'true');
        form.elements.namedItem(emptyField).focus();
        status.textContent = 'Please enter a name, subject, and message rather than spaces.';
        return;
      }
      const body = `${message}\n\nFrom: ${name}\nReply to: ${fields.get('email').trim()}`;
      const draft = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent =
        'Your email draft is ready. If your email app opens, review the draft and send it there. Nothing has been sent by this website.';
      window.location.href = draft;
    });
  }
}

function initPhotocard() {
  // Native button activation supports taps, clicks, Enter, and Space.
  const photocard = document.querySelector('.photocard');
  if (photocard) {
    photocard.disabled = false;
    photocard.classList.add('photocard-ready');
    photocard.setAttribute('aria-pressed', 'false');
    photocard.setAttribute('aria-label', 'Reveal Aaliyah’s photo');
    photocard.addEventListener('click', () => {
      const revealed = photocard.getAttribute('aria-pressed') !== 'true';
      photocard.setAttribute('aria-pressed', String(revealed));
      photocard.setAttribute(
        'aria-label',
        revealed
          ? 'Photo of Aaliyah wearing a red shirt and making a peace sign. Turn card back over'
          : 'Reveal Aaliyah’s photo',
      );
    });
  }
}

function initScrollAnimations() {
  // Progressive enhancement: no element is hidden until its observer is available.
  let revealObserver;
  const entranceAnimations = [];
  function finishMotion() {
    document.querySelectorAll('.reveal-pending').forEach((element) => {
      element.classList.remove('reveal-pending');
      element.classList.add('reveal-ready');
    });
    [...entranceAnimations].forEach((animation) => animation.finish());
  }
  if ('IntersectionObserver' in window) {
    const inView = new WeakSet();
    let previousScrollY = Math.max(0, window.scrollY);
    let scrollingDown = false;
    function updateScrollDirection() {
      const currentScrollY = Math.max(0, window.scrollY);
      if (currentScrollY === previousScrollY) return;
      scrollingDown = currentScrollY > previousScrollY;
      previousScrollY = currentScrollY;
      // Reversing direction immediately settles any entrance still in progress.
      if (!scrollingDown) finishMotion();
    }
    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    const selector =
      '.section-heading, .about-photo, .about-copy, .sticky-note, .toolkit-card, .toolkit-terminal, .education-panel, .project-card, .learning-goals-list li, .contact-copy, .contact-form';
    revealObserver = new IntersectionObserver(
      (entries) => {
        updateScrollDirection();
        const visible = entries.filter(({ target, isIntersecting }) => {
          if (!isIntersecting) {
            inView.delete(target);
            return false;
          }
          if (inView.has(target)) return false;
          inView.add(target);
          return true;
        });
        visible.forEach(({ target }, index) => {
          // Replay only on downward entries; upward entries stay fully visible.
          if (
            !scrollingDown ||
            motionPreference.matches ||
            target.contains(document.activeElement) ||
            typeof target.animate !== 'function'
          )
            return;
          const animations = [
            target.animate(
              [
                { opacity: 0, translate: '0 28px' },
                { opacity: 1, translate: '0 0' },
              ],
              {
                duration: 600,
                delay: Math.min(index, 3) * 65,
                easing: 'cubic-bezier(.22,1,.36,1)',
                fill: 'backwards',
              },
            ),
          ];
          animations.forEach((animation) => {
            entranceAnimations.push(animation);
            animation.addEventListener(
              'finish',
              () => {
                const position = entranceAnimations.indexOf(animation);
                if (position !== -1) entranceAnimations.splice(position, 1);
              },
              { once: true },
            );
          });
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' },
    );
    document.querySelectorAll(selector).forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) inView.add(element);
      revealObserver.observe(element);
    });
    document.addEventListener('focusin', (event) => {
      const target = event.target.closest(selector);
      if (!target) return;
      target.getAnimations().forEach((animation) => animation.finish());
    });
  }
  motionPreference.addEventListener('change', finishMotion);
  window.addEventListener('hashchange', () => {
    const target = document.getElementById(window.location.hash.slice(1));
    target?.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
  });
}

function initPointerEffects() {
  // Direct manipulation is limited to precise pointers, with no animation loop at rest.
  const interactiveResets = [];
  function followPointer(surface, target, strength, centered = false) {
    if (!surface || !target) return;
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      target.style.transform = '';
    };
    interactiveResets.push(reset);
    surface.addEventListener('pointermove', (event) => {
      if (motionPreference.matches || !precisePointer.matches || event.pointerType === 'touch')
        return;
      const bounds = surface.getBoundingClientRect();
      const x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
      const y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        target.style.transform = centered
          ? `translateX(-50%) translate(${x * strength}px, ${y * strength}px) rotate(${x * 2}deg)`
          : `perspective(900px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg)`;
        frame = 0;
      });
    });
    surface.addEventListener('pointerleave', reset);
    surface.addEventListener('pointercancel', reset);
  }
  followPointer(
    document.querySelector('.cover-hero'),
    document.querySelector('.cover-portrait'),
    16,
    true,
  );
  document
    .querySelectorAll('.project-image:not(.project-showcase)')
    .forEach((surface) => followPointer(surface, surface.querySelector('img'), 8));
  function resetInteractiveMotion() {
    interactiveResets.forEach((reset) => reset());
  }
  motionPreference.addEventListener('change', resetInteractiveMotion);
  precisePointer.addEventListener('change', resetInteractiveMotion);
  window.addEventListener('blur', resetInteractiveMotion);
}

function initToolkitAnimations() {
  // One-time meter load; no running timers when the toolkit is outside the viewport.
  if ('IntersectionObserver' in window) {
    const toolkitObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.classList.add('is-in-view');
          toolkitObserver.unobserve(target);
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll('.toolkit-grid, .toolkit-terminal')
      .forEach((element) => toolkitObserver.observe(element));
  }
}

function initBackgroundSpotlight() {
  // Brighten background dots near the pointer without adding a custom cursor.
  const spotlightLayers = new Map();
  document.querySelectorAll('.hero-backdrop, .section').forEach((surface) => {
    const layer = document.createElement('div');
    layer.className = 'background-spotlight';
    layer.setAttribute('aria-hidden', 'true');
    surface.prepend(layer);
    spotlightLayers.set(surface, layer);
  });
  let spotlightFrame = 0;
  let activeSpotlight = null;
  function hideSpotlight() {
    cancelAnimationFrame(spotlightFrame);
    spotlightFrame = 0;
    activeSpotlight?.classList.remove('is-active');
    activeSpotlight = null;
  }
  document.addEventListener(
    'pointermove',
    (event) => {
      if (
        event.pointerType !== 'mouse' ||
        motionPreference.matches ||
        !precisePointer.matches ||
        menuDialog?.open
      ) {
        hideSpotlight();
        return;
      }
      const surface = event.target.closest('.section, .hero-backdrop');
      const layer = spotlightLayers.get(surface);
      if (!layer) {
        hideSpotlight();
        return;
      }
      if (activeSpotlight !== layer) {
        hideSpotlight();
        activeSpotlight = layer;
        layer.classList.add('is-active');
      }
      cancelAnimationFrame(spotlightFrame);
      spotlightFrame = requestAnimationFrame(() => {
        const bounds = surface.getBoundingClientRect();
        layer.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
        layer.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
        spotlightFrame = 0;
      });
    },
    { passive: true },
  );
  document.documentElement.addEventListener('pointerleave', hideSpotlight);
  document.addEventListener('pointercancel', hideSpotlight);
  document.addEventListener('keydown', hideSpotlight);
  window.addEventListener('scroll', hideSpotlight, { passive: true });
  window.addEventListener('blur', hideSpotlight);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hideSpotlight();
  });
  motionPreference.addEventListener('change', hideSpotlight);
  precisePointer.addEventListener('change', hideSpotlight);
  menuButton?.addEventListener('click', hideSpotlight);
}

// The script is deferred, so the document is ready before features initialize.
initNavigation();
initContactForm();
initPhotocard();
initScrollAnimations();
initPointerEffects();
initToolkitAnimations();
initBackgroundSpotlight();
document.querySelector('#year').textContent = new Date().getFullYear();

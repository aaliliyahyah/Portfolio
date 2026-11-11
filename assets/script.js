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

// The script is deferred, so the document is ready before features initialize.
initNavigation();
initContactForm();
initPhotocard();
initToolkitAnimations();
document.querySelector('#year').textContent = new Date().getFullYear();

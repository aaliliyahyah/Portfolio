const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}

if (menuButton && navigation) {
  document.querySelector('.site-header').classList.add('js-menu');
  menuButton.hidden = false;
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(expanded));
    navigation.classList.toggle('is-open', expanded);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', closeMenu);
}

document.querySelector('#year').textContent = new Date().getFullYear();

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
      const emptyField = ['name', 'subject', 'message'].find((field) => !fields.get(field).trim());
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

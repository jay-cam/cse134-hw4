// ---- /scripts/form.js ----

// 1) Contact-form behavior (only if this page has a contact section)
const section = document.querySelector(
  'section[aria-labelledby="contact-heading"]'
);
if (section) {
  const form         = section.querySelector('form');
  const nameInput    = form.querySelector('#name');
  const emailInput   = form.querySelector('#email');
  const messageInput = form.querySelector('#message');
  const errorOut     = form.querySelector('output.error');
  const infoOut      = form.querySelector('output.info');
  const errorsField  = form.querySelector('#form-errors');

  let form_errors = [];

  // 1a) Mask illegal chars on name
  nameInput.addEventListener('input', () => {
    const illegal = nameInput.value.match(/[^A-Za-z\s'-]/);
    if (illegal) {
      const bad = illegal[0];
      // strip all illegal characters
      nameInput.value = nameInput.value.replace(/[^A-Za-z\s'-]/g, '');

      // flash the field
      nameInput.classList.add('flash-error');
      setTimeout(() => nameInput.classList.remove('flash-error'), 300);

      // show message, then clear it
      errorOut.textContent = `Illegal character “${bad}”`;
      setTimeout(() => (errorOut.textContent = ''), 2000);

      // record it
      form_errors.push({ field: 'name', badChar: bad, time: Date.now() });
    }
    nameInput.setCustomValidity(''); // clear any custom validity
  });

  // 1b) Character countdown on message textarea
  const maxLen = parseInt(messageInput.getAttribute('maxlength'), 10);
  messageInput.addEventListener('input', () => {
    const rem = maxLen - messageInput.value.length;
    infoOut.textContent = `${rem} characters remaining.`;
    // warning style when under 50 chars left
    infoOut.classList.toggle('warning', rem < 50);
  });

  // 1c) On submit, serialize our JS errors into the hidden field
  form.addEventListener('submit', e => {
    if (!form.checkValidity()) {
      e.preventDefault();
      form.reportValidity();
      return;
    }
    errorsField.value = JSON.stringify(form_errors);
  });
}

// 2) Dark / Light theme toggle (runs on every page)
const toggle = document.getElementById('theme-toggle');
if (toggle) {
  // un-hide the button
  toggle.hidden = false;

  // apply stored theme (default “light”)
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  toggle.textContent = saved === 'dark' ? '☀️' : '🌙';

  // toggle on click
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    toggle.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', next);
  });
}

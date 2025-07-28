// ---- /scripts/form.js ----
const section = document.querySelector('section[aria-labelledby="contact-heading"]');
const form = section.querySelector('form');
const nameInput    = form.querySelector('#name');
const emailInput   = form.querySelector('#email');
const messageInput = form.querySelector('#message');
const errorOut     = form.querySelector('output.error');
const infoOut      = form.querySelector('output.info');
const errorsField  = form.querySelector('#form-errors');

let form_errors = [];

// 1) Mask illegal chars on <input id="name">
nameInput.addEventListener('input', () => {
  // find the first character that is NOT in our allow‐list
  const illegalMatch = nameInput.value.match(/[^A-Za-z\s'-]/);
  if (illegalMatch) {
    const bad = illegalMatch[0];
    // strip all illegal characters
    nameInput.value = nameInput.value.replace(/[^A-Za-z\s'-]/g, '');

    // flash the field
    nameInput.classList.add('flash-error');
    setTimeout(() => nameInput.classList.remove('flash-error'), 300);

    // show message, then clear it
    errorOut.textContent = `Illegal character “${bad}”`;
    setTimeout(() => errorOut.textContent = '', 2000);

    // record it
    form_errors.push({ field: 'name', badChar: bad, time: Date.now() });
  }
  // clear any custom validity so built-in messages still work
  nameInput.setCustomValidity('');
});

// 2) Character countdown on <textarea id="message">
const maxLen = parseInt(messageInput.getAttribute('maxlength'), 10);
messageInput.addEventListener('input', () => {
  const rem = maxLen - messageInput.value.length;
  infoOut.textContent = `${rem} characters remaining.`;
  // add a warning style when under 50 chars left
  infoOut.classList.toggle('warning', rem < 50);
});

// 3) On submit, capture form_errors JSON and allow built-in validity
form.addEventListener('submit', e => {
  // if any HTML5 constraint fails, stop and show browser UI
  if (!form.checkValidity()) {
    e.preventDefault();
    form.reportValidity();
    return;
  }
  // otherwise serialize our JS errors into the hidden field
  errorsField.value = JSON.stringify(form_errors);
});

// — theme‐toggle.js (you can append into form.js if you prefer)

const toggle = document.getElementById('theme-toggle');
if (toggle) {
  // 1) un‐hide the button
  toggle.hidden = false;

  // 2) pick up saved theme or default to light
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  // set the correct icon
  toggle.textContent = (saved === 'dark' ? '☀️' : '🌙');

  // 3) switching logic
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = (current === 'light' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', next);
    toggle.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', next);
  });
}

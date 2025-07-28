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

// 1) Masking illegal chars on <input id="name">
const namePattern = /^[A-Za-z\s'-]*$/;
nameInput.addEventListener('input', e => {
  // if the whole value now fails, strip illegal chars:
  if (!namePattern.test(nameInput.value)) {
    const bad = nameInput.value.replace(namePattern, '')[0];
    nameInput.value = nameInput.value.replace(/[^A-Za-z\s'-]/g, '');
    // flash the field
    nameInput.classList.add('flash-error');
    setTimeout(()=> nameInput.classList.remove('flash-error'), 300);
    // show message, then clear
    errorOut.textContent = `Illegal character “${bad}”.`;
    setTimeout(()=> errorOut.textContent = '', 2000);
    // record it
    form_errors.push({ field: 'name', badChar: bad, time: Date.now() });
  }
  nameInput.setCustomValidity('');
});

// 2) Character countdown on <textarea id="message">
const maxLen = parseInt(messageInput.getAttribute('maxlength'), 10);
messageInput.addEventListener('input', () => {
  const rem = maxLen - messageInput.value.length;
  infoOut.textContent = `${rem} characters remaining.`;
  infoOut.classList.toggle('warning', rem < 50);
});

// 3) On submit, capture form_errors JSON and allow built‐in validity too
form.addEventListener('submit', e => {
  // if any built‐in constraint fails, prevent and show
  if (!form.checkValidity()) {
    e.preventDefault();
    form.reportValidity();
    return;
  }
  // otherwise attach our error log
  errorsField.value = JSON.stringify(form_errors);
});

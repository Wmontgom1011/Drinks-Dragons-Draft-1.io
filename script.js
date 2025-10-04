// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Simple client-side validation with live errors + success messages
function attachFormValidation(formId, fields, successId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const success = document.getElementById(successId);

  const validators = {
    required: (el) => el.value.trim().length > 0,
    numberRange: (el) => {
      const v = Number(el.value);
      const min = Number(el.min || 0);
      const max = Number(el.max || Infinity);
      return !Number.isNaN(v) && v >= min && v <= max;
    },
    email: (el) => /\S+@\S+\.\S+/.test(el.value),
    date: (el) => !!el.value
  };

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg || '';
  }

  // Pre-submit validation
  form.addEventListener('submit', (e) => {
    let valid = true;
    fields.forEach(f => {
      const input = document.getElementById(f.id);
      const errorId = f.errorId;
      let ok = true;

      if (f.rules.includes('required')) ok = ok && validators.required(input);
      if (f.rules.includes('numberRange')) ok = ok && validators.numberRange(input);
      if (f.rules.includes('email')) ok = ok && validators.email(input);
      if (f.rules.includes('date')) ok = ok && validators.date(input);

      if (!ok) {
        valid = false;
        showError(errorId, f.message);
        input.setAttribute('aria-invalid', 'true');
      } else {
        showError(errorId, '');
        input.removeAttribute('aria-invalid');
      }
    });

    e.preventDefault(); // demo only; do not actually submit
    if (valid && success) {
      success.hidden = false;
      success.focus?.();
    }
  });

  // Inline (before submit) field-level validation
  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const errorId = f.errorId;
    input?.addEventListener('input', () => {
      let ok = true;
      if (f.rules.includes('required')) ok = ok && validators.required(input);
      if (f.rules.includes('numberRange')) ok = ok && validators.numberRange(input);
      if (f.rules.includes('email')) ok = ok && validators.email(input);
      if (f.rules.includes('date')) ok = ok && validators.date(input);

      if (!ok) {
        showError(errorId, f.message);
        input.setAttribute('aria-invalid', 'true');
      } else {
        showError(errorId, '');
        input.removeAttribute('aria-invalid');
      }
    });
  });
}

// Attach to both forms
attachFormValidation('reserveForm', [
  { id: 'party', rules: ['required','numberRange'], message: 'Enter a party size between 1 and 12.', errorId: 'party-error' },
  { id: 'date',  rules: ['required','date'],        message: 'Pick a date for your reservation.',  errorId: 'date-error'  },
  { id: 'email', rules: ['required','email'],       message: 'Enter a valid email address.',        errorId: 'email-error' }
], 'reserve-success');

attachFormValidation('newsForm', [
  { id: 'news-email', rules: ['required','email'],  message: 'Enter a valid email address.',        errorId: 'news-error' }
], 'news-success');

// No timers, no autoplay media => no time limits imposed

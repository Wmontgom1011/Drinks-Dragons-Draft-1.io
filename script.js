const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

function attachFormValidation(formId, fields, successId){
  const f = document.getElementById(formId); if(!f) return;
  const success = document.getElementById(successId);

  function val(input, rules){
    const v = input.value.trim();
    let ok = true;
    rules.forEach(r => {
      if (r === 'required') ok = ok && v.length > 0;
      if (r === 'email')    ok = ok && /\S+@\S+\.\S+/.test(v);
      if (r === 'date')     ok = ok && !!v;
      if (r === 'range1-12') ok = ok && !isNaN(+v) && +v >= 1 && +v <= 12;
    });
    return ok;
  }

  f.addEventListener('submit', e => {
    e.preventDefault(); // static site demo
    let allGood = true;
    fields.forEach(cfg => {
      const el  = document.getElementById(cfg.id);
      const err = document.getElementById(cfg.err);
      const ok  = val(el, cfg.rules);
      if (!ok){ allGood = false; el.setAttribute('aria-invalid','true'); if(err) err.textContent = cfg.msg; }
      else { el.removeAttribute('aria-invalid'); if(err) err.textContent = ''; }
    });
    if (allGood && success){ success.hidden = false; success.focus?.(); }
  });

  fields.forEach(cfg => {
    const el  = document.getElementById(cfg.id);
    const err = document.getElementById(cfg.err);
    el?.addEventListener('input', () => {
      const ok = val(el, cfg.rules);
      if (!ok){ el.setAttribute('aria-invalid','true'); if(err) err.textContent = cfg.msg; }
      else { el.removeAttribute('aria-invalid'); if(err) err.textContent = ''; }
    });
  });
}

// === Guild form: live validation + real submit to Formspree ===
const guildForm = document.getElementById('guildForm');
const formMsg  = document.getElementById('formMessage');

function showError(input, message) {
  let err = input.nextElementSibling;
  if (!err || !err.classList.contains('error')) {
    err = document.createElement('div');
    err.className = 'error';
    input.insertAdjacentElement('afterend', err);
  }
  err.textContent = message;
  input.setAttribute('aria-invalid', 'true');
}
function clearError(input) {
  const err = input.nextElementSibling;
  if (err && err.classList.contains('error')) err.textContent = '';
  input.removeAttribute('aria-invalid');
}
function validateField(input) {
  if (input.validity.valid) { clearError(input); return true; }
  if (input.validity.valueMissing) showError(input, 'This field is required.');
  else if (input.type === 'email' && input.validity.typeMismatch) showError(input, 'Please enter a valid email.');
  else showError(input, 'Please correct this field.');
  return false;
}

if (guildForm) {
  // live validation
  ['input', 'blur'].forEach(evt => {
    guildForm.addEventListener(evt, e => {
      if (e.target.matches('#name, #email')) validateField(e.target);
    });
  });

  guildForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameOk  = validateField(guildForm.querySelector('#name'));
    const emailOk = validateField(guildForm.querySelector('#email'));
    if (!nameOk || !emailOk) {
      guildForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    try {
      const resp = await fetch(guildForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(guildForm)
      });

      if (resp.ok) {
        formMsg.className = 'form-message success';
        formMsg.textContent = 'Thanks for joining the Guild! Check your inbox for a welcome scroll.';
        guildForm.reset();
        guildForm.querySelector('#name')?.focus();
      } else {
        formMsg.className = 'form-message error';
        formMsg.textContent = 'Hmm, something went wrong. Please try again in a moment.';
      }
    } catch (err) {
      formMsg.className = 'form-message error';
      formMsg.textContent = 'Network hiccup. Please try again.';
    }
  });
}

<!-- include on every page just before </body> -->
<script>
  // Footer year
  (function(){
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  })();

  // simple validation + success messages (demo only)
  function attachFormValidation(formId, fields, successId){
    var f = document.getElementById(formId); if(!f) return;
    var success = document.getElementById(successId);

    function val(input, rules){
      var v = input.value.trim();
      var ok = true;
      rules.forEach(function(r){
        if (r === 'required') ok = ok && v.length > 0;
        if (r === 'email') ok = ok && /\S+@\S+\.\S+/.test(v);
        if (r === 'date') ok = ok && !!v;
        if (r === 'range1-12') ok = ok && !isNaN(+v) && +v >= 1 && +v <= 12;
      });
      return ok;
    }

    f.addEventListener('submit', function(e){
      e.preventDefault(); // demo — no server
      var allGood = true;
      fields.forEach(function(cfg){
        var el = document.getElementById(cfg.id);
        var err = document.getElementById(cfg.err);
        var ok = val(el, cfg.rules);
        if (!ok){ allGood = false; el.setAttribute('aria-invalid','true'); if(err) err.textContent = cfg.msg; }
        else { el.removeAttribute('aria-invalid'); if(err) err.textContent = ''; }
      });
      if (allGood && success){ success.hidden = false; success.focus && success.focus(); }
    });

    fields.forEach(function(cfg){
      var el = document.getElementById(cfg.id);
      var err = document.getElementById(cfg.err);
      el && el.addEventListener('input', function(){
        var ok = val(el, cfg.rules);
        if (!ok){ el.setAttribute('aria-invalid','true'); if(err) err.textContent = cfg.msg; }
        else { el.removeAttribute('aria-invalid'); if(err) err.textContent = ''; }
      });
    });
  }
// === Footer year ===
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// === Guild form: live validation + success message (no backend needed) ===
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
  if (input.validity.valid) {
    clearError(input);
    return true;
  }
  if (input.validity.valueMissing) showError(input, 'This field is required.');
  else if (input.type === 'email' && input.validity.typeMismatch) showError(input, 'Please enter a valid email.');
  else showError(input, 'Please correct this field.');
  return false;
}

if (guildForm) {
  // Live validation (before submit)
  ['input', 'blur'].forEach(evt => {
    guildForm.addEventListener(evt, e => {
      if (e.target.matches('#name, #email')) validateField(e.target);
    });
  });

  // Submit handler (client-side "success")
  guildForm.addEventListener('submit', e => {
    e.preventDefault();

    const nameOk  = validateField(guildForm.querySelector('#name'));
    const emailOk = validateField(guildForm.querySelector('#email'));
    if (!nameOk || !emailOk) {
      guildForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    // (Optional) store locally for demo / grading
    const data = Object.fromEntries(new FormData(guildForm).entries());
    console.log('Guild signup (demo):', data);

    // Success UI
    formMsg.className = 'form-message success';
    formMsg.textContent = 'Thanks for joining the Guild! Check your inbox for a welcome scroll.';
    guildForm.reset();
    guildForm.querySelector('#name')?.focus();
  });
}
</script>

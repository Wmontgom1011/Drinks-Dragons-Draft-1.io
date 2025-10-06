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
</script>

/* BEALGND · Black Friday (nov 2026)
   - Actualiza todas las cuentas atrás [data-bea-bf-cd] cada segundo.
   - Al llegar a la hora de fin: oculta las cuentas atrás y, si el ajuste
     "Al terminar, quitar todo lo de Black Friday" está activo, oculta [data-bea-bf],
     vuelve a mostrar [data-bea-bf-off] y quita la clase bea-bf del body. */
(function () {
  var BF = window.BEA_BF = window.BEA_BF || {};
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function parts(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
  }
  var UD = /^fr/i.test(document.documentElement.lang || '') ? 'J' : 'D';
  function text(p, fmt) {
    if (fmt === 'colon') {
      return p.d > 0 ? pad(p.d) + UD + ' : ' + pad(p.h) + 'H : ' + pad(p.m) + 'M' : pad(p.h) + 'H : ' + pad(p.m) + 'M : ' + pad(p.s) + 'S';
    }
    return p.d > 0 ? pad(p.d) + UD + ' ' + pad(p.h) + 'H ' + pad(p.m) + 'M' : pad(p.h) + 'H ' + pad(p.m) + 'M ' + pad(p.s) + 'S';
  }
  function hideAll(sel, val) { document.querySelectorAll(sel).forEach(function (el) { el.hidden = val; }); }
  var timer = null;
  function finish() {
    BF.live = false;
    hideAll('[data-bea-bf-cd], [data-bea-bf-cd-wrap]', true);
    if (BF.hideAfter) {
      hideAll('[data-bea-bf]', true);
      hideAll('[data-bea-bf-off]', false);
      if (document.body) document.body.classList.remove('bea-bf');
    }
    if (timer) { clearInterval(timer); timer = null; }
  }
  function tick() {
    if (!BF.end) return;
    var left = BF.end * 1000 - Date.now();
    if (left <= 0) { finish(); return; }
    // Cuenta atrás solo en los últimos días (ajuste del tema) y texto «Last chance» las últimas 24 h
    var win = (BF.cdDays || 0) * 86400000;
    if (document.body) document.body.classList.toggle('bea-bf-nocd', win > 0 && left > win);
    var last = left <= 86400000;
    document.querySelectorAll('[data-bea-bf-text]').forEach(function (el) {
      var t = el.getAttribute(last ? 'data-last' : 'data-normal');
      if (t && el.textContent !== t) el.textContent = t;
    });
    var p = parts(left);
    document.querySelectorAll('[data-bea-bf-cd]').forEach(function (el) {
      var fmt = el.getAttribute('data-fmt') || 'words';
      if (fmt === 'blocks') {
        var d = el.querySelector('[data-d]'), h = el.querySelector('[data-h]'), m = el.querySelector('[data-m]');
        if (d) d.textContent = pad(p.d);
        if (h) h.textContent = pad(p.h);
        if (m) m.textContent = pad(p.m);
      } else {
        var t = text(p, fmt);
        if (el.textContent !== t) el.textContent = t;
      }
    });
  }
  BF.tick = tick;
  tick();
  timer = setInterval(tick, 1000);
  document.addEventListener('DOMContentLoaded', tick);
  document.addEventListener('shopify:section:load', tick);
})();

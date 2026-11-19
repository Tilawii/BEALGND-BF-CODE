/* BEALGND · header transparente sobre el hero / galería de producto (sticky nativo de Dawn) */
(function () {
  var isIndex = document.body.classList.contains('bea-tpl-index');
  var isProduct = document.body.classList.contains('bea-tpl-product');
  if (!isIndex && !isProduct) return;

  var wrapper = document.querySelector('.header-wrapper');
  var section = wrapper ? wrapper.closest('.shopify-section') : null;
  if (!section) return;
  section.classList.add('bea-header-section');

  var main = document.getElementById('MainContent');
  var hero = null;
  if (isIndex) {
    // en la home: la primera sección (el hero)
    hero = main ? main.querySelector('.shopify-section') : null;
  } else {
    // en producto: la galería de imágenes
    hero = document.querySelector('media-gallery') ||
           document.querySelector('.product__media-wrapper') ||
           (main ? main.querySelector('.shopify-section') : null);
  }

  function setOverlap() {
    section.style.marginBottom = (-section.offsetHeight) + 'px';
  }

  function updateState() {
    if (!hero) return;
    var headerH = section.offsetHeight;
    var bottom = hero.getBoundingClientRect().bottom;
    if (bottom > headerH + 8) {
      document.body.classList.add('bea-over-hero');
    } else {
      document.body.classList.remove('bea-over-hero');
    }
  }

  function refresh() { setOverlap(); updateState(); }

  refresh();
  window.addEventListener('load', refresh);
  window.addEventListener('resize', refresh);
  window.addEventListener('scroll', updateState, { passive: true });
  document.addEventListener('shopify:section:load', refresh); // para el editor
})();

/* BEALGND · slider de imágenes en fichas de producto (scroll nativo + indicadores) */
if (!customElements.get('bea-card-slider')) {
  customElements.define('bea-card-slider', class extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('.bea-cardslider__track');
      this.dots = Array.prototype.slice.call(this.querySelectorAll('.bea-cardslider__indicator'));
      var n = parseInt(this.dataset.count || '1', 10);
      if (!this.track || n < 2) return;
      var self = this;
      this.track.addEventListener('scroll', function () {
        clearTimeout(self._t);
        self._t = setTimeout(function () {
          var i = Math.round(self.track.scrollLeft / self.track.clientWidth);
          self.dots.forEach(function (d, j) { d.classList.toggle('is-active', j === i); });
        }, 30);
      }, { passive: true });
    }
  });
}

/* BEALGND · menu lateral: la barra de anuncios queda visible al abrir; el panel empieza debajo (nov 2026) */
(function () { function setAnn() { var a = document.querySelector('.bealgnd-announcement'); var h = a ? Math.max(0, Math.round(a.getBoundingClientRect().bottom)) : 0; document.documentElement.style.setProperty('--bea-ann-h', h + 'px'); } function init() { var d = document.getElementById('Details-menu-drawer-container'); if (!d) return; var s = d.querySelector('summary'); if (s) s.addEventListener('click', setAnn, true); d.addEventListener('toggle', setAnn); window.addEventListener('resize', setAnn); setAnn(); } if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init(); })();
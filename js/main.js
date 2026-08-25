/* ================================================================
   ARGES · main.js
   Comportamiento GLOBAL, cargado en las 9 páginas del sitio.
   Cada bloque es una función independiente que se puede leer,
   probar o migrar por separado (útil de cara a un futuro framework).
   ================================================================ */

/**
 * Menú hamburguesa: abre/cierra .nav-links al hacer clic en
 * .nav-toggle, y cierra el menú si se hace clic fuera de él.
 */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!toggle.contains(event.target) && !links.contains(event.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Resalta en el menú el enlace correspondiente a la página actual,
 * comparando el nombre de archivo de cada href con la URL actual.
 */
function highlightActiveNavLink() {
  // Se compara la RUTA COMPLETA ya resuelta, no solo el nombre del
  // archivo: varias secciones tienen su propio "index.html" y antes
  // se resaltaban entre sí (Recursos se marcaba estando en la portada).
  const actual = normalizar(window.location.pathname);

  document.querySelectorAll('.nav-links a').forEach((link) => {
    const destino = normalizar(new URL(link.href, window.location.href).pathname);
    if (destino === actual) link.classList.add('active');
  });

  function normalizar(ruta) {
    return decodeURIComponent(ruta).replace(/\/index\.html$/, '/').replace(/\/$/, '/') || '/';
  }
}

/**
 * Anima la aparición (fade + slide) de cualquier elemento marcado
 * con [data-reveal] cuando entra en el viewport, usando
 * IntersectionObserver (una sola vez por elemento).
 */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/**
 * Anima un número desde 0 hasta el valor de data-count con una
 * curva de desaceleración (ease-out cúbico).
 */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  if (Number.isNaN(target)) return;

  // Si la persona pidió movimiento reducido, se muestra el número
  // final de una vez en lugar de animarlo.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = target;
    return;
  }

  const isInt = Number.isInteger(target);
  const duration = 1100;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = isInt ? Math.round(target * eased) : (target * eased).toFixed(1);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/**
 * Dispara animateCount() sobre todos los [data-count] de la
 * .stats-bar cuando esta entra en pantalla (solo una vez).
 */
function initStatsCounter() {
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        statsBar.querySelectorAll('[data-count]').forEach(animateCount);
        observer.unobserve(statsBar);
      }
    },
    { threshold: 0.5 }
  );
  observer.observe(statsBar);
}

/**
 * Hace scroll suave para cualquier enlace interno tipo <a href="#id">.
 */
function initAnchorSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}


/**
 * Botón "volver arriba": aparece cuando el usuario ha bajado más de
 * una pantalla y devuelve al inicio de la página con scroll suave.
 * El botón vive en el HTML de todas las páginas (id="to-top").
 */
function initBackToTop() {
  const btn = document.getElementById('to-top');
  if (!btn) return;

  const UMBRAL = 400; // píxeles de scroll antes de mostrarlo

  function actualizar() {
    btn.classList.toggle('is-visible', window.scrollY > UMBRAL);
  }

  window.addEventListener('scroll', actualizar, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  actualizar();
}


/**
 * Menú desplegable del nav ("Recursos"): la palabra es un enlace
 * normal a la página índice y la flecha de al lado abre la lista.
 * En móvil la lista ya viene desplegada, así que esto no interviene.
 */
function initNavDropdown() {
  const items = document.querySelectorAll('[data-nav-dropdown]');
  if (!items.length) return;

  items.forEach((item) => {
    const caret = item.querySelector('.nav-caret');
    if (!caret) return;

    caret.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const abierto = item.classList.toggle('is-open');
      caret.setAttribute('aria-expanded', String(abierto));
    });
  });

  // Cerrar al hacer clic fuera o con Escape.
  document.addEventListener('click', (e) => {
    items.forEach((item) => {
      if (!item.contains(e.target)) {
        item.classList.remove('is-open');
        const c = item.querySelector('.nav-caret');
        if (c) c.setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    items.forEach((item) => {
      item.classList.remove('is-open');
      const c = item.querySelector('.nav-caret');
      if (c) c.setAttribute('aria-expanded', 'false');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavDropdown();
  initBackToTop();
  initNavToggle();
  highlightActiveNavLink();
  initScrollReveal();
  initStatsCounter();
  initAnchorSmoothScroll();
});

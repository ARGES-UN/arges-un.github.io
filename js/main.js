/* ============================================================
   ARCANUM · JavaScript global
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAV: hamburger ---- */
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
  }

  /* ---- NAV: marcar enlace activo ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- SCROLL: reveal de elementos ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---- CONTADOR animado (stats bar) ---- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const isInt = Number.isInteger(target);
    const duration = 1200;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;
      el.textContent = isInt ? Math.round(current) : current.toFixed(1);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const io2 = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        statsBar.querySelectorAll('[data-count]').forEach(animateCount);
        io2.unobserve(statsBar);
      }
    }, { threshold: 0.5 });
    io2.observe(statsBar);
  }

  /* ---- FORMULARIO DE CONTACTO (previene submit vacío) ---- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      // Aquí conectar con backend o Formspree cuando esté listo
      const btn = form.querySelector('[type=submit]');
      btn.textContent = '¡Enviado!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = 'Enviar mensaje'; btn.disabled = false; form.reset(); }, 3000);
    });
  }

});

/* ---- UTIL: scroll suave a ancla ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

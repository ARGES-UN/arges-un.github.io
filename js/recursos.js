/* ================================================================
   ARGES · extras.js
   Filtro por categoría del listado de noticias y convocatorias.
   ================================================================ */
function initNoticiasFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const entries = document.querySelectorAll('.news-entry');
  const emptyState = document.getElementById('empty-state');
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;
      let visibles = 0;
      entries.forEach((entry) => {
        const mostrar = filter === 'all' || entry.dataset.cat === filter;
        entry.classList.toggle('hidden', !mostrar);
        if (mostrar) visibles++;
      });
      if (emptyState) emptyState.style.display = visibles === 0 ? 'block' : 'none';
    });
  });
}
document.addEventListener('DOMContentLoaded', initNoticiasFilters);

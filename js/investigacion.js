/* ================================================================
   ARGES · investigacion.js  (extiende main.js)
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── TABS DE LÍNEAS DE TRABAJO ── */
  const tabs   = document.querySelectorAll('.linea-tab');
  const panels = document.querySelectorAll('.linea-panel');

  function activateTab(targetId) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.linea === targetId));
    panels.forEach(p => p.classList.toggle('active', p.id === 'linea-' + targetId));
    // actualizar hash sin saltar la página
    history.replaceState(null, '', '#' + targetId);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.linea));
  });

  // activar desde hash en la URL (ej: investigacion.html#end)
  const hash = window.location.hash.replace('#', '');
  const validIds = Array.from(tabs).map(t => t.dataset.linea);
  if (hash && validIds.includes(hash)) {
    activateTab(hash);
  } else if (tabs.length) {
    activateTab(tabs[0].dataset.linea);
  }

});

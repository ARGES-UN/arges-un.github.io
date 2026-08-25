/* ================================================================
   ARGES · investigacion.js  (extiende main.js)
   Cambio de línea de trabajo, con dos controles equivalentes:
   las pestañas (escritorio) y el desplegable (móvil).
   Al añadir una línea nueva no hay que tocar este archivo: se
   sincroniza solo con lo que exista en el HTML.
   ================================================================ */

function initLineas() {
  const tabs = document.querySelectorAll('.linea-tab');
  const panels = document.querySelectorAll('.linea-panel');
  const select = document.querySelector('.lineas-select');
  const selectBtn = document.querySelector('.lineas-select-btn');
  const opciones = document.querySelectorAll('.lineas-select-list button');
  if (!panels.length) return;

  function activar(id, moverFoco) {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.linea === id));
    panels.forEach((p) => p.classList.toggle('active', p.id === 'linea-' + id));
    opciones.forEach((o) => o.classList.toggle('is-active', o.dataset.linea === id));

    // El botón del desplegable muestra siempre la línea activa.
    const activa = Array.from(opciones).find((o) => o.dataset.linea === id);
    if (selectBtn && activa) {
      selectBtn.querySelector('.sel-label').textContent = activa.dataset.nombre;
      selectBtn.querySelector('.sel-count').textContent = activa.dataset.count;
      const icono = selectBtn.querySelector('i:first-child');
      if (icono) icono.className = 'ti ' + activa.dataset.icono;
    }

    history.replaceState(null, '', '#' + id);
    if (select) select.classList.remove('is-open');

    // Al elegir desde el desplegable, llevar la vista al contenido.
    if (moverFoco) {
      const panel = document.getElementById('linea-' + id);
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  tabs.forEach((t) => t.addEventListener('click', () => activar(t.dataset.linea, false)));
  opciones.forEach((o) => o.addEventListener('click', () => activar(o.dataset.linea, true)));

  if (selectBtn && select) {
    selectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      select.classList.toggle('is-open');
    });
    document.addEventListener('click', (e) => {
      if (!select.contains(e.target)) select.classList.remove('is-open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') select.classList.remove('is-open');
    });
  }

  const validos = Array.from(panels).map((p) => p.id.replace('linea-', ''));
  const hash = window.location.hash.replace('#', '');
  activar(validos.includes(hash) ? hash : validos[0], false);
}

document.addEventListener('DOMContentLoaded', initLineas);

/* ================================================================
   ARGES · galeria.js  (extiende main.js)
   Usado únicamente por pages/proyectos/*.html.

   Abre en grande la foto o el video que el usuario pulse en la
   galería del proyecto, con flechas para pasar a la siguiente y sin
   ningún botón de descarga.

   Nota honesta sobre "protegido": esto NO es seguridad real. Cualquier
   archivo que llega al navegador se puede guardar por otras vías
   (herramientas de desarrollador, capturas de pantalla, "Inspeccionar
   elemento"). Lo que sí logra: quitar el atajo fácil (clic derecho,
   arrastrar la imagen, botón de descarga del reproductor de video).
   Es una barrera razonable para una web pública, no una caja fuerte.
   ================================================================ */

function initGaleria() {
  const grid = document.querySelector('.galeria-grid');
  const lightbox = document.getElementById('lightbox');
  if (!grid || !lightbox) return;

  // Solo cuentan los ítems que YA tienen una foto o video real dentro
  // (los ".is-empty" son solo un aviso de "próximamente", no se abren).
  const items = Array.from(grid.querySelectorAll('.galeria-item')).filter(
    (el) => el.querySelector('img, video')
  );
  if (!items.length) return;

  const stage = lightbox.querySelector('.lightbox-stage');
  const caption = lightbox.querySelector('.lightbox-caption');
  const btnPrev = lightbox.querySelector('.lightbox-prev');
  const btnNext = lightbox.querySelector('.lightbox-next');

  // El fondo (.lightbox-backdrop) y el cuerpo (.lightbox-body) cierran el
  // visor al pulsarlos — así clicar "fuera de la foto" cierra, sin
  // necesidad de un botón "cerrar" gigante. Pero un clic SOBRE la propia
  // foto/video no debe cerrar nada: se detiene aquí antes de que suba
  // hasta el .lightbox-body.
  stage.addEventListener('click', (e) => e.stopPropagation());

  let indice = 0;
  let focoPrevio = null;

  /** Pone en el visor el ítem "i" (sin abrir ni cerrar nada). */
  function mostrar(i) {
    indice = (i + items.length) % items.length; // vuelve al principio/final sin romperse
    const original = items[indice].querySelector('img, video');
    const texto = items[indice].dataset.caption || original.getAttribute('alt') || '';

    stage.innerHTML = '';

    if (original.tagName === 'IMG') {
      const grande = document.createElement('img');
      // data-full permite servir una versión de mayor resolución que la
      // miniatura; si no existe, se usa la misma imagen de la miniatura.
      grande.src = original.dataset.full || original.currentSrc || original.src;
      grande.alt = original.alt || '';
      grande.draggable = false;
      stage.appendChild(grande);
    } else {
      const grande = document.createElement('video');
      grande.src = original.currentSrc || original.src;
      grande.controls = true;
      grande.autoplay = true;
      grande.playsInline = true;
      grande.controlsList = 'nodownload noremoteplayback'; // Chrome/Edge respetan esto; Firefox y Safari, no siempre
      grande.disablePictureInPicture = true;
      grande.addEventListener('contextmenu', (e) => e.preventDefault());
      stage.appendChild(grande);
    }

    caption.textContent = texto;
    caption.hidden = !texto;
  }

  /** Abre el visor mostrando el ítem "i". */
  function abrir(i) {
    mostrar(i);

    const hayVarios = items.length > 1;
    btnPrev.hidden = !hayVarios;
    btnNext.hidden = !hayVarios;

    focoPrevio = document.activeElement; // para devolver el foco al cerrar
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightbox.querySelector('.lightbox-close').focus();
  }

  /** Cierra el visor y libera el video si había uno reproduciéndose. */
  function cerrar() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    stage.querySelectorAll('video').forEach((v) => v.pause());
    stage.innerHTML = '';
    if (focoPrevio) focoPrevio.focus();
  }

  // Cada miniatura abre el visor en su propia posición.
  items.forEach((item, i) => {
    item.addEventListener('click', () => abrir(i));
    item.querySelector('img, video').draggable = false;
    item.addEventListener('contextmenu', (e) => e.preventDefault());
  });

  // Controles del visor (compartidos por toda la galería de la página).
  lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) =>
    el.addEventListener('click', cerrar)
  );
  btnPrev.addEventListener('click', () => mostrar(indice - 1));
  btnNext.addEventListener('click', () => mostrar(indice + 1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') cerrar();
    if (e.key === 'ArrowLeft') mostrar(indice - 1);
    if (e.key === 'ArrowRight') mostrar(indice + 1);
  });
}

document.addEventListener('DOMContentLoaded', initGaleria);

/* ================================================================
   ARGES · equipo.js  (extiende main.js)
   1) Scroll automático a la persona si la URL trae #slug.
   2) Rotación de las dos fotos de cada persona, ESCALONADA: no cambian
      todas a la vez, sino una tras otra, con un desfase fijo entre
      tarjetas. Así la página se siente viva sin parpadear entera.
   ================================================================ */

/** Si la URL trae un hash (ej. equipo.html#ian-rivera), baja hasta esa tarjeta. */
function scrollToMemberFromHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (target) {
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
  }
}

/**
 * Rotador de fotos por persona.
 * INTERVALO   = cuánto dura cada foto en pantalla.
 * DESFASE     = separación entre una tarjeta y la siguiente, para que
 *               cambien en cascada (persona 1, luego persona 2, ...).
 * Ambos se pueden ajustar aquí sin tocar nada más.
 */
function initMemberSliders() {
  // Un solo reloj para todo el equipo: en cada golpe avanza UNA tarjeta y
  // le pasa el turno a la siguiente. Así nunca coinciden dos cambios.
  const PASO = 2000; // ms entre un cambio y el siguiente

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // En celular las dos fotos se ven a la vez (collage), así que no hay
  // nada que rotar y no vale la pena mantener un temporizador corriendo.
  if (window.matchMedia('(max-width: 560px)').matches) return;
  
  const tarjetas = Array.from(document.querySelectorAll('[data-member-slider]'))
    .map((galeria) => {
      const fotos = galeria.querySelectorAll('.member-slide');
      const puntos = galeria.querySelectorAll('.member-dots span');
      if (fotos.length < 2) return null; // con una sola foto no hay nada que rotar

      let actual = 0;
      return function avanzar() {
        actual = (actual + 1) % fotos.length;
        fotos.forEach((f, k) => f.classList.toggle('is-active', k === actual));
        puntos.forEach((p, k) => p.classList.toggle('is-active', k === actual));
      };
    })
    .filter(Boolean);

  if (!tarjetas.length) return;

  let turno = 0;
  let reloj = null;

  function tic() {
    tarjetas[turno]();
    turno = (turno + 1) % tarjetas.length;
  }

  function arrancar() { if (!reloj) reloj = setInterval(tic, PASO); }
  function parar() { clearInterval(reloj); reloj = null; }

  arrancar();

  // Un único listener (antes había uno por tarjeta, y al volver a la
  // pestaña las reiniciaba todas a la vez, sincronizándolas).
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) parar(); else arrancar();
  });
}

window.addEventListener('load', scrollToMemberFromHash);
document.addEventListener('DOMContentLoaded', initMemberSliders);

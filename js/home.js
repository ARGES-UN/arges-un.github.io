/* ================================================================
   ARGES · home.js  (extiende main.js)
   Solo para index.html:
   1) Carrusel de la barra de datos (líneas, proyectos y personas).
   2) Collage de fondo del hero.
   ================================================================ */

/** Baraja un arreglo en el sitio (Fisher–Yates). */
function barajar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

/**
 * Carrusel de la barra de datos.
 *
 * - El orden se baraja en cada recarga.
 * - Se duplica el contenido para que el bucle no tenga costura.
 * - Se detiene con el mouse encima (CSS) y, en pantallas táctiles,
 *   tocándolo, porque en un celular no existe el "hover".
 * - El botón recorre tres estados: normal → lento → pausa → normal…
 *   Al cambiar de velocidad NO se reinicia la posición: se calcula
 *   dónde iba la cinta y se arranca la nueva animación justo desde
 *   ahí, así el cambio se ve continuo y no da un salto.
 */
function initStatsMarquee() {
  const marquee = document.querySelector('.stats-marquee');
  const track = document.getElementById('marquee-track');
  const boton = document.querySelector('.stats-speed');
  if (!marquee || !track) return;

  // 1. Barajar y duplicar.
  const items = Array.from(track.children);
  barajar(items).forEach((item) => track.appendChild(item));
  items.forEach((item) => {
    const copia = item.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true');
    copia.tabIndex = -1;
    track.appendChild(copia);
  });

  // 2. Pausa al tocar (dispositivos sin mouse).
  if (window.matchMedia('(hover: none)').matches) {
    marquee.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('.stats-speed')) return;
      marquee.classList.toggle('is-paused');
    });
  }

  if (!boton) return;

  // 3. Estados del botón. Duraciones altas = movimiento lento.
  const ESTADOS = [
    { id: 'normal', dur: 150, etiqueta: '1×',  titulo: 'Velocidad normal · clic para ir más lento' },
    { id: 'lento',  dur: 300, etiqueta: '½×',  titulo: 'Velocidad lenta · clic para pausar' },
    { id: 'pausa',  dur: null, etiqueta: null, titulo: 'En pausa · clic para reanudar' },
  ];
  let indice = 0;

  /** Fracción del recorrido ya avanzada (0 a 1), leyendo la posición real. */
  function progresoActual() {
    const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    const recorrido = track.scrollWidth / 2; // la cinta está duplicada
    if (!recorrido) return 0;
    const avance = -m.m41 % recorrido;
    return avance / recorrido;
  }

  function aplicar(nuevo, conservarPosicion) {
    const estado = ESTADOS[nuevo];

    if (estado.dur === null) {
      marquee.classList.add('is-stopped');
    } else {
      const fraccion = conservarPosicion ? progresoActual() : 0;
      marquee.classList.remove('is-stopped');
      // Reiniciar la animación con un retardo negativo la coloca
      // exactamente en el punto donde iba: sin salto visible.
      track.style.animation = 'none';
      void track.offsetWidth; // fuerza el reflow para que el reinicio surta efecto
      track.style.animation = '';
      track.style.setProperty('--marquee-duration', estado.dur + 's');
      track.style.animationDelay = `-${(fraccion * estado.dur).toFixed(3)}s`;
    }

    boton.title = estado.titulo;
    boton.setAttribute('aria-label', estado.titulo);
    boton.innerHTML = estado.etiqueta
      ? `<span class="speed-label">${estado.etiqueta}</span>`
      : '<i class="ti ti-player-pause" aria-hidden="true"></i>';
    boton.dataset.estado = estado.id;
  }

  aplicar(0, false);
  boton.addEventListener('click', () => {
    indice = (indice + 1) % ESTADOS.length;
    aplicar(indice, true);
  });
}

/**
 * Collage del hero: baraja las láminas y duplica la tira para que el
 * desplazamiento lateral sea continuo. Si el hero no tiene la clase
 * `has-collage`, no se hace nada y queda la cuadrícula de siempre.
 */
function initHeroCollage() {
  const hero = document.querySelector('.hero');
  const track = document.getElementById('collage-track');
  if (!hero || !track || !hero.classList.contains('has-collage')) return;

  const laminas = Array.from(track.children);
  barajar(laminas).forEach((l) => track.appendChild(l));
  laminas.forEach((l) => {
    const copia = l.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true');
    track.appendChild(copia);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStatsMarquee();
  initHeroCollage();
});

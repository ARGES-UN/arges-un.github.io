# ARCANUM · v2 — Semillero de Soldadura & END · UNAL Bogotá
> Paleta oscura industrial · Azul / Negro / Gris

---

## Estructura del proyecto

```
arcanum-v2/
├── index.html                  ← Página de inicio
├── css/
│   └── main.css                ← ÚNICA fuente de estilos (tokens + todos los componentes)
├── js/
│   └── main.js                 ← JavaScript global compartido
├── pages/
│   ├── investigacion.html
│   ├── equipo.html
│   ├── noticias.html
│   └── contacto.html
└── assets/
    └── img/                    ← Fotos del lab, equipo, resultados
```

---

## Regla de oro de esta versión

**Cero estilos en los HTML.** Todo el CSS vive en `css/main.css`.
Si necesitas añadir un estilo nuevo, agrégalo allí como una clase semántica
y úsala en el HTML. Nunca uses `style="..."` directamente en los elementos.

---

## Tokens de color (editar en `:root` de `main.css`)

| Token             | Valor actual | Uso                          |
|-------------------|--------------|------------------------------|
| `--primary`       | `#2563EB`    | Azul marca, botones, énfasis |
| `--primary-hover` | `#1D4ED8`    | Hover de botones azules      |
| `--bg-main`       | `#121212`    | Fondo de página              |
| `--bg-surface`    | `#1E222A`    | Nav, hero, page-header       |
| `--bg-card`       | `#232831`    | Cards, project cards         |
| `--bg-hover`      | `#2A303B`    | Hover de cards               |
| `--text-main`     | `#F5F5F5`    | Títulos y texto principal    |
| `--text-secondary`| `#A0A8B5`    | Párrafos y descripciones     |
| `--text-faint`    | `#5A6272`    | Metadatos, fechas, hints     |
| `--danger`        | `#DC2626`    | Alertas de error             |

Para cambiar toda la paleta de color: **solo edita esas variables** en `:root`.

---

## Cómo editar contenido sin tocar CSS

### Agregar una noticia (`noticias.html`)
```html
<div class="news-entry" data-cat="investigacion">
  <div class="news-entry-date">
    <span class="news-date-month">Jun</span>
    <span class="news-date-year">2026</span>
  </div>
  <div class="news-entry-body">
    <h3>Título de la noticia</h3>
    <p>Descripción...</p>
    <div class="news-entry-footer">
      <span class="cat-badge cat-investigacion">Investigación</span>
      <span class="news-author">Autor</span>
    </div>
  </div>
</div>
```
**Valores de `data-cat`:** `investigacion` · `convocatoria` · `institucional` · `evento`

### Agregar un miembro (`equipo.html`)
```html
<div class="member-card">
  <div class="avatar-sm">XX</div>
  <h4>Nombre Apellido</h4>
  <span class="member-role">Rol · Programa</span>
  <p>Descripción breve.</p>
  <div class="member-focus">Área de trabajo</div>
</div>
```
Usa `avatar-blue` en vez de `avatar-sm` solo para investigadores con posgrado.

### Agregar un proyecto (`investigacion.html`)
```html
<div class="project-card">
  <div class="project-stripe"></div>
  <div class="project-body">
    <div class="project-meta">
      <span class="badge badge-active">En curso</span>
      <span class="badge badge-waam">WAAM</span>
    </div>
    <h3>Título del proyecto</h3>
    <p>Descripción...</p>
  </div>
</div>
```
**Badges:** `badge-active` · `badge-planned` · `badge-waam` · `badge-end`

---

## Despliegue en GitHub Pages

```bash
# Primera vez
git init
git add .
git commit -m "init: sitio ARCANUM v2"
git remote add origin https://github.com/arcanum-unal/arcanum-unal.github.io.git
git push -u origin main
```
En GitHub: **Settings → Pages → Source: Deploy from branch → main → / (root)**

```bash
# Actualizaciones
git add .
git commit -m "feat: nueva noticia junio 2026"
git push
```

---

## Conectar el formulario con email real (Formspree)

1. Crear cuenta en [formspree.io](https://formspree.io) y obtener un ID (ej: `xpwzabcd`)
2. En `contacto.html`, reemplazar el bloque del `setTimeout` por:

```javascript
fetch('https://formspree.io/f/xpwzabcd', {
  method: 'POST',
  body: new FormData(form),
  headers: { 'Accept': 'application/json' }
}).then(r => {
  if (r.ok) {
    success.style.display = 'block';
    submitBtn.textContent = '¡Enviado!';
    form.reset();
  } else {
    alert('Hubo un error al enviar. Intenta de nuevo.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar mensaje';
  }
});
```

---

## Stack

| Qué          | Tecnología                                      |
|--------------|-------------------------------------------------|
| Tipografía   | Space Mono + Inter vía Google Fonts             |
| Iconos       | Tabler Icons Webfont (MIT)                      |
| Animaciones  | CSS Transitions + Intersection Observer API     |
| Framework    | Ninguno — HTML/CSS/JS puro                      |
| Despliegue   | GitHub Pages (gratis, cero mantenimiento)       |

---

*ARCANUM · Universidad Nacional de Colombia · Facultad de Ingeniería · 2026*

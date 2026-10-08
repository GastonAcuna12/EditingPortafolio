# Gastón Acuña · Portfolio audiovisual

![Vista del portfolio](docs/preview.jpg)

Portfolio de edición de vídeo, motion graphics y narrativa visual. Una web bilingüe con tipografía de gran escala, una interfaz inspirada en herramientas de edición y transiciones por sección.

## Qué muestra

- Presentación animada con referencias al graph editor, keyframes, composición y timeline.
- Galería de trabajos verticales 9:16 con vídeos alojados en Cloudinary.
- Secciones de trabajo seleccionado, trayectoria, proceso y contacto.
- Selector de contenido en español e inglés.
- Microinteracciones, navegación por anclas y adaptación a movimiento reducido.

## Decisiones visuales

El diseño conecta con el oficio de editar: un fondo oscuro deja protagonismo al vídeo y la tipografía; los paneles, curvas y marcadores de movimiento aportan contexto sin reemplazar el contenido. La sección vertical utiliza un carrusel para explorar piezas pensadas para móvil.

## Stack

React · Vite · Motion · Tailwind CSS · Lucide React

## Desarrollo local

Requiere una versión de Node.js compatible con Vite 8 (Node.js 22.12 o posterior en la rama 22).

```bash
npm ci
npm run dev
```

Abrí la dirección que muestre Vite. Para generar y revisar una build:

```bash
npm run build
npm run preview
```

`npm run lint` ejecuta ESLint.

## Editar contenido

- `src/App.jsx`: textos bilingües, datos de proyectos, enlaces de vídeo y componentes.
- `src/App.css` y `src/index.css`: estilos y sistema visual.
- `public/`: iconos y favicon.

El showreel y los vídeos de trabajo horizontal conservan identificadores de YouTube de ejemplo. Reemplazalos por IDs reales para activar esas vistas. Las piezas verticales ya usan URLs de vídeo. La captura del README corresponde a una ejecución local del proyecto.

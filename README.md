# Video portfolio

![Portfolio preview](docs/preview.jpg)

My portfolio for video editing and motion graphics. Built with React, Vite, Motion and Tailwind CSS, with content in English and Spanish.

## What's here

- Animated sections inspired by editing timelines, keyframes and graph editors.
- A carousel of vertical videos hosted on Cloudinary.
- Selected work, background, process and contact sections.
- An English/Spanish switch and reduced-motion support.

The showreel and horizontal video sections still have placeholder YouTube IDs. Replace those in `src/App.jsx` to enable playback. The vertical videos already use real video URLs.

## Run locally

Use a Node.js version supported by Vite 8, such as Node.js 22.12 or later in the 22.x release line.

```bash
npm ci
npm run dev
```

```bash
npm run build
npm run preview
npm run lint
```

## Editing the site

- `src/App.jsx` — copy, project data, video links and components.
- `src/App.css` and `src/index.css` — styles.
- `public/` — icons and favicon.

The preview above is a screenshot of the site running locally.

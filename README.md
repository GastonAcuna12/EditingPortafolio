# Gaston Acuna / Portfolio

Personal video and motion portfolio built with React, Vite and Motion. English is the default; Spanish updates live.

## Local Development

```sh
npm install
npm run dev -- --host 0.0.0.0
```

Vite prints the local and network addresses. A phone on the same network can use the network address. No deployment is needed to preview locally.

```sh
npm run lint
npm test
npm run build
npm run preview -- --host 0.0.0.0
```

## Content And Architecture

- `src/App.jsx`: language state, selected project and page composition.
- `src/data/portfolio.js`: canonical Cloudinary sources, bilingual project data, contact links, clients and lab items.
- `src/data/projectNotes.js`: short bilingual project context and editing approach.
- `src/data/copy.js`: interface, Hero, About and Contact translations.
- `src/components/FeaturedWork.jsx`: six featured posters, with access to all projects.
- `src/components/ProjectDetail.jsx`: native accessible dialog with one active video and previous/next navigation.
- `src/components/media/CloudinaryVideo.jsx`: direct MP4 playback, fallback source, retry and audio cleanup.
- `src/lib/cloudinary.js`: device-specific video URLs and poster extraction.
- `src/index.css`: editorial layout and responsive styling.

Clients and Playground stay hidden while their data arrays are empty. Add only confirmed public clients and real experiments. No showreel, metrics or client names are fabricated. Horizontal project data is retained in `src/data/archive-horizontal.js` but is not rendered.

The gallery loads poster images, not hidden video players. Opening a project mounts one video with metadata preload and no autoplay. Changing/closing projects pauses, mutes and resets the previous video. Leaving the video viewport or hiding the tab also pauses playback. Language changes do not remount the active player.

## Visual Checkpoint

The previous portfolio is saved in commit `b797103`. This rebuild lives on branch `design/work-first-editorial-20260907`; it has not been pushed automatically.

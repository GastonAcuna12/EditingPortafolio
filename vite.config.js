import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { moreWork, projects } from './src/data/portfolio.js'
import { renderProjectPage } from './src/lib/projectPages.js'

function projectPages() {
  let outputDirectory
  return {
    name: 'project-pages',
    apply: 'build',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const index = await readFile(join(outputDirectory, 'index.html'), 'utf8')
      for (const project of [...projects, ...moreWork]) {
        const directory = join(outputDirectory, 'work', project.id)
        await mkdir(directory, { recursive: true })
        await writeFile(join(directory, 'index.html'), renderProjectPage(index, project))
      }
      // The sitemap follows the data, so every share page is listed and nothing stale is.
      const pages = ['https://gaston.mov/', ...[...projects, ...moreWork].map((project) => `https://gaston.mov/work/${project.id}/`)]
      await writeFile(join(outputDirectory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`)
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), projectPages()],
})

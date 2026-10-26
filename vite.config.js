import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { projects } from './src/data/portfolio.js'
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
      for (const project of projects) {
        const directory = join(outputDirectory, 'work', project.id)
        await mkdir(directory, { recursive: true })
        await writeFile(join(directory, 'index.html'), renderProjectPage(index, project))
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), projectPages()],
})

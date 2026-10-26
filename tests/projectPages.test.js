import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { projects } from '../src/data/portfolio.js'
import { getCloudinarySharePoster } from '../src/lib/cloudinary.js'
import { projectPageData, renderProjectPage } from '../src/lib/projectPages.js'
import { getProjectIdFromUrl, projectUrl } from '../src/lib/projectRoutes.js'

test('project pages render unique metadata and preserve app entry', () => {
  const template = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  for (const project of projects) {
    const page = renderProjectPage(template, project)
    const data = projectPageData(project)
    assert.ok(page.includes(`<title>${data.title}</title>`))
    assert.ok(page.includes(`content="${data.description.replaceAll("'", '&#39;')}"`))
    assert.ok(page.includes(`href="${data.url}"`))
    assert.ok(page.includes(`content="${data.image}"`))
    assert.ok(page.includes('src="/src/main.jsx"'))
    assert.match(data.image, /\/so_[^/]+,c_pad,w_1200,h_630,b_black,f_jpg,q_auto\/.+\.jpg$/)
  }
  assert.equal(getCloudinarySharePoster('/video.mp4'), null)
})

test('project routes accept static paths and query links with stable close and step URLs', () => {
  const ids = projects.map((project) => project.id)
  const id = ids[0]
  assert.equal(getProjectIdFromUrl(`https://gaston.mov/work/${id}/`, ids), id)
  assert.equal(getProjectIdFromUrl(`https://gaston.mov/?project=${id}`, ids), id)
  assert.equal(getProjectIdFromUrl('https://gaston.mov/work/unknown/', ids), null)
  assert.equal(projectUrl(`https://gaston.mov/work/${id}/`, null).href, 'https://gaston.mov/')
  assert.equal(projectUrl(`https://gaston.mov/work/${id}/`, ids[1]).href, `https://gaston.mov/?project=${ids[1]}`)
})

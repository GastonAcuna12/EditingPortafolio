import test from "node:test"
import assert from "node:assert/strict"
import { projects, localizeProject, featuredClients, playgroundProjects } from "../src/data/portfolio.js"
import { getOptimizedCloudinaryVideo, getCloudinaryVideoPoster, getCloudinaryPosterSrcSet } from "../src/lib/cloudinary.js"
import { getProjectNotes } from "../src/data/projectNotes.js"
import { copy } from "../src/data/copy.js"

test("all seven existing projects have stable identities and bilingual content", () => {
  assert.equal(projects.length, 7)
  assert.equal(new Set(projects.map((project) => project.id)).size, 7)
  for (const project of projects) {
    assert.match(project.videoSrc, /^https:\/\/res\.cloudinary\.com\/.+\.mp4$/)
    for (const language of ["en", "es"]) {
      const translated = localizeProject(project, language)
      assert.equal(translated.id, project.id)
      assert.equal(translated.videoSrc, project.videoSrc)
      assert.ok(translated.title && translated.description)
      const notes = getProjectNotes(project.id, language)
      assert.ok(notes.context && notes.approach && notes.role && notes.intro)
      assert.equal(translated.posterSecond, project.posterSecond)
    }
  }
})

test("Cloudinary URLs preserve each public ID and use device-specific MP4 variants", () => {
  for (const project of projects) {
    const filename = project.videoSrc.split("/").at(-1)
    const desktop = getOptimizedCloudinaryVideo(project.videoSrc, "desktop")
    const mobile = getOptimizedCloudinaryVideo(project.videoSrc, "mobile")
    assert.ok(desktop.endsWith(filename) && mobile.endsWith(filename))
    assert.ok(desktop.includes("/f_mp4,q_auto,w_720/"))
    assert.ok(mobile.includes("/f_mp4,q_auto:eco,w_540/"))
    assert.ok(!desktop.includes("q_auto/f_auto"))
    assert.match(getCloudinaryVideoPoster(project.videoSrc, "mobile", 1), /\/so_1,f_jpg,q_auto:eco,w_360\/.+\.jpg$/)
  }
})

test("curated posters have responsive widths without duplicate transformations", () => {
  for (const project of projects) {
    assert.ok(Number.isFinite(project.posterSecond) && project.posterSecond >= 0)
    const candidates = getCloudinaryPosterSrcSet(project.videoSrc, project.posterSecond).split(", ")
    assert.equal(candidates.length, 4)
    for (const [index, width] of [360, 540, 720, 1080].entries()) {
      const [url, descriptor] = candidates[index].split(" ")
      assert.equal(descriptor, `${width}w`)
      assert.ok(url.includes(`/so_${project.posterSecond},f_jpg,q_auto:eco,w_${width}/`))
      assert.equal(url.split("/video/upload/").length, 2)
      assert.ok(url.endsWith(project.videoSrc.split("/").at(-1).replace(/\.mp4$/, ".jpg")))
      assert.ok(!url.includes("q_auto/f_auto"))
    }
  }
})

test("non-Cloudinary sources pass through and missing translations fall back", () => {
  assert.equal(getOptimizedCloudinaryVideo("/video.mp4"), "/video.mp4")
  assert.equal(getOptimizedCloudinaryVideo(null), null)
  assert.equal(getCloudinaryVideoPoster("/video.mp4"), null)
  assert.deepEqual(localizeProject(projects[0], "unknown"), localizeProject(projects[0], "en"))
  assert.deepEqual(getProjectNotes(projects[0].id, "unknown"), getProjectNotes(projects[0].id, "en"))
})

test("interface translations have matching structure", () => {
  function keys(value, prefix = "") {
    return Object.entries(value).flatMap(([key, entry]) => {
      const path = `${prefix}.${key}`
      return entry && typeof entry === "object" ? keys(entry, path) : [path]
    }).sort()
  }
  assert.deepEqual(keys(copy.en), keys(copy.es))
})

test("unconfirmed clients and experiments stay unpublished", () => {
  assert.deepEqual(featuredClients, [])
  assert.deepEqual(playgroundProjects, [])
})

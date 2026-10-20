import test from "node:test"
import assert from "node:assert/strict"
import { formatTimecode, frameNumber } from "../src/lib/timecode.js"
import { buildReelUrl, cutAt, reelCuts, reelDuration } from "../src/lib/reel.js"
import { getCloudinaryPreview } from "../src/lib/cloudinary.js"
import { projects } from "../src/data/portfolio.js"

test("timecode reads as HH:MM:SS:FF at 30fps", () => {
  assert.equal(formatTimecode(0), "00:00:00:00")
  assert.equal(formatTimecode(1.5), "00:00:01:15")
  assert.equal(formatTimecode(3725 + 29 / 30), "01:02:05:29")
  assert.equal(formatTimecode(NaN), "00:00:00:00")
  assert.equal(frameNumber(2), "0060")
})

test("the Hero reel splices every real project once, silent, in order", () => {
  const ids = new Set(projects.map((project) => project.id))
  assert.ok(reelCuts.every((cut) => ids.has(cut.id)))
  assert.equal(new Set(reelCuts.map((cut) => cut.id)).size, reelCuts.length)
  const url = buildReelUrl(projects)
  assert.match(url, /^https:\/\/res\.cloudinary\.com\/.+\/video\/upload\/so_1,eo_2\.2,w_540,h_960,c_fill,q_auto:eco,ac_none\//)
  assert.equal(url.match(/fl_splice/g).length, reelCuts.length - 1)
  assert.ok(url.endsWith("/f_mp4,vc_h264:baseline:3.1/v1779289607/JulianPort_y8itgt.mp4"))
  assert.match(buildReelUrl(projects, "mobile"), /w_360,h_640/)
})

test("cutAt maps reel time to the cut on screen", () => {
  assert.equal(cutAt(0).id, reelCuts[0].id)
  assert.equal(cutAt(reelCuts[0].length + 0.01).id, reelCuts[1].id)
  assert.equal(cutAt(reelDuration() + 5).id, reelCuts.at(-1).id)
})

test("hover previews are short silent clips from the curated frame", () => {
  const url = getCloudinaryPreview(projects[2].videoSrc, 5, 5)
  assert.ok(url.includes("/so_5,eo_10,f_mp4,q_auto:eco,w_540,ac_none/"))
  assert.ok(url.endsWith(projects[2].videoSrc.split("/").at(-1)))
})

import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const css = await readFile(new URL('../frontend/fit-previews.css', import.meta.url), 'utf8');
const portrait = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="90" height="160"><rect width="90" height="160" fill="coral"/><rect width="90" height="10" fill="white"/><rect y="150" width="90" height="10" fill="white"/></svg>');
const landscape = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90"><rect width="160" height="90" fill="teal"/></svg>');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
  await page.setContent(`<style>
    .video-card-preview { position:relative; width:320px; height:180px; overflow:hidden; background:black; margin:16px; }
    .video-card-preview-image, .video-card-preview-video, .scrub { width:100%; height:100%; }
    .video-card-preview-video, .scrub { position:absolute; inset:0; }
    .badge img { width:20px; height:20px; }
  </style>
  <div class="video-card-preview"><img id="portrait" class="video-card-preview-image" src="${portrait}" style="object-fit:cover"></div>
  <div class="video-card-preview"><img id="landscape" class="video-card-preview-image" src="${landscape}" style="object-fit:cover"><video id="preview" class="video-card-preview-video" style="object-fit:cover"></video></div>
  <div class="video-card-preview"><img id="scrub" class="scrub" src="${portrait}" style="object-fit:cover"><span class="badge"><img id="badge" src="${portrait}" style="object-fit:cover"></span></div>
  <img id="unrelated" src="${portrait}" style="width:90px;height:50px;object-fit:cover">
  <video id="player" style="object-fit:cover"></video>`);
  const dimensions = () => page.locator('.video-card-preview').evaluateAll(nodes => nodes.map(n => [n.offsetWidth, n.offsetHeight]));
  const baseline = await dimensions();
  const style = await page.addStyleTag({ content: css });
  for (const id of ['portrait', 'landscape', 'preview', 'scrub']) {
    assert.deepEqual(await page.locator(`#${id}`).evaluate(n => {
      const s = getComputedStyle(n);
      return [s.objectFit, s.objectPosition, s.backgroundColor];
    }), ['contain', '50% 50%', 'rgb(0, 0, 0)']);
  }
  for (const id of ['badge', 'unrelated', 'player']) {
    assert.equal(await page.locator(`#${id}`).evaluate(n => getComputedStyle(n).objectFit), 'cover');
  }
  assert.deepEqual(await dimensions(), baseline);
  // New scrub frames and cards pick up the rule without a DOM observer.
  await page.locator('#scrub').evaluate(n => { const next = n.cloneNode(); next.id = 'new-scrub'; n.replaceWith(next); });
  assert.equal(await page.locator('#new-scrub').evaluate(n => getComputedStyle(n).objectFit), 'contain');
  await mkdir(new URL('../artifacts/', import.meta.url), { recursive: true });
  await page.screenshot({ path: new URL('../artifacts/browser-preview.png', import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/, ''), fullPage: true });
  await style.evaluate(n => n.remove());
  for (const id of ['portrait', 'landscape', 'preview', 'new-scrub']) {
    assert.equal(await page.locator(`#${id}`).evaluate(n => getComputedStyle(n).objectFit), 'cover');
  }
  assert.deepEqual(await dimensions(), baseline);
  console.log('Passed: cover/video/scrub fitting, dynamic media, dimensions, unrelated media, disable cleanup.');
} finally {
  await browser.close();
}

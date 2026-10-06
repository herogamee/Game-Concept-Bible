import assert from 'node:assert/strict';
import {createCanvas, loadImage} from '@napi-rs/canvas';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fixedPlan, resolveFixedSelection, FixedTemplateSelection} from './fixed-template-model.mjs';
import {prepareRegisteredFrame, drawPreparedFrame} from './compositor.mjs';

const dir = 'assets/fixed-template-v1', evidence = 'evidence/fixed-template-v1';
const manifest = JSON.parse(await readFile(`${dir}/manifest.json`, 'utf8'));
const {width, height} = manifest, size = width * height;
const hash = data => createHash('sha256').update(data).digest('hex');
const images = new Map(), sourcePixels = new Map();
for (const file of [manifest.head.file, ...manifest.items.map(item => item.file)]) {
  const image = await loadImage(await readFile(`${dir}/${file}`));
  assert.equal(image.width, width, file); assert.equal(image.height, height, file);
  const c = createCanvas(width, height); c.getContext('2d').drawImage(image, 0, 0);
  images.set(`/fixed-assets/${file}`, image);
  sourcePixels.set(file, c.getContext('2d').getImageData(0, 0, width, height).data);
}
// Fixed display rectangles must not cut off visible inherited hair or boots.
// Original PNGs retain a few stray pixels with very low alpha outside the art.
for (const [file, view] of [[manifest.head.file, 'character'], ['clothing-traveler.png', 'character'], ['hair-chestnut.png', 'character'], [manifest.head.file, 'head'], ['hair-chestnut.png', 'head']]) {
  const [left, top, w, h] = manifest.views[view], pixels = sourcePixels.get(file);
  for (let p = 0; p < size; p++) if (pixels[p * 4 + 3] > 16) {
    const x = p % width, y = Math.floor(p / width);
    assert(x >= left && x < left + w && y >= top && y < top + h, `${view} clips ${file} at ${x},${y}`);
  }
}
async function render(selected, options) {
  const plan = fixedPlan(manifest, selected, options);
  for (const layer of plan.layers) {
    assert.deepEqual([layer.x, layer.y], [0, 0]);
    assert.deepEqual(layer.source, {x: 0, y: 0, width, height});
  }
  assert.equal(plan.layers.filter(layer => layer.slot === 'head_template').length, 1);
  assert.equal(plan.layers.find(layer => layer.slot === 'head_template').file, manifest.head.file);
  const c = createCanvas(width, height);
  drawPreparedFrame(c, await prepareRegisteredFrame(plan, url => images.get(url)));
  return c.getContext('2d').getImageData(0, 0, width, height).data;
}
function unionMask(files) {
  const mask = new Uint8Array(size);
  for (const file of files) {
    const data = sourcePixels.get(file);
    for (let p = 0; p < size; p++) if (data[p * 4 + 3]) mask[p] = 1;
  }
  return mask;
}
function assertSameOutside(a, b, mask, label) {
  for (let p = 0; p < size; p++) if (!mask[p]) for (let k = 0; k < 4; k++) {
    if (a[p * 4 + k] !== b[p * 4 + k]) assert.fail(`${label} changed protected pixel ${p % width},${Math.floor(p / width)}`);
  }
}
const eyes = manifest.items.filter(item => item.slot === 'eye_set');
const faces = [null, ...manifest.items.filter(item => item.slot === 'face_set').map(item => item.id)];
const eyeMask = unionMask(eyes.map(item => item.file));
const faceMask = unionMask(manifest.items.filter(item => item.slot === 'face_set').map(item => item.file));
for (let p = 0; p < size; p++) assert(!(eyeMask[p] && faceMask[p]), 'These cheek sets overlap the eye-set zone');
const protectedMask = eyeMask.map((v, p) => v || faceMask[p]);
const nakedHead = sourcePixels.get(manifest.head.file);
const inheritedImage = await loadImage(await readFile('assets/character-master/head-hair/head-face.png'));
const inheritedCanvas = createCanvas(width, height); inheritedCanvas.getContext('2d').drawImage(inheritedImage, 0, 0);
const inherited = inheritedCanvas.getContext('2d').getImageData(0, 0, width, height).data;
assertSameOutside(nakedHead, inherited, eyeMask, 'Published blank head');
for (let p = 0; p < size; p++) assert.equal(nakedHead[p * 4 + 3], inherited[p * 4 + 3], 'Inherited head alpha changed');
for (const [current, old] of [['clothing-traveler.png', 'body-traveler.png'], ['hair-chestnut.png', 'hair-chestnut.png']]) {
  assert.equal(hash(await readFile(`${dir}/${current}`)), hash(await readFile(`assets/character-master/head-hair/${old}`)), `${current} source changed`);
}

const cases = [], visibleHashes = new Set();
const comparisons = new Map();
for (const showHair of [false, true]) {
  const reference = await render({}, {showHair, showEyes: false});
  const footprint = data => hash(Uint8Array.from({length: size}, (_, p) => Number(data[p * 4 + 3] > 0)));
  const expectedFootprint = footprint(reference);
  for (const eye of eyes) for (const face of faces) for (const showEyes of [false, true]) {
    const selected = {eye_set: eye.id, face_set: face};
    const pixels = await render(selected, {showHair, showEyes});
    assertSameOutside(pixels, reference, protectedMask, 'Equipment change');
    assert.equal(footprint(pixels), expectedFootprint, 'Equipment changed the character alpha footprint');
    const key = JSON.stringify([showHair, showEyes, eye.id, face]);
    comparisons.set(key, pixels);
    if (showEyes) visibleHashes.add(hash(pixels));
    cases.push({selected, showHair, showEyes, hash: hash(pixels), registered: true, protectedPixelsIdentical: true, alphaFootprintIdentical: true});
  }
}
for (const showHair of [false, true]) for (const eye of eyes) for (const face of faces) {
  const pixels = comparisons.get(JSON.stringify([showHair, true, eye.id, face]));
  const noFace = comparisons.get(JSON.stringify([showHair, true, eye.id, null]));
  assertSameOutside(pixels, noFace, faceMask, 'Face-set change');
  const otherEye = comparisons.get(JSON.stringify([showHair, true, eyes[0].id, face]));
  assertSameOutside(pixels, otherEye, eyeMask, 'Eye-set change');
}
assert.equal(visibleHashes.size, 18, 'A visible selected combination did not differ');
// Verify real visible ink, not merely changed skin patches or distinct image hashes.
const marks = [];
for (const item of manifest.items.filter(item => item.slot === 'face_set')) {
  const data = sourcePixels.get(item.file); let ink = 0;
  for (let p = 0; p < size; p++) {
    const i = p * 4;
    if (data[i + 3] > 100 && data[i] < 205 && data[i + 1] < 130 && data[i + 2] < 140) ink++;
  }
  assert(ink >= 10, `Face-set marks missing/clipped: ${item.id} (${ink} ink pixels)`);
  marks.push({id: item.id, visibleInkPixels: ink});
}
const selection = new FixedTemplateSelection(manifest);
selection.equip('face_set', 'face-scar'); selection.equip('eye_set', 'eyes-joy');
assert.equal(selection.selected.face_set, 'face-scar');
selection.equip('eye_set', 'eyes-determined'); assert.equal(selection.selected.face_set, 'face-scar');
const prior = JSON.stringify(selection.selected);
assert.throws(() => selection.equip('eye_set', 'face-scar'));
assert.throws(() => selection.equip('full_costume', 'imaginary'));
assert.equal(JSON.stringify(selection.selected), prior);
assert.throws(() => resolveFixedSelection({...manifest, items: manifest.items.map(item => ({...item, template: 'wrong-template'}))}, {}));
selection.reset(); assert(Object.values(selection.selected).every(value => value === null));
assert.equal(resolveFixedSelection(manifest, selection.selected).eye_set.id, 'eyes-amber');
assert.equal(resolveFixedSelection(manifest, selection.selected).face_set, null);

const report = {
  scope: manifest.scope, dimensions: {width, height}, origin: manifest.origin, anchors: manifest.anchors,
  cases: cases.length, visibleCombinations: visibleHashes.size, selections: cases,
  inheritedHeadAlphaIdentical: true, inheritedHeadOutsideEyeZonesIdentical: true,
  inheritedClothingAndHairFilesIdentical: true, separateEyeAndFaceMasks: true, marks,
  defaultsRetainNullSelections: true, incompatibleItemsRejected: true,
  fixedViewsContainVisibleInheritedHeadHairAndClothing: true, displayAlphaThreshold: 16,
  acceptance: 'Technical registration checks passed for one front pose; owner art acceptance, other equipment/actions and production scale remain pending.'
};
await mkdir(evidence, {recursive: true});
await writeFile(`${evidence}/verification.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({...report, selections: undefined}, null, 2));

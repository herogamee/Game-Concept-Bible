/** Fixed front-pose authoring: one immutable head, common category masks. */
import {createCanvas, loadImage, GlobalFonts, Path2D} from '@napi-rs/canvas';
import {readFile, writeFile, copyFile, mkdir} from 'node:fs/promises';
import {clothingLayout} from './fixed-clothing-template.mjs';
import {fixedHairLayout, blueHairOwnsPixel, measureHair, hairEnvelopeFailures} from './fixed-hair-template.mjs';

const dir = 'assets/fixed-template-v1';
const evidence = 'evidence/fixed-template-v1';
const previous = 'assets/character-master/head-hair';
const width = 1254, height = 1254;
// Coordinates belong to the template, never calculated from an item's bounds.
const eyeRegions = [
  {cx: 534, cy: 383, rx: 72, ry: 80},
  {cx: 704, cy: 383, rx: 72, ry: 80},
  {cx: 625, cy: 487, rx: 64, ry: 30}
];
const faceRegions = [
  {cx: 501, cy: 470, rx: 29, ry: 23},
  {cx: 749, cy: 470, rx: 29, ry: 23}
];
const canvas = () => createCanvas(width, height);
async function source(file) {
  const image = await loadImage(await readFile(file));
  if (image.width !== width || image.height !== height) throw new Error(`Unregistered source: ${file} (${image.width}x${image.height})`);
  const result = canvas();
  result.getContext('2d').drawImage(image, 0, 0);
  return result.getContext('2d').getImageData(0, 0, width, height);
}
function weight(x, y, regions) {
  let result = 0;
  for (const r of regions) {
    const d = Math.hypot((x - r.cx) / r.rx, (y - r.cy) / r.ry);
    result = Math.max(result, Math.max(0, Math.min(1, (1 - d) / .12)));
  }
  return result;
}
function writePixels(data) {
  const result = canvas();
  result.getContext('2d').putImageData(data, 0, 0);
  return result;
}
const original = await source(`${previous}/head-face.png`);
const cleaned = await source(`${dir}/head-blank-generated.png`);
const blank = canvas().getContext('2d').createImageData(width, height);
for (let p = 0; p < width * height; p++) {
  const i = p * 4, w = weight(p % width, Math.floor(p / width), eyeRegions);
  for (let k = 0; k < 3; k++) blank.data[i + k] = Math.round(original.data[i + k] * (1 - w) + cleaned.data[i + k] * w);
  blank.data[i + 3] = original.data[i + 3];
}
await mkdir(dir, {recursive: true});
await mkdir(evidence, {recursive: true});
await writeFile(`${dir}/head-template.png`, writePixels(blank).toBuffer('image/png'));
await copyFile(`${previous}/body-traveler.png`, `${dir}/clothing-traveler.png`);
await copyFile(`${previous}/hair-chestnut.png`, `${dir}/hair-chestnut.png`);
if (process.argv.includes('--base-only')) {
  console.log('Published registered blank-head candidate; inherited contour/alpha and dressed body remain fixed.');
  process.exit(0);
}

// Whole clothing bundles retain the original exposed body on one shared mask.
// Generated head pixels are discarded; this is not a per-item fitting step.
const inheritedBody = await source(`${previous}/body-traveler.png`);
const protection = canvas(), protectionCtx = protection.getContext('2d');
protectionCtx.fillStyle = '#fff';
for (const part of clothingLayout.protectedPaths) protectionCtx.fill(new Path2D(part.path));
const protectedPixels = protectionCtx.getImageData(0, 0, width, height).data;
const clothes = [
  {id: 'clothing-knight', label: 'ชุดอัศวินฝึกหัด'},
  {id: 'clothing-mage', label: 'ชุดนักเวทฝึกหัด'}
];
const newHair = [{id:'hair-teal',label:'ผมปัดข้างสีฟ้า'}, {id:'hair-silver-curls',label:'ผมหยักศกสีเงิน'}];
const preparedHair = new Map();
for (const item of newHair) {
  if (item.id === 'hair-teal') {
    const input = await source(`${dir}/hair-teal-volume-seam-generated.png`);
    const output = canvas().getContext('2d').createImageData(width, height);
    for (let p = 0; p < width * height; p++) {
      const i = p * 4;
      if (blueHairOwnsPixel(p % width, Math.floor(p / width), input.data[i], input.data[i + 1], input.data[i + 2])) {
        output.data.set(input.data.subarray(i, i + 4), i);
      }
    }
    preparedHair.set(item.id, output);
  } else {
    preparedHair.set(item.id, await source(`${dir}/${item.id}-generated.png`));
  }
}
const hairMeasurements = {};
for (const id of ['hair-chestnut', ...newHair.map(i => i.id)]) {
  const input = preparedHair.get(id) || await source(`${dir}/${id}.png`);
  hairMeasurements[id] = measureHair(input.data, width, height);
  const failures = hairEnvelopeFailures(hairMeasurements[id]);
  if (failures.length) throw new Error(`${id} fails front short-hair trial: ${failures.join('; ')}`);
}
// Publish only after every hair candidate passes the authored envelope.
for (const item of newHair) {
  if (item.id === 'hair-teal') await writeFile(`${dir}/${item.id}.png`, writePixels(preparedHair.get(item.id)).toBuffer('image/png'));
  else await copyFile(`${dir}/${item.id}-generated.png`, `${dir}/${item.id}.png`);
}
await source(`${dir}/hat-adventurer-corrected-generated.png`);
await copyFile(`${dir}/hat-adventurer-corrected-generated.png`,`${dir}/hat-adventurer.png`);
// One authored hat policy for all hairstyles: keep fringe below the same cut.
// Selected hairstyle is preserved; removing the cap restores its full pixels.
for(const id of ['hair-chestnut',...newHair.map(i=>i.id)]) {
  const input=await source(`${dir}/${id}.png`);
  input.data.fill(0,0,width*310*4);
  await writeFile(`${dir}/${id}-under-hat.png`,writePixels(input).toBuffer('image/png'));
}
for (const item of clothes) {
  const input = await source(`${dir}/${item.id}-generated.png`);
  const pixels = canvas().getContext('2d').createImageData(width, height);
  for (let p = width * clothingLayout.splitY; p < width * height; p++) {
    const i = p * 4;
    const origin = protectedPixels[i + 3] ? inheritedBody : input;
    for (let k = 0; k < 4; k++) pixels.data[i + k] = origin.data[i + k];
  }
  await writeFile(`${dir}/${item.id}.png`, writePixels(pixels).toBuffer('image/png'));
}
await writeFile(`${dir}/body-protection-guide.png`, (() => {
  const c = canvas(), ctx = c.getContext('2d');
  ctx.drawImage(writePixels(inheritedBody), 0, 0);
  ctx.fillStyle = '#14ac9980'; ctx.strokeStyle = '#157468'; ctx.lineWidth = 2;
  for (const part of clothingLayout.protectedPaths) {
    ctx.fill(new Path2D(part.path)); ctx.stroke(new Path2D(part.path));
  }
  return c.toBuffer('image/png');
})());

function categoryLayer(input, regions) {
  const data = canvas().getContext('2d').createImageData(width, height);
  for (let p = 0; p < width * height; p++) {
    const i = p * 4, x = p % width, y = Math.floor(p / width);
    // These initial cheek sets never cover the eye/brow/mouth authoring zones.
    const w = regions === faceRegions && weight(x, y, eyeRegions) > 0 ? 0 : weight(x, y, regions);
    for (let k = 0; k < 3; k++) data.data[i + k] = input.data[i + k];
    data.data[i + 3] = Math.round(blank.data[i + 3] * w);
  }
  return writePixels(data);
}
const sources = [
  ['eyes-amber', 'eye_set', original, eyeRegions, 'ตาอำพัน · ยิ้ม'],
  ['eyes-determined', 'eye_set', await source(`${dir}/eyes-determined-generated.png`), eyeRegions, 'ตาเขียว · มุ่งมั่น'],
  ['eyes-joy', 'eye_set', await source(`${dir}/eyes-joy-generated.png`), eyeRegions, 'ตาปิด · ยิ้มกว้าง'],
  ['face-scar', 'face_set', await source(`${dir}/face-scar-registered-generated.png`), faceRegions, 'ชุดใบหน้า · รอยแผล'],
  ['face-blush', 'face_set', await source(`${dir}/face-blush-registered-generated.png`), faceRegions, 'ชุดใบหน้า · แก้มแดงและกระ']
];
const layers = new Map([['head-template', writePixels(blank)]]);
for (const [id, , pixels, regions] of sources) {
  const layer = categoryLayer(pixels, regions);
  layers.set(id, layer);
  await writeFile(`${dir}/${id}.png`, layer.toBuffer('image/png'));
}
const manifest = {
  version: 1, template: 'fixed-front-v1', pose: 'stand-front', width, height,
  origin: {x: 0, y: 0},
  anchors: {head: [625, 357], eyeLeft: [534, 407], eyeRight: [704, 407], mouth: [625, 487], neck: [625, 543], ground: [625, 1214]},
  views: {character: [320, 15, 620, 1225], head: [320, 15, 620, 540], catalogHead: [390, 170, 450, 380]},
  head: {file: 'head-template.png'},
  defaults: {eye_set: 'eyes-amber', face_set: null, hair: 'hair-chestnut', clothing: 'clothing-traveler', hat:null},
  items: [
    ...sources.map(([id, slot, , , label]) => ({id, slot, file: `${id}.png`, label})),
    {id: 'hair-chestnut', slot: 'hair', file: 'hair-chestnut.png', label: 'ผมน้ำตาลเดิม'},
    ...newHair.map(item=>({...item,slot:'hair',file:`${item.id}.png`})),
    {id:'hat-adventurer',slot:'hat',file:'hat-adventurer.png',label:'หมวกนักผจญภัย'},
    {id: 'clothing-traveler', slot: 'clothing', file: 'clothing-traveler.png', label: 'ชุดนักเดินทางเดิม'},
    ...clothes.map(item => ({...item, slot: 'clothing', file: `${item.id}.png`}))
  ].map(item => ({...item, ...(item.slot==='hair'?{hatFile:`${item.id}-under-hat.png`}:{}), template: 'fixed-front-v1', pose: 'stand-front'})),
  masks: {eye_set: eyeRegions, face_set: faceRegions, featherFraction: .12},
  clothingLayout,
  hairLayout: {...fixedHairLayout, measurements: hairMeasurements},
  hatPolicy:{id:'upper-hair-covered-v1',cutY:310,description:'All hairstyles use the same upper-hair mask when the cap is worn. Fringe remains; selected hair is retained.'},
  layerOrder: ['clothing', 'head_template', 'eye_set', 'face_set', 'hair', 'hat'],
  scope: 'Fixed front standing template with three eye sets, two cheek-detail face sets, three clothing bundles, three hairstyles and one cap. Front walking uses a separate authored pose atlas and the same IDs. Owner visual acceptance, other directions/actions, full costumes and production scale remain pending.'
};
await writeFile(`${dir}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');

GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf', 'FixedReview');
const review = createCanvas(1350, 1330), ctx = review.getContext('2d');
ctx.fillStyle = '#efe9d9'; ctx.fillRect(0, 0, review.width, review.height);
ctx.font = '18px FixedReview'; ctx.fillStyle = '#303b29'; ctx.textAlign = 'center';
const eyeIDs = sources.filter(s => s[1] === 'eye_set').map(s => s[0]);
const faceIDs = [null, 'face-scar', 'face-blush'];
for (let row = 0; row < eyeIDs.length; row++) for (let col = 0; col < faceIDs.length; col++) {
  const composed = canvas(), c = composed.getContext('2d');
  c.drawImage(layers.get('head-template'), 0, 0);
  c.drawImage(layers.get(eyeIDs[row]), 0, 0);
  if (faceIDs[col]) c.drawImage(layers.get(faceIDs[col]), 0, 0);
  const x = col * 450, y = row * 440;
  ctx.fillText(`${manifest.items.find(i => i.id === eyeIDs[row]).label} / ${faceIDs[col] ? manifest.items.find(i => i.id === faceIDs[col]).label : 'ใบหน้าเดิม'}`, x + 225, y + 29);
  ctx.drawImage(composed, ...manifest.views.catalogHead, x, y + 47, 450, 380);
}
await writeFile(`${evidence}/nine-head-combinations.png`, review.toBuffer('image/png'));
const clothingReview = createCanvas(930, 710), clothingCtx = clothingReview.getContext('2d');
clothingCtx.fillStyle = '#efe9d9'; clothingCtx.fillRect(0, 0, 930, 710);
clothingCtx.font = '18px FixedReview'; clothingCtx.fillStyle = '#303b29'; clothingCtx.textAlign = 'center';
const commonHair = writePixels(await source(`${dir}/hair-chestnut.png`));
for (const [index, item] of manifest.items.filter(item => item.slot === 'clothing').entries()) {
  const assembled = canvas(), c = assembled.getContext('2d');
  c.drawImage(writePixels(await source(`${dir}/${item.file}`)), 0, 0);
  c.drawImage(layers.get('head-template'), 0, 0);
  c.drawImage(layers.get('eyes-determined'), 0, 0);
  c.drawImage(layers.get('face-blush'), 0, 0);
  c.drawImage(commonHair, 0, 0);
  clothingCtx.fillText(item.label, index * 310 + 155, 30);
  clothingCtx.drawImage(assembled, ...manifest.views.character, index * 310, 50, 310, 612.5);
}
await writeFile(`${evidence}/three-clothing-combinations.png`, clothingReview.toBuffer('image/png'));
console.log('Exported fixed head, independent eye/face sets, original outfit and two new clothing bundles. Visual acceptance pending.');

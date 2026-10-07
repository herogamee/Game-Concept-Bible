import assert from 'node:assert/strict';
import {createCanvas, loadImage, GlobalFonts} from '@napi-rs/canvas';
import {readFile, writeFile} from 'node:fs/promises';
import {fixedHairLayout, measureHair, hairEnvelopeFailures} from '../fixed-hair-template.mjs';

const dir='assets/fixed-template-v1', evidence='evidence/fixed-template-v1';
const m=JSON.parse(await readFile(`${dir}/manifest.json`)), images=new Map(), measured={};
async function pixels(file) {
  const image=await loadImage(`${dir}/${file}`);
  assert.deepEqual([image.width,image.height],[1254,1254],file);
  images.set(file,image);
  const c=createCanvas(1254,1254);c.getContext('2d').drawImage(image,0,0);
  return c.getContext('2d').getImageData(0,0,1254,1254).data;
}
assert.deepEqual(m.origin,{x:0,y:0});
assert.deepEqual(m.hairLayout.envelope,fixedHairLayout.envelope);
for(const hair of m.items.filter(i=>i.slot==='hair')) {
  const data=await pixels(hair.file),size=measureHair(data,1254,1254);
  assert.deepEqual(size,m.hairLayout.measurements[hair.id]);
  assert.deepEqual(hairEnvelopeFailures(size),[],hair.id);
  // Swapping a cap must not be used to conceal obstructed eyes/face/neck.
  for(const point of [m.anchors.eyeLeft,m.anchors.eyeRight,m.anchors.mouth,m.anchors.neck,[625,460]]) {
    const [cx,cy]=point;
    for(let y=cy-4;y<=cy+4;y++)for(let x=cx-4;x<=cx+4;x++)assert.equal(data[(y*1254+x)*4+3],0,`${hair.id} covers a face/neck fixture at ${x},${y}`);
  }
  measured[hair.id]=size;
}
const before=measureHair(await pixels('hair-teal-generated.png'),1254,1254);
assert.equal(before.width,460);assert.equal(before.height,314);
assert.equal(hairEnvelopeFailures(before).length,2,'Old undersized blue source must be rejected');
assert(measured['hair-teal'].width>before.width);
assert(measured['hair-teal'].aboveScalp>=before.aboveScalp+55,'Crown change must be substantial');

GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','HairReview');
const review=createCanvas(1000,455),ctx=review.getContext('2d');ctx.fillStyle='#f4f0e5';ctx.fillRect(0,0,1000,455);
ctx.font='22px HairReview';ctx.fillStyle='#283b2f';ctx.fillText('แก้ความฟูของผม · โครงหัวและสเกลเดิม',22,35);
const head=await loadImage(`${dir}/${m.head.file}`),eye=await loadImage(`${dir}/eyes-determined.png`);
for(const [index,[file,label,size]] of [['hair-teal-generated.png','สีฟ้าเดิม',before],['hair-teal.png','สีฟ้าที่แก้แล้ว',measured['hair-teal']],['hair-chestnut.png','น้ำตาลเดิม · เทียบขนาด',measured['hair-chestnut']]].entries()) {
  const c=createCanvas(1254,1254),cc=c.getContext('2d');cc.drawImage(head,0,0);cc.drawImage(eye,0,0);cc.drawImage(images.get(file),0,0);
  const x=20+index*330,y=85;ctx.fillStyle='#e3eadc';ctx.fillRect(x,y,310,270);ctx.drawImage(c,...m.views.head,x,y,310,270);
  ctx.strokeStyle='#087e98';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x,y+(179-15)/2);ctx.lineTo(x+310,y+(179-15)/2);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#283b2f';ctx.font='17px HairReview';ctx.fillText(label,x,69);ctx.fillText(`${size.width} × ${size.height} px`,x,386);ctx.font='14px HairReview';ctx.fillText(`เหนือกระหม่อม ${size.aboveScalp} px`,x,410);
}
ctx.font='13px HairReview';ctx.fillStyle='#52624f';ctx.fillText('วัด alpha ≥ 128 · PNG1254×1254 จุดวาง(0,0) · เส้นฟ้าคือกระหม่อมเดิม · การยอมรับภาพยังรอเจ้าของตรวจ',22,441);
await writeFile(`${evidence}/hair-volume-before-after.png`,review.toBuffer('image/png'));
const result={layout:fixedHairLayout,measurements:measured,previousBlue:before,previousBlueRejected:hairEnvelopeFailures(before),allCanvasSizesEqual:true,faceAndNeckFixturesUncovered:true,headOriginUnchanged:true,acceptance:'Front short-hair technical size check only. Owner art acceptance and other view/category standards pending.'};
await writeFile(`${evidence}/hair-standard-verification.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));

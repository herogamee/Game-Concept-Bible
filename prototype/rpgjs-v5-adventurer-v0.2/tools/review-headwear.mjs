import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile,writeFile} from 'node:fs/promises';
import {fixedPlan} from './registered-character/fixed-template-model.mjs';
import {drawPreparedFrame} from './registered-character/compositor.mjs';
const root='assets/fixed-template-v1',m=JSON.parse(await readFile(`${root}/manifest.json`)),images=new Map();
for(const file of new Set([m.head.file,...m.items.flatMap(i=>[i.file,i.hatFile].filter(Boolean))]))images.set(`/fixed-assets/${file}`,await loadImage(`${root}/${file}`));
const review=createCanvas(930,540),ctx=review.getContext('2d');ctx.fillStyle='#e8eddd';ctx.fillRect(0,0,930,540);
for(const [index,hair] of m.items.filter(i=>i.slot==='hair').entries())for(const [row,hat] of [null,'hat-adventurer'].entries()){
 const canvas=createCanvas(1254,1254),plan=fixedPlan(m,{hair:hair.id,hat});drawPreparedFrame(canvas,{plan,images:plan.layers.map(l=>images.get(l.url))});
 ctx.drawImage(canvas,...m.views.head,index*310,row*270,310,270);
}
await writeFile('evidence/fixed-template-v1/six-headwear-combinations.png',review.toBuffer('image/png'));

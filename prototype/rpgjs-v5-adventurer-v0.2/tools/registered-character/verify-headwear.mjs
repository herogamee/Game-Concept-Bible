import assert from 'node:assert/strict';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fixedPlan,FixedTemplateSelection} from './fixed-template-model.mjs';
import {drawPreparedFrame,prepareRegisteredFrame} from './compositor.mjs';
const dir='assets/fixed-template-v1',m=JSON.parse(await readFile(`${dir}/manifest.json`)),images=new Map(),pixels=new Map();
const hash=data=>createHash('sha256').update(data).digest('hex');
for(const file of new Set([m.head.file,...m.items.flatMap(i=>[i.file,i.hatFile].filter(Boolean))])){
 const image=await loadImage(`${dir}/${file}`);assert.deepEqual([image.width,image.height],[m.width,m.height]);images.set(`/fixed-assets/${file}`,image);
 const c=createCanvas(m.width,m.height);c.getContext('2d').drawImage(image,0,0);pixels.set(file,c.getContext('2d').getImageData(0,0,m.width,m.height).data);
}
const hairs=m.items.filter(i=>i.slot==='hair'),eyes=m.items.filter(i=>i.slot==='eye_set'),faces=[null,...m.items.filter(i=>i.slot==='face_set').map(i=>i.id)],clothes=m.items.filter(i=>i.slot==='clothing'),hats=[null,...m.items.filter(i=>i.slot==='hat').map(i=>i.id)];
for(const hair of hairs){
 const full=pixels.get(hair.file),under=pixels.get(hair.hatFile),split=m.width*m.hatPolicy.cutY*4;
 assert.equal(hash(full.subarray(split)),hash(under.subarray(split)),`${hair.id} fringe altered`);
 assert(under.subarray(0,split).every(v=>v===0),'Upper hair not removed by shared mask');
 const [left,top,w,h]=m.views.head;
 for(let p=0;p<m.width*m.height;p++)if(full[p*4+3]>16){const x=p%m.width,y=Math.floor(p/m.width);assert(x>=left&&x<left+w&&y>=top&&y<top+h,`Hair clips fixed head view: ${hair.id}`);}
}
const c=createCanvas(m.width,m.height),hashes=new Set(),headHashes=new Map();let cases=0;
for(const hair of hairs)for(const hat of hats)for(const eye of eyes)for(const face of faces)for(const clothing of clothes){
 const selected={hair:hair.id,hat,eye_set:eye.id,face_set:face,clothing:clothing.id},plan=fixedPlan(m,selected);
 drawPreparedFrame(c,await prepareRegisteredFrame(plan,url=>images.get(url)));
 const p=c.getContext('2d').getImageData(0,0,m.width,m.height).data;hashes.add(hash(p));
 const key=JSON.stringify([hair.id,hat,eye.id,face]),headHash=hash(p.subarray(0,m.width*543*4));
 if(!headHashes.has(key))headHashes.set(key,headHash);assert.equal(headHashes.get(key),headHash,'Clothing changed headwear');
 const layer=plan.layers.find(l=>l.slot==='hair');assert.equal(layer.file,hat?hair.hatFile:hair.file);
 for(const layer of plan.layers){assert.equal(layer.x,0);assert.equal(layer.y,0);assert.deepEqual(layer.source,{x:0,y:0,width:m.width,height:m.height});}cases++;
}
assert.equal(hashes.size,cases,'Visible wardrobe combination was lost');
const s=new FixedTemplateSelection(m);s.equip('hair','hair-silver-curls');const before=s.plan();s.equip('hat','hat-adventurer');s.showHair=false;
assert(s.plan().layers.some(l=>l.slot==='hat'));assert(!s.plan().layers.some(l=>l.slot==='hair'));
s.showHair=true;s.equip('hat',null);assert.equal(s.selected.hair,'hair-silver-curls');assert.deepEqual(s.plan(),before);
const prior=JSON.stringify(s.selected);assert.throws(()=>s.equip('hat','hair-teal'));assert.equal(JSON.stringify(s.selected),prior);s.reset();assert(Object.values(s.selected).every(v=>v===null));
assert.throws(()=>fixedPlan({...m,items:m.items.map(i=>i.slot==='hair'?{...i,hatFile:null}:i)},{hat:'hat-adventurer'}),'Missing compatible representation must fail visibly');
const result={cases,distinctVisibleCombinations:hashes.size,hairstyles:hairs.length,hats:hats.length-1,sharedCutY:m.hatPolicy.cutY,hatRemovalRestoresSelectedHair:true,hiddenHairKeepsHat:true,allLayersRegisteredAtOrigin:true,clothingPreservesRenderedHead:true,acceptance:'Technical front-pose checks only; owner visual and gait review pending.'};
await writeFile('evidence/fixed-template-v1/headwear-verification.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));

import assert from 'node:assert/strict';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {prepareRegisteredFrame,drawPreparedFrame} from './compositor.mjs';
const dir='assets/character-master/head-hair',manifest=JSON.parse(await readFile(`${dir}/layers.json`,'utf8'));
const images=new Map();for(const layer of manifest.layers){const image=await loadImage(await readFile(`${dir}/${layer.file}`));assert.equal(image.width,manifest.width);assert.equal(image.height,manifest.height);images.set(layer.file,image);}
const layers=manifest.layers.map(layer=>({...layer,url:layer.file,x:0,y:0,source:{x:0,y:0,width:manifest.width,height:manifest.height}}));
const plan=hair=>({width:manifest.width,height:manifest.height,layers:layers.filter(layer=>hair||layer.slot!=='hair')});
async function render(hair){const c=createCanvas(manifest.width,manifest.height);drawPreparedFrame(c,await prepareRegisteredFrame(plan(hair),url=>images.get(url)));return c;}
const on=await render(true),off=await render(false),hairCanvas=createCanvas(manifest.width,manifest.height);hairCanvas.getContext('2d').drawImage(images.get('hair-chestnut.png'),0,0);
function pixels(canvas,r){return canvas.getContext('2d').getImageData(r.x,r.y,r.width,r.height).data;}
const hash=data=>createHash('sha256').update(data).digest('hex');
const zones={leftIris:{x:518,y:400,width:48,height:45},rightIris:{x:686,y:400,width:48,height:45},leftEarCore:{x:418,y:429,width:20,height:38},rightEarCore:{x:801,y:429,width:20,height:38},mouth:{x:573,y:475,width:105,height:42},neckAndBody:{x:0,y:543,width:1254,height:711}};
const results=[];
for(const[name,rect]of Object.entries(zones)){
  const a=pixels(on,rect),b=pixels(off,rect),hair=pixels(hairCanvas,rect);let nonzeroHair=0;for(let i=3;i<hair.length;i+=4)if(hair[i])nonzeroHair++;
  assert.equal(nonzeroHair,0,`Hair leaked into ${name}`);assert.equal(hash(a),hash(b),`Toggling hair changed ${name}`);
  results.push({zone:name,rect,hash:hash(a),identical:true,nonzeroHairPixels:nonzeroHair});
}
const all={x:0,y:0,width:manifest.width,height:manifest.height};
assert.notEqual(hash(pixels(on,all)),hash(pixels(off,all)),'Hair visibility did not change result');
assert.equal(hash(pixels(await render(true),all)),hash(pixels(on,all)),'Repeated equip changed frame');
// Report comparison to the original, without disguising the underpainting as a
// pixel-identical extraction. The head has newly authored covered regions.
const original=createCanvas(manifest.width,manifest.height);original.getContext('2d').drawImage(await loadImage(await readFile('assets/character-master/front-v1.png')),0,0);
assert.equal(hash(pixels(on,zones.neckAndBody)),hash(pixels(original,zones.neckAndBody)),'Original body source changed');
const a=pixels(on,all),b=pixels(original,all);let sum=0,max=0,changed=0;
for(let i=0;i<a.length;i+=4){let delta=0;for(let c=0;c<3;c++){const d=Math.abs(a[i+c]*a[i+3]/255-b[i+c]*b[i+3]/255);sum+=d;max=Math.max(max,d);delta=Math.max(delta,d);}if(delta>3)changed++;}
const report={scope:'one original front-pose head/hair pair; visual owner review pending',canvas:{width:manifest.width,height:manifest.height},layers:layers.map(({slot,x,y,source})=>({slot,x,y,source})),immutableZones:results,
  roundtripToOriginal:{meanPremultipliedChannelDifference:sum/(manifest.width*manifest.height*3),maxPremultipliedChannelDifference:max,pixelsOverDifference3:changed,note:'Not pixel-identical: generated bald underpainting and authored segmentation alter some head/edge pixels; body retained from original.'},repeatEquipStable:true};
await mkdir('evidence/character-master/head-hair',{recursive:true});await writeFile('evidence/character-master/head-hair/verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));

import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
import {readLocalCatalog} from './local-source.mjs';
import {portraitPlan,slots,defaults} from './portrait-adapter.mjs';
import {prepareRegisteredFrame,drawPreparedFrame,validatePlan} from './compositor.mjs';
const labRoot=resolve(process.argv[2]??'');if(!process.argv[2])throw new Error('Pass external DDTank Lab directory');
if(process.platform==='win32')GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','ProofFont');
const {catalog,files,references}=await readLocalCatalog(labRoot),cache=new Map();
async function image(url){if(!cache.has(url)){const file=files.get(url.slice(8));assert(file,'Unknown asset');cache.set(url,loadImage(await readFile(file)));}return cache.get(url);}
const pixels=canvas=>canvas.getContext('2d').getImageData(0,0,250,342).data;
const hash=data=>createHash('sha256').update(data).digest('hex');
async function render(plan){const canvas=createCanvas(250,342);drawPreparedFrame(canvas,await prepareRegisteredFrame(plan,image));return canvas;}
function visualDifference(a,b){let alpha=0,premultiplied=0;for(let i=0;i<a.length;i+=4){alpha=Math.max(alpha,Math.abs(a[i+3]-b[i+3]));for(let c=0;c<3;c++)premultiplied=Math.max(premultiplied,Math.abs(a[i+c]*a[i+3]/255-b[i+c]*b[i+3]/255));}return {maxAlphaDelta:alpha,maxPremultipliedChannelDelta:premultiplied};}
const report={scope:'Local 4.0 registered portrait compositor; no original-art wardrobe acceptance',items:catalog.items.length,sexes:[],checks:[]};
for(const sex of ['m','f']){
  const plan=portraitPlan(catalog,{sex}),baseline=await render(plan),data=pixels(baseline),reference=createCanvas(250,342);
  reference.getContext('2d').drawImage(await loadImage(await readFile(references[sex])),0,0);
  const delta=visualDifference(data,pixels(reference));assert(delta.maxAlphaDelta<=3&&delta.maxPremultipliedChannelDelta<=3,`Godot reference mismatch (${sex}): ${JSON.stringify(delta)}`);
  for(const slot of slots){const selected={...defaults[sex]};delete selected[slot];const before=JSON.stringify(selected);assert.equal(hash(pixels(await render(portraitPlan(catalog,{sex,selected})))),hash(data),`Missing ${slot} fallback`);assert.equal(JSON.stringify(selected),before,'Selection mutated');}
  const choices=Object.fromEntries(['face','hair','cloth'].map(slot=>[slot,catalog.items.filter(item=>item.slot===slot&&item.sex===sex).slice(0,2).map(item=>item.id)]));
  const sheet=createCanvas(1000,740),ctx=sheet.getContext('2d');ctx.fillStyle='#e8e5d7';ctx.fillRect(0,0,1000,740);ctx.fillStyle='#283024';ctx.font='14px ProofFont, sans-serif';
  const hashes=new Set(),combinations=[];let index=0;
  for(const face of choices.face)for(const hair of choices.hair)for(const cloth of choices.cloth){
    const selected={face,hair,cloth},p=portraitPlan(catalog,{sex,selected});
    assert(p.layers.every(layer=>layer.x===0&&layer.y===0),'Changed frame origins');
    const rendered=await render(p);hashes.add(hash(pixels(rendered)));combinations.push(selected);
    const x=index%4*250,y=Math.floor(index/4)*370;ctx.drawImage(rendered,x,y+25);ctx.fillText(`face ${face} / hair ${hair} / cloth ${cloth}`,x+8,y+18);index++;
  }
  assert.equal(hashes.size,8,'Different selections did not produce eight distinct characters');
  // Do not place local commercial-art proof sheets inside the original-game repository.
  const proofPath=resolve(labRoot,`tests/web-registered-proof-${sex}.png`);await writeFile(proofPath,sheet.toBuffer('image/png'));
  const hat=catalog.items.find(item=>item.slot==='head'&&item.sex===sex&&item.hairType!==1);
  assert(hat);assert.equal(portraitPlan(catalog,{sex,selected:{head:hat.id}}).hairVariant,'A');
  assert.equal(portraitPlan(catalog,{sex,selected:{head:hat.id},hidden:['head']}).hairVariant,'B');
  const withHat=await render(portraitPlan(catalog,{sex,selected:{head:hat.id}}));
  assert.notEqual(hash(pixels(withHat)),hash(data),'Hat did not change character');
  assert.equal(hash(pixels(await render(portraitPlan(catalog,{sex,selected:{head:hat.id},hidden:['head']})))),hash(data),'Hiding hat failed to restore B hair');
  const expressionHashes=[];for(let expression=0;expression<4;expression++)expressionHashes.push(hash(pixels(await render(portraitPlan(catalog,{sex,expression})))));
  assert(new Set(expressionHashes).size>1,'Expressions did not change the face');
  report.sexes.push({sex,reference:delta,missingSlotFallbacks:7,combinations,distinctCharacters:hashes.size,hatVariantId:hat.id,expressionCount:4,proofPath});
}
assert.throws(()=>portraitPlan(catalog,{sex:'m',selected:{cloth:5201}}));
assert.throws(()=>portraitPlan(catalog,{sex:'m',selected:{hair:5101}}));
assert.throws(()=>portraitPlan(catalog,{selected:{hair:99999999}}));
const valid=portraitPlan(catalog),shifted=structuredClone(valid);shifted.layers[0].x=1;assert.throws(()=>validatePlan(shifted));
const outside=structuredClone(valid);outside.layers[0].source.x=100000;await assert.rejects(prepareRegisteredFrame(outside,image));
const retained=await render(valid),before=hash(pixels(retained));
await assert.rejects(prepareRegisteredFrame(valid,async()=>{throw new Error('Missing source')}));assert.equal(hash(pixels(retained)),before);
report.checks=['male/female Godot reference pixels within alpha/compositing rounding tolerance','seven independent empty-slot fallbacks per sex without selection mutation','eight distinct face/hair/cloth combinations per sex at identical origins','hat A/B variant and hidden-hat recovery','four expression frame indices per sex','opposite sex, wrong slot and unknown item rejection','shifted origin and out-of-bitmap frame rejection','failed load leaves previously drawn canvas intact'];
await mkdir('evidence/registered-character',{recursive:true});await writeFile('evidence/registered-character/verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));

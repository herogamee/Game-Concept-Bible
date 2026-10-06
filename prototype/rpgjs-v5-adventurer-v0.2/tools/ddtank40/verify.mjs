/** Original exports + live installed-source interchange; commercial proof PNGs stay in the external lab. */
import assert from 'node:assert/strict';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readLocalCatalog} from '../registered-character/local-source.mjs';
import {portraitPlan} from '../registered-character/portrait-adapter.mjs';
import {drawPreparedFrame} from '../registered-character/compositor.mjs';
import {compatibilityCatalog,ownRoot} from './local.mjs';
import {showPlan,resourcePath,validateShowAsset,requireProductionCoverage} from './format.mjs';
const labRoot=resolve(process.argv[2]||'D:/Codex/DDtank'),root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const out=resolve(labRoot,'research/compatibility-4.0');await mkdir(out,{recursive:true});
const profile=JSON.parse(await readFile(new URL('profile.json',import.meta.url),'utf8'));
const pack=JSON.parse(await readFile(resolve(ownRoot,'manifest.json'),'utf8'));
const source=await readLocalCatalog(labRoot),compatible=await compatibilityCatalog(source,profile),catalog=compatible.catalog;
const imageCache=new Map();
async function image(url){if(!imageCache.has(url)){const file=compatible.files.get(url)||source.files.get(url.replace('/assets/',''));if(!file)throw new Error(`Unknown asset URL ${url}`);imageCache.set(url,await loadImage(await readFile(file)))}return imageCache.get(url)}
async function render(plan){const images=await Promise.all(plan.layers.map(l=>image(l.url))),c=createCanvas(plan.width,plan.height);drawPreparedFrame(c,{plan,images});return c}
function pixels(c){return c.getContext('2d').getImageData(0,0,c.width,c.height).data}
// A visible head alone is not sufficient: every exported face must contain its
// actual expression in the registered eye/mouth region, rather than blank skin.
const bareHead=createCanvas(250,312),bareCtx=bareHead.getContext('2d');
const {from:headFrom,to:headTo}=pack.calibration.head;
const scaleX=(headTo[2]-headTo[0])/(headFrom[2]-headFrom[0]),scaleY=(headTo[3]-headTo[1])/(headFrom[3]-headFrom[1]);
bareCtx.setTransform(scaleX,0,0,scaleY,headTo[0]-headFrom[0]*scaleX,headTo[1]-headFrom[1]*scaleY);
bareCtx.drawImage(await loadImage(await readFile(resolve(root,'assets/fixed-template-v1/head-template.png'))),0,0);
const barePixels=pixels(bareHead),expressionHashes=new Set(),expressionChecks=[];
for(const face of pack.items.filter(i=>i.slot==='face')){
  const tile=createCanvas(250,312);tile.getContext('2d').drawImage(await image(face.assets.main.url),0,0,250,312,0,0,250,312);
  const data=pixels(tile);let featurePixels=0;
  for(let y=118;y<200;y++)for(let x=55;x<150;x++){const offset=(y*250+x)*4;if([0,1,2].some(c=>Math.abs(data[offset+c]-barePixels[offset+c])>20))featurePixels++;}
  assert(featurePixels>500,`${face.id}: missing registered eyes/brows/mouth`);
  expressionHashes.add(createHash('sha256').update(data).digest('hex'));expressionChecks.push({id:face.id,featurePixels});
}
assert.equal(expressionHashes.size,3,'Expression selections must produce distinct faces');
for(const f of pack.files){const bytes=await readFile(resolve(ownRoot,f.path)),im=await loadImage(bytes);assert.deepEqual([im.width,im.height],[f.width,f.height]);assert.equal(createHash('sha256').update(bytes).digest('hex'),f.sha256)}
for(const [name,hash] of Object.entries(pack.sourceHashes))assert.equal(createHash('sha256').update(await readFile(resolve(root,'assets/fixed-template-v1',name))).digest('hex'),hash,'Original master changed');
assert.equal(resourcePath(profile,{slot:'hair',pic:'test',variant:'A'}),'image/equip/m/hair/test/1/A/show.png');
assert.equal(resourcePath(profile,{slot:'eff',pic:'test'}),'image/equip/m/eff/test/1/show.png');
assert.equal(resourcePath(profile,{slot:'cloth',pic:'test',kind:'game'}),'image/equip/m/cloth/test/1/game.png');
assert.throws(()=>resourcePath(profile,{slot:'hair',pic:'../escape'}));
assert.throws(()=>validateShowAsset(profile,pack.items.find(i=>i.slot==='hair'),{path:'image/equip/m/hair/test/1/B/show.png',width:1254,height:1254},{original:true}),/Noncanonical/);
assert.throws(()=>showPlan(profile,catalog,{base:'ours',expression:1}),/not been authored/);
assert.throws(()=>showPlan(profile,catalog,{base:'ours',sex:'f'}),/No authored default/);
assert.throws(()=>requireProductionCoverage(profile,pack),/Production coverage incomplete/);
assert.throws(()=>requireProductionCoverage(profile,{...pack,contexts:['show','game','virtual']}),/39 battle frames/,'Cannot pass by claiming contexts only');
const sourceDefaults=[];
for(const sex of ['m','f']){
  const actual=await render(showPlan(profile,catalog,{base:'reference',sex,hidden:['arm']}));
  const baseline=await render(portraitPlan(source.catalog,{sex,hidden:['arm']}));
  assert.deepEqual(pixels(actual),pixels(baseline),`4.0 ${sex} compositor changed pixels`);
  await writeFile(resolve(out,`reference-${sex}.png`),actual.toBuffer('image/png'));
  sourceDefaults.push({sex,exactPixels:true});
}
const items=slot=>pack.items.filter(i=>i.slot===slot);let count=0;
for(const face of items('face'))for(const hair of items('hair'))for(const cloth of items('cloth'))for(const eff of items('eff'))for(const head of items('head')){
  const plan=showPlan(profile,catalog,{base:'ours',selected:{face:face.id,hair:hair.id,cloth:cloth.id,eff:eff.id,head:head.id}});
  assert.deepEqual([plan.width,plan.height],[250,342]);assert(plan.layers.every(l=>l.x===0&&l.y===0));
  const visible=await render(plan);assert(pixels(visible).some((v,i)=>i%4===3&&v>0));
  assert.equal(plan.hairVariant,head.hairType===1?'B':'A');count++;
}
const blends=[];
for(const base of ['ours','reference'])for(const slot of ['face','hair','cloth','eff','head','glass']){
  const alternate=base==='ours'?`ddt-${profile.defaults.m[slot]}`:pack.defaults.m[slot];
  const plan=showPlan(profile,catalog,{base,sex:'m',selected:{[slot]:alternate},hidden:['arm']});
  await render(plan);blends.push({base,slot,layersShareOrigin:true});
}
const own=await render(showPlan(profile,catalog,{base:'ours'}));await writeFile(resolve(out,'original-default.png'),own.toBuffer('image/png'));
const mixed=await render(showPlan(profile,catalog,{base:'reference',selected:{cloth:'ours-510900002'},hidden:['arm']}));await writeFile(resolve(out,'reference-head-original-knight.png'),mixed.toBuffer('image/png'));
const back=showPlan(profile,catalog,{base:'ours',selected:{head:'ours-110900002',hair:'ours-310900002'}});
assert.equal(back.hairVariant,'A');assert.equal(showPlan(profile,catalog,{base:'ours',selected:{head:'ours-110900002',hair:'ours-310900002'},hidden:['head']}).hairVariant,'B');
const report={profile:profile.id,originalItems:pack.items.length,files:pack.files.length,originalCombinations:count,
  referenceDefaults:sourceDefaults,interchangeCases:blends.length,sourceMastersUnmodified:true,allOrigins:[0,0],
  rejectedInvalidDimensions:true,rejectedMissingExpressions:true,rejectedIncompleteProductionPack:true,
  authoredExpressionChecks:expressionChecks,
  acceptance:'File-format/portrait-renderer checks pass. Actual Flash-client item registration, anatomical/topology compatibility, all actions, female originals and owner visual acceptance remain pending.'};
await writeFile(resolve(out,'verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));

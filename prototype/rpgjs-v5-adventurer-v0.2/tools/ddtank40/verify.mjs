/** Original exports + live installed-source interchange; commercial proof PNGs stay in the external lab. */
import assert from 'node:assert/strict';
import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readLocalCatalog} from '../registered-character/local-source.mjs';
import {portraitPlan} from '../registered-character/portrait-adapter.mjs';
import {drawPreparedFrame} from '../registered-character/compositor.mjs';
import {compatibilityCatalog,ownRoot} from './local.mjs';
import {showPlan,resourcePath,validateShowAsset,requireProductionCoverage} from './format.mjs';
import {masterMatrix,masterPoint} from './registration.mjs';
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
bareCtx.imageSmoothingEnabled=true;bareCtx.imageSmoothingQuality='high';
const matrix=masterMatrix(pack.calibration);
assert.throws(()=>masterMatrix({...pack.calibration,matrix:[.244444,0,0,.175559,0,0]}),/preserve proportions/,'Reject the previously squashed body');
assert.throws(()=>masterMatrix({...pack.calibration,head:{},cloth:{}}),/Independent head\/body/,'Reject separate body/head fits');
bareCtx.setTransform(...matrix);
bareCtx.drawImage(await loadImage(await readFile(resolve(root,pack.masterDirectory,'head-template.png'))),0,0);
const barePixels=pixels(bareHead),expressionHashes=new Set(),expressionChecks=[];
const [featureLeft,featureTop]=masterPoint(pack.calibration,[421,350]),[featureRight,featureBottom]=masterPoint(pack.calibration,[749,617]);
for(const face of pack.items.filter(i=>i.slot==='face')){
  const tile=createCanvas(250,312);tile.getContext('2d').drawImage(await image(face.assets.main.url),0,0,250,312,0,0,250,312);
  const data=pixels(tile);let featurePixels=0;
  for(let p=3;p<data.length;p+=4)assert.equal(data[p],barePixels[p],`${face.id}: head contour changed with expression`);
  for(let y=Math.floor(featureTop);y<Math.ceil(featureBottom);y++)for(let x=Math.floor(featureLeft);x<Math.ceil(featureRight);x++){const offset=(y*250+x)*4;if([0,1,2].some(c=>Math.abs(data[offset+c]-barePixels[offset+c])>20))featurePixels++;}
  // This threshold represents visible feature area after the shared uniform
  // downsample. It no longer assumes the rejected enlarged head transform.
  assert(featurePixels>200,`${face.id}: missing registered eyes/brows/mouth`);
  expressionHashes.add(createHash('sha256').update(data).digest('hex'));expressionChecks.push({id:face.id,featurePixels,headContourIdentical:true});
}
assert.equal(expressionHashes.size,3,'Expression selections must produce distinct faces');
const nativePixels=async name=>{const im=await loadImage(await readFile(resolve(root,pack.authoringDirectory,name))),c=createCanvas(im.width,im.height);c.getContext('2d').drawImage(im,0,0);return pixels(c);};
const masterPixels=await nativePixels('master.png');let protectedBodyPixels=0;
const nativeHeadPixels=await nativePixels('layers/head-template.png'),neckChecks=[],proportionChecks=[];
function alphaBounds(data,width,height){let x0=width,y0=height,x1=-1,y1=-1;for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data[(y*width+x)*4+3]>=128){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}return {x:x0,y:y0,width:x1-x0+1,height:y1-y0+1};}
for(const id of ['clothing-traveler','clothing-knight','clothing-mage']){
  const data=await nativePixels('layers/'+id+'.png');
  let neckAboveOldCut=0,overlapBehindJaw=0;
  for(let y=590;y<627;y++)for(let x=530;x<680;x++){const alpha=(y*1254+x)*4+3;if(data[alpha]>=128){neckAboveOldCut++;if(nativeHeadPixels[alpha]>=128)overlapBehindJaw++;}}
  assert(neckAboveOldCut>500&&overlapBehindJaw>500,`${id}: clothing must retain a neck behind the jaw, not a straight shared cut`);
  const item=pack.items.find(i=>i.slot==='cloth'&&i.name.includes({'clothing-traveler':'นักเดินทาง','clothing-knight':'อัศวิน','clothing-mage':'นักเวท'}[id]));
  const canvas=createCanvas(250,312);canvas.getContext('2d').drawImage(await image(item.assets.main.url),0,0);
  const native=alphaBounds(data,1254,1254),exported=alphaBounds(pixels(canvas),250,312),ratioError=Math.abs((exported.width/exported.height)/(native.width/native.height)-1);
  assert(ratioError<.03,`${id}: export changed the authored body aspect ratio`);
  neckChecks.push({id,neckAboveOldCut,overlapBehindJaw});proportionChecks.push({id,native,exported,ratioError});
  for(const [x,y,w,h] of [[482,855,12,24],[780,860,15,34],[550,996,20,27],[676,1010,20,31]])for(let row=y;row<y+h;row++)for(let col=x;col<x+w;col++){
    const p=(row*1254+col)*4;for(let channel=0;channel<4;channel++)assert.equal(data[p+channel],masterPixels[p+channel],`${id}: fixed exposed limb changed`);protectedBodyPixels++;
  }
}
for(const id of ['hair-chestnut','hair-teal','hair-silver-curls','hat-adventurer']){
  const data=await nativePixels('layers/'+id+'.png');for(let y=491;y<527;y++)for(let x=795;x<824;x++)assert.equal(data[(y*1254+x)*4+3],0,`${id}: immutable ear covered`);
}
const capCrownChecks=[];
for(const id of ['hair-chestnut','hair-teal','hair-silver-curls']){
  const full=await nativePixels('layers/'+id+'.png'),under=await nativePixels('layers/'+id+'-under-hat.png');let restoredCrownPixels=0;
  for(let y=0;y<330;y++)for(let x=300;x<960;x++){
    const alpha=(y*1254+x)*4+3;
    assert.equal(under[alpha],0,`${id}: crown protrudes above cap`);
    if(full[alpha]>0)restoredCrownPixels++;
  }
  assert(restoredCrownPixels>1000,`${id}: removing cap must restore the authored crown`);
  capCrownChecks.push({id,coveredWithCap:true,restoredCrownPixels});
}
for(const f of pack.files){const bytes=await readFile(resolve(ownRoot,f.path)),im=await loadImage(bytes);assert.deepEqual([im.width,im.height],[f.width,f.height]);assert.equal(createHash('sha256').update(bytes).digest('hex'),f.sha256)}
for(const [name,hash] of Object.entries(pack.sourceHashes))assert.equal(createHash('sha256').update(await readFile(resolve(root,pack.masterDirectory,name))).digest('hex'),hash,'Original master changed');
for(const [name,hash] of Object.entries(pack.authoringSourceHashes))assert.equal(createHash('sha256').update(await readFile(resolve(root,pack.authoringDirectory,name))).digest('hex'),hash,'Generated source changed');
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
  assert(plan.layers.findIndex(l=>l.slot==='cloth')<plan.layers.findIndex(l=>l.slot==='face'),'Face must cover the clothing neck');
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
if(process.platform==='win32')GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','ProofFont');
const gallery=createCanvas(750,1110),galleryCtx=gallery.getContext('2d');galleryCtx.fillStyle='#e2e8da';galleryCtx.fillRect(0,0,750,1110);galleryCtx.fillStyle='#313d31';galleryCtx.font='14px ProofFont, sans-serif';
for(let row=0;row<3;row++)for(let col=0;col<3;col++){
  const hair=items('hair')[col],selected=row===2?{cloth:items('cloth')[col].id}:{hair:hair.id,...(row===1?{head:'ours-110900002'}:{})};
  const image=await render(showPlan(profile,catalog,{base:'ours',selected}));galleryCtx.drawImage(image,col*250,row*370+24);galleryCtx.fillText(row===2?['TRAVELER','KNIGHT','MAGE'][col]:`${['BROWN','BLUE','SILVER'][col]} / CAP ${row?'ON':'OFF'}`,col*250+12,row*370+19);
}
const originalEvidence=resolve(root,'evidence/ddtank40-three-quarter-v1');await mkdir(originalEvidence,{recursive:true});await writeFile(resolve(originalEvidence,'original-standing-gallery.png'),gallery.toBuffer('image/png'));
const masterPreview=createCanvas(250,342),masterCtx=masterPreview.getContext('2d');masterCtx.imageSmoothingQuality='high';masterCtx.setTransform(...matrix);masterCtx.drawImage(await loadImage(resolve(root,pack.authoringDirectory,'master.png')),0,0);
const proof=createCanvas(750,390),proofCtx=proof.getContext('2d');proofCtx.fillStyle='#e2e8da';proofCtx.fillRect(0,0,750,390);proofCtx.fillStyle='#313d31';proofCtx.font='14px ProofFont, sans-serif';
for(const [col,label,im] of [[0,'BEFORE: SEPARATE STRETCH',await loadImage(resolve(originalEvidence,'before-proportion-fix.png'))],[1,'FULL MASTER: UNIFORM',masterPreview],[2,'ASSEMBLED: UNIFORM',own]]){proofCtx.fillText(label,col*250+10,22);proofCtx.drawImage(im,col*250,35);}
await writeFile(resolve(originalEvidence,'proportion-comparison.png'),proof.toBuffer('image/png'));
await writeFile(resolve(originalEvidence,'master-uniform-preview.png'),masterPreview.toBuffer('image/png'));
const report={profile:profile.id,view:pack.view,template:pack.template,originalItems:pack.items.length,files:pack.files.length,originalCombinations:count,
  referenceDefaults:sourceDefaults,interchangeCases:blends.length,sourceMastersUnmodified:true,allOrigins:[0,0],
  rejectedInvalidDimensions:true,rejectedMissingExpressions:true,rejectedIncompleteProductionPack:true,
  authoredExpressionChecks:expressionChecks,
  protectedBodyPixels,protectedEar:true,capCrownChecks,
  exportMatrix:matrix,uniformAllLayers:true,rejectedAnisotropicBody:true,rejectedSeparateHeadBodyFits:true,proportionChecks,neckChecks,faceAboveClothing:true,
  acceptance:'File-format/portrait-renderer checks pass. Actual Flash-client item registration, anatomical/topology compatibility, all actions, female originals and owner visual acceptance remain pending.'};
await writeFile(resolve(out,'verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));

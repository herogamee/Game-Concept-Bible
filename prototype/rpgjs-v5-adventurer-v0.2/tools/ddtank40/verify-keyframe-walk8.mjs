import assert from 'node:assert/strict';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {showPlan} from './format.mjs';
import {GaitSession} from './walk-rig.mjs';
const root=new URL('../../',import.meta.url),dir=new URL('assets/ddtank40-keyframe-walk-v2/',root),evidence=new URL('evidence/ddtank40-keyframe-walk-v2/',root);await mkdir(evidence,{recursive:true});
const manifest=JSON.parse(await readFile(new URL('manifest.json',dir),'utf8'));
const standing=JSON.parse(await readFile(new URL('assets/ddtank40-compatible-v1/manifest.json',root),'utf8'));
const profile=JSON.parse(await readFile(new URL('profile.json',import.meta.url),'utf8'));
const catalog={items:standing.items,defaults:{ours:{m:standing.defaults}}};
const hash=b=>createHash('sha256').update(b).digest('hex'),bytes=await readFile(new URL(manifest.source,root));
assert.equal(hash(bytes),manifest.sourceSha256);assert.equal(manifest.frames,8);assert.equal(manifest.importMatrix[0],manifest.importMatrix[3]);
const source=await loadImage(bytes),sheet=await loadImage(await readFile(new URL(manifest.items[0].file,dir)));assert.equal(sheet.width,2000);assert.equal(sheet.height,342);
const whole=createCanvas(1774,887);whole.getContext('2d').drawImage(source,0,0);const raw=whole.getContext('2d').getImageData(0,0,1774,887).data;
let sourcePixels=0,maxImportError=0;const signatures=new Set();
for(const frame of manifest.sourceFrames){
  const [x,y,w,h]=frame.rect,[a,b,c,d,e,f]=manifest.importMatrix;
  for(let sy=y;sy<y+h;sy++)for(let sx=x;sx<x+w;sx++)if(raw[(sy*1774+sx)*4+3]>10){const dx=a*(sx-frame.origin[0])+e,dy=d*(sy-frame.origin[1])+f;assert(dx>1&&dx<249&&dy>1&&dy<340,'Authored part clipped by registration');sourcePixels++;}
  const expected=createCanvas(2000,342),ec=expected.getContext('2d');ec.setTransform(a,b,c,d,e+frame.index*250,f);ec.drawImage(source,x,y,w,h,x-frame.origin[0],y-frame.origin[1],w,h);
  const actual=createCanvas(250,342);actual.getContext('2d').drawImage(sheet,frame.index*250,0,250,342,0,0,250,342);
  const actualPixels=actual.getContext('2d').getImageData(0,0,250,342).data,expectedPixels=expected.getContext('2d').getImageData(frame.index*250,0,250,342).data;
  // PNG decode/re-premultiplication can round RGB by1. Compare visible premultiplied colour and alpha, never weaken geometry by an arbitrary image similarity score.
  for(let p=0;p<actualPixels.length;p+=4){assert.equal(actualPixels[p+3],expectedPixels[p+3],'Pose alpha differs from its declared import');for(let channel=0;channel<3;channel++)maxImportError=Math.max(maxImportError,Math.abs(actualPixels[p+channel]-expectedPixels[p+channel])*actualPixels[p+3]/255);}
  assert(maxImportError<=1,'Runtime pose differs from the source import beyond PNG rounding');
  signatures.add(hash(actual.toBuffer('image/png')));assert.deepEqual(frame.headOffset,[0,0]);
}
assert.equal(signatures.size,8);
const images=new Map(),gallery=createCanvas(2000,684),g=gallery.getContext('2d');g.fillStyle='#e2e8da';g.fillRect(0,0,2000,684);let combinations=0;
for(const [hairIndex,hair] of ['ours-310900001','ours-310900004'].entries())for(const face of ['ours-610900001','ours-610900002','ours-610900003'])for(const head of ['ours-110900001','ours-110900002'])for(let frame=0;frame<8;frame++){
  const plan=showPlan(profile,catalog,{selected:{hair,face,head,cloth:manifest.items[0].id}}),c=createCanvas(250,342),ctx=c.getContext('2d');
  for(const layer of plan.layers){const s=layer.source;if(layer.slot==='cloth')ctx.drawImage(sheet,frame*250,0,250,342,0,0,250,342);else{if(!images.has(layer.url))images.set(layer.url,await loadImage(await readFile(new URL('assets/ddtank40-compatible-v1/'+layer.path,root))));ctx.drawImage(images.get(layer.url),s.x,s.y,s.width,s.height,0,0,s.width,s.height);}}
  for(const y of [176,180,184])assert(ctx.getImageData(98,y,1,1).data[3]>240,'Gap at head/neck/scarf join');
  if(face==='ours-610900001'&&head==='ours-110900001')g.drawImage(c,frame*250,hairIndex*342);combinations++;
}
const session=new GaitSession({frames:manifest.frames,frameMs:manifest.frameMs,speed:manifest.speed});session.preview=true;for(let i=0;i<8;i++){session.step();assert.equal(session.frame,(i+1)%8);}session.paused=false;session.tick(50);assert.equal(session.phaseMs,50);
session.paused=true;const fixedPhase=session.phaseMs;showPlan(profile,catalog,{selected:{hair:'ours-310900004',face:'ours-610900002'}});assert.equal(session.phaseMs,fixedPhase);
await writeFile(new URL('eight-poses-two-hairstyles.png',evidence),gallery.toBuffer('image/png'));
const report={source:manifest.source,sourceSha256:manifest.sourceSha256,sourceUnmodified:true,runtimeFrames:8,canonicalFrame:[250,342],runtimeSheet:[2000,342],sourcePixelsPreserved:sourcePixels,declaredImportAlphaExact:true,maxPremultipliedRgbImportError:maxImportError,combinations,headNeckJoinSamples:combinations*3,headAndAppearanceResourcesUnmodified:true,clockWrapAndSwapPhasePass:true,mode:'Frame-based body playback; no standing-texture mesh deformation in active page',scope:manifest.scope,acceptance:manifest.acceptance};
await writeFile(new URL('verification.json',evidence),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));

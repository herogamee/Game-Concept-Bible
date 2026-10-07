import assert from 'node:assert/strict';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {walkRig,gaitPose,deformPoint,canonicalPoint,GaitSession} from './walk-rig.mjs';
import {showPlan} from './format.mjs';
const root=new URL('../../',import.meta.url),dir=new URL('assets/ddtank40-walk-v1/',root),evidence=new URL('evidence/ddtank40-walk-v1/',root);await mkdir(evidence,{recursive:true});
const pack=JSON.parse(await readFile(new URL('manifest.json',dir),'utf8'));
const standing=JSON.parse(await readFile(new URL('assets/ddtank40-compatible-v1/manifest.json',root),'utf8'));
const profile=JSON.parse(await readFile(new URL('profile.json',import.meta.url),'utf8'));
const catalog={items:standing.items,defaults:{ours:{m:standing.defaults}}};
assert.deepEqual(pack.rig.matrix,standing.calibration.matrix);assert.deepEqual(pack.rig,walkRig);
const images=new Map(),sheets=new Map(),hash=b=>createHash('sha256').update(b).digest('hex');
for(const item of pack.items){
  assert.equal(hash(await readFile(new URL(item.source,root))),item.sha256,'Standing source changed');
  const im=await loadImage(await readFile(new URL(item.file,dir)));assert.equal(im.width,2000);assert.equal(im.height,342);sheets.set(item.id,im);
  const signatures=new Set();
  for(let frame=0;frame<8;frame++){const c=createCanvas(250,342);c.getContext('2d').drawImage(im,frame*250,0,250,342,0,0,250,342);signatures.add(hash(c.toBuffer('image/png')));const p=c.getContext('2d').getImageData(0,0,250,342).data;for(let y=0;y<342;y++)assert.equal(p[(y*250)*4+3]+p[(y*250+249)*4+3],0,'Pose clipped at frame boundary');}
  assert.equal(signatures.size,8,'Duplicated static frames');
}
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);let stanceChecks=0;
for(let frame=0;frame<8;frame++){
  const pose=gaitPose(frame);assert.deepEqual(pose,pack.poses[frame]);
  for(let leg=0;leg<2;leg++){
    const p=pose.legs[leg],r=walkRig.legs[leg];
    assert(Math.abs(dist(p.hip,p.knee)-dist(r.hip,r.knee))<1e-6);assert(Math.abs(dist(p.knee,p.ankle)-dist(r.knee,r.ankle))<1e-6);
    if(p.stance){assert(Math.abs(p.ankle[1]-r.ankle[1])<.001,'Stance foot leaves its floor');stanceChecks++;}
  }
  const source=[610,627];assert.deepEqual(deformPoint(source,pose),[source[0]+pose.head[0],source[1]+pose.head[1]],'Neck and head clocks diverged');
}
assert.throws(()=>gaitPose(8));
const session=new GaitSession();for(let i=0;i<10;i++)session.tick(20,1);assert(session.x>480);assert.equal(session.direction,1);assert(session.phaseMs>0);
session.paused=true;const frozen=[session.x,session.phaseMs];session.tick(50,-1);assert.deepEqual([session.x,session.phaseMs],frozen);
session.step();assert.equal(session.frame,3);session.paused=false;const arrival=session.x-10;session.destination=arrival;for(let i=0;i<30;i++)session.tick(20);assert.equal(session.x,arrival);assert.equal(session.destination,null);assert.equal(session.direction,-1);
for(let i=0;i<200;i++)session.tick(50,-1,[100,860]);assert.equal(session.x,100);
session.destination=null;session.preview=false;for(let i=0;i<10;i++)session.tick(20);assert.equal(session.blend,0);
const gallery=createCanvas(2000,684),g=gallery.getContext('2d');g.fillStyle='#e2e8da';g.fillRect(0,0,2000,684);let combinations=0,neckSamples=0;
for(const cloth of pack.items)for(const hair of ['ours-310900001','ours-310900004'])for(const face of ['ours-610900001','ours-610900002','ours-610900003'])for(const head of ['ours-110900001','ours-110900002'])for(let frame=0;frame<8;frame++){
  const plan=showPlan(profile,catalog,{selected:{cloth:cloth.id,hair,face,head}}),pose=gaitPose(frame),c=createCanvas(250,342),ctx=c.getContext('2d');
  for(const layer of plan.layers){
    const s=layer.source;
    if(layer.slot==='cloth')ctx.drawImage(sheets.get(cloth.id),frame*250,0,250,342,0,0,250,342);
    else {if(!images.has(layer.url))images.set(layer.url,await loadImage(await readFile(new URL('assets/ddtank40-compatible-v1/'+layer.path,root))));ctx.drawImage(images.get(layer.url),s.x,s.y,s.width,s.height,pose.head[0]*walkRig.matrix[0],pose.head[1]*walkRig.matrix[0],s.width,s.height);}
  }
  const [nx,ny]=canonicalPoint([610+pose.head[0],635+pose.head[1]]),pixel=ctx.getImageData(Math.round(nx),Math.round(ny),1,1).data;assert(pixel[3]>240,'Visible gap at jaw/neck');neckSamples++;
  if(hair==='ours-310900001'&&face==='ours-610900001'&&head==='ours-110900001')g.drawImage(c,frame*250,cloth.id==='ours-510900001'?0:342);
  combinations++;
}
await writeFile(new URL('eight-frame-outfits.png',evidence),gallery.toBuffer('image/png'));
const report={rig:walkRig.id,frames:8,outfits:2,hair:2,eyes:3,hats:2,combinations,stanceChecks,neckSamples,sourceHashesUnchanged:true,boneLengthsPreserved:true,frameBoundariesClear:true,movementPauseArrivalBoundsPass:true,scope:pack.scope,artAcceptance:'Pending owner review; mesh bend/occlusion remains an experiment, no other actions/views/Flash interoperability claimed.'};
await writeFile(new URL('verification.json',evidence),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));

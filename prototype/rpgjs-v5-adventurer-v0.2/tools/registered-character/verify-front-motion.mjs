import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {createHash} from 'node:crypto';
import {FixedTemplateSelection,resolveFixedSelection} from './fixed-template-model.mjs';
import {FrontMotionSession,frontMotionPlan} from './front-motion-model.mjs';
import {drawPreparedFrame,prepareRegisteredFrame} from './compositor.mjs';
import {frontPoseLayout,frontSkinMask} from '../front-motion-layout.mjs';
const dir='assets/fixed-front-motion-v1',evidence='evidence/fixed-front-motion-v1';
const fixed=JSON.parse(await readFile('assets/fixed-template-v1/manifest.json','utf8')),motion=JSON.parse(await readFile(`${dir}/manifest.json`,'utf8')),images=new Map(),atlasPixels=new Map();
const hash=data=>createHash('sha256').update(data).digest('hex');
for(const file of motion.files){const image=await loadImage(`${dir}/${file}`);const w=motion.atlases.includes(file)?1536:384;assert.deepEqual([image.width,image.height],[w,512],file);images.set(`/front-motion-assets/${file}`,image);const c=createCanvas(w,512);c.getContext('2d').drawImage(image,0,0);atlasPixels.set(file,c.getContext('2d').getImageData(0,0,w,512).data);}
const clothes=fixed.items.filter(i=>i.slot==='clothing'),hairs=fixed.items.filter(i=>i.slot==='hair'),eyes=fixed.items.filter(i=>i.slot==='eye_set'),faces=[null,...fixed.items.filter(i=>i.slot==='face_set').map(i=>i.id)],hats=[null,...fixed.items.filter(i=>i.slot==='hat').map(i=>i.id)];
const poseHashes=new Map(),headHashes=new Map(),neckChecks=[];let cases=0;
const c=createCanvas(384,512),review=createCanvas(1920,1536),r=review.getContext('2d');r.fillStyle='#e6eddd';r.fillRect(0,0,1920,1536);
for(const clothing of clothes)for(const hair of hairs)for(const hat of hats)for(const eye of eyes)for(const face of faces)for(const [index,action,frame] of [[0,'stand',0],...Array.from({length:4},(_,f)=>[f+1,'walk',f])]){
 const selected={clothing:clothing.id,hair:hair.id,hat,eye_set:eye.id,face_set:face},plan=frontMotionPlan(fixed,motion,selected,{},action,frame);
 const prepared=await prepareRegisteredFrame(plan,url=>images.get(url));drawPreparedFrame(c,prepared);
 for(const l of plan.layers){assert.equal(l.x,0);assert.equal(l.y,0);assert.equal(l.source.width,384);assert.equal(l.source.height,512);}
 const data=c.getContext('2d').getImageData(0,0,384,512).data,key=JSON.stringify([hair.id,hat,eye.id,face]),head=hash(data.subarray(0,384*238*4));if(!headHashes.has(key))headHashes.set(key,head);assert.equal(head,headHashes.get(key),'Action, frame or clothing altered registered head');
 // The fixed original head must join an opaque neck/body in every outfit pose.
 for(let y=230;y<=251;y++)assert(data[(y*384+192)*4+3]>200,`Detached neck ${clothing.id}/${action}/${frame}/${y}`);
 const poseKey=clothing.id;if(!poseHashes.has(poseKey))poseHashes.set(poseKey,new Set());poseHashes.get(poseKey).add(hash(data));
 if(hair.id==='hair-chestnut'&&hat===null&&eye.id==='eyes-amber'&&face===null){const row=clothes.indexOf(clothing);r.drawImage(c,index*384,row*512);}
 cases++;
}
// Four body rasters differ; neutral stand is independently authored/preserved.
for(const clothing of clothes){const data=atlasPixels.get(motion.clothing[clothing.id].walk),frames=new Set();for(let f=0;f<4;f++){const c=createCanvas(384,512);c.getContext('2d').drawImage(images.get(`/front-motion-assets/${motion.clothing[clothing.id].walk}`),f*384,0,384,512,0,0,384,512);frames.add(hash(c.getContext('2d').getImageData(0,0,384,512).data));}assert.equal(frames.size,4);}
const fixtures=[];
for(const [frame,pose] of frontPoseLayout.poses.entries()){
 const base=await loadImage(`${dir}/${pose.sourceKey}-traveler-generated.png`),raw=createCanvas(1254,1254);raw.getContext('2d').drawImage(base,0,0);
 const mask=frontSkinMask(raw.getContext('2d').getImageData(0,0,1254,1254).data),large=createCanvas(1254,1254),d=large.getContext('2d').createImageData(1254,1254);
 for(let p=0;p<mask.length;p++)if(mask[p]){d.data[p*4]=255;d.data[p*4+1]=255;d.data[p*4+2]=255;d.data[p*4+3]=255;}large.getContext('2d').putImageData(d,0,0);
 const small=createCanvas(384,512);small.getContext('2d').drawImage(large,-33,42.52,451.44,451.44);const alpha=small.getContext('2d').getImageData(0,0,384,512).data;let checks=0;
 const original=atlasPixels.get(motion.clothing['clothing-traveler'].walk);
 for(let y=239;y<511;y++)for(let x=1;x<383;x++){
  let core=true;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(alpha[((y+dy)*384+x+dx)*4+3]<254)core=false;
  if(core){const i=(y*1536+frame*384+x)*4;for(const clothing of clothes)for(let k=0;k<4;k++)assert.equal(atlasPixels.get(motion.clothing[clothing.id].walk)[i+k],original[i+k],`Exposed walking body changed ${clothing.id}/${pose.id}`);checks++;}
 }
 assert(checks>100,'No substantial protected limb fixtures');fixtures.push({pose:pose.id,canonicalPixels:checks});
}
const soles=[];
for(const clothing of clothes)for(let f=0;f<4;f++){
 // Leave a central gap: a forward boot can cross the character centreline.
 // Whole left/right half-frame maxima would count the same toe twice.
 const data=atlasPixels.get(motion.clothing[clothing.id].walk),bottoms=[-1,-1];for(let side=0;side<2;side++){const [left,right]=side===0?[125,185]:[205,270];for(let y=420;y<512;y++)for(let x=left;x<right;x++)if(data[(y*1536+f*384+x)*4+3]>180)bottoms[side]=y;}
 assert(bottoms.every(y=>y>=430&&y<501),`Missing or clipped walking boot: ${clothing.id}/${motion.poses[f].id}/${bottoms}`);assert(Math.max(...bottoms)>=465,'No supporting boot near ground');soles.push({clothing:clothing.id,pose:motion.poses[f].id,left:bottoms[0],right:bottoms[1]});
}
const defaultSoles=soles.filter(s=>s.clothing==='clothing-traveler');assert(defaultSoles[0].right>defaultSoles[0].left+10,`Right contact failed ${JSON.stringify(defaultSoles)}`);assert(defaultSoles[2].left>defaultSoles[2].right+10,`Left contact failed ${JSON.stringify(defaultSoles)}`);
const selection=new FixedTemplateSelection(fixed),session=new FrontMotionSession(motion.frames);session.change('walk');session.tick(90);const phase=session.phase;
for(const [slot,id] of [['eye_set','eyes-joy'],['face_set','face-scar'],['hair','hair-teal'],['hat','hat-adventurer'],['clothing','clothing-mage']])selection.equip(slot,id);
assert.equal(session.phase,phase);assert.equal(session.action,'walk');assert(session.playing);session.tick(80);assert(session.phase>phase);
const before=JSON.stringify(selection.selected);session.change('stand');session.tick(100);session.tick(30);assert.equal(session.transition,null);assert.equal(JSON.stringify(selection.selected),before);session.change('walk');assert.equal(JSON.stringify(selection.selected),before);session.step();assert.equal(session.playing,false);
assert.throws(()=>frontMotionPlan(fixed,motion,{}, {},'shoot',0));assert.throws(()=>frontMotionPlan(fixed,motion,{}, {},'walk',4));assert.throws(()=>frontMotionPlan(fixed,{...motion,clothing:{}},{}, {},'walk',0));
assert.throws(()=>frontMotionPlan(fixed,{...motion,appearanceTemplate:'wrong'},{}, {},'walk',0));
for(const showHair of [false,true])for(const showEyes of [false,true]){const plan=frontMotionPlan(fixed,motion,selection.selected,{showHair,showEyes},'walk',1);assert.equal(plan.layers.some(l=>l.slot==='hair'),showHair);assert.equal(plan.layers.some(l=>l.slot==='eye_set'),showEyes);assert(plan.layers.some(l=>l.slot==='hat'));}
await writeFile(`${evidence}/three-outfits-five-poses.png`,review.toBuffer('image/png'));
const report={cases,visibleLooks:162,statesPerLook:5,authoredWalkingKeyPoses:4,direction:'front',allOriginsZero:true,headAppearanceUnchangedAcrossActionsFramesAndClothes:true,neckConnectedInAllCases:true,sharedExposedBodyFixtures:fixtures,independentEquipmentKeepsAnimationPhase:true,unsupportedActionsAndMissingClothingPosesRejected:true,soles,limitations:'Four key poses at 6fps, stationary front-facing gait trial. Visual rhythm, soles, transitions, sleeve boundaries and owner art acceptance remain pending. Other directions/actions, full costumes, playable integration and production throughput are not implemented.'};
await writeFile(`${evidence}/verification.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));

/** Register the owner-selected, already headless pose atlas; preserve its artwork. */
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url),dir=new URL('assets/ddtank40-keyframe-walk-v1/',root);
const source='assets/ddtank40-cutout-v1/traveler-keyframes-draft.png',bytes=await readFile(new URL(source,root)),image=await loadImage(bytes);
if(image.width!==1254||image.height!==1254)throw new Error('Pose atlas source dimensions changed');
// This source family has an irregular row stride. Rectangles keep ALL painted
// pixels; row offsets describe its atlas registration, not per-frame body fitting.
const frames=[
 {rect:[0,0,627,700],origin:[0,0]},
 {rect:[627,0,627,700],origin:[627,0]},
 {rect:[0,700,627,554],origin:[0,558]},
 {rect:[627,700,627,554],origin:[627,558]}
].map((f,index)=>({...f,index,headOffset:[0,0]}));
const matrix=[.345,0,0,.345,-9.985,87.51];
const sheet=createCanvas(1000,342),ctx=sheet.getContext('2d');
for(const frame of frames){
 const [x,y,w,h]=frame.rect;ctx.save();ctx.beginPath();ctx.rect(frame.index*250,0,250,342);ctx.clip();ctx.translate(frame.index*250,0);ctx.transform(...matrix);
 ctx.drawImage(image,x,y,w,h,x-frame.origin[0],y-frame.origin[1],w,h);ctx.restore();
}
const file='image/equip/m/cloth/ours_cloth_1/1/walk.png';await mkdir(new URL('image/equip/m/cloth/ours_cloth_1/1/',dir),{recursive:true});
await writeFile(new URL(file,dir),sheet.toBuffer('image/png'));
const manifest={version:1,id:'owner-selected-keyframe-walk-v1',width:250,height:342,frames:4,frameMs:150,speed:48,
 source,sourceSha256:createHash('sha256').update(bytes).digest('hex'),sourceFrames:frames,importMatrix:matrix,
 headPolicy:'Existing canonical head/eyes/hair/hat remain unchanged, all at their common origin. Only the source body atlas receives its declared family import.',
 items:[{id:'ours-510900001',file,url:'/ddt40/keyframe-walk/'+file}],
 acceptance:'Owner liked the new source artwork and requested live use on2026-10-07. Composed playback remains for review; repeated leading-leg phases and source variation are recorded, not repaired by texture deformation.',
 scope:'Four-frame Canvas lab preview, one outfit. Auxiliary walk.png, not DDTank game.png/virtual coverage and not Godot/Phaser integration.'};
await writeFile(new URL('manifest.json',dir),JSON.stringify(manifest,null,2)+'\n');
console.log('Published the existing headless pose source as4 registered250x342 frames; original master unchanged.');

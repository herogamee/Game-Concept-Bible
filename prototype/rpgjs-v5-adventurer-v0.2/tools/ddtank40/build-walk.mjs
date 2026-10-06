import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {walkRig,gaitPose} from './walk-rig.mjs';
import {drawClothingPose} from './walk-mesh.mjs';
const root=new URL('../../',import.meta.url),dir=new URL('assets/ddtank40-walk-v1/',root);await mkdir(dir,{recursive:true});
const manifest={version:1,id:walkRig.id,width:250,height:342,frames:8,frameMs:walkRig.frameMs,view:'three-quarter-left; right mirrors whole character',rig:walkRig,poses:Array.from({length:8},(_,i)=>gaitPose(i)),items:[],scope:'Original two-outfit gait experiment; deterministic mesh deformation of canonical standing PNGs. Not authored DDTank game/virtual sheets or accepted natural-motion art.'};
for(const i of [1,2]){
  const relative=`assets/ddtank40-compatible-v1/image/equip/m/cloth/ours_cloth_${i}/1/show.png`,bytes=await readFile(new URL(relative,root)),image=await loadImage(bytes);
  const sheet=createCanvas(250*8,342),ctx=sheet.getContext('2d');
  for(let frame=0;frame<8;frame++){ctx.save();ctx.translate(frame*250,0);drawClothingPose(ctx,image,gaitPose(frame));ctx.restore();}
  const file=`cloth-${i}-walk.png`;await writeFile(new URL(file,dir),sheet.toBuffer('image/png'));
  manifest.items.push({id:`ours-51090000${i}`,file,url:`/ddt40/walk-assets/${file}`,source:relative,sha256:createHash('sha256').update(bytes).digest('hex')});
}
await writeFile(new URL('manifest.json',dir),JSON.stringify(manifest,null,2)+'\n');
console.log(`Built ${manifest.items.length} intact-clothing walk sheets; 8 x 250x342, one shared rig: ${fileURLToPath(dir)}`);

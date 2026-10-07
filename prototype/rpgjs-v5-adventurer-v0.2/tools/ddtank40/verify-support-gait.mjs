import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {supportRig,supportSpeed,supportPose,drawSupportBody} from './support-gait.mjs';
import {showPlan} from './format.mjs';
const root=new URL('../../',import.meta.url),evidence=new URL('evidence/ddtank40-support-gait-v1/',root);await mkdir(evidence,{recursive:true});
const standing=JSON.parse(await readFile(new URL('assets/ddtank40-compatible-v1/manifest.json',root),'utf8')),profile=JSON.parse(await readFile(new URL('profile.json',import.meta.url),'utf8')),catalog={items:standing.items,defaults:{ours:{m:standing.defaults}}};
const gallery=createCanvas(1000,684),ctx=gallery.getContext('2d'),images=new Map();ctx.fillStyle='#e2e8da';ctx.fillRect(0,0,1000,684);
const plan=showPlan(profile,catalog,{selected:{hair:'ours-310900001',face:'ours-610900001',head:'ours-110900001',cloth:'ours-510900001'}}),poses=[];
for(let frame=0;frame<8;frame++){
  const pose=supportPose(frame/8);poses.push(pose);ctx.save();ctx.translate(frame%4*250,Math.floor(frame/4)*342);
  ctx.strokeStyle='#9aa88c';ctx.beginPath();ctx.moveTo(12,300);ctx.lineTo(238,300);ctx.stroke();drawSupportBody(ctx,pose);
  for(const layer of plan.layers){if(layer.slot==='cloth')continue;if(!images.has(layer.path))images.set(layer.path,await loadImage(await readFile(new URL('assets/ddtank40-compatible-v1/'+layer.path,root))));const s=layer.source;ctx.drawImage(images.get(layer.path),s.x,s.y,s.width,s.height,0,pose.bodyY,s.width,s.height);}
  ctx.fillStyle='#313d31';ctx.font='14px sans-serif';ctx.fillText(`${frame+1} / 8`,15,326);ctx.restore();
}
await writeFile(new URL('eight-phase-rig.png',evidence),gallery.toBuffer('image/png'));
await writeFile(new URL('poses.json',evidence),JSON.stringify({rig:supportRig,speed:supportSpeed,poses,scope:'Original coloured skeleton proof with existing appearance attachments. No painted clothing is bound.'},null,2)+'\n');
console.log('Saved the actual8-phase coloured rig and immutable appearance composition. Run support-gait.test.mjs for physical invariants.');

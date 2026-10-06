import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {frontPoseLayout,frontSkinMask} from './front-motion-layout.mjs';
const dir='assets/fixed-front-motion-v1',fixedDir='assets/fixed-template-v1';
const fixed=JSON.parse(await readFile(`${fixedDir}/manifest.json`,'utf8'));
const width=384,height=512,columns=4,rows=1,scale=.36,x=-33,y=42.52;
await mkdir(dir,{recursive:true});await mkdir('evidence/fixed-front-motion-v1',{recursive:true});
async function source(file){const image=await loadImage(file);if(image.width!==1254||image.height!==1254)throw new Error(`Unregistered pose source: ${file}`);return image;}
async function exported(image,file){const c=createCanvas(width,height),ctx=c.getContext('2d');if(file.endsWith('-stand.png')){ctx.beginPath();ctx.rect(0,238,width,height-238);ctx.clip();}ctx.drawImage(image,x,y,1254*scale,1254*scale);await writeFile(`${dir}/${file}`,c.toBuffer('image/png'));}
const headFiles=[...new Set([fixed.head.file,...fixed.items.filter(i=>i.slot!=='clothing').flatMap(i=>[i.file,i.hatFile].filter(Boolean))])];
for(const file of headFiles)await exported(await source(`${fixedDir}/${file}`),file);
const clothing={},atlases=[];
const basePoses=[];
const masks=[],basePixels=[];
for(const pose of frontPoseLayout.poses){
 const c=createCanvas(1254,1254);c.getContext('2d').drawImage(await source(`${dir}/${pose.sourceKey}-traveler-generated.png`),0,0);basePoses.push(c);
 const data=c.getContext('2d').getImageData(0,0,1254,1254);basePixels.push(data);const mask=frontSkinMask(data.data);masks.push(mask);
 const guide=createCanvas(1254,1254),g=guide.getContext('2d');g.drawImage(c,0,0);const pixels=g.getImageData(0,0,1254,1254);for(let p=0;p<mask.length;p++)if(mask[p]){pixels.data[p*4]=20;pixels.data[p*4+1]=170;pixels.data[p*4+2]=150;}g.putImageData(pixels,0,0);await writeFile(`${dir}/${pose.id}-protection-guide.png`,guide.toBuffer('image/png'));
}
const neck=await source(`${fixedDir}/clothing-traveler.png`);
for(const item of fixed.items.filter(i=>i.slot==='clothing')){
 const stand=`${item.id}-stand.png`,walk=`${item.id}-walk.png`;clothing[item.id]={stand,walk};atlases.push(walk);
 await exported(await source(`${fixedDir}/${item.file}`),stand);
 const atlas=createCanvas(width*columns,height*rows),ctx=atlas.getContext('2d');
 for(const [frame,pose] of frontPoseLayout.poses.entries()){
  const canvas=createCanvas(1254,1254),c=canvas.getContext('2d'),base=basePoses[frame];
  c.drawImage(item.id==='clothing-traveler'?base:await source(`${dir}/${pose.sourceKey}-${item.id.replace('clothing-','')}-generated.png`),0,0);
  // One protection map per pose, shared by every outfit; never variant bounds.
  const data=c.getImageData(0,0,1254,1254),original=basePixels[frame],mask=masks[frame];
  for(let i=0;i<data.data.length;i+=4){const top=i<1254*543*4;if(top){data.data.fill(0,i,i+4);}else if(mask[i/4])for(let k=0;k<4;k++)data.data[i+k]=original.data[i+k];}
  c.putImageData(data,0,0);
  // Shared original neck fixture aligns all pose bodies with the fixed head.
  c.save();c.beginPath();c.rect(603,543,44,14);c.clip();c.drawImage(neck,0,0);c.restore();
  ctx.save();ctx.beginPath();ctx.rect(frame*width,238,width,height-238);ctx.clip();ctx.drawImage(canvas,frame*width+x,y,1254*scale,1254*scale);ctx.restore();
 }
 await writeFile(`${dir}/${walk}`,atlas.toBuffer('image/png'));
}
const manifest={version:1,template:'fixed-front-motion-v1',appearanceTemplate:fixed.template,width,height,frames:4,columns,rows,direction:'front',actions:['stand','walk'],fps:6,mapping:{scale,x,y},anchors:{neck:[192,238],standingGround:[192,480]},poses:frontPoseLayout.poses,bodyProtection:{skinRegions:frontPoseLayout.skinRegions,skinRule:frontPoseLayout.skinRule,dilation:frontPoseLayout.dilation,source:'one traveler pose per frame; same frozen mask reused for all outfits'},clothing,atlases,files:[...headFiles,...Object.values(clothing).flatMap(i=>[i.stand,i.walk])],scope:'Four individually authored front walk key poses plus the original stand pose. Shared original head/appearance IDs and pose-owned exposed-body masks. No runtime limb rotation or per-item fitting. Experimental gait, owner acceptance pending; not other directions/actions or a mass-production pipeline.'};
await writeFile(`${dir}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
console.log('Exported four registered front poses for the three clothing IDs and every head category.');

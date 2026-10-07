/** Front standing review only. Preserve source proportions; export shared canvases. */
import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const assetDir='assets/standing-review',output='evidence/modular';
await mkdir(output,{recursive:true});
const manifest=JSON.parse(await readFile('public/modular/manifest.json','utf8'));
const bodyRegistration=JSON.parse(await readFile(`${assetDir}/registration.json`,'utf8'));
const headSource=await loadImage(await readFile('assets/modular/base-parts.png'));
const hairSource=await loadImage(await readFile('assets/modular/hair-chestnut.png'));
const body=await loadImage(await readFile(`${assetDir}/traveler-body-front.png`));
const prior=await loadImage(await readFile(`${output}/standing-front-corrected.png`));
const headRect=manifest['head.south'].rect,hairRect=manifest['hair-chestnut.south'].rect;
// One-time front-pose authoring placement, not a per-item bounding-box fit.
// Chin stays at y=35. Head width=30; hair width=34, with its crown above the skull.
const headScale=30/headRect.width,hairScale=34/hairRect.width;
const registration={
  version:2,scope:'front standing review only; not integrated into gameplay',
  canvas:{width:64,height:64,exportScale:12,origin:{x:0,y:0}},
  head:{file:'head-front-registered-v2.png',source:'../modular/base-parts.png',rect:headRect,
    sourcePixelScale:headScale,x:17,y:35-headRect.height*headScale},
  hair:{file:'hair-chestnut-front-registered-v2.png',source:'../modular/hair-chestnut.png',rect:hairRect,
    sourcePixelScale:hairScale,x:15,y:0.5},
  body:bodyRegistration,
};
function layer(source:any,p:typeof registration.head){
  const canvas=createCanvas(768,768),ctx=canvas.getContext('2d');ctx.scale(12,12);
  const r=p.rect,s=p.sourcePixelScale;
  ctx.drawImage(source,r.x,r.y,r.width,r.height,p.x,p.y,r.width*s,r.height*s);
  return canvas;
}
const head=layer(headSource,registration.head),hair=layer(hairSource,registration.hair);
await writeFile(`${assetDir}/${registration.head.file}`,head.toBuffer('image/png'));
await writeFile(`${assetDir}/${registration.hair.file}`,hair.toBuffer('image/png'));
await writeFile(`${assetDir}/registration-v2.json`,JSON.stringify(registration,null,2)+'\n');
const assembled=createCanvas(768,768),ctx=assembled.getContext('2d');
const r=bodyRegistration.rect,h=bodyRegistration.height,w=h*r.width/r.height;
ctx.drawImage(body,r.x,r.y,r.width,r.height,(32-w/2)*12,bodyRegistration.top*12,w*12,h*12);
// Both exported layers use the identical untrimmed canvas and origin.
ctx.drawImage(head,0,0);ctx.drawImage(hair,0,0);
await writeFile(`${output}/standing-front-registered-v2.png`,assembled.toBuffer('image/png'));
GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','ReviewFont');
const comparison=createCanvas(1100,600),c=comparison.getContext('2d');
c.fillStyle='#eee7d5';c.fillRect(0,0,1100,600);c.fillStyle='#332b20';
c.font='24px ReviewFont';c.textAlign='center';
c.fillText('ก่อนแก้ · หัวโผล่เหนือผม',275,40);
c.fillText('แก้สัดส่วนและตำแหน่งผม',825,40);
// Enlarge the same front head region; no face repainting or flattening of source layers.
c.drawImage(prior,12*12,0,40*12,36*12,40,65,470,423);
c.drawImage(assembled,12*12,0,40*12,36*12,590,65,470,423);
c.font='18px ReviewFont';c.fillText('ผมถูกย่อกว้าง–สูงคนละอัตรา',275,545);
c.fillText('รักษาสัดส่วน · หัวและผมใช้กรอบเดียวกัน',825,545);
await writeFile(`${output}/head-hair-registration-comparison-v2.png`,comparison.toBuffer('image/png'));
const layers=createCanvas(1200,560),l=layers.getContext('2d');
l.fillStyle='#eee7d5';l.fillRect(0,0,1200,560);l.fillStyle='#332b20';
l.font='22px ReviewFont';l.textAlign='center';
for(const [i,img,label] of [[0,head,'หัวเดิม'],[1,hair,'ผมเดิม · รักษาสัดส่วน'],[2,assembled,'ซ้อนที่จุดเริ่มเดียวกัน']] as const){
  l.fillText(label,200+i*400,35);
  l.drawImage(img,12*12,0,40*12,36*12,i*400+15,65,370,333);
}
await writeFile(`${output}/head-hair-layers-v2.png`,layers.toBuffer('image/png'));
console.log('Exported front-only registered layers and visual comparison; gameplay unchanged.');

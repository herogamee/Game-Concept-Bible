/** One front pose only. Art-review output, not a new game animation. */
import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {drawRig,defaultWardrobe,type PartManifest} from '../src/game/modular-rig';
const output='evidence/modular';await mkdir(output,{recursive:true});
const manifest=JSON.parse(await readFile('public/modular/manifest.json','utf8')) as PartManifest;
const images:Record<string,any>={};for(const file of new Set(Object.values(manifest).map(p=>p.file)))images[file]=await loadImage(await readFile(`assets/modular/${file}`));
const body=await loadImage(await readFile('assets/standing-review/traveler-body-front.png'));
const scan=createCanvas(body.width,body.height),scanCtx=scan.getContext('2d');scanCtx.drawImage(body,0,0);
const pixels=scanCtx.getImageData(0,0,body.width,body.height).data;
let x0=body.width,y0=body.height,x1=0,y1=0;
for(let y=0;y<body.height;y++)for(let x=0;x<body.width;x++)if(pixels[(y*body.width+x)*4+3]>180){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
const registration={source:'traveler-body-front.png',rect:{x:x0,y:y0,width:x1-x0+1,height:y1-y0+1},top:33,height:27.5,centerX:32,head:{x:32,y:20,width:30,height:30},hair:{x:32,y:16.3,width:33,height:28}};
await writeFile('assets/standing-review/registration.json',JSON.stringify(registration,null,2)+'\n');
function drawCorrected(ctx:any,scale:number){
  ctx.save();ctx.scale(scale,scale);
  const r=registration.rect,h=registration.height,w=h*r.width/r.height;
  ctx.drawImage(body,r.x,r.y,r.width,r.height,registration.centerX-w/2,registration.top,w,h);
  for(const [id,placement] of [['head.south',registration.head],['hair-chestnut.south',registration.hair]] as const){
    const source=manifest[id],rect=source.rect,p=placement;
    ctx.drawImage(images[source.file],rect.x,rect.y,rect.width,rect.height,p.x-p.width/2,p.y-p.height/2,p.width,p.height);
  }ctx.restore();
}
const corrected=createCanvas(768,768);drawCorrected(corrected.getContext('2d'),12);
await writeFile(`${output}/standing-front-corrected.png`,corrected.toBuffer('image/png'));
const comparison=createCanvas(1200,680),ctx=comparison.getContext('2d');ctx.fillStyle='#e8e1c9';ctx.fillRect(0,0,1200,680);
GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','ReviewFont');
ctx.fillStyle='#332b20';ctx.font='22px ReviewFont';ctx.textAlign='center';ctx.fillText('ก่อนแก้ · รอยต่อแบบหุ่น',300,36);ctx.fillText('ภาพยืนใหม่ · ลำตัวต่อเนื่อง',900,36);
ctx.save();ctx.translate(28,60);drawRig(ctx,images,manifest,{...defaultWardrobe,weapon:false},'south','idle',0,8.5);ctx.restore();
ctx.save();ctx.translate(628,60);drawCorrected(ctx,8.5);ctx.restore();
await writeFile(`${output}/standing-front-comparison.png`,comparison.toBuffer('image/png'));
console.log('Exported front-pose review; no walk/attack/side-view claim.');

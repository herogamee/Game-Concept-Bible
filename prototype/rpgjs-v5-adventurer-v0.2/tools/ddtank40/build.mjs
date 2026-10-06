/** Deterministic registered export of original masters to installed 4.0 dimensions. */
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resourcePath,validateShowAsset} from './format.mjs';
import {masterMatrix} from './registration.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const profile=JSON.parse(await readFile(new URL('profile.json',import.meta.url),'utf8'));
const authoring=JSON.parse(await readFile(resolve(root,'assets/ddtank40-three-quarter-v1/manifest.json'),'utf8'));
const masterDirectory='assets/ddtank40-three-quarter-v1/layers';
const masters=resolve(root,masterDirectory);
const output=resolve(root,'assets/ddtank40-compatible-v1');
// All layers share one uniform conversion of the complete authored design.
const calibration=authoring.calibration;
const exportMatrix=masterMatrix(calibration);
const sourceHashes={},files=[],items=[];
async function load(name) {
  const b=await readFile(resolve(masters,name));sourceHashes[name]=createHash('sha256').update(b).digest('hex');
  const image=await loadImage(b);if(image.width!==1254||image.height!==1254)throw new Error('Unexpected master dimensions');return image;
}
function tile(){return createCanvas(...profile.show.ordinaryPng)}
function registered(image) {
  const result=tile(),ctx=result.getContext('2d');
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.save();ctx.setTransform(...exportMatrix);ctx.drawImage(image,0,0);ctx.restore();return result;
}
async function save(path,canvas) {
  const file=resolve(output,path);await mkdir(dirname(file),{recursive:true});
  const bytes=canvas.toBuffer('image/png');await writeFile(file,bytes);
  files.push({path,width:canvas.width,height:canvas.height,sha256:createHash('sha256').update(bytes).digest('hex')});
  return {path,width:canvas.width,height:canvas.height,url:`/ddt40/ours/${path}`};
}
async function item({number,slot,pic,label,source,hatSource,empty=false}) {
  const entry={id:`ours-${number}`,templateId:number,name:label,slot,pic,sex:'m',source:'ours',hairType:slot==='head'&&!empty?2:1,assets:{},showFrames:slot==='face'?[0]:undefined,headOverlap:slot==='cloth'?authoring.headOverlap:undefined};
  const variants=slot==='hair'?['A','B']:['main'];
  for(const variant of variants) {
    let canvas;
    if(empty){canvas=createCanvas(...(profile.show.emptyDefaultPng[slot]||profile.show.ordinaryPng));}
    else if(slot==='face') {
      const head=registered(await load('head-template.png')),eye=registered(await load(source));
      const headCtx=head.getContext('2d'),basePixels=headCtx.getImageData(0,0,head.width,head.height);
      headCtx.drawImage(eye,0,0);
      const expressionPixels=headCtx.getImageData(0,0,head.width,head.height);
      for(let p=3;p<expressionPixels.data.length;p+=4)expressionPixels.data[p]=basePixels.data[p];
      headCtx.putImageData(expressionPixels,0,0);
      canvas=createCanvas(...profile.show.faceSheet);canvas.getContext('2d').drawImage(head,0,0);
      // Slots 1..3 intentionally blank. Coverage [0] forbids using them as poses.
    } else canvas=registered(await load(variant==='A'?hatSource:source));
    const path=resourcePath(profile,{slot,pic,variant,sex:'m'});
    entry.assets[variant]=await save(path,canvas);validateShowAsset(profile,entry,entry.assets[variant],{original:true});
  }
  const icon=createCanvas(...profile.icon),ctx=icon.getContext('2d');
  const full=await loadImage(await readFile(resolve(output,(entry.assets.B||entry.assets.main).path)));
  // Icon fit is presentation-only. It cannot be used by the character compositor.
  const crop=slot==='cloth'?[25,190,155,122]:[10,15,200,220];
  if(!empty)ctx.drawImage(full,...crop,0,0,78,78);
  await save(resourcePath(profile,{slot,pic,kind:'icon'}),icon);
  items.push(entry);return entry.id;
}
const defaults={m:{}};
defaults.m.head=await item({number:110900001,slot:'head',pic:'default',label:'ไม่ใส่หมวก',empty:true});
defaults.m.glass=await item({number:210900001,slot:'glass',pic:'default',label:'ไม่ใส่แว่น',empty:true});
defaults.m.eff=await item({number:410900001,slot:'eff',pic:'default',label:'ไม่มีรายละเอียดใบหน้า',empty:true});
for(const [i,id,label] of [['1','eyes-amber','ตาอำพัน · ยิ้ม'],['2','eyes-determined','ตาเขียว · มุ่งมั่น'],['3','eyes-joy','ตาปิด · ยิ้มกว้าง']]) {
  const result=await item({number:610900000+Number(i),slot:'face',pic:`ours_face_${i}`,label,source:`${id}.png`});
  if(i==='1')defaults.m.face=result;
}
for(const [i,id,label] of [['1','hair-chestnut','ผมน้ำตาล'],['2','hair-teal','ผมปัดข้างสีฟ้า'],['3','hair-silver-curls','ผมหยักศกสีเงิน'],['4','hair-ghost-teal','ผมฟ้า · ทดลองหัวล่องหน']]) {
  const result=await item({number:310900000+Number(i),slot:'hair',pic:`ours_hair_${i}`,label,source:`${id}.png`,hatSource:`${id}-under-hat.png`});
  if(i==='1')defaults.m.hair=result;
}
for(const [i,id,label] of [['1','clothing-traveler','ชุดนักเดินทาง'],['2','clothing-knight','ชุดอัศวินฝึกหัด'],['3','clothing-mage','ชุดนักเวทฝึกหัด']]) {
  const result=await item({number:510900000+Number(i),slot:'cloth',pic:`ours_cloth_${i}`,label,source:`${id}.png`});
  if(i==='1')defaults.m.cloth=result;
}
await item({number:410900002,slot:'eff',pic:'ours_eff_1',label:'รอยแผล',source:'face-scar.png'});
await item({number:410900003,slot:'eff',pic:'ours_eff_2',label:'แก้มแดงและกระ',source:'face-blush.png'});
await item({number:110900002,slot:'head',pic:'ours_head_1',label:'หมวกนักเดินทาง',source:'hat-adventurer.png'});
const registration=items.map(i=>({TemplateID:i.templateId,CategoryID:profile.categories[i.slot],NeedSex:1,Pic:i.pic,Name:i.name,Property1:i.hairType,Property8:'1',Level:1}));
const pack={profile:profile.id,version:3,view:authoring.view,template:authoring.template,masterDirectory,authoringDirectory:'assets/ddtank40-three-quarter-v1',authoringSourceHashes:authoring.sourceHashes,contexts:['show'],defaults,items,files,calibration,sourceHashes,
  availability:{show:'Standing frame 0 only for original faces',game:'Not exported: 39 actual battle cells still required',virtual:'Not exported: matched front/back town poses still required',female:'Not authored',flashRegistration:'Registration fields exported; unchanged Flash-client ingestion has not been verified'},
  acceptance:'Revised 3/4-left standing artwork on a shared head/body template. Owner visual acceptance, complete action interchange and original Flash ingestion remain pending.'};
await writeFile(resolve(output,'manifest.json'),JSON.stringify(pack,null,2)+'\n');
await writeFile(resolve(output,'template-registration.json'),JSON.stringify(registration,null,2)+'\n');
console.log(`Exported ${items.length} original items / ${files.length} canonical PNGs to ${output}. Missing poses remain unsupported.`);

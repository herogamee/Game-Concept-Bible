import {createCanvas,loadImage} from '@napi-rs/canvas';
import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {drawRig,directions,wardrobes,graphicFor,type PartManifest} from '../src/game/modular-rig';
const source=resolve('assets/modular'),output=resolve('public/modular');
await mkdir(output,{recursive:true});await mkdir(resolve(output,'parts'),{recursive:true});
const files=['base-parts.png','hair-chestnut.png','hair-silver.png','boots.png','hat.png','shirt-traveler.png','shirt-blue.png','sword.png'];
const images:Record<string,any>={},sources:unknown[]=[];
for(const file of files){const bytes=await readFile(resolve(source,file));images[file]=await loadImage(bytes);sources.push({file,width:images[file].width,height:images[file].height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
await writeFile(resolve(source,'SOURCES.json'),JSON.stringify(sources,null,2)+'\n');
const manifest:PartManifest={};
function part(id:string,file:string,columns:number,rows:number,col:number,row:number){
  const image=images[file],cw=image.width/columns,ch=image.height/rows;
  const canvas=createCanvas(Math.round(cw),Math.round(ch)),ctx=canvas.getContext('2d');
  ctx.drawImage(image,col*cw,row*ch,cw,ch,0,0,canvas.width,canvas.height);
  const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
  let left=canvas.width,right=0,top=canvas.height,bottom=0;
  for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>180){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  if(left>right)throw new Error(`Empty part ${id}`);
  const padding=2;left=Math.max(0,left-padding);top=Math.max(0,top-padding);right=Math.min(canvas.width-1,right+padding);bottom=Math.min(canvas.height-1,bottom+padding);
  manifest[id]={file,rect:{x:Math.round(col*cw)+left,y:Math.round(row*ch)+top,width:right-left+1,height:bottom-top+1}};
}
directions.forEach((dir,index)=>{part(`head.${dir}`,'base-parts.png',4,4,index,0);part(`torso.${dir}`,'base-parts.png',4,4,index,1);});
[['upper-arm',0,2],['forearm',1,2],['hand',2,2],['shorts',1,3],['thigh',2,3],['shin',3,3]].forEach(([id,x,y])=>part(String(id),'base-parts.png',4,4,Number(x),Number(y)));
for(const file of ['hair-chestnut','hair-silver','boots','hat'])directions.forEach((dir,index)=>part(`${file}.${dir}`,`${file}.png`,2,2,index%2,Math.floor(index/2)));
for(const shirt of ['shirt-traveler','shirt-blue'])directions.forEach((dir,index)=>{part(`${shirt}.torso.${dir}`,`${shirt}.png`,4,2,index,0);part(`${shirt}.sleeve.${dir}`,`${shirt}.png`,4,2,index,1);});
part('sword','sword.png',1,1,0,0);
await writeFile(resolve(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
for(const file of files)await copyFile(resolve(source,file),resolve(output,'parts',file));
for(const wardrobe of wardrobes()){
  const canvas=createCanvas(1536,1536),ctx=canvas.getContext('2d');
  for(let row=0;row<8;row++)for(let frame=0;frame<8;frame++){
    ctx.save();ctx.translate(frame*192,row*192);ctx.beginPath();ctx.rect(0,0,192,192);ctx.clip();
    drawRig(ctx,images,manifest,wardrobe,directions[row%4],row<4?'walk':'slash',frame,3);ctx.restore();
  }await writeFile(resolve(output,`${graphicFor(wardrobe)}.png`),canvas.toBuffer('image/png'));
}
const preview=createCanvas(1536,768),ctx=preview.getContext('2d');ctx.fillStyle='#ebe2cd';ctx.fillRect(0,0,1536,768);
for(let row=0;row<4;row++)for(let column=0;column<8;column++){
  ctx.save();ctx.translate(column*192,row*192);drawRig(ctx,images,manifest,wardrobes()[column%16],directions[row],column<4?'idle':'slash',column,3);ctx.restore();
}await writeFile(resolve(output,'contact-sheet.png'),preview.toBuffer('image/png'));
console.log(`Built ${wardrobes().length} wardrobe atlases from ${Object.keys(manifest).length} separate parts.`);

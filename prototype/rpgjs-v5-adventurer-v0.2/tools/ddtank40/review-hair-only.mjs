/** Native hair-only and assembled-head evidence, original art only. */
import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),dir=resolve(root,'assets/ddtank40-three-quarter-v1/layers'),out=resolve(root,'evidence/ddtank40-three-quarter-v1');
if(process.platform==='win32')GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','ProofFont');
const canvas=createCanvas(1350,920),ctx=canvas.getContext('2d');ctx.fillStyle='#f8f5ee';ctx.fillRect(0,0,1350,920);ctx.font='18px ProofFont';ctx.fillStyle='#333';
for(const [col,id] of ['hair-chestnut','hair-teal','hair-silver-curls'].entries()){
 const hair=await loadImage(await readFile(resolve(dir,id+'.png')));
 const portrait=createCanvas(1254,1254),p=portrait.getContext('2d');
 for(const name of ['clothing-traveler','head-template','eyes-amber'])p.drawImage(await loadImage(resolve(dir,name+'.png')),0,0);
 p.drawImage(hair,0,0);
 ctx.fillText(id+' / HAIR ONLY',col*450+12,26);
 ctx.drawImage(hair,280,20,700,600,col*450,45,450,386);
 ctx.fillText('SAME FIXED HEAD / 3/4 LEFT',col*450+12,473);
 ctx.drawImage(portrait,280,20,700,680,col*450,490,450,437);
}
await writeFile(resolve(out,'hair-only-native-review.png'),canvas.toBuffer('image/png'));

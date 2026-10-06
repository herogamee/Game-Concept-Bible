import {createCanvas} from '@napi-rs/canvas';
import {mkdir,writeFile} from 'node:fs/promises';
const dir=new URL('../../assets/ddtank40-cutout-v1/',import.meta.url);await mkdir(dir,{recursive:true});
const c=createCanvas(1536,1536),ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,1536,1536);ctx.font='22px sans-serif';
const labels=['TORSO: NECK, SCARF, VEST, SHORTS','REAR UPPER ARM + SLEEVE','FRONT UPPER ARM + SLEEVE','REAR FOREARM + HAND','FRONT FOREARM + HAND','REAR THIGH: SKIN ONLY','FRONT THIGH: SKIN ONLY','REAR SHIN + WHOLE BOOT','FRONT SHIN + WHOLE BOOT'];
const chains=[[[256,64],[169,171],[184,428],[299,439],[350,171]],[[256,128],[222,224]],[[256,128],[296,234]],[[256,128],[229,207]],[[256,128],[272,214]],[[256,128],[267,191]],[[256,128],[284,209]],[[256,128],[253,211],[224,286]],[[256,128],[270,234],[270,302]]];
for(let i=0;i<9;i++){const x=i%3*512,y=Math.floor(i/3)*512;ctx.save();ctx.translate(x,y);ctx.strokeStyle='#ccc';ctx.lineWidth=1;ctx.strokeRect(0,0,512,512);ctx.fillStyle='#555';ctx.fillText(labels[i],15,30);ctx.strokeStyle='#399fbe';ctx.lineWidth=14;ctx.beginPath();chains[i].forEach((p,j)=>j?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();for(const p of chains[i]){ctx.fillStyle='#ea6285';ctx.beginPath();ctx.arc(...p,12,0,Math.PI*2);ctx.fill();}ctx.restore();}
await writeFile(new URL('part-guide.png',dir),c.toBuffer('image/png'));

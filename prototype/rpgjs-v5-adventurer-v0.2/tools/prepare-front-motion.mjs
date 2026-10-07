import {createCanvas,loadImage} from '@napi-rs/canvas';
import {mkdir,writeFile} from 'node:fs/promises';
const dir='assets/fixed-front-motion-v1'; await mkdir(dir,{recursive:true});
// One template-wide mapping; never calculated from item bounds.
const mapping={scale:.36,x:-33,y:42.52};
const guide=createCanvas(1536,1024),ctx=guide.getContext('2d');
const head=await loadImage('assets/fixed-template-v1/head-template.png');
const body=await loadImage('assets/fixed-template-v1/clothing-traveler.png');
for(let f=0;f<8;f++){
 const x=f%4*384,y=Math.floor(f/4)*512;ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#e9e7df';ctx.fillRect(0,0,384,512);
 for(const image of [body,head])ctx.drawImage(image,mapping.x,mapping.y,1254*mapping.scale,1254*mapping.scale);
 ctx.strokeStyle='#2f96bb';ctx.lineWidth=1;ctx.strokeRect(.5,.5,383,511);
 ctx.beginPath();ctx.moveTo(0,480);ctx.lineTo(384,480);ctx.stroke();
 ctx.fillStyle='#d3314b';ctx.fillRect(187,237,10,2);
 ctx.font='14px sans-serif';ctx.fillStyle='#283937';ctx.fillText(String(f+1),12,24);ctx.restore();
}
await writeFile(`${dir}/placement-guide.png`,guide.toBuffer('image/png'));
const lower=createCanvas(1536,1024),lc=lower.getContext('2d');
for(let f=0;f<8;f++){
 const x=f%4*384,y=Math.floor(f/4)*512;lc.save();lc.beginPath();lc.rect(x,y+238,384,274);lc.clip();lc.drawImage(body,x+mapping.x,y+mapping.y,1254*mapping.scale,1254*mapping.scale);lc.restore();
}
await writeFile(`${dir}/body-only-guide.png`,lower.toBuffer('image/png'));
await writeFile(`${dir}/mapping.json`,JSON.stringify({frame:{width:384,height:512},atlas:{columns:4,rows:2},mapping,neck:[192,238],ground:480},null,2)+'\n');
const sheet=createCanvas(1240,1080),c=sheet.getContext('2d');c.fillStyle='#ecebdc';c.fillRect(0,0,1240,1080);
const eye=await loadImage('assets/fixed-template-v1/eyes-amber.png');
for(const [i,id] of ['hair-chestnut','hair-teal-generated','hair-silver-curls-generated','hat-adventurer-generated'].entries()){
 const composed=createCanvas(1254,1254),s=composed.getContext('2d');for(const image of [head,eye,await loadImage(`assets/fixed-template-v1/${id}.png`)])s.drawImage(image,0,0);
 const x=i%2*620,y=Math.floor(i/2)*540;c.drawImage(composed,320,15,620,540,x,y,620,540);
}
await writeFile(`${dir}/headwear-source-review.png`,sheet.toBuffer('image/png'));

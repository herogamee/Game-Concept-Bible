import {createCanvas,loadImage} from '@napi-rs/canvas';
import {writeFile} from 'node:fs/promises';
const dir='assets/fixed-front-motion-v1';
const body=await loadImage(`${dir}/traveler-body-generated.png`);
const head=createCanvas(384,512),h=head.getContext('2d');
for(const name of ['head-template','eyes-amber','hair-chestnut'])h.drawImage(await loadImage(`assets/fixed-template-v1/${name}.png`),-33,42.52,451.44,451.44);
const review=createCanvas(1536,1024),ctx=review.getContext('2d');ctx.fillStyle='#e6eddd';ctx.fillRect(0,0,1536,1024);
for(let f=0;f<8;f++){
 const x=f%4*384,y=Math.floor(f/4)*512;ctx.drawImage(body,x,y+238,384,274,x,y+238,384,274);ctx.drawImage(head,x,y);
}
await writeFile(`${dir}/assembled-source-review.png`,review.toBuffer('image/png'));
const c=createCanvas(1536,1024);c.getContext('2d').drawImage(body,0,0);const d=c.getContext('2d').getImageData(0,0,1536,1024).data;
console.log('Background alpha samples',[[50,300],[300,400],[30,500],[192,50]].map(([x,y])=>[x,y,d[(y*1536+x)*4+3]]));

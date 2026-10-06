import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile} from 'node:fs/promises';
const images=await Promise.all(['assets/character-master/front-v1.png','assets/character-master/head-hair/bald-edit-master.png'].map(async p=>loadImage(await readFile(p))));
const data=images.map(img=>{const c=createCanvas(img.width,img.height);c.getContext('2d').drawImage(img,0,0);return c.getContext('2d').getImageData(0,0,img.width,img.height).data;});
for(const [name,x0,y0,x1,y1] of [['face',490,400,760,533],['eyes',492,382,760,455],['mouth',570,475,675,515],['body',440,580,815,1200]]){
 const values=[];let identical=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=(y*1254+x)*4;let delta=0;for(let k=0;k<4;k++)delta=Math.max(delta,Math.abs(data[0][i+k]-data[1][i+k]));values.push(delta);if(delta===0)identical++;}
 values.sort((a,b)=>a-b);console.log({name,count:values.length,identical,p50:values[Math.floor(values.length*.5)],p90:values[Math.floor(values.length*.9)],p99:values[Math.floor(values.length*.99)],max:values.at(-1)});
}

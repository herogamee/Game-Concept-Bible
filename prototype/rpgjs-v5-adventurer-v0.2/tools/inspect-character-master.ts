/** Review a complete source character; do not cut or fit independent parts. */
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const path='assets/character-master/front-v1.png',bytes=await readFile(path),source=await loadImage(bytes);
const scan=createCanvas(source.width,source.height),ctx=scan.getContext('2d');ctx.drawImage(source,0,0);
const pixels=ctx.getImageData(0,0,source.width,source.height).data;
let transparent=0,opaque=0,left=source.width,top=source.height,right=-1,bottom=-1;
for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++){
  const alpha=pixels[(y*source.width+x)*4+3];if(alpha===0)transparent++;if(alpha===255)opaque++;
  if(alpha>180){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
}
if(!transparent||right<left)throw new Error('Missing transparent background or visible character.');
const metadata={file:'front-v1.png',width:source.width,height:source.height,
  sha256:createHash('sha256').update(bytes).digest('hex'),fullyTransparentPixels:transparent,fullyOpaquePixels:opaque,
  visibleBoundsAlphaOver180:{left,top,right,bottom},status:'front design candidate; owner review pending; not layered or integrated'};
await writeFile('assets/character-master/front-v1-METADATA.json',JSON.stringify(metadata,null,2)+'\n');
await mkdir('evidence/character-master',{recursive:true});
const preview=createCanvas(700,700),p=preview.getContext('2d');p.fillStyle='#eee9db';p.fillRect(0,0,700,700);
const scale=Math.min(660/source.width,660/source.height);
p.drawImage(source,(700-source.width*scale)/2,(700-source.height*scale)/2,source.width*scale,source.height*scale);
await writeFile('evidence/character-master/front-v1-review.png',preview.toBuffer('image/png'));
console.log(JSON.stringify(metadata));

/** Review the owner-directed blank-head/hair pair, without fitting either file. */
import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const dir=resolve(root,'assets/ddtank40-three-quarter-v1/hair-pair-v1');
const layers=resolve(root,'assets/ddtank40-three-quarter-v1/layers');
const out=resolve(root,'evidence/ddtank40-three-quarter-v1');
await mkdir(out,{recursive:true});
const headBytes=await readFile(resolve(layers,'head-template.png'));
const headHash=createHash('sha256').update(headBytes).digest('hex');
assert.equal(headHash,'b9227919413cabb4dae769f2059134035ce06575614e0fd6869c3f3a39c146b1');
const images={};
for(const [key,path] of [['master',resolve(dir,'blank-head-hair.png')],['hair',resolve(dir,'hair-only.png')],['head',resolve(layers,'head-template.png')]]){
 const im=await loadImage(path);assert.deepEqual([im.width,im.height],[1254,1254]);
 const c=createCanvas(1254,1254);c.getContext('2d').drawImage(im,0,0);
 images[key]={canvas:c,data:c.getContext('2d').getImageData(0,0,1254,1254).data};
}
for(const [x,y] of [[474,493],[635,498],[552,578],[812,520],[600,900]])assert.equal(images.hair.data[(y*1254+x)*4+3],0,`Hair has nontransparent face/ear space at ${x},${y}`);
// Reassemble on the immutable original blank head, never the generated skin.
const assembled=createCanvas(1254,1254),a=assembled.getContext('2d');
a.drawImage(images.head.canvas,0,0);a.drawImage(images.hair.canvas,0,0);
await writeFile(resolve(dir,'reassembled-blank-head.png'),assembled.toBuffer('image/png'));
const blue=(d,i)=>d[i+3]>=128&&d[i+2]>d[i]*1.3&&d[i+1]>d[i]*1.1;
let union=0,intersection=0,masterPixels=0,hairPixels=0,colourError=0;
for(let i=0;i<images.hair.data.length;i+=4){const m=blue(images.master.data,i),h=blue(images.hair.data,i);if(m)masterPixels++;if(h)hairPixels++;if(m||h)union++;if(m&&h){intersection++;for(let k=0;k<3;k++)colourError+=Math.abs(images.master.data[i+k]-images.hair.data[i+k]);}}
if(process.platform==='win32')GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','ProofFont');
const proof=createCanvas(1350,510),p=proof.getContext('2d');p.fillStyle='#f7f5ee';p.fillRect(0,0,1350,510);p.font='18px ProofFont';
for(const [col,label,im] of [[0,'1. BLANK HEAD + HAIR',images.master.canvas],[1,'2. MATCHING HAIR ONLY',images.hair.canvas],[2,'REASSEMBLED ON ORIGINAL HEAD',assembled]]){
 p.fillStyle='#313d31';p.fillText(label,col*450+12,28);
 for(let y=45;y<500;y+=20)for(let x=col*450;x<(col+1)*450;x+=20){p.fillStyle=((Math.floor(y/20)+Math.floor(x/20))%2)?'#eceee7':'#fafbf7';p.fillRect(x,y,20,20);}
 p.drawImage(im,280,20,700,680,col*450,45,450,437);
}
await writeFile(resolve(out,'blank-head-hair-pair-review.png'),proof.toBuffer('image/png'));
const report={canvas:[1254,1254],pair:['blank-head-hair.png','hair-only.png'],tool:'built-in image_gen',headTemplateSha256:headHash,headTemplateUnchanged:true,drawOrigin:[0,0],resizingOrFitting:false,facialFeatures:'No eyes, eyebrows or mouth in either delivered image; visually inspected.',hairAlphaSamplesPass:true,comparison:{method:'Blue-pixel classification at alpha>=128; diagnostic only, not exact segmentation',masterPixels,hairPixels,silhouetteIoU:intersection/union,meanChannelDifference:colourError/(intersection*3),pixelIdentity:false},scope:'Review-only authoring pair. Generated hair-only image redraws some pixels. The generated master does not replace the immutable head; reassembly uses the original head. No new catalog item or production/Flash integration certified. Owner visual acceptance pending.'};
await writeFile(resolve(out,'blank-head-hair-pair-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));

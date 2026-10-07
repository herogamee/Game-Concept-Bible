/** Author registered game layers from a fixed master and a bald underpainting. */
import {createCanvas,loadImage,Path2D,GlobalFonts} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const dir='assets/character-master/head-hair',evidence='evidence/character-master/head-hair';
await mkdir(evidence,{recursive:true});
const master=await loadImage(await readFile('assets/character-master/front-v1.png'));
const bald=await loadImage(await readFile(`${dir}/bald-edit-master.png`));
if(master.width!==bald.width||master.height!==bald.height)throw new Error('Underpainting canvas changed');
const width=master.width,height=master.height;
// A native authoring mask, traced in the canonical master frame. Never fit this
// path or any layer to its alpha bounds. The raster master remains untouched.
const sourceCanvas=createCanvas(width,height),sourceCtx=sourceCanvas.getContext('2d');sourceCtx.drawImage(master,0,0);
const sourceData=sourceCtx.getImageData(0,0,width,height);
// Skin-colour seeds plus enclosed feature holes identify the original face.
// This mask only partitions unchanged source pixels; it does not paint new art.
const count=width*543,skin=new Uint8Array(count);
for(let y=0;y<543;y++)for(let x=0;x<width;x++){
  const p=y*width+x,i=p*4,r=sourceData.data[i],g=sourceData.data[i+1],b=sourceData.data[i+2];
  skin[p]=Number(sourceData.data[i+3]>180&&r>219&&g>135&&b/g>.71);
}
function dilate(input){const out=new Uint8Array(count);for(let y=1;y<542;y++)for(let x=1;x<width-1;x++){const p=y*width+x;out[p]=Number(input[p]||input[p-1]||input[p+1]||input[p-width]||input[p+width]);}return out;}
function erode(input){const out=new Uint8Array(count);for(let y=1;y<542;y++)for(let x=1;x<width-1;x++){const p=y*width+x;out[p]=Number(input[p]&&input[p-1]&&input[p+1]&&input[p-width]&&input[p+width]);}return out;}
let grown=skin;for(let n=0;n<5;n++)grown=dilate(grown);
const outside=new Uint8Array(count),queue=new Int32Array(count);let start=0,end=0;
function visit(p){if(p>=0&&p<count&&!grown[p]&&!outside[p]){outside[p]=1;queue[end++]=p;}}
for(let x=0;x<width;x++){visit(x);visit((542)*width+x);}for(let y=0;y<543;y++){visit(y*width);visit(y*width+width-1);}
while(start<end){const p=queue[start++],x=p%width;if(x>0)visit(p-1);if(x<width-1)visit(p+1);visit(p-width);visit(p+width);}
let faceFilled=outside.map(v=>Number(!v));for(let n=0;n<5;n++)faceFilled=erode(faceFilled);
const supportCanvas=createCanvas(width,height),supportCtx=supportCanvas.getContext('2d');
supportCtx.fillStyle='#fff';supportCtx.fillRect(300,0,650,455);
supportCtx.clearRect(400,399,96,87);supportCtx.clearRect(750,399,100,87);
for(const path of [
 'M 380 388 L 430 388 L 423 404 Q 406 415 380 414 Z',
 'M 806 388 L 852 388 L 854 413 Q 833 415 807 403 Z',
 'M 423 375 L 423 395 Q 439 426 478 446 Q 457 425 465 397 L 479 375 Z',
 'M 803 375 L 803 395 Q 788 422 755 447 Q 772 422 774 395 L 773 375 Z',
 'M 466 480 Q 479 486 491 480 L 495 499 Q 483 512 473 515 Q 480 499 466 480 Z',
 'M 768 481 Q 769 496 777 511 Q 765 513 753 502 L 754 482 Z'])supportCtx.fill(new Path2D(path));
const support=supportCtx.getImageData(0,0,width,height).data;
const hairPixels=new Uint8Array(count);
for(let p=0;p<count;p++)hairPixels[p]=Number(support[p*4+3]>0&&!faceFilled[p]);
function sourcePart(keep){const c=canvas(),data=c.getContext('2d').createImageData(width,height);for(let p=0;p<count;p++)if(keep(p))for(let k=0;k<4;k++)data.data[p*4+k]=sourceData.data[p*4+k];c.getContext('2d').putImageData(data,0,0);return c;}
function canvas(){return createCanvas(width,height);}
const head=canvas(),headCtx=head.getContext('2d');
headCtx.save();headCtx.beginPath();headCtx.rect(0,0,width,543);headCtx.clip();headCtx.drawImage(bald,0,0);headCtx.restore();
let faceInterior=faceFilled;for(let n=0;n<3;n++)faceInterior=erode(faceInterior);
const originalFace=sourcePart(p=>{const x=p%width,y=Math.floor(p/width);return !hairPixels[p]&&faceInterior[p]&&x>=500&&x<=750&&(y>=404||(y>=374&&y<=455&&((x>=502&&x<=575)||(x>=674&&x<=750))));});headCtx.drawImage(originalFace,0,0);
const hair=sourcePart(p=>hairPixels[p]);
const body=canvas(),bodyCtx=body.getContext('2d');
bodyCtx.drawImage(master,0,543,width,height-543,0,543,width,height-543);
for(const [file,c] of [['head-face.png',head],['hair-chestnut.png',hair],['body-traveler.png',body]])await writeFile(`${dir}/${file}`,c.toBuffer('image/png'));
const manifest={version:1,width,height,origin:{x:0,y:0},master:'../front-v1.png',
  layers:[{slot:'body',file:'body-traveler.png'},{slot:'face',file:'head-face.png'},{slot:'hair',file:'hair-chestnut.png'}],
  authoring:{headBodySplitY:543,mask:'skin-seeded enclosed-feature mask plus canonical hair supports; source pixels unchanged'},scope:'one front standing pose, one hairstyle; owner review pending'};
await writeFile(`${dir}/layers.json`,JSON.stringify(manifest,null,2)+'\n');
GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','ReviewFont');
const sheet=createCanvas(1400,740),ctx=sheet.getContext('2d');ctx.fillStyle='#eee8d8';ctx.fillRect(0,0,1400,740);ctx.fillStyle='#2b3127';ctx.font='22px ReviewFont';ctx.textAlign='center';
for(const [i,label,showHair] of [[0,'ต้นแบบเดิม',true],[1,'ประกอบ · ใส่ผม',true],[2,'ประกอบ · ถอดผม',false]]){
  ctx.fillText(label,233+i*466,35);ctx.save();ctx.translate(i*466+20,55);ctx.scale(426/width,426/width);
  if(i===0)ctx.drawImage(master,0,0);else{ctx.drawImage(body,0,0);ctx.drawImage(head,0,0);if(showHair)ctx.drawImage(hair,0,0);}
  ctx.restore();
}
await writeFile(`${evidence}/roundtrip-review.png`,sheet.toBuffer('image/png'));
const close=createCanvas(1500,660),c=close.getContext('2d');c.fillStyle='#eee8d8';c.fillRect(0,0,1500,660);c.fillStyle='#2b3127';c.font='21px ReviewFont';c.textAlign='center';
const composed=canvas();composed.getContext('2d').drawImage(body,0,0);composed.getContext('2d').drawImage(head,0,0);composed.getContext('2d').drawImage(hair,0,0);
await writeFile(`${dir}/assembled.png`,composed.toBuffer('image/png'));
const thumbnail=createCanvas(256,256);thumbnail.getContext('2d').drawImage(composed,0,0,256,256);await writeFile(`${dir}/thumbnail.png`,thumbnail.toBuffer('image/png'));
for(const [i,img,label] of [[0,master,'ต้นแบบเดิม'],[1,composed,'ซ้อนเลเยอร์'],[2,head,'หัว/หน้า · ไม่มีผม']]){c.fillText(label,250+i*500,35);c.drawImage(img,300,0,650,555,i*500+10,65,480,410);}
await writeFile(`${evidence}/head-close-review.png`,close.toBuffer('image/png'));
console.log('Exported canonical-frame head/face, hair and body layers for visual review.');

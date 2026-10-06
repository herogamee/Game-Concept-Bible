/** Native layer authoring for the revised 3/4 standing master. No runtime fit. */
import {createCanvas,loadImage,Path2D} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const dir=resolve(root,'assets/ddtank40-three-quarter-v1'),out=resolve(dir,'layers');
const width=1254,height=1254,splitY=627,count=width*height;
const hashes={},pixelCache=new Map();await mkdir(out,{recursive:true});
async function source(name){if(pixelCache.has(name))return pixelCache.get(name);const bytes=await readFile(resolve(dir,name));hashes[name]=createHash('sha256').update(bytes).digest('hex');const im=await loadImage(bytes);if(im.width!==width||im.height!==height)throw new Error(`Source frame changed: ${name}`);const c=createCanvas(width,height);c.getContext('2d').drawImage(im,0,0);const data=c.getContext('2d').getImageData(0,0,width,height);pixelCache.set(name,data);return data;}
const files=[];
async function save(name,data){const c=createCanvas(width,height);c.getContext('2d').putImageData(data,0,0);await writeFile(resolve(out,name),c.toBuffer('image/png'));files.push(name);return c;}
const blank=await source('blank-head-generated.png'),master=await source('master.png');
const fresh=()=>createCanvas(width,height).getContext('2d').createImageData(width,height);
// The jaw is a curved silhouette; the clothing owns the neck behind it. Keep
// overlap instead of cutting both layers at the same horizontal scanline.
const jawPath='M 0 0 H 1254 V 568 H 750 L 725 586 L 700 601 L 675 612 L 650 617 L 625 623 L 600 628 L 575 631 L 550 629 L 525 623 L 500 615 L 475 603 L 450 580 L 430 558 H 0 Z';
const jawCanvas=createCanvas(width,height),jawCtx=jawCanvas.getContext('2d');jawCtx.fillStyle='#fff';jawCtx.fill(new Path2D(jawPath));const jawMask=jawCtx.getImageData(0,0,width,height).data;
// Keep the complete jaw from the single blank-head template, including below
// y627. Never hide a truncated face by leaving chin pixels in the clothing.
const head=fresh();for(let p=0;p<650*width;p++){const i=p*4;head.data.set(blank.data.subarray(i,i+4),i);head.data[i+3]=Math.round(blank.data[i+3]*jawMask[i+3]/255);}await save('head-template.png',head);
const eyeRegions=[{cx:473,cy:469,rx:51,ry:85},{cx:637,cy:469,rx:92,ry:96},{cx:552,cy:578,rx:55,ry:34}];
const cheekRegions=[{cx:476,cy:575,rx:29,ry:27},{cx:682,cy:567,rx:47,ry:34}];
function weight(x,y,regions){let w=0;for(const r of regions){const d=Math.hypot((x-r.cx)/r.rx,(y-r.cy)/r.ry);w=Math.max(w,Math.max(0,Math.min(1,(1-d)/.15)));}return w;}
async function feature(name,input,regions){const raw=await source(input),data=fresh();for(let y=0;y<splitY;y++)for(let x=0;x<width;x++){const p=(y*width+x)*4,w=weight(x,y,regions);if(!w||head.data[p+3]<240)continue;data.data[p]=raw.data[p];data.data[p+1]=raw.data[p+1];data.data[p+2]=raw.data[p+2];data.data[p+3]=Math.round(w*255);}await save(name,data);}
for(const id of ['eyes-amber','eyes-determined','eyes-joy'])await feature(id+'.png',id==='eyes-amber'?'master.png':id+'-generated.png',eyeRegions);
await feature('face-scar.png','face-scar-generated.png',cheekRegions);
await feature('face-blush.png','face-blush-correction-generated.png',cheekRegions);
// Body-only sources are authored without a head, with a complete neck/collar.
// Copy the PNG byte-for-byte. The old limb patches also produced sleeve seams;
// source limb alignment now needs art review instead of an opaque repair patch.
const headlessClothingSources={
 'clothing-traveler':'clothing-traveler-headless-v2.png',
 'clothing-knight':'clothing-knight-headless-v2.png',
 'clothing-mage':'clothing-mage-headless-v2.png'
};
for(const id of ['clothing-traveler','clothing-knight','clothing-mage']){
 await source(headlessClothingSources[id]);
 await writeFile(resolve(out,id+'.png'),await readFile(resolve(dir,headlessClothingSources[id])));files.push(id+'.png');
}
// Hair is partitioned from blank-faced inputs. The same skin seeds, closure,
// support and protected ear window are used for all three styles. No fitting.
const n=width*splitY;
function morph(input,grow){const output=new Uint8Array(n);for(let y=1;y<splitY-1;y++)for(let x=1;x<width-1;x++){const p=y*width+x;output[p]=Number(grow?(input[p]||input[p-1]||input[p+1]||input[p-width]||input[p+width]):(input[p]&&input[p-1]&&input[p+1]&&input[p-width]&&input[p+width]));}return output;}
function faceFilled(raw){let seed=new Uint8Array(n);for(let p=0;p<n;p++){const i=p*4,r=raw.data[i],g=raw.data[i+1],b=raw.data[i+2];seed[p]=Number(raw.data[i+3]>180&&r>235&&g>160&&r-g>20&&g-b>19&&b/g>.7);}for(let k=0;k<10;k++)seed=morph(seed,true);const outside=new Uint8Array(n),queue=new Int32Array(n);let start=0,end=0;const visit=p=>{if(p>=0&&p<n&&!seed[p]&&!outside[p]){outside[p]=1;queue[end++]=p;}};for(let x=0;x<width;x++){visit(x);visit((splitY-1)*width+x);}for(let y=0;y<splitY;y++){visit(y*width);visit(y*width+width-1);}while(start<end){const p=queue[start++],x=p%width;if(x)visit(p-1);if(x<width-1)visit(p+1);visit(p-width);visit(p+width);}let result=outside.map(v=>Number(!v));for(let k=0;k<10;k++)result=morph(result,false);return result;}
const ear=createCanvas(width,height),ec=ear.getContext('2d');ec.fillStyle='#fff';ec.fill(new Path2D('M 751 463 Q 798 447 839 463 Q 871 505 838 548 Q 800 581 750 559 L 742 530 Z'));const earMask=ec.getImageData(0,0,width,height).data;
const capPath='M 344 326 Q 353 300 403 289 Q 400 228 431 209 Q 519 133 632 139 Q 677 117 718 153 Q 817 178 876 288 Q 920 345 891 407 L 877 439 L 801 403 L 734 371 L 702 348 Q 638 369 577 362 L 430 331 Q 381 375 348 350 Z';
const cap=createCanvas(width,height),cc=cap.getContext('2d');cc.fillStyle='#fff';cc.fill(new Path2D(capPath));const capMask=cc.getImageData(0,0,width,height).data;
const capCoverage=[[300,330],[430,330],[580,363],[700,349],[880,442],[960,470]];
function belowCap(x,y){for(let i=1;i<capCoverage.length;i++){const [a,b]=capCoverage[i-1],[c,d]=capCoverage[i];if(x<=c)return y>=b+(d-b)*(x-a)/(c-a);}return y>=470;}
const hairSources={'hair-chestnut':'master.png','hair-teal':'hair-teal-generated.png','hair-silver-curls':'hair-silver-curls-generated.png'};
for(const id of ['hair-chestnut','hair-teal','hair-silver-curls']){const raw=await source(hairSources[id]),skin=faceFilled(raw),data=fresh(),under=fresh();for(let y=0;y<splitY;y++)for(let x=300;x<960;x++){const p=y*width+x,i=p*4;const support=y<490||(y<550?(x<453||x>730):x>745);if(!support||skin[p]||earMask[i+3]||(y>550&&blank.data[i+3]>0))continue;data.data.set(raw.data.subarray(i,i+4),i);if(!capMask[i+3]&&belowCap(x,y))under.data.set(raw.data.subarray(i,i+4),i);}await save(id+'.png',data);await save(id+'-under-hat.png',under);}
const hatRaw=await source('hat-adventurer-generated.png'),hat=fresh();for(let p=0;p<n;p++){const i=p*4;if(capMask[i+3])hat.data.set(hatRaw.data.subarray(i,i+4),i);}await save('hat-adventurer.png',hat);
// Fit the authored design once, not separate head/body silhouettes. These fixed
// authoring landmarks are reviewed values, never recalculated for an item.
const sourceTopY=56,sourceGroundY=1209,targetTopY=61,targetGroundY=304;
const scale=(targetGroundY-targetTopY)/(sourceGroundY-sourceTopY),neckX=600,targetNeckX=42+(600-421)*124/428;
const matrix=[scale,0,0,scale,targetNeckX-neckX*scale,targetGroundY-sourceGroundY*scale];
const directoryFiles=await readdir(dir);
for(const name of directoryFiles.filter(f=>f.endsWith('.png')))if(!hashes[name])hashes[name]=createHash('sha256').update(await readFile(resolve(dir,name))).digest('hex');
const manifest={version:4,template:'ddtank40-standing-three-quarter-left-v1',view:'three-quarter-left',width,height,splitY,origin:[0,0],eyeRegions,cheekRegions,jawPath,headlessClothingSources,clothingAuthoring:'Complete body-only source PNGs copied byte-for-byte; no head/jaw/collar masks or limb repair patches. Shared canvas/pose registration is fixed; exact anatomical invariance across generated outfits needs art review.',headOverlap:'behind-face',capPath,capCoverage,files,sourceHashes:hashes,
 generation:{tool:'built-in image_gen',prompts:directoryFiles.filter(f=>f.endsWith('-PROMPT.txt')),unusedSources:['hair-chestnut-generated.png','hair-chestnut-compact-generated.png','hair-teal-compact-generated.png','hair-silver-curls-compact-generated.png','eyes-amber-generated.png','face-blush-generated.png','clothing-knight-generated.png','clothing-mage-generated.png'],activeHairSources:hairSources,defaultEyeSource:'master.png',headlessReferenceSources:{'clothing-traveler-headless-v2.png':'master.png','clothing-knight-headless-v2.png':'clothing-knight-generated.png','clothing-mage-headless-v2.png':'clothing-mage-generated.png'},referenceRole:'External DDTank portrait used for camera/proportions only; original identity/costume artwork edited.'},
 calibration:{version:2,mode:'uniform-shared-master',master:[width,height],matrix,origin:[0,0],alphaThreshold:128,sourceTopY,sourceGroundY,targetTopY,targetGroundY,neckSource:[neckX,627],neckTarget:[targetNeckX,627*scale+matrix[5]],note:'One uniform matrix for head, hair, eyes, cheek details, cap and clothing. Preserve authored proportions inside canonical transparent canvases. Authoring landmarks are not Flash anatomical anchors.'},
 scope:'Standing frame0 only. Native category masks and source-specific extraction are a bounded art trial; other views/actions, naked anatomical master, animation and production throughput remain unverified.'};
await writeFile(resolve(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(`Authored ${files.length} registered native layers on one 3/4-left master.`);

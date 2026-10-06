/** Native layer authoring for the revised 3/4 standing master. No runtime fit. */
import {createCanvas,loadImage,Path2D} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {registeredHairOnly,hairOnlyImportMatrix} from './hair-only-import.mjs';
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
// Full hair is authored alone on alpha, never partitioned from a painted head.
// Copy B byte-for-byte. Only the fixed cap-coverage rule derives A from B.
const n=width*splitY;
const capPath='M 344 326 Q 353 300 403 289 Q 400 228 431 209 Q 519 133 632 139 Q 677 117 718 153 Q 817 178 876 288 Q 920 345 891 407 L 877 439 L 801 403 L 734 371 L 702 348 Q 638 369 577 362 L 430 331 Q 381 375 348 350 Z';
const cap=createCanvas(width,height),cc=cap.getContext('2d');cc.fillStyle='#fff';cc.fill(new Path2D(capPath));const capMask=cc.getImageData(0,0,width,height).data;
const capCoverage=[[300,330],[430,330],[580,363],[700,349],[880,442],[960,470]];
function belowCap(x,y){for(let i=1;i<capCoverage.length;i++){const [a,b]=capCoverage[i-1],[c,d]=capCoverage[i];if(x<=c)return y>=b+(d-b)*(x-a)/(c-a);}return y>=470;}
const hairSources={'hair-chestnut':'hair-chestnut-only-v2.png','hair-teal':'hair-teal-only-v2.png','hair-silver-curls':'hair-silver-curls-only-v2.png'};
for(const id of Object.keys(hairSources)){
 // Generation made this source family too large. Import all three with the
 // same declared uniform affine, retaining alpha and every connected lock.
 const bytes=await readFile(resolve(dir,id+'-only-generated-v2.png'));
 await writeFile(resolve(dir,hairSources[id]),await registeredHairOnly(bytes));
 const raw=await source(hairSources[id]),under=fresh();
 await writeFile(resolve(out,id+'.png'),await readFile(resolve(dir,hairSources[id])));files.push(id+'.png');
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=(y*width+x)*4;if(!capMask[i+3]&&belowCap(x,y))under.data.set(raw.data.subarray(i,i+4),i);}
 await save(id+'-under-hat.png',under);
}
const hatRaw=await source('hat-adventurer-generated.png'),hat=fresh();for(let p=0;p<n;p++){const i=p*4;if(capMask[i+3])hat.data.set(hatRaw.data.subarray(i,i+4),i);}await save('hat-adventurer.png',hat);
// Fit the authored design once, not separate head/body silhouettes. These fixed
// authoring landmarks are reviewed values, never recalculated for an item.
const sourceTopY=56,sourceGroundY=1209,targetTopY=61,targetGroundY=304;
const scale=(targetGroundY-targetTopY)/(sourceGroundY-sourceTopY),neckX=600,targetNeckX=42+(600-421)*124/428;
const matrix=[scale,0,0,scale,targetNeckX-neckX*scale,targetGroundY-sourceGroundY*scale];
const directoryFiles=await readdir(dir);
for(const name of directoryFiles.filter(f=>f.endsWith('.png')))if(!hashes[name])hashes[name]=createHash('sha256').update(await readFile(resolve(dir,name))).digest('hex');
const manifest={version:5,template:'ddtank40-standing-three-quarter-left-v1',view:'three-quarter-left',width,height,splitY,origin:[0,0],eyeRegions,cheekRegions,jawPath,headlessClothingSources,clothingAuthoring:'Complete body-only source PNGs copied byte-for-byte; no head/jaw/collar masks or limb repair patches. Shared canvas/pose registration is fixed; exact anatomical invariance across generated outfits needs art review.',headOverlap:'behind-face',capPath,capCoverage,files,sourceHashes:hashes,
 hairOnlySources:hairSources,hairSourceRegistration:{version:1,input:[1254,1254],output:[1254,1254],matrix:hairOnlyImportMatrix,rawSources:Object.fromEntries(Object.keys(hairSources).map(id=>[id,id+'-only-generated-v2.png'])),policy:'All three new hair-only images share one fixed uniform import before the shared full-character export. No trim, face/skin segmentation, ear punches or per-item fitting. Keep every generated alpha contour. Registered full hair copies byte-for-byte into B; only the common cap coverage rule derives A.'},
 generation:{tool:'built-in image_gen',prompts:directoryFiles.filter(f=>f.endsWith('-PROMPT.txt')),unusedSources:['hair-chestnut-generated.png','hair-chestnut-compact-generated.png','hair-teal-generated.png','hair-silver-curls-generated.png','hair-teal-compact-generated.png','hair-silver-curls-compact-generated.png','eyes-amber-generated.png','face-blush-generated.png','clothing-knight-generated.png','clothing-mage-generated.png'],activeHairSources:hairSources,defaultEyeSource:'master.png',headlessReferenceSources:{'clothing-traveler-headless-v2.png':'master.png','clothing-knight-headless-v2.png':'clothing-knight-generated.png','clothing-mage-headless-v2.png':'clothing-mage-generated.png'},hairOnlyReferenceRole:'Rejected hair layers guide design only; blank head guides placement only. New sources contain hair alone, never a rendered head.',referenceRole:'External DDTank portrait used for camera/proportions only; original identity/costume artwork edited.'},
 calibration:{version:2,mode:'uniform-shared-master',master:[width,height],matrix,origin:[0,0],alphaThreshold:128,sourceTopY,sourceGroundY,targetTopY,targetGroundY,neckSource:[neckX,627],neckTarget:[targetNeckX,627*scale+matrix[5]],note:'One uniform matrix for head, hair, eyes, cheek details, cap and clothing. Preserve authored proportions inside canonical transparent canvases. Authoring landmarks are not Flash anatomical anchors.'},
 scope:'Standing frame0 only. Native category masks and source-specific extraction are a bounded art trial; other views/actions, naked anatomical master, animation and production throughput remain unverified.'};
await writeFile(resolve(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(`Authored ${files.length} registered native layers on one 3/4-left master.`);

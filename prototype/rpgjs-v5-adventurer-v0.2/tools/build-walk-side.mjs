/** Export native fixed-grid authoring layers. No per-item fitting or limb rig. */
import {createCanvas,loadImage,Path2D,GlobalFonts} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const dir='assets/walk-side-v1',evidence='evidence/walk-side-v1',width=1536,height=1024,fw=384,fh=512,split=238;
await mkdir(evidence,{recursive:true});
const sources=new Map();for(const file of ['base-corrected.png','face-calm-generated.png','body-blue-registered-generated.png','hair-chestnut-generated.png','hair-silver-generated.png']){
 const im=await loadImage(await readFile(`${dir}/${file}`));if(im.width!==width||im.height!==height)throw new Error(`Canonical grid mismatch: ${file}`);
 const c=createCanvas(width,height);c.getContext('2d').drawImage(im,0,0);sources.set(file,c);
}
const canvas=()=>createCanvas(width,height);
function band(source,head){const c=canvas(),x=c.getContext('2d');for(let frame=0;frame<8;frame++){const ox=(frame%4)*fw,oy=Math.floor(frame/4)*fh,y=head?0:split,h=head?split:fh-split;x.drawImage(source,ox,oy+y,fw,h,ox,oy+y,fw,h);}return c;}
const layers=new Map([
 ['face-amber.png',band(sources.get('base-corrected.png'),true)],['face-calm.png',band(sources.get('face-calm-generated.png'),true)],
 ['body-traveler.png',band(sources.get('base-corrected.png'),false)],['body-blue.png',band(sources.get('body-blue-registered-generated.png'),false)]
]);
// Traced hair support in the canonical cell. Feature/ear exclusions are part of
// the authored mask; they are not estimated from each item's bounding box.
const support=createCanvas(fw,fh),s=support.getContext('2d');s.fillStyle='white';s.fill(new Path2D('M0 0 H384 V115 H288 L290 148 L279 154 L270 122 L254 124 L242 139 L227 145 L216 169 L207 181 L195 162 L177 149 L152 165 L151 193 L178 209 L185 219 H0 Z'));
s.save();s.globalCompositeOperation='destination-out';s.fill(new Path2D('M225 154 Q230 142 245 137 Q260 131 273 141 Q280 160 273 186 Q261 196 248 188 Q235 182 231 173 Z'));s.beginPath();s.ellipse(172,181,24,31,0,0,Math.PI*2);s.fill();s.restore();const allowed=s.getImageData(0,0,fw,fh).data;
for(const [variant,file]of [['chestnut','hair-chestnut-generated.png'],['silver','hair-silver-generated.png']]){
 const out=canvas(),ctx=out.getContext('2d'),source=sources.get(file).getContext('2d');
 for(let frame=0;frame<8;frame++){
  const ox=frame%4*fw,oy=Math.floor(frame/4)*fh,data=source.getImageData(ox,oy,fw,fh),count=fw*fh,seed=new Uint8Array(count),permission=new Uint8Array(count);
  for(let p=0;p<count;p++)permission[p]=Number(allowed[p*4+3]>0);
  const face=sources.get('base-corrected.png').getContext('2d').getImageData(ox,oy,fw,fh).data;
  for(let y=114;y<133;y++)for(let x=238;x<285;x++){const i=(y*fw+x)*4;if(face[i+3]>20&&face[i]<100&&face[i+1]<75&&face[i+2]<55)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)permission[(y+dy)*fw+x+dx]=0;}
  for(let p=0;p<count;p++){const i=p*4,r=data.data[i],g=data.data[i+1],b=data.data[i+2];const hair=variant==='chestnut'?(r<215&&g<155&&r>g*1.06&&g>b*1.04):(g-r<34&&g>=r*.94&&b>=r*.98);seed[p]=Number(permission[p]&&data.data[i+3]>20&&hair);}
  // Keep the crown-connected hair mass, excluding detached brow/face strokes.
  const seen=new Uint8Array(count),componentQueue=new Int32Array(count);let largest=[];
  for(let p=0;p<count;p++)if(seed[p]&&!seen[p]){let first=0,last=1;componentQueue[0]=p;seen[p]=1;const component=[];while(first<last){const n=componentQueue[first++],x=n%fw;component.push(n);for(const k of [x>0?n-1:-1,x<fw-1?n+1:-1,n-fw,n+fw])if(k>=0&&k<count&&seed[k]&&!seen[k]){seen[k]=1;componentQueue[last++]=k;}}if(component.length>largest.length)largest=component;}
  seed.fill(0);for(const p of largest)seed[p]=1;
  // Fill enclosed highlight holes using pixels from this same source image.
  const outside=new Uint8Array(count),queue=new Int32Array(count);let start=0,end=0;
  function visit(p){if(p>=0&&p<count&&!seed[p]&&!outside[p]){outside[p]=1;queue[end++]=p;}}
  for(let x=0;x<fw;x++){visit(x);visit((fh-1)*fw+x);}for(let y=0;y<fh;y++){visit(y*fw);visit(y*fw+fw-1);}
  while(start<end){const p=queue[start++],x=p%fw;if(x>0)visit(p-1);if(x<fw-1)visit(p+1);visit(p-fw);visit(p+fw);}
  for(let p=0;p<count;p++)if(!permission[p]||outside[p])for(let k=0;k<4;k++)data.data[p*4+k]=0;
  ctx.putImageData(data,ox,oy);
 }
 layers.set(`hair-${variant}.png`,out);
}
for(const [file,c]of layers)await writeFile(`${dir}/${file}`,c.toBuffer('image/png'));
const manifest={version:1,atlas:{width,height},frame:{width:fw,height:fh,columns:4,rows:2},clip:{id:'walk-east-v1',action:'walk',direction:'east',count:8,frameMs:100,stridePixels:330},displayScale:.58,groundY:496,
 defaults:{face:'face-amber',hair:'hair-chestnut',body:'body-traveler'},items:[
  {slot:'face',id:'face-amber',file:'face-amber.png',label:'หน้าอำพัน'},{slot:'face',id:'face-calm',file:'face-calm.png',label:'หน้าสงบตาเขียว'},
  {slot:'hair',id:'hair-chestnut',file:'hair-chestnut.png',label:'ผมน้ำตาล'},{slot:'hair',id:'hair-silver',file:'hair-silver.png',label:'ผมเงิน'},
  {slot:'body',id:'body-traveler',file:'body-traveler.png',label:'ชุดน้ำตาล'},{slot:'body',id:'body-blue',file:'body-blue.png',label:'ชุดน้ำเงิน'}
 ].map(item=>({...item,clip:'walk-east-v1'})),authoring:{headBodySplitY:split,hairMask:'canonical spatial support, feature exclusions and source-colour seeds; no fitted offsets'},scope:'One male right-facing walk study. Left is whole-character mirroring. Natural gait/owner art review pending; no combat actions.'};
await writeFile(`${dir}/layers.json`,JSON.stringify(manifest,null,2)+'\n');
GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','WalkReview');
const review=createCanvas(1536,650),r=review.getContext('2d');r.fillStyle='#eef1e8';r.fillRect(0,0,1536,650);r.fillStyle='#2b3127';r.font='19px WalkReview';r.textAlign='center';
let column=0;for(const face of ['face-amber','face-calm'])for(const hair of ['hair-chestnut','hair-silver'])for(const body of ['body-traveler','body-blue']){
 const x=(column%4)*384,y=Math.floor(column/4)*325;r.fillText(`${face==='face-amber'?'อำพัน':'ตาเขียว'} / ${hair==='hair-chestnut'?'ผมน้ำตาล':'ผมเงิน'} / ${body==='body-traveler'?'ชุดน้ำตาล':'ชุดน้ำเงิน'}`,x+192,y+24);
 for(const id of [body,face,hair])r.drawImage(layers.get(`${id}.png`),0,0,fw,fh,x+90,y+36,204,272);column++;
}
await writeFile(`${evidence}/eight-combinations.png`,review.toBuffer('image/png'));
const isolated=createCanvas(fw*3,fh),i=isolated.getContext('2d');i.fillStyle='#eef1e8';i.fillRect(0,0,fw*3,fh);for(const [n,id]of ['face-amber','hair-chestnut','hair-silver'].entries())i.drawImage(layers.get(`${id}.png`),0,0,fw,fh,n*fw,0,fw,fh);await writeFile(`${evidence}/head-hair-source-review.png`,isolated.toBuffer('image/png'));
console.log('Exported six fixed-grid walk layers and eight-combination review. Natural gait acceptance remains pending.');

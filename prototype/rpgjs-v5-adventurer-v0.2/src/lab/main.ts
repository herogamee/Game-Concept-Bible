import './lab.css';
import {labAssets,clipFor,frameAt,customAsset,type LabAsset,type LabClip,type LabAction} from './model';
import {type Facing,facingVector} from '../game/animation';
import {appearanceSlots} from '../game/appearance';
import {sword,slimeDefinition,phaseAt,startSwing,swordCanHit,type Swing} from '../game/rules';
const el=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const select=(id:string)=>el<HTMLSelectElement>(id),input=(id:string)=>el<HTMLInputElement>(id);
const canvas=el<HTMLCanvasElement>('stage'),ctx=canvas.getContext('2d')!;
let asset=labAssets[0],action:LabAction='walk',facing:Facing='south',tab='motion';
let clip=clipFor(asset,action,facing),playing=true,clock=0,clipStart=0,frame=0,last=0,distance=0,lastMeter=0;
let swing:Swing|undefined,enemyHp=slimeDefinition.maxHp,hit=false,battleNotice='Slime พร้อมทดสอบ · HP 3/3';

const images=new Map<string,HTMLImageElement>();
interface Layer {slot:string;image?:HTMLImageElement;filename?:string;x:number;y:number;enabled:boolean;behind:boolean}
const layers:Layer[]=appearanceSlots.filter(s=>s!=='body').map(slot=>({slot,x:0,y:0,enabled:true,behind:false}));
const labels={face:'ใบหน้า',eyes:'ตา',pants:'กางเกง',shoes:'รองเท้า',shirt:'เสื้อ',hair:'ผม',hat:'หมวก',weapon:'อาวุธ'};
const actionLabels={idle:'ยืน',walk:'เดิน',slash:'ฟันดาบ',hurt:'รับความเสียหาย',dead:'ตาย',shoot:'ยิงธนู',thrust:'แทง',spellcast:'ยิงสกิล'};
function message(text:string){el('message').textContent=text;}
function imageAt(url:string):Promise<HTMLImageElement>{return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error(`โหลดภาพไม่สำเร็จ: ${url}`));img.src=url;});}
function url(image:string){return `${import.meta.env.BASE_URL}${image}`;}
async function loadAsset(a:LabAsset){if(!images.has(a.id))images.set(a.id,await imageAt(url(a.sheet.image)));}
function changeClip(resetTiming=true){clip=clipFor(asset,action,facing);clipStart=clock;frame=0;distance=0;swing=undefined;
 if(resetTiming&&clip.available)input('fps').value=String(clip.fps);
 input('scrub').max=String(Math.max(0,clip.frames.length-1));input('scrub').value='0';
 el('asset-status').textContent=clip.message;el('stage-title').textContent=`${asset.name} / ${actionLabels[action]}`;
 const defaultDuration=clip.available?Math.round(clip.durationMs):0;
 el('asset-status').textContent+=clip.available?` · รอบที่เกมตั้ง ${defaultDuration} ms`:'';
 rebuildFilmstrip();updateOutputs();
}
function updateOutputs(){el('fps-value').textContent=`${Number(input('fps').value).toFixed(1)} FPS`;el('speed-value').textContent=input('speed').value;el('zoom-value').textContent=`${input('zoom').value}×`;el('enemy-distance-value').textContent=`${input('enemy-distance').value} หน่วย`;}
function drawFrame(context:CanvasRenderingContext2D,a:LabAsset,img:HTMLImageElement,index:number,c:LabClip,x:number,y:number,zoom:number,opacity=1,layer?:Layer){
 const f=c.frames[index];if(!f)return;const s=a.sheet,scale=(s.displayScale??1)*zoom,w=s.rectWidth*scale,h=s.rectHeight*scale;
 context.save();context.globalAlpha=opacity;context.drawImage(img,f.x,f.y,s.rectWidth,s.rectHeight,x-w*s.anchor[0]+(layer?.x??0)*zoom,y-h*s.anchor[1]+(layer?.y??0)*zoom,w,h);context.restore();
}
function rebuildFilmstrip(){const strip=el('filmstrip');strip.replaceChildren();const img=images.get(asset.id);if(!img)return;
 clip.frames.forEach((_,index)=>{const button=document.createElement('button');button.setAttribute('aria-label',`ตรวจเฟรม ${index+1}`);button.dataset.frame=String(index);
 const c=document.createElement('canvas');c.width=144;c.height=144;const g=c.getContext('2d')!;g.imageSmoothingEnabled=!input('sampling').checked;
 drawFrame(g,asset,img,index,clip,72,82,1.8);const label=document.createElement('span');label.textContent=`${String(index+1).padStart(2,'0')} · ${Math.round(clip.frames[index].atMs)} ms`;button.append(c,label);button.onclick=()=>seek(index);strip.append(button);});
}
function seek(index:number){if(!clip.available)return;playing=false;frame=Math.max(0,Math.min(index,clip.frames.length-1));clipStart=clock-(clip.frames[frame]?.atMs??0)*clip.fps/Number(input('fps').value);swing=undefined;setPlayLabel();draw();}
function setPlayLabel(){el('play').textContent=playing?'หยุดชั่วคราว':'เล่นแอนิเมชัน';}
function beginSwing(){if(asset.id!=='chibi'&&asset.id!=='painted'&&asset.id!=='painted-hd'&&asset.id!=='modular'){message('เลือกตัวละครนักผจญภัยเพื่อทดสอบดาบ');return;}
 const next=startSwing(swing,clock,facing);if(!next)return;swing=next;hit=false;action='slash';select('action').value=action;clip=clipFor(asset,action,facing);input('fps').value=String(clip.fps);clipStart=clock;playing=true;el('stage-title').textContent=asset.name+' / '+actionLabels[action];el('asset-status').textContent=clip.message;rebuildFilmstrip();setPlayLabel();updateOutputs();battleNotice='เริ่มเหวี่ยงดาบ';}
function download(name:string,data:Blob){const anchor=document.createElement('a'),href=URL.createObjectURL(data);anchor.href=href;anchor.download=name;anchor.click();setTimeout(()=>URL.revokeObjectURL(href),1500);}
function draw(){const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1),w=rect.width,h=rect.height;
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.fillStyle='#152925';ctx.fillRect(0,0,w,h);ctx.imageSmoothingEnabled=!input('sampling').checked;
 const zoom=Number(input('zoom').value),x=w*.5,y=h*.48,vec=facingVector[facing];
 const slide=action==='walk'&&select('travel').value==='treadmill'?distance*zoom:0,spacing=32*zoom;
 ctx.strokeStyle='#26433a';ctx.lineWidth=1;ctx.beginPath();for(let gx=((-slide*vec.x)%spacing+spacing)%spacing;gx<w;gx+=spacing){ctx.moveTo(gx,0);ctx.lineTo(gx,h);}for(let gy=((-slide*vec.y)%spacing+spacing)%spacing;gy<h;gy+=spacing){ctx.moveTo(0,gy);ctx.lineTo(w,gy);}ctx.stroke();
 if(!clip.available){ctx.fillStyle='#c6d9c8';ctx.font='16px Tahoma';ctx.textAlign='center';ctx.fillText('ยังไม่มีชุดภาพสำหรับท่านี้',w/2,h/2);ctx.font='12px Tahoma';ctx.fillText('Lab จะไม่แสดงภาพท่าอื่นแทน',w/2,h/2+30);updateMetrics();return;}
 const img=images.get(asset.id);if(!img)return;
 if(tab==='combat'){
  const r=sword.range*zoom,angle=Math.atan2(vec.y,vec.x),arc=sword.arcDegrees*Math.PI/180;
  ctx.fillStyle=phaseAt(swing,clock)==='attack_active'?'#c9dd6430':'#87b5a018';ctx.strokeStyle='#6f9887';ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,angle-arc/2,angle+arc/2);ctx.closePath();ctx.fill();ctx.stroke();
  const ex=x+vec.x*Number(input('enemy-distance').value)*zoom,ey=y+vec.y*Number(input('enemy-distance').value)*zoom;
  const slime=labAssets.find(a=>a.id==='slime')!,slimeImg=images.get('slime');const slimeClip=clipFor(slime,enemyHp<=0?'dead':hit?'hurt':'idle',facing);
  if(slimeImg)drawFrame(ctx,slime,slimeImg,frameAt(slimeClip,clock),slimeClip,ex,ey,zoom);
  ctx.fillStyle='#d5e3d3';ctx.font='12px Tahoma';ctx.textAlign='center';ctx.fillText(`Slime ${enemyHp}/${slimeDefinition.maxHp}`,ex,Math.max(20,ey-40*zoom));
 }
 if(input('onion').checked&&clip.frames.length>1){drawFrame(ctx,asset,img,(frame-1+clip.frames.length)%clip.frames.length,clip,x,y,zoom,.17);drawFrame(ctx,asset,img,(frame+1)%clip.frames.length,clip,x,y,zoom,.17);}
 for(const l of layers.filter(l=>l.image&&l.enabled&&l.behind))drawFrame(ctx,asset,l.image!,frame,clip,x,y,zoom,1,l);
 drawFrame(ctx,asset,img,frame,clip,x,y,zoom);
 for(const l of layers.filter(l=>l.image&&l.enabled&&!l.behind))drawFrame(ctx,asset,l.image!,frame,clip,x,y,zoom,1,l);
 if(input('bounds').checked){const s=asset.sheet,scale=(s.displayScale??1)*zoom,bw=s.rectWidth*scale,bh=s.rectHeight*scale;ctx.strokeStyle='#789b8240';ctx.setLineDash([5,5]);ctx.strokeRect(x-bw*s.anchor[0],y-bh*s.anchor[1],bw,bh);ctx.setLineDash([]);ctx.strokeStyle='#77c3ca';ctx.beginPath();ctx.moveTo(x-8,y);ctx.lineTo(x+8,y);ctx.moveTo(x,y-8);ctx.lineTo(x,y+8);ctx.stroke();}
 if(input('feet').checked){const sy=asset.foot?(asset.foot-asset.sheet.rectHeight*asset.sheet.anchor[1])*asset.sheet.displayScale:16;ctx.strokeStyle='#c6df75';ctx.beginPath();ctx.moveTo(x-95,y+sy*zoom);ctx.lineTo(x+95,y+sy*zoom);ctx.stroke();ctx.fillStyle='#bad487';ctx.font='10px monospace';ctx.textAlign='left';ctx.fillText('FOOT BASELINE',x+101,y+sy*zoom+4);}
 updateMetrics();
}
function updateMetrics(){input('scrub').value=String(frame);el('frame-badge').textContent=clip.available?`FRAME ${String(frame+1).padStart(2,'0')} / ${String(clip.frames.length).padStart(2,'0')}`:'NO CLIP';
 el('filmstrip').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('current',i===frame));
 if(clock-lastMeter<120&&playing)return;lastMeter=clock;
 const duration=clip.durationMs*clip.fps/Number(input('fps').value),stride=Number(input('speed').value)*duration/1000;
 const phase=tab==='combat'?phaseAt(swing,clock):action;
 const metrics=[['รอบแอนิเมชัน',clip.available?`${Math.round(duration)} ms`:'ไม่มี asset'],['ระยะต่อรอบเดิน',action==='walk'?`${stride.toFixed(1)} u`:'—'],['กรอบโลก / texture',`${asset.sheet.rectWidth*(asset.sheet.displayScale??1)} u / ${asset.sheet.rectWidth}px`],['Phase',phase]];
 el('metrics').replaceChildren(...metrics.map(([title,value])=>{const div=document.createElement('div');div.className='metric';const span=document.createElement('span');span.textContent=title;const strong=document.createElement('strong');strong.textContent=value;div.append(span,strong);return div;}));
 if(tab==='combat')el('combat-status').textContent=`${battleNotice} · ${phase} · ดาเมจทดสอบ 1/ครั้ง · เกมจริงใช้ ATK ของผู้เล่น`;
}
function tick(now:number){const dt=Math.min(50,Math.max(0,now-last||0));last=now;
 if(playing&&tab!=='live'){clock+=dt*Number(select('rate').value);if(action==='walk')distance+=Number(input('speed').value)*dt/1000*Number(select('rate').value);
  frame=frameAt(clip,clock-clipStart,Number(input('fps').value));
  if(swing&&tab==='combat'){
   const v=facingVector[facing],range=Number(input('enemy-distance').value);
   if(swordCanHit(swing,clock,'lab-slime',enemyHp,{x:0,y:0},{x:v.x*range,y:v.y*range})){swing.hits.add('lab-slime');enemyHp=Math.max(0,enemyHp-1);hit=true;battleNotice=enemyHp?'โดน Slime −1 HP':'Slime ตาย';}
   if(clock-swing.startedAt>clip.durationMs){swing=undefined;hit=false;action='idle';select('action').value='idle';changeClip();}
  }
 }
 if(tab!=='live')draw();requestAnimationFrame(tick);
}
function selectTab(next:string){tab=next;document.querySelector('main')!.classList.toggle('live-mode',next==='live');document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===next)));
 el('layers-panel').hidden=next!=='appearance';el('combat-panel').hidden=next!=='combat';el('preview').hidden=next==='live';el('live-panel').hidden=next!=='live';el('controls').hidden=next==='live';
 const iframe=el<HTMLIFrameElement>('live-game');if(next==='live'&&!iframe.getAttribute('src'))iframe.src=`${import.meta.env.BASE_URL}?characterLab=1`;
 if(next!=='live'&&iframe.getAttribute('src')){iframe.removeAttribute('src');iframe.src='about:blank';iframe.removeAttribute('src');}
}
function setupLayers(){const host=el('layers');for(const l of layers){const row=document.createElement('div');row.className='layer';row.innerHTML=`<b>${labels[l.slot]}</b><input type="file" accept="image/png" aria-label="ภาพ ${labels[l.slot]}"><small>ยังไม่มีชิ้นส่วน</small><div class="layer-grid"><label>X<input type="number" value="0" aria-label="${labels[l.slot]} X"></label><label>Y<input type="number" value="0" aria-label="${labels[l.slot]} Y"></label></div><label><input type="checkbox" checked> แสดง</label><label><input type="checkbox"> อยู่หลังตัว</label><button>ล้างชิ้นนี้</button>`;
 const file=row.querySelector<HTMLInputElement>('input[type=file]')!,status=row.querySelector('small')!,fields=row.querySelectorAll<HTMLInputElement>('input[type=number]'),checks=row.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
 file.onchange=async()=>{const selected=file.files?.[0];if(!selected)return;const objectUrl=URL.createObjectURL(selected);try{const image=await imageAt(objectUrl);if(image.width!==asset.sheet.width||image.height!==asset.sheet.height)throw new Error(`ต้องเป็น ${asset.sheet.width}×${asset.sheet.height} และกริดเดียวกัน`);l.image=image;l.filename=selected.name;status.textContent=`${selected.name} · ใช้ใน Lab`;message('เพิ่มชิ้นส่วนสำหรับตรวจแล้ว');}catch(e){status.textContent=String((e as Error).message);}finally{URL.revokeObjectURL(objectUrl);}};
 fields.forEach((f,i)=>f.oninput=()=>{l[i?'y':'x']=Number(f.value)||0;});checks[0].onchange=()=>{l.enabled=checks[0].checked;};checks[1].onchange=()=>{l.behind=checks[1].checked;};row.querySelector('button')!.onclick=()=>{l.image=undefined;l.filename=undefined;file.value='';status.textContent='ยังไม่มีชิ้นส่วน';};host.append(row);
 }}
async function init(){
 try{await Promise.all([loadAsset(asset),loadAsset(labAssets.find(a=>a.id==='slime')!)]);}catch(e){message(String(e));return;}
 select('asset').onchange=async()=>{const next=labAssets.find(a=>a.id===select('asset').value)!;try{await loadAsset(next);if(select('asset').value!==next.id)return;asset=next;for(const l of layers){l.image=undefined;l.filename=undefined;}el('layers').replaceChildren();setupLayers();changeClip();}catch(e){message(String(e));}};
 select('action').onchange=()=>{action=select('action').value as LabAction;changeClip();};
 document.querySelectorAll<HTMLButtonElement>('[data-facing]').forEach(b=>b.onclick=()=>{facing=b.dataset.facing as Facing;document.querySelectorAll<HTMLButtonElement>('[data-facing]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));changeClip(false);});
 document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(b=>b.onclick=()=>selectTab(b.dataset.tab!));
 el('import-custom').onclick=async()=>{
  const file=input('custom-image').files?.[0];if(!file){el('custom-status').textContent='เลือก PNG ก่อน';return;}
  const objectUrl=URL.createObjectURL(file);
  try{const image=await imageAt(objectUrl),config=JSON.parse(el<HTMLTextAreaElement>('custom-manifest').value),imported=customAsset(config,image.width,image.height);
   const previous=labAssets.findIndex(a=>a.id==='custom');if(previous>=0)labAssets.splice(previous,1);labAssets.push(imported);images.set('custom',image);asset=imported;
   if(!select('asset').querySelector('option[value=custom]')){const option=document.createElement('option');option.value='custom';option.textContent='ชุดภาพนำเข้า · Lab';select('asset').append(option);}select('asset').value='custom';
   action=imported.supported[0];select('action').value=action;for(const l of layers){l.image=undefined;l.filename=undefined;}el('layers').replaceChildren();setupLayers();changeClip();el('custom-status').textContent=`เปิด ${file.name} แล้ว · ${image.width}×${image.height}`;
  }catch(e){el('custom-status').textContent=(e as Error).message;}finally{URL.revokeObjectURL(objectUrl);}
 };
 ['fps','speed','zoom','enemy-distance'].forEach(id=>input(id).oninput=()=>{updateOutputs();draw();});
 input('sampling').onchange=rebuildFilmstrip;el('play').onclick=()=>{playing=!playing;setPlayLabel();};el('prev').onclick=()=>seek((frame-1+clip.frames.length)%clip.frames.length);el('next').onclick=()=>seek((frame+1)%clip.frames.length);input('scrub').oninput=()=>seek(Number(input('scrub').value));el('timing-reset').onclick=()=>changeClip();el('swing').onclick=beginSwing;
 el('respawn').onclick=()=>{enemyHp=slimeDefinition.maxHp;hit=false;swing=undefined;battleNotice='Slime พร้อมทดสอบ';};
 el('reload-live').onclick=()=>{el<HTMLIFrameElement>('live-game').src=`${import.meta.env.BASE_URL}?characterLab=1`;};
 el('capture').onclick=()=>canvas.toBlob(blob=>{if(blob)download(`character-${asset.id}-${action}-${facing}-frame${frame+1}.png`,blob);});
 const notes=el<HTMLTextAreaElement>('notes');try{notes.value=localStorage.getItem('willowbrook-character-lab-notes')??'';}catch{}
 notes.oninput=()=>{try{localStorage.setItem('willowbrook-character-lab-notes',notes.value);}catch{}};
 el('export').onclick=()=>{const report={version:1,date:new Date().toISOString(),asset:asset.id,image:asset.sheet.image,action,facing,frame:frame+1,previewFps:Number(input('fps').value),engineFps:clip.fps,engineDurationMs:clip.durationMs,walkSpeed:Number(input('speed').value),timeScale:Number(select('rate').value),zoom:Number(input('zoom').value),tab,layers:layers.map(({image,...l})=>l),notes:notes.value,scope:'Image inspection; actual game behavior is tested in the separate-save runtime tab.'};download('character-lab-review.json',new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));message('ดาวน์โหลดผลตรวจแล้ว');};
 document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement).tagName)||tab==='live')return;if(e.code==='Space'){e.preventDefault();playing=!playing;setPlayLabel();}if(e.key==='ArrowRight'){e.preventDefault();seek((frame+1)%clip.frames.length);}if(e.key==='ArrowLeft'){e.preventDefault();seek((frame-1+clip.frames.length)%clip.frames.length);}if(e.key.toLowerCase()==='z'&&tab==='combat')beginSwing();});
 setupLayers();changeClip();requestAnimationFrame(tick);
}
void init();

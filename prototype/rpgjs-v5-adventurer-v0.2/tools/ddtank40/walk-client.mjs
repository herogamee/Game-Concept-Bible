import {showPlan} from './format.mjs';
import {GaitSession} from './walk-rig.mjs';
const $=id=>document.getElementById(id),stage=$('walk-stage'),ctx=stage.getContext('2d'),strip=$('walk-strip'),stripCtx=strip.getContext('2d'),status=$('walk-status');
const session=new GaitSession({frames:8,frameMs:90,speed:48}),keys=new Set(),textures=new Map();
let pack,profile,catalog,plan,ready=false,loading=0,last=0,error='',command=0;
const selected={hair:'ours-310900001',cloth:'ours-510900001',face:'ours-610900001',head:'ours-110900001'};
async function texture(url){if(!textures.has(url))textures.set(url,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('โหลดชิ้นส่วนไม่สำเร็จ'));im.src=url}));return textures.get(url);}
async function equip(){
  const generation=++loading,next=showPlan(profile,catalog,{base:'ours',selected:{...selected}}),item=pack.items.find(i=>i.id===next.equipment.cloth);
  if(!item)throw new Error('ชุดนี้ยังไม่มีท่าเดิน');
  const imgs=await Promise.all(next.layers.map(l=>l.slot==='cloth'?null:texture(l.url))),sheet=await texture(item.url);
  if(generation!==loading)return;
  plan={...next,layers:next.layers.map((l,i)=>({...l,image:imgs[i]})),sheet};ready=true;
  stage.dataset.equipment=JSON.stringify(plan.equipment);stage.dataset.hairVariant=plan.hairVariant;
  stage.dataset.motionSource=pack.id;stage.dataset.motionUrl=item.url;
  for(let frame=0;frame<pack.frames;frame++){stripCtx.save();stripCtx.translate(frame*250,0);stripCtx.clearRect(0,0,250,342);drawCharacter(stripCtx,frame,1);stripCtx.restore();}
}
function drawCharacter(context,frame,blend){
  const head=pack.sourceFrames[frame].headOffset;
  for(const layer of plan.layers){const s=layer.source;
    if(layer.slot==='cloth'){
      if(blend<1){context.globalAlpha=1-blend;context.drawImage(plan.sheet,0,0,250,342,0,0,250,342);}
      if(blend>0){context.globalAlpha=blend;context.drawImage(plan.sheet,frame*250,0,250,342,0,0,250,342);}
      context.globalAlpha=1;
    }else context.drawImage(layer.image,s.x,s.y,s.width,s.height,head[0],head[1],s.width,s.height);
  }
}
function render(now){
  const dt=last?now-last:0;last=now;const axis=(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0)||command;
  session.tick(dt,axis);ctx.clearRect(0,0,960,440);
  const bg=ctx.createLinearGradient(0,0,0,440);bg.addColorStop(0,'#e1e9d7');bg.addColorStop(.79,'#f1edda');bg.addColorStop(1,'#c9d6b5');ctx.fillStyle=bg;ctx.fillRect(0,0,960,440);
  ctx.strokeStyle='#9aa88c';ctx.beginPath();ctx.moveTo(0,364);ctx.lineTo(960,364);ctx.stroke();
  for(let x=0;x<960;x+=80){ctx.fillStyle='#aebc9e';ctx.fillRect(x,391,31,2);}
  if(session.destination!==null){ctx.strokeStyle='#66895c';ctx.beginPath();ctx.ellipse(session.destination,365,14,4,0,0,Math.PI*2);ctx.stroke();}
  if(ready){
    ctx.fillStyle='#354b3030';ctx.beginPath();ctx.ellipse(session.x,364,44,5,0,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.translate(session.x,64);ctx.scale(session.direction===1?-1:1,1);ctx.translate(-96,0);drawCharacter(ctx,session.frame,session.blend);ctx.restore();
    stage.dataset.frame=String(session.frame);stage.dataset.x=session.x.toFixed(2);stage.dataset.direction=String(session.direction);stage.dataset.phase=String(session.phaseMs);stage.dataset.state=session.paused?'paused':session.blend>0?'walk':'stand';
    $('walk-frame').value=session.frame;$('walk-frame-label').textContent=`${session.frame} / ${pack.frames-1}`;
    status.textContent=error||`${session.paused?'พักภาพ':session.blend>0?'กำลังเดิน':'ยืน'} · ${session.direction<0?'หันซ้าย':'หันขวา'} · ${$('walk-cloth').selectedOptions[0].textContent} · ${$('walk-hair').selectedOptions[0].textContent}`;
  }
  requestAnimationFrame(render);
}
for(const slot of ['hair','cloth','face','head'])$('walk-'+slot).addEventListener('change',async event=>{selected[slot]=event.target.value;try{await equip();error='';}catch(e){error=e.message;}});
function resume(){session.paused=false;$('walk-pause').textContent='พักภาพ';}
function stop(){command=0;keys.clear();session.destination=null;session.preview=false;$('walk-preview').checked=false;resume();}
function walk(axis){resume();session.preview=false;$('walk-preview').checked=false;session.destination=null;command=axis;}
$('walk-left').onclick=()=>walk(-1);$('walk-right').onclick=()=>walk(1);$('walk-stop').onclick=stop;
$('walk-preview').onchange=e=>{command=0;session.destination=null;session.preview=e.target.checked;resume();};
$('walk-rate').oninput=e=>session.rate=Number(e.target.value);
$('walk-pause').onclick=()=>{session.paused=!session.paused;$('walk-pause').textContent=session.paused?'เล่นต่อ':'พักภาพ';};
$('walk-step').onclick=()=>{session.step();$('walk-pause').textContent='เล่นต่อ';};
$('walk-frame').oninput=e=>{session.paused=true;session.blend=1;session.phaseMs=Number(e.target.value)*session.frameMs;$('walk-pause').textContent='เล่นต่อ';};
stage.onclick=e=>{const box=stage.getBoundingClientRect();command=0;session.preview=false;$('walk-preview').checked=false;session.destination=Math.max(100,Math.min(860,(e.clientX-box.left)*960/box.width));resume();stage.focus();};
window.addEventListener('keydown',e=>{if(e.target.closest('select,input,button'))return;const key=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowLeft','ArrowRight','a','d'].includes(key)){e.preventDefault();keys.add(key);command=0;session.destination=null;resume();}});
window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));
window.addEventListener('blur',stop);document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden)stop();});
try{[profile,catalog,pack]=await Promise.all(['/api/ddt40-profile','/api/ddt40-catalog','/ddt40/keyframe-walk8/manifest.json'].map(async u=>{const r=await fetch(u);if(!r.ok)throw new Error('โหลดข้อมูลไม่สำเร็จ');return r.json()}));session.frames=pack.frames;session.frameMs=pack.frameMs;session.speed=pack.speed;strip.width=pack.frames*pack.width;strip.style.width=strip.width+'px';$('walk-frame').max=pack.frames-1;await equip();requestAnimationFrame(render);}catch(e){status.textContent=e.message;status.className='error';}

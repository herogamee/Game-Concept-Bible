const $=id=>document.getElementById(id),slots=['cloth','hair','face','eff','head'];
const storageKey='DDTank-template-modular-walk-v1';
try{
const lr=await fetch('character-standard-lock.json',{cache:'no-store'});if(!lr.ok)throw Error('ไม่พบมาตรฐานตัวละคร v1');const lock=await lr.json();
async function sha256(bytes){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('')}
const r=await fetch('modular-catalog.json',{cache:'no-store'});if(!r.ok)throw Error('โหลดคลังไม่ได้');const bytes=await r.arrayBuffer();if(await sha256(bytes)!==lock.catalog_sha256)throw Error('คลังถูกแก้จากมาตรฐานที่ล็อกไว้ v1');const catalog=JSON.parse(new TextDecoder().decode(bytes)),images=new Map();
async function image(asset){if(!asset)return;const expected=lock.assets[asset.path];if(!expected)throw Error('ไฟล์อยู่นอกมาตรฐาน v1 '+asset.path);const response=await fetch(asset.path);if(!response.ok)throw Error('โหลดภาพไม่ได้ '+asset.path);const data=await response.arrayBuffer();if(await sha256(data)!==expected.sha256)throw Error('ภาพถูกแก้จากมาตรฐาน v1 '+asset.path);const im=new Image(),url=URL.createObjectURL(new Blob([data],{type:'image/png'}));try{im.src=url;await im.decode()}finally{URL.revokeObjectURL(url)}if(im.width!==asset.width||im.height!==asset.height||im.width!==expected.width||im.height!==expected.height)throw Error('ขนาดภาพไม่ตรงคลัง '+asset.path);images.set(asset.path,im)}
await Promise.all([image(catalog.base_head),image(catalog.blink.closed_asset),...slots.flatMap(slot=>catalog[slot].flatMap(item=>[image(item.asset),image(item.under_hat)]))]);
let saved={};try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{}
const selected={};
for(const slot of slots){const select=$(slot);select.add(new Option(slot==='eff'||slot==='head'?'ไม่ใส่':'ค่าเริ่มต้น',''));for(const item of catalog[slot])select.add(new Option(item.label,item.id));selected[slot]=catalog[slot].some(item=>item.id===saved[slot])?saved[slot]:'';select.value=selected[slot]}
let frame=0,playing=true,clock=0,last=performance.now(),mixGallery=false;
// Facial animation uses real elapsed time, independently of the walk frame clock.
let blinkRemaining=0,blinkWait=nextBlinkWait(),blinkCount=0;
function nextBlinkWait(){const [min,max]=catalog.blink.interval_seconds;return min+Math.random()*(max-min)}
function beginBlink(){blinkRemaining=catalog.blink.closed_seconds;blinkCount++;blinkWait=nextBlinkWait()}
function eyeState(appearance=selected){if(item('face',appearance).already_closed)return 'closed';const preview=$('eye-preview').value;return preview==='auto'?(blinkRemaining>0?'closed':'open'):preview}
const gallery=[],partViews=[];
for(let i=0;i<8;i++){const button=document.createElement('button');button.className='frame';button.setAttribute('aria-label','ดูเฟรม '+(i+1));const canvas=document.createElement('canvas');canvas.width=250;canvas.height=342;const caption=document.createElement('span');button.append(canvas,caption);$('gallery').append(button);gallery.push({button,canvas,caption});button.onclick=()=>{if(mixGallery){const a=combination(i);for(const slot of slots){selected[slot]=a[slot]||'';$(slot).value=selected[slot]}persist();mixGallery=false}else{frame=i;playing=false;clock=0}render()}}
for(const [slot,label]of [['cloth','เสื้อผ้า'],['base_head','หัวมาตรฐาน'],['face','ชุดดวงตา'],['eff','ใบหน้า'],['hair','ผม'],['head','หมวก']]){const a=document.createElement('a');a.target='_blank';const canvas=document.createElement('canvas');canvas.width=250;canvas.height=342;const caption=document.createElement('span');caption.textContent=label;a.append(canvas,caption);$('parts').append(a);partViews.push({slot,a,canvas,label})}
function persist(){localStorage.setItem(storageKey,JSON.stringify(selected))}
function item(slot,appearance=selected){const id=appearance[slot]||catalog.defaults[slot];return catalog[slot].find(x=>x.id===id)}
function asset(slot,appearance=selected){if(slot==='base_head')return catalog.base_head;const found=item(slot,appearance);if(!found)return null;if(slot==='hair'&&item('head',appearance))return found.under_hat||found.asset;return found.asset}
function drawClosedEyes(ctx){
const scale=catalog.head_scale,[sx,sy]=catalog.head_source_anchor,[tx,ty]=catalog.head_anchor;
ctx.save();ctx.beginPath();
for(const region of catalog.blink.source_eye_regions){region.forEach(([x,y],i)=>{const px=tx+(x-sx)*scale,py=ty+(y-sy)*scale;i?ctx.lineTo(px,py):ctx.moveTo(px,py)});ctx.closePath()}
ctx.clip();ctx.drawImage(images.get(catalog.blink.closed_asset.path),0,0);ctx.restore();
}
function layer(ctx,slot,f,appearance=selected){const a=asset(slot,appearance);if(!a)return;const im=images.get(a.path);if(slot==='cloth')ctx.drawImage(im,f*250,0,250,342,0,0,250,342);else ctx.drawImage(im,0,0);if(slot==='face'&&!item('face',appearance).already_closed&&eyeState(appearance)==='closed')drawClosedEyes(ctx)}
function compose(ctx,f,appearance=selected,only=null){for(const slot of catalog.layer_order)if((!only||only===slot)&&(only||$('show-'+slot).checked))layer(ctx,slot,f,appearance)}
function draw(canvas,f,appearance=selected){const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#e2e9d8';ctx.fillRect(0,0,canvas.width,canvas.height);const scale=Math.min(canvas.width/250,canvas.height/342)*.97;ctx.save();ctx.translate((canvas.width-250*scale)/2,(canvas.height-342*scale)/2);ctx.scale(scale,scale);compose(ctx,f,appearance);ctx.restore()}
function combination(i){return {cloth:catalog.cloth[(i>>2)&1].id,hair:catalog.hair[(i>>1)&1].id,face:catalog.face[i&1].id,eff:'',head:''}}
function render(){draw($('hero'),frame);for(let i=0;i<8;i++){const g=gallery[i],f=mixGallery?frame:i;draw(g.canvas,f,mixGallery?combination(i):selected);g.button.classList.toggle('active',!mixGallery&&i===frame);g.button.setAttribute('aria-label',mixGallery?'เลือกแบบผสม '+(i+1):'ดูเฟรม '+(i+1));g.caption.textContent=mixGallery?[item('cloth',combination(i)).label,item('hair',combination(i)).label,item('face',combination(i)).label].join(' · '):'เฟรม '+(i+1)}
for(const p of partViews){const ctx=p.canvas.getContext('2d');ctx.clearRect(0,0,250,342);compose(ctx,frame,selected,p.slot);const a=asset(p.slot);p.a.href=a?a.path:'#';p.a.setAttribute('aria-label','เปิดไฟล์ '+p.label);p.a.dataset.asset=a?.path||''}
$('play').textContent=playing?'หยุดภาพ':'เล่นภาพ';$('gallery-title').textContent=mixGallery?'8 แบบผสม · เดินในเฟรมเดียวกัน':'ท่าเดินของชุดที่เลือก · 8 เฟรม';$('combinations').textContent=mixGallery?'กลับดู 8 เฟรม':'ดู 8 แบบผสม';$('status').textContent=`เฟรม ${frame+1}/8 · ${playing?'กำลังเดิน':'หยุดดู'} · ${item('cloth').label} · ${item('hair').label} · ${item('face').label}`;
document.body.dataset.frame=frame;document.body.dataset.playing=playing;for(const slot of slots)document.body.dataset[slot]=item(slot)?.id||'none';document.body.dataset.baseHead=catalog.base_head.path;
document.body.dataset.eyeState=eyeState();document.body.dataset.blinkCount=blinkCount;document.body.dataset.blinkEnabled=$('auto-blink').checked;
$('eye-status').textContent=eyeState()==='closed'?'ตาปิด':'ลืมตา';$('blink-now').disabled=item('face').already_closed||$('eye-preview').value!=='auto';
}
for(const slot of slots)$(slot).onchange=()=>{selected[slot]=$(slot).value;persist();render()};
for(const slot of catalog.layer_order)$('show-'+slot).onchange=render;
$('play').onclick=()=>{playing=!playing;clock=0;render()};$('step').onclick=()=>{playing=false;clock=0;frame=(frame+1)%8;render()};$('combinations').onclick=()=>{mixGallery=!mixGallery;render()};
$('reset').onclick=()=>{for(const slot of slots){selected[slot]='';$(slot).value=''}for(const slot of catalog.layer_order)$('show-'+slot).checked=true;$('auto-blink').checked=true;$('eye-preview').value='auto';blinkRemaining=0;blinkWait=nextBlinkWait();persist();render()};
$('blink-now').onclick=()=>{beginBlink();render()};
$('eye-preview').onchange=()=>{blinkRemaining=0;blinkWait=nextBlinkWait();render()};
$('auto-blink').onchange=()=>{blinkRemaining=0;blinkWait=nextBlinkWait();render()};
function tick(now){const dt=Math.min((now-last)/1000,.1);last=now;const oldEyeState=eyeState();
if(blinkRemaining>0)blinkRemaining=Math.max(0,blinkRemaining-dt);
else if($('auto-blink').checked&&$('eye-preview').value==='auto'&&!item('face').already_closed){blinkWait-=dt;if(blinkWait<=0)beginBlink()}
if(playing){clock+=dt*Number($('speed').value);while(clock>=catalog.cycle_seconds/8){clock-=catalog.cycle_seconds/8;frame=(frame+1)%8}render()}
else if(oldEyeState!==eyeState())render();requestAnimationFrame(tick)}
render();requestAnimationFrame(tick);
}catch(e){$('error').textContent='เปิดชิ้นส่วนไม่ได้: '+e.message;console.error(e)}

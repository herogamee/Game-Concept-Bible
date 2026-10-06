import {prepareRegisteredFrame,drawPreparedFrame} from './compositor.mjs';
import {walkPlan,WalkSession,resolveWalkSelection} from './walk-model.mjs';
const $=id=>document.getElementById(id),status=$('walk-status'),images=new Map();
function loadImage(url){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error(`อ่านภาพไม่สำเร็จ: ${url}`));im.src=url;});}
try{
 const response=await fetch('/api/walk');if(!response.ok)throw new Error('ยังไม่มีชุดเลเยอร์ท่าเดิน');const manifest=await response.json();
 for(const file of new Set(manifest.items.map(item=>item.file))){const url=`/walk-assets/${file}`,im=await loadImage(url);if(im.naturalWidth!==manifest.atlas.width||im.naturalHeight!==manifest.atlas.height)throw new Error(`กรอบภาพไม่ตรงกับแม่แบบ: ${file}`);images.set(url,im);}
 const session=new WalkSession(manifest),stage=$('walk-stage'),ctx=stage.getContext('2d'),character=document.createElement('canvas');
 character.width=manifest.frame.width;character.height=manifest.frame.height;
 const cards=[],inspectors=[],prepared=new Map();let lastFrame=-1,lastSelection='',lastHair=true,lastTime=performance.now(),axis=0;
 const combinations=[];for(const face of manifest.items.filter(i=>i.slot==='face'))for(const hair of manifest.items.filter(i=>i.slot==='hair'))for(const body of manifest.items.filter(i=>i.slot==='body'))combinations.push({face:face.id,hair:hair.id,body:body.id});
 async function preparedFor(selected,frame,visible=true){const key=JSON.stringify([selected,frame,visible]);if(!prepared.has(key))prepared.set(key,await prepareRegisteredFrame(walkPlan(manifest,selected,frame,visible),url=>images.get(url)));return prepared.get(key);}
 // Prevalidate all compatible combinations/frames before interaction; drawing
 // thereafter is synchronous, so old loads cannot overwrite an equip change.
 for(const selected of combinations)for(let f=0;f<manifest.clip.count;f++){await preparedFor(selected,f);await preparedFor(selected,f,false);}
 for(let f=0;f<manifest.clip.count;f++){await preparedFor(session.selected,f);await preparedFor(session.selected,f,false);}
 for(const slot of ['face','hair','body']){const select=$(`walk-${slot}`);select.add(new Option('ค่าเริ่มต้น',''));for(const item of manifest.items.filter(i=>i.slot===slot))select.add(new Option(item.label,item.id));select.addEventListener('change',()=>{session.equip(slot,select.value);updateControls();});}
 function updateControls(){for(const slot of ['face','hair','body'])$(`walk-${slot}`).value=session.selected[slot]??'';$('walk-play').textContent=session.playing?'หยุดภาพ':'เล่นท่าเดิน';$('walk-play').setAttribute('aria-pressed',String(session.playing));}
 for(const selected of combinations){const button=document.createElement('button'),canvas=document.createElement('canvas'),label=document.createElement('span');button.className='combo';canvas.width=manifest.frame.width;canvas.height=manifest.frame.height;const labels=Object.values(resolveWalkSelection(manifest,selected)).map(i=>i.label);label.textContent=labels.join(' · ');button.setAttribute('aria-label',labels.join(' · '));button.dataset.face=selected.face;button.dataset.hair=selected.hair;button.dataset.body=selected.body;button.append(canvas,label);button.addEventListener('click',()=>{for(const slot of ['face','hair','body'])session.equip(slot,selected[slot]);updateControls();});$('walk-gallery').append(button);cards.push({selected,canvas,button});}
 for(const [slot,label]of [['body','ชุดพร้อมร่างกาย'],['face','หัวและหน้า'],['hair','ผม']]){const figure=document.createElement('figure'),canvas=document.createElement('canvas'),caption=document.createElement('figcaption');canvas.width=manifest.frame.width;canvas.height=manifest.frame.height;caption.textContent=label;figure.append(canvas,caption);$('walk-layers').append(figure);inspectors.push({slot,canvas});}
 $('walk-play').addEventListener('click',()=>{session.playing=!session.playing;updateControls();});$('walk-step').addEventListener('click',()=>{session.step();updateControls();});
 $('walk-rate').addEventListener('change',()=>session.rate=Number($('walk-rate').value));$('walk-in-place').addEventListener('change',()=>session.inPlace=$('walk-in-place').checked);
 $('walk-reset').addEventListener('click',()=>{for(const slot of ['face','hair','body'])session.equip(slot,null);updateControls();});
 for(const [id,x]of [['walk-left',160],['walk-right',820]])$(id).addEventListener('click',()=>{session.destination=x;session.playing=true;updateControls();});
 stage.addEventListener('pointerdown',event=>{const rect=stage.getBoundingClientRect();session.destination=Math.max(120,Math.min(860,(event.clientX-rect.left)/rect.width*stage.width));session.playing=true;stage.focus();updateControls();});
 function keyAxis(event){if(event.target instanceof HTMLSelectElement||event.target instanceof HTMLInputElement)return;if(['ArrowLeft','a','A','ArrowRight','d','D'].includes(event.key)){event.preventDefault();axis=['ArrowLeft','a','A'].includes(event.key)?-1:1;session.destination=null;}}
 window.addEventListener('keydown',keyAxis);window.addEventListener('keyup',event=>{if(['ArrowLeft','a','A','ArrowRight','d','D'].includes(event.key))axis=0;});window.addEventListener('blur',()=>axis=0);
 function draw(now){session.tick(now-lastTime,axis);lastTime=now;const frame=session.frame,selection=JSON.stringify(session.selected),hair=!$('walk-hide-hair').checked;
  if(frame!==lastFrame||selection!==lastSelection||hair!==lastHair){const key=JSON.stringify([session.selected,frame,hair]);let loaded=prepared.get(key);if(!loaded){const resolved=resolveWalkSelection(manifest,session.selected),full=Object.fromEntries(Object.entries(resolved).map(([k,v])=>[k,v.id]));loaded=prepared.get(JSON.stringify([full,frame,hair]));}drawPreparedFrame(character,loaded);
   for(const card of cards){drawPreparedFrame(card.canvas,prepared.get(JSON.stringify([card.selected,frame,true])));card.canvas.dataset.frame=String(frame);const resolved=resolveWalkSelection(manifest,session.selected);card.button.setAttribute('aria-pressed',String(['face','hair','body'].every(slot=>card.selected[slot]===resolved[slot].id)));}
   const all=loaded.plan.layers;for(const inspector of inspectors){drawPreparedFrame(inspector.canvas,{plan:{...loaded.plan,layers:all.filter(l=>l.slot===inspector.slot)},images:all.map((l,i)=>({slot:l.slot,image:loaded.images[i]})).filter(i=>i.slot===inspector.slot).map(i=>i.image)});}
   lastFrame=frame;lastSelection=selection;lastHair=hair;
  }
  ctx.clearRect(0,0,stage.width,stage.height);ctx.fillStyle='#e2e8d8';ctx.fillRect(0,0,stage.width,stage.height);ctx.fillStyle='#d3ddc3';ctx.fillRect(0,354,stage.width,56);ctx.strokeStyle='#a7b697';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,354.5);ctx.lineTo(stage.width,354.5);ctx.stroke();
  ctx.save();ctx.translate(session.x,354-manifest.groundY*manifest.displayScale);ctx.scale(session.mirrored?-manifest.displayScale:manifest.displayScale,manifest.displayScale);ctx.drawImage(character,-manifest.frame.width/2,0);ctx.restore();
  stage.dataset.frame=String(frame);stage.dataset.phaseMs=session.phaseMs.toFixed(2);stage.dataset.x=session.x.toFixed(2);stage.dataset.playing=String(session.playing);stage.dataset.selected=selection;
  status.textContent=`เฟรม ${frame+1}/${manifest.clip.count} · ${session.playing?'กำลังเล่น':'หยุดภาพ'} · ${Object.values(resolveWalkSelection(manifest,session.selected)).map(i=>i.label).join(' / ')}${hair?'':' · ถอดผม'}`;
  requestAnimationFrame(draw);
 }
 updateControls();requestAnimationFrame(draw);
}catch(error){status.textContent=error.message;status.classList.add('error');}

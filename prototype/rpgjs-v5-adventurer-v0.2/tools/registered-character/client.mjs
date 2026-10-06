import {prepareRegisteredFrame,drawPreparedFrame} from './compositor.mjs';
import {portraitPlan,slots,defaults} from './portrait-adapter.mjs';
const names={face:'หน้า',hair:'ทรงผม',cloth:'ชุดและร่างกาย',head:'หมวก',glass:'แว่น',eff:'ตกแต่งใบหน้า',arm:'อาวุธ'};
const catalog=await (await fetch('/api/catalog')).json();
const state={sex:'m',selected:{},hidden:[],expression:0};
const images=new Map(),byId=new Map(catalog.items.map(item=>[item.id,item]));
let revision=0,matrixRevision=0;
function loadImage(url){
  if(!images.has(url))images.set(url,new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>{images.delete(url);reject(new Error('อ่านภาพชิ้นส่วนไม่สำเร็จ'));};img.src=url;}));
  return images.get(url);
}
function available(slot){return catalog.items.filter(item=>item.slot===slot&&[state.sex,'any'].includes(item.sex));}
function status(text,error=false){const node=document.querySelector('#status');node.textContent=text;node.classList.toggle('error',error);}
function controls(){
  for(const id of ['base-controls','extra-controls'])document.getElementById(id).replaceChildren();
  for(const slot of ['face','hair','cloth','head','glass','eff','arm']){
    const label=document.createElement('label');label.className='control';
    const span=document.createElement('span');span.textContent=names[slot];label.append(span);
    const select=document.createElement('select');select.id=`slot-${slot}`;select.setAttribute('aria-label',names[slot]);
    const fallback=document.createElement('option');fallback.value='0';fallback.textContent='ไม่ได้เลือก · ใช้ค่าเริ่มต้น';select.append(fallback);
    for(const item of available(slot)){const option=document.createElement('option');option.value=String(item.id);option.textContent=`${item.id} · ${item.name}`;select.append(option);}
    select.value=String(state.selected[slot]??0);
    select.addEventListener('change',()=>{if(select.value==='0')delete state.selected[slot];else state.selected[slot]=Number(select.value);state.hidden=state.hidden.filter(s=>s!==slot);render();});
    label.append(select);document.getElementById(['face','hair','cloth'].includes(slot)?'base-controls':'extra-controls').append(label);
  }
}
async function render(){
  const current=++revision;status('กำลังประกอบ…');
  try{
    const plan=portraitPlan(catalog,state),prepared=await prepareRegisteredFrame(plan,loadImage);
    if(current!==revision)return;
    drawPreparedFrame(document.querySelector('#character'),prepared);
    const badges=document.querySelector('#badges');badges.replaceChildren();
    for(const slot of ['face','hair','cloth']){const badge=document.createElement('span');badge.className='badge';badge.textContent=`${names[slot]} ${plan.equipment[slot]}`;badges.append(badge);}
    const layers=document.querySelector('#layers');layers.replaceChildren();
    for(const slot of slots){
      const node=document.createElement('div');node.className='layer';const label=document.createElement('label');
      const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=!state.hidden.includes(slot);checkbox.setAttribute('aria-label',`แสดง${names[slot]}`);
      checkbox.addEventListener('change',()=>{state.hidden=checkbox.checked?state.hidden.filter(s=>s!==slot):[...state.hidden,slot];render();});label.append(checkbox,document.createTextNode(` ${names[slot]}`));node.append(label);
      const index=plan.layers.findIndex(layer=>layer.slot===slot),canvas=document.createElement('canvas');canvas.width=250;canvas.height=342;node.append(canvas);
      if(index>=0)drawPreparedFrame(canvas,{plan:{width:250,height:342,layers:[plan.layers[index]]},images:[prepared.images[index]]});
      const text=document.createElement('small');text.textContent=`${plan.equipment[slot]}${state.selected[slot]?' · เลือกไว้':' · เริ่มต้น'}${slot==='hair'?` · แบบ ${plan.hairVariant}`:''}`;node.append(text);layers.append(node);
    }
    status(`ประกอบแล้ว · ${catalog.items.length} รายการในคลังภาพ · ${state.hidden.length?'มีเลเยอร์ที่ซ่อน':'แสดงครบ'}`);
    document.querySelector('#character').dataset.selection=JSON.stringify(plan.equipment);
  }catch(error){if(current===revision)status(error.message,true);}
}
async function matrix(){
  const current=++matrixRevision,node=document.querySelector('#matrix');node.replaceChildren();
  const choices=Object.fromEntries(['face','hair','cloth'].map(slot=>[slot,available(slot).slice(0,2).map(item=>item.id)]));
  for(const face of choices.face)for(const hair of choices.hair)for(const cloth of choices.cloth){
    const selected={face,hair,cloth},button=document.createElement('button');button.className='combination';button.setAttribute('aria-label',`ใช้หน้า ${face} ผม ${hair} ชุด ${cloth}`);
    const canvas=document.createElement('canvas');canvas.width=250;canvas.height=342;const text=document.createElement('span');text.textContent=`หน้า ${face} · ผม ${hair}\nชุด ${cloth}`;button.append(canvas,text);node.append(button);
    button.addEventListener('click',()=>{state.selected={...selected};state.hidden=[];state.expression=0;document.querySelector('#expression').value='0';controls();render();});
    try{const prepared=await prepareRegisteredFrame(portraitPlan(catalog,{sex:state.sex,selected}),loadImage);if(current!==matrixRevision)return;drawPreparedFrame(canvas,prepared);}catch(error){text.textContent=error.message;button.disabled=true;}
  }
}
document.querySelector('#sex').addEventListener('change',event=>{state.sex=event.target.value;state.selected={};state.hidden=[];state.expression=0;document.querySelector('#expression').value='0';controls();render();matrix();});
document.querySelector('#expression').addEventListener('change',event=>{state.expression=Number(event.target.value);render();});
function reset(){state.selected={};state.hidden=[];state.expression=0;document.querySelector('#expression').value='0';controls();render();}
document.querySelector('#reset').addEventListener('click',reset);document.querySelector('#clear').addEventListener('click',reset);
controls();await render();await matrix();

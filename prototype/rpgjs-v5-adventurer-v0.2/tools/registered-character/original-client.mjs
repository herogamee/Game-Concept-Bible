import {prepareRegisteredFrame,drawPreparedFrame} from './compositor.mjs';
const manifest=await(await fetch('/api/original')).json(),cache=new Map();
function loadImage(url){if(!cache.has(url))cache.set(url,new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('อ่านเลเยอร์ตัวละครไม่สำเร็จ'));image.src=url;}));return cache.get(url);}
const allLayers=manifest.layers.map(layer=>({...layer,url:`/original-assets/${layer.file}`,source:{x:0,y:0,width:manifest.width,height:manifest.height},x:0,y:0}));
function plan(hair=true){return {width:manifest.width,height:manifest.height,layers:allLayers.filter(layer=>hair||layer.slot!=='hair')};}
function zoom(target,source){const ctx=target.getContext('2d');ctx.clearRect(0,0,target.width,target.height);ctx.drawImage(source,300,0,650,555,0,0,650,555);}
let revision=0;
async function render(hair){const current=++revision;
  try{
    const prepared=await prepareRegisteredFrame(plan(hair),loadImage);if(current!==revision)return;
    const character=document.querySelector('#original-character');drawPreparedFrame(character,prepared);zoom(document.querySelector('#original-zoom'),character);
    document.querySelector('#with-hair').setAttribute('aria-pressed',String(hair));document.querySelector('#without-hair').setAttribute('aria-pressed',String(!hair));
    document.querySelector('#original-status').textContent=hair?'แสดงผมแล้ว':'ถอดผมแล้ว · ใช้หัว/หน้าและชุดเดิม';character.dataset.hairVisible=String(hair);
  }catch(error){document.querySelector('#original-status').textContent=error.message;document.querySelector('#original-status').classList.add('errors');}
}
document.querySelector('#with-hair').addEventListener('click',()=>render(true));document.querySelector('#without-hair').addEventListener('click',()=>render(false));
await render(true);
for(const [hair,id]of [[true,'head-with-hair'],[false,'head-without-hair']]){const canvas=document.createElement('canvas');canvas.width=manifest.width;canvas.height=manifest.height;drawPreparedFrame(canvas,await prepareRegisteredFrame(plan(hair),loadImage));zoom(document.getElementById(id),canvas);}
const labels={body:'ชุดพร้อมร่างกาย',face:'หัวและหน้า',hair:'ผม'};
for(const layer of allLayers){const card=document.createElement('div');card.className='layer';const title=document.createElement('h3');title.textContent=labels[layer.slot];const canvas=document.createElement('canvas');canvas.width=manifest.width;canvas.height=manifest.height;drawPreparedFrame(canvas,await prepareRegisteredFrame({width:manifest.width,height:manifest.height,layers:[layer]},loadImage));card.append(title,canvas);document.querySelector('#original-layers').append(card);}

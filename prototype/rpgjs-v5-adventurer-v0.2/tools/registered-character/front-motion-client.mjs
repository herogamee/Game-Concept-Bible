import {drawPreparedFrame} from './compositor.mjs';
import {frontMotionPlan,FrontMotionSession} from './front-motion-model.mjs';

export async function mountFrontMotion(fixed,selection){
 const target=document.querySelector('#fixed-motion'),label=document.querySelector('#motion-status');
 const response=await fetch('/api/front-motion');if(!response.ok)throw new Error('โหลดเฟรมเดินไม่สำเร็จ');
 const motion=await response.json(),images=new Map();
 await Promise.all(motion.files.map(file=>new Promise((resolve,reject)=>{
  const image=new Image();image.onload=()=>{const shape=motion.atlases.includes(file)?[motion.width*motion.columns,motion.height*motion.rows]:[motion.width,motion.height];if(image.naturalWidth!==shape[0]||image.naturalHeight!==shape[1])return reject(new Error(`ขนาดเฟรมเดินผิด: ${file}`));images.set(`/front-motion-assets/${file}`,image);resolve();};
  image.onerror=()=>reject(new Error(`อ่านภาพเดินไม่ได้: ${file}`));image.src=`/front-motion-assets/${file}`;
 })));
 const session=new FrontMotionSession(motion.frames),current=document.createElement('canvas'),previous=document.createElement('canvas');
 const start=document.querySelector('#motion-walk'),stop=document.querySelector('#motion-stand'),step=document.querySelector('#motion-step');
 start.addEventListener('click',()=>session.change('walk'));stop.addEventListener('click',()=>session.change('stand'));step.addEventListener('click',()=>session.step());
 document.querySelector('#motion-rate').addEventListener('change',event=>session.rate=Number(event.target.value));
 function pose(canvas,action,frame){const plan=frontMotionPlan(fixed,motion,selection.selected,selection,action,frame);drawPreparedFrame(canvas,{plan,images:plan.layers.map(l=>images.get(l.url))});}
 let last=performance.now();
 function render(now){
  session.tick(now-last);last=now;pose(current,session.action,session.frame);
  const ctx=target.getContext('2d');ctx.clearRect(0,0,target.width,target.height);
  if(session.transition){pose(previous,session.transition.action,session.transition.frame);ctx.save();ctx.globalAlpha=1-session.mix;ctx.drawImage(previous,0,0);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=session.mix;ctx.drawImage(current,0,0);ctx.restore();}
  else ctx.drawImage(current,0,0);
  target.dataset.action=session.action;target.dataset.phase=String(session.phase);target.dataset.frame=String(session.frame);target.dataset.playing=String(session.playing);target.dataset.selected=JSON.stringify(selection.selected);
  start.setAttribute('aria-pressed',String(session.playing));stop.setAttribute('aria-pressed',String(session.action==='stand'));
  label.textContent=session.action==='stand'?'ยืน · ใช้ชุดที่เลือกอยู่':`เดินหน้าตรง · ท่าหลัก ${session.frame+1}/${motion.frames}${session.playing?'':' · หยุดดูเฟรม'}`;
  requestAnimationFrame(render);
 }
 requestAnimationFrame(render);
}

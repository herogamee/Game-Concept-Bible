import {Direction} from '@rpgjs/common';
let direction:Direction|undefined,pointer:number|undefined;
export const touchDirection=()=>direction;
export function releaseTouch(){direction=undefined;pointer=undefined;document.getElementById('joystick-stick')?.style.setProperty('transform','translate(0,0)');}
export function setupTouchControls(cancel:()=>void,steer:(direction:Direction)=>void){
  const pad=document.getElementById('touch-joystick')!,stick=document.getElementById('joystick-stick')!,choice=document.getElementById('mobile-mode') as HTMLSelectElement;
  const coarse=matchMedia('(any-pointer:coarse)');
  try{const saved=localStorage.getItem('willowbrook-touch-v02');if(['auto','always','never'].includes(saved??''))choice.value=saved!;}catch{}
  const refresh=()=>{const enabled=choice.value==='always'||choice.value==='auto'&&coarse.matches;pad.hidden=!enabled;document.getElementById('game-hud')!.dataset.touchControls=String(enabled);if(!enabled)releaseTouch();};
  choice.addEventListener('change',()=>{try{localStorage.setItem('willowbrook-touch-v02',choice.value);}catch{}refresh();});coarse.addEventListener('change',refresh);refresh();
  const move=(event:PointerEvent)=>{
    if(pointer!==event.pointerId)return;const rect=pad.getBoundingClientRect(),radius=rect.width*.32;
    const dx=event.clientX-rect.left-rect.width/2,dy=event.clientY-rect.top-rect.height/2,length=Math.hypot(dx,dy),ratio=Math.min(1,radius/(length||1));
    stick.style.transform=`translate(${dx*ratio}px,${dy*ratio}px)`;
    direction=length<rect.width*.13?undefined:Math.abs(dx)>Math.abs(dy)?dx>0?Direction.Right:Direction.Left:dy>0?Direction.Down:Direction.Up;
    if(direction)steer(direction);
  };
  pad.addEventListener('pointerdown',event=>{if(pointer!==undefined)return;event.preventDefault();pointer=event.pointerId;pad.setPointerCapture(pointer);cancel();move(event);});
  pad.addEventListener('pointermove',move);
  const end=(event:PointerEvent)=>{if(event.pointerId===pointer){releaseTouch();cancel();}};
  pad.addEventListener('pointerup',end);pad.addEventListener('pointercancel',end);pad.addEventListener('lostpointercapture',end);
  window.addEventListener('blur',releaseTouch);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseTouch();});
}

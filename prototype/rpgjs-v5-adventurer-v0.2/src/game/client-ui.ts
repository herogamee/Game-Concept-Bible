import { defineModule, type RpgClient, type RpgClientEngine, inject, WebSocketToken, type AbstractWebsocket } from '@rpgjs/client';
import { Direction } from '@rpgjs/common';
import { type Progress } from './rules';
import { toggleAudio, sound, setAudioScene, setAudioVolume } from './audio';
import maps from './content.json';
import type { WorldView } from './runtime';
import ParityScene from './parity-scene.ce';
import {camera,setPresentationEngine,canvasPoint,setGroundMap,displayQuality,setDisplayQuality} from './presentation';
const read=(v:any):any=>typeof v==='function'?read(v()):Array.isArray(v)?v.map(read):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k])=>!k.startsWith('_')).map(([k,v])=>[k,read(v)])):v;
let socket:AbstractWebsocket,engine:RpgClientEngine,lastRender=0,lastMonsters='',lastPeers='',inventory=false;
let frameTimes:number[]=[],lastFrame=0,lastLevel=0;
const previousHp=new Map<string,number>();
const feedbackNodes=new Map<string,HTMLElement>();
const held=new Set<string>();
export const send=(name:string,data?:unknown)=>socket?.emit('adventure:action',{name,data});
function text(id:string,value:string){const el=document.getElementById(id);if(el&&el.textContent!==value)el.textContent=value;}
function setup(e:RpgClientEngine){
  engine=e;setPresentationEngine(e);socket=inject<AbstractWebsocket>(WebSocketToken);
  // Keep the same logical framing as v0.1; CSS scales the 800×450 canvas.
  e.width.set('800');e.height.set('450');e.renderer.resize(800,450);e.setCameraFollow(null,false);
  socket.on('adventure:sound',(payload:any)=>sound(payload.kind));
  document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.action!)));
  document.getElementById('inventory-toggle')!.addEventListener('click',()=>{inventory=!inventory;document.getElementById('inventory')!.hidden=!inventory;});
  document.getElementById('inventory-close')!.addEventListener('click',()=>{inventory=false;document.getElementById('inventory')!.hidden=true;});
  document.getElementById('sound-toggle')!.addEventListener('click',toggleAudio);
  document.getElementById('sound-volume')!.addEventListener('input',event=>setAudioVolume((event.target as HTMLInputElement).value));
  document.getElementById('developer-toggle')!.addEventListener('click',()=>{const panel=document.getElementById('developer-panel')!;panel.hidden=!panel.hidden;document.getElementById('developer-toggle')!.setAttribute('aria-expanded',String(!panel.hidden));});
  const quality=document.getElementById('display-quality') as HTMLSelectElement;quality.value=displayQuality();quality.addEventListener('change',()=>setDisplayQuality(quality.value));
  document.addEventListener('keydown',event=>{
    if((event.target as HTMLElement).closest('input,textarea,select'))return;
    held.add(event.code);if(event.repeat)return;
    if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.code))send('cancel');
    const action=({KeyZ:'attack',Space:'attack',KeyE:'talk',Enter:'talk',Digit1:'potion',KeyK:'save',KeyL:'load'} as Record<string,string>)[event.code];
    if(action){event.preventDefault();if(action==='attack')engine.interruptCurrentPlayerMovement();send(action);}
    if(event.code==='KeyI')document.getElementById('inventory-toggle')!.click();
  });
  document.addEventListener('keyup',e=>held.delete(e.code));window.addEventListener('blur',()=>held.clear());
  document.addEventListener('pointerup',event=>{
    if(!(event.target instanceof HTMLCanvasElement)||event.button!==0||inventory)return;
    const point=canvasPoint(event,event.target);if(!point)return;
    const player=engine.getCurrentPlayer() as any;
    const view=JSON.parse(read(player?.worldView)||'null') as WorldView|null;
    const target=view?.monsters.find(m=>m.hp>0&&Math.hypot(point.x-m.x,point.y-m.y)<26);
    send(target?'target':'walk',target?target.id:point);
  });
}
function render(e:RpgClientEngine){
  const frame=performance.now();if(lastFrame)frameTimes.push(frame-lastFrame);lastFrame=frame;if(frameTimes.length>600)frameTimes.shift();
  // Arrow keys are handled by the engine; WASD use the same movement channel.
  const direction=held.has('KeyW')?Direction.Up:held.has('KeyS')?Direction.Down:held.has('KeyA')?Direction.Left:held.has('KeyD')?Direction.Right:undefined;
  if(direction)void e.processInput({input:direction});
  if(performance.now()-lastRender<100)return;lastRender=performance.now();
  const p=e.getCurrentPlayer() as any;if(!p)return;
  const progress=JSON.parse(read(p.adventure)||'null') as Progress,view=JSON.parse(read(p.worldView)||'null') as WorldView;
  if(!progress||!view)return;
  setGroundMap(view.map);
  setAudioScene(view.map);if(lastLevel&&progress.level>lastLevel)sound('level');lastLevel=progress.level;
  renderFeedback(e,p,view);
  text('player-stats',`Lv.${progress.level} · HP ${progress.hp}/${progress.maxHp} · EXP ${progress.exp}/${progress.nextExp} · ATK ${progress.level}`);
  text('purse',`${progress.gold} Gold · Potion ×${progress.potions} · Gel ×${progress.gel}`);
  text('quest',progress.quest===0?'คุยกับผู้ใหญ่บ้านเพื่อรับเควส':progress.quest===1?`เควส: กำจัดสไลม์ ${progress.kills}/3`:progress.quest===2?'ครบ 3 ตัว! กลับไปหาผู้ใหญ่บ้าน':'เควสเริ่มต้นสำเร็จ ✓');
  text('notice',read(p.notice)||'พร้อมออกเดินทาง');text('phase',`สถานะ: ${read(p.combatPhase)}`);
  text('map-name',(maps as any)[view.map]?.name||'กำลังโหลดแผนที่');
  text('position',`ตำแหน่ง ${Math.round(read(p.x))}, ${Math.round(read(p.y))}`);
  const hp=document.getElementById('hp-meter') as HTMLProgressElement;hp.max=progress.maxHp;hp.value=progress.hp;
  const exp=document.getElementById('exp-meter') as HTMLProgressElement;exp.max=progress.nextExp;exp.value=progress.exp;
  if(frameTimes.length>30){const sorted=[...frameTimes].sort((a,b)=>a-b);text('performance',`Client tick ${Math.round(1000/(frameTimes.reduce((a,b)=>a+b,0)/frameTimes.length))} Hz · p95 ${sorted[Math.floor(sorted.length*.95)].toFixed(1)} ms · ${frameTimes.length} samples`);}
  const peers=JSON.stringify(view.players);if(peers!==lastPeers){lastPeers=peers;const list=document.getElementById('players')!;list.replaceChildren(...view.players.map(p=>{const el=document.createElement('li');el.textContent=`${p.name}${p.id===e.playerId?' (คุณ)':''} · ${Math.round(p.x)},${Math.round(p.y)} · HP ${p.hp}`;return el;}));}
  const monsters=JSON.stringify(view.monsters.map(m=>({id:m.id,hp:m.hp,state:m.state,generation:m.generation})));
  if(monsters!==lastMonsters){lastMonsters=monsters;const list=document.getElementById('monsters')!;list.replaceChildren(...view.monsters.map(m=>{const b=document.createElement('button');b.className='rpg-ui-button';b.textContent=`${m.id} · HP ${m.hp}/3 · ${m.state}`;b.disabled=m.hp===0;b.setAttribute('data-monster',m.id);b.onclick=()=>send('target',m.id);return b;}));}
  document.getElementById('inventory')!.hidden=!inventory;
  text('inventory-items',`ดาบเริ่มต้น · Potion ×${progress.potions} · Slime Gel ×${progress.gel} · ${progress.gold} Gold`);
}

function renderFeedback(e:RpgClientEngine,p:any,view:WorldView){
  const root=document.getElementById('world-feedback')!,frame=root.getBoundingClientRect(),map=(maps as any)[view.map];if(!map)return;
  
  const screen=(x:number,y:number)=>({x:(x-camera.x)/800*frame.width,y:(y-camera.y)/450*frame.height});
  const alive=new Set<string>();
  const place=(id:string,className:string,x:number,y:number,label='')=>{
    alive.add(id);let node=feedbackNodes.get(id);if(!node){node=document.createElement('div');node.className=className;root.append(node);feedbackNodes.set(id,node);}const at=screen(x,y);node.style.left=`${at.x}px`;node.style.top=`${at.y}px`;if(node.textContent!==label)node.textContent=label;return node;
  };
  for(const npc of map.objects.filter((o:any)=>o.type==='npc'))place(npc.id,'world-label',npc.x,npc.y-35,({elder:'ผู้ใหญ่บ้าน',merchant:'พ่อค้า',guide:'รุ่นพี่'} as any)[npc.properties.role]);
  for(const actor of [...view.players,...view.monsters]){
    const before=previousHp.get(actor.id);if(before!==undefined&&actor.hp<before){const node=document.createElement('div'),at=screen(actor.x,actor.y-25);node.className='damage-popup';node.textContent=String(before-actor.hp);node.style.left=`${at.x}px`;node.style.top=`${at.y}px`;root.append(node);node.addEventListener('animationend',()=>node.remove(),{once:true});}previousHp.set(actor.id,actor.hp);
  }
  for(const monster of view.monsters.filter(m=>m.hp>0)){
    const node=place(monster.id,'world-label',monster.x,monster.y-25,`Slime Lv.1 · ${monster.hp}/3`);if(monster.state==='hurt')node.style.color='#ffd092';else node.style.color='#fff5dd';
  }
  for(const peer of view.players){
    if(peer.id!==e.playerId)place(peer.id,'world-label',peer.x,peer.y-40,peer.name);
    if(peer.phase==='hurt'||peer.phase==='dead')place(`hurt-${peer.id}`,'hurt-ring',peer.x,peer.y+10);
    if(peer.phase==='attack_active'){
      const node=place(`slash-${peer.id}`,'slash-arc',peer.x,peer.y);const rotation=({right:0,down:90,left:180,up:270} as any)[peer.direction]??0;
      node.style.transform=`translate(-50%,-50%) rotate(${rotation}deg)`;
    }
    if(peer.id===e.playerId&&peer.destination)place('destination','destination',peer.destination.x,peer.destination.y+8);
  }
  for(const [id,node] of feedbackNodes)if(!alive.has(id)){node.remove();feedbackNodes.delete(id);}
}
export const uiModule=defineModule<RpgClient>({sceneMap:{component:ParityScene},engine:{onStart:setup,onStep:render,onDisconnect(){text('notice','ขาดการเชื่อมต่อ กำลังเชื่อมต่อใหม่');}}});

import { defineModule, type RpgClient, type RpgClientEngine, inject, WebSocketToken, type AbstractWebsocket } from '@rpgjs/client';
import { Direction } from '@rpgjs/common';
import { type Progress } from './rules';
import { toggleAudio, sound } from './audio';
import maps from './content.json';
import type { WorldView } from './runtime';
const read=(v:any):any=>typeof v==='function'?read(v()):Array.isArray(v)?v.map(read):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k])=>!k.startsWith('_')).map(([k,v])=>[k,read(v)])):v;
let socket:AbstractWebsocket,engine:RpgClientEngine,lastRender=0,lastMonsters='',lastPeers='',inventory=false;
const held=new Set<string>();
export const send=(name:string,data?:unknown)=>socket?.emit('adventure:action',{name,data});
function text(id:string,value:string){const el=document.getElementById(id);if(el&&el.textContent!==value)el.textContent=value;}
function setup(e:RpgClientEngine){
  engine=e;socket=inject<AbstractWebsocket>(WebSocketToken);
  socket.on('adventure:sound',(payload:any)=>sound(payload.kind));
  document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.action!)));
  document.getElementById('inventory-toggle')!.addEventListener('click',()=>{inventory=!inventory;document.getElementById('inventory')!.hidden=!inventory;});
  document.getElementById('audio-toggle')!.addEventListener('click',()=>{const on=toggleAudio();text('audio-toggle',on?'เสียง: เปิด':'เสียง: ปิด');});
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
    if(!(event.target instanceof HTMLCanvasElement)||event.button!==0)return;
    const point=engine.pointer.world();if(point)send('walk',point);
  });
}
function render(e:RpgClientEngine){
  // Arrow keys are handled by the engine; WASD use the same movement channel.
  const direction=held.has('KeyW')?Direction.Up:held.has('KeyS')?Direction.Down:held.has('KeyA')?Direction.Left:held.has('KeyD')?Direction.Right:undefined;
  if(direction)void e.processInput({input:direction});
  if(performance.now()-lastRender<100)return;lastRender=performance.now();
  const p=e.getCurrentPlayer() as any;if(!p)return;
  const progress=JSON.parse(read(p.adventure)||'null') as Progress,view=JSON.parse(read(p.worldView)||'null') as WorldView;
  if(!progress||!view)return;
  text('player-stats',`Lv.${progress.level} · HP ${progress.hp}/${progress.maxHp} · EXP ${progress.exp}/${progress.nextExp} · ATK ${progress.level}`);
  text('purse',`${progress.gold} Gold · Potion ×${progress.potions} · Gel ×${progress.gel}`);
  text('quest',progress.quest===0?'คุยกับผู้ใหญ่บ้านเพื่อรับเควส':progress.quest===1?`เควส: กำจัดสไลม์ ${progress.kills}/3`:progress.quest===2?'ครบ 3 ตัว! กลับไปหาผู้ใหญ่บ้าน':'เควสเริ่มต้นสำเร็จ ✓');
  text('notice',read(p.notice)||'พร้อมออกเดินทาง');text('phase',`สถานะ: ${read(p.combatPhase)}`);
  text('map-name',(maps as any)[view.map]?.name||'กำลังโหลดแผนที่');
  text('position',`ตำแหน่ง ${Math.round(read(p.x))}, ${Math.round(read(p.y))}`);
  const hp=document.getElementById('hp-meter') as HTMLProgressElement;hp.max=progress.maxHp;hp.value=progress.hp;
  const peers=JSON.stringify(view.players);if(peers!==lastPeers){lastPeers=peers;const list=document.getElementById('players')!;list.replaceChildren(...view.players.map(p=>{const el=document.createElement('li');el.textContent=`${p.name}${p.id===e.playerId?' (คุณ)':''} · ${Math.round(p.x)},${Math.round(p.y)} · HP ${p.hp}`;return el;}));}
  const monsters=JSON.stringify(view.monsters.map(m=>({id:m.id,hp:m.hp,state:m.state,generation:m.generation})));
  if(monsters!==lastMonsters){lastMonsters=monsters;const list=document.getElementById('monsters')!;list.replaceChildren(...view.monsters.map(m=>{const b=document.createElement('button');b.className='rpg-ui-button';b.textContent=`${m.id} · HP ${m.hp}/3 · ${m.state}`;b.disabled=m.hp===0;b.setAttribute('data-monster',m.id);b.onclick=()=>send('target',m.id);return b;}));}
  document.getElementById('inventory')!.hidden=!inventory;
  text('inventory-items',`ดาบเริ่มต้น · Potion ×${progress.potions} · Slime Gel ×${progress.gel} · ${progress.gold} Gold`);
}
export const uiModule=defineModule<RpgClient>({engine:{onStart:setup,onStep:render,onDisconnect(){text('notice','ขาดการเชื่อมต่อ กำลังเชื่อมต่อใหม่');}},interactions:{setup(e){e.interactions.use(({sprite})=>String(read(sprite.name)).startsWith('Slime'),{cursor:'crosshair',click({sprite,event}){event?.stopPropagation?.();send('target',sprite.id);}});}}});

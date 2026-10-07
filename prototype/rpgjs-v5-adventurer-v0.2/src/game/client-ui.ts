import { defineModule, type RpgClient, type RpgClientEngine, inject, WebSocketToken, type AbstractWebsocket } from '@rpgjs/client';
import { Direction } from '@rpgjs/common';
import { type Progress } from './rules';
import { toggleAudio, sound, setAudioScene, setAudioVolume } from './audio';
import maps from './content.json';
import type { WorldView } from './runtime';
import ParityScene from './parity-scene.ce';
import StaticProp from './static-prop.ce';
import {isCharacterLab} from './save-key';
import {camera,viewSize,setPresentationEngine,canvasPoint,setGroundMap,displayQuality,setDisplayQuality,cameraSettings,setCameraSettings} from './presentation';
import {setupTouchControls,touchDirection,releaseTouch} from './touch-controls';
import {setupWardrobe} from './wardrobe-ui';
let updateWardrobe:ReturnType<typeof setupWardrobe>;
const read=(v:any):any=>typeof v==='function'?read(v()):Array.isArray(v)?v.map(read):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k])=>!k.startsWith('_')).map(([k,v])=>[k,read(v)])):v;
let socket:AbstractWebsocket,engine:RpgClientEngine,lastRender=0,lastMonsters='',lastPeers='',inventory=false;
let frameTimes:number[]=[],lastFrame=0,lastLevel=0;
let lastSteer=0,lastSteerInput='',steering=false;
const previousHp=new Map<string,number>();
const feedbackNodes=new Map<string,HTMLElement>();
const held=new Set<string>();
let panel:'inventory'|'settings'|undefined;
function steer(direction:Direction|{x:number;y:number}){const now=performance.now(),input=JSON.stringify(direction);if(panel||document.hidden||steering&&input===lastSteerInput&&now-lastSteer<80)return;send('steer',direction);lastSteer=now;lastSteerInput=input;steering=true;}
function showPanel(value:typeof panel){
  panel=value;inventory=value==='inventory';held.clear();releaseTouch();send('cancel');
  document.getElementById('panel-scrim')!.hidden=!value;
  for(const id of ['inventory','settings'])document.getElementById(id)!.hidden=id!==value;
  document.getElementById('settings-toggle')!.setAttribute('aria-expanded',String(value==='settings'));
  if(value)document.getElementById(value)!.focus();else document.getElementById('settings-toggle')!.focus();
}
export const send=(name:string,data?:unknown)=>socket?.emit('adventure:action',{name,data});
function text(id:string,value:string){const el=document.getElementById(id);if(el&&el.textContent!==value)el.textContent=value;}
function setup(e:RpgClientEngine){
  if(isCharacterLab(window.location.search)){
    document.title='Willowbrook · Character Lab runtime';
    const badge=document.querySelector('#game-hud .eyebrow');
    if(badge)badge.textContent='✦ CHARACTER LAB · เซฟทดสอบ';
  }
  engine=e;setPresentationEngine(e);socket=inject<AbstractWebsocket>(WebSocketToken);
  updateWardrobe=setupWardrobe(send);
  e.addEventComponentResolver(sprite=>{
    const prop=[...maps.village.objects,...maps.meadow.objects].find(o=>o.type==='prop'&&o.id===sprite.id);
    if(!prop)return null;
    const name=String(prop.properties.graphic).replace(/^prop-/,'');
    return {component:StaticProp,props:{id:prop.id,image:`${import.meta.env.BASE_URL}willowbrook/hd/${name}.png`,object:sprite,worldX:prop.x,worldY:prop.y},renderGraphic:false};
  });
  // Start at the reference framing; presentation crops it to the actual viewport.
  e.width.set('800');e.height.set('450');e.renderer.resize(800,450);e.setCameraFollow(null,false);
  socket.on('adventure:sound',(payload:any)=>sound(payload.kind));
  document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.action==='travel')showPanel(undefined);send(b.dataset.action!);}));
  document.getElementById('inventory-toggle')!.addEventListener('click',()=>showPanel(panel==='inventory'?undefined:'inventory'));
  document.getElementById('inventory-close')!.addEventListener('click',()=>showPanel(undefined));
  document.getElementById('settings-toggle')!.addEventListener('click',()=>showPanel(panel==='settings'?undefined:'settings'));
  document.getElementById('settings-close')!.addEventListener('click',()=>showPanel(undefined));
  setupTouchControls(()=>{engine.interruptCurrentPlayerMovement();send('cancel');steering=false;},steer);
  const scale=document.getElementById('ui-scale') as HTMLInputElement;
  try{const saved=Number(localStorage.getItem('willowbrook-ui-scale-v02'));if(saved>=85&&saved<=130)scale.value=String(saved);}catch{}
  const applyScale=()=>{document.documentElement.style.setProperty('--hud-scale',String(Number(scale.value)/100));text('ui-scale-value',`${scale.value}%`);};
  scale.addEventListener('input',()=>{applyScale();try{localStorage.setItem('willowbrook-ui-scale-v02',scale.value);}catch{}});applyScale();
  document.getElementById('sound-toggle')!.addEventListener('click',toggleAudio);
  document.getElementById('sound-volume')!.addEventListener('input',event=>setAudioVolume((event.target as HTMLInputElement).value));
  document.getElementById('developer-toggle')!.addEventListener('click',()=>{const panel=document.getElementById('developer-panel')!;panel.hidden=!panel.hidden;document.getElementById('developer-toggle')!.setAttribute('aria-expanded',String(!panel.hidden));});
  const quality=document.getElementById('display-quality') as HTMLSelectElement;quality.value=displayQuality();quality.addEventListener('change',()=>setDisplayQuality(quality.value));
  const distance=document.getElementById('camera-distance') as HTMLInputElement,framing=document.getElementById('camera-framing') as HTMLInputElement,mode=document.getElementById('camera-mode') as HTMLSelectElement;
  const settings=cameraSettings();distance.value=String(settings.distance);framing.value=String(settings.framing);mode.value=settings.mode;
  const cameraLabels=()=>{text('camera-distance-value',`${distance.value}% · ยิ่งมากยิ่งเห็นไกล`);text('camera-framing-value',`${framing.value}%`);};cameraLabels();
  distance.addEventListener('input',()=>{setCameraSettings({distance:Number(distance.value)});cameraLabels();});
  framing.addEventListener('input',()=>{setCameraSettings({framing:Number(framing.value)});cameraLabels();});
  mode.addEventListener('change',()=>setCameraSettings({mode:mode.value}));
  document.addEventListener('keydown',event=>{
    if(event.code==='Escape'&&panel){event.preventDefault();showPanel(undefined);return;}
    if(panel)return;
    if((event.target as HTMLElement).closest('input,textarea,select'))return;
    held.add(event.code);if(event.repeat)return;
    if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.code)){event.preventDefault();if(!steering)send('cancel');}
    const action=({KeyZ:'attack',Space:'attack',KeyE:'talk',Enter:'talk',Digit1:'potion',KeyK:'save',KeyL:'load'} as Record<string,string>)[event.code];
    if(action){event.preventDefault();if(action==='attack')engine.interruptCurrentPlayerMovement();send(action);}
    if(event.code==='KeyI')document.getElementById('inventory-toggle')!.click();
  });
  document.addEventListener('keyup',e=>held.delete(e.code));window.addEventListener('blur',()=>held.clear());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)held.clear();});
  document.addEventListener('pointerup',event=>{
    if(!(event.target instanceof HTMLCanvasElement)||event.button!==0||panel)return;
    const point=canvasPoint(event,event.target);if(!point)return;
    const player=engine.getCurrentPlayer() as any;
    const view=JSON.parse(read(player?.worldView)||'null') as WorldView|null;
    const target=view?.monsters.find(m=>m.hp>0&&Math.hypot(point.x-m.x,point.y-m.y)<26);
    send(target?'target':'walk',target?target.id:point);
  });
}
function render(e:RpgClientEngine){
  const frame=performance.now();if(lastFrame)frameTimes.push(frame-lastFrame);lastFrame=frame;if(frameTimes.length>600)frameTimes.shift();
  // One authoritative input path for arrows, WASD and touch; opposing keys cancel.
  const x=Number(held.has('KeyD')||held.has('ArrowRight'))-Number(held.has('KeyA')||held.has('ArrowLeft'));
  const y=Number(held.has('KeyS')||held.has('ArrowDown'))-Number(held.has('KeyW')||held.has('ArrowUp'));
  const direction=touchDirection()??(x||y?{x,y}:undefined);
  if(direction&&!panel&&!document.hidden){
    steer(direction);
  }else if(steering){e.interruptCurrentPlayerMovement();send('cancel');steering=false;}
  const p=e.getCurrentPlayer() as any;if(!p)return;
  updateWardrobe?.(read(p.appearance),inventory);
  if(performance.now()-lastRender<100)return;lastRender=performance.now();
  const progress=JSON.parse(read(p.adventure)||'null') as Progress,view=JSON.parse(read(p.worldView)||'null') as WorldView;
  if(!progress||!view)return;
  setGroundMap(view.map);
  setAudioScene(view.map);if(lastLevel&&progress.level>lastLevel)sound('level');lastLevel=progress.level;
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

// Called by the scene render tick after the camera has moved. The HUD can stay
// throttled, but world labels and feedback must share the scenery's frame clock.
export function updateWorldFeedback(){
  const p=engine?.getCurrentPlayer() as any;if(!p)return;
  const view=JSON.parse(read(p.worldView)||'null') as WorldView|null;if(!view?.map)return;
  renderFeedback(engine,p,view);
}

function renderFeedback(e:RpgClientEngine,p:any,view:WorldView){
  const root=document.getElementById('world-feedback')!,frame=root.getBoundingClientRect(),map=(maps as any)[view.map];if(!map)return;
  
  const screen=(x:number,y:number)=>({x:(x-camera.x)/viewSize.width*frame.width,y:(y-camera.y)/viewSize.height*frame.height});
  const alive=new Set<string>();
  const place=(id:string,className:string,x:number,y:number,label='')=>{
    alive.add(id);let node=feedbackNodes.get(id);if(!node){node=document.createElement('div');node.className=className;root.append(node);feedbackNodes.set(id,node);}const at=screen(x,y);node.style.left=`${at.x}px`;node.style.top=`${at.y}px`;if(node.textContent!==label)node.textContent=label;return node;
  };
  for(const npc of map.objects.filter((o:any)=>o.type==='npc'))place(npc.id,'world-label',npc.x,npc.y-45,({elder:'ผู้ใหญ่บ้าน',merchant:'พ่อค้า',guide:'รุ่นพี่'} as any)[npc.properties.role]);
  for(const actor of [...view.players,...view.monsters]){
    const before=previousHp.get(actor.id);if(before!==undefined&&actor.hp<before){const node=document.createElement('div'),at=screen(actor.x,actor.y-25);node.className='damage-popup';node.textContent=String(before-actor.hp);node.style.left=`${at.x}px`;node.style.top=`${at.y}px`;root.append(node);node.addEventListener('animationend',()=>node.remove(),{once:true});}previousHp.set(actor.id,actor.hp);
  }
  const livePosition=(actor:{id:string;x:number;y:number})=>{const object=e.getObjectById(actor.id) as any;return object?{x:Number(object.x()),y:Number(object.y())}:actor;};
  for(const monster of view.monsters.filter(m=>m.hp>0)){
    const at=livePosition(monster);const node=place(monster.id,'world-label',at.x,at.y-33,`Slime Lv.1 · ${monster.hp}/3`);if(monster.state==='hurt')node.style.color='#ffd092';else node.style.color='#fff5dd';
  }
  for(const peer of view.players){
    const at=livePosition(peer);
    if(peer.id!==e.playerId)place(peer.id,'world-label',at.x,at.y-40,peer.name);
    if(peer.phase==='hurt'||peer.phase==='dead')place(`hurt-${peer.id}`,'hurt-ring',at.x,at.y+10);
    if(peer.phase==='attack_active'){
      const node=place(`slash-${peer.id}`,'slash-arc',at.x,at.y);const rotation=({right:0,down:90,left:180,up:270} as any)[peer.direction]??0;
      node.style.transform=`translate(-50%,-50%) rotate(${rotation}deg)`;
    }
    if(peer.id===e.playerId&&peer.destination)place('destination','destination',peer.destination.x,peer.destination.y+8);
  }
  for(const [id,node] of feedbackNodes)if(!alive.has(id)){node.remove();feedbackNodes.delete(id);}
}
export const uiModule=defineModule<RpgClient>({sceneMap:{component:ParityScene},engine:{onStart:setup,onStep:render,onDisconnect(){text('notice','ขาดการเชื่อมต่อ กำลังเชื่อมต่อใหม่');}}});

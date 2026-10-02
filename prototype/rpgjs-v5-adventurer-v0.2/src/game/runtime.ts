import { Direction, LinearMove } from '@rpgjs/common';
import { type RpgPlayer, type RpgEvent, type RpgMap, type RpgWritableSignal } from '@rpgjs/server';
import contentData from './content.json';
import { facingOf, engineAnimation, type Facing } from './animation';
import { route, type Point } from './navigation';
import { newProgress, sword, slimeDefinition, phaseAt, startSwing, swordCanHit, confirmKill, questTalk, usePotion, takeDamage, type Progress, type Swing, type Phase, type SlimeState } from './rules';
export const content = contentData;
export const progressOf=(p:RpgPlayer):Progress=>JSON.parse(p.adventure());
export const monsterOf=(e:RpgPlayer):Monster=>JSON.parse(e.monster());
export type MapId=keyof typeof content;
interface Monster {hp:number;maxHp:number;state:SlimeState;rewarded:boolean;generation:number}
declare module '@rpgjs/server' {
  interface RpgPlayer {
    adventure:RpgWritableSignal<string>;
    combatPhase:RpgWritableSignal<Phase>;
    notice:RpgWritableSignal<string>;
    worldView:RpgWritableSignal<string>;
    monster:RpgWritableSignal<string>;
  }
}
export interface WorldView {map:string;players:{id:string;name:string;x:number;y:number;hp:number;phase:string;direction:string;destination:Point|null}[];monsters:{id:string;x:number;y:number;hp:number;state:string;generation:number}[]}
interface Runtime {swing?:Swing;hurtUntil:number;deadUntil:number;target?:string;path:Point[];lastAction:number;lastView:number;lastSave:number;transfer:boolean;lastPosition:Point;movingUntil:number}
const runtimes=new WeakMap<RpgPlayer,Runtime>();
const slimeTimers=new WeakMap<RpgEvent,{home:Point;hurtUntil:number;respawnAt:number;attackAt:number;wanderAt:number}>();
export const playerSchema={adventure:{$default:JSON.stringify(newProgress())},combatPhase:{$default:'idle',$permanent:false},notice:{$default:'พร้อมออกเดินทาง',$permanent:false},worldView:{$default:JSON.stringify({map:'',players:[],monsters:[]}),$permanent:false}};
export function runtime(p:RpgPlayer):Runtime {
  let r=runtimes.get(p);if(!r){r={hurtUntil:0,deadUntil:0,path:[],lastAction:0,lastView:0,lastSave:Date.now(),transfer:false,lastPosition:position(p),movingUntil:0};runtimes.set(p,r);}return r;
}
export const position=(p:RpgPlayer):Point=>({x:p.x(),y:p.y()});
const distance=(a:RpgPlayer,b:RpgPlayer)=>Math.hypot(a.x()-b.x(),a.y()-b.y());
function updateProgress(p:RpgPlayer,change:(v:Progress)=>void) {const v={...progressOf(p)};change(v);p.adventure.set(JSON.stringify(v));p.hp=v.hp;p.level=v.level;}
export function resetTransient(p:RpgPlayer,clearMovement=true) {runtimes.delete(p);p.canMove=true;p.directionFixed=false;p.combatPhase.set('idle');if(clearMovement){p.clearMovements();p.stopMoveTo();}p.setGraphic('adventurer');}
export function initMonster(e:RpgEvent) {
  e.setSync({monster:{$default:JSON.stringify({hp:3,maxHp:3,state:'idle',rewarded:false,generation:1})}});
  e.setGraphic('slime');e.name='Slime Lv.1';e.setHitbox(20,16);e.speed=slimeDefinition.speed/45;
  e.hp=3;slimeTimers.set(e,{home:position(e),hurtUntil:0,respawnAt:0,attackAt:0,wanderAt:0});
}
function face(p:RpgPlayer,t:Point) {const dx=t.x-p.x(),dy=t.y-p.y();p.direction.set(Math.abs(dx)>Math.abs(dy)?dx>0?Direction.Right:Direction.Left:dy>0?Direction.Down:Direction.Up);}
export function beginAttack(p:RpgPlayer,now=Date.now()) {
  const r=runtime(p);if(progressOf(p).hp<=0||now<r.hurtUntil)return;
  const swing=startSwing(r.swing,now,facingOf(p.direction()));if(!swing)return;
  r.swing=swing;r.path=[];p.stopMoveTo();p.clearMovements();p.canMove=false;p.directionFixed=true;
  p.combatPhase.set('attack_windup');p.setGraphicAnimation(engineAnimation('slash'),1);
  p.getCurrentMap()?.broadcast('adventure:sound',{kind:'slash',id:p.id});
}
function stopNavigation(p:RpgPlayer) {const r=runtime(p);r.path=[];r.target=undefined;p.stopMoveTo();p.clearMovements();}
function walkTo(p:RpgPlayer,to:Point) {
  const map=p.getCurrentMap();if(!map||!(map.id in content))return;
  const path=route(position(p),to,content[map.id as MapId].blockedTiles,content[map.id as MapId]);runtime(p).path=path;
  p.stopMoveTo();p.clearMovements();if(!path.length)p.notice.set('เดินไปจุดนี้ไม่ได้');
}
export function action(p:RpgPlayer,name:string,data:unknown) {
  const r=runtime(p),now=Date.now();
  if(name==='cancel'){stopNavigation(p);return;}
  if(now-r.lastAction<60)return;r.lastAction=now;
  if(progressOf(p).hp<=0)return;
  switch(name){
    case 'attack':r.target=undefined;beginAttack(p,now);break;
    case 'walk': {if(!data||typeof data!=='object')return;const {x,y}=data as Point;if(!Number.isFinite(x)||!Number.isFinite(y))return;stopNavigation(p);walkTo(p,{x,y});break;}
    case 'target': {if(typeof data!=='string')return;const e=p.getCurrentMap()?.getEvent(data);if(!e||!e.monster||monsterOf(e).hp<=0)return;r.target=e.id;r.path=[];break;}
    case 'talk':talk(p);break;
    case 'potion': {let used=false;updateProgress(p,v=>{used=usePotion(v);});p.notice.set(used?'ใช้ Potion · HP +18':'ใช้ Potion ไม่ได้: HP เต็มหรือยาหมด');if(used)checkpoint(p);break;}
    case 'travel': {const map=p.getCurrentMap();if(!map||!(map.id in content))return;const o=content[map.id as MapId].objects.find(o=>o.type==='portal') as any;if(o){stopNavigation(p);walkTo(p,{x:o.x+o.width/2,y:Math.min(content[map.id as MapId].height-24,o.y+o.height/2)});}break;}
    case 'save':checkpoint(p,true);break;
    case 'load':if(!r.swing&&now>=r.hurtUntil)void p.load(0).then(result=>p.notice.set(result.ok?'โหลดบันทึกแล้ว':'ยังไม่มีบันทึก'));break;
  }
}
export function keyboardInput(p:RpgPlayer,input:unknown) {if(['up','down','left','right'].includes(String(input)))stopNavigation(p);}
export function talk(p:RpgPlayer) {
  const map=p.getCurrentMap();if(!map||map.id!=='village')return p.notice.set('ไม่มี NPC อยู่ใกล้ ๆ');
  const npc=map.getEvents().filter(e=>content.village.objects.some(o=>o.type==='npc'&&o.id===e.id)).sort((a,b)=>distance(p,a)-distance(p,b))[0];
  if(!npc||distance(p,npc)>72)return p.notice.set('เดินเข้าใกล้ NPC ก่อน แล้วกด E');
  const role=content.village.objects.find(o=>o.id===npc.id)?.properties.role;
  updateProgress(p,v=>{
    if(role==='elder')p.notice.set(questTalk(v));
    else if(role==='merchant'){if(v.gold>=10){v.gold-=10;v.potions++;p.notice.set('พ่อค้า: ซื้อ Potion 1 ขวด · 10 Gold');}else p.notice.set('Gold ไม่พอ');}
    else p.notice.set('รุ่นพี่: ลงประตูใต้ไปทุ่งหญ้า คลิกสไลม์ หรือใช้ Z เพื่อฟัน');
  });checkpoint(p);
}
export function checkpoint(p:RpgPlayer,announce=false) {
  if(progressOf(p).hp<=0)return;
  runtime(p).lastSave=Date.now();
  void p.save(0).then(()=>{if(announce)p.notice.set('บันทึกแล้ว · '+new Date().toLocaleTimeString());}).catch(()=>p.notice.set('บันทึกไม่สำเร็จ'));
}
function hitMonster(p:RpgPlayer,e:RpgEvent,now:number) {
  const r=runtime(p),s=r.swing!,m={...monsterOf(e)};
  if(!swordCanHit(s,now,e.id,m.hp,position(p),position(e)))return;
  // A wall between attacker and target rejects the hit even inside the arc.
  const map=p.getCurrentMap()!;const blocks=new Set(content[map.id as MapId].blockedTiles);
  for(let t=0;t<=1;t+=.2){const x=p.x()+(e.x()-p.x())*t,y=p.y()+(e.y()-p.y())*t;if(blocks.has(Math.floor(y/content[map.id as MapId].tileSize)*content[map.id as MapId].columns+Math.floor(x/content[map.id as MapId].tileSize)))return;}
  s.hits.add(e.id);m.hp=Math.max(0,m.hp-progressOf(p).level*sword.damageMultiplier);e.hp=m.hp;
  const timer=slimeTimers.get(e)!;timer.hurtUntil=now+180;e.stopMoveTo();e.clearMovements();
  if(m.hp>0){const dx=e.x()-p.x(),dy=e.y()-p.y(),length=Math.hypot(dx,dy)||1;void e.addMovement(new LinearMove({x:dx/length*100,y:dy/length*100},.1));}
  if(m.hp===0){
    m.state='dead';timer.respawnAt=now+slimeDefinition.respawnMs;e.canMove=false;e.through=true;e.setGraphic([]);
    let earned=false;updateProgress(p,v=>{earned=confirmKill(v,m);});
    if(earned){p.notice.set(`กำจัด Slime · +8 EXP +2 Gold +1 Gel${progressOf(p).quest===2?' · ครบ 3 ตัว กลับผู้ใหญ่บ้าน!':''}`);checkpoint(p);}
  }else m.state='hurt';
  e.monster.set(JSON.stringify(m));
}
function damagePlayer(p:RpgPlayer,now:number) {
  const r=runtime(p);if(now<r.hurtUntil||progressOf(p).hp<=0)return;
  updateProgress(p,v=>p.combatPhase.set(takeDamage(v,slimeDefinition.attack)));
  r.hurtUntil=now+700;r.swing=undefined;p.stopMoveTo();p.clearMovements();p.canMove=progressOf(p).hp>0;p.directionFixed=false;
  p.setGraphicAnimation(engineAnimation(progressOf(p).hp===0?'dead':'hurt'),1);
  p.getCurrentMap()?.broadcast('adventure:sound',{kind:'hurt',id:p.id});
  if(progressOf(p).hp===0){r.target=undefined;r.deadUntil=now+1000;p.notice.set('หมดสติ... กำลังกลับหมู่บ้าน');}
}
function stepMonster(e:RpgEvent,players:RpgPlayer[],now:number) {
  const timer=slimeTimers.get(e);if(!timer)return;const m={...monsterOf(e)},before=JSON.stringify(m);
  if(m.hp===0){
    if(now>=timer.respawnAt){m.state='respawn';m.hp=m.maxHp;m.rewarded=false;m.generation++;e.hp=m.hp;e.canMove=true;e.through=false;e.setGraphic('slime');void e.teleport(timer.home);timer.hurtUntil=now+150;}
  }else if(now<timer.hurtUntil){m.state=m.state==='respawn'?'respawn':'hurt';e.stopMoveTo();}
  else {
    // Shared maps retain monster positions after a player dies/leaves. Leash
    // aggro to its authored home so it cannot camp the entrance indefinitely.
    const nearest=players.filter(p=>progressOf(p).hp>0&&!runtime(p).transfer&&Math.hypot(p.x()-timer.home.x,p.y()-timer.home.y)<slimeDefinition.aggro).sort((a,b)=>distance(a,e)-distance(b,e))[0];
    if(nearest&&distance(e,nearest)<slimeDefinition.aggro){
      if(distance(e,nearest)<=30){m.state='attack';e.stopMoveTo();if(now>=timer.attackAt){timer.attackAt=now+900;damagePlayer(nearest,now);}}
      else{m.state='chase';const dx=nearest.x()-e.x(),dy=nearest.y()-e.y(),d=Math.hypot(dx,dy);e.stopMoveTo();e.clearMovements();void e.addMovement(new LinearMove({x:dx/d*slimeDefinition.speed,y:dy/d*slimeDefinition.speed},.04));}
    }else if(Math.hypot(e.x()-timer.home.x,e.y()-timer.home.y)>40){m.state='wander';e.moveTo(timer.home);}
    else if(now>=timer.wanderAt){m.state='wander';timer.wanderAt=now+2500;const drift=Math.sin(now/1500+e.id.length)*25;e.moveTo({x:timer.home.x+drift,y:timer.home.y+Math.cos(now/1700)*20});}
    else if(now>=timer.wanderAt-1000){m.state='idle';e.stopMoveTo();}
  }
  if(JSON.stringify(m)!==before)e.monster.set(JSON.stringify(m));
}
function portal(p:RpgPlayer) {
  const map=p.getCurrentMap(),r=runtime(p);if(!map||!(map.id in content)||r.transfer||progressOf(p).hp<=0)return;
  const o=content[map.id as MapId].objects.find(o=>o.type==='portal'&&p.x()>=o.x&&p.x()<o.x+(o as any).width&&p.y()>=o.y&&p.y()<o.y+(o as any).height) as any;
  if(!o)return;r.transfer=true;stopNavigation(p);r.swing=undefined;p.canMove=true;p.directionFixed=false;
  void p.changeMap(o.properties.targetMap,{x:o.properties.targetX,y:o.properties.targetY});
}
export function stepMap(map:RpgMap,now=Date.now()) {
  if(!(map.id in content))return;
  const players=map.getPlayers(),monsters=map.getEvents().filter(e=>!!e.monster);
  for(const p of players){
    if(!p.adventure)continue;const r=runtime(p);if(r.transfer)continue;
    if(progressOf(p).hp===0){if(r.deadUntil&&now>=r.deadUntil&&!r.transfer){r.transfer=true;updateProgress(p,v=>v.hp=v.maxHp);void p.changeMap('village',content.village.spawn);}continue;}
    const hurt=now<r.hurtUntil;
    if(r.swing){
      const phase=phaseAt(r.swing,now);p.combatPhase.set(phase);
      if(phase==='attack_active')for(const e of monsters)hitMonster(p,e,now);
      if(phase==='idle'){r.swing=undefined;p.canMove=true;p.directionFixed=false;}else continue;
    }
    p.canMove=true;
    if(r.target){
      const e=map.getEvent(r.target);if(!e||monsterOf(e).hp<=0)r.target=undefined;
      else if(distance(p,e)<=sword.range-5){face(p,position(e));beginAttack(p,now);}
      else if(!r.path.length)walkTo(p,position(e));
    }
    if(r.path.length){const target=r.path[0],dx=target.x-p.x(),dy=target.y-p.y(),d=Math.hypot(dx,dy);p.clearMovements();if(d<6){r.path.shift();p.stopMoveTo();}else{face(p,target);void p.addMovement(new LinearMove({x:dx/d*160,y:dy/d*160},.04));}}
    if(Math.hypot(p.x()-r.lastPosition.x,p.y()-r.lastPosition.y)>.05){r.movingUntil=now+80;r.lastPosition=position(p);}
    p.combatPhase.set(hurt?'hurt':now<r.movingUntil?'move':'idle');portal(p);
    if(now-r.lastSave>=15000)checkpoint(p);
  }
  for(const e of monsters)stepMonster(e,players,now);
  const view={map:map.id,players:players.filter(p=>!runtime(p).transfer).map(p=>({id:p.id,name:p.name,...position(p),hp:progressOf(p).hp,phase:p.combatPhase(),direction:p.direction(),destination:runtime(p).path.at(-1)??null})),monsters:monsters.map(e=>({id:e.id,...position(e),hp:monsterOf(e).hp,state:monsterOf(e).state,generation:monsterOf(e).generation}))};
  for(const p of players){const r=runtime(p);if(!r.transfer&&p.worldView&&now-r.lastView>100){p.worldView.set(JSON.stringify(view));r.lastView=now;}}
}

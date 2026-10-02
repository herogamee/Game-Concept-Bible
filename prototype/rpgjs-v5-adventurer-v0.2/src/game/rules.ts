import { facingVector, type Facing } from './animation';
export type Phase='idle'|'move'|'attack_windup'|'attack_active'|'attack_recovery'|'hurt'|'dead';
export type SlimeState='idle'|'wander'|'chase'|'attack'|'hurt'|'dead'|'respawn';
export const sword={id:'starter-sword-slash',animation:'slash',windupMs:90,activeMs:120,recoveryMs:220,range:48,arcDegrees:100,damageMultiplier:1,hitOncePerTarget:true} as const;
export const slimeDefinition={id:'slime',level:1,maxHp:3,attack:3,exp:8,gold:2,gel:1,respawnMs:5000,aggro:120,speed:38};
export interface Progress {hp:number;maxHp:number;level:number;exp:number;nextExp:number;gold:number;potions:number;gel:number;quest:0|1|2|3;kills:number}
export const newProgress=():Progress=>({hp:30,maxHp:30,level:1,exp:0,nextExp:30,gold:20,potions:2,gel:0,quest:0,kills:0});
export interface Swing {startedAt:number;facing:Facing;hits:Set<string>}
export function phaseAt(swing:Swing|undefined, now:number):Phase {
  if(!swing)return 'idle';const age=now-swing.startedAt;
  if(age<sword.windupMs)return 'attack_windup';
  if(age<sword.windupMs+sword.activeMs)return 'attack_active';
  if(age<sword.windupMs+sword.activeMs+sword.recoveryMs)return 'attack_recovery';return 'idle';
}
export function startSwing(previous:Swing|undefined,now:number,facing:Facing):Swing|undefined {
  return phaseAt(previous,now)==='idle'?{startedAt:now,facing,hits:new Set()}:undefined;
}
export function swordCanHit(swing:Swing,now:number,id:string,hp:number,from:{x:number;y:number},to:{x:number;y:number}):boolean {
  if(phaseAt(swing,now)!=='attack_active'||hp<=0||swing.hits.has(id))return false;
  const dx=to.x-from.x,dy=to.y-from.y,dist=Math.hypot(dx,dy),v=facingVector[swing.facing];
  return dist<=sword.range&&(dist===0||(dx*v.x+dy*v.y)/dist>=Math.cos(sword.arcDegrees*Math.PI/360));
}
export function gainExp(p:Progress,amount:number) {p.exp+=amount;while(p.exp>=p.nextExp){p.exp-=p.nextExp;p.level++;p.nextExp=Math.floor(p.nextExp*1.45);p.maxHp+=5;p.hp=p.maxHp;}}
export function confirmKill(p:Progress,claim:{rewarded:boolean;hp:number}) {
  if(claim.hp>0||claim.rewarded)return false;claim.rewarded=true;
  gainExp(p,slimeDefinition.exp);p.gold+=slimeDefinition.gold;p.gel+=slimeDefinition.gel;
  if(p.quest===1){p.kills=Math.min(3,p.kills+1);if(p.kills===3)p.quest=2;}return true;
}
export function questTalk(p:Progress):string {
  if(p.quest===0){p.quest=1;p.kills=0;return 'ผู้ใหญ่บ้าน: ช่วยกำจัดสไลม์ 3 ตัวในทุ่งหญ้าทางใต้';}
  if(p.quest===1)return `ผู้ใหญ่บ้าน: สไลม์ ${p.kills}/3 ตัว`;
  if(p.quest===2){p.quest=3;p.gold+=50;gainExp(p,20);return 'เควสสำเร็จ! +50 Gold +20 EXP';}
  return 'ผู้ใหญ่บ้าน: ขอบใจมาก นักผจญภัย';
}
export function usePotion(p:Progress):boolean {if(p.hp<=0||p.hp>=p.maxHp||p.potions<=0)return false;p.potions--;p.hp=Math.min(p.maxHp,p.hp+18);return true;}
export function takeDamage(p:Progress,amount:number):Phase {p.hp=Math.max(0,p.hp-amount);return p.hp===0?'dead':'hurt';}

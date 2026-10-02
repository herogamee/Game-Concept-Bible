import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beginAttack, initMonster, stepMap, action, runtime, progressOf, monsterOf, playerSchema } from '../src/game/runtime';
import { newProgress } from '../src/game/rules';
const signal=(value:any)=>Object.assign(()=>value,{set:(v:any)=>{value=v;}});
function fixture(two=false){
  const player=(id:string)=>({id,name:id,x:signal(480),y:signal(300),direction:signal('right'),adventure:signal(JSON.stringify(newProgress())),appearance:signal('{}'),combatPhase:signal('idle'),notice:signal(''),worldView:signal(''),hp:30,level:1,canMove:true,directionFixed:false,stopMoveTo(){},clearMovements(){},setGraphic(){},setGraphicAnimation(){},moveTo(){},addMovement:async()=>{},save:async()=>({index:0}),load:async()=>({ok:false}),changeMap:async()=>{},getCurrentMap:()=>map});
  const a=player('A'),b=player('B'),e:any={...player('slime-001'),x:signal(520),setSync(schema:any){for(const[k,v]of Object.entries(schema))this[k]=signal((v as any).$default);},setHitbox(){},teleport:async()=>{},through:false};
  const map:any={id:'meadow',getPlayers:()=>two?[a,b]:[a],getEvents:()=>[e],getEvent:(id:string)=>id===e.id?e:undefined,broadcast(){}};
  initMonster(e);return {a:a as any,b:b as any,e,map};
}
test('actual server runtime damages in active only and never twice in one swing',()=>{
  const {a,e,map}=fixture();beginAttack(a,1000);stepMap(map,1089);assert.equal(monsterOf(e).hp,3);
  stepMap(map,1090);assert.equal(monsterOf(e).hp,2);stepMap(map,1100);assert.equal(monsterOf(e).hp,2);
  stepMap(map,1250);assert.equal(monsterOf(e).hp,2);assert.equal(a.combatPhase(),'attack_recovery');
});
test('two server actors racing a final hit grant exactly one reward',()=>{
  const {a,b,e,map}=fixture(true);for(const p of [a,b])p.adventure.set(JSON.stringify({...newProgress(),level:3,quest:1}));
  beginAttack(a,1000);beginAttack(b,1000);stepMap(map,1090);
  assert.equal(monsterOf(e).state,'dead');assert.equal(monsterOf(e).hp,0);
  assert.equal(progressOf(a).gel+progressOf(b).gel,1);assert.equal(progressOf(a).kills+progressOf(b).kills,1);
  stepMap(map,1100);assert.equal(progressOf(a).gel+progressOf(b).gel,1);
});
test('hurt interrupts a swing, dead player cannot attack and recovers through village',()=>{
  const {a,e,map}=fixture();e.x.set(500);a.adventure.set(JSON.stringify({...newProgress(),hp:3}));beginAttack(a,1000);
  stepMap(map,1080);assert.equal(progressOf(a).hp,0);assert.equal(a.combatPhase(),'dead');assert.equal(runtime(a).swing,undefined);
  beginAttack(a,1100);assert.equal(runtime(a).swing,undefined);stepMap(map,2081);assert.equal(progressOf(a).hp,30);assert.equal(runtime(a).transfer,true);
});
test('respawn creates a new reward generation without re-awarding the old death',()=>{
  const {a,e,map}=fixture();const graphics:string[]=[];e.setGraphic=(id:string)=>graphics.push(id);
  a.adventure.set(JSON.stringify({...newProgress(),level:3}));beginAttack(a,1000);stepMap(map,1090);assert.equal(progressOf(a).gel,1);
  assert.deepEqual(graphics,['slime-dead']);assert.equal(e.through,true);assert.equal(e.canMove,false);
  stepMap(map,6089);assert.equal(monsterOf(e).hp,0);assert.deepEqual(graphics,['slime-dead']);
  stepMap(map,6091);assert.equal(monsterOf(e).generation,2);assert.equal(monsterOf(e).hp,3);assert.equal(monsterOf(e).rewarded,false);assert.equal(progressOf(a).gel,1);
  assert.deepEqual(graphics,['slime-dead','slime']);assert.equal(e.through,false);assert.equal(e.canMove,true);
});
test('requests cannot set HP, gold, kill count or attack multiplier',()=>{
  const {a}=fixture();const before=progressOf(a);action(a,'set-stats',{hp:999,gold:999,kills:3});assert.deepEqual(progressOf(a),before);
  action(a,'walk',{x:Infinity,y:20});assert.deepEqual(runtime(a).path,[]);
});
test('keyboard cancel overrides server click navigation',()=>{const{a}=fixture();runtime(a).path=[{x:400,y:200}];runtime(a).target='slime-001';action(a,'cancel',undefined);assert.deepEqual(runtime(a).path,[]);assert.equal(runtime(a).target,undefined);});

test('touch steering expires without a release packet and rejects directions/world edges',()=>{
  const {a,map}=fixture();let moves=0;a.addMovement=async()=>{moves++;};
  action(a,'steer','teleport');assert.equal(runtime(a).steer,undefined);
  runtime(a).lastAction=0;action(a,'steer','right');const expiry=runtime(a).steer!.until;
  stepMap(map,expiry-1);assert.equal(moves,1);stepMap(map,expiry+1);assert.equal(moves,1);assert.equal(runtime(a).steer,undefined);
  runtime(a).steer={direction:'right' as any,until:expiry+1000};a.x.set(940);stepMap(map,expiry+10);assert.equal(moves,1);
  action(a,'cancel',undefined);assert.equal(runtime(a).steer,undefined);
});

test('server motion selects continuous gait without restarting it each step; attack unlocks it',()=>{
  const {a,map}=fixture();const animations:unknown[][]=[];a.setGraphicAnimation=(...args:unknown[])=>animations.push(args);
  runtime(a);a.x.set(470);stepMap(map,1000);assert.equal(a.combatPhase(),'move');assert.equal(a.animationFixed,true);assert.deepEqual(animations,[['walk']]);
  a.x.set(466);stepMap(map,1040);assert.deepEqual(animations,[['walk']]);
  stepMap(map,1121);assert.equal(a.combatPhase(),'idle');assert.deepEqual(animations,[['walk'],['stand']]);
  beginAttack(a,1200);assert.equal(a.animationFixed,false);assert.deepEqual(animations.at(-1),['slash',1]);
});

test('a persistent monster cannot camp an entrance outside its home aggro radius',()=>{
  const {a,e,map}=fixture();a.y.set(50);e.x.set(480);e.y.set(50);
  let home:any;e.moveTo=(point:any)=>{home=point;};stepMap(map,1000);
  assert.equal(progressOf(a).hp,30);assert.deepEqual(home,{x:520,y:300});
});

test('hurt still rejects attacking but permits a retreat route',()=>{
  const {a,e,map}=fixture();e.x.set(500);runtime(a).path=[{x:480,y:250}];stepMap(map,1000);assert.equal(progressOf(a).hp,27);assert.equal(runtime(a).path.length,1);
  let moves=0;a.addMovement=async()=>{moves++;};runtime(a).path=[{x:480,y:250}];
  beginAttack(a,1100);assert.equal(runtime(a).swing,undefined);stepMap(map,1100);
  assert.equal(a.canMove,true);assert.ok(moves>0);assert.equal(a.combatPhase(),'hurt');
});
test('durable progress uses RPGJS props, transient attack/view are not saved',()=>{assert.ok(playerSchema.adventure);assert.equal(playerSchema.combatPhase.$permanent,false);assert.equal(playerSchema.worldView.$permanent,false);assert.doesNotThrow(()=>JSON.parse(playerSchema.adventure.$default));});


test('departed room actors cannot autosave or pollute the active map projection',()=>{
  const {a,map}=fixture();runtime(a).transfer=true;runtime(a).lastSave=0;let saves=0;a.save=async()=>{saves++;};stepMap(map,30000);assert.equal(saves,0);assert.equal(a.worldView(),'');
});

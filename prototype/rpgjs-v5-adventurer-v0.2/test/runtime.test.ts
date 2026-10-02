import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beginAttack, initMonster, stepMap, action, runtime, progressOf, monsterOf, playerSchema } from '../src/game/runtime';
import { newProgress } from '../src/game/rules';
const signal=(value:any)=>Object.assign(()=>value,{set:(v:any)=>{value=v;}});
function fixture(two=false){
  const player=(id:string)=>({id,name:id,x:signal(300),y:signal(200),direction:signal('right'),adventure:signal(JSON.stringify(newProgress())),combatPhase:signal('idle'),notice:signal(''),worldView:signal(''),hp:30,level:1,canMove:true,directionFixed:false,stopMoveTo(){},clearMovements(){},setGraphic(){},setGraphicAnimation(){},moveTo(){},addMovement:async()=>{},save:async()=>({index:0}),load:async()=>({ok:false}),changeMap:async()=>{},getCurrentMap:()=>map});
  const a=player('A'),b=player('B'),e:any={...player('slime-001'),x:signal(340),setSync(schema:any){for(const[k,v]of Object.entries(schema))this[k]=signal((v as any).$default);},setHitbox(){},teleport:async()=>{},through:false};
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
  const {a,e,map}=fixture();e.x.set(320);a.adventure.set(JSON.stringify({...newProgress(),hp:3}));beginAttack(a,1000);
  stepMap(map,1080);assert.equal(progressOf(a).hp,0);assert.equal(a.combatPhase(),'dead');assert.equal(runtime(a).swing,undefined);
  beginAttack(a,1100);assert.equal(runtime(a).swing,undefined);stepMap(map,2081);assert.equal(progressOf(a).hp,30);assert.equal(runtime(a).transfer,true);
});
test('respawn creates a new reward generation without re-awarding the old death',()=>{
  const {a,e,map}=fixture();a.adventure.set(JSON.stringify({...newProgress(),level:3}));beginAttack(a,1000);stepMap(map,1090);assert.equal(progressOf(a).gel,1);
  stepMap(map,6091);assert.equal(monsterOf(e).generation,2);assert.equal(monsterOf(e).hp,3);assert.equal(monsterOf(e).rewarded,false);assert.equal(progressOf(a).gel,1);
});
test('requests cannot set HP, gold, kill count or attack multiplier',()=>{
  const {a}=fixture();const before=progressOf(a);action(a,'set-stats',{hp:999,gold:999,kills:3});assert.deepEqual(progressOf(a),before);
  action(a,'walk',{x:Infinity,y:20});assert.deepEqual(runtime(a).path,[]);
});
test('keyboard cancel overrides server click navigation',()=>{const{a}=fixture();runtime(a).path=[{x:400,y:200}];runtime(a).target='slime-001';action(a,'cancel',undefined);assert.deepEqual(runtime(a).path,[]);assert.equal(runtime(a).target,undefined);});
test('durable progress uses RPGJS props, transient attack/view are not saved',()=>{assert.ok(playerSchema.adventure);assert.equal(playerSchema.combatPhase.$permanent,false);assert.equal(playerSchema.worldView.$permanent,false);assert.doesNotThrow(()=>JSON.parse(playerSchema.adventure.$default));});


test('departed room actors cannot autosave or pollute the active map projection',()=>{
  const {a,map}=fixture();runtime(a).transfer=true;runtime(a).lastSave=0;let saves=0;a.save=async()=>{saves++;};stepMap(map,30000);assert.equal(saves,0);assert.equal(a.worldView(),'');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newProgress, sword, startSwing, phaseAt, swordCanHit, confirmKill, questTalk, usePotion, takeDamage } from '../src/game/rules';
import { lpcSheet } from '../src/game/animation';
import { route } from '../src/game/navigation';
import content from '../src/game/content.json';
import fs from 'node:fs';
test('windup/active/recovery boundaries and held-request protection',()=>{
  const s=startSwing(undefined,1000,'east')!;
  assert.equal(phaseAt(s,1089),'attack_windup');assert.equal(phaseAt(s,1090),'attack_active');
  assert.equal(phaseAt(s,1209),'attack_active');assert.equal(phaseAt(s,1210),'attack_recovery');assert.equal(phaseAt(s,1350),'idle');
  assert.equal(startSwing(s,1016,'east'),undefined);assert.equal(startSwing(s,1349,'east'),undefined);assert.ok(startSwing(s,1350,'east'));
});
test('damage only in active window, once per swing, alive target inside facing arc',()=>{
  const s=startSwing(undefined,0,'east')!,from={x:100,y:100},to={x:130,y:100};
  assert.equal(swordCanHit(s,89,'slime',3,from,to),false);assert.equal(swordCanHit(s,90,'slime',3,from,to),true);
  assert.equal(swordCanHit(s,90,'slime',0,from,to),false);assert.equal(swordCanHit(s,90,'back',3,from,{x:70,y:100}),false);
  s.hits.add('slime');assert.equal(swordCanHit(s,100,'slime',3,from,to),false);
  assert.equal(swordCanHit(s,211,'other',3,from,to),false);assert.equal(swordCanHit(s,100,'far',3,from,{x:200,y:100}),false);
});
test('zero HP enters dead and clamps health',()=>{const p=newProgress();assert.equal(takeDamage(p,31),'dead');assert.equal(p.hp,0);});
test('only valid server-confirmed deaths count; claim once across two contenders',()=>{
  const a=newProgress(),b=newProgress();questTalk(a);questTalk(b);
  const claim={hp:1,rewarded:false};assert.equal(confirmKill(a,claim),false);assert.equal(a.kills,0);
  claim.hp=0;assert.equal(confirmKill(a,claim),true);assert.equal(confirmKill(b,claim),false);
  assert.equal(a.kills,1);assert.equal(a.exp,8);assert.equal(a.gel,1);assert.equal(b.kills,0);assert.equal(b.gel,0);
});
test('quest becomes ready at three valid kills, turn-in and level-up are real',()=>{
  const p=newProgress();questTalk(p);for(let i=0;i<3;i++)confirmKill(p,{hp:0,rewarded:false});
  assert.equal(p.quest,2);assert.equal(p.kills,3);questTalk(p);assert.equal(p.quest,3);assert.equal(p.gold,76);
  assert.equal(p.level,2);assert.equal(p.exp,14);assert.equal(p.maxHp,35);
  questTalk(p);assert.equal(p.gold,76);
});
test('potion clamps max HP, does not waste a full-HP potion or revive dead',()=>{
  const p=newProgress();assert.equal(usePotion(p),false);assert.equal(p.potions,2);p.hp=29;assert.equal(usePotion(p),true);assert.equal(p.hp,30);assert.equal(p.potions,1);p.hp=0;assert.equal(usePotion(p),false);
});
test('click route detours around blocked water and rejects invalid destinations',()=>{
  const path=route({x:48,y:320},{x:280,y:480},content.village.blockedTiles,content.village);assert.ok(path.length);
  assert.ok(path.every(p=>!content.village.blockedTiles.includes(Math.floor(p.y/16)*60+Math.floor(p.x/16))));
  const edge=route({x:480,y:300},{x:100,y:360},content.village.blockedTiles,content.village);assert.ok(edge.length);assert.ok(!content.village.blockedTiles.includes(Math.floor(edge.at(-1)!.y/16)*60+Math.floor(edge.at(-1)!.x/16)));assert.deepEqual(route({x:320,y:224},{x:NaN,y:0},[]),[]);
});
test('semantic adapter has all LPC animations and documented death fallback',()=>{
  const s=lpcSheet();assert.equal(s.opacity,1);for(const key of ['stand','walk','slash','thrust','shoot','spellcast','hurt','dead'])assert.ok(s.textures[key]);
});
test('Tiled point IDs/properties match generated registry and collision data',()=>{
  for(const [id,map] of Object.entries(content)){
    const xml=fs.readFileSync(new URL(`../src/tiled/${id}.tmx`,import.meta.url),'utf8');
    for(const o of map.objects){assert.ok(xml.includes(`name="${o.id}"`));for(const [k,v] of Object.entries(o.properties))assert.ok(xml.includes(`name="${k}"`)&&xml.includes(`value="${v}"`));}
    const tsx=fs.readFileSync(new URL(`../src/tiled/${id}-ground.tsx`,import.meta.url),'utf8');
    assert.ok(tsx.includes('source="collision.png"')&&tsx.includes('value="true"'));
    const cells=xml.match(/<data encoding="csv">([^<]+)<\/data>/)![1].split(',').map(Number);
    assert.deepEqual(cells.flatMap((gid,i)=>gid===1?[i]:[]),map.blockedTiles);
    assert.ok(cells.every(gid=>gid===0||gid===1));
  }
});
test('selected LPC layers all retain attribution and OGA-BY alternative',()=>{
  const credits=JSON.parse(fs.readFileSync(new URL('../assets/LPC-CREDITS.json',import.meta.url),'utf8'));
  assert.equal(credits.layers.length,5);for(const l of credits.layers){assert.equal(l.selectedLicense,'OGA-BY 3.0');assert.ok(l.licenses.includes(l.selectedLicense));assert.ok(l.authors.length&&l.urls.length);}
});

test('diagonal paths cannot squeeze through blocked corners',()=>{
  const map={width:160,height:160,tileSize:16,columns:10};const blocks=[24,33];
  const from={x:24,y:24},path=route(from,{x:88,y:88},blocks,map);assert.ok(path.length>0);
  let before=from,length=0;
  for(const p of path){const d=Math.hypot(p.x-before.x,p.y-before.y);length+=d;
    for(let i=0;i<=Math.ceil(d);i++){const t=i/Math.max(1,Math.ceil(d)),x=before.x+(p.x-before.x)*t,y=before.y+(p.y-before.y)*t;assert.ok(!blocks.includes(Math.floor(y/16)*10+Math.floor(x/16)));}
    before=p;
  }
  assert.ok(length>Math.hypot(88-from.x,88-from.y));
});

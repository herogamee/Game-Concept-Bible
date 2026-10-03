import {test} from 'node:test';
import assert from 'node:assert/strict';
import {labAssets,clipFor,frameAt,customAsset,saveKeyForSearch,gameSaveKey,labSaveKey} from '../src/lab/model';
import {sword,phaseAt,startSwing,swordCanHit} from '../src/game/rules';
test('lab samples actual walk/attack frame times, including final attack hold',()=>{
 const hero=labAssets[0],walk=clipFor(hero,'walk','south'),attack=clipFor(hero,'slash','west');
 assert.equal(walk.durationMs,800);assert.equal(frameAt(walk,150),1);assert.equal(frameAt(walk,800),0);
 assert.equal(frameAt(walk,150,20),3);assert.equal(attack.durationMs,400);assert.equal(frameAt(attack,370),7);
 assert.equal(clipFor(hero,'walk','north').frames[0].y,576);assert.equal(attack.frames[0].y,960);
});
test('missing class actions remain unavailable even though runtime has fallback mappings',()=>{
 for(const action of ['shoot','thrust','spellcast','hurt','dead'] as const)assert.equal(clipFor(labAssets[0],action,'south').available,false);
 const slime=labAssets.find(a=>a.id==='slime')!;assert.equal(clipFor(slime,'dead','south').frames[0].y,288);
});
test('custom atlas requires valid dimensions, safe clips and explicitly named actions',()=>{
 const manifest={name:'mage',frameWidth:192,frameHeight:192,worldFrame:64,anchor:[.5,.625],clips:{spellcast:{row:4,count:8,fps:12,directions:true}}};
 const asset=customAsset(manifest,1536,1536);assert.equal(clipFor(asset,'spellcast','north').frames[0].y,1344);
 assert.equal(clipFor(asset,'slash','south').available,false);
 assert.throws(()=>customAsset({...manifest,frameWidth:200},1536,1536));
 assert.throws(()=>customAsset({...manifest,clips:{spellcast:{row:6,count:8,fps:12,directions:true}}},1536,1536));
 assert.throws(()=>customAsset({...manifest,clips:{spellcast:{row:4,count:9,fps:12}}},1536,1536));
});
test('game runtime lab query resolves to a separate save slot namespace',()=>{
 assert.notEqual(gameSaveKey,labSaveKey);assert.equal(saveKeyForSearch(''),gameSaveKey);assert.equal(saveKeyForSearch('?characterLab=1'),labSaveKey);
 assert.equal(saveKeyForSearch('?characterLab=0'),gameSaveKey);assert.equal(saveKeyForSearch('?x=characterLab%3D1'),gameSaveKey);
});
test('combat inspector uses actual active window, range and one hit per swing',()=>{
 const swing=startSwing(undefined,0,'east')!;
 assert.equal(phaseAt(swing,89),'attack_windup');assert.equal(swordCanHit(swing,90,'slime',3,{x:0,y:0},{x:42,y:0}),true);
 assert.equal(swordCanHit(swing,100,'slime',3,{x:0,y:0},{x:sword.range+1,y:0}),false);
 swing.hits.add('slime');assert.equal(swordCanHit(swing,110,'slime',3,{x:0,y:0},{x:42,y:0}),false);
 assert.equal(phaseAt(swing,210),'attack_recovery');
});

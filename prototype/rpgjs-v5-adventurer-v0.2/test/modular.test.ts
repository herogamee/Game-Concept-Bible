import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {modularAppearance,equipAppearance,resolvedWardrobe,appearanceGraphics,parseAppearance,defaultAppearance} from '../src/game/appearance';
import {directions,wardrobes,graphicFor,poseParts,drawRig,type PartManifest} from '../src/game/modular-rig';
import {action,playerSchema} from '../src/game/runtime';
import {newProgress} from '../src/game/rules';
test('unequipped basics resolve to defaults without changing selected slots; optional items disappear',()=>{
  let a=modularAppearance();a=equipAppearance(a,{slot:'hair',id:'hair-silver'})!;a=equipAppearance(a,{slot:'shirt',id:'shirt-blue'})!;
  assert.equal(resolvedWardrobe(a).hair,'silver');assert.equal(resolvedWardrobe(a).shirt,'blue');
  a=equipAppearance(a,{slot:'hair',id:null})!;a=equipAppearance(a,{slot:'shirt',id:null})!;a=equipAppearance(a,{slot:'weapon',id:null})!;
  assert.equal(a.slots.hair,null);assert.equal(a.slots.shirt,null);
  assert.deepEqual(resolvedWardrobe(a),{hair:'chestnut',shirt:'traveler',hat:false,weapon:false});
  assert.deepEqual(parseAppearance(JSON.stringify(a)),a);assert.deepEqual(parseAppearance('bad'),defaultAppearance());
});
test('slot/rig validation rejects paths, unknown IDs, body removal and foreign layers',()=>{
  const a=modularAppearance();
  for(const request of [{slot:'shirt',id:'hair-silver'},{slot:'weapon',id:'../../evil'},{slot:'gold',id:999},{slot:'body',id:null},{slot:'face',id:'hair-silver'},null])assert.equal(equipAppearance(a,request),null);
  assert.equal(equipAppearance(defaultAppearance(),{slot:'hair',id:'hair-silver'}),null);
  assert.deepEqual(equipAppearance(a,{slot:'body',id:'painted-adventurer'}),defaultAppearance());
  assert.equal(parseAppearance({version:1,slots:{body:'chibi-base',hair:'painted-adventurer'}}).slots.hair,null);
});
test('changing clothing preserves every joint; gait alternates and attack attaches sword to the hand',()=>{
  const skin=(parts:ReturnType<typeof poseParts>)=>parts.filter(p=>['upper-arm','forearm','hand','shorts','thigh','shin'].includes(p.part)||p.part.startsWith('head.')||p.part.startsWith('boots.'));
  for(const dir of directions)for(const action of ['walk','slash'] as const)for(let frame=0;frame<8;frame++){
    assert.deepEqual(skin(poseParts(wardrobes()[0],dir,action,frame)),skin(poseParts(wardrobes()[15],dir,action,frame)));
  }
  const walk=poseParts(wardrobes()[0],'east','walk',2),reverse=poseParts(wardrobes()[0],'east','walk',6);
  const boots=(parts:typeof walk)=>parts.filter(p=>p.part.startsWith('boots.'));
  assert.equal(boots(walk)[0].x,boots(reverse)[1].x);assert.notEqual(boots(walk)[0].y,boots(walk)[1].y);
  for(const dir of directions)for(let frame=0;frame<8;frame++){
    const parts=poseParts(wardrobes()[1],dir,'slash',frame),sword=parts.find(p=>p.part==='sword')!;
    assert.ok(parts.some(p=>p.part==='hand'&&p.x===sword.x&&Math.abs(p.y-sword.y-.5)<.0001));
    assert.equal(poseParts(wardrobes()[0],dir,'slash',frame).some(p=>p.part==='sword'),false);
  }
});
test('game cache and portrait retain matching pixels within PNG alpha roundtrip rounding',async()=>{
  const manifest=JSON.parse(await readFile('public/modular/manifest.json','utf8')) as PartManifest;
  const images:Record<string,any>={};for(const file of new Set(Object.values(manifest).map(p=>p.file)))images[file]=await loadImage(await readFile(`assets/modular/${file}`));
  for(const w of [wardrobes()[0],wardrobes()[15]]){
    const atlas=await loadImage(await readFile(`public/modular/${graphicFor(w)}.png`));assert.equal(atlas.width,1536);assert.equal(atlas.height,1536);
    for(let direction=0;direction<4;direction++)for(const [action,row,frame] of [['walk',direction,2],['slash',direction+4,4]] as const){
      const direct=createCanvas(192,192),cached=createCanvas(192,192);
      drawRig(direct.getContext('2d'),images,manifest,w,directions[direction],action,frame,3);
      cached.getContext('2d').drawImage(atlas,frame*192,row*192,192,192,0,0,192,192);
      const actual=cached.getContext('2d').getImageData(0,0,192,192).data,expected=direct.getContext('2d').getImageData(0,0,192,192).data;
      let maxAlphaError=0,squared=0;
      for(let i=0;i<actual.length;i+=4){
        maxAlphaError=Math.max(maxAlphaError,Math.abs(actual[i+3]-expected[i+3]));
        for(let channel=0;channel<3;channel++)squared+=((actual[i+channel]-expected[i+channel])*expected[i+3]/255)**2;
      }
      assert.ok(maxAlphaError<=1,`Alpha alignment error: ${maxAlphaError}`);
      assert.ok(Math.sqrt(squared/actual.length)<.15,`Visible PNG roundtrip RMS: ${Math.sqrt(squared/actual.length)}`);
    }
  }
});
test('every clothing combination keeps a transparent gutter around all 64 game frames',async()=>{
  for(const w of wardrobes()){
    const atlas=await loadImage(await readFile(`public/modular/${graphicFor(w)}.png`)),canvas=createCanvas(1536,1536),ctx=canvas.getContext('2d');ctx.drawImage(atlas,0,0);
    const pixels=ctx.getImageData(0,0,1536,1536).data;
    for(let row=0;row<8;row++)for(let col=0;col<8;col++)for(let y=0;y<192;y++)for(let x=0;x<192;x++){
      if(x>1&&x<190&&y>1&&y<190)continue;
      assert.equal(pixels[((row*192+y)*1536+col*192+x)*4+3],0,`${graphicFor(w)} frame ${col},${row} clips at ${x},${y}`);
    }
  }
});
test('actual equip action updates synchronized permanent appearance and save, preserving combat stats',async()=>{
  const signal=(v:any)=>Object.assign(()=>v,{set:(next:any)=>{v=next;}});let saves=0,graphics:unknown;
  const p:any={appearance:signal(JSON.stringify(modularAppearance())),adventure:signal(JSON.stringify(newProgress())),x:signal(0),y:signal(0),notice:signal(''),stopMoveTo(){},clearMovements(){},setGraphic(v:unknown){graphics=v;},setGraphicAnimation(){},save:async()=>{saves++;}};
  const before=p.adventure();action(p,'equip',{slot:'shirt',id:'shirt-blue',gold:999,damage:999});
  assert.equal(p.adventure(),before);assert.equal(parseAppearance(p.appearance()).slots.shirt,'shirt-blue');
  assert.deepEqual(graphics,appearanceGraphics(parseAppearance(p.appearance())));await Promise.resolve();assert.equal(saves,1);
  assert.equal('$permanent' in playerSchema.appearance,false);
});

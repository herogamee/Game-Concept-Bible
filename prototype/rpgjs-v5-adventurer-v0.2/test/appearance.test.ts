import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaultAppearance,normalizeAppearance,parseAppearance,appearanceGraphics,appearanceCatalog,type AppearanceAsset} from '../src/game/appearance';
import {renderResolution} from '../src/game/display-quality';
import {playerSchema,applyAppearance} from '../src/game/runtime';
test('old/corrupt saves migrate safely; cosmetic schema is permanent',()=>{
  for(const value of [undefined,'bad-json','{}','{"version":99}'])assert.deepEqual(parseAppearance(value),defaultAppearance());
  assert.deepEqual(JSON.parse(playerSchema.appearance.$default),defaultAppearance());
  assert.equal('$permanent' in playerSchema.appearance,false);
});
test('appearance accepts only catalog IDs for the right slot and rig',()=>{
  const value={version:1,slots:{body:'painted-adventurer',shirt:'adventurer',weapon:'../../hack',hair:'painted-adventurer'},gold:999};
  assert.deepEqual(normalizeAppearance(value),defaultAppearance());
});
test('transparent layers resolve in defined order without changing combat data',()=>{
  const catalog:AppearanceAsset[]=[...appearanceCatalog,{id:'test-shirt',slot:'shirt',graphic:'shirt-layer',rig:'painted-v1',license:'test-only'},{id:'test-hat',slot:'hat',graphic:'hat-layer',rig:'painted-v1',license:'test-only'}];
  assert.deepEqual(appearanceGraphics({version:1,slots:{hat:'test-hat',shirt:'test-shirt'}},catalog),['adventurer','shirt-layer','hat-layer']);
  let stored='bad';let graphics:unknown;const p:any={appearance:Object.assign(()=>stored,{set:(v:string)=>stored=v}),setGraphic:(v:unknown)=>graphics=v,adventure:'unchanged'};
  applyAppearance(p);assert.deepEqual(graphics,['adventurer']);assert.equal(p.adventure,'unchanged');assert.deepEqual(JSON.parse(stored),defaultAppearance());
});
test('physical resolution respects CSS scale, DPR and GPU cap without changing world size',()=>{
  assert.equal(renderResolution(1280,1,'smooth'),1.6);assert.equal(renderResolution(800,2,'smooth'),2);
  assert.equal(renderResolution(1920,3,'smooth'),3);assert.equal(renderResolution(1280,2,'pixel'),1);assert.equal(renderResolution(NaN,NaN,'smooth'),1);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaultAppearance,normalizeAppearance,parseAppearance,appearanceGraphics,appearanceCatalog,type AppearanceAsset} from '../src/game/appearance';
import {renderResolution} from '../src/game/display-quality';
import {playerSchema,applyAppearance} from '../src/game/runtime';
import {viewportSize,cameraPosition} from '../src/game/viewport';
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
test('portrait, landscape and desktop cameras crop consistently without distorting world units',()=>{
  for(const [width,height]of [[1920,1080],[1024,768],[390,844],[844,390]]){
    const view=viewportSize(width,height);assert.ok(view.width<=800&&view.height<=450);
    assert.ok(Math.abs(view.width/view.height-width/height)<.003);
    const camera=cameraPosition({x:950,y:530},view,{width:960,height:540});
    assert.equal(camera.x,960-view.width);assert.equal(camera.y,540-view.height);
    const at={x:100,y:150},scale=width/view.width;
    assert.ok(Math.abs((at.x*scale)/width*view.width-at.x)<1e-8);
    assert.ok(Math.abs((at.y*height/view.height)/height*view.height-at.y)<1e-8);
  }
  assert.deepEqual(viewportSize(0,NaN),{width:800,height:450});
});

test('camera distance reveals more world with uniform scaling and stays inside the map',()=>{
  const near=viewportSize(1920,1080,100),far=viewportSize(1920,1080,125);
  assert.ok(far.width>near.width&&far.height>near.height);
  assert.deepEqual(far,{width:960,height:540});
  for(const [w,h]of [[3840,2160],[1645,1244],[390,844]]){
    const view=viewportSize(w,h,150);assert.ok(view.width<=960&&view.height<=540);assert.ok(Math.abs(view.width/view.height-w/h)<.006);
    const at=cameraPosition({x:480,y:300},view,{width:960,height:540},.75);assert.ok(at.x>=0&&at.y>=0);
  }
  const view=viewportSize(800,450,80);
  assert.ok(cameraPosition({x:480,y:300},view,{width:960,height:540},.75).y<cameraPosition({x:480,y:300},view,{width:960,height:540},.5).y);
});

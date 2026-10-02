// Reuse original v0.1 runtime art. Never read or change its saves/runtime files.
import fs from 'node:fs';
import vm from 'node:vm';
import { createCanvas, loadImage } from '@napi-rs/canvas';
const root = new URL('../', import.meta.url);
const reference = new URL('../web-pixel-rpg-v0.1/', root);
const output = new URL('public/willowbrook/', root);
fs.mkdirSync(output, {recursive:true});
const props = {};
for (const name of ['house','tree','rock','bush','flower','fence','sign','well','lamp','house-blue','market','planter','reeds','barrels','bridge','rune']) {
  const source = new URL(`assets/painted/${name}.png`, reference);
  const image = await loadImage(fs.readFileSync(source));
  props[name] = {width:image.width,height:image.height};
  fs.copyFileSync(source,new URL(`${name}.png`,output));
}
for (const name of ['adventurer','slime']) fs.copyFileSync(new URL(`assets/painted/${name}.png`,reference),new URL(`${name}.png`,output));
const npcs=await loadImage(fs.readFileSync(new URL('assets/painted/npcs.png',reference)));
for(const [column,role] of ['elder','merchant','guide'].entries()) {
  const canvas=createCanvas(64,192),context=canvas.getContext('2d');context.imageSmoothingEnabled=false;
  for(let row=0;row<3;row++)context.drawImage(npcs,column*npcs.width/3,row*npcs.height/3,npcs.width/3,npcs.height/3,0,row*64,64,64);
  fs.writeFileSync(new URL(`npc-${role}.png`,output),canvas.toBuffer('image/png'));
}
const flower=await loadImage(fs.readFileSync(new URL('flower.png',output)));
const sandbox={document:{createElement:()=>createCanvas(1,1)},Art:{object:()=>flower}};
vm.runInNewContext(fs.readFileSync(new URL('src/world.js',reference),'utf8')+';this.referenceWorld=World;this.referenceGround=ground;',sandbox);
for(const [id,key] of [['village','v'],['meadow','f']]) {
  const canvas=createCanvas(960,544),context=canvas.getContext('2d');
  context.drawImage(sandbox.referenceGround(key),0,0);
  context.fillStyle='#79966a';context.fillRect(0,540,960,4);
  fs.writeFileSync(new URL(`src/tiled/${id}-ground.png`,root),canvas.toBuffer('image/png'));
}
fs.writeFileSync(new URL('tools/parity-world.json',root),JSON.stringify({world:sandbox.referenceWorld,props},null,2));
console.log('Original painted sprites, distinct NPC frames and deterministic v1 terrain adapted.');

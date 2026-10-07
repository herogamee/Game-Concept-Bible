import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import fs from 'node:fs';
import {paintedSheet,paintedSupportingSheets} from '../src/game/animation';
import props from '../src/game/props.json';
test('authored HD sheets decode, retain logical footprints and have usable separated frames',async()=>{
 const sheets=[paintedSheet(),...paintedSupportingSheets().filter(s=>s.id==='slime'||s.id.startsWith('npc-'))];
 for(const sheet of sheets){
  const im=await loadImage(fs.readFileSync(new URL(`../public/${sheet.image}`,import.meta.url)));
  assert.equal(im.width,sheet.width);assert.equal(im.height,sheet.height);
  const scale=sheet.displayScale;assert.equal(sheet.rectWidth*scale,sheet.id==='slime'?48:64);
 }
 const hero=paintedSheet(),im=await loadImage(fs.readFileSync(new URL(`../public/${hero.image}`,import.meta.url)));
 const canvas=createCanvas(192,192),ctx=canvas.getContext('2d');
 for(let row=0;row<8;row++)for(let column=0;column<8;column++){
  ctx.clearRect(0,0,192,192);ctx.drawImage(im,column*192,row*192,192,192,0,0,192,192);
  const pixels=ctx.getImageData(0,0,192,192).data;let count=0,bottom=0;
  for(let y=0;y<192;y++)for(let x=0;x<192;x++)if(pixels[(y*192+x)*4+3]>127){count++;bottom=Math.max(bottom,y+1);assert.ok(x>=8&&x<184&&y>=8&&y<184,`frame ${row}/${column} lost its transparent gutter`);}
  assert.ok(count>1500,`frame ${row}/${column} is empty or incomplete`);
  if(row<4)assert.equal(bottom,172,`walk feet drift in frame ${row}/${column}`);
 }
});
test('HD scenery and ground exports preserve authored map boxes',async()=>{
 for(const [name,box] of Object.entries(props)){
  const image=await loadImage(fs.readFileSync(new URL(`../public/willowbrook/hd/${name}.png`,import.meta.url)));
  assert.deepEqual([image.width/2,image.height/2],[box.width,box.height],`${name} changed its world footprint`);
 }
 for(const map of ['village','meadow']){
  const image=await loadImage(fs.readFileSync(new URL(`../public/willowbrook/hd/${map}-ground.png`,import.meta.url)));
  assert.deepEqual([image.width/2,image.height/2],[960,544]);
 }
});

import { Direction, Animation } from '@rpgjs/common';
export type CharacterAnim = 'idle'|'walk'|'slash'|'thrust'|'shoot'|'spellcast'|'hurt'|'dead';
export type Facing = 'north'|'west'|'south'|'east';
export const facingVector = { north:{x:0,y:-1},west:{x:-1,y:0},south:{x:0,y:1},east:{x:1,y:0} };
export function facingOf(direction: Direction): Facing {
  return ({up:'north',left:'west',down:'south',right:'east'} as const)[direction] ?? 'south';
}
// All raw LPC indices live here, including the explicitly temporary death fallback.
const rows = { spellcast:0, thrust:4, walk:8, slash:12, shoot:16, hurt:20 };
const counts = { spellcast:7, thrust:8, walk:9, slash:6, shoot:13, hurt:6 };
const keys: Record<CharacterAnim,string> = {idle:Animation.Stand,walk:Animation.Walk,slash:'slash',thrust:'thrust',shoot:'shoot',spellcast:'spellcast',hurt:'hurt',dead:'dead'};
export const engineAnimation = (animation:CharacterAnim) => keys[animation];
export function lpcSheet() {
  const textures: Record<string,unknown> = {};
  for (const semantic of Object.keys(keys) as CharacterAnim[]) {
    const source = semantic==='idle'?'walk':semantic==='dead'?'hurt':semantic;
    const count = semantic==='idle'||semantic==='dead'?1:counts[source];
    textures[keys[semantic]] = {
      offset:{x:0,y:rows[source]*64},framesWidth:count,framesHeight:source==='hurt'?1:4,
      animations:({direction}:{direction:Direction}) => {
        const row = source==='hurt'?0:{north:0,west:1,south:2,east:3}[facingOf(direction)];
        const frames=Array.from({length:count},(_,f)=>({time:f*(semantic==='slash'?4:6),frameX:semantic==='dead'?5:f,frameY:row}));
        return [[...frames,{time:count*(semantic==='slash'?4:6)}]];
      }
    };
  }
  return {id:'adventurer',image:'spritesheets/adventurer-lpc.png',width:832,height:1344,rectWidth:64,rectHeight:64,framesWidth:13,framesHeight:21,spriteRealSize:{width:32,height:48},opacity:1,textures};
}

import { Direction, Animation } from '@rpgjs/common';
import props from './props.json';
export type CharacterAnim = 'idle'|'walk'|'slash'|'thrust'|'shoot'|'spellcast'|'hurt'|'dead';
export type Facing = 'north'|'west'|'south'|'east';
export const facingVector = { north:{x:0,y:-1},west:{x:-1,y:0},south:{x:0,y:1},east:{x:1,y:0} };
export function facingOf(direction: Direction): Facing {
  return ({up:'north',left:'west',down:'south',right:'east'} as const)[direction] ?? 'south';
}

// v0.1 painted sheet layout is independent of LPC's frame order.
// Hurt/dead hold the readable idle frame: red feedback is separate from opacity.
export function paintedSheet() {
  const textures: Record<string,unknown> = {};
  for(const semantic of Object.keys(keys) as CharacterAnim[]) {
    const attack=['slash','thrust','shoot','spellcast'].includes(semantic);
    const count=semantic==='walk'||attack?8:1;
    textures[keys[semantic]]={offset:{x:0,y:attack?256:0},framesWidth:8,framesHeight:4,
      animations:({direction}:{direction:Direction})=>{
        const row={south:0,west:1,east:2,north:3}[facingOf(direction)];
        return [[...Array.from({length:count},(_,frameX)=>({time:frameX*(attack?2.5:6),frameX,frameY:row})),{time:count*(attack?3:6)}]];
      }};
  }
  return {id:'adventurer',image:'willowbrook/adventurer.png',width:512,height:512,rectWidth:64,rectHeight:64,framesWidth:8,framesHeight:8,anchor:[.5,.625],opacity:1,textures};
}
export function paintedSupportingSheets() {
  const animated=(id:string,image:string,size:number,columns:number,rows:number,standRow=0,walkRow=0)=>({
    id,image,width:size*columns,height:size*rows,rectWidth:size,rectHeight:size,framesWidth:columns,framesHeight:rows,anchor:[.5,.625],opacity:1,
    textures:Object.fromEntries([[Animation.Stand,standRow],[Animation.Walk,walkRow]].map(([key,row])=>[key,{offset:{x:0,y:Number(row)*size},framesWidth:columns,framesHeight:1,animations:()=>[[...Array.from({length:columns},(_,frameX)=>({time:frameX*12,frameX,frameY:0})),{time:columns*12}]]}]))
  });
  return [animated('slime','willowbrook/slime.png',48,4,4,0,1),
    // A nonempty invisible graphic replaces the cached live sprite reliably.
    {...animated('slime-dead','willowbrook/slime.png',48,4,4,0,1),opacity:0},
    ...['elder','merchant','guide'].map(role=>({id:`npc-${role}`,image:`willowbrook/npc-${role}.png`,width:64,height:192,rectWidth:64,rectHeight:64,framesWidth:1,framesHeight:3,anchor:[.5,.625],opacity:1,textures:{[Animation.Stand]:{animations:()=>[[{time:0,frameX:0,frameY:0},{time:24,frameX:0,frameY:1},{time:48,frameX:0,frameY:2},{time:72}]]}}})),
    ...Object.entries(props).map(([name,{width,height}])=>({id:`prop-${name}`,image:`willowbrook/${name}.png`,width,height,rectWidth:width,rectHeight:height,framesWidth:1,framesHeight:1,anchor:[.5,1],opacity:1,textures:{[Animation.Stand]:{animations:()=>[[{time:0,frameX:0,frameY:0},{time:60}]]}}}))];
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

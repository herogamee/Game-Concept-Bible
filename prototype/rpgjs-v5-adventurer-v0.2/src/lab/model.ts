import {Direction} from '@rpgjs/common';
import {paintedSheet,paintedSupportingSheets,type Facing,type CharacterAnim} from '../game/animation';
export type LabAction=CharacterAnim;
export interface LabFrame {x:number;y:number;atMs:number}
export interface LabClip {frames:LabFrame[];durationMs:number;fps:number;available:boolean;message:string}
export interface CustomClip {row:number;count:number;fps:number;directions?:boolean}
export interface LabAsset {id:string;name:string;sheet:any;supported:LabAction[];foot?:number;customClips?:Partial<Record<LabAction,CustomClip>>}
const hero=paintedSheet(),support=paintedSupportingSheets();
const oldSheet=(hd:boolean)=>({...hero,image:hd?'willowbrook/hd/adventurer.png':'willowbrook/adventurer.png',width:hd?1024:512,height:hd?1024:512,rectWidth:hd?128:64,rectHeight:hd?128:64,displayScale:hd?.5:1,textures:Object.fromEntries(Object.entries(hero.textures).map(([key,value])=>[key,{...(value as any),offset:{x:0,y:(value as any).offset.y?(hd?512:256):0}}]))});
export const labAssets:LabAsset[]=[{id:'chibi',name:'Chibi v2',sheet:hero,supported:['idle','walk','slash'],foot:172},{id:'painted',name:'Painted v1 · 64px',sheet:oldSheet(false),supported:['idle','walk','slash']},{id:'painted-hd',name:'Painted v1 · HD',sheet:oldSheet(true),supported:['idle','walk','slash']},...['elder','merchant','guide'].map(id=>({id,name:{elder:'ผู้ใหญ่บ้าน',merchant:'พ่อค้า',guide:'รุ่นพี่'}[id]!,sheet:support.find(s=>s.id===`npc-${id}`),supported:['idle'] as LabAction[]})),{id:'slime',name:'Slime',sheet:support.find(s=>s.id==='slime'),supported:['idle','walk','hurt','dead']}];
const animationKey={idle:'stand',walk:'walk',slash:'slash',hurt:'hurt',dead:'dead',shoot:'shoot',thrust:'thrust',spellcast:'spellcast'};
const directions={north:Direction.Up,south:Direction.Down,west:Direction.Left,east:Direction.Right};
export function clipFor(asset:LabAsset,action:LabAction,facing:Facing):LabClip{
 if(!asset.supported.includes(action))return {frames:[],durationMs:0,fps:0,available:false,message:'ยังไม่มีท่านี้ในชุดภาพจริง — ไม่ใช้ท่าอื่นแทน'};
 const s=asset.sheet;
 const custom=asset.customClips?.[action];
 if(custom){const offset=custom.directions?{south:0,west:1,east:2,north:3}[facing]:0;
  return {frames:Array.from({length:custom.count},(_,i)=>({x:i*s.rectWidth,y:(custom.row+offset)*s.rectHeight,atMs:i*1000/custom.fps})),durationMs:custom.count*1000/custom.fps,fps:custom.fps,available:true,message:'ชุดภาพนำเข้าเพื่อทดสอบ — ยังไม่ติดตั้งลงเกม'};
 }
 // Slime source has dedicated hit/death rows that the game hides after death.
 if(asset.id==='slime'&&(action==='hurt'||action==='dead'))return {frames:Array.from({length:4},(_,i)=>({x:i*s.rectWidth,y:(action==='hurt'?2:3)*s.rectHeight,atMs:i*200})),durationMs:800,fps:5,available:true,message:'แถวภาพจริงของ Slime; การตายใน runtime ใช้การซ่อน sprite'};
 const texture=s.textures[animationKey[action]],entries=texture.animations({direction:directions[facing]})[0];
 const frames=entries.filter(f=>f.frameX!==undefined).map(f=>({x:(texture.offset?.x??0)+f.frameX*s.rectWidth,y:(texture.offset?.y??0)+f.frameY*s.rectHeight,atMs:f.time*1000/60}));
 const durationMs=entries.at(-1).time*1000/60;
 const fps=frames.length>1?1000/(frames[1].atMs-frames[0].atMs):10;
 return {frames,durationMs,fps,available:true,message:asset.id==='chibi'?'ใช้ไฟล์และลำดับเฟรมเดียวกับเกมจริง':'ภาพที่มีอยู่จริงในโปรเจค'};
}
export function frameAt(clip:LabClip,elapsed:number,previewFps=clip.fps,loop=true){
 if(!clip.frames.length)return 0;const ratio=clip.fps/previewFps,duration=clip.durationMs*ratio;
 const t=loop?Math.max(0,elapsed)%duration:Math.min(Math.max(0,elapsed),duration);
 let index=0;clip.frames.forEach((frame,i)=>{if(frame.atMs*ratio<=t)index=i;});return index;
}
export {gameSaveKey,labSaveKey,saveKeyForSearch} from '../game/save-key';
export function customAsset(manifest:any,width:number,height:number):LabAsset{
 const {frameWidth,frameHeight,worldFrame,anchor,clips}=manifest;
 if(![frameWidth,frameHeight].every(v=>Number.isInteger(v)&&v>0)||width%frameWidth||height%frameHeight)throw new Error('ขนาดช่องต้องหารขนาดภาพลงตัว');
 if(!Number.isFinite(worldFrame)||worldFrame<=0||worldFrame>512)throw new Error('worldFrame ต้องอยู่ระหว่าง 0–512');
 if(!Array.isArray(anchor)||anchor.length!==2||!anchor.every(v=>Number.isFinite(v)&&v>=0&&v<=1))throw new Error('anchor ต้องเป็นตัวเลข 0–1 สองค่า');
 const supported=Object.keys(clips??{}) as LabAction[];
 if(!supported.length)throw new Error('ต้องมี clip อย่างน้อยหนึ่งท่า');
 for(const action of supported){const c=clips[action];if(!Object.prototype.hasOwnProperty.call(animationKey,action)||!Number.isInteger(c.row)||c.row<0||!Number.isInteger(c.count)||c.count<1||c.count>width/frameWidth||!Number.isFinite(c.fps)||c.fps<.5||c.fps>30||(c.row+(c.directions?4:1))*frameHeight>height)throw new Error(`ข้อมูลท่า ${action} เกินกริด หรือ FPS อยู่นอก 0.5–30`);}
 return {id:'custom',name:String(manifest.name??'ตัวทดลอง').slice(0,80),sheet:{image:'local-upload',width,height,rectWidth:frameWidth,rectHeight:frameHeight,displayScale:worldFrame/frameWidth,anchor},supported,customClips:clips};
}

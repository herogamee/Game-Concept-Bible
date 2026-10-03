import type { RpgClientEngine } from '@rpgjs/client';
import maps from './content.json';
import {signal} from 'canvasengine';
import {renderResolution,type DisplayQuality} from './display-quality';
import {viewportSize,cameraPosition} from './viewport';
let quality:DisplayQuality='smooth',lastTextureCheck=0;
let distance=window.innerWidth>=600?125:100,framing=67,cameraMode='steady';
let lastCameraFrame=0,lastMap='',resetCamera=true;
const renderFrames:number[]=[];let lastRenderFrame=0,lastDiagnostics=0,maxSceneryDrift=0;
let lastMotion={x:0,y:0,time:0};const motionIntervals:number[]=[];
const sceneryNodes=new Map<string,{node:any;x:number;y:number}>();
export function registerScenery(id:string,node:any,x:number,y:number){sceneryNodes.set(id,{node,x,y});return ()=>{if(sceneryNodes.get(id)?.node===node)sceneryNodes.delete(id);};}
try{const saved=JSON.parse(localStorage.getItem('willowbrook-camera-v02')||'null');if(saved){if(saved.distance>=80&&saved.distance<=150)distance=saved.distance;if(saved.framing>=50&&saved.framing<=75)framing=saved.framing;if(['steady','follow'].includes(saved.mode))cameraMode=saved.mode;}}catch{}
export function cameraSettings(){return {distance,framing,mode:cameraMode};}
export function setCameraSettings(value:Partial<ReturnType<typeof cameraSettings>>){
  if(value.distance!==undefined&&Number.isFinite(value.distance))distance=Math.max(80,Math.min(150,value.distance));
  if(value.framing!==undefined&&Number.isFinite(value.framing))framing=Math.max(50,Math.min(75,value.framing));
  if(value.mode&&['steady','follow'].includes(value.mode))cameraMode=value.mode;
  try{localStorage.setItem('willowbrook-camera-v02',JSON.stringify(cameraSettings()));}catch{}
  resetCamera=true;updateCamera();
}
try{if(localStorage.getItem('willowbrook-display-v02')==='pixel')quality='pixel';}catch{}
export function displayQuality(){return quality;}
export function setDisplayQuality(value:string){quality=value==='pixel'?'pixel':'smooth';lastTextureCheck=0;try{localStorage.setItem('willowbrook-display-v02',quality);}catch{}updateCamera();}
let viewport:any=null,engine:RpgClientEngine;
export const camera={x:0,y:0};
export const viewSize={width:800,height:450};
export const groundImage=signal('');
export function setGroundMap(map:string){if(map in maps){const url=`${import.meta.env.BASE_URL}willowbrook/hd/${map}-ground.png`;if(groundImage()!==url)groundImage.set(url);}}
export function attachCamera(value:any){viewport=value;resetCamera=true;lastCameraFrame=0;}
export function setPresentationEngine(value:RpgClientEngine){engine=value;}
export function canvasPoint(event:PointerEvent,canvas:HTMLCanvasElement){
  if(!viewport)return null;const rect=canvas.getBoundingClientRect();
  // RPGJS native pointer tracking assumes an unscaled CSS canvas. Our fixed
  // logical viewport needs this explicit screen-to-world adapter.
  return {x:camera.x+(event.clientX-rect.left)*viewSize.width/rect.width,y:camera.y+(event.clientY-rect.top)*viewSize.height/rect.height};
}
export function updateCamera(){
  const p=engine?.getCurrentPlayer() as any;if(!p||!viewport)return;
  const canvas=engine.renderer.canvas as HTMLCanvasElement,rect=canvas.getBoundingClientRect();
  const size=viewportSize(rect.width,rect.height,distance);
  if(size.width!==viewSize.width||size.height!==viewSize.height)resetCamera=true;
  Object.assign(viewSize,size);
  const resolution=renderResolution(rect.width,window.devicePixelRatio,quality,viewSize.width);
  canvas.style.imageRendering=quality==='pixel'?'pixelated':'auto';
  if(engine.renderer.screen.width!==viewSize.width||engine.renderer.screen.height!==viewSize.height||engine.renderer.resolution!==resolution){
    engine.width.set(String(viewSize.width));engine.height.set(String(viewSize.height));engine.renderer.resize(viewSize.width,viewSize.height,resolution);
  }
  const now=performance.now();if(now-lastTextureCheck>1000||lastTextureCheck===0){
    lastTextureCheck=now;const walk=(node:any)=>{const style=node.texture?.source?.style,mode=quality==='pixel'?'nearest':'linear';if(style&&style.scaleMode!==mode)style.scaleMode=mode;for(const child of node.children??[])walk(child);};walk(viewport);
    document.getElementById('render-quality-info')?.replaceChildren(document.createTextNode(`${quality==='smooth'?'ภาพเรียบ':'พิกเซลเดิม'} · ${canvas.width}×${canvas.height} backing`));
  }
  if(Math.hypot(Number(p.x())-lastMotion.x,Number(p.y())-lastMotion.y)>.01){
    if(lastMotion.time&&now-lastMotion.time<250)motionIntervals.push(now-lastMotion.time);
    if(motionIntervals.length>300)motionIntervals.shift();lastMotion={x:Number(p.x()),y:Number(p.y()),time:now};
  }
  const room=engine.getCurrentRoom();if(!('id' in room))return;
  const map=(maps as any)[room.id];if(!map)return;
  // v0.1 leaves more of the village visible above the hero.
  const target=cameraPosition({x:Number(p.x()),y:Number(p.y())},viewSize,map,framing/100);
  if(lastMap!==room.id){lastMap=room.id;resetCamera=true;maxSceneryDrift=0;}
  const dt=Math.min(50,Math.max(0,now-lastCameraFrame));lastCameraFrame=now;
  if(resetCamera||Math.hypot(camera.x-target.x,camera.y-target.y)>180){Object.assign(camera,target);resetCamera=false;}
  else{
    // A small dead zone keeps scenery still during short steps; frame-time easing
    // avoids exposing each authoritative position update as a camera jump.
    const radius=cameraMode==='steady'?32:0,alpha=1-Math.exp(-dt/65);
    for(const axis of ['x','y'] as const){const delta=target[axis]-camera[axis];if(Math.abs(delta)>radius)camera[axis]+=(delta-Math.sign(delta)*radius)*alpha;}
  }
  if(engine.cameraFollowTargetId()!=='parity-camera')engine.setCameraFollow('parity-camera',false);
  // The engine resizes its viewport to the host window even when the renderer
  // is fixed-size. Translate directly in our logical space instead of asking
  // moveCenter() to infer the visible dimensions from that host window.
  // The built-in clamp/follow plugins use host-window dimensions and can undo
  // our logical-space translation later in the same frame. This camera owns it.
  viewport.plugins?.pause('clamp');viewport.plugins?.pause('follow');
  if(viewport.screenWidth!==viewSize.width||viewport.screenHeight!==viewSize.height||viewport.worldWidth!==map.width||viewport.worldHeight!==map.height)viewport.resize(viewSize.width,viewSize.height,map.width,map.height);
  viewport.position.set(-camera.x,-camera.y);
  if(lastRenderFrame&&now-lastRenderFrame<250)renderFrames.push(now-lastRenderFrame);lastRenderFrame=now;if(renderFrames.length>600)renderFrames.shift();
  for(const [id,prop] of sceneryNodes){
    if(!id.startsWith(`prop-${room.id}-`)||prop.node.destroyed)continue;
    const object=engine.getObjectById(id) as any;
    if(object)prop.node.position.set(prop.x-Number(object.x()),prop.y-Number(object.y()));
    const at=viewport.toLocal(prop.node.getGlobalPosition());maxSceneryDrift=Math.max(maxSceneryDrift,Math.hypot(at.x-prop.x,at.y-prop.y));
  }
  if(now-lastDiagnostics>500){
    lastDiagnostics=now;const node=document.getElementById('camera-info');if(node&&renderFrames.length){const sorted=[...renderFrames].sort((a,b)=>a-b);node.textContent=`Render ${Math.round(1000/(renderFrames.reduce((a,b)=>a+b,0)/renderFrames.length))} FPS · p95 ${sorted[Math.floor(sorted.length*.95)].toFixed(1)} ms · ${renderFrames.length} frames · view ${viewSize.width}×${viewSize.height} · scenery drift ${maxSceneryDrift.toFixed(2)} px · motion ${motionIntervals.length?Math.round(1000/(motionIntervals.reduce((a,b)=>a+b,0)/motionIntervals.length)):0} Hz`;node.dataset.camera=JSON.stringify({...camera});node.dataset.scenery=JSON.stringify(map.objects.filter((o:any)=>o.type==='prop').map((o:any)=>{const object=engine.getObjectById(o.id) as any;return {id:o.id,authored:[o.x,o.y],live:object?[Number(object.x()),Number(object.y())]:null};}));}
  }
}

import type { RpgClientEngine } from '@rpgjs/client';
import maps from './content.json';
import {signal} from 'canvasengine';
import {renderResolution,type DisplayQuality} from './display-quality';
import {viewportSize,cameraPosition} from './viewport';
let quality:DisplayQuality='smooth',lastTextureCheck=0;
try{if(localStorage.getItem('willowbrook-display-v02')==='pixel')quality='pixel';}catch{}
export function displayQuality(){return quality;}
export function setDisplayQuality(value:string){quality=value==='pixel'?'pixel':'smooth';lastTextureCheck=0;try{localStorage.setItem('willowbrook-display-v02',quality);}catch{}updateCamera();}
let viewport:any=null,engine:RpgClientEngine;
export const camera={x:0,y:0};
export const viewSize={width:800,height:450};
export const groundImage=signal('');
export function setGroundMap(map:string){if(map in maps){const url=`${import.meta.env.BASE_URL}map/${map}-ground.png`;if(groundImage()!==url)groundImage.set(url);}}
export function attachCamera(value:any){viewport=value;}
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
  Object.assign(viewSize,viewportSize(rect.width,rect.height));
  const resolution=renderResolution(rect.width,window.devicePixelRatio,quality,viewSize.width);
  canvas.style.imageRendering=quality==='pixel'?'pixelated':'auto';
  if(engine.renderer.screen.width!==viewSize.width||engine.renderer.screen.height!==viewSize.height||engine.renderer.resolution!==resolution){
    engine.width.set(String(viewSize.width));engine.height.set(String(viewSize.height));engine.renderer.resize(viewSize.width,viewSize.height,resolution);
  }
  const now=performance.now();if(now-lastTextureCheck>500||lastTextureCheck===0){
    lastTextureCheck=now;const walk=(node:any)=>{if(node.texture?.source?.style)node.texture.source.style.scaleMode=quality==='pixel'?'nearest':'linear';for(const child of node.children??[])walk(child);};walk(viewport);
    document.getElementById('render-quality-info')?.replaceChildren(document.createTextNode(`${quality==='smooth'?'ภาพเรียบ':'พิกเซลเดิม'} · ${canvas.width}×${canvas.height} backing`));
  }
  const room=engine.getCurrentRoom();if(!('id' in room))return;
  const map=(maps as any)[room.id];if(!map)return;
  // v0.1 leaves more of the village visible above the hero.
  Object.assign(camera,cameraPosition({x:Number(p.x()),y:Number(p.y())},viewSize,{width:map.width,height:540}));
  if(engine.cameraFollowTargetId()!=='parity-camera')engine.setCameraFollow('parity-camera',false);
  // The engine resizes its viewport to the host window even when the renderer
  // is fixed-size. Translate directly in our logical space instead of asking
  // moveCenter() to infer the visible dimensions from that host window.
  viewport.position.set(-camera.x,-camera.y);
}

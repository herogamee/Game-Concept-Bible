import type { RpgClientEngine } from '@rpgjs/client';
import maps from './content.json';
import {signal} from 'canvasengine';
import {renderResolution,type DisplayQuality} from './display-quality';
let quality:DisplayQuality='smooth',lastTextureCheck=0;
try{if(localStorage.getItem('willowbrook-display-v02')==='pixel')quality='pixel';}catch{}
export function displayQuality(){return quality;}
export function setDisplayQuality(value:string){quality=value==='pixel'?'pixel':'smooth';lastTextureCheck=0;try{localStorage.setItem('willowbrook-display-v02',quality);}catch{}updateCamera();}
let viewport:any=null,engine:RpgClientEngine;
export const camera={x:0,y:0};
export const groundImage=signal('');
export function setGroundMap(map:string){if(map in maps){const url=`${import.meta.env.BASE_URL}map/${map}-ground.png`;if(groundImage()!==url)groundImage.set(url);}}
export function attachCamera(value:any){viewport=value;}
export function setPresentationEngine(value:RpgClientEngine){engine=value;}
export function canvasPoint(event:PointerEvent,canvas:HTMLCanvasElement){
  if(!viewport)return null;const rect=canvas.getBoundingClientRect();
  // RPGJS native pointer tracking assumes an unscaled CSS canvas. Our fixed
  // logical viewport needs this explicit screen-to-world adapter.
  return {x:camera.x+(event.clientX-rect.left)*800/rect.width,y:camera.y+(event.clientY-rect.top)*450/rect.height};
}
export function updateCamera(){
  const p=engine?.getCurrentPlayer() as any;if(!p||!viewport)return;
  const canvas=engine.renderer.canvas as HTMLCanvasElement,rect=canvas.getBoundingClientRect();
  const resolution=renderResolution(rect.width,window.devicePixelRatio,quality);
  canvas.style.imageRendering=quality==='pixel'?'pixelated':'auto';
  if(engine.renderer.screen.width!==800||engine.renderer.screen.height!==450||engine.renderer.resolution!==resolution){
    engine.width.set('800');engine.height.set('450');engine.renderer.resize(800,450,resolution);
  }
  const now=performance.now();if(now-lastTextureCheck>500||lastTextureCheck===0){
    lastTextureCheck=now;const walk=(node:any)=>{if(node.texture?.source?.style)node.texture.source.style.scaleMode=quality==='pixel'?'nearest':'linear';for(const child of node.children??[])walk(child);};walk(viewport);
    document.getElementById('render-quality-info')?.replaceChildren(document.createTextNode(`${quality==='smooth'?'ภาพเรียบ':'พิกเซลเดิม'} · ${canvas.width}×${canvas.height} backing`));
  }
  const room=engine.getCurrentRoom();if(!('id' in room))return;
  const map=(maps as any)[room.id];if(!map)return;
  // v0.1 leaves more of the village visible above the hero.
  camera.x=Math.max(0,Math.min(map.width-800,Number(p.x())-400));
  camera.y=Math.max(0,Math.min(540-450,Number(p.y())-300));
  if(engine.cameraFollowTargetId()!=='parity-camera')engine.setCameraFollow('parity-camera',false);
  // The engine resizes its viewport to the host window even when the renderer
  // is fixed-size. Translate directly in our logical space instead of asking
  // moveCenter() to infer the visible dimensions from that host window.
  viewport.position.set(-camera.x,-camera.y);
}

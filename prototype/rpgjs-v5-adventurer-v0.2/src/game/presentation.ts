import type { RpgClientEngine } from '@rpgjs/client';
import maps from './content.json';
import {signal} from 'canvasengine';
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
  if(engine.renderer.screen.width!==800||engine.renderer.screen.height!==450){
    engine.width.set('800');engine.height.set('450');engine.renderer.resize(800,450);
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

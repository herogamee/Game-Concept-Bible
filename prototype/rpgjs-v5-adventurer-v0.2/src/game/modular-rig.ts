/** Rejected limb-cutout experiment. See evidence/modular/REVIEW.md.
 * Technical registration checks do not validate its anatomy or art quality.
 * Retained for diagnosis, not an accepted DDTank-style production rig.
 */
export const directions=['south','west','east','north'] as const;
export type RigDirection=typeof directions[number];
export type RigAction='idle'|'walk'|'slash';
export interface Wardrobe {hair:'chestnut'|'silver';shirt:'traveler'|'blue';hat:boolean;weapon:boolean}
export interface PartRect {x:number;y:number;width:number;height:number}
export interface PartSource {file:string;rect:PartRect}
export type PartManifest=Record<string,PartSource>;
export interface DrawPart {part:string;x:number;y:number;width:number;height:number;angle?:number;anchorX?:number;anchorY?:number}
export const defaultWardrobe:Wardrobe={hair:'chestnut',shirt:'traveler',hat:false,weapon:true};
export function graphicFor(w:Wardrobe){return `chibi-${w.hair}-${w.shirt}-${Number(w.hat)}-${Number(w.weapon)}`;}
export function wardrobeForGraphic(id:string):Wardrobe|null {
  const match=/^chibi-(chestnut|silver)-(traveler|blue)-([01])-([01])$/.exec(id);
  return match?{hair:match[1] as Wardrobe['hair'],shirt:match[2] as Wardrobe['shirt'],hat:match[3]==='1',weapon:match[4]==='1'}:null;
}
export function wardrobes():Wardrobe[]{return (['chestnut','silver'] as const).flatMap(hair=>(['traveler','blue'] as const).flatMap(shirt=>[false,true].flatMap(hat=>[false,true].map(weapon=>({hair,shirt,hat,weapon})))));}
const radians=(degrees:number)=>degrees*Math.PI/180;
export function poseParts(w:Wardrobe,direction:RigDirection,action:RigAction,frame=0):DrawPart[]{
  const side=direction==='east'||direction==='west',sign=direction==='west'?-1:1;
  const cycle=frame/8*Math.PI*2,walking=action==='walk',attacking=action==='slash';
  const gait=walking?Math.sin(cycle):0,bob=walking?-Math.abs(Math.sin(cycle))*1.1:0;
  const result:DrawPart[]=[];
  const put=(part:string,x:number,y:number,width:number,height:number,extra:Partial<DrawPart>={})=>result.push({part,x,y,width,height,...extra});
  const bone=(part:string,from:{x:number;y:number},to:{x:number;y:number},width:number)=>put(part,from.x,from.y,width,Math.hypot(to.x-from.x,to.y-from.y)+1.3,{angle:Math.atan2(to.y-from.y,to.x-from.x)-Math.PI/2,anchorX:.5,anchorY:0});
  const leg=(index:number)=>{
    const phase=index===0?gait:-gait;
    const hip={x:side?32+(index===0?-1:1):28+index*8,y:46+bob};
    const foot={x:side?32+phase*5:28+index*8,y:57-Math.max(0,phase)*2.6};
    const knee={x:(hip.x+foot.x)/2+(side?sign*1.3:0),y:51-Math.max(0,phase)*1.7};
    bone('thigh',hip,knee,5.2);bone('shin',knee,foot,4.5);put(`boots.${direction}`,foot.x,foot.y+1,side?8:6.3,6.5);
  };
  const arm=(index:number,behind:boolean)=>{
    const isSword=index===1;
    const shoulder={x:side?32+(behind?-3:3):23.8+index*16.4,y:36+bob};
    let swing=walking?(index===0?-gait:gait)*.6:0;
    if(attacking&&isSword)swing=radians([-100,-125,-70,10,80,100,40,0][frame%8])*sign;
    const elbow={x:shoulder.x+Math.sin(swing)*6,y:shoulder.y+Math.cos(swing)*6};
    const hand={x:elbow.x+Math.sin(swing*.85)*5,y:elbow.y+Math.cos(swing*.85)*5};
    if(isSword&&w.weapon)put('sword',hand.x,hand.y,5.2,16,{anchorX:.5,anchorY:.79,angle:attacking?swing+sign*.4:sign*.22});
    bone('upper-arm',shoulder,elbow,4.9);bone(`shirt-${w.shirt}.sleeve.${direction}`,shoulder,elbow,5.8);bone('forearm',elbow,hand,4.0);put('hand',hand.x,hand.y+.5,4.2,4.5);
  };
  const rearArm=direction==='west'?1:0,frontArm=1-rearArm;
  leg(0);leg(1);arm(rearArm,true);if(direction==='north')arm(frontArm,false);
  put(`torso.${direction}`,32,39+bob,side?12:16,17);put('shorts',32,46+bob,side?12:16,7);
  put(`shirt-${w.shirt}.torso.${direction}`,32,40+bob,side?14:19,19);
  if(direction!=='north')arm(frontArm,false);
  put(`head.${direction}`,32,21+bob,32,32);
  put(`hair-${w.hair}.${direction}`,32,17.4+bob,35,29);
  if(w.hat)put(`hat.${direction}`,32,11+bob,35,17);
  return result;
}
/** The Node compiler and the large browser portrait share this exact renderer. */
export function drawRig(ctx:any,images:Record<string,any>,manifest:PartManifest,w:Wardrobe,direction:RigDirection,action:RigAction,frame=0,scale=1){
  ctx.save();ctx.scale(scale,scale);ctx.imageSmoothingEnabled=true;
  for(const p of poseParts(w,direction,action,frame)){
    const source=manifest[p.part];if(!source)throw new Error(`Missing rig part: ${p.part}`);
    const r=source.rect;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle??0);
    ctx.drawImage(images[source.file],r.x,r.y,r.width,r.height,-p.width*(p.anchorX??.5),-p.height*(p.anchorY??.5),p.width,p.height);ctx.restore();
  }ctx.restore();
}

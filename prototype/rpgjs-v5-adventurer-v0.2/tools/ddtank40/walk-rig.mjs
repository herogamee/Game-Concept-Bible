/** Bounded original-art gait. These are authored rig landmarks, not Flash data. */
export const walkRig = {
  id:'three-quarter-walk-rig-v1', frames:8, frameMs:95,
  speed:104*0.21075455333911536/(8*.095*.6),
  matrix:[0.21075455333911536,0,0,0.21075455333911536,-32.59291891935706,49.19774501300952],
  legs:[{hip:[555,944],knee:[566,1007],ankle:[563,1090]},
        {hip:[670,955],knee:[698,1036],ankle:[712,1142]}],
  arms:[{shoulder:[538,687],elbow:[504,783],wrist:[477,862]},
        {shoulder:[719,687],elbow:[759,793],wrist:[775,879]}]
};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const length=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1]);
function rotate(p,origin,angle,target=origin){const x=p[0]-origin[0],y=p[1]-origin[1],c=Math.cos(angle),s=Math.sin(angle);return [target[0]+x*c-y*s,target[1]+x*s+y*c];}
function segment(p,a,b,c,d){return rotate(p,a,Math.atan2(d[1]-c[1],d[0]-c[0])-Math.atan2(b[1]-a[1],b[0]-a[0]),c);}
/** Two-bone solution retains segment lengths; foot targets stay on the floor during stance. */
export function solveLeg(hip,foot,l1,l2){
  const dx=foot[0]-hip[0],dy=foot[1]-hip[1],r=clamp(Math.hypot(dx,dy),Math.abs(l1-l2)+.001,l1+l2-.001);
  const a=(l1*l1-l2*l2+r*r)/(2*r),h=Math.sqrt(Math.max(0,l1*l1-a*a)),ux=dx/Math.hypot(dx,dy),uy=dy/Math.hypot(dx,dy);
  return {hip,knee:[hip[0]+ux*a-uy*h,hip[1]+uy*a+ux*h],ankle:[hip[0]+ux*r,hip[1]+uy*r]};
}
export function gaitPose(frame){
  if(!Number.isInteger(frame)||frame<0||frame>=walkRig.frames)throw new Error('Invalid gait frame');
  const phase=frame/walkRig.frames,body=[2*Math.sin(phase*Math.PI*2),15+5*Math.cos(phase*Math.PI*4)];
  const legs=walkRig.legs.map((rest,i)=>{
    const t=(phase+i*.5)%1,stance=t<.6;
    const advance=stance?-52+104*t/.6:52-104*((t-.6)/.4);
    const lift=stance?0:42*Math.sin(Math.PI*(t-.6)/.4);
    const hip=add(rest.hip,body),target=[rest.ankle[0]+advance,rest.ankle[1]-lift];
    return {...solveLeg(hip,target,length(rest.hip,rest.knee),length(rest.knee,rest.ankle)),stance};
  });
  const arms=walkRig.arms.map((rest,i)=>{
    const angle=.13*Math.sin((phase+i*.5)*Math.PI*2),shoulder=add(rest.shoulder,body);
    const elbow=rotate(rest.elbow,rest.shoulder,angle,shoulder);
    const wrist=rotate(rest.wrist,rest.elbow,-.06+angle*.25,elbow);
    return {shoulder,elbow,wrist};
  });
  return {frame,body,head:[body[0],body[1]],legs,arms};
}
function mix(a,b,w){return [a[0]+(b[0]-a[0])*w,a[1]+(b[1]-a[1])*w];}
/** Continuous weights across waist/sleeve joints: no rectangular limb cuts. */
export function deformPoint([x,y],pose){
  const p=[x,y],base=add(p,pose.body);
  if(y>=910){
    const chains=walkRig.legs.map((rest,index)=>{
      const leg=pose.legs[index],upper=segment(p,rest.hip,rest.knee,leg.hip,leg.knee);
      const lower=segment(p,rest.knee,rest.ankle,leg.knee,leg.ankle);
      const boot=add(p,[leg.ankle[0]-rest.ankle[0],leg.ankle[1]-rest.ankle[1]]);
      return mix(mix(upper,lower,smooth(rest.knee[1]-22,rest.knee[1]+22,y)),boot,smooth(rest.ankle[1]-35,rest.ankle[1]+5,y));
    });
    // Follow the sloping empty space between legs, including the entire rear boot.
    const split=613+Math.min(32,Math.max(0,y-950)*.20);
    const result=mix(chains[0],chains[1],smooth(split-6,split+6,x));
    return mix(base,result,smooth(910,984,y));
  }
  if(y>682&&y<949){
    const index=x<615?0:1,rest=walkRig.arms[index],arm=pose.arms[index];
    const upper=segment(p,rest.shoulder,rest.elbow,arm.shoulder,arm.elbow);
    const lower=segment(p,rest.elbow,rest.wrist,arm.elbow,arm.wrist);
    const result=mix(upper,lower,smooth(760,809,y));
    const edge=index===0?1-smooth(510,552,x):smooth(696,740,x);
    return mix(base,result,edge*smooth(682,748,y));
  }
  return base;
}
export function canonicalPoint([x,y]){const [a,b,c,d,e,f]=walkRig.matrix;return [a*x+c*y+e,b*x+d*y+f];}
export class GaitSession{
  constructor({frames=walkRig.frames,frameMs=walkRig.frameMs,speed=walkRig.speed}={}){this.frames=frames;this.frameMs=frameMs;this.speed=speed;this.phaseMs=0;this.x=480;this.direction=-1;this.destination=null;this.preview=false;this.paused=false;this.rate=1;this.blend=0;this.axis=0;}
  get frame(){return Math.floor(this.phaseMs/this.frameMs)%this.frames;}
  tick(ms,axis=0,bounds=[100,860]){
    const dt=clamp(ms,0,50),old=this.x;
    if(this.paused){this.axis=0;return;}
    if(!axis&&this.destination!==null){const distance=this.destination-this.x;if(Math.abs(distance)<.5){this.x=this.destination;this.destination=null;}else axis=Math.sign(distance);}
    this.axis=axis;
    if(axis){this.direction=axis;let target=this.x+axis*this.speed*dt*.001*this.rate;if(this.destination!==null&&axis*(target-this.destination)>0)target=this.destination;this.x=clamp(target,...bounds);}
    const moving=this.preview||Math.abs(old-this.x)>.001;
    this.blend=clamp(this.blend+(moving?1:-1)*dt/140);
    if(moving)this.phaseMs=(this.phaseMs+dt*this.rate)%(this.frames*this.frameMs);
  }
  step(){this.paused=true;this.blend=1;this.phaseMs=((this.frame+1)%this.frames)*this.frameMs;}
}

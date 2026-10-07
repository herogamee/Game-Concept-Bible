import {fixedPlan,resolveFixedSelection} from './fixed-template-model.mjs';

export function frontMotionPlan(fixed, motion, selected, options={}, action='stand', frame=0){
  if(motion.appearanceTemplate!==fixed.template||motion.direction!=='front')throw new Error('Incompatible appearance/pose template');
  if(!['stand','walk'].includes(action))throw new Error('Unsupported front action');
  if(!Number.isInteger(frame)||frame<0||frame>=motion.frames)throw new Error('Invalid walk frame');
  const clothing=resolveFixedSelection(fixed,selected).clothing;
  const file=motion.clothing[clothing.id]?.[action];
  if(!file)throw new Error(`Missing authored pose for ${clothing.id}/${action}`);
  const source={x:action==='walk'?(frame%motion.columns)*motion.width:0,y:action==='walk'?Math.floor(frame/motion.columns)*motion.height:0,width:motion.width,height:motion.height};
  const layers=[{slot:'clothing',file,url:`/front-motion-assets/${file}`,x:0,y:0,source}];
  for(const layer of fixedPlan(fixed,selected,options).layers.filter(l=>l.slot!=='clothing'))layers.push({...layer,url:`/front-motion-assets/${layer.file}`,source:{x:0,y:0,width:motion.width,height:motion.height}});
  return {width:motion.width,height:motion.height,layers};
}

/** Animation owns the clock; equipment never changes its action or phase. */
export class FrontMotionSession {
  constructor(frames=4){this.frames=frames;this.action='stand';this.phase=0;this.rate=1;this.playing=false;this.transition=null;}
  get frame(){return Math.floor(this.phase)%this.frames;}
  change(action){
    if(!['stand','walk'].includes(action))throw new Error('Unsupported front action');
    if(this.action!==action){this.transition={action:this.action,frame:this.frame,elapsed:0};this.action=action;}
    this.playing=action==='walk';
  }
  tick(milliseconds){
    const dt=Math.min(100,Math.max(0,milliseconds));
    if(this.playing)this.phase=(this.phase+dt*.006*this.rate)%this.frames;
    if(this.transition){this.transition.elapsed+=dt;if(this.transition.elapsed>=120)this.transition=null;}
  }
  step(){this.action='walk';this.playing=false;this.transition=null;this.phase=(this.frame+1)%this.frames;}
  get mix(){return this.transition?this.transition.elapsed/120:1;}
}

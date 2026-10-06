/** One authored direction. Cosmetic IDs are independent of motion phase. */
const slots=['face','hair','body'];
export function resolveWalkSelection(manifest,selected={}) {
  const resolved={};
  for(const slot of slots){
    const id=selected[slot]??manifest.defaults[slot];
    const item=manifest.items.find(item=>item.slot===slot&&item.id===id);
    if(!item||item.clip!==manifest.clip.id)throw new Error(`Unsupported walk item: ${slot}/${id}`);
    resolved[slot]=item;
  }
  return resolved;
}
export function walkPlan(manifest,selected,frame,hairVisible=true){
  if(!Number.isInteger(frame)||frame<0||frame>=manifest.clip.count)throw new Error('Invalid walk frame');
  const items=resolveWalkSelection(manifest,selected),{width,height,columns}=manifest.frame;
  return {width,height,layers:['body','face','hair'].filter(slot=>hairVisible||slot!=='hair').map(slot=>({slot,url:`/walk-assets/${items[slot].file}`,x:0,y:0,
    source:{x:(frame%columns)*width,y:Math.floor(frame/columns)*height,width,height}}))};
}
export class WalkSession{
  constructor(manifest){this.manifest=manifest;this.selected={face:null,hair:null,body:null};this.phaseMs=0;this.x=220;this.destination=null;this.playing=true;this.inPlace=true;this.rate=1;this.mirrored=false;}
  get frame(){return Math.floor(this.phaseMs/this.manifest.clip.frameMs)%this.manifest.clip.count;}
  equip(slot,id){if(!slots.includes(slot))throw new Error('Invalid walk slot');const next={...this.selected,[slot]:id||null};resolveWalkSelection(this.manifest,next);this.selected=next;}
  tick(deltaMs,axis=0){
    if(!this.playing)return;
    const dt=Math.min(Math.max(deltaMs,0),100)*this.rate;
    if(!axis&&this.destination!==null){const distance=this.destination-this.x;if(Math.abs(distance)<1)this.destination=null;else axis=Math.sign(distance);}
    if(axis){this.mirrored=axis<0;const move=axis*this.manifest.clip.stridePixels/(this.manifest.clip.count*this.manifest.clip.frameMs)*this.manifest.displayScale*dt;
      if(this.destination!==null&&Math.abs(this.destination-this.x)<=Math.abs(move)){this.x=this.destination;this.destination=null;}else this.x=Math.max(120,Math.min(860,this.x+move));}
    if(axis||this.inPlace)this.phaseMs=(this.phaseMs+dt)%(this.manifest.clip.count*this.manifest.clip.frameMs);
  }
  step(){this.playing=false;this.phaseMs=((this.frame+1)%this.manifest.clip.count)*this.manifest.clip.frameMs;}
}

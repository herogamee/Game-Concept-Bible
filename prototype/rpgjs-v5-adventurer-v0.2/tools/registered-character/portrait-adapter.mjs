/** Local 4.0 portrait contract, independently adapted from the verified Godot Lab. */
export const slots=['face','hair','cloth','eff','head','glass','arm'];
export const defaults={
  m:{head:1101,glass:2101,hair:3101,eff:4101,cloth:5101,face:6101,arm:7001},
  f:{head:1201,glass:2201,hair:3201,eff:4201,cloth:5201,face:6201,arm:7002},
};
export function portraitPlan(catalog, {sex='m',selected={},hidden=[],expression=0}={}) {
  if(!defaults[sex])throw new Error('Unknown sex');
  if(!Number.isInteger(expression)||expression<0||expression>3)throw new Error('Invalid expression');
  const byId=new Map(catalog.items.map(item=>[item.id,item]));
  const equipment={...defaults[sex]};
  for(const [slot,id] of Object.entries(selected)) {
    if(!slots.includes(slot))throw new Error('Unknown slot');
    if(id==null||id===0)continue;
    const item=byId.get(id);
    if(!item||item.slot!==slot||![sex,'any'].includes(item.sex))throw new Error(`Incompatible item: ${slot}/${id}`);
    equipment[slot]=id;
  }
  const hat=byId.get(equipment.head);
  const hairVariant=hat?.hairType===1||hidden.includes('head')?'B':'A';
  const layers=[];
  for(const slot of slots) {
    if(hidden.includes(slot))continue;
    const item=byId.get(equipment[slot]);
    const asset=slot==='hair'?item?.assets[hairVariant]:item?.assets.main;
    if(!asset)throw new Error(`Missing ${slot} bitmap${slot==='hair'?` (${hairVariant})`:''}`);
    const sx=slot==='face'?expression*250:0;
    // Original portrait PNGs may be 312px tall: pad with transparent space,
    // never stretch them to the 342px display frame.
    const width=Math.min(250,asset.width-sx),height=Math.min(342,asset.height);
    if(width<1||height<1)throw new Error(`Missing expression frame: ${slot}`);
    layers.push({slot,id:item.id,url:asset.url,path:asset.path,source:{x:sx,y:0,width,height},x:0,y:0});
  }
  return {width:250,height:342,layers,sex,hairVariant,equipment,selected:{...selected}};
}

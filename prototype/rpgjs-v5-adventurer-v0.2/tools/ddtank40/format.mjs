/** Canonical 4.0 filenames and portrait composition. No per-item runtime fitting. */
export const showSlots=['face','hair','cloth','eff','head','glass','arm'];
const safe=/^[a-zA-Z0-9_-]+$/;
export function resourcePath(profile,{sex='m',slot,pic,plane='1',kind='show',variant='B',direction=0}) {
  if(!profile.sexFolders.includes(sex)||!Object.hasOwn(profile.categories,slot)||!safe.test(pic)||!/^\d+$/.test(String(plane))||!['show','game','icon'].includes(kind))throw new Error('Invalid resource identity');
  if(slot==='wing')return `image/equip/wing/${pic}/${kind==='icon'?'icon.png':'wings.swf'}`;
  if(slot==='arm')return `image/arm/${pic}/1/${kind==='icon'?'':`${direction}/`}${kind}.png`;
  const root=`image/equip/${sex}/${slot}/${pic}`;
  if(kind==='icon')return `${root}/icon_${plane}.png`;
  if(slot==='hair'&&!['A','B'].includes(variant))throw new Error('Invalid hair variant');
  return `${root}/${plane}/${slot==='hair'?variant+'/':''}${kind}.png`;
}
export function validateShowAsset(profile,item,asset,{original=false}={}) {
  if(!asset||!Number.isInteger(asset.width)||!Number.isInteger(asset.height))throw new Error('Missing bitmap dimensions');
  if(!asset.path.startsWith(`image/equip/${item.sex}/`)&&item.slot!=='arm'&&item.source==='ours')throw new Error('Incorrect DDTank folder');
  const ordinary=profile.show.ordinaryPng;
  const sizes=item.slot==='face'?[profile.show.faceSheet]:item.slot==='suits'?[profile.show.suitSheet,profile.show.tallSuitSheet]:[ordinary];
  if(item.pic==='default'&&profile.show.emptyDefaultPng[item.slot])sizes.push(profile.show.emptyDefaultPng[item.slot]);
  if(!original)sizes.push(...(profile.show.legacyExceptions[item.slot]||[]));
  if(!sizes.some(([w,h])=>w===asset.width&&h===asset.height))throw new Error(`Noncanonical show dimensions: ${item.slot}/${asset.width}x${asset.height}`);
}
export function showPlan(profile,catalog,{sex='m',base='ours',selected={},hidden=[],expression=0}={}) {
  if(!profile.sexFolders.includes(sex))throw new Error('Unknown sex');
  if(!Number.isInteger(expression)||expression<0||expression>=profile.show.faceColumns)throw new Error('Invalid expression');
  const byId=new Map(catalog.items.map(i=>[i.id,i]));
  const defaults=catalog.defaults[base]?.[sex];
  if(!defaults)throw new Error('No authored default for this sex/source');
  for(const slot of Object.keys(selected))if(!showSlots.includes(slot))throw new Error(`Unsupported slot: ${slot}`);
  const equipment={...defaults};
  for(const [slot,id] of Object.entries(selected))if(id!=null&&id!=='') {
    const item=byId.get(id);
    if(!item||item.slot!==slot||![sex,'any'].includes(item.sex))throw new Error(`Incompatible item: ${slot}/${id}`);
    equipment[slot]=id;
  }
  if(hidden.includes('head'))equipment.head=defaults.head;
  const hat=byId.get(equipment.head),variant=hat?.hairType===1?'B':'A';
  const layers=[];
  for(const slot of profile.show.drawOrder) {
    if(hidden.includes(slot)||!equipment[slot])continue;
    const item=byId.get(equipment[slot]),asset=slot==='hair'?item?.assets[variant]:item?.assets.main;
    if(!asset)throw new Error(`Missing ${slot}/${variant}`);
    validateShowAsset(profile,item,asset,{original:item.source==='ours'});
    if(slot==='face'&&item.showFrames&&!item.showFrames.includes(expression))throw new Error(`Expression ${expression} has not been authored: ${item.name}`);
    const x=slot==='face'?expression*profile.show.output[0]:0;
    if(x>=asset.width)throw new Error('Missing source expression');
    layers.push({slot,id:item.id,url:asset.url,path:asset.path,x:0,y:0,
      source:{x,y:0,width:Math.min(profile.show.output[0],asset.width-x),height:Math.min(profile.show.output[1],asset.height)}});
  }
  return {width:profile.show.output[0],height:profile.show.output[1],layers,hairVariant:variant,equipment,sex,base};
}
export function requireProductionCoverage(profile,pack) {
  const missing=[];
  for(const context of profile.productionRequiredContexts)if(!pack.contexts.includes(context))missing.push(context);
  for(const item of pack.items) {
    if(item.slot==='face'&&item.showFrames?.length!==profile.show.faceColumns)missing.push(`${item.id}: show expressions`);
    if(item.slot==='hair'&&(!item.assets.A||!item.assets.B))missing.push(`${item.id}: hair A/B`);
    if(!item.gameAsset||item.gameAsset.width!==profile.game.sheet[0]||item.gameAsset.height!==profile.game.sheet[1]||item.gameFrames?.length!==profile.game.allFrames)missing.push(`${item.id}: 39 battle frames`);
    if(profile.virtual.headSlots.includes(item.slot)&&!item.virtualAsset)missing.push(`${item.id}: virtual head directions`);
    if(item.slot==='cloth'&&(!item.virtualAssets?.cloth||!item.virtualAssets?.clothf))missing.push(`${item.id}: virtual body front/back`);
  }
  if(missing.length)throw new Error(`Production coverage incomplete: ${missing.join(', ')}`);
  return true;
}

import {defaultWardrobe,graphicFor,type Wardrobe} from './modular-rig';
/** Durable cosmetic IDs only. Combat/equipment ownership belongs elsewhere. */
export const appearanceSlots=['body','face','eyes','pants','shoes','shirt','hair','hat','weapon'] as const;
export type AppearanceSlot=typeof appearanceSlots[number];
export interface Appearance {version:1;slots:Record<AppearanceSlot,string|null>}
export interface AppearanceAsset {id:string;slot:AppearanceSlot;graphic:string;rig:'painted-v1'|'modular-v1';license:string;label?:string}
const cosmetic=(id:string,slot:AppearanceSlot,label:string):AppearanceAsset=>({id,slot,label,graphic:id,rig:'modular-v1',license:'assets/modular/PROVENANCE.md'});
export const appearanceCatalog:readonly AppearanceAsset[]=[
  {id:'painted-adventurer',slot:'body',graphic:'adventurer',rig:'painted-v1',license:'assets/LICENSES.md',label:'ตัวละครเดิม'},
  cosmetic('chibi-base','body','ตัวทดลองข้อต่อ · ไม่ผ่านรีวิว'),cosmetic('chibi-shorts','pants','กางเกงเริ่มต้น'),cosmetic('chibi-boots','shoes','รองเท้าเริ่มต้น'),
  cosmetic('hair-chestnut','hair','ผมสีน้ำตาล'),cosmetic('hair-silver','hair','ผมสีเงิน'),
  cosmetic('shirt-traveler','shirt','ชุดนักเดินทาง'),cosmetic('shirt-blue','shirt','เสื้อสีน้ำเงิน'),
  cosmetic('feather-cap','hat','หมวกขนนก'),cosmetic('short-sword','weapon','ดาบสั้น')
];
export function defaultAppearance():Appearance {
  return {version:1,slots:Object.fromEntries(appearanceSlots.map(slot=>[slot,slot==='body'?'painted-adventurer':null])) as Appearance['slots']};
}
export function modularAppearance():Appearance {return {...defaultAppearance(),slots:{...defaultAppearance().slots,body:'chibi-base',weapon:'short-sword'}};}
export function normalizeAppearance(value:unknown,catalog=appearanceCatalog):Appearance {
  const result=defaultAppearance();
  if(!value||typeof value!=='object'||(value as any).version!==1)return result;
  const slots=(value as any).slots;if(!slots||typeof slots!=='object')return result;
  const body=catalog.find(asset=>asset.slot==='body'&&asset.id===slots.body)??catalog.find(asset=>asset.id==='painted-adventurer')!;
  result.slots.body=body.id;
  for(const slot of appearanceSlots){const id=slots[slot];if(catalog.some(asset=>asset.slot===slot&&asset.id===id&&asset.rig===body.rig))result.slots[slot]=id;}
  return result;
}
export function resolvedWardrobe(value:unknown):Wardrobe {
  const a=normalizeAppearance(value);
  return {...defaultWardrobe,hair:a.slots.hair==='hair-silver'?'silver':'chestnut',shirt:a.slots.shirt==='shirt-blue'?'blue':'traveler',hat:a.slots.hat==='feather-cap',weapon:a.slots.weapon==='short-sword'};
}
export function appearanceGraphics(value:unknown,catalog=appearanceCatalog):string[] {
  const appearance=normalizeAppearance(value,catalog);
  if(appearance.slots.body==='chibi-base')return [graphicFor(resolvedWardrobe(appearance))];
  return appearanceSlots.flatMap(slot=>{const asset=catalog.find(asset=>asset.slot===slot&&asset.id===appearance.slots[slot]);return asset?[asset.graphic]:[];});
}
export function parseAppearance(serialized:unknown):Appearance {
  try{return normalizeAppearance(typeof serialized==='string'?JSON.parse(serialized):serialized);}catch{return defaultAppearance();}
}
/** Finite free experiment catalog; this does not invent inventory ownership. */
export function equipAppearance(current:unknown,request:unknown):Appearance|null {
  if(!request||typeof request!=='object')return null;
  const {slot,id}=request as {slot:AppearanceSlot;id:unknown};
  if(!appearanceSlots.includes(slot)||slot==='face'||slot==='eyes')return null;
  const appearance=normalizeAppearance(current);
  if(id===null&&slot!=='body'){appearance.slots[slot]=null;return appearance;}
  const item=appearanceCatalog.find(item=>item.id===id&&item.slot===slot);if(!item)return null;
  if(slot==='body')return item.id==='chibi-base'?modularAppearance():defaultAppearance();
  const body=appearanceCatalog.find(item=>item.id===appearance.slots.body)!;if(item.rig!==body.rig)return null;
  appearance.slots[slot]=item.id;return appearance;
}

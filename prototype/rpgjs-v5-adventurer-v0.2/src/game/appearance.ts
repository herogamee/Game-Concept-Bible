/** Durable cosmetic IDs only. Combat/equipment ownership belongs elsewhere. */
export const appearanceSlots=['body','face','eyes','pants','shoes','shirt','hair','hat','weapon'] as const;
export type AppearanceSlot=typeof appearanceSlots[number];
export interface Appearance {version:1;slots:Record<AppearanceSlot,string|null>}
export interface AppearanceAsset {id:string;slot:AppearanceSlot;graphic:string;rig:'painted-v1';license:string}
// The current body is a baked full costume. Other slots deliberately have no
// selectable assets until matching transparent animation layers are authored.
export const appearanceCatalog:readonly AppearanceAsset[]=[{id:'painted-adventurer',slot:'body',graphic:'adventurer',rig:'painted-v1',license:'assets/LICENSES.md'}];
export function defaultAppearance():Appearance {
  return {version:1,slots:Object.fromEntries(appearanceSlots.map(slot=>[slot,slot==='body'?'painted-adventurer':null])) as Appearance['slots']};
}
export function normalizeAppearance(value:unknown,catalog=appearanceCatalog):Appearance {
  const result=defaultAppearance();
  if(!value||typeof value!=='object'||(value as any).version!==1)return result;
  const slots=(value as any).slots;if(!slots||typeof slots!=='object')return result;
  for(const slot of appearanceSlots){const id=slots[slot];if(catalog.some(asset=>asset.slot===slot&&asset.id===id&&asset.rig==='painted-v1'))result.slots[slot]=id;}
  return result;
}
export function appearanceGraphics(value:unknown,catalog=appearanceCatalog):string[] {
  const appearance=normalizeAppearance(value,catalog);
  return appearanceSlots.flatMap(slot=>{const asset=catalog.find(asset=>asset.slot===slot&&asset.id===appearance.slots[slot]);return asset?[asset.graphic]:[];});
}
export function parseAppearance(serialized:unknown):Appearance {
  try{return normalizeAppearance(typeof serialized==='string'?JSON.parse(serialized):serialized);}catch{return defaultAppearance();}
}

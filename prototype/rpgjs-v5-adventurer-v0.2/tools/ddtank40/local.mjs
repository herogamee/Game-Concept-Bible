import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateShowAsset} from './format.mjs';
export const ownRoot=fileURLToPath(new URL('../../assets/ddtank40-compatible-v1/',import.meta.url));
export async function compatibilityCatalog(source,profile) {
  const own=JSON.parse(await readFile(resolve(ownRoot,'manifest.json'),'utf8'));
  if(own.profile!==profile.id)throw new Error('Character profile mismatch');
  const items=[...own.items],files=new Map(own.files.map(f=>[`/ddt40/ours/${f.path}`,resolve(ownRoot,f.path)]));
  const rejected=[];
  for(const reference of source.catalog.items) {
    const item={...reference,id:`ddt-${reference.id}`,templateId:reference.id,source:'reference'};
    try {
      for(const asset of Object.values(item.assets))if(asset)validateShowAsset(profile,item,asset);
      items.push(item);
    }catch(error){rejected.push({id:reference.id,reason:error.message});}
  }
  const defaults={ours:own.defaults,reference:{}};
  for(const sex of profile.sexFolders)defaults.reference[sex]=Object.fromEntries(Object.entries(profile.defaults[sex]).filter(([slot])=>profile.show.drawOrder.includes(slot)).map(([slot,id])=>[slot,`ddt-${id}`]));
  const existingIds=new Set(source.equipmentIds);
  for(const item of own.items)if(existingIds.has(item.templateId))throw new Error(`TemplateID collision: ${item.templateId}`);
  return {catalog:{profile:profile.id,defaults,items,availability:own.availability,acceptance:own.acceptance,
                  originalFiles:own.files,calibration:own.calibration,rejectedReferenceItems:rejected},files};
}

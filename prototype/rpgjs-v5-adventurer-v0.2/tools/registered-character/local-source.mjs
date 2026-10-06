import {readFile} from 'node:fs/promises';
import {resolve,relative,isAbsolute} from 'node:path';
import {slots} from './portrait-adapter.mjs';
const json=async path=>JSON.parse(await readFile(path,'utf8'));
function inside(root,relativePath) {
  const absolute=resolve(root,relativePath),rel=relative(root,absolute);
  if(rel.startsWith('..')||isAbsolute(rel))throw new Error('Asset outside configured source');
  return absolute;
}
export async function readLocalCatalog(labRoot) {
  labRoot=resolve(labRoot);
  const [settings,equipment,records]=await Promise.all([
    json(resolve(labRoot,'settings.json')),json(resolve(labRoot,'data/equipment.json')),json(resolve(labRoot,'data/assets.json'))]);
  const byPath=new Map(records.map(record=>[record.path,record])),files=new Map();
  function asset(path) {
    const record=byPath.get(path);if(!record||record.status!=='ready'||!record.size?.[0]||!record.size?.[1])return null;
    const file=record.converted?inside(labRoot,record.converted):inside(settings.resource_root,path);
    files.set(record.id,file);
    return {url:`/assets/${record.id}`,width:record.size[0],height:record.size[1],path};
  }
  const items=[];
  for(const item of equipment) {
    if(!slots.includes(item.slot)||!item.show_ready)continue;
    const assets=item.slot==='hair'?{B:asset(item.show),A:asset(item.show.replace('/B/','/A/'))}:{main:asset(item.show)};
    if(!(assets.main||assets.B))continue;
    items.push({id:item.id,name:item.name,slot:item.slot,sex:item.sex,pic:item.pic,hairType:item.hair_type,assets});
  }
  return {catalog:{source:'Local DDTank 4.0 research images; not original project artwork',items},files,
    references:{m:inside(labRoot,'tests/starter-m-show.png'),f:inside(labRoot,'tests/starter-f-show.png')}};
}

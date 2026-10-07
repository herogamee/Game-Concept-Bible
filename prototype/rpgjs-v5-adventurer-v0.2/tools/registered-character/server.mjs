import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {readLocalCatalog} from './local-source.mjs';
import {compatibilityCatalog} from '../ddtank40/local.mjs';
const labRoot=process.argv[2],port=Number(process.argv[3]??5199);
if(!labRoot)throw new Error('Usage: node tools/registered-character/server.mjs <external DDTank Lab directory> [port]');
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid port');
const source=await readLocalCatalog(labRoot);
const profile=JSON.parse(await readFile(new URL('../ddtank40/profile.json',import.meta.url),'utf8'));
const compatible=await compatibilityCatalog(source,profile);
const staticFiles=new Map(['index.html','client.mjs','compositor.mjs','portrait-adapter.mjs','original.html','original-client.mjs','walk.html','walk-client.mjs','walk-model.mjs','fixed-template.html','fixed-template-client.mjs','fixed-template-model.mjs'].map(name=>[`/${name}`,fileURLToPath(new URL(name,import.meta.url))]));
for(const name of ['index.html','client.mjs','format.mjs','registration.mjs'])staticFiles.set(`/ddt40/${name}`,fileURLToPath(new URL(`../ddtank40/${name}`,import.meta.url)));
for(const name of ['walk.html','walk-client.mjs','walk-rig.mjs','support-gait.mjs','walk-mesh-legacy.html','walk-mesh-legacy-client.mjs'])staticFiles.set(`/ddt40/${name}`,fileURLToPath(new URL(`../ddtank40/${name}`,import.meta.url)));
for(const name of ['manifest.json','image/equip/m/cloth/ours_cloth_1/1/walk.png'])staticFiles.set(`/ddt40/keyframe-walk/${name}`,fileURLToPath(new URL(`../../assets/ddtank40-keyframe-walk-v1/${name}`,import.meta.url)));
for(const name of ['manifest.json','traveler-eight-poses.png','image/equip/m/cloth/ours_cloth_1/1/walk.png'])staticFiles.set(`/ddt40/keyframe-walk8/${name}`,fileURLToPath(new URL(`../../assets/ddtank40-keyframe-walk-v2/${name}`,import.meta.url)));
for(const name of ['traveler-parts.png','traveler-keyframes-draft.png'])staticFiles.set(`/ddt40/cutout/${name}`,fileURLToPath(new URL(`../../assets/ddtank40-cutout-v1/${name}`,import.meta.url)));
for(const name of ['manifest.json','cloth-1-walk.png','cloth-2-walk.png'])staticFiles.set(`/ddt40/walk-assets/${name}`,fileURLToPath(new URL(`../../assets/ddtank40-walk-v1/${name}`,import.meta.url)));
staticFiles.set('/ddt40/master.png',fileURLToPath(new URL('../../assets/ddtank40-three-quarter-v1/master.png',import.meta.url)));
for(const name of ['head-template','hair-chestnut','hair-ghost-teal','hair-paired-teal'])staticFiles.set(`/ddt40/native/${name}.png`,fileURLToPath(new URL(`../../assets/ddtank40-three-quarter-v1/layers/${name}.png`,import.meta.url)));
staticFiles.set('/ddt40/ghost-head-review.png',fileURLToPath(new URL('../../evidence/ddtank40-three-quarter-v1/ghost-head-native-review.png',import.meta.url)));
staticFiles.set('/ddt40/hair-pair-review.png',fileURLToPath(new URL('../../evidence/ddtank40-three-quarter-v1/blank-head-hair-pair-review.png',import.meta.url)));
for(const name of ['blank-head-hair','hair-only','reassembled-blank-head'])staticFiles.set(`/ddt40/hair-pair/${name}.png`,fileURLToPath(new URL(`../../assets/ddtank40-three-quarter-v1/hair-pair-v1/${name}.png`,import.meta.url)));
const originalDir=new URL('../../assets/character-master/head-hair/',import.meta.url);
for(const name of ['head-face.png','hair-chestnut.png','body-traveler.png'])staticFiles.set(`/original-assets/${name}`,fileURLToPath(new URL(name,originalDir)));
staticFiles.set('/original-assets/master.png',fileURLToPath(new URL('../../assets/character-master/front-v1.png',import.meta.url)));
const walkDir=new URL('../../assets/walk-side-v1/',import.meta.url);
for(const name of ['face-amber.png','face-calm.png','body-traveler.png','body-blue.png','hair-chestnut.png','hair-silver.png'])staticFiles.set(`/walk-assets/${name}`,fileURLToPath(new URL(name,walkDir)));
const fixedDir=new URL('../../assets/fixed-template-v1/',import.meta.url);
for(const name of ['front-motion-model.mjs','front-motion-client.mjs'])staticFiles.set(`/${name}`,fileURLToPath(new URL(name,import.meta.url)));
const frontMotionDir=new URL('../../assets/fixed-front-motion-v1/',import.meta.url);
for(const name of ['hair-teal.png','hair-silver-curls.png','hat-adventurer.png','hair-chestnut-under-hat.png','hair-teal-under-hat.png','hair-silver-curls-under-hat.png'])staticFiles.set(`/fixed-assets/${name}`,fileURLToPath(new URL(name,fixedDir)));
for(const name of ['head-template.png','hair-chestnut.png','hair-teal.png','hair-silver-curls.png','hat-adventurer.png','hair-chestnut-under-hat.png','hair-teal-under-hat.png','hair-silver-curls-under-hat.png','eyes-amber.png','eyes-determined.png','eyes-joy.png','face-scar.png','face-blush.png',...['clothing-traveler','clothing-knight','clothing-mage'].flatMap(id=>[`${id}-stand.png`,`${id}-walk.png`])])staticFiles.set(`/front-motion-assets/${name}`,fileURLToPath(new URL(name,frontMotionDir)));
for(const name of ['head-template.png','clothing-traveler.png','clothing-knight.png','clothing-mage.png','hair-chestnut.png','eyes-amber.png','eyes-determined.png','eyes-joy.png','face-scar.png','face-blush.png'])staticFiles.set(`/fixed-assets/${name}`,fileURLToPath(new URL(name,fixedDir)));
createServer(async(req,res)=>{
  try {
    const path=new URL(req.url,'http://127.0.0.1').pathname;
    if(req.method!=='GET'){res.writeHead(405);res.end();return;}
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
    if(path==='/api/catalog'){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(source.catalog));return;}
    if(path==='/api/ddt40-profile'){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(profile));return;}
    if(path==='/api/ddt40-catalog'){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(compatible.catalog));return;}
    if(path==='/api/original'){
      const manifest=JSON.parse(await readFile(new URL('layers.json',originalDir),'utf8'));
      res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(manifest));return;
    }
    if(path==='/api/walk'){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(await readFile(new URL('layers.json',walkDir),'utf8'));return;}
    if(path==='/api/fixed-template'){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(await readFile(new URL('manifest.json',fixedDir),'utf8'));return;}
    if(path==='/api/front-motion'){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(await readFile(new URL('manifest.json',frontMotionDir),'utf8'));return;}
    const asset=path.startsWith('/assets/')?source.files.get(path.slice(8)):null;
    const reference=path==='/reference/m'?source.references.m:path==='/reference/f'?source.references.f:null;
    const file=compatible.files.get(path)||asset||reference||staticFiles.get(path==='/'?'/index.html':path==='/original'?'/original.html':path==='/walk'?'/walk.html':path==='/fixed-template-walk-legacy'?'/ddt40/walk-mesh-legacy.html':path==='/fixed-template-walk'?'/ddt40/walk.html':path==='/fixed-template'?'/ddt40/index.html':path==='/fixed-template-legacy'?'/fixed-template.html':path);
    if(!file){res.writeHead(404);res.end('Not found');return;}
    const bytes=await readFile(file);
    res.setHeader('Content-Type',asset||reference||file.endsWith('.png')?'image/png':file.endsWith('.json')?'application/json; charset=utf-8':path.endsWith('.mjs')?'text/javascript; charset=utf-8':'text/html; charset=utf-8');res.end(bytes);
  }catch(error){res.writeHead(500);res.end('Could not read local source');console.error(error.message);}
}).listen(port,'127.0.0.1',()=>console.log(`Registered wardrobe proof: http://127.0.0.1:${port} (${source.catalog.items.length} local items; no asset copies)`));

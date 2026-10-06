import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {readLocalCatalog} from './local-source.mjs';
const labRoot=process.argv[2],port=Number(process.argv[3]??5199);
if(!labRoot)throw new Error('Usage: node tools/registered-character/server.mjs <external DDTank Lab directory> [port]');
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid port');
const source=await readLocalCatalog(labRoot);
const staticFiles=new Map(['index.html','client.mjs','compositor.mjs','portrait-adapter.mjs','original.html','original-client.mjs'].map(name=>[`/${name}`,fileURLToPath(new URL(name,import.meta.url))]));
const originalDir=new URL('../../assets/character-master/head-hair/',import.meta.url);
for(const name of ['head-face.png','hair-chestnut.png','body-traveler.png'])staticFiles.set(`/original-assets/${name}`,fileURLToPath(new URL(name,originalDir)));
staticFiles.set('/original-assets/master.png',fileURLToPath(new URL('../../assets/character-master/front-v1.png',import.meta.url)));
createServer(async(req,res)=>{
  try {
    const path=new URL(req.url,'http://127.0.0.1').pathname;
    if(req.method!=='GET'){res.writeHead(405);res.end();return;}
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
    if(path==='/api/catalog'){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(source.catalog));return;}
    if(path==='/api/original'){
      const manifest=JSON.parse(await readFile(new URL('layers.json',originalDir),'utf8'));
      res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(manifest));return;
    }
    const asset=path.startsWith('/assets/')?source.files.get(path.slice(8)):null;
    const reference=path==='/reference/m'?source.references.m:path==='/reference/f'?source.references.f:null;
    const file=asset||reference||staticFiles.get(path==='/'?'/index.html':path==='/original'?'/original.html':path);
    if(!file){res.writeHead(404);res.end('Not found');return;}
    const bytes=await readFile(file);
    res.setHeader('Content-Type',asset||reference||file.endsWith('.png')?'image/png':path.endsWith('.mjs')?'text/javascript; charset=utf-8':'text/html; charset=utf-8');res.end(bytes);
  }catch(error){res.writeHead(500);res.end('Could not read local source');console.error(error.message);}
}).listen(port,'127.0.0.1',()=>console.log(`Registered wardrobe proof: http://127.0.0.1:${port} (${source.catalog.items.length} local items; no asset copies)`));

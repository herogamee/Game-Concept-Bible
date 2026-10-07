import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../game/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.json':'application/json','.tmx':'application/xml','.tsx':'application/xml','.ttf':'font/ttf'};
const server=createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const path=resolve(root,`.${pathname==='/'?'/index.html':pathname}`);
    if(!path.startsWith(resolve(root)+sep)){res.writeHead(403).end();return;}
    const body=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]??'application/octet-stream','Cache-Control':'no-cache'}).end(body);
  }catch{res.writeHead(404).end('Not found');}
});
server.listen(4175,'127.0.0.1',()=>console.log('Willowbrook standalone: http://localhost:4175/ — Ctrl+C to stop'));

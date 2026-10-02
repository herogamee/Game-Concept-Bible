import {cp,mkdir,readFile,writeFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const project=fileURLToPath(new URL('../',import.meta.url));
const output=join(project,'artifacts','willowbrook-v02-portable');
await mkdir(join(output,'tools'),{recursive:true});
await cp(join(project,'dist'),join(output,'game'),{recursive:true});
await cp(join(project,'tools','serve-portable.mjs'),join(output,'tools','serve-portable.mjs'));
await cp(join(project,'assets'),join(output,'asset-credits'),{recursive:true});
await cp(join(project,'..','web-pixel-rpg-v0.1','ART-DIRECTION.md'),join(output,'asset-credits','ORIGINAL-ART-DIRECTION.md'));
await writeFile(join(output,'start-game.cmd'),'@echo off\r\ncd /d "%~dp0"\r\nnode tools\\serve-portable.mjs\r\npause\r\n');
await writeFile(join(output,'README.txt'),'Willowbrook v0.2 standalone preview\nRequires Node.js 22+. No npm install required.\nWindows: double-click start-game.cmd, then open http://localhost:4175/\nmacOS/Linux: node tools/serve-portable.mjs\nDo not open index.html directly (file://).\nThis build runs server logic locally in the browser; it is not an online account service.\nSave is browser/origin-specific; it is not transferred to a different computer by this ZIP.\nSource and lockfile: https://github.com/herogamee/Game-Concept-Bible/tree/codex/rpgjs-v0.2\nRead the source repository DEVELOPING.md to continue development.\n');
// Retain available package notices for the installed build inputs/dependencies.
const noticeRoot=join(output,'dependency-notices');await mkdir(noticeRoot,{recursive:true});
for(const entry of await readdir(join(project,'node_modules'),{withFileTypes:true})){
  if(!entry.isDirectory()||entry.name.startsWith('.'))continue;
  const names=entry.name.startsWith('@')?(await readdir(join(project,'node_modules',entry.name))).map(name=>`${entry.name}/${name}`):[entry.name];
  for(const name of names){const dir=join(project,'node_modules',name);try{
    const pkg=JSON.parse(await readFile(join(dir,'package.json'),'utf8'));
    const target=join(noticeRoot,name.replace('/','__'));await mkdir(target,{recursive:true});
    await writeFile(join(target,'package-info.json'),JSON.stringify({name:pkg.name,version:pkg.version,license:pkg.license,repository:pkg.repository},null,2));
    for(const file of await readdir(dir))if(/^(license|licence|copying|notice)(\.|$)/i.test(file))await cp(join(dir,file),join(target,file),{recursive:true});
  }catch{}}
}
console.log(`Portable game prepared: ${output}`);

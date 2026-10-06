/** Save current original-only review metadata; mixed screenshots stay external. */
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),out=resolve(root,'evidence/ddtank40-three-quarter-v1');
for(const id of ['hair-teal','hair-silver-curls']){
 const bytes=execFileSync('git',['show','03e167c:prototype/rpgjs-v5-adventurer-v0.2/assets/ddtank40-three-quarter-v1/layers/'+id+'.png'],{cwd:root,maxBuffer:5*1024*1024});
 await writeFile(resolve(out,id+'-before-hair-only.png'),bytes);
}
const report=JSON.parse(await readFile('D:/Codex/DDtank/research/compatibility-4.0/verification.json','utf8'));
report.browserChecks={url:'http://127.0.0.1:5199/fixed-template',hairOnlyPreviewVisible:true,nativeHairSize:[1254,1254],blueSelectionUpdatesNativeLink:true,silverSelectionUpdatesNativeLink:true,capSelectsA:true,hidingCapRestoresB:true,resetRestoresBrown:true,consoleWarningsOrErrors:[],screenshot:'D:/Codex/DDtank/research/compatibility-4.0/hair-only-browser-review.png'};
await writeFile(resolve(out,'hair-only-verification.json'),JSON.stringify(report,null,2)+'\n');
// Crop only the top of the actual full-page screenshot, preserving its page
// title, controls, source/assembly/reference and runtime hair-only preview.
const browser=await loadImage('D:/Codex/DDtank/research/compatibility-4.0/hair-only-browser-review.png'),crop=createCanvas(browser.width,1280);
crop.getContext('2d').drawImage(browser,0,0);
await writeFile('D:/Codex/DDtank/research/compatibility-4.0/hair-only-browser-detail.png',crop.toBuffer('image/png'));

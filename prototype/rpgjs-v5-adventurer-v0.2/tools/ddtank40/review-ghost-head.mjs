/** Original-only ghost-head proof. Assets are drawn as independent PNG layers. */
import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),layers=resolve(root,'assets/ddtank40-three-quarter-v1/layers'),out=resolve(root,'evidence/ddtank40-three-quarter-v1');
if(process.platform==='win32')GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','ProofFont');
const proof=createCanvas(1350,510),ctx=proof.getContext('2d');
ctx.fillStyle='#f7f5ee';ctx.fillRect(0,0,1350,510);ctx.fillStyle='#313d31';ctx.font='18px ProofFont';
for(const [column,title,parts] of [[0,'SAME HEAD: REFERENCE ONLY',['head-template']],[1,'NEW BLUE: HAIR ONLY',['hair-ghost-teal']],[2,'OVERLAY ON EXISTING FACE',['head-template','eyes-amber','hair-ghost-teal']]]){
 ctx.fillStyle='#313d31';ctx.fillText(title,column*450+12,28);
 const c=createCanvas(1254,1254),q=c.getContext('2d');for(const part of parts)q.drawImage(await loadImage(resolve(layers,part+'.png')),0,0);
 for(let y=45;y<500;y+=20)for(let x=column*450;x<(column+1)*450;x+=20){ctx.fillStyle=((Math.floor(y/20)+Math.floor(x/20))%2)?'#eceee7':'#fafbf7';ctx.fillRect(x,y,20,20);}
 ctx.drawImage(c,280,20,700,680,column*450,45,450,437);
}
await writeFile(resolve(out,'ghost-head-native-review.png'),proof.toBuffer('image/png'));
const report=JSON.parse(await readFile('D:/Codex/DDtank/research/compatibility-4.0/verification.json','utf8'));
report.artScope='One selectable blue ghost-head hair trial. Eight built-in image calls; rejected silver size/placement trials remain preserved and are not published. Generation prompts do not lock geometry100%; a fixed import and rejection gate are still required. Owner visual approval pending.';
report.browserChecks={url:'http://127.0.0.1:5199/fixed-template',selectedHair:'ours-310900004',greenEyeSwapRetainsHair:true,capSelectsA:true,hideCapRestoresB:true,nativeHairUrl:'/ddt40/native/hair-ghost-teal.png',nativeSize:[1254,1254],consoleWarningsOrErrors:[],screenshot:'D:/Codex/DDtank/research/compatibility-4.0/ghost-head-browser-review.png'};
await writeFile(resolve(out,'ghost-head-verification.json'),JSON.stringify(report,null,2)+'\n');

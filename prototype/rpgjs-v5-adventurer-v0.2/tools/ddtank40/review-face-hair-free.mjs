/** Original-only face-layer evidence; do not conceal defects with a hairstyle. */
import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),out=resolve(root,'evidence/ddtank40-three-quarter-v1'),layers=resolve(root,'assets/ddtank40-three-quarter-v1/layers');
if(process.platform==='win32')GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','ProofFont');
const canvas=createCanvas(1500,505),ctx=canvas.getContext('2d');ctx.fillStyle='#e2e8da';ctx.fillRect(0,0,1500,505);ctx.fillStyle='#313d31';ctx.font='17px ProofFont';
for(const [column,label,eyes,hair] of [[0,'BEFORE: BROWN BANGS INSIDE EYE SET',resolve(out,'eyes-amber-before-hair-free.png'),false],[1,'AFTER: CLEAN HEAD + AMBER EYES',resolve(layers,'eyes-amber.png'),false],[2,'AFTER: SAME FACE + BLUE HAIR',resolve(layers,'eyes-amber.png'),true]]){
 const native=createCanvas(1254,1254),n=native.getContext('2d');
 n.drawImage(await loadImage(resolve(layers,'head-template.png')),0,0);n.drawImage(await loadImage(eyes),0,0);
 if(hair)n.drawImage(await loadImage(resolve(layers,'hair-teal.png')),0,0);
 ctx.fillText(label,column*500+10,26);ctx.drawImage(native,300,40,660,625,column*500,38,500,473.5);
}
await writeFile(resolve(out,'face-hair-free-native-review.png'),canvas.toBuffer('image/png'));
const report=JSON.parse(await readFile('D:/Codex/DDtank/research/compatibility-4.0/verification.json','utf8'));
report.browserChecks={url:'http://127.0.0.1:5199/fixed-template',selectedHair:'ours-310900002',faceOnlyPreviewOpen:true,blueAndSilverRetainFaceFile:'/ddt40/ours/image/equip/m/face/ours_face_1/1/show.png',consoleWarningsOrErrors:[],screenshot:'D:/Codex/DDtank/research/compatibility-4.0/face-hair-free-browser-review.png'};
await writeFile(resolve(out,'face-hair-free-verification.json'),JSON.stringify(report,null,2)+'\n');
const browser=await loadImage(report.browserChecks.screenshot),detail=createCanvas(browser.width,1250);detail.getContext('2d').drawImage(browser,0,0);
await writeFile('D:/Codex/DDtank/research/compatibility-4.0/face-hair-free-browser-detail.png',detail.toBuffer('image/png'));

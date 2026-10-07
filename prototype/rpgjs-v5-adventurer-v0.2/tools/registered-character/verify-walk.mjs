import assert from 'node:assert/strict';
import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {prepareRegisteredFrame,drawPreparedFrame} from './compositor.mjs';
import {walkPlan,WalkSession,resolveWalkSelection} from './walk-model.mjs';
const dir='assets/walk-side-v1',evidence='evidence/walk-side-v1',m=JSON.parse(await readFile(`${dir}/layers.json`,'utf8')),images=new Map();
for(const item of m.items){const im=await loadImage(await readFile(`${dir}/${item.file}`));assert.equal(im.width,m.atlas.width);assert.equal(im.height,m.atlas.height);images.set(`/walk-assets/${item.file}`,im);}
const full={x:0,y:0,width:m.frame.width,height:m.frame.height},zones={iris:{x:248,y:146,width:22,height:39},earCore:{x:163,y:171,width:16,height:21},mouth:{x:272,y:200,width:15,height:13},body:{x:0,y:m.authoring.headBodySplitY,width:m.frame.width,height:m.frame.height-m.authoring.headBodySplitY}};
function pixels(c,rect=full){return c.getContext('2d').getImageData(rect.x,rect.y,rect.width,rect.height).data;}
const hash=data=>createHash('sha256').update(data).digest('hex');
async function render(selected,frame,visible=true){const c=createCanvas(m.frame.width,m.frame.height);drawPreparedFrame(c,await prepareRegisteredFrame(walkPlan(m,selected,frame,visible),url=>images.get(url)));return c;}
const combinations=[];for(const face of m.items.filter(i=>i.slot==='face'))for(const hair of m.items.filter(i=>i.slot==='hair'))for(const body of m.items.filter(i=>i.slot==='body'))combinations.push({face:face.id,hair:hair.id,body:body.id});
assert.equal(combinations.length,8);const hashes=new Set(),checks=[];
GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','WalkVerify');const sheet=createCanvas(1536,2304),ctx=sheet.getContext('2d');ctx.fillStyle='#eef1e8';ctx.fillRect(0,0,sheet.width,sheet.height);ctx.fillStyle='#2b3127';ctx.font='12px WalkVerify';
for(const [row,selected]of combinations.entries())for(let frame=0;frame<m.clip.count;frame++){
 const on=await render(selected,frame),off=await render(selected,frame,false);hashes.add(hash(pixels(on)));
 for(const [name,rect]of Object.entries(zones))assert.equal(hash(pixels(on,rect)),hash(pixels(off,rect)),`Hair changed ${name} in ${JSON.stringify(selected)} frame${frame}`);
 const otherBody=await render({...selected,body:selected.body==='body-blue'?'body-traveler':'body-blue'},frame);
 assert.equal(hash(pixels(on,{x:0,y:0,width:m.frame.width,height:m.authoring.headBodySplitY})),hash(pixels(otherBody,{x:0,y:0,width:m.frame.width,height:m.authoring.headBodySplitY})),'Outfit changed head/hair pixels');
 const otherFace=await render({...selected,face:selected.face==='face-amber'?'face-calm':'face-amber'},frame);
 assert.equal(hash(pixels(on,zones.body)),hash(pixels(otherFace,zones.body)),'Face changed dressed-body pixels');
 for(const layer of walkPlan(m,selected,frame).layers){assert.equal(layer.x,0);assert.equal(layer.y,0);const im=images.get(layer.url),c=createCanvas(m.frame.width,m.frame.height);c.getContext('2d').drawImage(im,layer.source.x,layer.source.y,m.frame.width,m.frame.height,0,0,m.frame.width,m.frame.height);assert.ok(pixels(c).some((v,i)=>i%4===3&&v>0),`Empty ${layer.slot} frame ${frame}`);}
 ctx.drawImage(on,frame*192,row*288+28,192,256);ctx.fillText(`${selected.face.replace('face-','')} / ${selected.hair.replace('hair-','')} / ${selected.body.replace('body-','')} · ${frame+1}`,frame*192+3,row*288+17);
 checks.push({selected,frame,hash:hash(pixels(on))});
}
assert.equal(hashes.size,64,'Combinations/frames unexpectedly duplicate complete pixel output');
for(let frame=0;frame<8;frame++){const empty={face:null,hair:null,body:null};assert.equal(hash(pixels(await render(empty,frame))),hash(pixels(await render(m.defaults,frame))));assert.deepEqual(empty,{face:null,hair:null,body:null});}
const session=new WalkSession(m);session.destination=800;session.tick(37);const before={phase:session.phaseMs,x:session.x,destination:session.destination};for(const selected of combinations){for(const slot of ['face','hair','body'])session.equip(slot,selected[slot]);assert.deepEqual({phase:session.phaseMs,x:session.x,destination:session.destination},before);}
const selectedBefore={...session.selected};assert.throws(()=>session.equip('face','body-blue'));assert.throws(()=>session.equip('unknown',null));assert.deepEqual(session.selected,selectedBefore);
assert.throws(()=>walkPlan(m,m.defaults,8));assert.throws(()=>resolveWalkSelection(m,{face:'missing'}));const missingClip={...m,items:m.items.map(item=>item.id==='face-amber'?{...item,clip:'another-action'}:item)};assert.throws(()=>walkPlan(missingClip,m.defaults,0));
const phase=session.phaseMs;session.playing=false;session.tick(100,1);assert.equal(session.phaseMs,phase);session.step();assert.equal(session.frame,1);session.playing=true;session.tick(40,1);assert.ok(session.x>before.x);assert.equal(session.phaseMs,140);
const original=await loadImage(await readFile(`${dir}/base-corrected.png`));let maxAlpha=0,maxPremultiplied=0;
for(let frame=0;frame<8;frame++){const reference=createCanvas(m.frame.width,m.frame.height);reference.getContext('2d').drawImage(original,frame%4*m.frame.width,Math.floor(frame/4)*m.frame.height,m.frame.width,m.frame.height,0,0,m.frame.width,m.frame.height);const a=pixels(reference),b=pixels(await render(m.defaults,frame,false));for(let i=0;i<a.length;i+=4){maxAlpha=Math.max(maxAlpha,Math.abs(a[i+3]-b[i+3]));for(let c=0;c<3;c++)maxPremultiplied=Math.max(maxPremultiplied,Math.abs(a[i+c]*a[i+3]/255-b[i+c]*b[i+3]/255));}}
assert.ok(maxAlpha<=1&&maxPremultiplied<=2,'Base head/body partition failed native-frame roundtrip');
const report={scope:'Eight original wardrobe combinations through eight right-facing walk frames. Natural gait/visual owner acceptance pending.',canvas:m.atlas,frame:m.frame,combinations:8,renderedCases:checks.length,distinctPixelOutputs:hashes.size,protectedRegions:zones,equipPreservesPhaseAndPosition:true,defaultFallbackPreservesNullSelections:true,invalidSlotIdFrameOrClipRejected:true,baseRoundtrip:{maxAlpha,maxPremultiplied},cases:checks};
await mkdir(evidence,{recursive:true});await writeFile(`${evidence}/all-64-frames.png`,sheet.toBuffer('image/png'));await writeFile(`${evidence}/verification.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,cases:undefined},null,2));

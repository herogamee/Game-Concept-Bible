/** Eight authored poses, one atlas-family registration; no limb extraction. */
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url),dir=new URL('assets/ddtank40-keyframe-walk-v2/',root);
const source='assets/ddtank40-keyframe-walk-v2/traveler-eight-poses.png',bytes=await readFile(new URL(source,root)),image=await loadImage(bytes);
if(image.width!==1774||image.height!==887)throw new Error('Eight-pose master changed');
const edges=[0,443,887,1330,1774];
const phases=['left-contact','left-down','right-passing','right-up','right-contact','right-down','left-passing','left-up'];
// Lower-row necks start414px below the upper row. The443px crop divider
// lies in the empty gutter. Atlas origin and crop divider are independent.
const frames=phases.map((phase,index)=>{const col=index%4,row=Math.floor(index/4),x=edges[col],y=row?443:0;return {index,phase,rect:[x,y,edges[col+1]-x,row?444:443],origin:[x,row?414:0],headOffset:[0,0]};});
const matrix=[.345,0,0,.345,26.135,149.645],sheet=createCanvas(2000,342),ctx=sheet.getContext('2d');
for(const frame of frames){const [x,y,w,h]=frame.rect;ctx.save();ctx.beginPath();ctx.rect(frame.index*250,0,250,342);ctx.clip();ctx.translate(frame.index*250,0);ctx.transform(...matrix);ctx.drawImage(image,x,y,w,h,x-frame.origin[0],y-frame.origin[1],w,h);ctx.restore();}
const file='image/equip/m/cloth/ours_cloth_1/1/walk.png';await mkdir(new URL('image/equip/m/cloth/ours_cloth_1/1/',dir),{recursive:true});await writeFile(new URL(file,dir),sheet.toBuffer('image/png'));
const manifest={version:2,id:'eight-pose-keyframe-walk-v2',width:250,height:342,frames:8,frameMs:90,speed:48,source,sourceSize:[1774,887],sourceSha256:createHash('sha256').update(bytes).digest('hex'),sourceFrames:frames,importMatrix:matrix,headPolicy:'Unchanged canonical head/eyes/hair/hat at common original origin; one body-family import for all8poses.',items:[{id:'ours-510900001',file,url:'/ddt40/keyframe-walk8/'+file}],acceptance:'Owner requested an8-frame trial. Three built-in ImageGen calls produced this source; the opposite-leg instruction was not fully achieved. Eight distinct drawings are playable for review, not an accepted natural gait.',scope:'Eight-frame Canvas trial, one outfit, auxiliary walk.png. Not DDTank battle/virtual or Godot/Phaser integration.'};
await writeFile(new URL('manifest.json',dir),JSON.stringify(manifest,null,2)+'\n');console.log('Exported8distinct authored poses as2000x342; immutable appearance layers preserved.');

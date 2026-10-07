import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const master=await loadImage(await readFile('assets/character-master/front-v1.png'));
GlobalFonts.registerFromPath('C:/Windows/Fonts/tahoma.ttf','GuideFont');
const c=createCanvas(1000,880),ctx=c.getContext('2d');ctx.fillStyle='#eee9db';ctx.fillRect(0,0,1000,880);
ctx.save();ctx.translate(-450,0);ctx.scale(1.5,1.5);ctx.drawImage(master,0,0);
ctx.strokeStyle='rgba(0,130,180,.4)';ctx.fillStyle='#096181';ctx.font='12px GuideFont';
for(let x=300;x<=950;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,585);ctx.stroke();ctx.fillText(String(x),x+2,15);}
for(let y=50;y<=550;y+=50){ctx.beginPath();ctx.moveTo(300,y);ctx.lineTo(960,y);ctx.stroke();ctx.fillText(String(y),302,y-3);}
ctx.restore();await mkdir('evidence/character-master/head-hair',{recursive:true});
await writeFile('evidence/character-master/head-hair/coordinate-guide.png',c.toBuffer('image/png'));

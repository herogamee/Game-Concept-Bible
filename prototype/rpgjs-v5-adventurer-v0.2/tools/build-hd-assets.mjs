// Export original masters at higher texture density; world geometry stays v0.1.
import fs from 'node:fs';
import {createCanvas,loadImage} from '@napi-rs/canvas';
const root=new URL('../',import.meta.url),source=new URL('../web-pixel-rpg-v0.1/assets/painted/',root),out=new URL('public/willowbrook/hd/',root);
fs.mkdirSync(out,{recursive:true});
const save=(name,canvas)=>fs.writeFileSync(new URL(`${name}.png`,out),canvas.toBuffer('image/png'));
async function actor(name,columns,rows,size){
 const image=await loadImage(fs.readFileSync(new URL(`${name}-source.png`,source)));
 const canvas=createCanvas(columns*size,rows*size),ctx=canvas.getContext('2d');
 for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
  const left=Math.round(x*image.width/columns),top=Math.round(y*image.height/rows);
  const right=Math.round((x+1)*image.width/columns),bottom=Math.round((y+1)*image.height/rows);
  ctx.drawImage(image,left,top,right-left,bottom-top,x*size,y*size,size,size);
 }
 save(name,canvas);return canvas;
}
await actor('adventurer',8,8,128);
await actor('slime',4,4,96);
const npcs=await actor('npcs',3,3,128);
for(const [column,role] of ['elder','merchant','guide'].entries()){
 const canvas=createCanvas(128,384),ctx=canvas.getContext('2d');
 ctx.drawImage(npcs,column*128,0,128,384,0,0,128,384);save(`npc-${role}`,canvas);
}
// Same reviewed crop rectangles and logical output boxes as v0.1 slice-art.py.
const regions={house:[0,0,315,370],tree:[316,0,648,370],rock:[649,70,930,370],bush:[931,60,1254,370],flower:[0,400,314,645],fence:[315,420,670,638],sign:[675,375,939,652],well:[940,370,1254,685],lamp:[0,645,310,969],'house-blue':[312,645,644,979],market:[645,673,948,979],planter:[950,680,1254,979],reeds:[0,979,310,1254],barrels:[312,990,608,1254],bridge:[612,980,952,1254],rune:[958,970,1254,1254]};
const props=JSON.parse(fs.readFileSync(new URL('src/game/props.json',root),'utf8'));
const atlas=await loadImage(fs.readFileSync(new URL('village-atlas.png',source)));
for(const [name,[left,top,right,bottom]] of Object.entries(regions)){
 const crop=createCanvas(right-left,bottom-top),ctx=crop.getContext('2d');
 ctx.drawImage(atlas,left,top,crop.width,crop.height,0,0,crop.width,crop.height);
 const pixels=ctx.getImageData(0,0,crop.width,crop.height).data;
 let minX=crop.width,minY=crop.height,maxX=-1,maxY=-1;
 for(let y=0;y<crop.height;y++)for(let x=0;x<crop.width;x++)if(pixels[(y*crop.width+x)*4+3]){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
 if(maxX<0)throw new Error(`Empty master crop: ${name}`);
 const {width,height}=props[name],canvas=createCanvas(width*2,height*2),dest=canvas.getContext('2d');
 const w=maxX-minX+1,h=maxY-minY+1,ratio=Math.min(canvas.width/w,canvas.height/h);
 const dw=Math.floor(w*ratio),dh=Math.floor(h*ratio);
 dest.drawImage(crop,minX,minY,w,h,Math.floor((canvas.width-dw)/2),canvas.height-dh,dw,dh);save(name,canvas);
}
console.log('HD original masters: 128px hero/NPC, 96px slime, 2x prop textures; unchanged world boxes.');
// Pack the reviewed generated 8x8 sheet with transparent frame gutters.
const cleanHero=await loadImage(fs.readFileSync(new URL('assets/masters/chibi-hero-v2.png',root)));
const packed=createCanvas(1536,1536),packedCtx=packed.getContext('2d');
for(let row=0;row<8;row++)for(let column=0;column<8;column++){
 const left=Math.round(column*cleanHero.width/8),top=Math.round(row*cleanHero.height/8),right=Math.round((column+1)*cleanHero.width/8),bottom=Math.round((row+1)*cleanHero.height/8);
 // Keep native pixels and pin walk-frame feet to one baseline.
 const cell=createCanvas(right-left,bottom-top),cellCtx=cell.getContext('2d');
 cellCtx.drawImage(cleanHero,left,top,cell.width,cell.height,0,0,cell.width,cell.height);
 const rgba=cellCtx.getImageData(0,0,cell.width,cell.height).data;
 let foot=0;
 for(let y=0;y<cell.height;y++)for(let x=0;x<cell.width;x++)if(rgba[(y*cell.width+x)*4+3]>127)foot=Math.max(foot,y+1);
 // Attack silhouettes include the sword: retain their authored vertical registration.
 const yOffset=row<4?172-foot:16;
 packedCtx.drawImage(cell,column*192+Math.floor((192-cell.width)/2),row*192+yOffset);
}
save('chibi-hero-v2',packed);
const avatar=createCanvas(112,112),avatarCtx=avatar.getContext('2d');
avatarCtx.drawImage(cleanHero,24,0,112,112,0,0,112,112);save('hero-avatar-v2',avatar);
// Render procedural terrain at 2x density directly, rather than enlarging a bake.
const {default:vm}=await import('node:vm');
const terrainSource=fs.readFileSync(new URL('../web-pixel-rpg-v0.1/src/world.js',root),'utf8').replace('out.width=960;out.height=540','out.width=1920;out.height=1080').replace("g.imageSmoothingEnabled=false",'g.scale(2,2);g.imageSmoothingEnabled=true');
const flower=await loadImage(fs.readFileSync(new URL('flower.png',out)));
const terrainScope={document:{createElement:()=>createCanvas(1,1)},Art:{object:()=>flower}};
vm.runInNewContext(terrainSource+';this.drawGround=ground;',terrainScope);
for(const [id,key] of [['village','v'],['meadow','f']]){
 const canvas=createCanvas(1920,1088),ctx=canvas.getContext('2d');ctx.drawImage(terrainScope.drawGround(key),0,0);ctx.fillStyle='#79966a';ctx.fillRect(0,1080,1920,8);save(`${id}-ground`,canvas);
}

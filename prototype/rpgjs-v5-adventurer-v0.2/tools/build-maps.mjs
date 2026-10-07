import fs from 'node:fs';
import {createCanvas} from '@napi-rs/canvas';
const root=new URL('../',import.meta.url);
// Physics tiles must never paint terrain over independently sorted props.
fs.writeFileSync(new URL('src/tiled/collision.png',root),createCanvas(16,16).toBuffer('image/png'));
const {world,props}=JSON.parse(fs.readFileSync(new URL('tools/parity-world.json',root),'utf8'));
const point=(id,type,x,y,properties={})=>({id,type,x,y,properties});
const rectangle=(id,type,x,y,width,height,properties)=>({...point(id,type,x,y,properties),width,height});
const content={
  village:{name:'Willowbrook · หมู่บ้าน',width:960,height:544,tileSize:16,columns:60,spawn:{x:480,y:300},objects:[
    point('elder-001','npc',465,220,{questId:'starter-slime-001',role:'elder'}),
    point('merchant-001','npc',370,320,{role:'merchant'}),
    point('guide-001','npc',570,330,{role:'guide'}),
    rectangle('village-south','portal',430,505,100,35,{targetMap:'meadow',targetX:480,targetY:50}),
  ]},
  meadow:{name:'Slime Meadow · ทุ่งหญ้า',width:960,height:544,tileSize:16,columns:60,spawn:{x:480,y:50},objects:[
    point('slime-001','monster',170,170,{spawnGroup:'starter-slimes',monsterId:'slime'}),
    point('slime-002','monster',300,260,{spawnGroup:'starter-slimes',monsterId:'slime'}),
    point('slime-003','monster',480,190,{spawnGroup:'starter-slimes',monsterId:'slime'}),
    point('slime-004','monster',610,220,{spawnGroup:'starter-slimes',monsterId:'slime'}),
    rectangle('meadow-north','portal',430,0,100,32,{targetMap:'village',targetX:480,targetY:475}),
  ]}
};
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;');
for(const [id,map] of Object.entries(content)){
  const obstacles=id==='village'?[{x:64,y:352,w:192,h:128}]:[];
  for(const [i,[kind,x,y]] of world.objects[id==='village'?'v':'f'].entries()){
    const {width,height}=props[kind];
    map.objects.push(point(`prop-${id}-${i}`,'prop',x+width/2,y+height,{graphic:`prop-${kind}`}));
    if(kind==='tree')obstacles.push({x:x+46,y:y+107,w:22,h:33});
    else if(kind.startsWith('house'))obstacles.push({x:x+18,y:y+95,w:188,h:80});
    else if(!['flower','sign','lamp','reeds','planter'].includes(kind))obstacles.push({x:x+5,y:y+height-18,w:width-10,h:16});
  }
  // Shared tile mask: visible ground stays intact; only footprints/water block.
  map.blockedTiles=Array.from({length:2040},(_,i)=>i).filter(i=>{
    const x=i%60*16,y=Math.floor(i/60)*16;
    return obstacles.some(o=>x<o.x+o.w&&x+16>o.x&&y<o.y+o.h&&y+16>o.y);
  });
  const objects=map.objects.map((o,i)=>`<object id="${i+1}" name="${o.id}" type="${o.type}" x="${o.x}" y="${o.y}" ${o.width?`width="${o.width}" height="${o.height}"`:''}><properties>${Object.entries(o.properties).map(([k,v])=>`<property name="${k}" ${typeof v==='number'?'type="int"':''} value="${escape(v)}"/>`).join('')}</properties>${o.width?'':'<point/>'}</object>`).join('\n');
  const tiles=Array.from({length:2040},(_,i)=>map.blockedTiles.includes(i)?1:0);
  fs.writeFileSync(new URL(`src/tiled/${id}.tmx`,root),`<?xml version="1.0" encoding="UTF-8"?><map version="1.10" tiledversion="1.11.2" orientation="orthogonal" renderorder="right-down" width="60" height="34" tilewidth="16" tileheight="16" infinite="0" nextlayerid="3" nextobjectid="${map.objects.length+1}"><tileset firstgid="1" source="${id}-ground.tsx"/><layer id="1" name="Collision" width="60" height="34"><data encoding="csv">${tiles.join(',')}</data></layer><objectgroup id="2" name="Content">${objects}</objectgroup></map>`);
  fs.writeFileSync(new URL(`src/tiled/${id}-ground.tsx`,root),`<?xml version="1.0" encoding="UTF-8"?><tileset version="1.10" tiledversion="1.11.2" name="${id}-collision" tilewidth="16" tileheight="16" tilecount="1" columns="1"><image source="collision.png" width="16" height="16"/><tile id="0"><properties><property name="collision" type="bool" value="true"/></properties></tile></tileset>`);
}
fs.writeFileSync(new URL('src/game/content.json',root),JSON.stringify(content,null,2));
fs.writeFileSync(new URL('src/game/props.json',root),JSON.stringify(props,null,2));
console.log('Original village/meadow layout rebuilt with shared footprint collision and stable content IDs.');

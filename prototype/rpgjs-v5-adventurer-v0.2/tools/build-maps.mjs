import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const point=(id,type,x,y,properties={})=>({id,type,x,y,properties});
const rectangle=(id,type,x,y,width,height,properties)=>({...point(id,type,x,y,properties),width,height});
const content={
  village:{name:'Willowbrook · หมู่บ้าน',spawn:{x:320,y:224},objects:[
    point('elder-001','npc',320,160,{questId:'starter-slime-001',role:'elder'}),
    point('merchant-001','npc',224,256,{role:'merchant'}),
    point('guide-001','npc',416,256,{role:'guide'}),
    rectangle('village-south','portal',288,432,64,40,{targetMap:'meadow',targetX:320,targetY:72}),
  ]},
  meadow:{name:'Slime Meadow · ทุ่งหญ้า',spawn:{x:320,y:72},objects:[
    point('slime-001','monster',280,224,{spawnGroup:'starter-slimes',monsterId:'slime'}),
    point('slime-002','monster',416,304,{spawnGroup:'starter-slimes',monsterId:'slime'}),
    point('slime-003','monster',160,304,{spawnGroup:'starter-slimes',monsterId:'slime'}),
    point('slime-004','monster',432,160,{spawnGroup:'starter-slimes',monsterId:'slime'}),
    rectangle('meadow-north','portal',288,16,64,32,{targetMap:'village',targetX:320,targetY:400}),
  ]}
};
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;');
for(const [id,map] of Object.entries(content)){
  const tiles=Array.from({length:300},(_,i)=>{
    const x=i%20,y=Math.floor(i/20);
    if(x===0||x===19||y===0||y===14)return 3;
    if((x===9||x===10)||id==='village'&&y===7)return 2;
    if(id==='village'&&x>=2&&x<=5&&y>=10&&y<=12)return 4;
    if(id==='meadow'&&x>=3&&x<=4&&y>=3&&y<=4)return 3;
    return 1;
  });
  map.blockedTiles=tiles.map((t,i)=>t===3||t===4?i:-1).filter(i=>i>=0);
  const objects=map.objects.map((o,i)=>`<object id="${i+1}" name="${o.id}" type="${o.type}" x="${o.x}" y="${o.y}" ${o.width?`width="${o.width}" height="${o.height}"`:''}><properties>${Object.entries(o.properties).map(([k,v])=>`<property name="${k}" ${typeof v==='number'?'type="int"':''} value="${escape(v)}"/>`).join('')}</properties>${o.width?'':'<point/>'}</object>`).join('\n');
  const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<map version="1.10" tiledversion="1.11.2" orientation="orthogonal" renderorder="right-down" width="20" height="15" tilewidth="32" tileheight="32" infinite="0" nextlayerid="3" nextobjectid="${map.objects.length+1}"><tileset firstgid="1" source="willowbrook.tsx"/><layer id="1" name="Terrain" width="20" height="15"><data encoding="csv">${tiles.join(',')}</data></layer><objectgroup id="2" name="Content">${objects}</objectgroup></map>`;
  fs.writeFileSync(new URL(`src/tiled/${id}.tmx`,root),xml);
}
fs.writeFileSync(new URL('src/tiled/willowbrook.tsx',root),`<?xml version="1.0" encoding="UTF-8"?><tileset version="1.10" tiledversion="1.11.2" name="Willowbrook" tilewidth="32" tileheight="32" tilecount="5" columns="5"><image source="willowbrook-tiles.png" width="160" height="32"/><tile id="2"><properties><property name="collision" type="bool" value="true"/></properties></tile><tile id="3"><properties><property name="collision" type="bool" value="true"/></properties></tile></tileset>`);
fs.writeFileSync(new URL('src/game/content.json',root),JSON.stringify(content,null,2));
console.log('Tiled maps and content registry rebuilt from stable object IDs.');

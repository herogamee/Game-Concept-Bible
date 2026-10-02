// Fixed encounter tiers: character levels do not silently scale every monster.
const MonsterTypes = {
  slime: {name:'สไลม์',level:1,hp:3,attack:3,speed:50,exp:8,gold:2,gel:1},
  azure: {name:'สไลม์ฟ้า',level:3,hp:9,attack:5,speed:55,exp:18,gold:5,gel:1},
  boar: {name:'หมูป่า',level:5,hp:18,attack:8,speed:65,exp:32,gold:9,gel:0}
};
function monsterSprite(m, frame) {
  if(m.kind==='slime') return Art.slime(frame);
  const key=m.kind+frame;
  if(monsterSprite.cache[key])return monsterSprite.cache[key];
  const canvas=document.createElement('canvas');canvas.width=48;canvas.height=40;
  const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
  if(m.kind==='azure') {
    ctx.drawImage(Art.slime(frame),0,0);
    ctx.globalCompositeOperation='source-atop';ctx.fillStyle='#649bb880';ctx.fillRect(0,0,48,40);
  } else {
    const r=(color,x,y,w,h)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h)};
    const bob=frame%2;
    r('#3d493c',5,34,39,3);r('#523c33',9,27,6,9-bob);r('#523c33',31,27,6,9+bob);
    r('#684e3e',6,14+bob,37,17);r('#947455',10,11+bob,28,18);
    r('#b39468',12,12+bob,19,4);r('#523d34',8,6+bob,7,10);r('#523d34',30,6+bob,7,10);
    r('#302f2d',12,21+bob,3,3);r('#302f2d',31,21+bob,3,3);
    r('#be9475',19,24+bob,11,8);r('#644538',21,27+bob,2,2);r('#644538',27,27+bob,2,2);
    r('#e4d9b6',14,26+bob,4,7);r('#e4d9b6',32,26+bob,4,7);
  }
  return monsterSprite.cache[key]=canvas;
}
monsterSprite.cache={};

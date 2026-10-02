const World={width:960,height:540,viewW:800,viewH:450,objects:{v:[['house',55,15],['house-blue',688,20],['tree',290,0],['tree',575,0],['well',190,245],['market',300,187],['barrels',248,180],['planter',685,288],['reeds',72,437],['rune',785,345],['sign',535,430],['lamp',665,210],['lamp',320,200],['bush',25,215],['bush',865,315],['rock',820,435],['fence',45,220],['fence',109,220],['fence',735,225],['fence',799,225]],f:[['tree',275,65],['tree',605,250],['tree',25,315],['tree',845,30],['rock',90,85],['rock',220,390],['rock',740,120],['bush',690,420],['bush',65,210],['sign',535,38]]}};
// Seeded, cached terrain: small variations without per-frame texture work.
function ground(map){
  const out=document.createElement('canvas');out.width=960;out.height=540;
  const g=out.getContext('2d');g.imageSmoothingEnabled=false;
  let seed=map==='v'?281:391;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const rect=(color,X,Y,W,H)=>{g.fillStyle=color;g.fillRect(X,Y,W,H)};
  rect('#79966a',0,0,960,540);
  for(let i=0;i<13000;i++){
    const X=Math.floor(random()*960),Y=Math.floor(random()*540);
    rect(['#819d70','#719060','#8ca476','#91aa7c'][i%4],X,Y,1+Math.floor(random()*3),1);
    if(i%17===0){rect('#627f57',X,Y,1,3);rect('#a0b489',X+1,Y-1,1,2)}
  }
  // Soft worn margins make roads meet the grass rather than abrupt tile stripes.
  rect('#839367',405,0,145,540);rect('#a49e77',413,0,131,540);rect('#b8ac8a',420,0,117,540);
  if(map==='v'){rect('#839367',0,243,960,89);rect('#a49e77',0,249,960,78);rect('#b8ac8a',0,254,960,69)}
  for(let Y=0;Y<540;Y+=9)for(let X=0;X<960;X+=14){
    const px=X+(Math.floor(Y/9)%2)*7,py=Y;
    const path=px>=420&&px<537||(map==='v'&&py>=254&&py<323);
    if(!path)continue;
    if(map==='v'){
      const shade=['#b4ac92','#c2b89b','#aaa78d','#bcb397'][Math.floor(random()*4)];
      rect('#939580',px,py,11,7);rect(shade,px+1,py,9,5);rect('#cec3a6',px+2,py,6,1);
    }else if(random()>.55){rect('#a89673',px,py,3,1);rect('#cabc96',px+4,py+4,2,1)}
  }
  for(let i=0;i<220;i++){
    const Y=Math.floor(random()*540),left=i%2===0,X=left?400+random()*20:536+random()*15;
    rect('#91a178',X,Y,2,2);rect('#607e53',X,Y+1,1,3);
  }
  if(map==='v'){
    rect('#586e58',58,346,203,140);rect('#a69f7b',61,349,197,134);rect('#4c7d83',64,352,192,128);
    rect('#608e91',69,357,182,118);
    for(let i=0;i<190;i++){
      const X=73+Math.floor(random()*171),Y=362+Math.floor(random()*106);
      rect(i%3===0?'#9abbb0':'#70a1a0',X,Y,3+Math.floor(random()*10),1);
    }
    for(let i=0;i<20;i++){
      const X=66+Math.floor(random()*180);rect('#bac1a0',X,354,4,1);rect('#b8bfa0',X,475,5,1);
    }
    // A circular village emblem and flower beds create a deliberate focal point.
    g.strokeStyle='#d1c5a5';g.lineWidth=2;g.beginPath();g.ellipse(480,285,41,24,0,0,Math.PI*2);g.stroke();
    g.strokeStyle='#92957c';g.beginPath();g.ellipse(480,285,36,20,0,0,Math.PI*2);g.stroke();
    for(const [X,Y] of [[315,355],[615,350],[285,195],[655,165]]){
      rect('#667c55',X,Y,44,20);rect('#a79a76',X,Y+18,44,3);
      for(let i=0;i<5;i++)g.drawImage(Art.object('flower'),X+i*8,Y-8,20,20);
    }
  }
  for(let i=0;i<70;i++){
    const X=(i*137+23)%930,Y=(i*73+17)%510;
    if(X>390&&X<560||map==='v'&&Y>230&&Y<335||map==='v'&&X<270&&Y>340)continue;
    g.drawImage(Art.object('flower'),X,Y,16,16);
  }
  return out;
}

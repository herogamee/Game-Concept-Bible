/** Pose-owned exposed-body registration. Every outfit uses these same paths. */
export const frontPoseLayout={
 // Template-owned anatomical authoring regions, not per-clothing bounds.
 skinRegions:[[390,650,180,250],[695,650,180,250],[480,880,290,210]],
 skinRule:{minRed:190,minGreen:110,minBlue:75,minRedGreen:35,minRedBlue:55,minGreenBlue:15,minAlpha:100},
 dilation:5,componentsPerRegion:[1,1,2],
 poses:[
 {id:'right-contact',sourceKey:'left-contact'},
 {id:'left-passing',sourceKey:'left-passing'},
 {id:'left-contact',sourceKey:'right-contact-corrected'},
 {id:'right-passing',sourceKey:'right-passing'}
]};
export function frontSkinMask(data,width=1254,height=1254){
 const mask=new Uint8Array(width*height),rule=frontPoseLayout.skinRule;
 for(const [region,[left,top,w,h]] of frontPoseLayout.skinRegions.entries()){
  const candidates=new Uint8Array(w*h);
  for(let y=top;y<top+h;y++)for(let x=left;x<left+w;x++){
  const i=(y*width+x)*4,r=data[i],g=data[i+1],b=data[i+2];
  if(data[i+3]>rule.minAlpha&&r>rule.minRed&&g>rule.minGreen&&b>rule.minBlue&&r-g>=rule.minRedGreen&&r-b>=rule.minRedBlue&&g-b>=rule.minGreenBlue)candidates[(y-top)*w+x-left]=1;
  }
  // Retain anatomical components, rather than every warm cream garment pixel.
  // This mask is derived once from the traveler pose and reused unchanged.
  const components=[];
  for(let p=0;p<candidates.length;p++)if(candidates[p]){
   const component=[p];candidates[p]=0;
   for(let j=0;j<component.length;j++){
    const q=component[j],px=q%w,py=Math.floor(q/w);
    for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const nx=px+dx,ny=py+dy,n=ny*w+nx;if(nx>=0&&nx<w&&ny>=0&&ny<h&&candidates[n]){candidates[n]=0;component.push(n);}}
   }
   components.push(component);
  }
  components.sort((a,b)=>b.length-a.length);
  for(const component of components.slice(0,frontPoseLayout.componentsPerRegion[region]))for(const p of component){
   const x=left+p%w,y=top+Math.floor(p/w);
   for(let dy=-frontPoseLayout.dilation;dy<=frontPoseLayout.dilation;dy++)for(let dx=-frontPoseLayout.dilation;dx<=frontPoseLayout.dilation;dx++){
    if(dx*dx+dy*dy<=frontPoseLayout.dilation**2)mask[(y+dy)*width+x+dx]=1;
   }
  }
 }
 return mask;
}

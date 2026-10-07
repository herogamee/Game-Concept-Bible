import {canonicalPoint,deformPoint} from './walk-rig.mjs';
/** Canvas-native skinning of intact clothing textures, baked once at authoring time. */
function triangle(ctx,image,s,d){
  const [p,q,r]=s,[u,v,w]=d,den=(q[0]-p[0])*(r[1]-p[1])-(r[0]-p[0])*(q[1]-p[1]);
  const a=((v[0]-u[0])*(r[1]-p[1])-(w[0]-u[0])*(q[1]-p[1]))/den;
  const c=((w[0]-u[0])*(q[0]-p[0])-(v[0]-u[0])*(r[0]-p[0]))/den;
  const b=((v[1]-u[1])*(r[1]-p[1])-(w[1]-u[1])*(q[1]-p[1]))/den;
  const e=((w[1]-u[1])*(q[0]-p[0])-(v[1]-u[1])*(r[0]-p[0]))/den;
  ctx.save();ctx.beginPath();
  const center=[(u[0]+v[0]+w[0])/3,(u[1]+v[1]+w[1])/3];
  // Subpixel overlap prevents antialias gaps at shared triangle edges.
  for(let i=0;i<3;i++){const z=d[i],dx=z[0]-center[0],dy=z[1]-center[1],n=Math.hypot(dx,dy);const x=z[0]+dx/n*.4,y=z[1]+dy/n*.4;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  ctx.closePath();ctx.clip();ctx.transform(a,b,c,e,u[0]-a*p[0]-c*p[1],u[1]-b*p[0]-e*p[1]);ctx.drawImage(image,0,0);ctx.restore();
}
export function drawClothingPose(ctx,image,pose){
  const step=12;
  for(let y=552;y<1230;y+=step)for(let x=408;x<864;x+=step){
    const points=[[x,y],[x+step,y],[x,y+step],[x+step,y+step]];
    const source=points.map(canonicalPoint),dest=points.map(p=>canonicalPoint(deformPoint(p,pose)));
    triangle(ctx,image,[source[0],source[1],source[2]],[dest[0],dest[1],dest[2]]);
    triangle(ctx,image,[source[2],source[1],source[3]],[dest[2],dest[1],dest[3]]);
  }
}

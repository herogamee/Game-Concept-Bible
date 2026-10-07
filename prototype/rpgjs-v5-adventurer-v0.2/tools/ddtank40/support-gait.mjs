/** Original bounded gait proof, inspired by upstream support-target workflows.
 * Artwork is deliberately absent. Fixed limb identities never swap at a crossing.
 */
export const supportRig=Object.freeze({id:'support-target-gait-v1',frames:8,frameMs:90,stance:.6,stride:22,lift:6,floor:300,ankleY:295,hipY:260,upper:18,lower:22,
  colours:{left:'#2275ba',right:'#df721d'},phases:['ซ้ายลงเท้า','ซ้ายรับน้ำหนัก','ขวาผ่านกลาง','ขวาเตรียมลง','ขวาลงเท้า','ขวารับน้ำหนัก','ซ้ายผ่านกลาง','ซ้ายเตรียมลง']});
export const supportSpeed=supportRig.stride/(supportRig.stance*supportRig.frames*supportRig.frameMs/1000);
const wrap=t=>((t%1)+1)%1;
function chain(hip,target,upper,lower){
  const dx=target[0]-hip[0],dy=target[1]-hip[1],distance=Math.hypot(dx,dy);
  if(distance<=Math.abs(upper-lower)||distance>=upper+lower)throw new Error('Gait target exceeds fixed bone reach');
  const along=(upper*upper-lower*lower+distance*distance)/(2*distance),across=Math.sqrt(upper*upper-along*along),ux=dx/distance,uy=dy/distance;
  return {hip,knee:[hip[0]+ux*along-uy*across,hip[1]+uy*along+ux*across],ankle:target};
}
export function supportPose(phase,blend=1){
  phase=wrap(phase);blend=Math.max(0,Math.min(1,blend));
  const bodyY=blend*(.7-1.2*Math.cos(phase*Math.PI*4)),pelvis=[100, supportRig.hipY+bodyY];
  const legs=['left','right'].map((id,index)=>{
    const t=wrap(phase+index*.5),stance=t<supportRig.stance,progress=stance?t/supportRig.stance:(t-supportRig.stance)/(1-supportRig.stance);
    // Stance is linear in body space so root translation cancels it exactly.
    // Swing smoothstep and a LOW arc return the foot ahead of the body.
    const eased=progress*progress*(3-2*progress),advance=stance?-supportRig.stride/2+supportRig.stride*progress:supportRig.stride/2-supportRig.stride*eased;
    const lift=stance?0:supportRig.lift*Math.sin(Math.PI*progress)**2,hip=[index?104:96,pelvis[1]],target=[hip[0]+advance*blend,supportRig.ankleY-lift*blend];
    return {...chain(hip,target,supportRig.upper,supportRig.lower),id,colour:supportRig.colours[id],stance,advance:advance*blend,sole:[target[0],target[1]+supportRig.floor-supportRig.ankleY]};
  });
  const arms=['left','right'].map((id,index)=>{const shoulder=[index?121:82,199+bodyY],angle=(index?1:-1)*.23*Math.cos(phase*Math.PI*2)*blend;
    const elbow=[shoulder[0]-20*Math.sin(angle),shoulder[1]+20*Math.cos(angle)],wrist=[elbow[0]-18*Math.sin(angle-.16),elbow[1]+18*Math.cos(angle-.16)];return {id,colour:supportRig.colours[id],shoulder,elbow,wrist};});
  return {id:supportRig.id,phase,frame:Math.floor(phase*8),bodyY,pelvis,legs,arms};
}
export function drawSupportBody(ctx,pose){
  const line=(points,colour,width)=>{ctx.beginPath();ctx.strokeStyle=colour;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();};
  const joint=(p,colour,r=2)=>{ctx.beginPath();ctx.fillStyle='#fffdf5';ctx.strokeStyle=colour;ctx.lineWidth=1;ctx.arc(...p,r,0,Math.PI*2);ctx.fill();ctx.stroke();};
  // Far limb remains far; projection order is independent of which foot leads.
  const leg=l=>{line([l.hip,l.knee,l.ankle],l.colour,5);line([[l.sole[0]+3,l.sole[1]-2],[l.sole[0]-8,l.sole[1]-2]],l.colour,4);[l.hip,l.knee,l.ankle].forEach(p=>joint(p,l.colour));if(l.stance){ctx.beginPath();ctx.strokeStyle=l.colour;ctx.lineWidth=1;ctx.ellipse(l.sole[0]-2,l.sole[1]+1,8,2,0,0,Math.PI*2);ctx.stroke();}};
  const arm=a=>{line([a.shoulder,a.elbow,a.wrist],a.colour,4);[a.elbow,a.wrist].forEach(p=>joint(p,a.colour));};
  leg(pose.legs[1]);arm(pose.arms[1]);
  const y=pose.bodyY;ctx.fillStyle='#b4c2b0';ctx.strokeStyle='#60745d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(92,178+y);ctx.lineTo(107,178+y);ctx.lineTo(123,200+y);ctx.lineTo(111,250+y);ctx.lineTo(88,250+y);ctx.lineTo(80,200+y);ctx.closePath();ctx.fill();ctx.stroke();
  line([[100,189+y],pose.pelvis],'#60745d',3);line([[96,pose.pelvis[1]],[104,pose.pelvis[1]]],'#60745d',5);
  leg(pose.legs[0]);arm(pose.arms[0]);joint(pose.pelvis,'#60745d');
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {supportRig,supportSpeed,supportPose} from './support-gait.mjs';
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),close=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('contacts and passing exchange visible leg roles with fixed identities',()=>{
  const frames=Array.from({length:8},(_,i)=>supportPose(i/8));
  assert(frames[0].legs[0].sole[0]<frames[0].legs[1].sole[0]);
  assert(frames[4].legs[1].sole[0]<frames[4].legs[0].sole[0]);
  assert(frames[2].legs[0].stance&&!frames[2].legs[1].stance);
  assert(frames[6].legs[1].stance&&!frames[6].legs[0].stance);
  for(const p of frames)assert.deepEqual(p.legs.map(l=>l.id),['left','right']);
});
test('fixed bone lengths, continuous cycle, bend direction and grounded support',()=>{
  for(let i=0;i<=1600;i++){const p=supportPose(i/1600);assert(p.legs.some(l=>l.stance));for(const l of p.legs){close(distance(l.hip,l.knee),supportRig.upper);close(distance(l.knee,l.ankle),supportRig.lower);assert(l.sole[1]<=supportRig.floor);if(l.stance)close(l.sole[1],supportRig.floor);const hx=l.knee[0]-l.hip[0],hy=l.knee[1]-l.hip[1],fx=l.ankle[0]-l.hip[0],fy=l.ankle[1]-l.hip[1];assert(hx*fy-hy*fx<0,'Knee flips its bend side');}}
  assert.deepEqual(supportPose(0),supportPose(1));
  for(const phase of [.6,.1,0]){const a=supportPose(phase-1e-7),b=supportPose(phase+1e-7);for(let i=0;i<2;i++)assert(distance(a.legs[i].ankle,b.legs[i].ankle)<.0001);}
});
test('support feet stay stationary in world space for both directions and every speed',()=>{
  const duration=supportRig.frames*supportRig.frameMs/1000;
  for(const direction of [-1,1])for(const rate of [.5,1,1.5])for(let i=0;i<999;i++){
    const t=i*.001,dt=.00001,p=supportPose(t*rate/duration),next=supportPose((t+dt)*rate/duration);
    for(let leg=0;leg<2;leg++)if(p.legs[leg].stance&&next.legs[leg].stance){const a=direction*supportSpeed*t*rate-direction*p.legs[leg].sole[0],b=direction*supportSpeed*(t+dt)*rate-direction*next.legs[leg].sole[0];close(a,b);}
  }
});

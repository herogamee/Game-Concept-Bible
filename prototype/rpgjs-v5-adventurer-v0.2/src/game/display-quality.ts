export type DisplayQuality='smooth'|'pixel';
export function renderResolution(width:number,dpr:number,quality:DisplayQuality):number {
  if(quality==='pixel')return 1;
  const ratio=Number.isFinite(width)&&width>0?width/800:1;
  const density=Number.isFinite(dpr)&&dpr>0?dpr:1;
  // Bound GPU allocation; world dimensions/physics remain 800×450.
  return Math.round(Math.max(1,Math.min(3,ratio*density))*100)/100;
}

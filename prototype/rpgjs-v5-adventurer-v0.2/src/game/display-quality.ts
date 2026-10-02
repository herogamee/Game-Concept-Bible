export type DisplayQuality='smooth'|'pixel';
export function renderResolution(width:number,dpr:number,quality:DisplayQuality,logicalWidth=800):number {
  if(quality==='pixel')return 1;
  const ratio=Number.isFinite(width)&&width>0?width/logicalWidth:1;
  const density=Number.isFinite(dpr)&&dpr>0?dpr:1;
  // Bound GPU allocation; viewport cropping never changes world physics units.
  return Math.round(Math.max(1,Math.min(3,ratio*density))*100)/100;
}

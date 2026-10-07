/** One recorded, uniform conversion for every layer on the same master. */
export function masterMatrix(calibration) {
  const m=calibration?.matrix;
  if(calibration?.mode!=='uniform-shared-master'||!Array.isArray(m)||m.length!==6||!m.every(Number.isFinite))throw new Error('A shared master matrix is required');
  if(m[0]<=0||m[1]!==0||m[2]!==0||Math.abs(m[0]-m[3])>1e-12)throw new Error('Master export must preserve proportions: no stretch, shear or rotation');
  if(calibration.head||calibration.cloth)throw new Error('Independent head/body transforms would change the designed proportions');
  return m;
}
export function masterPoint(calibration,[x,y]) {
  const [a,b,c,d,e,f]=masterMatrix(calibration);return [a*x+c*y+e,b*x+d*y+f];
}

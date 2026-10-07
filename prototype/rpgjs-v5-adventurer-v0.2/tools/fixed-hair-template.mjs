/** Front short-hair trial: authored coordinates, never a fitting transform. */
export const fixedHairLayout = {
  id: 'fixed-front-short-hair-v1',
  alphaThreshold: 128,
  headAxisX: 625,
  scalpTopY: 179,
  sourceWindow: [320, 15, 620, 510],
  envelope: {width: [490, 570], aboveScalp: [55, 155], maxBottomY: 524},
  // Reference coordinates from the immutable bald head, not item bounds.
  references: {head: [625, 357], scalpTop: [625, 179], temples: [[462, 300], [788, 300]], ears: [[440, 435], [808, 435]], neck: [625, 543]},
  scope: 'Trial envelope for the three current short front hairstyles. Shared skull/registration and cap policy; outer silhouettes vary by style. Not a standard for back/side views, long hair or a production catalog. Owner visual review pending.'
};

/** Source-specific matte discards the generated portrait, retaining blue hair. */
export function blueHairOwnsPixel(x, y, r, g, b) {
  const [left, top, width, height] = fixedHairLayout.sourceWindow;
  return x >= left && x < left + width && y >= top && y < top + height && b > r + 3 && g > r + 2;
}

export function measureHair(data, width, height) {
  let left = width, top = height, right = -1, bottom = -1, pixels = 0;
  for (let p = 0; p < width * height; p++) if (data[p * 4 + 3] >= fixedHairLayout.alphaThreshold) {
    const x = p % width, y = Math.floor(p / width);
    if (x < left) left = x; if (x > right) right = x;
    if (y < top) top = y; if (y > bottom) bottom = y;
    pixels++;
  }
  if (!pixels) throw new Error('Empty hair overlay');
  return {left, top, right, bottom, width: right - left + 1, height: bottom - top + 1, aboveScalp: fixedHairLayout.scalpTopY - top, pixels};
}

export function hairEnvelopeFailures(measurement) {
  const e = fixedHairLayout.envelope, failures = [];
  if (measurement.width < e.width[0] || measurement.width > e.width[1]) failures.push(`width ${measurement.width} outside ${e.width.join('..')}`);
  if (measurement.aboveScalp < e.aboveScalp[0] || measurement.aboveScalp > e.aboveScalp[1]) failures.push(`crown clearance ${measurement.aboveScalp} outside ${e.aboveScalp.join('..')}`);
  if (measurement.bottom > e.maxBottomY) failures.push(`bottom ${measurement.bottom} exceeds ${e.maxBottomY}`);
  return failures;
}

/** Engine-independent registered bitmap layers. No bounding-box fitting or bone rig. */
export function validatePlan(plan) {
  if (!Number.isInteger(plan.width) || !Number.isInteger(plan.height) || plan.width < 1 || plan.height < 1) throw new Error('Invalid output frame');
  for (const layer of plan.layers) {
    const r = layer.source;
    if (!layer.url || ![r.x,r.y,r.width,r.height].every(Number.isInteger) || r.x < 0 || r.y < 0 || r.width < 1 || r.height < 1) throw new Error(`Invalid source frame: ${layer.slot}`);
    // This first contract uses full registered frame origins. Packing offsets need
    // explicit metadata in a future adapter, never a guessed fit to visible pixels.
    if (layer.x !== 0 || layer.y !== 0 || r.width > plan.width || r.height > plan.height) throw new Error(`Unregistered layer: ${layer.slot}`);
  }
}
export async function prepareRegisteredFrame(plan, loadImage) {
  validatePlan(plan);
  const images = await Promise.all(plan.layers.map(layer => loadImage(layer.url)));
  for (let i=0;i<images.length;i++) {
    const r=plan.layers[i].source,image=images[i];
    const width=image.naturalWidth ?? image.width,height=image.naturalHeight ?? image.height;
    if (r.x+r.width>width || r.y+r.height>height) throw new Error(`Source frame outside bitmap: ${plan.layers[i].slot}`);
  }
  return {plan,images};
}
export function drawPreparedFrame(canvas, {plan,images}) {
  if (canvas.width !== plan.width) canvas.width=plan.width;
  if (canvas.height !== plan.height) canvas.height=plan.height;
  const ctx=canvas.getContext('2d');ctx.save();ctx.setTransform(1,0,0,1,0,0);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,plan.width,plan.height);
  for(let i=0;i<plan.layers.length;i++) {
    const layer=plan.layers[i],r=layer.source;
    ctx.drawImage(images[i],r.x,r.y,r.width,r.height,layer.x,layer.y,r.width,r.height);
  }
  ctx.restore();
}

/** Cosmetic selections for one locked, registered front-pose template. */
export const fixedSlots = ['eye_set', 'face_set', 'hair', 'clothing', 'hat'];

export function resolveFixedSelection(manifest, selected = {}) {
  if (manifest.origin.x !== 0 || manifest.origin.y !== 0) throw new Error('Unregistered template origin');
  for (const key of Object.keys(selected)) if (!fixedSlots.includes(key)) throw new Error(`Unsupported category: ${key}`);
  const resolved = {};
  for (const slot of fixedSlots) {
    const chosen = selected[slot];
    if (chosen !== undefined && chosen !== null && typeof chosen !== 'string') throw new Error(`Invalid selection: ${slot}`);
    const id = chosen ?? manifest.defaults[slot];
    if (id === null) { resolved[slot] = null; continue; }
    const item = manifest.items.find(item => item.id === id && item.slot === slot);
    if (!item || item.template !== manifest.template || item.pose !== manifest.pose) throw new Error(`Incompatible item: ${slot}/${id}`);
    resolved[slot] = item;
  }
  return resolved;
}

export function fixedPlan(manifest, selected = {}, {showEyes = true, showHair = true} = {}) {
  const items = resolveFixedSelection(manifest, selected);
  if(showHair&&items.hat&&items.hair&&!items.hair.hatFile)throw new Error(`Missing hat-compatible hairstyle: ${items.hair.id}`);
  const layers = [{slot: 'clothing', file: items.clothing.file}, {slot: 'head_template', file: manifest.head.file}];
  if (showEyes) layers.push({slot: 'eye_set', file: items.eye_set.file});
  if (items.face_set) layers.push({slot: 'face_set', file: items.face_set.file});
  if (showHair && items.hair) layers.push({slot: 'hair', file: items.hat ? items.hair.hatFile : items.hair.file});
  if (items.hat) layers.push({slot: 'hat', file: items.hat.file});
  return {
    width: manifest.width, height: manifest.height,
    layers: layers.map(layer => ({...layer, url: `/fixed-assets/${layer.file}`, x: 0, y: 0,
      source: {x: 0, y: 0, width: manifest.width, height: manifest.height}}))
  };
}

export class FixedTemplateSelection {
  constructor(manifest) {
    this.manifest = manifest;
    this.selected = Object.fromEntries(fixedSlots.map(slot => [slot, null]));
    this.showEyes = true;
    this.showHair = true;
  }
  equip(slot, id) {
    if (!fixedSlots.includes(slot)) throw new Error(`Unsupported category: ${slot}`);
    const next = {...this.selected, [slot]: id};
    resolveFixedSelection(this.manifest, next);
    this.selected = next;
  }
  reset() {
    this.selected = Object.fromEntries(fixedSlots.map(slot => [slot, null]));
    this.showEyes = this.showHair = true;
  }
  plan() { return fixedPlan(this.manifest, this.selected, this); }
}

import {prepareRegisteredFrame, drawPreparedFrame} from './compositor.mjs';
import {FixedTemplateSelection, fixedPlan, resolveFixedSelection} from './fixed-template-model.mjs';

const status = document.querySelector('#fixed-status');
try {
  const response = await fetch('/api/fixed-template');
  if (!response.ok) throw new Error('อ่านข้อมูลแม่แบบไม่สำเร็จ');
  const manifest = await response.json();
  const selection = new FixedTemplateSelection(manifest), images = new Map();
  const files = [manifest.head.file, ...manifest.items.map(item => item.file)];
  await Promise.all(files.map(file => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth !== manifest.width || image.naturalHeight !== manifest.height) return reject(new Error(`ขนาดชิ้นส่วนไม่ตรงแม่แบบ: ${file}`));
      images.set(`/fixed-assets/${file}`, image); resolve();
    };
    image.onerror = () => reject(new Error(`โหลดชิ้นส่วนไม่สำเร็จ: ${file}`));
    image.src = `/fixed-assets/${file}`;
  })));
  const load = url => images.get(url);
  const compiled = document.createElement('canvas');
  const character = document.querySelector('#fixed-character'), head = document.querySelector('#fixed-head');
  const eyeSelect = document.querySelector('#fixed-eyes'), faceSelect = document.querySelector('#fixed-face'), clothingSelect = document.querySelector('#fixed-clothing');
  const showHair = document.querySelector('#fixed-show-hair'), showEyes = document.querySelector('#fixed-show-eyes'), guides = document.querySelector('#fixed-guides');
  for (const [select, slot, defaultLabel] of [[eyeSelect, 'eye_set', 'ค่าเริ่มต้น · ตาอำพัน'], [faceSelect, 'face_set', 'ไม่มีชุดใบหน้า'], [clothingSelect, 'clothing', 'ค่าเริ่มต้น · ชุดนักเดินทาง']]) {
    select.add(new Option(defaultLabel, ''));
    for (const item of manifest.items.filter(item => item.slot === slot)) select.add(new Option(item.label, item.id));
    select.addEventListener('change', () => { selection.equip(slot, select.value || null); render(); });
  }
  const clothingCards = [];
  for (const item of manifest.items.filter(item => item.slot === 'clothing')) {
    const card = document.createElement('button'); card.type = 'button'; card.className = 'card'; card.setAttribute('aria-label', item.label);
    const image = document.createElement('canvas'); image.width = 248; image.height = 490;
    const title = document.createElement('span'); title.textContent = item.label;
    card.append(image, title);
    card.addEventListener('click', () => { selection.equip('clothing', item.id); clothingSelect.value = item.id; render(); });
    document.querySelector('#fixed-clothing-gallery').append(card);
    clothingCards.push({card, image, item});
  }
  function view(target, source, rect) {
    const ctx = target.getContext('2d');
    ctx.clearRect(0, 0, target.width, target.height);
    ctx.drawImage(source, ...rect, 0, 0, target.width, target.height);
  }
  function drawGuides(target, rect) {
    const ctx = target.getContext('2d'); ctx.save(); ctx.strokeStyle = '#246dba'; ctx.lineWidth = 1;
    for (const [name, point] of Object.entries(manifest.anchors)) {
      const x = (point[0] - rect[0]) * target.width / rect[2], y = (point[1] - rect[1]) * target.height / rect[3];
      ctx.beginPath(); ctx.moveTo(x - 7, y); ctx.lineTo(x + 7, y); ctx.moveTo(x, y - 7); ctx.lineTo(x, y + 7); ctx.stroke();
      if (name === 'neck') { ctx.font = '12px Tahoma'; ctx.fillStyle = '#246dba'; ctx.fillText('คอ', x + 9, y - 6); }
    }
    ctx.restore();
  }
  const cards = [];
  for (const eye of manifest.items.filter(item => item.slot === 'eye_set')) for (const faceID of [null, ...manifest.items.filter(item => item.slot === 'face_set').map(item => item.id)]) {
    const selected = {eye_set: eye.id, face_set: faceID};
    const prepared = await prepareRegisteredFrame(fixedPlan(manifest, selected, {showHair: false}), load);
    const source = document.createElement('canvas'); drawPreparedFrame(source, prepared);
    const card = document.createElement('button'); card.type = 'button'; card.className = 'card'; card.setAttribute('aria-pressed', 'false');
    const image = document.createElement('canvas'); image.width = 450; image.height = 380; view(image, source, manifest.views.catalogHead);
    const title = document.createElement('span'); title.textContent = `${eye.label} / ${faceID ? manifest.items.find(item => item.id === faceID).label : 'ใบหน้าเดิม'}`;
    card.append(image, title); card.setAttribute('aria-label', title.textContent);
    card.addEventListener('click', () => { selection.equip('eye_set', eye.id); selection.equip('face_set', faceID); eyeSelect.value = eye.id; faceSelect.value = faceID || ''; render(); });
    document.querySelector('#fixed-matrix').append(card); cards.push({card, eyeID: eye.id, faceID});
  }
  // No network/asset load is triggered by a later swap, so rapid choices cannot race.
  function render() {
    const plan = selection.plan();
    drawPreparedFrame(compiled, {plan, images: plan.layers.map(layer => load(layer.url))});
    view(character, compiled, manifest.views.character); view(head, compiled, manifest.views.head);
    if (guides.checked) { drawGuides(character, manifest.views.character); drawGuides(head, manifest.views.head); }
    const resolved = resolveFixedSelection(manifest, selection.selected);
    status.textContent = `${resolved.clothing.label} · ${selection.showEyes ? resolved.eye_set.label : 'ซ่อนชุดดวงตา · เก็บชุดที่เลือกไว้'} · ${resolved.face_set?.label || 'ใบหน้าเดิม'} · ${selection.showHair ? 'ใส่ผมเดิม' : 'ถอดผม'}`;
    character.dataset.selected = JSON.stringify(selection.selected);
    character.dataset.template = manifest.template;
    character.dataset.origin = JSON.stringify(manifest.origin);
    character.dataset.showHair = String(selection.showHair); character.dataset.showEyes = String(selection.showEyes);
    for (const card of cards) card.card.setAttribute('aria-pressed', String(card.eyeID === resolved.eye_set.id && card.faceID === (resolved.face_set?.id || null)));
    for (const card of clothingCards) {
      const plan = fixedPlan(manifest, {...selection.selected, clothing: card.item.id}, selection);
      drawPreparedFrame(compiled, {plan, images: plan.layers.map(layer => load(layer.url))});
      view(card.image, compiled, manifest.views.character);
      card.card.setAttribute('aria-pressed', String(card.item.id === resolved.clothing.id));
    }
  }
  showHair.addEventListener('change', () => { selection.showHair = showHair.checked; render(); });
  showEyes.addEventListener('change', () => { selection.showEyes = showEyes.checked; render(); });
  guides.addEventListener('change', render);
  document.querySelector('#fixed-reset').addEventListener('click', () => { selection.reset(); eyeSelect.value = faceSelect.value = clothingSelect.value = ''; showEyes.checked = showHair.checked = true; render(); });
  render();
  const titles = {head_template: 'โครงหัวเดิม', eye_set: 'ชุดดวงตา', face_set: 'ชุดใบหน้า', hair: 'ผมเดิม', clothing: 'ชุดเดิม'};
  for (const layer of [{slot: 'head_template', file: manifest.head.file, label: ''}, ...manifest.items]) {
    const figure = document.createElement('figure'), image = document.createElement('canvas');
    const rect = layer.slot === 'clothing' ? manifest.views.character : layer.slot === 'hair' ? manifest.views.head : manifest.views.catalogHead;
    image.width = rect[2]; image.height = rect[3]; view(image, images.get(`/fixed-assets/${layer.file}`), rect);
    const title = document.createElement('figcaption'); title.textContent = layer.label || titles[layer.slot];
    figure.append(image, title); document.querySelector('#fixed-layers').append(figure);
  }
} catch (error) {
  status.textContent = error.message; status.classList.add('errors');
}

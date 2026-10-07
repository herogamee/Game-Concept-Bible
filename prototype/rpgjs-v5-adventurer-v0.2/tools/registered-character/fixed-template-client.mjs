import {prepareRegisteredFrame, drawPreparedFrame} from './compositor.mjs';
import {FixedTemplateSelection, fixedPlan, resolveFixedSelection} from './fixed-template-model.mjs';
import {mountFrontMotion} from './front-motion-client.mjs';

const status = document.querySelector('#fixed-status');
try {
  const response = await fetch('/api/fixed-template');
  if (!response.ok) throw new Error('อ่านข้อมูลแม่แบบไม่สำเร็จ');
  const manifest = await response.json();
  const selection = new FixedTemplateSelection(manifest), images = new Map();
  const files = [...new Set([manifest.head.file, ...manifest.items.flatMap(item => [item.file,item.hatFile].filter(Boolean))])];
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
  const hairSelect=document.querySelector('#fixed-hair'),hatSelect=document.querySelector('#fixed-hat');
  const showHair = document.querySelector('#fixed-show-hair'), showEyes = document.querySelector('#fixed-show-eyes'), guides = document.querySelector('#fixed-guides');
  for (const [select, slot, defaultLabel] of [[eyeSelect, 'eye_set', 'ค่าเริ่มต้น · ตาอำพัน'], [faceSelect, 'face_set', 'ไม่มีชุดใบหน้า'], [clothingSelect, 'clothing', 'ค่าเริ่มต้น · ชุดนักเดินทาง'],[hairSelect,'hair','ค่าเริ่มต้น · ผมน้ำตาล'],[hatSelect,'hat','ไม่ใส่หมวก']]) {
    select.add(new Option(defaultLabel, ''));
    for (const item of manifest.items.filter(item => item.slot === slot)) select.add(new Option(item.label, item.id));
    select.addEventListener('change', () => { selection.equip(slot, select.value || null); render(); });
  }
  const clothingCards = [];
  const headwearCards=[];
  for(const hat of [null,...manifest.items.filter(i=>i.slot==='hat')])for(const hair of manifest.items.filter(i=>i.slot==='hair')){
    const card=document.createElement('button');card.type='button';card.className='card';
    const image=document.createElement('canvas');image.width=310;image.height=270;
    const title=document.createElement('span'),size=manifest.hairLayout.measurements[hair.id];title.textContent=`${hair.label} · ${hat?'ใส่หมวก':`${size.width}×${size.height} px`}`;
    card.setAttribute('aria-label',title.textContent);card.append(image,title);
    card.addEventListener('click',()=>{selection.equip('hair',hair.id);selection.equip('hat',hat?.id||null);selection.showHair=true;showHair.checked=true;hairSelect.value=hair.id;hatSelect.value=hat?.id||'';render();});
    document.querySelector('#fixed-headwear-gallery').append(card);headwearCards.push({card,image,hair,hat});
  }
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
    const layout = manifest.hairLayout;
    const map = (x,y) => [(x-rect[0])*target.width/rect[2],(y-rect[1])*target.height/rect[3]];
    const line = (x1,y1,x2,y2) => {ctx.beginPath();ctx.moveTo(...map(x1,y1));ctx.lineTo(...map(x2,y2));ctx.stroke();};
    ctx.setLineDash([5,4]);
    line(320,layout.scalpTopY,940,layout.scalpTopY);
    line(layout.headAxisX,15,layout.headAxisX,543);
    ctx.strokeStyle='#b5722c';
    for(const clearance of layout.envelope.aboveScalp)line(340,layout.scalpTopY-clearance,920,layout.scalpTopY-clearance);
    ctx.setLineDash([]);ctx.strokeStyle='#246dba';
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
    const hairSize=manifest.hairLayout.measurements[resolved.hair.id];
    document.querySelector('#fixed-hair-size').textContent=`${resolved.hair.label}: ${hairSize.width} × ${hairSize.height} px · ยอดผมเหนือกระหม่อม ${hairSize.aboveScalp} px · หัวและจุดวางเดิม`;
    status.textContent = `${resolved.clothing.label} · ${selection.showEyes ? resolved.eye_set.label : 'ซ่อนชุดดวงตา'} · ${resolved.face_set?.label || 'ใบหน้าเดิม'} · ${selection.showHair ? resolved.hair.label : 'ถอดผม'} · ${resolved.hat?.label||'ไม่ใส่หมวก'}`;
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
    for(const card of headwearCards){
      const plan=fixedPlan(manifest,{...selection.selected,hair:card.hair.id,hat:card.hat?.id||null},{...selection,showHair:true});
      drawPreparedFrame(compiled,{plan,images:plan.layers.map(l=>load(l.url))});view(card.image,compiled,manifest.views.head);
      card.card.setAttribute('aria-pressed',String(selection.showHair&&card.hair.id===resolved.hair.id&&(card.hat?.id||null)===(resolved.hat?.id||null)));
    }
  }
  showHair.addEventListener('change', () => { selection.showHair = showHair.checked; render(); });
  showEyes.addEventListener('change', () => { selection.showEyes = showEyes.checked; render(); });
  guides.addEventListener('change', render);
  document.querySelector('#fixed-reset').addEventListener('click', () => { selection.reset(); eyeSelect.value = faceSelect.value = clothingSelect.value = hairSelect.value = hatSelect.value = ''; showEyes.checked = showHair.checked = true; render(); });
  render();
  const titles = {head_template: 'โครงหัวเดิม', eye_set: 'ชุดดวงตา', face_set: 'ชุดใบหน้า', hair: 'ผมเดิม', clothing: 'ชุดเดิม'};
  for (const layer of [{slot: 'head_template', file: manifest.head.file, label: ''}, ...manifest.items]) {
    const figure = document.createElement('figure'), image = document.createElement('canvas');
    const rect = layer.slot === 'clothing' ? manifest.views.character : ['hair','hat'].includes(layer.slot) ? manifest.views.head : manifest.views.catalogHead;
    image.width = rect[2]; image.height = rect[3]; view(image, images.get(`/fixed-assets/${layer.file}`), rect);
    const title = document.createElement('figcaption'); title.textContent = layer.label || titles[layer.slot];
    figure.append(image, title); document.querySelector('#fixed-layers').append(figure);
  }
  await mountFrontMotion(manifest,selection);
} catch (error) {
  status.textContent = error.message; status.classList.add('errors');
}

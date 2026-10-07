import {showPlan,showSlots} from './format.mjs';
import {drawPreparedFrame} from '/compositor.mjs';
import {masterMatrix} from './registration.mjs';
const status=document.querySelector('#compat-status');
try {
  const [profile,catalog]=await Promise.all(['/api/ddt40-profile','/api/ddt40-catalog'].map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error('อ่านข้อมูลไม่ได้');return r.json()}));
  const names={face:'หัวและชุดดวงตา',hair:'ทรงผม',cloth:'ร่างกายและเสื้อผ้า',eff:'รายละเอียดใบหน้า',head:'หมวก',glass:'แว่น',arm:'อาวุธ'};
  const state={sex:'m',base:'ours',selected:{},hidden:[]},images=new Map(),controls=new Map();let revision=0;
  const base=document.querySelector('#compat-base'),sex=document.querySelector('#compat-sex'),guides=document.querySelector('#compat-guides'),hide=document.querySelector('#compat-hide-head');
  const main=document.querySelector('#compat-character'),ref=document.querySelector('#compat-reference');
  const masterPreview=document.querySelector('#compat-master'),clothPreview=document.querySelector('#compat-cloth-only');
  const facePreview=document.querySelector('#compat-face-only'),faceSourceLink=document.querySelector('#compat-face-source-link');
  const hairPreview=document.querySelector('#compat-hair-only'),hairSource=document.querySelector('#compat-hair-source'),hairSourceLink=document.querySelector('#compat-hair-source-link');
  for(const slot of showSlots) {
    const label=document.createElement('label');label.textContent=names[slot];const select=document.createElement('select');select.id=`compat-${slot}`;label.append(select);document.querySelector('#compat-selectors').append(label);controls.set(slot,select);
    select.addEventListener('change',()=>{const before={...state.selected};state.selected[slot]=select.value||null;try{showPlan(profile,catalog,state);render()}catch(e){state.selected=before;select.value=before[slot]||'';status.textContent=e.message;status.className='error'}});
  }
  function options() {
    for(const [slot,select] of controls) {
      select.replaceChildren(new Option('ใช้ค่าเริ่มต้น',''));
      for(const source of ['ours','reference']) {
        const group=document.createElement('optgroup');group.label=source==='ours'?'เกมเรา':'DDTank 4.0';
        for(const item of catalog.items.filter(i=>i.slot===slot&&i.source===source&&[state.sex,'any'].includes(i.sex)))group.append(new Option(`${item.name} · ${item.templateId}`,item.id));
        if(group.children.length)select.append(group);
      }
      select.value=state.selected[slot]||'';
    }
  }
  async function image(url) {
    if(!images.has(url))images.set(url,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('โหลดภาพไม่ได้: '+url));im.src=url}));
    return images.get(url);
  }
  async function paint(target,plan) {
    const loaded=await Promise.all(plan.layers.map(l=>image(l.url)));
    for(let i=0;i<loaded.length;i++){const r=plan.layers[i].source;if(r.x+r.width>loaded[i].naturalWidth||r.y+r.height>loaded[i].naturalHeight)throw new Error('กรอบเฟรมเกินภาพต้นฉบับ')}
    drawPreparedFrame(target,{plan,images:loaded});
    if(guides.checked){const c=target.getContext('2d');c.strokeStyle='#3b7551';c.lineWidth=.6;for(let x=0;x<250;x+=25){c.beginPath();c.moveTo(x,0);c.lineTo(x,342);c.stroke()}for(let y=0;y<342;y+=25){c.beginPath();c.moveTo(0,y);c.lineTo(250,y);c.stroke()}c.strokeRect(.5,.5,249,341);c.fillStyle='#2d6043';c.font='10px sans-serif';c.fillText('(0,0)',4,13)}
  }
  const masterCtx=masterPreview.getContext('2d');masterCtx.imageSmoothingQuality='high';masterCtx.setTransform(...masterMatrix(catalog.calibration));masterCtx.drawImage(await image('/ddt40/master.png'),0,0);
  document.querySelector('#compat-scale').textContent=`ย่อทุกชิ้นเท่ากัน ${(catalog.calibration.matrix[0]*100).toFixed(2)}% · รักษาสัดส่วนเดิม`;
  function pathRows(plan) {
    const tbody=document.querySelector('#compat-paths');tbody.replaceChildren();
    for(const l of plan.layers){const item=catalog.items.find(i=>i.id===l.id),a=item.slot==='hair'?item.assets[plan.hairVariant]:item.assets.main;
      const tr=document.createElement('tr');for(const value of [names[l.slot],item.source==='ours'?'เกมเรา':'DDTank',`${a.width} × ${a.height}`,l.path,'(0,0)']){const td=document.createElement('td');if(value===l.path){const c=document.createElement('code');c.textContent=value;td.append(c)}else td.textContent=value;tr.append(td)}tbody.append(tr)}
  }
  const cards=[];
  for(const item of catalog.items.filter(i=>i.source==='ours'&&i.slot==='hair')) {
    const card=document.createElement('button');card.className='card';card.type='button';card.setAttribute('aria-label',item.name);const canvas=document.createElement('canvas');canvas.width=250;canvas.height=342;
    const label=document.createElement('span');label.textContent=item.name+' · 250 × 312';card.append(canvas,label);document.querySelector('#compat-hair-gallery').append(card);cards.push({item,card,canvas});
    card.addEventListener('click',()=>{if(state.sex!=='m')state.selected={};state.base='ours';state.sex='m';base.value='ours';sex.value='m';state.selected.hair=item.id;options();render()});
  }
  async function render() {
    const tick=++revision;status.className='';status.textContent='กำลังโหลดชิ้นส่วน';
    try{
      const plan=showPlan(profile,catalog,state),reference=showPlan(profile,catalog,{sex:state.sex,base:'reference',hidden:['arm']});
      const staging=document.createElement('canvas'),referenceStaging=document.createElement('canvas');await Promise.all([paint(staging,plan),paint(referenceStaging,reference)]);
      if(tick!==revision)return;
      main.getContext('2d').clearRect(0,0,250,342);main.getContext('2d').drawImage(staging,0,0);
      ref.getContext('2d').clearRect(0,0,250,342);ref.getContext('2d').drawImage(referenceStaging,0,0);
      const ui=document.querySelector('#compat-ui');ui.getContext('2d').clearRect(0,0,120,165);ui.getContext('2d').drawImage(staging,0,0,120,165);
      const clothStaging=document.createElement('canvas');await paint(clothStaging,{...plan,layers:plan.layers.filter(l=>l.slot==='cloth')});if(tick!==revision)return;
      clothPreview.getContext('2d').clearRect(0,0,250,342);clothPreview.getContext('2d').drawImage(clothStaging,0,0);
      const faceStaging=document.createElement('canvas');await paint(faceStaging,{...plan,layers:plan.layers.filter(l=>l.slot==='face'||l.slot==='eff')});if(tick!==revision)return;
      facePreview.getContext('2d').clearRect(0,0,250,342);facePreview.getContext('2d').drawImage(faceStaging,0,0);
      const faceLayer=plan.layers.find(l=>l.slot==='face');faceSourceLink.hidden=!faceLayer;if(faceLayer)faceSourceLink.href=faceLayer.url;
      const hairStaging=document.createElement('canvas');await paint(hairStaging,{...plan,layers:plan.layers.filter(l=>l.slot==='hair')});if(tick!==revision)return;
      hairPreview.getContext('2d').clearRect(0,0,250,342);hairPreview.getContext('2d').drawImage(hairStaging,0,0);
      const ownHairNames={'ours-310900001':'hair-chestnut','ours-310900004':'hair-paired-teal'},nativeHair=ownHairNames[plan.equipment.hair];
      hairSource.hidden=hairSourceLink.hidden=!nativeHair;
      if(nativeHair){hairSource.src=hairSourceLink.href=`/ddt40/native/${nativeHair}.png`;hairSource.alt='ไฟล์เฉพาะทรงผม '+nativeHair+' · 1254 × 1254';}
      pathRows(plan);main.dataset.profile=profile.id;main.dataset.origin='0,0';main.dataset.view=catalog.view;main.dataset.equipment=JSON.stringify(plan.equipment);main.dataset.hairVariant=plan.hairVariant;
      main.dataset.drawOrder=plan.layers.map(l=>l.slot).join(',');main.dataset.exportScale=String(catalog.calibration.matrix[0]);
      document.querySelector('#compat-look').textContent=`${state.base==='ours'?'เกมเรา · มุม 3/4':'DDTank'} · ผม ${plan.hairVariant} · 250 × 342`;
      status.textContent='ประกอบสำเร็จ · ทุก PNG วางที่ (0,0) · ไม่มีการปรับสเกลรายชิ้นขณะเล่น';
      for(const card of cards){if(tick!==revision)return;const p=showPlan(profile,catalog,{sex:'m',base:'ours',selected:{...(state.sex==='m'?state.selected:{}),hair:card.item.id},hidden:state.hidden});const cardStaging=document.createElement('canvas');await paint(cardStaging,p);if(tick!==revision)return;card.canvas.getContext('2d').clearRect(0,0,250,342);card.canvas.getContext('2d').drawImage(cardStaging,0,0);card.card.setAttribute('aria-pressed',String(plan.equipment.hair===card.item.id))}
    }catch(e){if(tick===revision){status.textContent=e.message;status.className='error'}}
  }
  function reset(){state.selected={};state.hidden=[];hide.checked=false;options();render()}
  base.addEventListener('change',()=>{state.base=base.value;if(state.base==='ours'){state.sex='m';sex.value='m'}reset()});
  sex.addEventListener('change',()=>{state.sex=sex.value;if(state.sex==='f'){state.base='reference';base.value='reference'}reset()});
  hide.addEventListener('change',()=>{state.hidden=hide.checked?['head']:[];render()});guides.addEventListener('change',render);
  document.querySelector('#compat-reset').addEventListener('click',reset);options();await render();
}catch(e){status.textContent=e.message;status.className='error'}

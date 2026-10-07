import {appearanceCatalog,parseAppearance,resolvedWardrobe,type Appearance,type AppearanceSlot} from './appearance';
import {drawRig,type PartManifest,type RigDirection,type RigAction} from './modular-rig';
type Assets={manifest:PartManifest;images:Record<string,HTMLImageElement>};
let assets:Promise<Assets>|undefined;
function loadAssets(){
  return assets??=fetch(`${import.meta.env.BASE_URL}modular/manifest.json`).then(async response=>{
    if(!response.ok)throw new Error('โหลดข้อมูลชิ้นส่วนไม่ได้');
    const manifest=await response.json() as PartManifest,images:Record<string,HTMLImageElement>={};
    await Promise.all([...new Set(Object.values(manifest).map(part=>part.file))].map(async file=>{
      const img=new Image();img.src=`${import.meta.env.BASE_URL}modular/parts/${file}`;await img.decode();images[file]=img;
    }));return {manifest,images};
  });
}
const slotLabels:Partial<Record<AppearanceSlot,string>>={body:'ตัวละคร',hair:'ผม',shirt:'เสื้อ',hat:'หมวก',weapon:'อาวุธ'};
const defaultLabels:Partial<Record<AppearanceSlot,string>>={hair:'ผมเริ่มต้น · สีน้ำตาล',shirt:'เสื้อเริ่มต้น · นักเดินทาง',hat:'ไม่ใส่หมวก',weapon:'ไม่แสดงอาวุธ'};
export function setupWardrobe(send:(name:string,data?:unknown)=>void){
  const root=document.getElementById('wardrobe-options')!,canvas=document.getElementById('wardrobe-portrait') as HTMLCanvasElement;
  const hud=document.getElementById('hud-portrait') as HTMLCanvasElement;
  const ctx=canvas.getContext('2d')!,hudCtx=hud.getContext('2d')!;
  let appearance:Appearance|undefined,loaded:Assets|undefined,key='',facing:RigDirection='south',action:RigAction='idle',active=false,poseKey='';
  const selects=new Map<AppearanceSlot,HTMLSelectElement>();
  const cards=new Map<string,HTMLButtonElement>();
  for(const slot of ['body','hair','shirt','hat','weapon'] as AppearanceSlot[]){
    const label=document.createElement('label');label.textContent=slotLabels[slot]!;
    const select=document.createElement('select');select.className='rpg-ui-select';select.setAttribute('aria-label',`เลือก${slotLabels[slot]}`);
    if(slot!=='body'){const option=new Option(defaultLabels[slot]!, '');select.add(option);}
    for(const item of appearanceCatalog.filter(item=>item.slot===slot))select.add(new Option(item.label??item.id,item.id));
    select.addEventListener('change',()=>send('equip',{slot,id:select.value||null}));
    label.append(select);root.append(label);selects.set(slot,select);
  }
  document.getElementById('wardrobe-facing')!.addEventListener('change',event=>{facing=(event.target as HTMLSelectElement).value as RigDirection;draw();});
  document.getElementById('wardrobe-motion')!.addEventListener('change',event=>{action=(event.target as HTMLSelectElement).value as RigAction;draw();});
  document.getElementById('wardrobe-reset')!.addEventListener('click',()=>send('equip',{slot:'body',id:'chibi-base'}));
  const oldImage=new Image();oldImage.src=`${import.meta.env.BASE_URL}willowbrook/hd/chibi-hero-v2.png`;oldImage.onload=()=>draw();
  function draw(){
    if(!appearance)return;
    ctx.clearRect(0,0,canvas.width,canvas.height);hudCtx.clearRect(0,0,hud.width,hud.height);
    if(appearance.slots.body==='chibi-base'){
      if(!loaded)return;
      const w=resolvedWardrobe(appearance),frame=action==='idle'?0:Math.floor(performance.now()/(action==='walk'?100:50))%8;
      poseKey=`${facing}-${action}-${frame}`;
      drawRig(ctx,loaded.images,loaded.manifest,w,facing,action,frame,canvas.width/64);
      drawRig(hudCtx,loaded.images,loaded.manifest,w,'south','idle',0,hud.width/64);
    }else if(oldImage.complete&&oldImage.naturalWidth){
      ctx.drawImage(oldImage,0,0,192,192,0,0,canvas.width,canvas.height);
      hudCtx.drawImage(oldImage,0,0,192,192,0,0,hud.width,hud.height);
    }
  }
  const ready=loadAssets().then(value=>{
    loaded=value;
    const thumbnails:Record<string,string>={'hair-chestnut':'hair-chestnut.south','hair-silver':'hair-silver.south','shirt-traveler':'shirt-traveler.torso.south','shirt-blue':'shirt-blue.torso.south','feather-cap':'hat.south','short-sword':'sword'};
    const gallery=document.getElementById('wardrobe-gallery')!;
    for(const [id,part] of Object.entries(thumbnails)){
      const item=appearanceCatalog.find(item=>item.id===id)!,button=document.createElement('button'),icon=document.createElement('canvas');
      icon.width=120;icon.height=96;icon.setAttribute('aria-hidden','true');button.className='wardrobe-item rpg-ui-button';button.setAttribute('aria-label',`สวม${item.label}`);
      const source=value.manifest[part],r=source.rect,scale=Math.min(104/r.width,80/r.height),width=r.width*scale,height=r.height*scale;
      icon.getContext('2d')!.drawImage(value.images[source.file],r.x,r.y,r.width,r.height,(120-width)/2,(96-height)/2,width,height);
      const caption=document.createElement('span');caption.textContent=item.label!;button.append(icon,caption);
      button.addEventListener('click',()=>send('equip',{slot:item.slot,id:item.id}));gallery.append(button);cards.set(id,button);
    }draw();
  }).catch(error=>{document.getElementById('wardrobe-status')!.textContent=error.message;});
  void ready;
  return (value:unknown,isOpen:boolean)=>{
    active=isOpen;
    const next=parseAppearance(value),nextKey=JSON.stringify(next);
    if(nextKey!==key){
      key=nextKey;appearance=next;
      document.getElementById('wardrobe-status')!.textContent=next.slots.body==='chibi-base'?'ตัวทดลองนี้ไม่ผ่านรีวิวภาพ · อยู่ระหว่างแก้วิธีประกอบ':'ตัวละครเดิม · ตัวทดลองข้อต่อยังไม่ผ่านรีวิวภาพ';
      draw();
    }else if(active&&action!=='idle'&&poseKey!==`${facing}-${action}-${Math.floor(performance.now()/(action==='walk'?100:50))%8}`)draw();
    for(const [slot,select] of selects){select.value=next.slots[slot]??'';select.disabled=slot!=='body'&&next.slots.body!=='chibi-base';}
    for(const [id,card] of cards){const item=appearanceCatalog.find(item=>item.id===id)!;card.disabled=next.slots.body!=='chibi-base';card.setAttribute('aria-pressed',String(next.slots[item.slot]===id));}
  };
}

const $=id=>document.getElementById(id);
async function load(src){const im=new Image();im.src=src;await im.decode();return im}
try{
const [guide,hero,meta]=await Promise.all([load('pose-guide.png'),load('walk-generated-v1.png'),fetch('manifest.json').then(r=>{if(!r.ok)throw Error('manifest missing');return r.json()})]);
let frame=0,playing=true,clock=0,last=performance.now();
const canvases=[];
for(let i=0;i<8;i++){const b=document.createElement('button');b.className='card';b.setAttribute('aria-label','ดูเฟรม '+(i+1));const cv=document.createElement('canvas');cv.width=200;cv.height=250;b.append(cv,document.createTextNode('เฟรม '+(i+1)));$('gallery').append(b);canvases.push(cv);b.onclick=()=>{frame=i;playing=false;clock=0;render()}}
function draw(canvas,image,f){const ctx=canvas.getContext('2d');const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#e2e9d8';ctx.fillRect(0,0,w,h);const cw=image.width/4,ch=image.height/2,scale=Math.min(w*.84/cw,h*.97/ch);const x=(w-cw*scale)/2,y=(h-ch*scale)/2;ctx.drawImage(image,(f%4)*cw,Math.floor(f/4)*ch,cw,ch,x,y,cw*scale,ch*scale)}
function render(){draw($('guide'),guide,frame);draw($('hero'),hero,frame);canvases.forEach((cv,i)=>{draw(cv,hero,i);cv.parentElement.classList.toggle('active',i===frame)});$('play').textContent=playing?'หยุดภาพ':'เล่นภาพ';$('status').textContent=`เฟรม ${frame+1}/8 · ${playing?'กำลังเล่น':'หยุดดู'} · ${hero.width} × ${hero.height} · ไม่ปรับขนาดหรือตำแหน่งแต่ละเฟรม`;document.body.dataset.frame=frame;document.body.dataset.playing=playing}
$('play').onclick=()=>{playing=!playing;clock=0;render()};$('step').onclick=()=>{playing=false;clock=0;frame=(frame+1)%8;render()};
function tick(now){const dt=Math.min((now-last)/1000,.1);last=now;if(playing){const speed=Number($('speed').value);clock+=dt*speed;while(clock>=meta.cycle_seconds/8){clock-=meta.cycle_seconds/8;frame=(frame+1)%8}render()}requestAnimationFrame(tick)}
render();requestAnimationFrame(tick);
}catch(e){$('error').textContent='เปิดภาพทดลองไม่ได้: '+e.message;console.error(e)}

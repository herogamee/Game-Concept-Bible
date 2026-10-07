/* Original small Web Audio score and effects. No downloads or external music assets. */
const GameAudio = (() => {
  const KEY='willowbrook-audio-v1';
  let enabled=true,volume=.35,context=null,musicBus=null,effectBus=null;
  let timer=null,nextBeat=0,beat=0,scene='v',noiseBuffer=null;
  try {const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved){enabled=saved.enabled!==false;volume=Math.max(0,Math.min(1,Number(saved.volume)||0))}}catch{}
  const scores={
    v:{step:.46,roots:[50,55,57,54,50,55,57,50],
      melody:[74,78,81,78,76,74,71,null,73,76,81,79,78,76,74,null,74,78,81,86,83,81,79,78,76,73,69,73,74,78,74,null]},
    f:{step:.37,roots:[52,48,55,50,52,48,50,52],
      melody:[76,null,79,83,81,79,76,74,72,76,79,76,74,78,81,null,76,79,83,86,84,83,81,79,78,74,78,81,79,78,76,null]}
  };
  const hz=midi=>440*2**((midi-69)/12);
  function remember(){try{localStorage.setItem(KEY,JSON.stringify({enabled,volume}))}catch{}}
  function updateUI(){
    const button=document.getElementById('sound-toggle');
    if(button){button.textContent=!enabled?'เสียง: ปิด':context&&context.state==='running'?'เสียง: เปิด':'เปิดเสียง';button.setAttribute('aria-pressed',String(enabled))}
    const slider=document.getElementById('sound-volume');if(slider)slider.value=Math.round(volume*100);
  }
  function mix(){
    if(!context)return;
    const audible=enabled&&!document.hidden;
    musicBus.gain.setTargetAtTime(audible?volume*.22:0,context.currentTime,.025);
    effectBus.gain.setTargetAtTime(audible?volume*.6:0,context.currentTime,.025);
  }
  function tone(midi,time,duration,loudness,wave='triangle',bus=musicBus){
    const osc=context.createOscillator(),env=context.createGain();
    osc.type=wave;osc.frequency.setValueAtTime(hz(midi),time);
    env.gain.setValueAtTime(0,time);env.gain.linearRampToValueAtTime(loudness,time+.015);
    env.gain.exponentialRampToValueAtTime(.001,time+duration);
    osc.connect(env);env.connect(bus);osc.start(time);osc.stop(time+duration+.02);
    osc.onended=()=>{osc.disconnect();env.disconnect()};
  }
  function schedule(){
    if(!enabled||!context||context.state!=='running'||document.hidden)return;
    if(nextBeat<context.currentTime-.25)nextBeat=context.currentTime+.05;
    const score=scores[scene];
    while(nextBeat<context.currentTime+.18){
      const i=beat%32,root=score.roots[Math.floor(i/4)],note=score.melody[i];
      if(note!==null)tone(note,nextBeat,.7,.22);
      tone(root+12,nextBeat,.48,.10);tone(root+19,nextBeat+score.step/2,.5,.07);
      if(i%4===0){tone(root,nextBeat,score.step*3.8,.16,'sine');tone(root+7,nextBeat,score.step*3.5,.06,'sine')}
      beat++;nextBeat+=score.step;
    }
  }
  function startScheduler(){if(timer===null)timer=setInterval(schedule,100);schedule()}
  async function unlock(){
    if(!enabled||document.hidden)return;
    try{
      const AudioClass=typeof window!=='undefined'&&(window.AudioContext||window.webkitAudioContext);
      if(!AudioClass){return updateUI()}
      if(!context){
        context=new AudioClass();musicBus=context.createGain();effectBus=context.createGain();
        musicBus.gain.value=0;effectBus.gain.value=0;musicBus.connect(context.destination);effectBus.connect(context.destination);
        noiseBuffer=context.createBuffer(1,Math.ceil(context.sampleRate*.18),context.sampleRate);
        const samples=noiseBuffer.getChannelData(0);let seed=937;
        for(let i=0;i<samples.length;i++){seed=(seed*1664525+1013904223)>>>0;samples[i]=(seed/4294967296*2-1)*(1-i/samples.length)}
      }
      if(context.state!=='running'){await context.resume();nextBeat=context.currentTime+.05}
      mix();startScheduler();updateUI();
    }catch{const button=document.getElementById('sound-toggle');if(button)button.textContent='แตะเพื่อเปิดเสียงอีกครั้ง'}
  }
  function toggle(){
    // First activation opens sound; later activations toggle the stored preference.
    if(!context||context.state!=='running'){enabled=true;remember();void unlock();return}
    enabled=!enabled;remember();mix();if(enabled){nextBeat=context.currentTime+.05;schedule()}updateUI();
  }
  function setVolume(value){volume=Math.max(0,Math.min(1,Number(value)/100));remember();mix()}
  function playable(){return enabled&&context&&context.state==='running'&&!document.hidden}
  function burst(center,end,duration){
    const source=context.createBufferSource(),filter=context.createBiquadFilter(),env=context.createGain(),now=context.currentTime;
    source.buffer=noiseBuffer;filter.type='bandpass';filter.Q.value=.8;
    filter.frequency.setValueAtTime(center,now);filter.frequency.exponentialRampToValueAtTime(end,now+duration);
    env.gain.setValueAtTime(.001,now);env.gain.linearRampToValueAtTime(.45,now+.008);env.gain.exponentialRampToValueAtTime(.001,now+duration);
    source.connect(filter);filter.connect(env);env.connect(effectBus);source.start(now);source.stop(now+duration);
    source.onended=()=>{source.disconnect();filter.disconnect();env.disconnect()};
  }
  function slash(){if(!playable())return;burst(2600,650,.13);tone(91,context.currentTime,.055,.13,'sine',effectBus)}
  function hurt(){if(!playable())return;burst(450,90,.15);tone(43,context.currentTime,.2,.3,'triangle',effectBus)}
  function levelUp(){if(!playable())return;[74,78,81,86].forEach((note,i)=>tone(note,context.currentTime+i*.09,.4,.2,'sine',effectBus))}
  function setScene(value){const next=value==='f'?'f':'v';if(scene===next)return;scene=next;beat=0;if(context)nextBeat=context.currentTime+.06}
  if(typeof document.addEventListener==='function'){
    document.addEventListener('pointerdown',event=>{if(!event.target?.closest?.('.sound-controls'))void unlock()});
    document.addEventListener('keydown',event=>{if(!event.target?.closest?.('.sound-controls'))void unlock()});
    document.addEventListener('visibilitychange',()=>{
      mix();if(context){if(document.hidden)void context.suspend().catch(()=>{});else if(enabled)void unlock()}
    });
  }
  updateUI();
  return {unlock,toggle,setVolume,setScene,slash,hurt,levelUp};
})();

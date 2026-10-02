// Original procedural audio: no third-party recordings or asset licenses.
let context:AudioContext|undefined, enabled=false, gain:GainNode|undefined, timer:ReturnType<typeof setInterval>|undefined, note=0;
function tone(freq:number,duration:number,volume:number,type:OscillatorType='triangle'){
  if(!context||!gain||!enabled||document.hidden)return;
  const o=context.createOscillator(),g=context.createGain(),t=context.currentTime;
  o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);
  o.connect(g);g.connect(gain);o.start(t);o.stop(t+duration);
}
export function toggleAudio(){
  context??=new AudioContext();gain??=context.createGain();gain.connect(context.destination);gain.gain.value=.3;
  enabled=!enabled;if(enabled)void context.resume();else void context.suspend();
  if(!timer)timer=setInterval(()=>{const melody=[261.63,329.63,392,329.63,293.66,349.23,440,349.23];tone(melody[note++%melody.length],.8,.12);},500);
  return enabled;
}
export function sound(kind:string){if(kind==='slash'){tone(650,.09,.12,'sawtooth');tone(340,.13,.07);}else if(kind==='hurt'){tone(135,.22,.2,'square');}}
document.addEventListener('visibilitychange',()=>{if(context){if(document.hidden)void context.suspend();else if(enabled)void context.resume();}});

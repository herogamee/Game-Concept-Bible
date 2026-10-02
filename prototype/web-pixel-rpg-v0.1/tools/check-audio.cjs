const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'../src/audio.js'),'utf8');
const nodes=[],timers=[],listeners={},storage={},elements={};let instance;
const parameter=()=>({value:0,events:[],setValueAtTime(v,t){this.events.push([v,t])},linearRampToValueAtTime(v,t){this.events.push([v,t])},exponentialRampToValueAtTime(v,t){this.events.push([v,t])},setTargetAtTime(v,t){this.value=v;this.events.push([v,t])}});
function node(kind){const n={kind,gain:parameter(),frequency:parameter(),Q:{value:0},connect(){},disconnect(){},start(){},stop(){}};nodes.push(n);return n}
class Context{
 constructor(){instance=this;this.currentTime=0;this.state='suspended';this.sampleRate=8000;this.destination={}}
 createGain(){return node('gain')}
 createOscillator(){return node('oscillator')}
 createBufferSource(){return node('source')}
 createBiquadFilter(){return node('filter')}
 createBuffer(c,size){return {getChannelData:()=>new Float32Array(size)}}
 async resume(){this.state='running'}
 async suspend(){this.state='suspended'}
}
const sandbox={console,window:{AudioContext:Context},document:{hidden:false,getElementById:id=>elements[id]||(elements[id]={setAttribute(){}}),addEventListener:(type,fn)=>listeners[type]=fn},localStorage:{getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v},setInterval:fn=>{timers.push(fn);return timers.length}};
vm.createContext(sandbox);vm.runInContext(code,sandbox);const run=s=>vm.runInContext(s,sandbox);
(async()=>{
 await run('GameAudio.unlock()');assert.equal(instance.state,'running');assert.equal(timers.length,1);assert(nodes.filter(n=>n.kind==='oscillator').length>=5,'background arrangement');assert.equal(elements['sound-toggle'].textContent,'เสียง: เปิด');
 let before=nodes.length;run('GameAudio.slash();GameAudio.hurt();GameAudio.levelUp()');assert.equal(nodes.slice(before).filter(n=>n.kind==='source').length,2,'slash and hurt noise');assert.equal(nodes.slice(before).filter(n=>n.kind==='oscillator').length,6,'impact tones and level melody');
 run('GameAudio.toggle()');before=nodes.length;run('GameAudio.slash();GameAudio.hurt()');assert.equal(nodes.length,before,'muting suppresses effects');assert.equal(JSON.parse(storage['willowbrook-audio-v1']).enabled,false);
 run('GameAudio.toggle();GameAudio.setVolume(999)');assert.equal(JSON.parse(storage['willowbrook-audio-v1']).volume,1);
 before=nodes.length;instance.currentTime=1;run("GameAudio.setScene('f')");timers[0]();assert(nodes.slice(before).some(n=>n.kind==='oscillator'&&Math.abs(n.frequency.events[0][0]-659.255)<.01),'field score starts on E5');
 sandbox.document.hidden=true;listeners.visibilitychange();assert.equal(instance.state,'suspended');assert.equal(nodes.find(n=>n.kind==='gain').gain.value,0,'hidden music muted');sandbox.document.hidden=false;listeners.visibilitychange();await Promise.resolve();await Promise.resolve();assert.equal(instance.state,'running');assert.equal(timers.length,1,'only one music scheduler');
 const second={...sandbox,document:{hidden:false,getElementById:id=>({setAttribute(){}}),addEventListener:()=>{}},window:{AudioContext:Context},setInterval:()=>1};vm.createContext(second);vm.runInContext(code,second);assert.equal(vm.runInContext('GameAudio.setVolume(-3)',second),undefined);assert.equal(JSON.parse(storage['willowbrook-audio-v1']).volume,0);
 console.log('PASS music scheduling, scene score, slash/hurt/level sounds, mute, volume persistence, tab suspension and single scheduler');
})().catch(error=>{console.error(error);process.exitCode=1});

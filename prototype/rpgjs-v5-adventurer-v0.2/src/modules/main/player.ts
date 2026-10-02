import { type RpgPlayerHooks } from '@rpgjs/server';
import { playerSchema, content, resetTransient, action, keyboardInput, checkpoint, progressOf } from '../../game/runtime';
import { newProgress } from '../../game/rules';
export const player:RpgPlayerHooks={
  props:playerSchema,
  async onConnected(p){
    p.setHitbox(16,16);p.speed=160;p.name='นักผจญภัย '+p.id.slice(-4);p.setGraphic('adventurer');
    const loaded=await p.load(0,{reason:'load',source:'login'},{changeMap:true});
    if(!loaded.ok){p.initializeDefaultStats();p.adventure.set(JSON.stringify(newProgress()));p.hp=30;await p.changeMap('village',content.village.spawn);}
  },
  onJoinMap(p){
    resetTransient(p);p.hp=progressOf(p).hp;
    p.off('adventure:action');
    p.on('adventure:action',(payload)=>{if(!payload||typeof payload!=='object')return;const {name,data}=payload as {name:unknown;data:unknown};if(typeof name==='string')action(p,name,data);});
  },
  onInput(p,{action}){keyboardInput(p,action);},
  onLoad(p){resetTransient(p,false);},
  onDisconnected(p){checkpoint(p);},
};

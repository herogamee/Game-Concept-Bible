import { type RpgPlayerHooks } from '@rpgjs/server';
import { playerSchema, content, resetTransient, action, keyboardInput, checkpoint, progressOf, runtime } from '../../game/runtime';
import { newProgress } from '../../game/rules';
const identities=new WeakMap<object,string>();
export const player:RpgPlayerHooks={
  props:playerSchema,
  async onConnected(p){
    identities.set(p,p.id);
    p.setHitbox(16,16);p.speed=3.2;p.name='นักผจญภัย '+p.id.slice(-4);p.setGraphic('adventurer');
    const loaded=await p.load(0,{reason:'load',source:'login'},{changeMap:true});
    if(!loaded.ok){p.initializeDefaultStats();p.adventure.set(JSON.stringify(newProgress()));p.hp=30;await p.changeMap('village',content.village.spawn);}
  },
  async onJoinMap(p){
    identities.set(p,p.id);
    resetTransient(p);p.hp=progressOf(p).hp;
    const map=content[p.getCurrentMap()?.id as keyof typeof content];
    // Old v0.2 saves used the smaller test map. Preserve progress, repair only
    // locations which now land inside a painted prop's collision footprint.
    if(map&&(p.x()<16||p.y()<16||p.x()>=map.width-16||p.y()>=map.height-16||[0,15].some(dx=>[0,15].some(dy=>map.blockedTiles.includes(Math.floor((p.y()+dy)/map.tileSize)*map.columns+Math.floor((p.x()+dx)/map.tileSize))))))await p.teleport(map.spawn);
    p.off('adventure:action');
    p.on('adventure:action',(payload)=>{if(!payload||typeof payload!=='object')return;const {name,data}=payload as {name:unknown;data:unknown};if(typeof name==='string')action(p,name,data);});
    checkpoint(p);
  },
  onInput(p,{action}){keyboardInput(p,action);},
  onLoad(p){const id=identities.get(p);if(id)p.id=id;resetTransient(p,false);},
  onDisconnected(p){if(!runtime(p).transfer)checkpoint(p);},
};

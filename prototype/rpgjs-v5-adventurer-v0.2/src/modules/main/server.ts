import { defineModule } from '@rpgjs/common';
import { type RpgServer, type RpgMap, type EventDefinition } from '@rpgjs/server';
import { player } from './player';
import { content, initMonster, stepMap, talk } from '../../game/runtime';
const npc=(name:string,role:string):EventDefinition=>({onInit(){this.name=name;this.setHitbox(16,16);this.setGraphic(`npc-${role}`);},onAction(p){talk(p);}});
export default defineModule<RpgServer>({
  player,
  engine:{onStep(server){if(server.getCurrentRoomKind()==='map'){const map=server.getCurrentRoom<RpgMap>();if(map)stepMap(map);}}},
  maps:Object.entries(content).map(([id,map])=>({id,
    events:map.objects.filter(o=>o.type!=='portal').map(o=>({id:o.id,event:o.type==='monster'?{name:o.id,onInit(){initMonster(this);}}:o.type==='prop'?{name:o.id,onInit(){this.name='';this.setHitbox(1,1);this.through=true;this.canMove=false;this.stopMoveTo();this.clearMovements();}}:{name:o.id,...npc(o.id==='elder-001'?'ผู้ใหญ่บ้าน':o.id==='merchant-001'?'พ่อค้า':'รุ่นพี่',(o.properties as {role:string}).role)}}))
  }))
});

import { createServer,  provideServerModules, LocalStorageSaveStorageStrategy } from "@rpgjs/server";
import { provideMain } from "./modules/main";
import { provideSaveStorage } from "@rpgjs/server";
import { provideTiledMap } from "@rpgjs/tiledmap/server";
// A browser slot belongs to this save, not to a past room's public player ID.
class AdventureLocalStorage extends LocalStorageSaveStorageStrategy {
  async get(player:any,index:number){
    const slot=await super.get(player,index);
    if(!slot?.snapshot)return slot;
    const data=JSON.parse(slot.snapshot);delete data.id;
    return {...slot,snapshot:JSON.stringify(data)};
  }
}

export default createServer({
    providers: [
      provideMain(),
      ...(typeof window !== 'undefined' ? [provideSaveStorage(new AdventureLocalStorage({ key: "adventurer-rpgjs-v02-slots1" }))] : []),
      provideServerModules([]),
      provideTiledMap()
    ]
  });

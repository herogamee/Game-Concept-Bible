import { createServer,  provideServerModules, LocalStorageSaveStorageStrategy } from "@rpgjs/server";
import { provideMain } from "./modules/main";
import { provideSaveStorage } from "@rpgjs/server";
import { provideTiledMap } from "@rpgjs/tiledmap/server";

export default createServer({
    providers: [
      provideMain(),
      ...(typeof window !== 'undefined' ? [provideSaveStorage(new LocalStorageSaveStorageStrategy({ key: "adventurer-rpgjs-v02-slots1" }))] : []),
      provideServerModules([]),
      provideTiledMap()
    ]
  });

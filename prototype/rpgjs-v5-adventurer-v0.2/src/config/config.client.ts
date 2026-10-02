import { provideClientGlobalConfig, provideClientModules, Presets } from "@rpgjs/client";
import { provideMain } from "../modules/main";
import { provideTiledMap } from "@rpgjs/tiledmap/client";
import { lpcSheet } from '../game/animation';
import { uiModule } from '../game/client-ui';

export default {
  providers: [
    provideTiledMap({
      basePath: "map",
    }),
    provideClientGlobalConfig({projectId:'adventurer-v02',keyboardControls:{action:'f'}}),
    provideMain(),
    provideClientModules([
      uiModule,
      {
        spritesheets: [
          lpcSheet(),
          {
            id: 'slime',
            image: 'spritesheets/slime.png',width:128,height:128,
             ...Presets.RMSpritesheet(4, 4)
          }
        ]
      }
    ])
  ],
};

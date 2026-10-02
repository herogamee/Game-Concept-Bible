import { provideClientGlobalConfig, provideClientModules } from '@rpgjs/client';
import { provideMain } from '../modules/main';
import { provideTiledMap } from '@rpgjs/tiledmap/client';
import { paintedSheet, paintedSupportingSheets } from '../game/animation';
import { uiModule } from '../game/client-ui';
export default {providers:[
  provideTiledMap({basePath:'map'}),
  provideClientGlobalConfig({projectId:'adventurer-v02',prediction:{enabled:false},movementAuthority:'server',bootstrapCanvasOptions:{resizeTo:null,width:800,height:450,antialias:false},keyboardControls:{up:[],down:[],left:[],right:[],action:'f'}}),
  provideMain(),provideClientModules([uiModule,{spritesheets:[paintedSheet(),...paintedSupportingSheets()]}])
]};

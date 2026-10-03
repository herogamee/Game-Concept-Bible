import { defineConfig } from 'vite';
import { rpgjs, tiledMapFolderPlugin } from '@rpgjs/vite';
import startServer from './src/server';
import {fileURLToPath} from 'node:url';

// RPGJS injects its runtime into every HTML entry by default. The image lab
// must keep its own entry; only the game iframe should boot the game engine.
function gameHtmlOnly(plugin:any){
  const hook=plugin.transformIndexHtml;if(!hook)return plugin;
  const handler=typeof hook==='function'?hook:hook.handler;
  const scoped=function(this:any,html:string,context:any){
    if(context.filename?.replaceAll('\\','/').endsWith('/lab.html'))return html;
    return handler.call(this,html,context);
  };
  return {...plugin,transformIndexHtml:typeof hook==='function'?scoped:{...hook,handler:scoped}};
}

export default defineConfig({
  build:{rolldownOptions:{input:{game:fileURLToPath(new URL('./index.html',import.meta.url)),lab:fileURLToPath(new URL('./lab.html',import.meta.url))}}},
  server: { hmr: { host: 'localhost' } },
  optimizeDeps: {
    include: ['pixi.js > @xmldom/xmldom']
  },
  plugins: [
    tiledMapFolderPlugin({
      sourceFolder: './src/tiled',      // Folder containing your TMX files
      publicPath: '/map',               // Public URL path for maps
      buildOutputPath: 'map'            // Match the runtime Tiled URL prefix
    }),
    ...rpgjs({
      server: startServer
    }).map(gameHtmlOnly)
  ], 
});

/* Bitmap asset adapter. Old code art remains a no-network fallback. */
const Painted = (() => {
  const originals = { object: Art.object, actor: Art.actor, slime: Art.slime };
  const images = {}, frames = new Map();
  const propNames = ['house','tree','rock','bush','flower','fence','sign','well','lamp',
    'house-blue','market','planter','reeds','barrels','bridge','rune'];
  function load(name, file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => { images[name] = image; resolve(); };
      image.onerror = () => reject(new Error('Cannot load artwork: '+file));
      image.src = 'assets/painted/'+file;
    });
  }
  // Keeps the gameplay harness independent of the browser's asynchronous image decoder.
  const ready = typeof Image === 'undefined' ? Promise.resolve() :
    Promise.all([...propNames.map(name => load(name,name+'.png')),load('adventurer','adventurer.png'),load('slime','slime.png'),load('npcs','npcs.png')]);
  const sizes={'house-blue':[224,192],market:[104,100],planter:[64,48],reeds:[48,40],barrels:[48,48],bridge:[100,72],rune:[48,64]};
  const blanks={};
  Art.object = type => {
    if(images[type])return images[type];
    if(!sizes[type])return originals.object(type);
    if(!blanks[type]){const canvas=document.createElement('canvas');[canvas.width,canvas.height]=sizes[type];blanks[type]=canvas;}
    return blanks[type];
  };
  function sheetFrame(sheet, row, column, width, height, cols, rows) {
    const key=[sheet,row,column,width,height].join(':');
    if(frames.has(key))return frames.get(key);
    const image=images[sheet];if(!image)return null;
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
    ctx.drawImage(image,column*image.width/cols,row*image.height/rows,image.width/cols,image.height/rows,0,0,width,height);
    frames.set(key,canvas);return canvas;
  }
  Art.actor = (kind, direction='down', frame=0, attacking=false) => {
    const npcColumn={elder:0,shop:1,guide:2}[kind];
    if(npcColumn!==undefined&&images.npcs)return sheetFrame('npcs',frame%3,npcColumn,64,64,3,3);
    if(kind!=='player'||!images.adventurer)return originals.actor(kind,direction,frame,attacking);
    const row={down:0,left:1,right:2,up:3}[direction] || 0;
    const column=attacking?Math.min(7,Math.floor((.35-Math.max(0,p.cd))/.35*8)):frame%8;
    return sheetFrame('adventurer',row+(attacking?4:0),column,64,64,8,8);
  };
  Art.slime = (frame=0,state='idle') => images.slime?
    sheetFrame('slime',{idle:0,move:1,hit:2,death:3}[state]||0,frame%4,48,48,4,4):originals.slime(frame);
  return {ready,images,load,sheetFrame,originals};
})();

const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const names=['house','tree','rock','bush','flower','fence','sign','well','lamp','house-blue','market','planter','reeds','barrels','bridge','rune','adventurer','slime','npcs'];
let bytes=0;
for(const name of names){
  const file=path.join(root,'assets','painted',name+'.png'),data=fs.readFileSync(file);
  assert.equal(data.subarray(1,4).toString(),'PNG',name+' PNG signature');
  assert.equal(data[25],6,name+' must have RGBA transparency');
  const width=data.readUInt32BE(16),height=data.readUInt32BE(20);
  assert(width>0&&height>0&&width<=512&&height<=512,name+' runtime dimensions');
  if(name==='adventurer'){assert.equal(width,512);assert.equal(height,512)}
  if(['slime','npcs'].includes(name)){assert.equal(width,192);assert.equal(height,192)}
  bytes+=data.length;
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g))assert(fs.existsSync(path.join(root,match[1])),'missing '+match[1]);
assert(bytes<1024*1024,'runtime image budget');
console.log('PASS 19 RGBA runtime assets, sprite grids, HTML paths; '+Math.round(bytes/1024)+' KiB total image payload');

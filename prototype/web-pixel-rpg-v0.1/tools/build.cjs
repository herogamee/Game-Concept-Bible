const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
fs.mkdirSync(out,{recursive:true});
for(const file of ['index.html','src','assets'])fs.cpSync(path.join(root,file),path.join(out,file),{
  recursive:true,
  filter:source=>!source.endsWith('-source.png')&&!source.endsWith('village-atlas.png')
});
// Remove previously bundled source atlases from this known build output only.
const painted=path.join(out,'assets','painted');
if(fs.existsSync(painted))for(const name of fs.readdirSync(painted)){
  if(name.endsWith('-source.png')||name==='village-atlas.png')fs.unlinkSync(path.join(painted,name));
}
console.log('Built static game; high-resolution authoring sheets excluded from dist');

from pathlib import Path
from PIL import Image
root=Path('prototype/web-pixel-rpg-v0.1/assets/painted');im=Image.open(root/'npcs-source.png');out=Image.new('RGBA',(192,192))
for row in range(3):
 for col in range(3):
  tile=im.crop((round(col*im.width/3),round(row*im.height/3),round((col+1)*im.width/3),round((row+1)*im.height/3)))
  out.alpha_composite(tile.resize((64,64),Image.Resampling.LANCZOS),(col*64,row*64))
out.save(root/'npcs.png',optimize=True)

from pathlib import Path
from PIL import Image
root=Path('prototype/web-pixel-rpg-v0.1/assets/painted')
im=Image.open(root/'adventurer-source.png')
out=Image.new('RGBA',(512,512))
for row in range(8):
 for col in range(8):
  box=(round(col*im.width/8),round(row*im.height/8),round((col+1)*im.width/8),round((row+1)*im.height/8))
  tile=im.crop(box).resize((64,64),Image.Resampling.LANCZOS)
  out.alpha_composite(tile,(col*64,row*64))
out.save(root/'adventurer.png',optimize=True)
print('64 directional frames packed into 512x512 runtime sheet')

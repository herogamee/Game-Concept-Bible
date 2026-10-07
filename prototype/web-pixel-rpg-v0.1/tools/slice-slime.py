from pathlib import Path
from PIL import Image
root=Path('prototype/web-pixel-rpg-v0.1/assets/painted')
im=Image.open(root/'slime-source.png');out=Image.new('RGBA',(192,192))
for row in range(4):
 for col in range(4):
  tile=im.crop((round(col*im.width/4),round(row*im.height/4),round((col+1)*im.width/4),round((row+1)*im.height/4)))
  out.alpha_composite(tile.resize((48,48),Image.Resampling.LANCZOS),(col*48,row*48))
out.save(root/'slime.png',optimize=True)

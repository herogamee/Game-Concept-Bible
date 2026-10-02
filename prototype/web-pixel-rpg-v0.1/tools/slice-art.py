"""Slice the generated prop atlas into transparent, runtime-sized sprites.
Bounds were visually reviewed; this is atlas extraction, not redrawing artwork.
"""
from pathlib import Path
from PIL import Image, ImageOps
root=Path(__file__).resolve().parents[1]/'assets'/'painted'
source=Image.open(root/'village-atlas.png')
regions={
'house':((0,0,315,370),(224,192)),
 'tree':((316,0,648,370),(112,152)),
 'rock':((649,70,930,370),(64,48)),
 'bush':((931,60,1254,370),(64,48)),
 'flower':((0,400,314,645),(32,32)),
 'fence':((315,420,670,638),(64,40)),
 'sign':((675,375,939,652),(48,64)),
 'well':((940,370,1254,685),(80,80)),
 'lamp':((0,645,310,969),(32,96)),
 'house-blue':((312,645,644,979),(224,192)),
 'market':((645,673,948,979),(104,100)),
 'planter':((950,680,1254,979),(64,48)),
 'reeds':((0,979,310,1254),(48,40)),
 'barrels':((312,990,608,1254),(48,48)),
 'bridge':((612,980,952,1254),(100,72)),
 'rune':((958,970,1254,1254),(48,64))}
for name,(box,size) in regions.items():
    tile=source.crop(box)
    bounds=tile.getchannel('A').getbbox()
    if bounds:tile=tile.crop(bounds)
    tile=ImageOps.contain(tile,size,Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',size)
    canvas.alpha_composite(tile,((size[0]-tile.width)//2,size[1]-tile.height))
    canvas.save(root/(name+'.png'),optimize=True)
print('Extracted',len(regions),'transparent runtime props')

"""Reproducible LPC composition and original CC0 prototype tiles/slime."""
from pathlib import Path
from PIL import Image, ImageDraw
import json, csv, math
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'assets/lpc-source'
OUT = ROOT / 'public/spritesheets'
OUT.mkdir(parents=True, exist_ok=True)
LAYERS = ['body', 'legs_pants', 'torso_clothes_longsleeve', 'heads_human_male', 'hair_plain']
ANIMS = [('spellcast',0),('thrust',4),('walk',8),('slash',12),('shoot',16),('hurt',20)]
sheet = Image.new('RGBA',(832,1344))
for anim,row in ANIMS:
    base = Image.open(SRC / f'body-{anim}.png').convert('RGBA')
    frame = Image.new('RGBA',base.size)
    for layer in LAYERS:
        im = Image.open(SRC / f'{layer}-{anim}.png').convert('RGBA')
        if layer == 'torso_clothes_longsleeve':
            im.putdata([(int(r*.42),int(g*.65),min(255,int(b*.95)),a) if a and max(r,g,b)>75 else (r,g,b,a) for r,g,b,a in im.getdata()])
        if layer == 'hair_plain':
            im.putdata([(int(r*.45),int(g*.62),int(b*.65),a) for r,g,b,a in im.getdata()])
        frame.alpha_composite(im)
    # Original temporary sword, separately credited CC0. LPC pose remains intact.
    if anim == 'slash':
        d=ImageDraw.Draw(frame)
        for direction in range(4):
            for f in range(6):
                cx=f*64+32; cy=direction*64+40
                angle=[-math.pi/2,math.pi,math.pi/2,0][direction]+(f-2.5)*.35
                start=(cx+int(math.cos(angle)*12),cy+int(math.sin(angle)*12))
                end=(cx+int(math.cos(angle)*29),cy+int(math.sin(angle)*29))
                d.line([start,end],fill='#203243',width=5)
                d.line([start,end],fill='#edf6ed',width=3)
                d.ellipse((start[0]-3,start[1]-3,start[0]+3,start[1]+3),fill='#d4a553')
    sheet.alpha_composite(frame,(0,row*64))
sheet.save(OUT/'adventurer-lpc.png')
credits=[]
for layer in LAYERS:
    definition=json.loads((SRC/f'{layer}.json').read_text())
    selected=definition['layer_1']['male'].rstrip('/')
    for c in definition['credits']:
        if selected.startswith(c['file']):
            assert 'OGA-BY 3.0' in c['licenses']
            credits.append({'layer':layer,'sourceFolder':selected,'selectedLicense':'OGA-BY 3.0',**c})
(ROOT/'assets/LPC-CREDITS.json').write_text(json.dumps({'upstream':'https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator','modifications':'composite male layers, blue shirt/brown hair recolor; project-created sword overlay','layers':credits},indent=2),encoding='utf-8')
with (ROOT/'assets/LPC-CREDITS.csv').open('w',newline='',encoding='utf-8') as file:
    w=csv.writer(file); w.writerow(['layer','files','authors','selected license','available licenses','source URLs','notes'])
    for c in credits: w.writerow([c['layer'],c['sourceFolder'],'; '.join(c['authors']),c['selectedLicense'],'; '.join(c['licenses']),'; '.join(c['urls']),c.get('notes','')])
# Original four-frame slime, same four direction rows.
slime=Image.new('RGBA',(128,128)); d=ImageDraw.Draw(slime)
for r in range(4):
    for f in range(4):
        x=f*32; y=r*32; bob=f%2
        d.ellipse((x+3,y+25,x+29,y+30),fill=(25,55,38,80))
        d.ellipse((x+3,y+11+bob,x+29,y+28),fill='#234e3a')
        d.ellipse((x+5,y+10+bob,x+27,y+25),fill='#70c977')
        d.ellipse((x+8,y+12+bob,x+17,y+17+bob),fill='#b8ef96')
        for xx in [12,22]: d.rectangle((x+xx,y+19,x+xx+2,y+22),fill='#183936')
slime.save(OUT/'slime.png')
# Small project-made terrain atlas; first tile grass, second path, third wall.
tiles=Image.new('RGBA',(160,32)); d=ImageDraw.Draw(tiles)
for t,col in enumerate(['#71965a','#bea16a','#405347','#496f8c','#749fb0']):
    d.rectangle((t*32,0,t*32+31,31),fill=col)
    for i in range(12):
        x=t*32+(i*13+7)%30; y=(i*7+3)%30
        d.line((x,y,x+2,y+1),fill=['#86a866','#d0b37c','#576950','#6895b4','#b2d7db'][t])
tiles.save(ROOT/'src/tiled/willowbrook-tiles.png')
print('Composed LPC sheet with per-layer OGA-BY credits; original tiles/slime generated.')

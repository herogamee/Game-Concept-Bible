"""Register generated headless walk frames; resize PNGs without repainting them.
Head sources retain one shared transform. PNG registration metadata is explicit.
Original DDTank show files are preserved; walk_downleft is a lab extension.
"""
from pathlib import Path
from PIL import Image
from io import BytesIO
import hashlib, json

ROOT = Path(__file__).resolve().parent
FRAME = (250, 342)
NECK = (117, 162)
HEAD_ORIGIN = (600, 627)
HEAD_SCALE = .23
LOCK = json.loads((ROOT/"character-standard-lock.json").read_text(encoding="utf-8"))
assert list(FRAME) == LOCK["settings"]["frame_size"]
assert list(NECK) == LOCK["settings"]["head_anchor"]
assert list(HEAD_ORIGIN) == LOCK["settings"]["head_source_anchor"]
assert HEAD_SCALE == LOCK["settings"]["head_scale"]

def register(im, source_anchor, scale):
    tx = NECK[0] - source_anchor[0] * scale
    ty = NECK[1] - source_anchor[1] * scale
    return im.transform(FRAME, Image.Transform.AFFINE,
        (1/scale, 0, -tx/scale, 0, 1/scale, -ty/scale),
        Image.Resampling.BICUBIC)

def save(im, relative):
    path = ROOT / relative
    encoded = BytesIO()
    im.save(encoded,format="PNG")
    payload = encoded.getvalue()
    expected = LOCK["assets"].get(relative)
    assert expected and hashlib.sha256(payload).hexdigest() == expected["sha256"], "Export differs from locked v1: " + relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(payload)
    return {"path":relative, "width":im.width, "height":im.height,
        "sha256":hashlib.sha256(path.read_bytes()).hexdigest()}

def single(source, slot, pic, variant=""):
    im = Image.open(ROOT / "authoring/head-parts" / source).convert("RGBA")
    suffix = (variant + "/") if variant else ""
    return save(register(im, HEAD_ORIGIN, HEAD_SCALE),
        f"image/equip/m/{slot}/{pic}/1/{suffix}walk_downleft.png")

catalog = {"version":1, "sex":"m", "direction":"downleft", "frame_size":list(FRAME),
    "frame_count":8, "cycle_seconds":.9, "cloth_layout":"horizontal-strip",
    "layer_order":["cloth","base_head","face","eff","hair","head"],
    "head_anchor":list(NECK), "head_source_anchor":list(HEAD_ORIGIN), "head_scale":HEAD_SCALE,
    "head_source":"existing registered 3/4-left head, shared across all equipment",
    "compatibility":"DDTank equipment folder names; this 8-frame walk is a lab extension, not an original Flash game clip",
    "defaults":{"cloth":"ours_cloth_1","hair":"ours_hair_1","face":"ours_face_1","eff":"none","head":"none"},
    "base_head":single("head-template.png","face","default"),
    "cloth":[], "hair":[], "face":[], "eff":[], "head":[]}

bodies = [
    ("ours_cloth_1","ชุดนักเดินทาง","traveler-headless-walk-v1.png",.466,
        [(170.42,198.27),(174.46,199.09),(172.83,198.2),(175.53,198.86),(172.73,170.14),(177.27,169.31),(177.88,166.11),(179.31,166.19)]),
    ("ours_cloth_2","ชุดอัศวิน","knight-headless-walk-v1.png",.452,
        [(169.25,201.98),(172.53,201.91),(169.83,203.87),(175.63,203.89),(169.57,123.06),(172.55,122.88),(172.62,121.24),(177.38,122.34)])]
for pic,label,source,scale,anchors in bodies:
    im=Image.open(ROOT / "authoring" / source).convert("RGBA")
    cw,ch=im.width//4,im.height//2
    strip=Image.new("RGBA",(FRAME[0]*8,FRAME[1]))
    for i,anchor in enumerate(anchors):
        x,y=(i%4)*cw,(i//4)*ch
        cell=im.crop((x,y,x+cw,y+ch))
        strip.paste(register(cell,anchor,scale),(i*FRAME[0],0))
    asset=save(strip,f"image/equip/m/cloth/{pic}/1/walk_downleft.png")
    catalog["cloth"].append({"id":pic,"label":label,"asset":asset,
        "source":"authoring/"+source,"registration":{"scale":scale,"source_necks":anchors,"target_neck":NECK}})
for entry,source in zip(catalog["cloth"],["clothing-traveler.png","clothing-knight.png"]):
    im=Image.open(ROOT/"authoring/head-parts"/source).convert("RGBA")
    entry["stand_asset"]=save(register(im,HEAD_ORIGIN,HEAD_SCALE),
        f"image/equip/m/cloth/{entry['id']}/1/stand_show.png")
    entry["stand_source"]="authoring/head-parts/"+source

for pic,label,normal,hat in [
    ("ours_hair_1","ผมน้ำตาล","hair-chestnut.png","hair-chestnut-under-hat.png"),
    ("ours_hair_4","ผมฟ้า","hair-paired-teal.png","hair-paired-teal-under-hat.png")]:
    catalog["hair"].append({"id":pic,"label":label,"asset":single(normal,"hair",pic,"B"),"under_hat":single(hat,"hair",pic,"A")})
for pic,label,src in [("ours_face_1","ตาอำพัน · ยิ้ม","eyes-amber.png"),("ours_face_2","ตาเขียว · มุ่งมั่น","eyes-determined.png")]:
    catalog["face"].append({"id":pic,"label":label,"asset":single(src,"face",pic),
        "already_closed":False})
closed_asset=single("eyes-joy.png","face","ours_face_3")
catalog["animation_faces"]=[{"id":"ours_face_3","asset":closed_asset,"inventory":False,"role":"closed-eye animation source only"}]
catalog["blink"]={
    "closed_asset":closed_asset,
    "closed_seconds":.16,"interval_seconds":[2.4,4.8],
    "source":"authoring/head-parts/eyes-joy.png",
    "source_eye_regions":[
        [[435,440],[452,436],[478,448],[506,464],[511,534],[453,544],[435,518]],
        [[555,447],[584,425],[637,424],[694,443],[710,473],[700,537],[576,546],[551,513]]],
    "method":"Clip the existing closed-eye artwork into ocular regions only; preserve each selected expression's eyebrows and mouth. Use the shared head transform.",
    "reference":"research/DDTank41-Classic/Source Flash/scripts/ddt/view/character/RoomPlayerAction.as: NORMAL_CLOSE_EYES (open -> closed -> open); lab timing is independent of walking."
}
for pic,label,src in [("ours_eff_1","รอยแผล","face-scar.png"),("ours_eff_2","แก้มแดงและกระ","face-blush.png")]:
    catalog["eff"].append({"id":pic,"label":label,"asset":single(src,"eff",pic)})
catalog["head"].append({"id":"ours_head_1","label":"หมวกนักเดินทาง","asset":single("hat-adventurer.png","head","ours_head_1")})
for slot in ["cloth","hair","face","eff","head"]:
    for entry in catalog[slot]:
        preview=Image.new("RGBA",FRAME)
        if slot in ["hair","face","eff","head"]:
            preview.alpha_composite(Image.open(ROOT/catalog["base_head"]["path"]).convert("RGBA"))
        part=Image.open(ROOT/entry.get("stand_asset",entry["asset"])["path"]).convert("RGBA")
        preview.alpha_composite(part.crop((0,0,*FRAME)))
        # Icons are composed UI previews, not replacement runtime body/head layers.
        bounds=preview.getchannel("A").point(lambda a:255 if a>=32 else 0).getbbox()
        cropped=preview.crop(bounds)
        scale=min(70/cropped.width,70/cropped.height)
        cropped=cropped.resize((max(1,round(cropped.width*scale)),max(1,round(cropped.height*scale))),Image.Resampling.LANCZOS)
        icon=Image.new("RGBA",(78,78))
        icon.alpha_composite(cropped,((78-cropped.width)//2,(78-cropped.height)//2))
        entry["icon"]=save(icon,f"image/equip/m/{slot}/{entry['id']}/icon_1.png")
        entry["icon_preview_layers"]=["base_head",slot] if slot in ["hair","face","eff","head"] else [slot]
catalog_text=json.dumps(catalog,ensure_ascii=False,indent=2)
catalog_payload=catalog_text.replace("\n","\r\n").encode("utf-8")
assert hashlib.sha256(catalog_payload).hexdigest() == LOCK["catalog_sha256"], "Catalog differs from locked v1; create a new reviewed version"
(ROOT/"modular-catalog.json").write_bytes(catalog_payload)
print("Registered 2 clothing strips and 11 shared head components; frame 250x342.")

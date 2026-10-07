extends RefCounted

# Shared PNGs and registration from the browser experiment, rendered by Godot.
const ROOT = "res://research/ready-made-animation/web/chibi/template-walk-test/"
const SLOTS = ["cloth","hair","face","eff","head"]
var catalog: Dictionary = {}
var images: Dictionary = {}
var thumbnails: Dictionary = {}
var closed_faces: Dictionary = {}
var head_center_x: float = -1.0
var locked_assets: Dictionary = {}

func standard_head_center_x() -> float:
	if head_center_x < 0:
		var head = image(catalog.base_head)
		var left: int = head.get_width()
		var right: int = -1
		for y in range(head.get_height()):
			for x in range(head.get_width()):
				if head.get_pixel(x,y).a >= 0.1:
					left = mini(left,x)
					right = maxi(right,x)
		head_center_x = (left+right+1)*0.5
	return head_center_x

func aura_character_offset() -> Vector2i:
	# Bridge the custom PNG registration to the native DDTank portrait axis.
	# The head is at x=125; the original circle axis is x=47 * (250/120).
	return Vector2i(int(round(47.0*250.0/120.0-standard_head_center_x())),0)

func _init() -> void:
	var lock = JSON.parse_string(FileAccess.get_file_as_string(ROOT+"character-standard-lock.json"))
	assert(lock != null,"Missing character-standard-v1 lock; restore the baseline before loading")
	assert(FileAccess.get_sha256(ROOT+"modular-catalog.json") == lock.catalog_sha256,"Character catalog differs from locked v1")
	locked_assets = lock.assets
	catalog = JSON.parse_string(FileAccess.get_file_as_string(ROOT+"modular-catalog.json"))

func image(asset: Dictionary) -> Image:
	var path = str(asset.path)
	if not images.has(path):
		assert(locked_assets.has(path),"Asset is outside character-standard-v1: "+path)
		assert(FileAccess.get_sha256(ROOT+path) == locked_assets[path].sha256,"Locked character asset changed: "+path)
		var loaded = Image.load_from_file(ProjectSettings.globalize_path(ROOT+path))
		assert(loaded != null,"Missing modular asset: "+path)
		assert(loaded.get_width() == locked_assets[path].width and loaded.get_height() == locked_assets[path].height,"Locked PNG dimensions changed: "+path)
		loaded.convert(Image.FORMAT_RGBA8)
		images[path] = loaded
	return images[path]

func find(slot: String, appearance: Dictionary) -> Dictionary:
	var id = str(appearance.get(slot,catalog.defaults[slot]))
	if id.is_empty():
		id = str(catalog.defaults[slot])
	for entry in catalog[slot]:
		if entry.id == id:
			return entry
	return {}

func valid(appearance: Dictionary) -> bool:
	for slot in appearance:
		if slot not in SLOTS or not appearance[slot] is String:
			return false
		if appearance[slot] == "none" and slot not in ["eff","head"]:
			return false
		if not str(appearance[slot]).is_empty() and appearance[slot] != "none" and find(slot,appearance).is_empty():
			return false
	return true

func selected_asset(slot: String, appearance: Dictionary, visibility: Dictionary) -> Dictionary:
	if slot == "base_head":
		return catalog.base_head
	var entry = find(slot,appearance)
	if entry.is_empty():
		return {}
	if slot == "hair" and not find("head",appearance).is_empty() and visibility.get("head",true):
		return entry.get("under_hat",entry.asset)
	return entry.asset

func closed_face(entry: Dictionary) -> Image:
	if entry.get("already_closed",false):
		return image(entry.asset)
	if closed_faces.has(entry.id):
		return closed_faces[entry.id]
	var result = image(entry.asset).duplicate()
	var closed = image(catalog.blink.closed_asset)
	var polygons: Array[PackedVector2Array] = []
	for region in catalog.blink.source_eye_regions:
		var polygon = PackedVector2Array()
		for point in region:
			polygon.append(Vector2(catalog.head_anchor[0],catalog.head_anchor[1])+(Vector2(point[0],point[1])-Vector2(catalog.head_source_anchor[0],catalog.head_source_anchor[1]))*float(catalog.head_scale))
		polygons.append(polygon)
	# Same ocular clip as Canvas; brows and mouth outside these regions stay exact.
	for y in range(100,147):
		for x in range(70,146):
			for polygon in polygons:
				if Geometry2D.is_point_in_polygon(Vector2(x+.5,y+.5),polygon):
					var pixel = closed.get_pixel(x,y)
					result.set_pixel(x,y,result.get_pixel(x,y).blend(pixel))
					break
	closed_faces[entry.id] = result
	return result

func compose(appearance: Dictionary, frame: int, closed: bool, visibility: Dictionary, standing: bool = false) -> Image:
	var result = Image.create(250,342,false,Image.FORMAT_RGBA8)
	result.fill(Color.TRANSPARENT)
	for slot in catalog.layer_order:
		if not visibility.get(slot,true):
			continue
		var asset = selected_asset(slot,appearance,visibility)
		if slot == "cloth" and standing:
			asset = find("cloth",appearance).stand_asset
		if asset.is_empty():
			continue
		var part = closed_face(find("face",appearance)) if slot == "face" and closed else image(asset)
		result.blend_rect(part,Rect2i(frame*250 if slot == "cloth" and not standing else 0,0,250,342),Vector2i.ZERO)
	return result

func items() -> Array:
	var result: Array = []
	var number = 900001
	for slot in SLOTS:
		for entry in catalog[slot]:
			result.append({"id":number,"pic":entry.id,"name":entry.label,"slot":slot,"sex":"m","renderable":true,"show_ready":true,"modular":true})
			number += 1
	return result

func thumbnail(item: Dictionary) -> Texture2D:
	var key = str(item.pic)
	if not thumbnails.has(key):
		var entry = find(str(item.slot),{str(item.slot):key})
		thumbnails[key] = ImageTexture.create_from_image(image(entry.icon))
	return thumbnails[key]

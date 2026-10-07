extends Control

signal changed

const AuraRules = preload("res://scripts/aura_rules.gd")
const ModularCharacter = preload("res://scripts/modular_character.gd")

var store
var selected: Dictionary = {}
var sex: String = "m"
var mode: String = "show"
var action: String = "STAND"
var playing: bool = true
var flipped: bool = false
var zoom: float = 1.0
var tick: int = 0
var clock: float = 0.0
var current_image: Image
var current_texture: Texture2D
var frame_cache: Dictionary = {}
var missing_parts: Array[String] = []
var visible_parts: Dictionary = {}
var raw_overrides: Dictionary = {}
var draw_stage: bool = true
var frame_override: int = -1
var wing_tick: int = 0
var wing_clock: float = 0.0
var body_origin: Vector2i = Vector2i.ZERO
var body_bottom: float = 0.0
var wing_transforms: Dictionary = {}
var wing_image_cache: Dictionary = {}
var aura_state: Dictionary = AuraRules.DEFAULTS.duplicate(true)
var aura_ticks: Dictionary = {"circle":0,"body":0}
var aura_clocks: Dictionary = {"circle":0.0,"body":0.0}
var aura_image_cache: Dictionary = {}
var modular_appearance: Dictionary = {}
var modular_renderer
var modular_frame: int = 0
var modular_clock: float = 0.0
var modular_motion: String = "walk"
var blink_closed: bool = false
var blink_clock: float = 0.0
var blink_wait: float = 3.0
var blink_count: int = 0

func modular_library():
	if modular_renderer == null:
		modular_renderer = ModularCharacter.new()
	return modular_renderer

func set_modular_appearance(value: Dictionary) -> void:
	assert(value.is_empty() or modular_library().valid(value))
	modular_appearance = value.duplicate(true)
	if not value.is_empty():
		sex = "m"
		mode = "show"
	refresh()

func modular_items() -> Array:
	return modular_library().items()

# The local 4.0 bitmaps and wing Flash library use different portrait anchors.
# These Lab defaults are editable per mode and saved with the outfit.
const WING_DEFAULTS = {"show":{"x":20.0,"y":40.0,"scale":1.5}, "game":{"x":0.0,"y":0.0,"scale":1.0}}

const DEFAULTS = {
	"m": {"head":1101, "glass":2101, "hair":3101, "eff":4101, "cloth":5101, "face":6101, "arm":7001},
	"f": {"head":1201, "glass":2201, "hair":3201, "eff":4201, "cloth":5201, "face":6201, "arm":7002}
}

func setup(asset_store) -> void:
	store = asset_store
	clip_contents = true
	custom_minimum_size = Vector2(350, 420)
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	size_flags_vertical = Control.SIZE_EXPAND_FILL
	reset_character("m")

func reset_character(new_sex: String) -> void:
	modular_appearance.clear()
	sex = new_sex
	selected = DEFAULTS[sex].duplicate(true)
	visible_parts.clear()
	raw_overrides.clear()
	wing_transforms = WING_DEFAULTS.duplicate(true)
	aura_state = AuraRules.DEFAULTS.duplicate(true)
	refresh()

func equip(item: Dictionary) -> bool:
	if item.get("modular",false):
		if modular_appearance.is_empty():
			return false
		modular_appearance[item.slot] = item.pic
		visible_parts[item.slot] = true
		refresh()
		return true
	if not item.get("renderable", false):
		return false
	if item.get("sex", "any") not in [sex, "any"]:
		return false
	if item.slot == "suits" and int(item.id) in [13101, 13201]:
		selected.erase("suits")
		refresh()
		return true
	if item.slot == "wing" and int(item.id) == 15001:
		selected.erase("wing")
		refresh()
		return true
	selected[item.slot] = int(item.id)
	if not item.get(mode + "_ready", false):
		mode = "game" if item.get("game_ready", false) else "show"
	raw_overrides.erase(item.slot)
	visible_parts[item.slot] = true
	refresh()
	return true

# Keep fallback appearance separate from the actual selection saved in presets.
# Suits and wings are optional; an empty slot must not add either one.
func appearance_equipment() -> Dictionary:
	var equipment: Dictionary = DEFAULTS[sex].duplicate()
	for slot in selected:
		if int(selected[slot]) > 0:
			equipment[slot] = selected[slot]
	return equipment

func uses_default(slot: String) -> bool:
	if not modular_appearance.is_empty() and slot in ModularCharacter.SLOTS:
		return str(modular_appearance.get(slot,"")) in ["",str(modular_library().catalog.defaults[slot])]
	return DEFAULTS[sex].has(slot) and int(selected.get(slot, 0)) in [0, -1, int(DEFAULTS[sex][slot])]

func unequip(slot: String) -> void:
	if not modular_appearance.is_empty() and slot in ModularCharacter.SLOTS:
		modular_appearance[slot] = ""
		visible_parts.erase(slot)
		refresh()
		return
	selected.erase(slot)
	raw_overrides.erase(slot)
	visible_parts.erase(slot)
	refresh()

func set_mode(value: String) -> void:
	mode = value
	frame_override = -1
	refresh()

func refresh() -> void:
	tick = 0
	clock = 0.0
	wing_tick = 0
	wing_clock = 0.0
	aura_ticks = {"circle":0,"body":0}
	aura_clocks = {"circle":0.0,"body":0.0}
	frame_cache.clear()
	wing_image_cache.clear()
	aura_image_cache.clear()
	rebuild_frame()
	changed.emit()

func _process(delta: float) -> void:
	if store == null:
		return
	var needs_draw = false
	if not modular_appearance.is_empty():
		var old_closed = blink_closed
		if blink_closed:
			blink_clock += delta
			if blink_clock >= .16:
				blink_closed = false
				blink_wait = randf_range(2.4,4.8)
		else:
			blink_wait -= delta
			if blink_wait <= 0:
				blink_closed = true
				blink_clock = 0.0
				blink_count += 1
		needs_draw = old_closed != blink_closed
		if playing and modular_motion == "walk":
			modular_clock += delta*.75
			if modular_clock >= .9/8.0:
				modular_frame = (modular_frame+int(modular_clock/(.9/8.0)))%8
				modular_clock = fmod(modular_clock,.9/8.0)
				needs_draw = true
	if not playing:
		if needs_draw:
			rebuild_frame()
		return
	var active_auras = aura_tracks()
	for role in active_auras:
		var track = active_auras[role]
		var interval = 1.0 / maxf(1.0, float(track.get("fps", 25.0)))
		aura_clocks[role] += delta
		if aura_clocks[role] >= interval:
			aura_ticks[role] += int(aura_clocks[role] / interval)
			aura_clocks[role] = fmod(aura_clocks[role], interval)
			needs_draw = true
	if selected.has("wing") and visible_parts.get("wing", true):
		var wing = store.wings.get(str(int(selected.wing)), {})
		var interval = 1.0 / maxf(1.0, float(wing.get("fps", 25.0)))
		wing_clock += delta
		if wing_clock >= interval:
			wing_tick += int(wing_clock / interval)
			wing_clock = fmod(wing_clock, interval)
			needs_draw = true
	if not modular_appearance.is_empty() or mode != "game" or frame_override >= 0:
		if needs_draw:
			rebuild_frame()
		return
	clock += delta
	if clock >= 0.04:
		clock = fmod(clock, 0.04)
		var definition = store.actions.get(action, store.actions.get("STAND", {}))
		var sequence = definition.get("frames", [[0]])[0]
		if tick + 1 < sequence.size():
			tick += 1
		elif definition.get("repeat", false):
			tick = 0
		elif not definition.get("stop_at_end", false):
			action = "STAND"
			tick = 0
		needs_draw = true
	if needs_draw:
		rebuild_frame()

func frame_indices() -> Array:
	if frame_override >= 0:
		return [frame_override, frame_override, frame_override]
	var definition = store.actions.get(action, store.actions.get("STAND", {}))
	var sequences = definition.get("frames", [[0]])
	var frame = int(sequences[0][mini(tick, sequences[0].size() - 1)])
	var upper = frame
	if action == "STAND" and sequences.size() > 1:
		upper = int(sequences[1][mini(tick, sequences[1].size() - 1)])
	return [frame, frame, upper]

func rebuild_frame() -> void:
	var indices = frame_indices() if mode == "game" else [0, 0, 0]
	var key = mode + str(indices)
	if not modular_appearance.is_empty():
		key += modular_motion+str(modular_frame if modular_motion == "walk" else 0)+str(blink_closed)+JSON.stringify(modular_appearance)
		if frame_cache.size() > 32:
			frame_cache.clear()
	var body: Image
	if frame_cache.has(key):
		body = frame_cache[key]
	else:
		body = compose(indices)
		frame_cache[key] = body
	current_image = combine_auras(combine_wings(body))
	current_texture = ImageTexture.create_from_image(current_image)
	queue_redraw()

func compose(indices: Array) -> Image:
	missing_parts.clear()
	if not modular_appearance.is_empty():
		return modular_library().compose(modular_appearance,modular_frame,blink_closed,visible_parts,modular_motion == "stand")
	var equipment = appearance_equipment()
	var target_size = Vector2i(114, 95) if mode == "game" else Vector2i(250, 342)
	var result = Image.create(target_size.x, target_size.y, false, Image.FORMAT_RGBA8)
	result.fill(Color.TRANSPARENT)
	var order = ["arm", "face", "hair", "cloth", "eff", "head", "glass"] if mode == "game" else ["face", "hair", "cloth", "eff", "head", "glass", "arm"]
	if equipment.has("suits") and visible_parts.get("suits", true):
		order = ["arm", "suits"] if mode == "game" else ["suits", "arm"]
	var hat = store.equipment_by_id.get(int(equipment.get("head", 0)), {})
	var hair = "B" if int(hat.get("hair_type", 1)) == 1 or not visible_parts.get("head", true) else "A"
	for slot in order:
		if not visible_parts.get(slot, true) or not equipment.has(slot):
			continue
		var item = store.equipment_by_id.get(int(equipment[slot]), {})
		var path = store.item_path(item, mode, hair)
		if selected.has(slot) and raw_overrides.has(slot) and str(raw_overrides[slot]).ends_with("/" + mode + ".png"):
			path = raw_overrides[slot]
		var image = store.get_image(path)
		if image == null:
			missing_parts.append(slot)
			continue
		var frame = 0
		if mode == "game":
			frame = int(indices[0] if slot in ["arm", "suits"] else indices[1] if slot == "face" else indices[2])
		var origin = Vector2i(frame % 13 * 114, int(frame / 13) * 95) if mode == "game" else Vector2i.ZERO
		var available = image.get_size() - origin
		var region_size = Vector2i(mini(target_size.x, available.x), mini(target_size.y, available.y))
		if region_size.x <= 0 or region_size.y <= 0:
			missing_parts.append(slot)
			continue
		result.blend_rect(image, Rect2i(origin, region_size), Vector2i.ZERO)
	return result

func wing_tracks() -> Dictionary:
	if not selected.has("wing") or not visible_parts.get("wing", true):
		return {}
	var wing = store.wings.get(str(int(selected.wing)), {})
	if mode == "show":
		return {"back":wing.show} if wing.get("show", {}).get("visible", false) else {}
	var tracks = {}
	for role in ["back", "front"]:
		var layer = wing.get("game", {}).get(role, {})
		var state = {"STAND":1, "WALK":2, "CRY":3, "HANDCLIP":4, "SHOT":5, "THROWS":5}.get(action, 1)
		if int(layer.get("state_count", 1)) == 2:
			state = 2 if action in ["SHOT", "THROWS"] else 1
		var track = layer.get("states", {}).get(str(state), layer.get("states", {}).get("1", {}))
		if not track.is_empty():
			tracks[role] = track
	return tracks

func wing_frame(track: Dictionary, scale_factor: float) -> Image:
	var frame = wing_tick % maxi(1, int(track.frames))
	var key = str(track.atlas) + ":" + str(frame) + ":" + str(scale_factor)
	if wing_image_cache.has(key):
		return wing_image_cache[key]
	var sheet = store.get_baked_image(str(track.atlas))
	if sheet == null:
		return null
	var cell = Vector2i(int(track.cell[0]), int(track.cell[1]))
	var region = Rect2i(Vector2i(frame % int(track.columns) * cell.x, int(frame / int(track.columns)) * cell.y), cell)
	var image = sheet.get_region(region)
	if not is_equal_approx(scale_factor, 1.0):
		image.resize(maxi(1, int(round(cell.x * scale_factor))), maxi(1, int(round(cell.y * scale_factor))), Image.INTERPOLATE_LANCZOS)
	if wing_image_cache.size() >= 64:
		wing_image_cache.erase(wing_image_cache.keys()[0])
	wing_image_cache[key] = image
	return image

func combine_wings(body: Image) -> Image:
	body_origin = Vector2i.ZERO
	body_bottom = body.get_used_rect().end.y
	var tracks = wing_tracks()
	if tracks.is_empty():
		if selected.has("wing") and visible_parts.get("wing", true) and not missing_parts.has("wing"):
			missing_parts.append("wing")
		return body
	var transform = wing_transforms.get(mode, WING_DEFAULTS[mode])
	var scale_factor = clampf(float(transform.get("scale", 1.0)), 0.25, 3.0)
	var bounds = Rect2i(Vector2i.ZERO, body.get_size())
	var positions = {}
	# Union all states, not just the current pose: the body anchor stays fixed.
	var wing = store.wings.get(str(int(selected.wing)), {})
	var all_tracks: Array = [wing.show] if mode == "show" else []
	if mode == "game":
		for layer in wing.get("game", {}).values():
			all_tracks.append_array(layer.get("states", {}).values())
	for track in all_tracks:
		var origin = Vector2i(int(round(float(track.origin[0]) * scale_factor + float(transform.get("x", 0.0)))), int(round(float(track.origin[1]) * scale_factor + float(transform.get("y", 0.0)))))
		var extent = Vector2i(maxi(1, int(round(float(track.cell[0]) * scale_factor))), maxi(1, int(round(float(track.cell[1]) * scale_factor))))
		bounds = bounds.merge(Rect2i(origin, extent))
		positions[track.atlas] = origin
	body_origin = -bounds.position
	var result = Image.create(bounds.size.x, bounds.size.y, false, Image.FORMAT_RGBA8)
	result.fill(Color.TRANSPARENT)
	for role in ["back", "body", "front"]:
		if role == "body":
			result.blend_rect(body, Rect2i(Vector2i.ZERO, body.get_size()), body_origin)
		elif tracks.has(role):
			var image = wing_frame(tracks[role], scale_factor)
			if image != null:
				result.blend_rect(image, Rect2i(Vector2i.ZERO, image.get_size()), body_origin + positions[tracks[role].atlas])
			elif not missing_parts.has("wing"):
				missing_parts.append("wing")
	return result

func export_image(path: String) -> Error:
	var result = current_image.duplicate()
	if flipped:
		result.flip_x()
	return result.save_png(path)

func preset() -> Dictionary:
	return {"version":1, "sex":sex, "equipment":selected.duplicate(), "visible":visible_parts.duplicate(),
		"mode":mode, "action":action, "flipped":flipped, "raw_overrides":raw_overrides.duplicate(), "wing_transforms":wing_transforms.duplicate(true), "aura":aura_state.duplicate(true), "modular_appearance":modular_appearance.duplicate(true)}

func apply_preset(value: Dictionary) -> bool:
	var modular = value.get("modular_appearance",{})
	if not modular is Dictionary or (not modular.is_empty() and (value.get("sex","") != "m" or value.get("mode","show") != "show" or not modular_library().valid(modular))):
		return false
	if value.get("version", 0) != 1 or value.get("sex", "") not in ["m", "f"] or not value.get("equipment", {}) is Dictionary:
		return false
	if not value.get("visible", {}) is Dictionary or not value.get("raw_overrides", {}) is Dictionary:
		return false
	var aura = value.get("aura", AuraRules.DEFAULTS)
	if not AuraRules.valid(aura):
		return false
	var transforms = value.get("wing_transforms", WING_DEFAULTS)
	if not transforms is Dictionary:
		return false
	for render_mode in transforms:
		if render_mode not in ["show", "game"] or not transforms[render_mode] is Dictionary:
			return false
		for field in transforms[render_mode]:
			if field not in ["x", "y", "scale"] or not (transforms[render_mode][field] is float or transforms[render_mode][field] is int):
				return false
			var amount = float(transforms[render_mode][field])
			if not is_finite(amount) or (field == "scale" and (amount < 0.25 or amount > 3.0)) or (field != "scale" and absf(amount) > 500):
				return false
	if value.get("mode", "show") not in ["show", "game"] or value.get("action", "STAND") not in ["STAND", "WALK", "SHOT", "THROWS", "HIT", "HANDCLIP", "CRY"]:
		return false
	for slot in value.equipment:
		var id = value.equipment[slot]
		if not id is float and not id is int:
			return false
		var item = store.equipment_by_id.get(int(id), {})
		if item.get("slot", "") != slot or item.get("sex", "any") not in [value.sex, "any"] or not item.get("renderable", false):
			return false
	sex = value.sex
	selected = value.equipment.duplicate()
	visible_parts = value.get("visible", {}).duplicate()
	raw_overrides = value.get("raw_overrides", {}).duplicate()
	mode = value.get("mode", "show")
	action = value.get("action", "STAND")
	flipped = value.get("flipped", false)
	wing_transforms = transforms.duplicate(true)
	aura_state = aura.duplicate(true)
	modular_appearance = modular.duplicate(true)
	refresh()
	return true

func aura_levels() -> Dictionary:
	var equipment = selected.duplicate()
	if not modular_appearance.is_empty():
		equipment.cloth = true
		if modular_library().find("head",modular_appearance).is_empty():
			equipment.erase("head")
		else:
			equipment.head = true
	return AuraRules.evaluate(aura_state, equipment)

func aura_tracks() -> Dictionary:
	var levels = aura_levels()
	var result = {}
	for role in ["circle", "body"]:
		var level = int(levels[role])
		if level == 0 or not aura_state.visible[role] or (role == "body" and not levels.body_allowed):
			continue
		# There is no original tier-4 SWF. Lab uses a violet variant of tier 3.
		var track = store.auras.get(role, {}).get(str(level), {})
		if not track.is_empty() and track.get("visible", false):
			result[role] = track
	return result

func aura_transform(role: String) -> Dictionary:
	# Portrait anchors expand the client's 120x165 display into 250x342.
	# Battle placement is a Lab adaptation; the source evidence is ShowCharacter.
	var base_scale = 250.0 / 120.0 if mode == "show" else 0.7
	var anchor = Vector2(47,65) * base_scale if role == "circle" else Vector2(45,126) * base_scale
	if mode == "game":
		anchor = Vector2(54,42) if role == "circle" else Vector2(54,78)
	var adjustment = aura_state.transforms.get(mode, {}).get(role, {})
	var variant_scale = 1.1 if int(aura_levels()[role]) == 4 else 1.0
	return {"x":anchor.x + float(adjustment.get("x",0.0)), "y":anchor.y + float(adjustment.get("y",0.0)),
		"scale":base_scale * float(adjustment.get("scale",1.0)) * variant_scale}

func aura_frame(role: String, track: Dictionary, scale_factor: float) -> Image:
	var index = int(aura_ticks[role]) % int(track.frames)
	var key = str(track.atlas) + ":" + str(index) + ":" + str(scale_factor)
	if aura_image_cache.has(key):
		return aura_image_cache[key]
	var sheet = store.get_baked_image(track.atlas)
	if sheet == null:
		return null
	var cell = Vector2i(int(track.cell[0]),int(track.cell[1]))
	var image = sheet.get_region(Rect2i(Vector2i(index % int(track.columns) * cell.x, int(index / int(track.columns)) * cell.y), cell))
	image.resize(maxi(1,int(round(cell.x * scale_factor))),maxi(1,int(round(cell.y * scale_factor))),Image.INTERPOLATE_LANCZOS)
	if aura_image_cache.size() >= 64:
		aura_image_cache.erase(aura_image_cache.keys()[0])
	aura_image_cache[key] = image
	return image

func combine_auras(body_with_wings: Image) -> Image:
	var tracks = aura_tracks()
	if tracks.is_empty():
		return body_with_wings
	# Existing wing bounds are expressed relative to the original body origin.
	var old_origin = body_origin
	var character_offset = modular_library().aura_character_offset() if mode == "show" and not modular_appearance.is_empty() else Vector2i.ZERO
	var bounds = Rect2i(character_offset-old_origin,body_with_wings.get_size())
	var positions = {}
	var images = {}
	for role in tracks:
		var track = tracks[role]
		var transform = aura_transform(role)
		var position = Vector2i(int(round(float(track.origin[0]) * transform.scale + transform.x)), int(round(float(track.origin[1]) * transform.scale + transform.y)))
		var extent = Vector2i(maxi(1,int(round(float(track.cell[0]) * transform.scale))),maxi(1,int(round(float(track.cell[1]) * transform.scale))))
		bounds = bounds.merge(Rect2i(position,extent))
		positions[role] = position
		images[role] = aura_frame(role,track,transform.scale)
	var effect_origin = -bounds.position
	body_origin = effect_origin+character_offset
	var result = Image.create(bounds.size.x,bounds.size.y,false,Image.FORMAT_RGBA8)
	result.fill(Color.TRANSPARENT)
	for role in ["circle","character","body"]:
		if role == "character":
			result.blend_rect(body_with_wings,Rect2i(Vector2i.ZERO,body_with_wings.get_size()),body_origin - old_origin)
		elif images.get(role) != null:
			result.blend_rect(images[role],Rect2i(Vector2i.ZERO,images[role].get_size()),effect_origin + positions[role])
	return result

func _draw() -> void:
	if draw_stage:
		draw_rect(Rect2(Vector2.ZERO, size), Color("e7edf0"))
		draw_circle(Vector2(size.x * 0.5, size.y * 0.46), minf(size.x, size.y) * 0.37, Color("d5e1e3"))
		for x in range(0, int(size.x), 32):
			draw_line(Vector2(x, 0), Vector2(x, size.y), Color(0.5, 0.65, 0.67, 0.08))
		for y in range(0, int(size.y), 32):
			draw_line(Vector2(0, y), Vector2(size.x, y), Color(0.5, 0.65, 0.67, 0.08))
	if current_texture == null:
		return
	var factor = minf((size.x - 36) / current_texture.get_width(), (size.y - 42) / current_texture.get_height())
	if mode == "game":
		factor = minf(3.8, factor)
	factor *= zoom
	var draw_size = current_texture.get_size() * factor
	var bottom = body_bottom + body_origin.y
	var origin = Vector2((size.x - draw_size.x) * 0.5, size.y * 0.88 - bottom * factor)
	if draw_size.y <= size.y - 36:
		origin.y = clampf(origin.y, 18.0, size.y - draw_size.y - 18.0)
	if draw_stage:
		draw_ellipse_shadow(Vector2(size.x * 0.5, origin.y + bottom * factor), Vector2(102, 17))
	if flipped:
		draw_set_transform(Vector2(size.x, 0), 0, Vector2(-1, 1))
	draw_texture_rect(current_texture, Rect2(origin, draw_size), false)
	draw_set_transform(Vector2.ZERO)

func draw_ellipse_shadow(center: Vector2, radius: Vector2) -> void:
	var polygon = PackedVector2Array()
	for index in range(40):
		var angle = TAU * index / 40.0
		polygon.append(center + Vector2(cos(angle), sin(angle)) * radius)
	draw_colored_polygon(polygon, Color(0.13, 0.25, 0.27, 0.13))

extends PanelContainer

signal closed

const Preview = preload("res://scripts/aura_preview.gd")
const Composer = preload("res://scripts/character_composer.gd")
const UPGRADE_LABELS = ["+0–4","+5–8","+9–11","+12","+13 / +14 · Lab","≥ +15 / Gold"]

var store
var previews: Array = []
var textures: Dictionary = {}
var body_texture: Texture2D
var body_bottom: float = 312.0
var pause_button: Button
var character_toggle: CheckBox
var background_toggle: CheckBox
var playing: bool = true
var body_character
var compact: bool = false

func make_label(text: String, font_size: int = 14, color: String = "dce6ef") -> Label:
	var node = Label.new()
	node.text = text
	node.add_theme_font_size_override("font_size",font_size)
	node.add_theme_color_override("font_color",Color(color))
	if compact:
		node.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	return node

func style(fill: String, border: String, padding: int = 8) -> StyleBoxFlat:
	var box = StyleBoxFlat.new()
	box.bg_color = Color(fill)
	box.border_color = Color(border)
	box.set_border_width_all(1)
	box.set_corner_radius_all(10)
	box.content_margin_left = padding
	box.content_margin_right = padding
	box.content_margin_top = padding
	box.content_margin_bottom = padding
	return box

func setup(asset_store) -> void:
	store = asset_store
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_theme_stylebox_override("panel",style("0b1420","27384b",12 if compact else 22))
	var layout = VBoxContainer.new()
	layout.add_theme_constant_override("separation",10)
	add_child(layout)
	var header = HBoxContainer.new()
	layout.add_child(header)
	var titles = VBoxContainer.new()
	titles.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	titles.add_theme_constant_override("separation",4)
	header.add_child(titles)
	titles.add_child(make_label("ออร่าทุกระดับ" if compact else "คลังออร่า · เปรียบเทียบทุกระดับ",20 if compact else 28,"eff7f6"))
	titles.add_child(make_label("วงพลังอาวุธ / ออร่าหมวกและเสื้อ" if compact else "วงพลังอาวุธและออร่าตัวละคร แสดงพร้อมกันในหน้าเดียว",12 if compact else 14,"91a8b9"))
	var back = Button.new()
	back.text = "กลับ" if compact else "กลับไปแต่งตัว"
	back.pressed.connect(func(): closed.emit())
	header.add_child(back)
	var toolbar = HBoxContainer.new()
	layout.add_child(toolbar)
	pause_button = Button.new()
	pause_button.text = "หยุดแอนิเมชัน"
	pause_button.custom_minimum_size.x = 150
	pause_button.pressed.connect(func(): set_playing(not playing))
	toolbar.add_child(pause_button)
	character_toggle = CheckBox.new()
	character_toggle.text = "แสดงตัวละคร"
	character_toggle.button_pressed = true
	character_toggle.toggled.connect(set_character_visible)
	toolbar.add_child(character_toggle)
	background_toggle = CheckBox.new()
	background_toggle.text = "พื้นหลังสว่าง"
	background_toggle.toggled.connect(set_light_background)
	toolbar.add_child(background_toggle)
	var hint = make_label("ใช้ชุดปัจจุบัน · จุดยึดและขนาดเดียวกันทุกขั้น",13,"91a8b9")
	hint.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	if not compact:
		toolbar.add_child(hint)
	else:
		hint.free()
	for role in ["circle","body"]:
		layout.add_child(make_label("วงพลังอาวุธ · ด้านหลังตัวละคร" if role == "circle" else "ออร่าจากหมวก / เสื้อ · ด้านหน้าตัวละคร",17,"a7dccb"))
		var grid = GridContainer.new()
		grid.columns = 6
		grid.size_flags_vertical = Control.SIZE_EXPAND_FILL
		grid.size_flags_stretch_ratio = 1.0
		grid.add_theme_constant_override("h_separation",10)
		layout.add_child(grid)
		for tier in range(6):
			add_card(grid,role,tier)
	var note = make_label("ขั้น 4 เป็นแบบ Lab: ภาพขั้น 3 ปรับสีม่วงและขยาย 10% · ต้นฉบับ 4.0 ไม่มี SWF ขั้น 4",13,"c5b4f3")
	layout.add_child(note)
	layout.add_child(make_label("ตัวอย่าง Totem ระดับ 10 · ซ่อนปีกเพื่อดูออร่าชัด · ออร่าด้านหน้าเล่นช่วงที่บันทึกไว้แล้ววนซ้ำ",13,"91a8b9"))

func add_card(grid: GridContainer, role: String, tier: int) -> void:
	var card = PanelContainer.new()
	card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	card.size_flags_vertical = Control.SIZE_EXPAND_FILL
	card.add_theme_stylebox_override("panel",style("142031","7660ab" if tier == 4 else "2b3d50"))
	grid.add_child(card)
	var content = VBoxContainer.new()
	content.add_theme_constant_override("separation",5)
	card.add_child(content)
	var title = make_label("ไม่มีออร่า" if tier == 0 else "ขั้น %d" % tier,18,"c5b4f3" if tier == 4 else "eff7f6")
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(title)
	var upgrade = make_label(UPGRADE_LABELS[tier],13,"c5b4f3" if tier == 4 else "91a8b9")
	upgrade.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	if compact:
		upgrade.custom_minimum_size.y = 40
		upgrade.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	content.add_child(upgrade)
	var preview = Preview.new()
	preview.role = role
	preview.tier = tier
	preview.mouse_filter = Control.MOUSE_FILTER_IGNORE
	preview.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	preview.size_flags_vertical = Control.SIZE_EXPAND_FILL
	preview.custom_minimum_size = Vector2(40,80) if compact else Vector2(100,140)
	if tier > 0:
		preview.track = store.auras.get(role,{}).get(str(tier),{})
		if not preview.track.is_empty():
			var path = str(preview.track.atlas)
			if not textures.has(path):
				var sheet = store.get_baked_image(path)
				if sheet != null:
					textures[path] = ImageTexture.create_from_image(sheet)
			preview.effect_texture = textures.get(path)
			card.tooltip_text = str(preview.track.get("source","")) + ("\nแบบดัดแปลงสำหรับ Lab" if tier == 4 else "")
			if not preview.track.get("loop_exact",true):
				card.tooltip_text += "\nแสดงช่วงแอนิเมชันที่บันทึกไว้แล้ววนซ้ำ"
	content.add_child(preview)
	previews.append(preview)

func show_outfit(preset: Dictionary) -> void:
	# A snapshot for comparison: browsing never changes the user's outfit or power.
	var snapshot = preset.duplicate(true)
	snapshot.mode = "show"
	snapshot.action = "STAND"
	snapshot.flipped = false
	snapshot.equipment.erase("wing")
	snapshot.aura = Composer.AuraRules.DEFAULTS.duplicate(true)
	var character = Composer.new()
	character.modular_motion = "stand"
	character.setup(store)
	character.playing = false
	character.apply_preset(snapshot)
	body_texture = character.current_texture
	body_bottom = character.body_bottom
	if body_character != null:
		body_character.free()
		body_character = null
	if snapshot.get("modular_appearance",{}).is_empty():
		character.free()
	else:
		body_character = character
		add_child(character)
		character.hide()
		character.playing = playing
		character.set_process(playing)
	for preview in previews:
		preview.body_texture = body_texture
		preview.body_bottom = body_bottom
		preview.character_offset = Vector2.ZERO if body_character == null else Vector2(body_character.modular_library().aura_character_offset())
		preview.queue_redraw()
	process_mode = Node.PROCESS_MODE_INHERIT
	show()
	pause_button.grab_focus()

func _process(_delta: float) -> void:
	if body_character != null and body_character.current_texture != body_texture:
		body_texture = body_character.current_texture
		body_bottom = body_character.body_bottom
		for preview in previews:
			preview.body_texture = body_texture
			preview.body_bottom = body_bottom
			preview.queue_redraw()

func _unhandled_key_input(event: InputEvent) -> void:
	if visible and event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
		closed.emit()
		get_viewport().set_input_as_handled()

func set_playing(value: bool) -> void:
	playing = value
	pause_button.text = "หยุดแอนิเมชัน" if value else "เล่นแอนิเมชัน"
	for preview in previews:
		preview.playing = value
	if body_character != null:
		body_character.playing = value
		body_character.set_process(value)

func set_character_visible(value: bool) -> void:
	for preview in previews:
		preview.show_character = value
		preview.queue_redraw()

func set_light_background(value: bool) -> void:
	for preview in previews:
		preview.light_background = value
		preview.queue_redraw()

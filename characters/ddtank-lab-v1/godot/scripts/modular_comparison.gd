extends Control

const Composer = preload("res://scripts/character_composer.gd")
const Bag = preload("res://scripts/bag_preview.gd")
const Gallery = preload("res://scripts/aura_gallery.gd")
var store
var sources: Array = []
var bags: Array = []
var galleries: Array = []
var portraits: Array = []
var hosts: Array = []
var panes: Array = []
var pickers: Dictionary = {}
var view: String = "bag"
var playing: bool = true
var power: SpinBox
var weapon: SpinBox
var mode_picker: OptionButton
var display_picker: OptionButton
var play_button: Button

func title(value: String, font_size: int = 16) -> Label:
	var label = Label.new()
	label.text = value
	label.add_theme_font_size_override("font_size",font_size)
	return label

func setup(asset_store) -> void:
	store = asset_store
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	var background = ColorRect.new()
	background.color = Color("0b1420")
	background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	background.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(background)
	var margin = MarginContainer.new()
	margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	for edge in ["left","right","top","bottom"]:
		margin.add_theme_constant_override("margin_"+edge,14)
	add_child(margin)
	var layout = VBoxContainer.new()
	margin.add_child(layout)
	layout.add_child(title("ตัวละครเรา × DDTank 4.0 · Bag Preview + Aura Gallery",24))
	var toolbar = HBoxContainer.new()
	layout.add_child(toolbar)
	for pair in [["bag","Bag Preview"],["gallery","Aura Gallery"],["portrait","เทียบตัวละครขนาดใหญ่"]]:
		var button = Button.new()
		button.text = pair[1]
		button.pressed.connect(func(): show_view(pair[0]))
		toolbar.add_child(button)
	display_picker = OptionButton.new()
	display_picker.add_item("เทียบคู่")
	display_picker.add_item("แสดงเฉพาะตัวเรา")
	display_picker.item_selected.connect(func(index): panes[0].visible = index == 0)
	toolbar.add_child(display_picker)
	play_button = Button.new()
	play_button.text = "หยุดภาพทั้งคู่"
	play_button.pressed.connect(func(): set_playing(not playing))
	toolbar.add_child(play_button)
	toolbar.add_child(title("อาวุธ"))
	weapon = SpinBox.new()
	weapon.max_value = 30
	weapon.prefix = "+"
	weapon.value = 9
	weapon.value_changed.connect(func(_value): update_power())
	toolbar.add_child(weapon)
	toolbar.add_child(title("เสื้อ"))
	power = SpinBox.new()
	power.max_value = 30
	power.prefix = "+"
	power.value = 12
	power.value_changed.connect(func(_value): update_power())
	toolbar.add_child(power)
	mode_picker = OptionButton.new()
	mode_picker.add_item("4.0 เดิม")
	mode_picker.add_item("Lab · มีขั้น 4")
	mode_picker.item_selected.connect(func(_index): update_power())
	toolbar.add_child(mode_picker)
	var clothing = HBoxContainer.new()
	layout.add_child(clothing)
	clothing.add_child(title("ตัวเรา:"))
	for index in range(2):
		var source = Composer.new()
		add_child(source)
		source.setup(store)
		source.hide()
		source.set_process(false)
		if index == 1:
			source.set_modular_appearance(source.modular_library().catalog.defaults)
		sources.append(source)
	for slot in ["cloth","hair","face","eff","head"]:
		var picker = OptionButton.new()
		picker.add_item({"cloth":"ชุดเริ่มต้น","hair":"ผมเริ่มต้น","face":"ตาเริ่มต้น","eff":"ไม่ใส่ใบหน้า","head":"ไม่ใส่หมวก"}[slot])
		for entry in sources[1].modular_library().catalog[slot]:
			picker.add_item(entry.label)
		picker.item_selected.connect(func(index): change_custom(slot,index))
		clothing.add_child(picker)
		pickers[slot] = picker
	var columns = HBoxContainer.new()
	columns.size_flags_vertical = Control.SIZE_EXPAND_FILL
	layout.add_child(columns)
	for index in range(2):
		var pane = VBoxContainer.new()
		pane.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		columns.add_child(pane)
		panes.append(pane)
		pane.add_child(title("DDTank 4.0 · ชิ้นส่วนต้นฉบับ" if index == 0 else "ตัวเรา · หัวมาตรฐาน / ชุด / ผม / ชุดดวงตา",18))
		var host = Control.new()
		host.size_flags_vertical = Control.SIZE_EXPAND_FILL
		pane.add_child(host)
		hosts.append(host)
		var bag = Bag.new()
		host.add_child(bag)
		bag.setup(store,sources[index])
		bag.closed.connect(func(): show_view("portrait"))
		bag.gallery_requested.connect(func(): show_view("gallery"))
		bag.aura_requested.connect(func(): show_view("portrait"))
		bags.append(bag)
		var portrait = Composer.new()
		host.add_child(portrait)
		portrait.setup(store)
		portrait.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		portraits.append(portrait)
		portrait.hide()
		portrait.set_process(false)
		sources[index].changed.connect(func(): source_changed(index))
	layout.add_child(title("พื้นที่ประกอบ 250 × 342 ร่วมกัน · ใช้ atlas ออร่า 4.0 และจุดยึดเดิม · ขั้น 4 เป็นภาพ Lab ดัดแปลง · ตัวเราเดินซ้ายล่าง 8 เฟรม",13))
	update_power()
	show_view("bag")
	if "--modular-comparison-test" in OS.get_cmdline_user_args():
		call_deferred("smoke_test")

func change_custom(slot: String, index: int) -> void:
	var appearance = sources[1].modular_appearance.duplicate()
	appearance[slot] = "" if index == 0 else sources[1].modular_library().catalog[slot][index-1].id
	sources[1].set_modular_appearance(appearance)

func source_changed(index: int) -> void:
	if view == "bag" and bags.size() == 2:
		# Reset effect clocks together for a fair comparison. Walk phase is retained.
		bags[1-index].sync()
	elif view == "gallery" and galleries.size() == 2:
		galleries[index].show_outfit(sources[index].preset())
	elif view == "portrait":
		for portrait_index in range(2):
			portraits[portrait_index].apply_preset(sources[portrait_index].preset())
			portraits[portrait_index].playing = playing
	if index == 1:
		for slot in pickers:
			var selected = str(sources[1].modular_appearance.get(slot,""))
			var selected_index = 0
			var entries = sources[1].modular_library().catalog[slot]
			for entry_index in range(entries.size()):
				if entries[entry_index].id == selected:
					selected_index = entry_index+1
			pickers[slot].select(selected_index)

func update_power() -> void:
	if sources.size() != 2:
		return
	for source in sources:
		source.aura_state.rule = "original" if mode_picker.selected == 0 else "lab"
		source.aura_state.levels = {"arm":int(weapon.value),"head":0,"cloth":int(power.value)}
		source.aura_state.totem_level = 10
		source.refresh()

func show_view(next: String) -> void:
	view = next
	if view == "gallery" and galleries.is_empty():
		for index in range(2):
			var gallery = Gallery.new()
			gallery.compact = true
			if index == 1:
				gallery.textures = galleries[0].textures
			hosts[index].add_child(gallery)
			gallery.setup(store)
			gallery.closed.connect(func(): show_view("bag"))
			galleries.append(gallery)
	for index in range(2):
		bags[index].visible = view == "bag"
		bags[index].process_mode = Node.PROCESS_MODE_INHERIT if view == "bag" else Node.PROCESS_MODE_DISABLED
		portraits[index].visible = view == "portrait"
		portraits[index].set_process(view == "portrait")
		if view == "bag":
			bags[index].show_outfit()
		elif view == "portrait":
			portraits[index].apply_preset(sources[index].preset())
			portraits[index].playing = playing
		if not galleries.is_empty():
			galleries[index].visible = view == "gallery"
			galleries[index].process_mode = Node.PROCESS_MODE_INHERIT if view == "gallery" else Node.PROCESS_MODE_DISABLED
			if view == "gallery":
				galleries[index].show_outfit(sources[index].preset())
				galleries[index].set_playing(playing)

func set_playing(value: bool) -> void:
	playing = value
	play_button.text = "หยุดภาพทั้งคู่" if value else "เล่นภาพทั้งคู่"
	for index in range(2):
		sources[index].playing = value
		bags[index].preview.playing = value
		bags[index].play_button.text = "หยุดภาพ" if value else "เล่นภาพ"
		portraits[index].playing = value
		if galleries.size() == 2:
			galleries[index].set_playing(value)

func capture(path: String) -> void:
	await get_tree().process_frame
	await RenderingServer.frame_post_draw
	get_viewport().get_texture().get_image().save_png(path)

func smoke_test() -> void:
	var output = ProjectSettings.globalize_path("res://tests/screenshots")
	await get_tree().create_timer(.4).timeout
	assert(bags[1].entries.size() == 9)
	assert(bags[1].entries.filter(func(entry): return entry.slot == "face").size() == 2)
	assert(bags[1].entries.all(func(entry): return entry.pic != "ours_face_3"))
	for entry in bags[1].entries:
		var data = sources[1].modular_library().find(entry.slot,{entry.slot:entry.pic})
		assert(data.icon.width == 78 and data.icon.height == 78)
		if entry.slot in ["hair","face","eff"]:
			assert(data.icon_preview_layers == ["base_head",entry.slot])
	assert(bags[1].preview.aura_levels().nimbus == 302)
	assert(bags[0].preview.aura_levels().nimbus == 302)
	assert(is_equal_approx(bags[0].preview.position.x,159.0))
	assert(is_equal_approx(bags[1].preview.position.x+bags[1].preview.portrait_anchor_x(),244.0))
	assert(is_equal_approx(bags[1].preview.standard_head_center_x,125.0))
	var registration_offset = sources[1].modular_library().aura_character_offset()
	assert(registration_offset == Vector2i(-27,0))
	assert(absf(125.0+registration_offset.x-bags[1].preview.aura_transform("circle").x) < 0.5)
	assert(absf(120.5+registration_offset.x-bags[1].preview.aura_transform("body").x) < 0.5)
	print("BAG ALIGNMENT: custom character shifted -27px relative to native auras; head/circle and feet/red-aura axes agree within 0.5px")
	# Effect bounds and mirroring must not pull the head away from the frame center.
	var centered_outfit = bags[1].preview.preset()
	for level in [0,9,12,15]:
		bags[1].preview.aura_state.levels = {"arm":level,"head":0,"cloth":level}
		for mirror in [false,true]:
			bags[1].preview.flipped = mirror
			bags[1].preview.refresh()
			assert(is_equal_approx(bags[1].preview.position.x+bags[1].preview.portrait_anchor_x(),244.0))
	assert(bags[1].preview.apply_preset(centered_outfit))
	var before = bags[1].preview.modular_frame
	await get_tree().create_timer(.2).timeout
	assert(bags[1].preview.modular_frame == before,"Bag preview must stand, not walk")
	assert(bags[1].preview.modular_motion == "stand")
	set_playing(false)
	before = bags[1].preview.modular_frame
	change_custom("cloth",2)
	assert(bags[1].preview.modular_appearance.cloth == "ours_cloth_2")
	assert(bags[1].preview.modular_frame == before)
	assert(bags[1].preview.aura_ticks == bags[0].preview.aura_ticks)
	var inventory_index = bags[1].entries.find(bags[1].entries.filter(func(entry): return entry.pic == "ours_hair_4")[0])
	bags[1].inventory_buttons[inventory_index].button.pressed.emit()
	assert(sources[1].modular_appearance.hair == "ours_hair_4" and bags[1].preview.modular_appearance.hair == "ours_hair_4")
	assert(bags[1].preview.modular_frame == before)
	sources[1].unequip("hair")
	assert(sources[1].uses_default("hair") and not sources[1].modular_appearance.is_empty())
	assert(sources[1].modular_library().find("hair",sources[1].modular_appearance).id == "ours_hair_1")
	var saved = sources[1].preset()
	assert(bags[1].preview.apply_preset(saved))
	assert(bags[1].preview.preset() == saved)
	change_custom("cloth",1)
	await capture(output.path_join("modular-bag-comparison.png"))
	display_picker.select(1)
	display_picker.item_selected.emit(1)
	await capture(output.path_join("modular-bag-standing.png"))
	bags[1].preview.current_image.save_png(output.path_join("modular-aura-alignment.png"))
	display_picker.select(0)
	display_picker.item_selected.emit(0)
	show_view("portrait")
	set_playing(true)
	before = portraits[1].modular_frame
	await get_tree().create_timer(.2).timeout
	assert(portraits[1].modular_frame != before,"The walking demo must still walk")
	set_playing(false)
	await capture(output.path_join("modular-portrait-comparison.png"))
	show_view("gallery")
	assert(galleries.size() == 2 and galleries[1].previews.size() == 12)
	assert(galleries[1].body_character != null)
	for card in galleries[1].previews:
		assert(card.character_offset == Vector2(registration_offset))
	for card in galleries[0].previews:
		assert(card.character_offset == Vector2.ZERO)
	set_playing(true)
	before = galleries[1].body_character.modular_frame
	await get_tree().create_timer(.2).timeout
	assert(galleries[1].body_character.modular_frame == before,"Aura gallery uses a standing portrait")
	set_playing(false)
	for gallery in galleries:
		gallery.set_light_background(true)
	await capture(output.path_join("modular-aura-comparison.png"))
	show_view("bag")
	set_playing(false)
	before = bags[1].preview.modular_frame
	var blinks = bags[1].preview.blink_count
	bags[1].preview.blink_closed = false
	bags[1].preview.blink_wait = .05
	await get_tree().create_timer(.1).timeout
	assert(bags[1].preview.blink_count > blinks and bags[1].preview.blink_closed)
	assert(bags[1].preview.modular_frame == before)
	await get_tree().create_timer(.2).timeout
	assert(not bags[1].preview.blink_closed)
	print("MODULAR COMPARISON PASS: standing Bag/Aura portraits, independent blink, 9 items / 2 open-eye sets, head-composed 78px icons, preserved walking demo, 302 aura rules, presets and 12 gallery tiers")
	get_tree().quit()

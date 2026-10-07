extends Control

signal closed
signal aura_requested
signal gallery_requested

const Character = preload("res://scripts/bag_character.gd")
const DESIGN_SIZE = Vector2(920,575)
const PAGE_SIZE = 48
const SLOTS = {"head":"หมวก","glass":"แว่น","hair":"ผม","eff":"ใบหน้า","cloth":"เสื้อ","face":"ชุดดวงตา","arm":"อาวุธ","suits":"ชุดเต็มตัว","wing":"ปีก"}
const EQUIP_CELLS = [
	["head",30,88,"หมวก"],["glass",82,88,"แว่น"],["hair",30,139,"ผม"],["eff",82,139,"หน้า"],
	["cloth",30,191,"เสื้อ"],["face",82,191,"ดวงตา"],["arm",137,271,"อาวุธ"],
	["bracelet1",316,89,"กำไล"],["bracelet2",316,140,"กำไล"],["ring1",369,89,"แหวน"],["ring2",369,140,"แหวน"],
	["suits",30,242,"ชุด"],["necklace",316,191,"สร้อย"],["decoration",82,242,"ประดับ"],["wing",369,190,"ปีก"],
	["secondary",199,271,"มือรอง"],["bubble",316,241,"ฟองคำพูด"],["pet",261,271,"สัตว์เลี้ยง"],["support",369,241,"ช่วยเหลือ"]]

var store
var source_composer
var preview
var canvas: Control
var ui: Dictionary = {}
var textures: Dictionary = {}
var equipment_buttons: Dictionary = {}
var hide_controls: Dictionary = {}
var inventory_buttons: Array = []
var entries: Array = []
var page: int = 0
var category: OptionButton
var search: LineEdit
var pagination: Label
var previous_button: Button
var next_button: Button
var item_detail: Label
var power_label: Label
var play_button: Button
var sorted_by_id: bool = false
var ready_ui: bool = false
var last_sex: String = ""

func texture(symbol: String) -> Texture2D:
	if textures.has(symbol):
		return textures[symbol]
	var entry = ui.get("symbols",{}).get(symbol,{})
	var image = store.get_baked_image(str(entry.get("path","")))
	if image == null:
		return null
	textures[symbol] = ImageTexture.create_from_image(image)
	return textures[symbol]

func place(node: Control, rect: Rect2) -> void:
	canvas.add_child(node)
	node.position = rect.position
	node.size = rect.size

func picture(symbol: String, rect: Rect2) -> TextureRect:
	var image = TextureRect.new()
	image.texture = texture(symbol)
	image.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	image.stretch_mode = TextureRect.STRETCH_SCALE
	image.mouse_filter = Control.MOUSE_FILTER_IGNORE
	place(image,rect)
	return image

func text(value: String, rect: Rect2, font_size: int = 14, color: String = "fff2cd", centered: bool = false) -> Label:
	var label = Label.new()
	label.text = value
	label.add_theme_font_size_override("font_size",font_size)
	label.add_theme_color_override("font_color",Color(color))
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER if centered else HORIZONTAL_ALIGNMENT_LEFT
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	place(label,rect)
	return label

func flat_style(fill: String, border: String = "b89450", radius: int = 4) -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(fill)
	style.border_color = Color(border)
	style.set_border_width_all(1)
	style.set_corner_radius_all(radius)
	style.content_margin_left = 5
	style.content_margin_right = 5
	return style

func patch(rect: Rect2, color: String) -> void:
	var background = ColorRect.new()
	background.color = Color(color)
	background.mouse_filter = Control.MOUSE_FILTER_IGNORE
	place(background,rect)

func skin(name: String, rect: Rect2) -> void:
	var entry = ui.get("skins",{}).get(name,{})
	var image = store.get_baked_image(str(entry.get("path","")))
	if image == null:
		return
	var panel = NinePatchRect.new()
	panel.texture = ImageTexture.create_from_image(image)
	panel.patch_margin_left = int(entry.margins[0])
	panel.patch_margin_top = int(entry.margins[1])
	panel.patch_margin_right = int(entry.margins[2])
	panel.patch_margin_bottom = int(entry.margins[3])
	panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	place(panel,rect)

func action_button(caption: String, rect: Rect2, callback: Callable, fill: String = "79471d") -> Button:
	var button = Button.new()
	button.text = caption
	button.add_theme_font_size_override("font_size",13)
	for state in ["normal","hover","pressed","disabled"]:
		button.add_theme_stylebox_override(state,flat_style("a36625" if state in ["hover","pressed"] else fill))
	button.pressed.connect(callback)
	place(button,rect)
	return button

func top_tab(caption: String, symbol: String, rect: Rect2, callback: Callable) -> void:
	var button = TextureButton.new()
	button.texture_normal = texture(symbol)
	button.texture_hover = texture(symbol)
	button.ignore_texture_size = true
	button.stretch_mode = TextureButton.STRETCH_SCALE
	button.pressed.connect(callback)
	place(button,rect)
	# Localized text covers only the original Chinese title; border and icon remain.
	var background = ColorRect.new()
	background.color = Color("764014")
	background.position = Vector2(30,5)
	background.size = Vector2(rect.size.x-36,rect.size.y-10)
	background.mouse_filter = Control.MOUSE_FILTER_IGNORE
	button.add_child(background)
	var label = Label.new()
	label.text = caption
	label.position = background.position
	label.size = background.size
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.add_theme_font_size_override("font_size",13)
	label.add_theme_color_override("font_color",Color("fff2d5"))
	label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	button.add_child(label)

func setup(asset_store, character) -> void:
	store = asset_store
	source_composer = character
	ui = store.read_json("res://data/bag-ui.json",{})
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_STOP
	canvas = Control.new()
	add_child(canvas)
	canvas.size = DESIGN_SIZE
	skin("wood-frame",Rect2(Vector2.ZERO,DESIGN_SIZE))
	text("กระเป๋าและข้อมูลตัวละคร",Rect2(25,9,400,25),18,"ffe9b4")
	var close = TextureButton.new()
	close.texture_normal = texture("asset.ui.btn_close1")
	close.texture_hover = texture("asset.ui.btn_close2")
	close.ignore_texture_size = true
	close.stretch_mode = TextureButton.STRETCH_SCALE
	close.pressed.connect(func(): closed.emit())
	place(close,Rect2(857,7,47,31))
	top_tab("ข้อมูล","asset.infoBtn2",Rect2(25,45,105,38),func(): item_detail.text = "ข้อมูลตัวละคร · ใช้ชุดที่สวมอยู่ใน Lab")
	top_tab("ตีบวก","asset.texpBtn1",Rect2(136,45,105,38),func(): aura_requested.emit())
	top_tab("คลังออร่า","asset.totemBtn1",Rect2(247,45,116,38),func(): gallery_requested.emit())
	top_tab("แต่งตัว","asset.giftBtn1",Rect2(369,45,105,38),func(): closed.emit())
	text("คลังอุปกรณ์ทดลอง",Rect2(500,51,380,24),18,"ffe5a6")
	picture("bagAndInfo.info.personalInfoBgAsset",Rect2(22,104,439,450))
	skin("bag-frame",Rect2(476,104,422,450))
	patch(Rect2(34,104,160,26),"593718")
	text("ข้อมูลตัวละคร",Rect2(39,104,152,25),17)
	patch(Rect2(46,144,384,18),"634414")
	text("ชื่อ: ตัวละครทดลอง",Rect2(54,143,300,20),13,"fff0b5")
	patch(Rect2(47,162,377,27),"edb348")
	text("ชุดจาก Lab",Rect2(55,161,300,20),13,"4b2e0e")
	preview = Character.new()
	canvas.add_child(preview)
	preview.setup(store)
	preview.modular_motion = "stand"
	preview.custom_minimum_size = Vector2.ZERO
	preview.position = Vector2(159,190)
	preview.size = Vector2(175,177)
	# Center the standard head between the left and right equipment columns.
	preview.center_portrait_at((22+82+46+22+316)*0.5)
	preview.draw_stage = false
	for cell in EQUIP_CELLS:
		add_equipment_cell(cell)
	build_stats()
	build_inventory()
	build_visibility()
	text("หน้าทดลอง · ค่าสถานะและเงินยังไม่เชื่อมข้อมูลผู้เล่น",Rect2(30,543,690,19),11,"ffe3a5")
	play_button = action_button("หยุดภาพ",Rect2(743,9,100,25),func():
		source_composer.playing = not source_composer.playing
		preview.playing = source_composer.playing
		play_button.text = "หยุดภาพ" if preview.playing else "เล่นภาพ")
	source_composer.changed.connect(sync)
	resized.connect(fit_window)
	ready_ui = true
	sync()
	fit_window()

func add_equipment_cell(cell: Array) -> void:
	var button = TextureButton.new()
	button.texture_normal = texture("asset.core.EquipCellBG")
	button.texture_hover = texture("bagAndInfo.cell.bagCellOverBgAsset")
	button.ignore_texture_size = true
	button.stretch_mode = TextureButton.STRETCH_SCALE
	var slot = str(cell[0])
	button.tooltip_text = str(cell[3])
	place(button,Rect2(22+int(cell[1]),104+int(cell[2]),46,46))
	var paper = ColorRect.new()
	paper.color = Color("e3e1c5")
	paper.position = Vector2.ONE
	paper.size = Vector2(44,44)
	paper.mouse_filter = Control.MOUSE_FILTER_IGNORE
	button.add_child(paper)
	var icon = TextureRect.new()
	icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	icon.position = Vector2(3,2)
	icon.size = Vector2(40,34)
	icon.mouse_filter = Control.MOUSE_FILTER_IGNORE
	button.add_child(icon)
	var name = Label.new()
	name.text = str(cell[3])
	name.position = Vector2(0,27)
	name.size = Vector2(46,18)
	name.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	name.add_theme_font_size_override("font_size",9)
	name.add_theme_color_override("font_color",Color("544b34"))
	name.mouse_filter = Control.MOUSE_FILTER_IGNORE
	button.add_child(name)
	var upgrade = Label.new()
	upgrade.position = Vector2(2,0)
	upgrade.size = Vector2(42,15)
	upgrade.add_theme_font_size_override("font_size",10)
	upgrade.add_theme_color_override("font_color",Color("ffef59"))
	upgrade.add_theme_color_override("font_outline_color",Color("3b2409"))
	upgrade.add_theme_constant_override("outline_size",3)
	upgrade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	button.add_child(upgrade)
	if slot in SLOTS:
		button.pressed.connect(func(): category.select(SLOTS.keys().find(slot)+1); search.text = ""; filter_inventory())
		button.gui_input.connect(func(event):
			if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_RIGHT:
				source_composer.unequip(slot))
	else:
		button.disabled = true
		button.tooltip_text += " · ช่องแสดงตัวอย่าง"
	equipment_buttons[slot] = {"button":button,"icon":icon,"upgrade":upgrade}

func build_stats() -> void:
	patch(Rect2(44,422,300,24),"edeccd")
	text("Lv —",Rect2(48,422,68,23),14,"5b3917")
	text("พลังต่อสู้",Rect2(199,422,92,23),13,"7c3212")
	text("—",Rect2(287,422,51,23),14,"5b3917",true)
	patch(Rect2(44,450,399,87),"766223")
	var titles = ["โจมตี","ว่องไว","ป้องกัน","โชค"]
	for index in range(4):
		var x = 49+index%2*112
		var y = 464+int(index/2)*36
		text(titles[index],Rect2(x,y,44,24),12)
		var value = text("—",Rect2(x+45,y+2,57,21),14,"4b381d",true)
		value.add_theme_stylebox_override("normal",flat_style("e9dfc5","b99c6b"))
	for index in range(4):
		var y = 461+index*19
		text(["ดาเมจ","เกราะ","เลือด","พลังงาน"][index],Rect2(278,y,57,18),11)
		var value = text("—",Rect2(337,y+1,101,16),12,"ffffff",true)
		value.add_theme_stylebox_override("normal",flat_style(["d49119","168abd","d63131","68ad15"][index],"e3d59a"))

func build_visibility() -> void:
	patch(Rect2(341,387,103,52),"e5e4c8")
	for index in range(4):
		var slot = ["head","glass","suits","wing"][index]
		var toggle = CheckBox.new()
		toggle.text = {"head":"หมวก","glass":"แว่น","suits":"ชุด","wing":"ปีก"}[slot]
		toggle.position = Vector2(339+index%2*54,388+int(index/2)*22)
		toggle.size = Vector2(54,21)
		toggle.add_theme_font_size_override("font_size",10)
		toggle.add_theme_color_override("font_color",Color("5c4729"))
		for color in ["font_pressed_color","font_hover_color","font_hover_pressed_color"]:
			toggle.add_theme_color_override(color,Color("5c4729"))
		for state in ["normal","hover","pressed","hover_pressed"]:
			toggle.add_theme_stylebox_override(state,StyleBoxEmpty.new())
		canvas.add_child(toggle)
		toggle.toggled.connect(func(value): source_composer.visible_parts[slot] = value; source_composer.refresh())
		hide_controls[slot] = toggle
	power_label = text("",Rect2(158,364,177,15),10,"624c1f",true)
	power_label.tooltip_text = "ขั้นออร่าจากค่าตีบวก · วงพลังอาวุธ / ออร่าหมวกและเสื้อ"

func build_inventory() -> void:
	action_button("จัดเรียง",Rect2(489,117,75,25),func(): sorted_by_id = not sorted_by_id; filter_inventory())
	category = OptionButton.new()
	category.add_item("ทุกหมวด")
	for slot in SLOTS:
		category.add_item(SLOTS[slot])
	category.add_theme_font_size_override("font_size",12)
	for state in ["normal","hover","pressed"]:
		category.add_theme_stylebox_override(state,flat_style("a16829" if state != "normal" else "81531f","ddbb74"))
	place(category,Rect2(570,117,117,25))
	category.item_selected.connect(func(_index): filter_inventory())
	search = LineEdit.new()
	search.placeholder_text = "ค้นหา / ID"
	search.clear_button_enabled = true
	search.add_theme_font_size_override("font_size",12)
	search.add_theme_color_override("font_color",Color("5a3b1a"))
	search.add_theme_color_override("font_placeholder_color",Color("8b7450"))
	search.add_theme_color_override("caret_color",Color("5a3b1a"))
	search.add_theme_stylebox_override("normal",flat_style("fff1cc","997749"))
	search.add_theme_stylebox_override("focus",flat_style("fff1cc","dfb156"))
	place(search,Rect2(694,117,123,25))
	search.text_changed.connect(func(_query): filter_inventory())
	for index in range(PAGE_SIZE):
		var button = TextureButton.new()
		button.texture_normal = texture("bagAndInfo.cell.bagCellBgAsset")
		button.texture_hover = texture("bagAndInfo.cell.bagCellOverBgAsset")
		button.ignore_texture_size = true
		button.stretch_mode = TextureButton.STRETCH_SCALE
		place(button,Rect2(489+index%7*47,151+int(index/7)*47,46,46))
		var icon = TextureRect.new()
		icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		icon.position = Vector2(3,3)
		icon.size = Vector2(40,40)
		icon.mouse_filter = Control.MOUSE_FILTER_IGNORE
		button.add_child(icon)
		button.pressed.connect(func(): equip_index(index))
		inventory_buttons.append({"button":button,"icon":icon})
	next_button = action_button("»",Rect2(771,433,46,46),func(): page += 1; render_inventory(),"a07020")
	next_button.add_theme_font_size_override("font_size",32)
	next_button.tooltip_text = "หน้าถัดไป"
	var tab = picture("bagAndInfo.bag.equipTabAsset1",Rect2(835,151,46,132))
	# Keep the original vertical tab shape and replace its baked title.
	patch(Rect2(842,173,31,96),"925516")
	text("อุ\nป\nก\nร\nณ์",Rect2(842,172,31,99),14,"ffedba",true)
	tab.tooltip_text = "คลังอุปกรณ์ที่มีภาพตัวละคร"
	picture("bagAndInfo.bag.bagMoneyInfo",Rect2(488,489,330,64))
	for rect in [Rect2(523,493,60,20),Rect2(651,493,60,20),Rect2(523,521,60,20),Rect2(651,521,60,20)]:
		text("—",rect,14,"ffffff")
	previous_button = action_button("« กลับ",Rect2(834,489,49,24),func(): page -= 1; render_inventory())
	pagination = text("",Rect2(827,519,65,21),11,"ffedba",true)
	item_detail = text("คลิกไอเท็มเพื่อสวมใส่",Rect2(487,83,408,19),11,"ffe5ad")

func fit_window() -> void:
	if canvas == null:
		return
	var factor = minf((size.x-70)/DESIGN_SIZE.x,(size.y-80)/DESIGN_SIZE.y)
	canvas.scale = Vector2.ONE*maxf(0.1,factor)
	canvas.position = (size-DESIGN_SIZE*factor)*0.5
	queue_redraw()

func show_outfit() -> void:
	process_mode = Node.PROCESS_MODE_INHERIT
	show()
	sync()
	search.grab_focus()

func sync() -> void:
	if not ready_ui or not visible:
		return
	var outfit = source_composer.preset()
	outfit.mode = "show"
	outfit.action = "STAND"
	preview.apply_preset(outfit)
	preview.playing = source_composer.playing
	play_button.text = "หยุดภาพ" if preview.playing else "เล่นภาพ"
	var appearance = source_composer.appearance_equipment()
	for slot in equipment_buttons:
		var cell = equipment_buttons[slot]
		var item = store.equipment_by_id.get(int(appearance.get(slot,0)),{})
		cell.icon.texture = store.thumbnail(str(item.get("icon","")))
		if not source_composer.modular_appearance.is_empty() and slot in source_composer.ModularCharacter.SLOTS:
			var entry = source_composer.modular_library().find(slot,source_composer.modular_appearance)
			cell.icon.texture = null
			item = {}
			if not entry.is_empty():
				item = {"pic":entry.id}
				cell.icon.texture = source_composer.modular_library().thumbnail({"slot":slot,"pic":entry.id})
		cell.button.tooltip_text = SLOTS.get(slot,cell.button.tooltip_text) + (" · " + str(item.get("pic","")) if not item.is_empty() else "")
		if slot in SLOTS:
			cell.button.tooltip_text += (" · ค่าเริ่มต้น" if source_composer.uses_default(slot) else "") + "\nคลิกขวา: ถอด / กลับเป็นค่าเริ่มต้น"
		cell.upgrade.text = ""
		if slot in ["head","cloth","arm"] and source_composer.selected.has(slot):
			cell.upgrade.text = "Gold" if source_composer.aura_state.gold[slot] else "+%d" % int(source_composer.aura_state.levels[slot]) if int(source_composer.aura_state.levels[slot]) > 0 else ""
	for slot in hide_controls:
		hide_controls[slot].set_pressed_no_signal(source_composer.visible_parts.get(slot,true))
	var levels = source_composer.aura_levels()
	power_label.text = "ออร่า · วง %d / ตัว %d" % [levels.circle,levels.body]
	var previous_page = page
	filter_inventory()
	if last_sex == source_composer.sex:
		page = previous_page
		render_inventory()
	last_sex = source_composer.sex

func filter_inventory() -> void:
	if not ready_ui:
		return
	var buckets = {}
	for slot in SLOTS:
		buckets[slot] = []
	var query = search.text.strip_edges().to_lower()
	var chosen = SLOTS.keys()[category.selected-1] if category.selected > 0 else ""
	var candidates = store.equipment if source_composer.modular_appearance.is_empty() else source_composer.modular_items()
	for item in candidates:
		if not item.get("renderable",false) or not item.get("show_ready",false) or item.get("sex","any") not in [source_composer.sex,"any"]:
			continue
		if item.slot not in SLOTS or (not chosen.is_empty() and item.slot != chosen):
			continue
		if not query.is_empty() and not (str(item.id)+" "+str(item.name)+" "+str(item.pic)).to_lower().contains(query):
			continue
		if query.is_valid_int() and int(item.id) != int(query):
			continue
		buckets[item.slot].append(item)
	entries.clear()
	var index = 0
	var more = true
	while more:
		more = false
		for bucket in buckets.values():
			if index < bucket.size():
				entries.append(bucket[index])
				more = true
		index += 1
	if sorted_by_id:
		entries.sort_custom(func(a,b): return int(a.id) < int(b.id))
	page = 0
	render_inventory()

func render_inventory() -> void:
	var pages = maxi(1,int(ceil(entries.size()/float(PAGE_SIZE))))
	page = clampi(page,0,pages-1)
	pagination.text = "%d / %d" % [page+1,pages]
	previous_button.disabled = page == 0
	next_button.disabled = page >= pages-1
	for index in range(PAGE_SIZE):
		var cell = inventory_buttons[index]
		var item_index = page*PAGE_SIZE+index
		cell.button.disabled = item_index >= entries.size()
		cell.icon.texture = null
		cell.button.tooltip_text = ""
		if item_index < entries.size():
			var item = entries[item_index]
			cell.icon.texture = source_composer.modular_library().thumbnail(item) if item.get("modular",false) else store.thumbnail(str(item.icon))
			cell.button.tooltip_text = "%s · %s\nID %d · คลิกเพื่อสวมใส่" % [SLOTS[item.slot],item.pic,int(item.id)]

func equip_index(index: int) -> void:
	var item_index = page*PAGE_SIZE+index
	if item_index < 0 or item_index >= entries.size():
		return
	var item = entries[item_index]
	if source_composer.equip(item):
		item_detail.text = "สวม %s · %s · ID %d" % [SLOTS[item.slot],item.pic,int(item.id)]

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO,size),Color(0.02,0.015,0.01,0.82))

func _unhandled_key_input(event: InputEvent) -> void:
	if visible and event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
		closed.emit()
		get_viewport().set_input_as_handled()

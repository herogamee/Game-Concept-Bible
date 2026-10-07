extends Control

var body_texture: Texture2D
var effect_texture: Texture2D
var track: Dictionary = {}
var role: String = "circle"
var tier: int = 0
var elapsed: float = 0.0
var playing: bool = true
var show_character: bool = true
var light_background: bool = false
var body_bottom: float = 312.0
var character_offset: Vector2 = Vector2.ZERO
var frame: int = 0

func _process(delta: float) -> void:
	if not playing or track.is_empty():
		return
	elapsed += delta
	var next_frame = int(floor(elapsed * float(track.fps))) % int(track.frames)
	if next_frame != frame:
		frame = next_frame
		queue_redraw()

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO,size),Color("e7edf0" if light_background else "0d1725"))
	# Every card in the same row uses the same camera and scale.
	var world = Rect2(-132,-100,470,475) if show_character else Rect2(-115,-115,230,230) if role == "circle" else Rect2(-65,-65,130,130)
	var factor = minf((size.x - 16.0)/world.size.x,(size.y - 16.0)/world.size.y)
	if factor <= 0:
		return
	var origin = (size - world.size * factor) * 0.5 - world.position * factor
	if show_character:
		var shadow = PackedVector2Array()
		for index in range(32):
			var angle = TAU * index / 32.0
			shadow.append(origin + (character_offset+Vector2(120,body_bottom) + Vector2(cos(angle)*83,sin(angle)*9))*factor)
		draw_colored_polygon(shadow,Color(0.1,0.2,0.25,0.15) if light_background else Color(0.35,0.55,0.65,0.12))
	if role == "circle":
		draw_effect(origin,factor)
	if show_character and body_texture != null:
		draw_texture_rect(body_texture,Rect2(origin+character_offset*factor,body_texture.get_size()*factor),false)
	if role == "body":
		draw_effect(origin,factor)
	if tier == 0 and not show_character:
		var font = get_theme_default_font()
		var message = "ไม่มีออร่า"
		var width = font.get_string_size(message,HORIZONTAL_ALIGNMENT_LEFT,-1,14).x
		draw_string(font,Vector2((size.x-width)*0.5,size.y*0.5),message,HORIZONTAL_ALIGNMENT_LEFT,-1,14,Color("8096ad"))

func draw_effect(origin: Vector2, factor: float) -> void:
	if effect_texture == null or track.is_empty():
		return
	var scale_factor = 250.0/120.0 if show_character else 1.0
	var anchor = (Vector2(47,65) if role == "circle" else Vector2(45,126))*scale_factor if show_character else Vector2.ZERO
	if tier == 4:
		scale_factor *= 1.1
	var cell = Vector2(float(track.cell[0]),float(track.cell[1]))
	var offset = Vector2(float(track.origin[0]),float(track.origin[1]))*scale_factor + anchor
	var source = Rect2(Vector2(frame % int(track.columns),int(frame / int(track.columns)))*cell,cell)
	draw_texture_rect_region(effect_texture,Rect2(origin+offset*factor,cell*scale_factor*factor),source)

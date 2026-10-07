extends "res://scripts/character_composer.gd"

var portrait_center_x: float = -1.0
var original_position_x: float = 0.0
var standard_head_center_x: float = -1.0

func center_portrait_at(value: float) -> void:
	original_position_x = position.x
	portrait_center_x = value
	align_portrait()
	resized.connect(align_portrait)

func texture_rect() -> Rect2:
	if current_texture == null:
		return Rect2()
	var factor = minf((size.x-4)/current_texture.get_width(),(size.y-4)/current_texture.get_height())
	var draw_size = current_texture.get_size()*maxf(0.0,factor)
	return Rect2((size-draw_size)*0.5,draw_size)

func portrait_anchor_x() -> float:
	var rect = texture_rect()
	# Use the same bare head for every outfit, never the hair/effect bounding box.
	if standard_head_center_x < 0:
		standard_head_center_x = modular_library().standard_head_center_x()
	var factor = rect.size.x/current_texture.get_width()
	var local_x = rect.position.x+(body_origin.x+standard_head_center_x)*factor
	return size.x-local_x if flipped else local_x

func align_portrait() -> void:
	if portrait_center_x < 0 or current_texture == null:
		return
	# Move the whole control so its effect texture remains inside its clip bounds.
	# PNG registration and character-to-aura offsets stay unchanged.
	position.x = original_position_x if modular_appearance.is_empty() else portrait_center_x-portrait_anchor_x()

func rebuild_frame() -> void:
	super.rebuild_frame()
	align_portrait()

# The small paper portrait needs its full effect bounds, without studio padding.
func _draw() -> void:
	if current_texture == null:
		return
	var rect = texture_rect()
	if rect.size.x <= 0:
		return
	if flipped:
		draw_set_transform(Vector2(size.x,0),0,Vector2(-1,1))
	draw_texture_rect(current_texture,rect,false)
	draw_set_transform(Vector2.ZERO)

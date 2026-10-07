extends RefCounted

# These are slot values for the Lab, not modifications to the original inventory.
const DEFAULTS = {"rule":"lab", "levels":{"arm":0,"head":0,"cloth":0},
	"gold":{"arm":false,"head":false,"cloth":false}, "totem_level":10,
	"visible":{"circle":true,"body":true}, "transforms":{"show":{},"game":{}}}

static func tier(level: int, gold: bool, rule: String) -> int:
	if gold or level >= 15:
		return 5
	if level == 12:
		return 3
	if level in [13,14]:
		return 4 if rule == "lab" else 0
	if level >= 9:
		return 2
	return 1 if level >= 5 else 0

static func evaluate(state: Dictionary, equipment: Dictionary) -> Dictionary:
	var tiers = {}
	for slot in ["arm", "head", "cloth"]:
		tiers[slot] = tier(int(state.levels.get(slot, 0)), bool(state.gold.get(slot, false)), state.rule) if equipment.has(slot) else 0
	var body = maxi(tiers.head, tiers.cloth)
	return {"body":body, "circle":tiers.arm, "nimbus":body * 100 + tiers.arm,
		"body_allowed":int(state.totem_level) >= 10}

static func valid(state) -> bool:
	if not state is Dictionary or state.get("rule", "") not in ["lab", "original"]:
		return false
	for field in ["levels", "gold", "visible", "transforms"]:
		if not state.get(field) is Dictionary:
			return false
	if not numeric(state.get("totem_level"), 0, 60):
		return false
	for slot in ["arm", "head", "cloth"]:
		if not numeric(state.levels.get(slot), 0, 30) or not state.gold.get(slot) is bool:
			return false
	for role in ["circle", "body"]:
		if not state.visible.get(role) is bool:
			return false
	for mode in state.transforms:
		if mode not in ["show", "game"] or not state.transforms[mode] is Dictionary:
			return false
		for role in state.transforms[mode]:
			var values = state.transforms[mode][role]
			if role not in ["circle", "body"] or not values is Dictionary:
				return false
			for field in values:
				if field not in ["x", "y", "scale"] or not numeric(values[field], 0.25 if field == "scale" else -500, 3.0 if field == "scale" else 500, false):
					return false
	return true

static func numeric(value, minimum: float, maximum: float, integer: bool = true) -> bool:
	if not (value is int or value is float):
		return false
	var amount = float(value)
	return is_finite(amount) and amount >= minimum and amount <= maximum and (not integer or amount == floor(amount))

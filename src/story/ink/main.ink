// Ink conversations for Ashford.
//
// The game starts each talk at a knot. An actor's `ink` field names it
// (see src/story/characters/*.ts). Tag a line with #who:<actor id> or
// #who:you to change the speaker. The actor you talk to speaks by default.

INCLUDE mara.ink
INCLUDE wren.ink
INCLUDE bryn.ink
INCLUDE veiled.ink
INCLUDE scenes.ink

// Functions the game provides (src/engine/ink.ts).
EXTERNAL flag(name)
EXTERNAL set_flag(name)
EXTERNAL clear_flag(name)
EXTERNAL holds(item)
EXTERNAL give(item)
EXTERNAL take(item)
EXTERNAL coins()
EXTERNAL add_coins(amount)
EXTERNAL reveal(actor)
EXTERNAL cutscene(id)

-> DONE

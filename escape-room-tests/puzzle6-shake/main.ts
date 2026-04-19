/**
 * Escape Room — Puzzle 6: Shake
 *
 * SHAKE = solve the puzzle
 * A     = show roll angle (left/right tilt in degrees)
 * B     = show pitch angle (forward/back tilt in degrees)
 */

let solved = false

radio.setGroup(42)
basic.showString("SHAKE")

input.onGesture(Gesture.Shake, function () {
    if (solved) { return }
    solved = true
    basic.showIcon(IconNames.Yes)
    music.playTone(784, 150)
    music.playTone(988, 150)
    music.playTone(1319, 300)
    radio.sendString("door-open")
})

input.onButtonPressed(Button.A, function () {
    basic.showNumber(input.rotation(Rotation.Roll))
})

input.onButtonPressed(Button.B, function () {
    basic.showNumber(input.rotation(Rotation.Pitch))
})

radio.onReceivedString(function (msg) {
    if (msg == "door-open") {
        basic.showIcon(IconNames.Castle)
        basic.pause(800)
        basic.clearScreen()
    }
    if (msg == "__RESET__") {
        solved = false
        basic.clearScreen()
        basic.showString("RESET")
    }
})

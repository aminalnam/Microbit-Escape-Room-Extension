/**
 * Escape Room — Puzzle 5: Light Sensor
 * Target = light level between 50 and 150
 *
 * A   = show current light level reading
 * A+B = check and submit
 *
 * Cover the sensor with your hand to lower the reading.
 * Shine a torch at it to raise the reading.
 */

let solved = false
let wrongCount = 0

radio.setGroup(42)
basic.showString("L")

input.onButtonPressed(Button.A, function () {
    basic.showNumber(input.lightLevel())
})

input.onButtonPressed(Button.AB, function () {
    if (solved) { return }
    let level = input.lightLevel()
    if (level >= 50 && level <= 150) {
        solved = true
        basic.showIcon(IconNames.Yes)
        music.playTone(784, 150)
        music.playTone(988, 150)
        music.playTone(1319, 300)
        radio.sendString("door-open")
    } else {
        wrongCount += 1
        basic.showIcon(IconNames.No)
        basic.pause(800)
        basic.clearScreen()
        if (wrongCount >= 3) {
            basic.showString("AIM MIDDLE")
        } else {
            basic.showNumber(level)
        }
    }
})

radio.onReceivedString(function (msg) {
    if (msg == "door-open") {
        basic.showIcon(IconNames.Castle)
        basic.pause(800)
        basic.clearScreen()
    }
    if (msg == "__RESET__") {
        solved = false
        wrongCount = 0
        basic.clearScreen()
        basic.showString("RESET")
    }
})

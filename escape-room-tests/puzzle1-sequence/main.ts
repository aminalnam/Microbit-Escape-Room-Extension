/**
 * Escape Room — Puzzle 1: Button Sequence
 * Secret = A, B, A
 *
 * A   = press A in sequence
 * B   = press B in sequence
 * A+B = request hint (10 second cooldown)
 */

let solved = false
let locked = false
let seq: string[] = []
let hintReady = true
let hintTimer = 0
let hintCount = 0

radio.setGroup(42)
basic.showString("GO")

input.onButtonPressed(Button.A, function () {
    if (locked || solved) { return }
    seq.push("A")
    if (seq.length > 3) { seq.shift() }
    led.plot(0, 0)
    basic.pause(80)
    led.unplot(0, 0)
    checkSequence()
})

input.onButtonPressed(Button.B, function () {
    if (locked || solved) { return }
    seq.push("B")
    if (seq.length > 3) { seq.shift() }
    led.plot(4, 0)
    basic.pause(80)
    led.unplot(4, 0)
    checkSequence()
})

input.onButtonPressed(Button.AB, function () {
    if (hintReady) {
        hintCount += 1
        hintReady = false
        hintTimer = 0
        if (hintCount == 1) {
            basic.showString("PRESS BUTTONS")
        } else if (hintCount == 2) {
            basic.showString("3 PRESSES")
        } else {
            basic.showString("A B A")
        }
    } else {
        basic.showNumber(10 - hintTimer)
    }
})

function checkSequence() {
    if (seq.length < 3) { return }
    if (seq[0] == "A" && seq[1] == "B" && seq[2] == "A") {
        solved = true
        basic.showIcon(IconNames.Yes)
        music.playTone(784, 150)
        music.playTone(988, 150)
        music.playTone(1319, 300)
        radio.sendString("door-open")
    }
}

radio.onReceivedString(function (msg) {
    if (msg == "door-open") {
        basic.showIcon(IconNames.Castle)
        basic.pause(800)
        basic.clearScreen()
    }
    if (msg == "__RESET__") {
        solved = false
        locked = false
        seq = []
        hintReady = true
        hintTimer = 0
        hintCount = 0
        basic.clearScreen()
        basic.showString("RESET")
    }
})

basic.forever(function () {
    if (!hintReady) {
        hintTimer += 1
        if (hintTimer >= 10) {
            hintReady = true
            hintTimer = 0
        }
    }
    basic.pause(1000)
})

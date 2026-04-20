/**
 * Escape Room — Puzzle 2: PIN Entry
 * Secret PIN = 3, 7, 2
 *
 * A   = cycle current digit up (0 → 9 → 0)
 * B   = confirm current digit
 * A+B = submit full PIN
 */

let solved = false
let locked = false
let digit = 0
let entered: number[] = []
let wrongCount = 0
let secret = [3, 7, 2]

radio.setGroup(42)
basic.showNumber(0)

input.onButtonPressed(Button.A, function () {
    if (locked || solved) { return }
    digit = (digit + 1) % 10
    basic.showNumber(digit)
})

input.onButtonPressed(Button.B, function () {
    if (locked || solved) { return }
    entered.push(digit)
    digit = 0
    basic.showNumber(entered.length)
    basic.pause(400)
    basic.clearScreen()
})

input.onButtonPressed(Button.AB, function () {
    if (locked || solved) { return }
    if (entered.length != secret.length) {
        basic.showString("NEED 3")
        return
    }
    let match = true
    for (let i = 0; i < secret.length; i++) {
        if (entered[i] != secret[i]) {
            match = false
        }
    }
    if (match) {
        solved = true
        basic.showIcon(IconNames.Yes)
        music.playTone(784, 150)
        music.playTone(988, 150)
        music.playTone(1319, 300)
        radio.sendString("door-open")
    } else {
        wrongCount += 1
        locked = true
        basic.showIcon(IconNames.No)
        music.playTone(220, 500)
        basic.pause(3000)
        locked = false
        entered = []
        digit = 0
        basic.clearScreen()
        if (wrongCount >= 3) {
            basic.showString("HINT 3 7 2")
        } else {
            basic.showNumber(3 - wrongCount)
            basic.showString("LEFT")
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
        locked = false
        entered = []
        digit = 0
        wrongCount = 0
        basic.clearScreen()
        basic.showNumber(0)
    }
})

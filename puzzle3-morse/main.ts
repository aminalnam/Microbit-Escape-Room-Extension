/**
 * Escape Room — Puzzle 3: Morse Code
 * Secret word = SOS
 *
 * A   = dot  ( . )
 * B   = dash ( - )
 * A+B = confirm current letter
 *
 * S = ...   O = ---   S = ...
 */

let solved = false
let morseBuffer = ""
let decoded = ""
let target = "SOS"

radio.setGroup(42)
basic.showString(".")

function morseToChar(code: string): string {
    if (code == ".-") { return "A" }
    if (code == "-...") { return "B" }
    if (code == "-.-.") { return "C" }
    if (code == "-..") { return "D" }
    if (code == ".") { return "E" }
    if (code == "..-.") { return "F" }
    if (code == "--.") { return "G" }
    if (code == "....") { return "H" }
    if (code == "..") { return "I" }
    if (code == ".---") { return "J" }
    if (code == "-.-") { return "K" }
    if (code == ".-..") { return "L" }
    if (code == "--") { return "M" }
    if (code == "-.") { return "N" }
    if (code == "---") { return "O" }
    if (code == ".--.") { return "P" }
    if (code == "--.-") { return "Q" }
    if (code == ".-.") { return "R" }
    if (code == "...") { return "S" }
    if (code == "-") { return "T" }
    if (code == "..-") { return "U" }
    if (code == "...-") { return "V" }
    if (code == ".--") { return "W" }
    if (code == "-..-") { return "X" }
    if (code == "-.--") { return "Y" }
    if (code == "--..") { return "Z" }
    return "?"
}

input.onButtonPressed(Button.A, function () {
    if (solved) { return }
    morseBuffer += "."
    led.plot(2, 2)
    basic.pause(80)
    led.unplot(2, 2)
})

input.onButtonPressed(Button.B, function () {
    if (solved) { return }
    morseBuffer += "-"
    led.plot(1, 2)
    led.plot(2, 2)
    led.plot(3, 2)
    basic.pause(80)
    led.unplot(1, 2)
    led.unplot(2, 2)
    led.unplot(3, 2)
})

input.onButtonPressed(Button.AB, function () {
    if (solved) { return }
    let ch = morseToChar(morseBuffer)
    decoded += ch
    morseBuffer = ""
    basic.showString(ch)
    basic.pause(300)
    basic.showString(decoded.length + "/" + target.length)
    basic.pause(400)
    basic.clearScreen()
    if (decoded == target) {
        solved = true
        basic.showIcon(IconNames.Yes)
        music.playTone(784, 150)
        music.playTone(988, 150)
        music.playTone(1319, 300)
        radio.sendString("door-open")
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
        morseBuffer = ""
        decoded = ""
        basic.clearScreen()
        basic.showString("RESET")
    }
})

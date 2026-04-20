/**
 * Escape Room — Puzzle 4: LED Pattern
 * Secret shape = letter T
 *
 * Pattern flashes for 2 seconds at startup — memorise it!
 *
 * A   = move cursor to next LED
 * B   = toggle LED on/off at cursor
 * A+B = submit your pattern
 *
 * T shape:
 * # # # # #
 * . . # . .
 * . . # . .
 * . . # . .
 * . . # . .
 */

let solved = false
let cursor = 0
let grid: number[] = []
let tgt: number[] = []

function buildTarget() {
    tgt = []
    let t = "1111100100001000010000100"
    for (let i = 0; i < 25; i++) {
        if (t.charAt(i) == "1") {
            tgt.push(1)
        } else {
            tgt.push(0)
        }
    }
}

function buildGrid() {
    grid = []
    for (let i = 0; i < 25; i++) {
        grid.push(0)
    }
}

function renderGrid() {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (grid[row * 5 + col] == 1) {
                led.plot(col, row)
            } else {
                led.unplot(col, row)
            }
        }
    }
    led.plot(cursor % 5, Math.floor(cursor / 5))
}

function flashTarget() {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (tgt[row * 5 + col] == 1) {
                led.plot(col, row)
            } else {
                led.unplot(col, row)
            }
        }
    }
}

function checkMatch(): boolean {
    for (let i = 0; i < 25; i++) {
        if (grid[i] != tgt[i]) { return false }
    }
    return true
}

buildTarget()
buildGrid()
radio.setGroup(42)
flashTarget()
basic.pause(2000)
basic.clearScreen()
basic.pause(300)
renderGrid()

input.onButtonPressed(Button.A, function () {
    if (solved) { return }
    cursor = (cursor + 1) % 25
    renderGrid()
})

input.onButtonPressed(Button.B, function () {
    if (solved) { return }
    if (grid[cursor] == 0) {
        grid[cursor] = 1
    } else {
        grid[cursor] = 0
    }
    renderGrid()
})

input.onButtonPressed(Button.AB, function () {
    if (solved) { return }
    if (checkMatch()) {
        solved = true
        basic.showIcon(IconNames.Yes)
        music.playTone(784, 150)
        music.playTone(988, 150)
        music.playTone(1319, 300)
        radio.sendString("door-open")
    } else {
        basic.showIcon(IconNames.No)
        music.playTone(220, 400)
        basic.pause(1200)
        basic.clearScreen()
        flashTarget()
        basic.pause(1500)
        basic.clearScreen()
        basic.pause(300)
        buildGrid()
        cursor = 0
        renderGrid()
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
        buildGrid()
        cursor = 0
        basic.clearScreen()
        flashTarget()
        basic.pause(2000)
        basic.clearScreen()
        basic.pause(300)
        renderGrid()
    }
})

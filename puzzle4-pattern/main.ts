let grid: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
let cursor = 0

function drawGrid() {
    basic.clearScreen()
    for (let i = 0; i < 25; i++) {
        if (grid[i] == 1) {
            led.plot(i % 5, Math.idiv(i, 5))
        }
    }
    led.plotBrightness(cursor % 5, Math.idiv(cursor, 5), 255)
}

input.onButtonPressed(Button.A, function () {
    cursor += 1
    if (cursor > 24) {
        cursor = 0
    }
    drawGrid()
})

input.onButtonPressed(Button.B, function () {
    grid[cursor] = 1 - grid[cursor]
    drawGrid()
})

input.onButtonPressed(Button.AB, function () {
    let correct = true

    let target = [1,1,1,0,0,
                  0,1,0,0,0,
                  0,1,0,0,0,
                  0,1,0,0,0,
                  0,1,0,0,0]

    for (let i = 0; i < 25; i++) {
        if (grid[i] != target[i]) {
            correct = false
        }
    }

    if (correct) {
        basic.showIcon(IconNames.Yes)
        radio.sendString("door-open")
    } else {
        basic.showIcon(IconNames.No)
    }
})
let pin: number[] = []
let current = 0
let secretPin = "372"

input.onButtonPressed(Button.A, function () {
    current += 1
    if (current > 9) {
        current = 0
    }
    basic.showNumber(current)
})

input.onButtonPressed(Button.B, function () {
    pin.push(current)
    basic.showIcon(IconNames.SmallDiamond)
})

input.onButtonPressed(Button.AB, function () {
    if (pin.join("") == secretPin) {
        basic.showIcon(IconNames.Yes)
        radio.sendString("door-open")
    } else {
        basic.showIcon(IconNames.No)
    }
    pin = []
})
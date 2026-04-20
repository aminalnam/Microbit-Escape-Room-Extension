input.onButtonPressed(Button.A, function () {
    basic.showNumber(input.lightLevel())
})

input.onButtonPressed(Button.AB, function () {
    let level = input.lightLevel()

    if (level >= 50 && level <= 150) {
        basic.showIcon(IconNames.Yes)
        radio.sendString("door-open")
    } else {
        basic.showIcon(IconNames.No)
    }
})
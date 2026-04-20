input.onGesture(Gesture.Shake, function () {
    basic.showIcon(IconNames.Yes)
    radio.sendString("door-open")
})

input.onButtonPressed(Button.A, function () {
    basic.showNumber(input.rotation(Rotation.Roll))
})

input.onButtonPressed(Button.B, function () {
    basic.showNumber(input.rotation(Rotation.Pitch))
})
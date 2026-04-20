escapeRoom.setGroup(42)
let pin = ""

input.onButtonPressed(Button.A, function () {
    pin += "1"
})

input.onButtonPressed(Button.B, function () {
    pin += "2"
})

input.onButtonPressed(Button.AB, function () {
    if (pin == "121") {
        basic.showIcon(IconNames.Yes)
        escapeRoom.sendDoorOpen()
    } else {
        basic.showIcon(IconNames.No)
    }
    pin = ""
})

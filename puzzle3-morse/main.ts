escapeRoom.setGroup(42)
let code = ""

input.onButtonPressed(Button.A, function () {
    code += "."
})

input.onButtonPressed(Button.B, function () {
    code += "-"
})

input.onButtonPressed(Button.AB, function () {
    if (code == "...---...") {
        basic.showIcon(IconNames.Yes)
        escapeRoom.sendDoorOpen()
    } else {
        basic.showIcon(IconNames.No)
    }
    code = ""
})

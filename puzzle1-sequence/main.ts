escapeRoom.setGroup(42)
let sequence = ""
let solved = false

input.onButtonPressed(Button.A, function () {
    if (solved) return
    sequence += "A"
})

input.onButtonPressed(Button.B, function () {
    if (solved) return
    sequence += "B"
})

input.onButtonPressed(Button.AB, function () {
    if (solved) return
    if (sequence == "ABA") {
        basic.showIcon(IconNames.Yes)
        escapeRoom.sendDoorOpen()
        solved = true
    } else {
        basic.showIcon(IconNames.No)
    }
    sequence = ""
})

escapeRoom.onDoorOpen(function () {
    basic.showIcon(IconNames.Happy)
})

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    escapeRoom.resetAll()
})

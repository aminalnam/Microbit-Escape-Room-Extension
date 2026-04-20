escapeRoom.setGroup(42)
basic.showString("T")

input.onButtonPressed(Button.AB, function () {
    basic.showIcon(IconNames.Yes)
    escapeRoom.sendDoorOpen()
})

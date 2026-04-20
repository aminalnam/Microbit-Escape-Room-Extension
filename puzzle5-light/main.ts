escapeRoom.setGroup(42)

input.onButtonPressed(Button.AB, function () {
    let level = input.lightLevel()
    if (level > 50 && level < 150) {
        basic.showIcon(IconNames.Yes)
        escapeRoom.sendDoorOpen()
    } else {
        basic.showIcon(IconNames.No)
    }
})

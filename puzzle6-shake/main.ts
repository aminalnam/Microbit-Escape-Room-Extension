escapeRoom.setGroup(42)

input.onGesture(Gesture.Shake, function () {
    basic.showIcon(IconNames.Yes)
    escapeRoom.sendDoorOpen()
})

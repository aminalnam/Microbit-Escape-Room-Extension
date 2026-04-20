let sequence: string[] = []
let secret = "ABA"

input.onButtonPressed(Button.A, function () {
    sequence.push("A")
    checkSequence()
})

input.onButtonPressed(Button.B, function () {
    sequence.push("B")
    checkSequence()
})

function checkSequence() {
    if (sequence.length == 3) {
        if (sequence.join("") == secret) {
            basic.showIcon(IconNames.Yes)
            radio.sendString("door-open")
        } else {
            basic.showIcon(IconNames.No)
        }
        sequence = []
    }
}
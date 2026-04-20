let currentLetter = ""
let message = ""
let secret = "SOS"

input.onButtonPressed(Button.A, function () {
    currentLetter += "."
    basic.showString(".")
})

input.onButtonPressed(Button.B, function () {
    currentLetter += "-"
    basic.showString("-")
})

input.onButtonPressed(Button.AB, function () {
    let letter = ""

    if (currentLetter == "...") {
        letter = "S"
    } else if (currentLetter == "---") {
        letter = "O"
    }

    message += letter
    currentLetter = ""

    if (message.length == 3) {
        if (message == secret) {
            basic.showIcon(IconNames.Yes)
            radio.sendString("door-open")
        } else {
            basic.showIcon(IconNames.No)
        }
        message = ""
    }
})
// ═══════════════════════════════════════════════════════════
//  PUZZLE 5 — Light Sensor
//
//  Players must get the light level into a target range.
//  This puzzle uses its own button setup:
//    A   = show the current light reading
//    A+B = check and submit
//
//  HOW TO CUSTOMISE:
//    Change 50 and 150 in "light level is between" to set
//    your target range. Press A during testing to see what
//    readings you get in your room.
//
//  HOW IT WORKS:
//    Players cover the sensor (lowers reading) or shine a
//    torch at it (raises reading) to hit the target range.
//    When they press A+B, if in range → correct, else wrong.
// ═══════════════════════════════════════════════════════════

// ── SETUP ────────────────────────────────────────────────────
escapeRoom.allowWrong(0)

escapeRoom.addHint("The sensor is on the front")
escapeRoom.addHint("You need medium brightness")
escapeRoom.addHint("Cover it slightly with your hand")

escapeRoom.timeBetweenHints(20)

escapeRoom.startCountdown(120, function () {
    basic.showString("TIME UP")
    music.playTone(220, 1000)
})

// A = show current reading so players know where they are
input.onButtonPressed(Button.A, function () {
    escapeRoom.showLightLevel()
})

// A+B = check if in range and submit
input.onButtonPressed(Button.AB, function () {

    // Change 50 and 150 to your target range
    if (escapeRoom.lightBetween(50, 150)) {

        // CORRECT — in range
        escapeRoom.showSolved()

    } else {

        // WRONG — out of range
        escapeRoom.wrongAnswer(2)

        if (escapeRoom.outOfGuesses()) {
            basic.showString("AIM FOR MIDDLE")
        }
    }
})

// ═══════════════════════════════════════════════════════════
//  PUZZLE 6 — Compass Direction
//
//  Players must point the micro:bit at a secret direction.
//  This puzzle uses its own button setup:
//    A   = show current compass heading (0–359 degrees)
//    A+B = check and submit
//
//  HOW TO CUSTOMISE:
//    Change 90 to your target bearing (0=N, 90=E, 180=S, 270=W)
//    Change 20 to make it stricter (smaller) or easier (larger)
//
//  NOTE:
//    You may be asked to calibrate the compass when starting.
//    Tilt the micro:bit in circles until calibration finishes.
//
//  HOW IT WORKS:
//    Players rotate the micro:bit (held flat) while pressing A
//    to watch the heading change. When they think they are on
//    target, they press A+B to submit.
// ═══════════════════════════════════════════════════════════

// ── SETUP ────────────────────────────────────────────────────
escapeRoom.allowWrong(0)

escapeRoom.addHint("Use the compass heading")
escapeRoom.addHint("Face where the sun rises")
escapeRoom.addHint("Aim for 90 degrees — East")

escapeRoom.timeBetweenHints(20)

escapeRoom.startCountdown(120, function () {
    basic.showString("TIME UP")
    music.playTone(220, 1000)
})

// A = show current heading so players can navigate
input.onButtonPressed(Button.A, function () {
    escapeRoom.showCompassHeading()
})

// A+B = check heading and submit
input.onButtonPressed(Button.AB, function () {

    // Change 90 to your target bearing, 20 to your tolerance
    if (escapeRoom.compassNear(90, 20)) {

        // CORRECT — pointing the right way
        escapeRoom.showSolved()

    } else {

        // WRONG — wrong direction
        escapeRoom.wrongAnswer(2)

        if (escapeRoom.outOfGuesses()) {
            basic.showString("FACE EAST")
        }
    }
})

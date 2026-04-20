// ═══════════════════════════════════════════════════════════
//  PUZZLE 7 — Shake to Solve
//
//  The simplest puzzle — shake the micro:bit!
//  Great for physical props, hidden triggers, or
//  as a fun final reveal.
//
//  This puzzle uses its own gesture setup:
//    SHAKE = solve
//    A+B   = show a hint
//
//  HOW TO CUSTOMISE:
//    You can change the shake gesture to any of:
//      Gesture.TiltLeft   Gesture.TiltRight
//      Gesture.LogoUp     Gesture.LogoDown
//      Gesture.ScreenUp   Gesture.ScreenDown
//    Replace Gesture.Shake in the code below.
// ═══════════════════════════════════════════════════════════

// ── SETUP ────────────────────────────────────────────────────
escapeRoom.allowWrong(0)

escapeRoom.addHint("Interact with the device")
escapeRoom.addHint("Move it around")
escapeRoom.addHint("SHAKE IT!")

escapeRoom.timeBetweenHints(15)

escapeRoom.startCountdown(60, function () {
    basic.showString("TIME UP")
    music.playTone(220, 1000)
})

// Hint button
input.onButtonPressed(Button.AB, function () {
    escapeRoom.showHint()
})

// Show time left with A
input.onButtonPressed(Button.A, function () {
    escapeRoom.showTimeLeft()
})


// ── THE PUZZLE ───────────────────────────────────────────────
// Change Gesture.Shake to a different gesture if you like
input.onGesture(Gesture.Shake, function () {
    escapeRoom.showSolved()
})

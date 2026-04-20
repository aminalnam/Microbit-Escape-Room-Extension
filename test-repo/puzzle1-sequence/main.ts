// ═══════════════════════════════════════════════════════════
//  PUZZLE 1 — Button Sequence
//
//  Players press A and B buttons in a secret order.
//  This puzzle manages buttons automatically:
//    A   = press A in the sequence
//    B   = press B in the sequence
//    A+B = show a hint
//
//  HOW TO CUSTOMISE:
//    Change the letters in "set secret sequence" to change
//    the secret. Only use "A" or "B" in each slot.
//
//  HOW IT WORKS:
//    After each press, the last 3 presses are checked.
//    If they match the secret  → on sequence correct runs.
//    If 3 presses are wrong    → on sequence wrong runs.
// ═══════════════════════════════════════════════════════════

// ── SETUP ────────────────────────────────────────────────────
// Change "A" "B" "A" to your own secret sequence
escapeRoom.setSecretSequence("A", "B", "A")

// How many wrong guesses before "out of guesses" becomes true
escapeRoom.allowWrong(3)

// Hints are shown when players press A+B
escapeRoom.addHint("Press the buttons in order")
escapeRoom.addHint("One side, then the other, then back")
escapeRoom.addHint("Left, Right, Left")

// How long between hints (seconds)
escapeRoom.timeBetweenHints(20)

// Countdown timer — change 120 to your time in seconds
escapeRoom.startCountdown(120, function () {
    basic.showString("TIME UP")
    music.playTone(220, 1000)
})


// ── ON CORRECT ───────────────────────────────────────────────
// This runs as soon as the player gets the sequence right
escapeRoom.onSequenceCorrect(function () {
    escapeRoom.showSolved()
    // Add anything else here, e.g. trigger a servo or light
})


// ── ON WRONG ─────────────────────────────────────────────────
// This runs each time a wrong sequence is entered
escapeRoom.onSequenceWrong(function () {
    // Lock input for 3 seconds and show a cross
    escapeRoom.wrongAnswer(3)

    // If the player has used all their guesses, reveal the answer
    if (escapeRoom.outOfGuesses()) {
        basic.showString("THE ANSWER IS A B A")
    }
})

// ═══════════════════════════════════════════════════════════
//  PUZZLE 2 — PIN Code Entry
//
//  Players scroll through digits and build a code.
//  This puzzle manages buttons automatically:
//    A   = scroll the current digit up (0 → 1 → ... → 9 → 0)
//    B   = confirm the current digit and move on
//    A+B = submit the full PIN (or show a hint if not done yet)
//
//  HOW TO CUSTOMISE:
//    Change "3 7 2" in "set secret PIN" to any digits
//    separated by spaces. E.g. "1 2 3 4" for a 4-digit PIN.
//
//  HOW IT WORKS:
//    A scrolls up. B locks in the digit (shows count so far).
//    A+B submits when enough digits are entered.
//    If correct → on PIN correct.
//    If wrong   → on PIN wrong (PIN is automatically cleared).
// ═══════════════════════════════════════════════════════════

// ── SETUP ────────────────────────────────────────────────────
// Change "3 7 2" to your secret PIN (digits separated by spaces)
escapeRoom.setSecretPin("3 7 2")

escapeRoom.allowWrong(3)

escapeRoom.addHint("Enter a 3 digit number")
escapeRoom.addHint("All digits are below 8")
escapeRoom.addHint("Three, Seven, Two")

escapeRoom.timeBetweenHints(20)

escapeRoom.startCountdown(120, function () {
    basic.showString("TIME UP")
    music.playTone(220, 1000)
})


// ── ON CORRECT ───────────────────────────────────────────────
escapeRoom.onPinCorrect(function () {
    escapeRoom.showSolved()
})


// ── ON WRONG ─────────────────────────────────────────────────
escapeRoom.onPinWrong(function () {
    escapeRoom.wrongAnswer(3)

    if (escapeRoom.outOfGuesses()) {
        basic.showString("THE PIN IS 3 7 2")
    }
})

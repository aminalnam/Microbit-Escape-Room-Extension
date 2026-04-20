// ═══════════════════════════════════════════════════════════
//  PUZZLE 3 — Morse Code
//
//  Players tap out a word in Morse code.
//  This puzzle manages buttons automatically:
//    A   = dot   ( . )
//    B   = dash  ( - )
//    A+B = confirm the letter you just tapped
//          (if no dots/dashes entered yet, shows a hint)
//
//  HOW TO CUSTOMISE:
//    Change "SOS" in "set secret Morse word" to any word
//    using letters A–Z. Keep it short (3–4 letters works best).
//
//  HOW IT WORKS:
//    Tap A and B to enter dots and dashes.
//    Press A+B to confirm each letter — it shows the letter
//    and your progress (e.g. "2/3").
//    When the full word is correct → on Morse correct.
//    If a wrong letter is confirmed → on Morse wrong,
//    and the attempt resets from the beginning.
//
//  USEFUL MORSE CODES:
//    S = ...      O = ---      H = ....     E = .
//    A = .-       T = -        I = ..       N = -.
// ═══════════════════════════════════════════════════════════

// ── SETUP ────────────────────────────────────────────────────
// Change "SOS" to your secret word (A-Z letters only)
escapeRoom.setSecretMorseWord("SOS")

escapeRoom.allowWrong(5)

escapeRoom.addHint("Tap dots and dashes")
escapeRoom.addHint("S is dot dot dot")
escapeRoom.addHint("SOS = ... --- ...")

escapeRoom.timeBetweenHints(20)

escapeRoom.startCountdown(180, function () {
    basic.showString("TIME UP")
    music.playTone(220, 1000)
})


// ── ON CORRECT ───────────────────────────────────────────────
escapeRoom.onMorseCorrect(function () {
    escapeRoom.showSolved()
})


// ── ON WRONG ─────────────────────────────────────────────────
// A wrong letter was confirmed — attempt resets automatically
escapeRoom.onMorseWrong(function () {
    escapeRoom.wrongAnswer(2)

    if (escapeRoom.outOfGuesses()) {
        basic.showString("SOS = ... --- ...")
    }
})

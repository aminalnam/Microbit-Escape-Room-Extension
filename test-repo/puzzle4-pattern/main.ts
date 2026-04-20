// ═══════════════════════════════════════════════════════════
//  PUZZLE 4 — LED Pattern
//
//  Players watch a pattern flash on screen, then recreate it.
//  This puzzle manages buttons automatically:
//    A   = move the cursor (blinking dot) to the next LED
//    B   = toggle the LED under the cursor on or off
//    A+B = submit your pattern
//
//  HOW TO CUSTOMISE:
//    The secret is a 25-character string of 1s and 0s.
//    1 = LED on, 0 = LED off.
//    Read it left to right, top row first.
//
//    Use the pattern designer below to build your own:
//
//      Row 1 (top):    1 1 1 1 1   = "11111"
//      Row 2:          0 0 1 0 0   = "00100"
//      Row 3:          0 0 1 0 0   = "00100"
//      Row 4:          0 0 1 0 0   = "00100"
//      Row 5 (bottom): 0 0 1 0 0   = "00100"
//      Full string: "1111100100001000010000100"  ← letter T
//
//  HOW IT WORKS:
//    Pattern flashes for 2 seconds — players must memorise it.
//    Then they use A and B to draw the pattern.
//    A+B submits. Wrong guess clears the drawing and flashes
//    the secret again as a reminder.
// ═══════════════════════════════════════════════════════════

// ── SETUP ────────────────────────────────────────────────────
// Change the string below to change the secret shape
// Current shape: letter T
// 1=on, 0=off — 25 characters, top row first, left to right
escapeRoom.setSecretPattern("1111100100001000010000100", 2000)

escapeRoom.allowWrong(0)   // 0 = unlimited attempts

escapeRoom.addHint("Watch the flash carefully")
escapeRoom.addHint("It is a letter shape")
escapeRoom.addHint("It is the letter T")

escapeRoom.timeBetweenHints(20)

escapeRoom.startCountdown(180, function () {
    basic.showString("TIME UP")
    music.playTone(220, 1000)
})


// ── ON CORRECT ───────────────────────────────────────────────
escapeRoom.onPatternCorrect(function () {
    escapeRoom.showSolved()
})


// ── ON WRONG ─────────────────────────────────────────────────
// Drawing is cleared automatically. Flash the secret again.
escapeRoom.onPatternWrong(function () {
    escapeRoom.wrongAnswer(2)
    // Show the secret again so they can try once more
    escapeRoom.reflashPattern(1500)
})

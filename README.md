# micro:bit Escape Room Extension

A MakeCode extension providing puzzle-building blocks for physical escape rooms.

## Add to MakeCode

Extensions → paste your GitHub URL.

## Block Groups

| Group | What it does |
|---|---|
| **Game State** | Lock/unlock, solved flag, master reset |
| **Feedback** | Solved animation, wrong + lockout |
| **Sequence** | Secret button sequences (A/B) |
| **PIN Entry** | Dial-a-digit PIN with A/B |
| **Gesture** | Tilt, shake, and orientation puzzles |
| **Sensors** | Light, temperature, compass ranges |
| **Morse Code** | Dot/dash input matched against a target word |
| **LED Pattern** | Draw and match a 5×5 LED pattern |
| **Timer** | Countdown with progress bar and expiry event |
| **Hints** | Hint queue with cooldown delays |
| **Attempts** | Wrong-attempt counter with max limit |
| **Radio** | Multi-micro:bit events and master reset |

## Quick Example — Sequence Puzzle

```typescript
escapeRoom.setSequenceLength(3)
escapeRoom.recordSecret("A")
escapeRoom.recordSecret("B")
escapeRoom.recordSecret("A")

input.onButtonPressed(Button.A, () => {
    if (escapeRoom.isLocked() || escapeRoom.isSolved()) return
    escapeRoom.playerPress("A")
    if (escapeRoom.sequenceMatches()) {
        escapeRoom.markSolved()
        escapeRoom.showSolved()
        escapeRoom.broadcastEvent("door-open")
    }
})
input.onButtonPressed(Button.B, () => {
    if (escapeRoom.isLocked() || escapeRoom.isSolved()) return
    escapeRoom.playerPress("B")
})
```

## Quick Example — PIN Entry

```typescript
escapeRoom.addPinDigit(3)
escapeRoom.addPinDigit(7)
escapeRoom.addPinDigit(2)

// A = increment digit, B = confirm digit, A+B = submit
input.onButtonPressed(Button.A, () => { escapeRoom.pinIncrement() })
input.onButtonPressed(Button.B, () => { escapeRoom.pinConfirm() })
input.onButtonPressed(Button.AB, () => {
    if (escapeRoom.pinMatches()) {
        escapeRoom.showSolved()
    } else {
        escapeRoom.recordWrongAttempt()
        escapeRoom.showWrongAndLock(3)
        escapeRoom.clearPin()
    }
})
```

## License

MIT

# Escape Room Test Projects

Six standalone MakeCode projects for testing escape room puzzles on micro:bit.
No extension required — each project works on its own.

## How to open a project in MakeCode

1. Go to **makecode.microbit.org**
2. Click **Import** on the home screen
3. Click **Import URL**
4. Paste the GitHub URL for the puzzle folder you want:

| Puzzle | URL to paste |
|--------|-------------|
| 1 — Button Sequence | `https://github.com/YOUR_USERNAME/microbit-escape-room-tests/tree/main/puzzle1-sequence` |
| 2 — PIN Entry | `https://github.com/YOUR_USERNAME/microbit-escape-room-tests/tree/main/puzzle2-pin` |
| 3 — Morse Code | `https://github.com/YOUR_USERNAME/microbit-escape-room-tests/tree/main/puzzle3-morse` |
| 4 — LED Pattern | `https://github.com/YOUR_USERNAME/microbit-escape-room-tests/tree/main/puzzle4-pattern` |
| 5 — Light Sensor | `https://github.com/YOUR_USERNAME/microbit-escape-room-tests/tree/main/puzzle5-light` |
| 6 — Shake | `https://github.com/YOUR_USERNAME/microbit-escape-room-tests/tree/main/puzzle6-shake` |

Replace `YOUR_USERNAME` with your GitHub username.

## Puzzle quick reference

### Puzzle 1 — Button Sequence
Secret: **A, B, A**
- **A** = press A
- **B** = press B
- **A+B** = hint (3 hints, 10s cooldown each)

### Puzzle 2 — PIN Entry
Secret: **3, 7, 2**
- **A** = cycle digit 0→9
- **B** = confirm digit
- **A+B** = submit PIN

### Puzzle 3 — Morse Code
Secret: **SOS**
- **A** = dot (·)
- **B** = dash (−)
- **A+B** = confirm letter
- S = `...`  O = `---`  S = `...`

### Puzzle 4 — LED Pattern
Secret: **letter T shape**
- Pattern flashes for 2s at startup
- **A** = move cursor
- **B** = toggle LED
- **A+B** = submit (wrong = pattern flashes again)

### Puzzle 5 — Light Sensor
Target: **light level 50–150**
- **A** = show current reading
- **A+B** = submit

### Puzzle 6 — Shake
- **SHAKE** = solve
- **A** = show roll angle
- **B** = show pitch angle

## Radio
All puzzles are on radio group **42**.
Solving any puzzle broadcasts `"door-open"` to all others.
Send `"__RESET__"` to reset all micro:bits at once.

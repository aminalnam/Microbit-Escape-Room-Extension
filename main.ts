// ============================================================
//  Escape Room Extension for micro:bit
//
//  Design philosophy:
//    Every puzzle works in two steps:
//      1. Set the secret  (goes in "on start")
//      2. React to events (on correct / on wrong / on timeout)
//
//    Button handling is done inside each puzzle block.
//    Users never wire up button handlers manually.
// ============================================================

//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    // ── shared state ─────────────────────────────────────────
    let _locked = false
    let _solved = false
    let _attempts = 0
    let _maxAttempts = 0

    // ── hint state ───────────────────────────────────────────
    let _hints: string[] = []
    let _hintIndex = 0
    let _hintCooldownEnd = 0
    let _hintDelayMs = 30000

    // ── sequence state ───────────────────────────────────────
    let _seqSecret: string[] = []
    let _seqBuffer: string[] = []
    let _seqLen = 3
    let _onSeqCorrect: () => void = null
    let _onSeqWrong: () => void = null

    // ── pin state ────────────────────────────────────────────
    let _pinSecret: number[] = []
    let _pinEntered: number[] = []
    let _pinCurrentDigit = 0
    let _onPinCorrect: () => void = null
    let _onPinWrong: () => void = null

    // ── morse state ──────────────────────────────────────────
    let _morseSecret = ""
    let _morseBuffer = ""
    let _morseDecoded = ""
    let _onMorseCorrect: () => void = null
    let _onMorseWrong: () => void = null

    // ── pattern state ────────────────────────────────────────
    let _patSecret: number[] = []
    let _patDrawing: number[] = []
    let _patCursor = 0
    let _onPatCorrect: () => void = null
    let _onPatWrong: () => void = null

    // ════════════════════════════════════════════════════════
    //  SEQUENCE PUZZLE
    //
    //  How to use:
    //    1. Put "set secret sequence" in on start
    //    2. Put "on sequence correct" anywhere — runs when solved
    //    3. Put "on sequence wrong"   anywhere — runs on bad guess
    //
    //  Controls (handled automatically):
    //    A   = press A in the sequence
    //    B   = press B in the sequence
    //    A+B = show next hint
    // ════════════════════════════════════════════════════════

    /**
     * Set the secret 3-button sequence players must press.
     * Registers the A and B button handlers automatically.
     * Put this in "on start".
     */
    //% block="set secret sequence %a then %b then %c"
    //% a.defl="A" b.defl="B" c.defl="A"
    //% group="🔢 Sequence Puzzle" weight=100
    //% inlineInputMode=inline
    export function setSecretSequence(a: string, b: string, c: string): void {
        _seqLen = 3
        _seqSecret = [a, b, c]
        _seqBuffer = []

        input.onButtonPressed(Button.A, function () {
            if (_locked || _solved) return
            _seqBuffer.push("A")
            if (_seqBuffer.length > _seqLen) _seqBuffer.shift()
            led.plot(0, 0); basic.pause(60); led.unplot(0, 0)
            _checkSequence()
        })

        input.onButtonPressed(Button.B, function () {
            if (_locked || _solved) return
            _seqBuffer.push("B")
            if (_seqBuffer.length > _seqLen) _seqBuffer.shift()
            led.plot(4, 0); basic.pause(60); led.unplot(4, 0)
            _checkSequence()
        })

        input.onButtonPressed(Button.AB, function () {
            if (!_locked && !_solved) _showHint()
        })
    }

    function _checkSequence(): void {
        if (_seqBuffer.length < _seqLen) return
        let match = true
        for (let i = 0; i < _seqLen; i++) {
            if (_seqBuffer[i] !== _seqSecret[i]) { match = false; break }
        }
        if (match) {
            if (_onSeqCorrect) _onSeqCorrect()
        } else {
            if (_onSeqWrong) _onSeqWrong()
        }
    }

    /**
     * Run this code when the player enters the correct sequence.
     * Put "show solved" inside here.
     */
    //% block="on sequence correct"
    //% group="🔢 Sequence Puzzle" weight=90
    //% blockHandlerKey="seqCorrect"
    export function onSequenceCorrect(handler: () => void): void {
        _onSeqCorrect = handler
    }

    /**
     * Run this code when the player enters a wrong sequence.
     * Put "wrong answer" inside here.
     */
    //% block="on sequence wrong"
    //% group="🔢 Sequence Puzzle" weight=80
    //% blockHandlerKey="seqWrong"
    export function onSequenceWrong(handler: () => void): void {
        _onSeqWrong = handler
    }

    // ════════════════════════════════════════════════════════
    //  PIN PUZZLE
    //
    //  How to use:
    //    1. Put "set secret PIN" in on start
    //    2. Put "on PIN correct" anywhere — runs when solved
    //    3. Put "on PIN wrong"   anywhere — runs on bad guess
    //
    //  Controls (handled automatically):
    //    A   = scroll current digit up (0→9→0)
    //    B   = confirm current digit
    //    A+B = submit the full PIN (or show hint if incomplete)
    // ════════════════════════════════════════════════════════

    /**
     * Set the secret PIN code (e.g. "3 7 2" for PIN 372).
     * Registers the A, B, and A+B button handlers automatically.
     * Put this in "on start".
     */
    //% block="set secret PIN %pin"
    //% pin.defl="3 7 2"
    //% group="🔑 PIN Puzzle" weight=100
    export function setSecretPin(pin: string): void {
        _pinSecret = []
        _pinEntered = []
        _pinCurrentDigit = 0
        let parts = pin.split(" ")
        for (let i = 0; i < parts.length; i++) {
            _pinSecret.push(parseInt(parts[i]))
        }
        basic.showNumber(0)

        input.onButtonPressed(Button.A, function () {
            if (_locked || _solved) return
            _pinCurrentDigit = (_pinCurrentDigit + 1) % 10
            basic.showNumber(_pinCurrentDigit)
        })

        input.onButtonPressed(Button.B, function () {
            if (_locked || _solved) return
            _pinEntered.push(_pinCurrentDigit)
            _pinCurrentDigit = 0
            basic.showString(_pinEntered.length + "/" + _pinSecret.length)
            basic.pause(500)
            basic.clearScreen()
        })

        input.onButtonPressed(Button.AB, function () {
            if (_locked || _solved) return
            // if not enough digits yet, show a hint instead
            if (_pinEntered.length < _pinSecret.length) {
                _showHint()
                return
            }
            let match = true
            for (let i = 0; i < _pinSecret.length; i++) {
                if (_pinEntered[i] !== _pinSecret[i]) { match = false; break }
            }
            _pinEntered = []
            _pinCurrentDigit = 0
            if (match) {
                if (_onPinCorrect) _onPinCorrect()
            } else {
                if (_onPinWrong) _onPinWrong()
            }
        })
    }

    /**
     * Run this code when the player enters the correct PIN.
     */
    //% block="on PIN correct"
    //% group="🔑 PIN Puzzle" weight=90
    //% blockHandlerKey="pinCorrect"
    export function onPinCorrect(handler: () => void): void {
        _onPinCorrect = handler
    }

    /**
     * Run this code when the player enters a wrong PIN.
     */
    //% block="on PIN wrong"
    //% group="🔑 PIN Puzzle" weight=80
    //% blockHandlerKey="pinWrong"
    export function onPinWrong(handler: () => void): void {
        _onPinWrong = handler
    }

    // ════════════════════════════════════════════════════════
    //  MORSE CODE PUZZLE
    //
    //  How to use:
    //    1. Put "set secret Morse word" in on start
    //    2. Put "on Morse correct" anywhere
    //    3. Put "on Morse wrong"   anywhere
    //
    //  Controls (handled automatically):
    //    A   = dot  ( . )
    //    B   = dash ( - )
    //    A+B = confirm the current letter
    //
    //  Common codes:
    //    S = ...   O = ---   H = ....   E = .
    // ════════════════════════════════════════════════════════

    /**
     * Set the secret word players must tap in Morse code.
     * Registers the A, B, and A+B button handlers automatically.
     * Put this in "on start".
     */
    //% block="set secret Morse word %word"
    //% word.defl="SOS"
    //% group="📡 Morse Puzzle" weight=100
    export function setSecretMorseWord(word: string): void {
        _morseSecret = word.toUpperCase()
        _morseBuffer = ""
        _morseDecoded = ""

        input.onButtonPressed(Button.A, function () {
            if (_locked || _solved) return
            _morseBuffer += "."
            led.plot(2, 2); basic.pause(60); led.unplot(2, 2)
        })

        input.onButtonPressed(Button.B, function () {
            if (_locked || _solved) return
            _morseBuffer += "-"
            led.plot(1, 2); led.plot(2, 2); led.plot(3, 2)
            basic.pause(60)
            led.unplot(1, 2); led.unplot(2, 2); led.unplot(3, 2)
        })

        input.onButtonPressed(Button.AB, function () {
            if (_locked || _solved) return
            if (_morseBuffer.length === 0) {
                _showHint()
                return
            }
            let ch = _morseToChar(_morseBuffer)
            _morseDecoded += ch
            _morseBuffer = ""
            basic.showString(ch)
            basic.pause(300)
            basic.showString(_morseDecoded.length + "/" + _morseSecret.length)
            basic.pause(400)
            basic.clearScreen()

            if (_morseDecoded === _morseSecret) {
                if (_onMorseCorrect) _onMorseCorrect()
            } else if (ch === "?" || _morseDecoded.length >= _morseSecret.length) {
                _morseDecoded = ""
                if (_onMorseWrong) _onMorseWrong()
            }
        })
    }

    /**
     * Run this code when the player spells the correct Morse word.
     */
    //% block="on Morse correct"
    //% group="📡 Morse Puzzle" weight=90
    //% blockHandlerKey="morseCorrect"
    export function onMorseCorrect(handler: () => void): void {
        _onMorseCorrect = handler
    }

    /**
     * Run this code when the player makes a Morse mistake.
     */
    //% block="on Morse wrong"
    //% group="📡 Morse Puzzle" weight=80
    //% blockHandlerKey="morseWrong"
    export function onMorseWrong(handler: () => void): void {
        _onMorseWrong = handler
    }

    function _morseToChar(code: string): string {
        if (code == ".-")    return "A"
        if (code == "-...")  return "B"
        if (code == "-.-.")  return "C"
        if (code == "-..")   return "D"
        if (code == ".")     return "E"
        if (code == "..-.")  return "F"
        if (code == "--.")   return "G"
        if (code == "....")  return "H"
        if (code == "..")    return "I"
        if (code == ".---")  return "J"
        if (code == "-.-")   return "K"
        if (code == ".-..")  return "L"
        if (code == "--")    return "M"
        if (code == "-.")    return "N"
        if (code == "---")   return "O"
        if (code == ".--.")  return "P"
        if (code == "--.-")  return "Q"
        if (code == ".-.")   return "R"
        if (code == "...")   return "S"
        if (code == "-")     return "T"
        if (code == "..-")   return "U"
        if (code == "...-")  return "V"
        if (code == ".--")   return "W"
        if (code == "-..-")  return "X"
        if (code == "-.--")  return "Y"
        if (code == "--..")  return "Z"
        if (code == "-----") return "0"
        if (code == ".----") return "1"
        if (code == "..---") return "2"
        if (code == "...--") return "3"
        if (code == "....-") return "4"
        if (code == ".....") return "5"
        if (code == "-....") return "6"
        if (code == "--...") return "7"
        if (code == "---..") return "8"
        if (code == "----.") return "9"
        return "?"
    }

    // ════════════════════════════════════════════════════════
    //  LED PATTERN PUZZLE
    //
    //  How to use:
    //    1. Put "set secret pattern" in on start — it flashes
    //       the pattern on screen so players can memorise it
    //    2. Put "on pattern correct" anywhere
    //    3. Put "on pattern wrong"   anywhere
    //
    //  Controls (handled automatically):
    //    A   = move cursor to next LED
    //    B   = toggle LED under cursor on/off
    //    A+B = submit
    // ════════════════════════════════════════════════════════

    /**
     * Set the secret LED pattern and flash it on screen.
     * Use 1 for on and 0 for off, 25 characters, left to right, top to bottom.
     * Registers button handlers automatically. Put this in "on start".
     */
    //% block="set secret pattern %bits flash for %ms ms"
    //% bits.defl="1111100100001000010000100"
    //% ms.min=500 ms.max=5000 ms.defl=2000
    //% group="💡 Pattern Puzzle" weight=100
    //% inlineInputMode=inline
    export function setSecretPattern(bits: string, ms: number): void {
        _patSecret = []
        for (let i = 0; i < 25; i++) {
            _patSecret.push(bits.charAt(i) === "1" ? 1 : 0)
        }
        _patDrawing = _emptyPattern()
        _patCursor = 0
        _drawPattern(_patSecret)
        basic.pause(ms)
        basic.clearScreen()
        basic.pause(300)
        _drawPatternWithCursor()

        input.onButtonPressed(Button.A, function () {
            if (_locked || _solved) return
            _patCursor = (_patCursor + 1) % 25
            _drawPatternWithCursor()
        })

        input.onButtonPressed(Button.B, function () {
            if (_locked || _solved) return
            _patDrawing[_patCursor] = _patDrawing[_patCursor] === 0 ? 1 : 0
            _drawPatternWithCursor()
        })

        input.onButtonPressed(Button.AB, function () {
            if (_locked || _solved) return
            let ok = true
            for (let i = 0; i < 25; i++) {
                if (_patDrawing[i] !== _patSecret[i]) { ok = false; break }
            }
            if (ok) {
                if (_onPatCorrect) _onPatCorrect()
            } else {
                _patDrawing = _emptyPattern()
                _patCursor = 0
                if (_onPatWrong) _onPatWrong()
            }
        })
    }

    /**
     * Run this code when the player draws the correct pattern.
     */
    //% block="on pattern correct"
    //% group="💡 Pattern Puzzle" weight=90
    //% blockHandlerKey="patCorrect"
    export function onPatternCorrect(handler: () => void): void {
        _onPatCorrect = handler
    }

    /**
     * Run this code when the player submits a wrong pattern.
     */
    //% block="on pattern wrong"
    //% group="💡 Pattern Puzzle" weight=80
    //% blockHandlerKey="patWrong"
    export function onPatternWrong(handler: () => void): void {
        _onPatWrong = handler
    }

    /**
     * Flash the secret pattern on screen again (useful after a wrong guess).
     */
    //% block="flash secret pattern for %ms ms"
    //% ms.min=500 ms.max=5000 ms.defl=1500
    //% group="💡 Pattern Puzzle" weight=70
    export function reflashPattern(ms: number): void {
        _drawPattern(_patSecret)
        basic.pause(ms)
        basic.clearScreen()
        basic.pause(300)
        _drawPatternWithCursor()
    }

    function _emptyPattern(): number[] {
        let p: number[] = []
        for (let i = 0; i < 25; i++) p.push(0)
        return p
    }

    function _drawPattern(p: number[]): void {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (p[row * 5 + col] === 1) {
                    led.plot(col, row)
                } else {
                    led.unplot(col, row)
                }
            }
        }
    }

    function _drawPatternWithCursor(): void {
        _drawPattern(_patDrawing)
        led.plot(_patCursor % 5, Math.floor(_patCursor / 5))
    }

    // ════════════════════════════════════════════════════════
    //  SENSOR PUZZLES
    //  These return true/false — use them inside "if" blocks
    //  or inside "on button A+B pressed" to check and submit.
    // ════════════════════════════════════════════════════════

    /**
     * True if the light level is in the target range right now.
     * Use A to show the reading and A+B to submit.
     */
    //% block="light level is between %low and %high"
    //% low.min=0 low.max=255 low.defl=50
    //% high.min=0 high.max=255 high.defl=150
    //% group="🌡 Sensor Puzzles" weight=100
    //% inlineInputMode=inline
    export function lightBetween(low: number, high: number): boolean {
        return input.lightLevel() >= low && input.lightLevel() <= high
    }

    /**
     * True if the compass is pointing near a target bearing (0–359 degrees).
     * Use A to show the heading and A+B to submit.
     */
    //% block="compass pointing at %degrees ° within %tolerance °"
    //% degrees.min=0 degrees.max=359 degrees.defl=90
    //% tolerance.min=5 tolerance.max=45 tolerance.defl=20
    //% group="🌡 Sensor Puzzles" weight=90
    //% inlineInputMode=inline
    export function compassNear(degrees: number, tolerance: number): boolean {
        let h = input.compassHeading()
        let diff = Math.abs(h - degrees)
        return diff <= tolerance || diff >= (360 - tolerance)
    }

    /**
     * True if the temperature is in the target range (°C).
     */
    //% block="temperature is between %low and %high °C"
    //% group="🌡 Sensor Puzzles" weight=80
    //% inlineInputMode=inline
    export function tempBetween(low: number, high: number): boolean {
        return input.temperature() >= low && input.temperature() <= high
    }

    /**
     * Show the current light level on the display.
     */
    //% block="show light level"
    //% group="🌡 Sensor Puzzles" weight=70
    export function showLightLevel(): void {
        basic.showNumber(input.lightLevel())
    }

    /**
     * Show the current compass heading on the display.
     */
    //% block="show compass heading"
    //% group="🌡 Sensor Puzzles" weight=60
    export function showCompassHeading(): void {
        basic.showNumber(input.compassHeading())
    }

    // ════════════════════════════════════════════════════════
    //  RESPONSES
    //  Use these inside "on correct" and "on wrong" handlers
    // ════════════════════════════════════════════════════════

    /**
     * Show a tick and play a winning sound. Marks the puzzle as solved
     * so no more input is accepted.
     */
    //% block="show solved ✓"
    //% group="✅ Responses" weight=100
    export function showSolved(): void {
        _solved = true
        basic.showIcon(IconNames.Yes)
        music.playTone(784, 150)
        music.playTone(988, 150)
        music.playTone(1319, 300)
    }

    /**
     * Show a cross, play a buzz, and block all input for a few seconds.
     * Also counts this as one wrong attempt.
     */
    //% block="wrong answer — pause %seconds seconds"
    //% seconds.min=1 seconds.max=30 seconds.defl=3
    //% group="✅ Responses" weight=90
    export function wrongAnswer(seconds: number): void {
        if (_locked) return
        _attempts++
        _locked = true
        basic.showIcon(IconNames.No)
        music.playTone(220, 500)
        basic.pause(seconds * 1000)
        _locked = false
        basic.clearScreen()
    }

    /**
     * True if the player has used up all their allowed wrong guesses.
     * Use this inside "on wrong" to decide what happens at the end.
     */
    //% block="out of guesses"
    //% group="✅ Responses" weight=80
    export function outOfGuesses(): boolean {
        return _maxAttempts > 0 && _attempts >= _maxAttempts
    }

    /**
     * Show the next hint. If the cooldown hasn't passed, shows the wait time.
     * Called automatically when A+B is pressed in most puzzles.
     * Also put this in "on button A+B pressed" for sensor puzzles.
     */
    //% block="show hint"
    //% group="✅ Responses" weight=70
    export function showHint(): void {
        _showHint()
    }

    function _showHint(): void {
        if (_hintIndex >= _hints.length) {
            basic.showString("No hints")
            return
        }
        if (input.runningTime() < _hintCooldownEnd) {
            basic.showString("Wait " + Math.ceil((_hintCooldownEnd - input.runningTime()) / 1000) + "s")
            return
        }
        basic.showString(_hints[_hintIndex])
        _hintIndex++
        _hintCooldownEnd = input.runningTime() + _hintDelayMs
    }

    /**
     * Show the time left on the countdown.
     */
    //% block="show time left"
    //% group="✅ Responses" weight=60
    export function showTimeLeft(): void {
        if (!_timerRunning) { basic.showNumber(0); return }
        let r = _timerEnd - input.runningTime()
        basic.showNumber(r > 0 ? Math.ceil(r / 1000) : 0)
    }

    // ── timer internals ──────────────────────────────────────
    let _timerRunning = false
    let _timerEnd = 0

    // ════════════════════════════════════════════════════════
    //  GAME SETUP
    //  Put these in "on start" alongside your puzzle block
    // ════════════════════════════════════════════════════════

    /**
     * Set how many wrong guesses players are allowed (0 = unlimited).
     * Use "out of guesses" in your "on wrong" handler to check this.
     */
    //% block="allow %max wrong guesses"
    //% max.min=0 max.max=20 max.defl=3
    //% group="⚙️ Game Setup" weight=100
    export function allowWrong(max: number): void {
        _maxAttempts = max
    }

    /**
     * Add a hint message. Players press A+B to reveal hints one by one.
     * Add one block per hint.
     */
    //% block="add hint %hint"
    //% hint.defl="Try the buttons"
    //% group="⚙️ Game Setup" weight=90
    export function addHint(hint: string): void {
        _hints.push(hint)
    }

    /**
     * How many seconds players must wait between hints.
     */
    //% block="wait %seconds seconds between hints"
    //% seconds.min=5 seconds.max=300 seconds.defl=30
    //% group="⚙️ Game Setup" weight=80
    export function timeBetweenHints(seconds: number): void {
        _hintDelayMs = seconds * 1000
    }

    /**
     * Start a countdown. When time runs out, run the code inside.
     * Put this in "on start".
     */
    //% block="start countdown %seconds seconds — on timeout"
    //% seconds.min=10 seconds.max=3600 seconds.defl=120
    //% handlerStatement=1
    //% group="⚙️ Game Setup" weight=70
    export function startCountdown(seconds: number, onTimeout: () => void): void {
        _timerEnd = input.runningTime() + seconds * 1000
        _timerRunning = true
        control.inBackground(function () {
            while (true) {
                if (_timerRunning && input.runningTime() >= _timerEnd) {
                    _timerRunning = false
                    onTimeout()
                    break
                }
                basic.pause(500)
            }
        })
    }

    /**
     * Reset the puzzle — clears all state and the display.
     */
    //% block="reset puzzle"
    //% group="⚙️ Game Setup" weight=60
    export function resetPuzzle(): void {
        _locked = false
        _solved = false
        _attempts = 0
        _hintIndex = 0
        _hintCooldownEnd = 0
        _timerRunning = false
        _seqBuffer = []
        _pinEntered = []
        _pinCurrentDigit = 0
        _morseBuffer = ""
        _morseDecoded = ""
        _patDrawing = _emptyPattern()
        _patCursor = 0
        basic.clearScreen()
    }

}

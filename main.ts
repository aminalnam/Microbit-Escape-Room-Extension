// ============================================================
//  Escape Room Extension for micro:bit
//
//  Design philosophy updated:
//    1. Set the secret in "on start"
//    2. Hook up input blocks to button presses manually
//    3. Use boolean blocks inside "if/then" to check answers
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
    // ════════════════════════════════════════════════════════

    //% block="set secret sequence %a then %b then %c"
    //% a.defl="A" b.defl="B" c.defl="A"
    //% group="🔢 Sequence Puzzle" weight=100
    //% inlineInputMode=inline
    export function setSecretSequence(a: string, b: string, c: string): void {
        _seqLen = 3
        _seqSecret = [a, b, c]
        _seqBuffer = []
    }

    //% block="input sequence A"
    //% group="🔢 Sequence Puzzle" weight=95
    export function inputSequenceA(): void {
        if (_locked || _solved) return
        _seqBuffer.push("A")
        if (_seqBuffer.length > _seqLen) _seqBuffer.shift()
        led.plot(0, 0); basic.pause(60); led.unplot(0, 0)
    }

    //% block="input sequence B"
    //% group="🔢 Sequence Puzzle" weight=94
    export function inputSequenceB(): void {
        if (_locked || _solved) return
        _seqBuffer.push("B")
        if (_seqBuffer.length > _seqLen) _seqBuffer.shift()
        led.plot(4, 0); basic.pause(60); led.unplot(4, 0)
    }

    /**
     * Hexagonal reporter: returns true if the sequence is correct
     */
    //% block="sequence is correct"
    //% group="🔢 Sequence Puzzle" weight=93
    export function isSequenceCorrect(): boolean {
        if (_seqBuffer.length < _seqLen) return false
        for (let i = 0; i < _seqLen; i++) {
            if (_seqBuffer[i] !== _seqSecret[i]) return false
        }
        return true
    }

    //% block="on sequence correct"
    //% group="🔢 Sequence Puzzle" weight=90
    //% blockHandlerKey="seqCorrect"
    export function onSequenceCorrect(handler: () => void): void {
        _onSeqCorrect = handler
    }

    //% block="on sequence wrong"
    //% group="🔢 Sequence Puzzle" weight=80
    //% blockHandlerKey="seqWrong"
    export function onSequenceWrong(handler: () => void): void {
        _onSeqWrong = handler
    }

    // ════════════════════════════════════════════════════════
    //  PIN PUZZLE
    // ════════════════════════════════════════════════════════

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
    }

    //% block="cycle PIN digit"
    //% group="🔑 PIN Puzzle" weight=95
    export function cyclePinDigit(): void {
        if (_locked || _solved) return
        _pinCurrentDigit = (_pinCurrentDigit + 1) % 10
        basic.showNumber(_pinCurrentDigit)
    }

    //% block="enter PIN digit"
    //% group="🔑 PIN Puzzle" weight=94
    export function enterPinDigit(): void {
        if (_locked || _solved) return
        _pinEntered.push(_pinCurrentDigit)
        _pinCurrentDigit = 0
        basic.showString(_pinEntered.length + "/" + _pinSecret.length)
        basic.pause(500)
        basic.clearScreen()
    }

    /**
     * Hexagonal reporter: returns true if the PIN is correct
     */
    //% block="PIN is correct"
    //% group="🔑 PIN Puzzle" weight=93
    export function isPinCorrect(): boolean {
        if (_pinEntered.length !== _pinSecret.length) return false
        for (let i = 0; i < _pinSecret.length; i++) {
            if (_pinEntered[i] !== _pinSecret[i]) return false
        }
        return true
    }

    //% block="on PIN correct"
    //% group="🔑 PIN Puzzle" weight=90
    //% blockHandlerKey="pinCorrect"
    export function onPinCorrect(handler: () => void): void {
        _onPinCorrect = handler
    }

    //% block="on PIN wrong"
    //% group="🔑 PIN Puzzle" weight=80
    //% blockHandlerKey="pinWrong"
    export function onPinWrong(handler: () => void): void {
        _onPinWrong = handler
    }

    // ════════════════════════════════════════════════════════
    //  MORSE CODE PUZZLE
    // ════════════════════════════════════════════════════════

    //% block="set secret Morse word %word"
    //% word.defl="SOS"
    //% group="📡 Morse Puzzle" weight=100
    export function setSecretMorseWord(word: string): void {
        _morseSecret = word.toUpperCase()
        _morseBuffer = ""
        _morseDecoded = ""
    }

    //% block="input Morse dot (.)"
    //% group="📡 Morse Puzzle" weight=95
    export function inputMorseDot(): void {
        if (_locked || _solved) return
        _morseBuffer += "."
        led.plot(2, 2); basic.pause(60); led.unplot(2, 2)
    }

    //% block="input Morse dash (-)"
    //% group="📡 Morse Puzzle" weight=94
    export function inputMorseDash(): void {
        if (_locked || _solved) return
        _morseBuffer += "-"
        led.plot(1, 2); led.plot(2, 2); led.plot(3, 2)
        basic.pause(60)
        led.unplot(1, 2); led.unplot(2, 2); led.unplot(3, 2)
    }

    //% block="submit Morse letter"
    //% group="📡 Morse Puzzle" weight=93
    export function submitMorseLetter(): void {
        if (_locked || _solved) return
        if (_morseBuffer.length === 0) return
        let ch = _morseToChar(_morseBuffer)
        _morseDecoded += ch
        _morseBuffer = ""
        basic.showString(ch)
        basic.pause(300)
        basic.showString(_morseDecoded.length + "/" + _morseSecret.length)
        basic.pause(400)
        basic.clearScreen()
    }

    /**
     * Hexagonal reporter: returns true if the Morse word is correct
     */
    //% block="Morse is correct"
    //% group="📡 Morse Puzzle" weight=92
    export function isMorseCorrect(): boolean {
        return _morseDecoded === _morseSecret
    }

    //% block="on Morse correct"
    //% group="📡 Morse Puzzle" weight=90
    //% blockHandlerKey="morseCorrect"
    export function onMorseCorrect(handler: () => void): void {
        _onMorseCorrect = handler
    }

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
    // ════════════════════════════════════════════════════════

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
    }

    //% block="move pattern cursor"
    //% group="💡 Pattern Puzzle" weight=95
    export function movePatternCursor(): void {
        if (_locked || _solved) return
        _patCursor = (_patCursor + 1) % 25
        _drawPatternWithCursor()
    }

    //% block="toggle pattern LED"
    //% group="💡 Pattern Puzzle" weight=94
    export function togglePatternLed(): void {
        if (_locked || _solved) return
        _patDrawing[_patCursor] = _patDrawing[_patCursor] === 0 ? 1 : 0
        _drawPatternWithCursor()
    }

    /**
     * Hexagonal reporter: returns true if the pattern is correct
     */
    //% block="pattern is correct"
    //% group="💡 Pattern Puzzle" weight=93
    export function isPatternCorrect(): boolean {
        for (let i = 0; i < 25; i++) {
            if (_patDrawing[i] !== _patSecret[i]) return false
        }
        return true
    }

    //% block="on pattern correct"
    //% group="💡 Pattern Puzzle" weight=90
    //% blockHandlerKey="patCorrect"
    export function onPatternCorrect(handler: () => void): void {
        _onPatCorrect = handler
    }

    //% block="on pattern wrong"
    //% group="💡 Pattern Puzzle" weight=80
    //% blockHandlerKey="patWrong"
    export function onPatternWrong(handler: () => void): void {
        _onPatWrong = handler
    }

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
    // ════════════════════════════════════════════════════════

    //% block="light level is between %low and %high"
    //% low.min=0 low.max=255 low.defl=50
    //% high.min=0 high.max=255 high.defl=150
    //% group="🌡 Sensor Puzzles" weight=100
    //% inlineInputMode=inline
    export function lightBetween(low: number, high: number): boolean {
        return input.lightLevel() >= low && input.lightLevel() <= high
    }

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

    //% block="temperature is between %low and %high °C"
    //% group="🌡 Sensor Puzzles" weight=80
    //% inlineInputMode=inline
    export function tempBetween(low: number, high: number): boolean {
        return input.temperature() >= low && input.temperature() <= high
    }

    //% block="show light level"
    //% group="🌡 Sensor Puzzles" weight=70
    export function showLightLevel(): void {
        basic.showNumber(input.lightLevel())
    }

    //% block="show compass heading"
    //% group="🌡 Sensor Puzzles" weight=60
    export function showCompassHeading(): void {
        basic.showNumber(input.compassHeading())
    }

    // ════════════════════════════════════════════════════════
    //  RESPONSES
    // ════════════════════════════════════════════════════════

    //% block="show solved ✓"
    //% group="✅ Responses" weight=100
    export function showSolved(): void {
        _solved = true
        basic.showIcon(IconNames.Yes)
        music.playTone(784, 150)
        music.playTone(988, 150)
        music.playTone(1319, 300)
    }

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

    //% block="out of guesses"
    //% group="✅ Responses" weight=80
    export function outOfGuesses(): boolean {
        return _maxAttempts > 0 && _attempts >= _maxAttempts
    }

    //% block="show hint"
    //% group="✅ Responses" weight=70
    export function showHint(): void {
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
    // ════════════════════════════════════════════════════════

    //% block="allow %max wrong guesses"
    //% max.min=0 max.max=20 max.defl=3
    //% group="⚙️ Game Setup" weight=100
    export function allowWrong(max: number): void {
        _maxAttempts = max
    }

    //% block="add hint %hint"
    //% hint.defl="Try the buttons"
    //% group="⚙️ Game Setup" weight=90
    export function addHint(hint: string): void {
        _hints.push(hint)
    }

    //% block="wait %seconds seconds between hints"
    //% seconds.min=5 seconds.max=300 seconds.defl=30
    //% group="⚙️ Game Setup" weight=80
    export function timeBetweenHints(seconds: number): void {
        _hintDelayMs = seconds * 1000
    }

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


    

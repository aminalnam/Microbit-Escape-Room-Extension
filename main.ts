// ============================================================
//  Escape Room Extension for micro:bit
// ============================================================

//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    export enum ButtonOption {
        A,
        B
    }

    // -- shared state --
    let _locked = false
    let _solved = false
    let _attempts = 0
    let _maxAttempts = 0

    // -- hint state --
    let _hints: string[] = []
    let _hintIndex = 0
    let _hintCooldownEnd = 0
    let _hintDelayMs = 30000

    // -- sequence state --
    let _seqSecret: ButtonOption[] = []
    let _seqBuffer: ButtonOption[] = []
    let _onSeqCorrect: () => void = null
    let _onSeqWrong: () => void = null

    // -- pin state --
    let _pinSecret: number[] = []
    let _pinEntered: number[] = []
    let _pinCurrentDigit = 0
    let _onPinCorrect: () => void = null
    let _onPinWrong: () => void = null

    // -- morse state --
    let _morseSecret = ""
    let _morseBuffer = ""
    let _morseDecoded = ""
    let _onMorseCorrect: () => void = null
    let _onMorseWrong: () => void = null

    // -- pattern state --
    let _patSecret: number[] = []
    let _patDrawing: number[] = []
    let _patCursor = 0
    let _onPatCorrect: () => void = null
    let _onPatWrong: () => void = null

    // -- timer state --
    let _timerRunning = false
    let _timerEnd = 0

    // --- SEQUENCE PUZZLE ---

    /**
     * Set the secret 3-button sequence.
     */
    //% block="set secret sequence %a then %b then %c"
    //% group="Sequence Puzzle" weight=100
    //% inlineInputMode=inline
    export function setSecretSequence(a: ButtonOption, b: ButtonOption, c: ButtonOption): void {
        _seqSecret = [a, b, c]
        _seqBuffer = []

        input.onButtonPressed(Button.A, function () {
            if (_locked || _solved) return
            _seqBuffer.push(ButtonOption.A)
            if (_seqBuffer.length > 3) _seqBuffer.shift()
            led.plot(0, 0); basic.pause(60); led.unplot(0, 0)
            _checkSequence()
        })

        input.onButtonPressed(Button.B, function () {
            if (_locked || _solved) return
            _seqBuffer.push(ButtonOption.B)
            if (_seqBuffer.length > 3) _seqBuffer.shift()
            led.plot(4, 0); basic.pause(60); led.unplot(4, 0)
            _checkSequence()
        })

        input.onButtonPressed(Button.AB, function () {
            if (!_locked && !_solved) _showHint()
        })
    }

    /**
     * Returns true if the current sequence matches the secret.
     */
    //% block="sequence is correct"
    //% group="Sequence Puzzle" weight=85
    export function isSequenceCorrect(): boolean {
        if (_seqBuffer.length < 3) return false
        for (let i = 0; i < 3; i++) {
            if (_seqBuffer[i] !== _seqSecret[i]) return false
        }
        return true
    }

    /**
     * Run code when the sequence is correct.
     */
    //% block="on sequence correct"
    //% group="Sequence Puzzle" weight=90
    //% handlerStatement=1
    export function onSequenceCorrect(handler: () => void): void {
        _onSeqCorrect = handler
    }

    /**
     * Run code when the sequence is wrong.
     */
    //% block="on sequence wrong"
    //% group="Sequence Puzzle" weight=80
    //% handlerStatement=1
    export function onSequenceWrong(handler: () => void): void {
        _onSeqWrong = handler
    }

    function _checkSequence(): void {
        if (_seqBuffer.length < 3) return
        if (isSequenceCorrect()) {
            if (_onSeqCorrect) _onSeqCorrect()
        } else {
            if (_onSeqWrong) _onSeqWrong()
        }
    }

    // --- PIN PUZZLE ---

    /**
     * Set secret PIN (e.g. "3 7 2").
     */
    //% block="set secret PIN %pin"
    //% pin.defl="3 7 2"
    //% group="PIN Puzzle" weight=100
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
            if (_pinEntered.length < _pinSecret.length) {
                _showHint()
                return
            }
            if (isPinCorrect()) {
                if (_onPinCorrect) _onPinCorrect()
            } else {
                _pinEntered = []
                _pinCurrentDigit = 0
                if (_onPinWrong) _onPinWrong()
            }
        })
    }

    /**
     * Returns true if the current PIN matches the secret.
     */
    //% block="PIN is correct"
    //% group="PIN Puzzle" weight=85
    export function isPinCorrect(): boolean {
        if (_pinEntered.length !== _pinSecret.length) return false
        for (let i = 0; i < _pinSecret.length; i++) {
            if (_pinEntered[i] !== _pinSecret[i]) return false
        }
        return true
    }

    //% block="on PIN correct"
    //% group="PIN Puzzle" weight=90
    //% handlerStatement=1
    export function onPinCorrect(handler: () => void): void {
        _onPinCorrect = handler
    }

    //% block="on PIN wrong"
    //% group="PIN Puzzle" weight=80
    //% handlerStatement=1
    export function onPinWrong(handler: () => void): void {
        _onPinWrong = handler
    }

    // --- MORSE PUZZLE ---

    /**
     * Set secret Morse word.
     */
    //% block="set secret Morse word %word"
    //% group="Morse Puzzle" weight=100
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

            if (isMorseCorrect()) {
                if (_onMorseCorrect) _onMorseCorrect()
            } else if (ch === "?" || _morseDecoded.length >= _morseSecret.length) {
                _morseDecoded = ""
                if (_onMorseWrong) _onMorseWrong()
            }
        })
    }

    /**
     * Returns true if the Morse word is correct.
     */
    //% block="Morse is correct"
    //% group="Morse Puzzle" weight=85
    export function isMorseCorrect(): boolean {
        return _morseDecoded === _morseSecret
    }

    //% block="on Morse correct"
    //% group="Morse Puzzle" weight=90
    //% handlerStatement=1
    export function onMorseCorrect(handler: () => void): void {
        _onMorseCorrect = handler
    }

    //% block="on Morse wrong"
    //% group="Morse Puzzle" weight=80
    //% handlerStatement=1
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

    // --- PATTERN PUZZLE ---

    /**
     * Set secret pattern.
     */
    //% block="set secret pattern %bits flash for %ms ms"
    //% ms.defl=2000
    //% group="Pattern Puzzle" weight=100
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
            if (isPatternCorrect()) {
                if (_onPatCorrect) _onPatCorrect()
            } else {
                _patDrawing = _emptyPattern()
                _patCursor = 0
                if (_onPatWrong) _onPatWrong()
            }
        })
    }

    /**
     * Returns true if the drawn pattern matches the secret.
     */
    //% block="pattern is correct"
    //% group="Pattern Puzzle" weight=85
    export function isPatternCorrect(): boolean {
        for (let i = 0; i < 25; i++) {
            if (_patDrawing[i] !== _patSecret[i]) return false
        }
        return true
    }

    //% block="on pattern correct"
    //% group="Pattern Puzzle" weight=90
    //% handlerStatement=1
    export function onPatternCorrect(handler: () => void): void {
        _onPatCorrect = handler
    }

    //% block="on pattern wrong"
    //% group="Pattern Puzzle" weight=80
    //% handlerStatement=1
    export function onPatternWrong(handler: () => void): void {
        _onPatWrong = handler
    }

    // --- RESPONSES ---

    /**
     * Show solved tick and play sound.
     */
    //% block="show solved"
    //% group="Responses" weight=100
    export function showSolved(): void {
        _solved = true
        basic.showIcon(IconNames.Yes)
        music.playTone(784, 150)
        music.playTone(988, 150)
        music.playTone(1319, 300)
    }

    /**
     * Show cross and buzz.
     */
    //% block="wrong answer pause %seconds seconds"
    //% group="Responses" weight=90
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

    // --- SETUP ---

    /**
     * Start a countdown timer.
     */
    //% block="start countdown %seconds seconds on timeout"
    //% handlerStatement=1
    //% group="Game Setup" weight=70
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

    function _emptyPattern(): number[] {
        let p: number[] = []
        for (let i = 0; i < 25; i++) p.push(0)
        return p
    }

    function _drawPattern(p: number[]): void {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (p[row * 5 + col] === 1) led.plot(col, row)
                else led.unplot(col, row)
            }
        }
    }

    function _drawPatternWithCursor(): void {
        _drawPattern(_patDrawing)
        led.plot(_patCursor % 5, Math.floor(_patCursor / 5))
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

    //% block="reset puzzle"
    //% group="Game Setup" weight=60
    export function resetPuzzle(): void {
        _locked = false; _solved = false; _attempts = 0; _hintIndex = 0
        _hintCooldownEnd = 0; _timerRunning = false; _seqBuffer = []
        _pinEntered = []; _pinCurrentDigit = 0; _morseBuffer = ""
        _morseDecoded = ""; _patDrawing = _emptyPattern(); _patCursor = 0
        basic.clearScreen()
    }
}


                

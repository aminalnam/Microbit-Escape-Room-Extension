//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    export enum ButtonOption { A, B }

    // ── shared state ─────────────────────────────────────────
    let _locked = false
    let _solved = false
    let _attempts = 0
    let _maxAttempts = 0

    // ── sequence state ───────────────────────────────────────
    let _seqSecret: string[] = []
    let _seqBuffer: string[] = []
    let _onSeqCorrect: () => void = null

    // ── pin state ────────────────────────────────────────────
    let _pinSecret: number[] = []
    let _pinEntered: number[] = []
    let _pinCurrentDigit = 0
    let _onPinCorrect: () => void = null

    // ── morse state ──────────────────────────────────────────
    let _morseSecret = ""
    let _morseBuffer = ""
    let _morseDecoded = ""
    let _onMorseCorrect: () => void = null

    // ── pattern state ────────────────────────────────────────
    let _patSecret: number[] = []
    let _patDrawing: number[] = []
    let _patCursor = 0
    let _onPatCorrect: () => void = null

    // ════════════════════════════════════════════════════════
    //  1. SEQUENCE PUZZLE
    // ════════════════════════════════════════════════════════

    //% block="set secret sequence %a %b %c"
    //% group="Sequence" weight=100
    export function setSecretSequence(a: string, b: string, c: string): void {
        _seqSecret = [a, b, c]
        _seqBuffer = []
    }

    /**
     * Action: Add a button press to the sequence attempt.
     */
    //% block="input sequence button %btn"
    //% group="Sequence" weight=90
    export function inputSequence(btn: ButtonOption): void {
        if (_locked || _solved) return
        _seqBuffer.push(btn === ButtonOption.A ? "A" : "B")
        if (_seqBuffer.length > 3) _seqBuffer.shift()
    }

    /**
     * Reporter: Returns true if the sequence is correct. Use in 'if' blocks.
     */
    //% block="sequence is correct"
    //% group="Sequence" weight=80
    export function isSequenceCorrect(): boolean {
        if (_seqBuffer.length < 3) return false
        for (let i = 0; i < 3; i++) {
            if (_seqBuffer[i] !== _seqSecret[i]) return false
        }
        return true
    }

    //% block="on sequence correct"
    //% group="Sequence" weight=70
    //% handlerStatement=1
    export function onSequenceCorrect(handler: () => void): void {
        _onSeqCorrect = handler
    }

    // ════════════════════════════════════════════════════════
    //  2. PIN PUZZLE
    // ════════════════════════════════════════════════════════

    //% block="set secret PIN %pin"
    //% group="PIN" weight=100
    export function setSecretPin(pin: string): void {
        _pinSecret = []
        _pinEntered = []
        let parts = pin.split(" ")
        for (let i = 0; i < parts.length; i++) _pinSecret.push(parseInt(parts[i]))
    }

    //% block="cycle PIN digit"
    //% group="PIN" weight=90
    export function cyclePinDigit(): void {
        _pinCurrentDigit = (_pinCurrentDigit + 1) % 10
        basic.showNumber(_pinCurrentDigit)
    }

    //% block="enter current PIN digit"
    //% group="PIN" weight=85
    export function enterPinDigit(): void {
        _pinEntered.push(_pinCurrentDigit)
        _pinCurrentDigit = 0
        basic.clearScreen()
    }

    /**
     * Reporter: Returns true if the PIN is correct. Use in 'if' blocks.
     */
    //% block="PIN is correct"
    //% group="PIN" weight=80
    export function isPinCorrect(): boolean {
        if (_pinEntered.length !== _pinSecret.length) return false
        for (let i = 0; i < _pinSecret.length; i++) {
            if (_pinEntered[i] !== _pinSecret[i]) return false
        }
        return true
    }

    // ════════════════════════════════════════════════════════
    //  3. MORSE CODE PUZZLE
    // ════════════════════════════════════════════════════════

    //% block="set secret Morse word %word"
    //% group="Morse" weight=100
    export function setSecretMorseWord(word: string): void {
        _morseSecret = word.toUpperCase()
        _morseBuffer = ""
        _morseDecoded = ""
    }

    //% block="add Morse %choice"
    //% choice.defl="."
    //% group="Morse" weight=90
    export function addMorse(choice: string): void {
        _morseBuffer += choice
    }

    //% block="finish Morse letter"
    //% group="Morse" weight=85
    export function finishMorseLetter(): void {
        let codes = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."]
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        let index = codes.indexOf(_morseBuffer)
        _morseDecoded += (index >= 0) ? chars.charAt(index) : "?"
        _morseBuffer = ""
        basic.showString(_morseDecoded.substr(_morseDecoded.length - 1, 1))
    }

    /**
     * Reporter: Returns true if the word is correct. Use in 'if' blocks.
     */
    //% block="Morse is correct"
    //% group="Morse" weight=80
    export function isMorseCorrect(): boolean {
        return _morseDecoded === _morseSecret
    }

    // ════════════════════════════════════════════════════════
    //  4. PATTERN PUZZLE
    // ════════════════════════════════════════════════════════

    //% block="set secret pattern %bits"
    //% group="Pattern" weight=100
    export function setSecretPattern(bits: string): void {
        _patSecret = []
        for (let i = 0; i < 25; i++) _patSecret.push(bits.charAt(i) === "1" ? 1 : 0)
        _patDrawing = []; for (let j = 0; j < 25; j++) _patDrawing.push(0)
    }

    //% block="move pattern cursor"
    //% group="Pattern" weight=90
    export function movePatternCursor(): void {
        _patCursor = (_patCursor + 1) % 25
        _refreshPattern()
    }

    //% block="toggle pattern LED"
    //% group="Pattern" weight=85
    export function togglePatternLed(): void {
        _patDrawing[_patCursor] = _patDrawing[_patCursor] === 0 ? 1 : 0
        _refreshPattern()
    }

    /**
     * Reporter: Returns true if the pattern matches. Use in 'if' blocks.
     */
    //% block="pattern is correct"
    //% group="Pattern" weight=80
    export function isPatternCorrect(): boolean {
        for (let i = 0; i < 25; i++) {
            if (_patDrawing[i] !== _patSecret[i]) return false
        }
        return true
    }

    function _refreshPattern(): void {
        for (let i = 0; i < 25; i++) {
            if (_patDrawing[i] === 1) led.plot(i % 5, Math.floor(i / 5))
            else led.unplot(i % 5, Math.floor(i / 5))
        }
        // Blink cursor
        led.plot(_patCursor % 5, Math.floor(_patCursor / 5))
    }

    // ════════════════════════════════════════════════════════
    //  5. RESPONSES & SETUP
    // ════════════════════════════════════════════════════════

    //% block="show solved"
    //% group="General" weight=100
    export function showSolved(): void {
        _solved = true
        basic.showIcon(IconNames.Yes)
        music.playTone(Note.C5, 500)
    }

    //% block="reset puzzle"
    //% group="General" weight=90
    export function resetPuzzle(): void {
        _locked = false; _solved = false; _seqBuffer = []; _pinEntered = []; _morseDecoded = ""
        basic.clearScreen()
    }
}



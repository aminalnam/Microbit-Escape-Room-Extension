//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    export enum ButtonOption { A, B }

    // --- State Variables ---
    let _locked = false
    let _solved = false
    
    let _seqSecret: string[] = []
    let _seqBuffer: string[] = []
    let _onSeqCorrect: () => void = null

    let _pinSecret: number[] = []
    let _pinEntered: number[] = []
    let _pinCurrentDigit = 0
    let _onPinCorrect: () => void = null

    let _morseSecret = ""
    let _morseBuffer = ""
    let _morseDecoded = ""
    let _onMorseCorrect: () => void = null

    let _patSecret: number[] = []
    let _patDrawing: number[] = []
    let _patCursor = 0
    let _onPatCorrect: () => void = null

    // === 1. SEQUENCE PUZZLE ===

    //% block="set secret sequence %a %b %c"
    //% group="Sequence" weight=100
    export function setSecretSequence(a: string, b: string, c: string): void {
        _seqSecret = [a, b, c]
        _seqBuffer = []
    }

    //% block="input sequence %btn"
    //% group="Sequence" weight=90
    export function inputSequence(btn: ButtonOption): void {
        if (_locked || _solved) return
        _seqBuffer.push(btn === ButtonOption.A ? "A" : "B")
        if (_seqBuffer.length > 3) _seqBuffer.shift()
        if (isSequenceCorrect() && _onSeqCorrect) _onSeqCorrect()
    }

    /**
     * Returns true if the current sequence matches the secret.
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

    // === 2. PIN PUZZLE ===

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

    //% block="enter PIN digit"
    //% group="PIN" weight=85
    export function enterPinDigit(): void {
        _pinEntered.push(_pinCurrentDigit)
        _pinCurrentDigit = 0
        basic.clearScreen()
    }

    /**
     * Returns true if the entered PIN matches the secret.
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

    //% block="on PIN correct"
    //% group="PIN" weight=70
    //% handlerStatement=1
    export function onPinCorrect(handler: () => void): void {
        _onPinCorrect = handler
    }

    // === 3. MORSE PUZZLE ===

    //% block="set secret Morse %word"
    //% group="Morse" weight=100
    export function setSecretMorse(word: string): void {
        _morseSecret = word.toUpperCase()
        _morseBuffer = ""
        _morseDecoded = ""
    }

    //% block="input Morse dot"
    //% group="Morse" weight=90
    export function inputMorseDot(): void { _morseBuffer += "." }

    //% block="input Morse dash"
    //% group="Morse" weight=85
    export function inputMorseDash(): void { _morseBuffer += "-" }

    //% block="submit Morse letter"
    //% group="Morse" weight=80
    export function submitMorseLetter(): void {
        let ch = _morseToChar(_morseBuffer)
        _morseDecoded += ch
        _morseBuffer = ""
        basic.showString(ch)
        if (isMorseCorrect() && _onMorseCorrect) _onMorseCorrect()
    }

    /**
     * Returns true if the Morse word is correct.
     */
    //% block="Morse is correct"
    //% group="Morse" weight=75
    export function isMorseCorrect(): boolean {
        return _morseDecoded === _morseSecret
    }

    //% block="on Morse correct"
    //% group="Morse" weight=70
    //% handlerStatement=1
    export function onMorseCorrect(handler: () => void): void {
        _onMorseCorrect = handler
    }

    function _morseToChar(code: string): string {
        if (code == ".-") return "A"
        if (code == "-...") return "B"
        if (code == "...") return "S"
        if (code == "---") return "O"
        return "?"
    }

    // === 4. PATTERN PUZZLE ===

    //% block="set secret pattern %bits"
    //% group="Pattern" weight=100
    export function setSecretPattern(bits: string): void {
        _patSecret = []
        for (let i = 0; i < 25; i++) _patSecret.push(bits.charAt(i) === "1" ? 1 : 0)
        _patDrawing = []
        for (let j = 0; j < 25; j++) _patDrawing.push(0)
    }

    //% block="move pattern cursor"
    //% group="Pattern" weight=90
    export function movePatternCursor(): void {
        _patCursor = (_patCursor + 1) % 25
    }

    //% block="toggle pattern LED"
    //% group="Pattern" weight=85
    export function togglePatternLed(): void {
        _patDrawing[_patCursor] = _patDrawing[_patCursor] === 0 ? 1 : 0
    }

    /**
     * Returns true if the drawn pattern matches the secret.
     */
    //% block="pattern is correct"
    //% group="Pattern" weight=80
    export function isPatternCorrect(): boolean {
        for (let i = 0; i < 25; i++) {
            if (_patDrawing[i] !== _patSecret[i]) return false
        }
        return true
    }

    //% block="on pattern correct"
    //% group="Pattern" weight=70
    //% handlerStatement=1
    export function onPatternCorrect(handler: () => void): void {
        _onPatCorrect = handler
    }

    // === 5. RESPONSES ===

    //% block="show solved"
    //% group="General" weight=100
    export function showSolved(): void {
        _solved = true
        basic.showIcon(IconNames.Yes)
    }
}



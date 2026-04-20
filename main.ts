//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    export enum ButtonOption { A, B }

    // --- State ---
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

    // === 1. SEQUENCE PUZZLE ===

    /**
     * Set the secret 3-button sequence.
     */
    //% block="set secret sequence %a %b %c"
    //% group="Sequence" weight=100
    export function setSecretSequence(a: string, b: string, c: string): void {
        _seqSecret = [a, b, c]
        _seqBuffer = []
    }

    /**
     * Add a press to the sequence attempt.
     */
    //% block="input sequence %btn"
    //% group="Sequence" weight=90
    export function inputSequence(btn: ButtonOption): void {
        if (_locked || _solved) return
        let val = (btn === ButtonOption.A) ? "A" : "B"
        _seqBuffer.push(val)
        if (_seqBuffer.length > 3) _seqBuffer.shift()
        
        if (isSequenceCorrect() && _onSeqCorrect) {
            _onSeqCorrect()
        }
    }

    /**
     * Returns true if the sequence is correct.
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

    /**
     * Set the secret PIN.
     */
    //% block="set secret PIN %pin"
    //% group="PIN" weight=100
    export function setSecretPin(pin: string): void {
        _pinSecret = []
        _pinEntered = []
        let parts = pin.split(" ")
        for (let i = 0; i < parts.length; i++) {
            _pinSecret.push(parseInt(parts[i]))
        }
    }

    /**
     * Change the current digit (0-9).
     */
    //% block="cycle PIN digit"
    //% group="PIN" weight=90
    export function cyclePinDigit(): void {
        _pinCurrentDigit = (_pinCurrentDigit + 1) % 10
        basic.showNumber(_pinCurrentDigit)
    }

    /**
     * Enter the current digit.
     */
    //% block="enter PIN digit"
    //% group="PIN" weight=85
    export function enterPinDigit(): void {
        _pinEntered.push(_pinCurrentDigit)
        _pinCurrentDigit = 0
        basic.clearScreen()
    }

    /**
     * Returns true if the PIN is correct.
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

    /**
     * Set the Morse word.
     */
    //% block="set secret Morse %word"
    //% group="Morse" weight=100
    export function setSecretMorse(word: string): void {
        _morseSecret = word.toUpperCase()
        _morseBuffer = ""
        _morseDecoded = ""
    }

    /**
     * Add a dot or dash.
     */
    //% block="input Morse %dotDash"
    //% group="Morse" weight=90
    export function inputMorse(dotDash: string): void {
        _morseBuffer += dotDash
    }

    /**
     * Convert current dots/dashes into a letter.
     */
    //% block="submit Morse letter"
    //% group="Morse" weight=85
    export function submitMorseLetter(): void {
        let ch = _morseToChar(_morseBuffer)
        _morseDecoded += ch
        _morseBuffer = ""
        basic.showString(ch)
    }

    /**
     * Returns true if the Morse word is correct.
     */
    //% block="Morse is correct"
    //% group="Morse" weight=80
    export function isMorseCorrect(): boolean {
        return _morseDecoded === _morseSecret
    }

    function _morseToChar(code: string): string {
        if (code == ".-") return "A"
        if (code == "-...") return "B"
        if (code == "...") return "S"
        if (code == "---") return "O"
        return "?"
    }

    // === 4. RESPONSES ===

    //% block="show solved"
    //% group="General" weight=100
    export function showSolved(): void {
        _solved = true
        basic.showIcon(IconNames.Yes)
    }
}



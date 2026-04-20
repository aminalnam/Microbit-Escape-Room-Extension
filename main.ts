//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    export enum ButtonOption { A, B }

    // --- State Management ---
    let _seqSecret: string[] = []
    let _seqBuffer: string[] = []
    let _pinSecret: number[] = []
    let _pinEntered: number[] = []
    let _pinDigit = 0
    let _morseSecret = ""
    let _morseBuffer = ""
    let _morseDecoded = ""

    // === SEQUENCE PUZZLE ===

    //% block="set secret sequence %a %b %c"
    //% group="Sequence" weight=100
    export function setSecretSequence(a: string, b: string, c: string): void {
        _seqSecret = [a, b, c]
        _seqBuffer = []
    }

    /**
     * Use this in a button block to add to the sequence.
     */
    //% block="input sequence button %btn"
    //% group="Sequence" weight=90
    export function inputSequence(btn: ButtonOption): void {
        _seqBuffer.push(btn === ButtonOption.A ? "A" : "B")
        if (_seqBuffer.length > 3) _seqBuffer.shift()
    }

    /**
     * Hexagonal block for 'if' statements.
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

    // === PIN PUZZLE ===

    //% block="set secret PIN %pin"
    //% group="PIN" weight=100
    export function setSecretPin(pin: string): void {
        _pinSecret = []
        _pinEntered = []
        let parts = pin.split(" ")
        for (let i = 0; i < parts.length; i++) _pinSecret.push(parseInt(parts[i]))
    }

    //% block="change current PIN digit"
    //% group="PIN" weight=90
    export function cyclePinDigit(): void {
        _pinDigit = (_pinDigit + 1) % 10
        basic.showNumber(_pinDigit)
    }

    //% block="submit current PIN digit"
    //% group="PIN" weight=85
    export function enterPinDigit(): void {
        _pinEntered.push(_pinDigit)
        _pinDigit = 0
        basic.clearScreen()
    }

    /**
     * Hexagonal block for 'if' statements.
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

    // === MORSE PUZZLE ===

    //% block="set secret Morse %word"
    //% group="Morse" weight=100
    export function setSecretMorse(word: string): void {
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
        // Simple mapping for demo
        if (_morseBuffer == ".-") _morseDecoded += "A"
        else if (_morseBuffer == "-...") _morseDecoded += "B"
        else _morseDecoded += "?"
        _morseBuffer = ""
    }

    /**
     * Hexagonal block for 'if' statements.
     */
    //% block="Morse is correct"
    //% group="Morse" weight=80
    export function isMorseCorrect(): boolean {
        return _morseDecoded === _morseSecret
    }

    // === GENERAL ===

    //% block="show solved"
    //% group="General" weight=100
    export function showSolved(): void {
        basic.showIcon(IconNames.Yes)
        music.playTone(Note.C, 200)
    }
}



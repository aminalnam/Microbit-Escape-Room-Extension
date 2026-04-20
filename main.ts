//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    export enum ButtonOption { A, B }

    // --- Global State ---
    let _locked = false
    let _solved = false
    
    // --- Sequence State ---
    let _seqSecret: string[] = []
    let _seqBuffer: string[] = []
    let _onSeqCorrect: () => void = null

    // --- PIN State ---
    let _pinSecret: number[] = []
    let _pinEntered: number[] = []
    let _pinCurrentDigit = 0
    let _onPinCorrect: () => void = null

    // --- Morse State ---
    let _morseSecret = ""
    let _morseBuffer = ""
    let _morseDecoded = ""
    let _onMorseCorrect: () => void = null

    // --- Pattern State ---
    let _patSecret: number[] = []
    let _patDrawing: number[] = []
    let _patCursor = 0
    let _onPatCorrect: () => void = null

    // === SEQUENCE PUZZLE ===

    //% block="set secret sequence %a then %b then %c"
    //% group="Sequence Puzzle" weight=100
    export function setSecretSequence(a: string, b: string, c: string): void {
        _seqSecret = [a, b, c]
        _seqBuffer = []

        input.onButtonPressed(Button.A, function () {
            if (_locked || _solved) return
            _seqBuffer.push("A")
            if (_seqBuffer.length > 3) _seqBuffer.shift()
            _checkSeq()
        })

        input.onButtonPressed(Button.B, function () {
            if (_locked || _solved) return
            _seqBuffer.push("B")
            if (_seqBuffer.length > 3) _seqBuffer.shift()
            _checkSeq()
        })
    }

    //% block="on sequence correct"
    //% group="Sequence Puzzle" weight=90
    //% handlerStatement=1
    export function onSequenceCorrect(handler: () => void): void {
        _onSeqCorrect = handler
    }

    function _checkSeq(): void {
        if (_seqBuffer.length < 3) return
        let match = true
        for (let i = 0; i < 3; i++) {
            if (_seqBuffer[i] !== _seqSecret[i]) { match = false; break }
        }
        if (match && _onSeqCorrect) _onSeqCorrect()
    }

    // === PIN PUZZLE ===

    //% block="set secret PIN %pin"
    //% group="PIN Puzzle" weight=100
    export function setSecretPin(pin: string): void {
        _pinSecret = []
        _pinEntered = []
        let parts = pin.split(" ")
        for (let i = 0; i < parts.length; i++) {
            _pinSecret.push(parseInt(parts[i]))
        }

        input.onButtonPressed(Button.A, function () {
            if (_locked || _solved) return
            _pinCurrentDigit = (_pinCurrentDigit + 1) % 10
            basic.showNumber(_pinCurrentDigit)
        })

        input.onButtonPressed(Button.B, function () {
            if (_locked || _solved) return
            _pinEntered.push(_pinCurrentDigit)
            _pinCurrentDigit = 0
            basic.clearScreen()
        })

        input.onButtonPressed(Button.AB, function () {
            if (_pinEntered.length === _pinSecret.length) {
                let match = true
                for (let i = 0; i < _pinSecret.length; i++) {
                    if (_pinEntered[i] !== _pinSecret[i]) { match = false; break }
                }
                if (match && _onPinCorrect) _onPinCorrect()
                else _pinEntered = []
            }
        })
    }

    //% block="on PIN correct"
    //% group="PIN Puzzle" weight=90
    //% handlerStatement=1
    export function onPinCorrect(handler: () => void): void {
        _onPinCorrect = handler
    }

    // === MORSE PUZZLE ===

    //% block="set secret Morse word %word"
    //% group="Morse Puzzle" weight=100
    export function setSecretMorseWord(word: string): void {
        _morseSecret = word.toUpperCase()
        
        input.onButtonPressed(Button.A, function () { _morseBuffer += "." })
        input.onButtonPressed(Button.B, function () { _morseBuffer += "-" })
        input.onButtonPressed(Button.AB, function () {
            let ch = _morseToChar(_morseBuffer)
            _morseDecoded += ch
            _morseBuffer = ""
            basic.showString(ch)
            if (_morseDecoded === _morseSecret && _onMorseCorrect) _onMorseCorrect()
        })
    }

    //% block="on Morse correct"
    //% group="Morse Puzzle" weight=90
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

    // === PATTERN PUZZLE ===

    //% block="set secret pattern %bits flash for %ms ms"
    //% group="Pattern Puzzle" weight=100
    export function setSecretPattern(bits: string, ms: number): void {
        _patSecret = []
        for (let i = 0; i < 25; i++) _patSecret.push(bits.charAt(i) === "1" ? 1 : 0)
        _patDrawing = []
        for (let j = 0; j < 25; j++) _patDrawing.push(0)

        input.onButtonPressed(Button.A, function () {
            _patCursor = (_patCursor + 1) % 25
        })

        input.onButtonPressed(Button.B, function () {
            _patDrawing[_patCursor] = _patDrawing[_patCursor] == 0 ? 1 : 0
        })

        input.onButtonPressed(Button.AB, function () {
            let match = true
            for (let k = 0; k < 25; k++) {
                if (_patDrawing[k] !== _patSecret[k]) { match = false; break }
            }
            if (match && _onPatCorrect) _onPatCorrect()
        })
    }

    //% block="on pattern correct"
    //% group="Pattern Puzzle" weight=90
    //% handlerStatement=1
    export function onPatternCorrect(handler: () => void): void {
        _onPatCorrect = handler
    }

    // === RESPONSES ===

    //% block="show solved"
    //% group="Responses" weight=100
    export function showSolved(): void {
        _solved = true
        basic.showIcon(IconNames.Yes)
    }
}



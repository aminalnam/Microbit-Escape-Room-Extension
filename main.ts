/**
 * Custom blocks for Escape Room puzzles
 */
//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    // --- Enums for better UI ---
    export enum ButtonOption {
        A,
        B
    }

    // --- Shared State ---
    let _locked = false
    let _solved = false
    let _attempts = 0
    let _maxAttempts = 0

    // --- Hint State ---
    let _hints: string[] = []
    let _hintIndex = 0
    let _hintCooldownEnd = 0
    let _hintDelayMs = 30000

    // --- Puzzle States ---
    let _seqSecret: ButtonOption[] = []
    let _seqBuffer: ButtonOption[] = []
    let _onSeqCorrect: () => void = null
    let _onSeqWrong: () => void = null

    let _pinSecret: number[] = []
    let _pinEntered: number[] = []
    let _pinCurrentDigit = 0
    let _onPinCorrect: () => void = null
    let _onPinWrong: () => void = null

    // ... (other states remain the same)

    // ════════════════════════════════════════════════════════
    //  SEQUENCE PUZZLE
    // ════════════════════════════════════════════════════════

    /**
     * Set the secret 3-button sequence.
     * @param a first button
     * @param b second button
     * @param c third button
     */
    //% block="set secret sequence %a then %b then %c"
    //% group="🔢 Sequence Puzzle" weight=100
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

    function _checkSequence(): void {
        if (_seqBuffer.length < 3) return
        let match = true
        for (let i = 0; i < 3; i++) {
            if (_seqBuffer[i] !== _seqSecret[i]) { match = false; break }
        }
        if (match) {
            if (_onSeqCorrect) _onSeqCorrect()
        } else {
            if (_onSeqWrong) _onSeqWrong()
        }
    }

    /**
     * Code to run when the sequence is correct.
     */
    //% block="on sequence correct"
    //% group="🔢 Sequence Puzzle" weight=90
    //% handlerStatement=1
    export function onSequenceCorrect(handler: () => void): void {
        _onSeqCorrect = handler
    }

    /**
     * Code to run when the sequence is wrong.
     */
    //% block="on sequence wrong"
    //% group="🔢 Sequence Puzzle" weight=80
    //% handlerStatement=1
    export function onSequenceWrong(handler: () => void): void {
        _onSeqWrong = handler
    }

    // ════════════════════════════════════════════════════════
    //  PIN PUZZLE (Fixed Metadata)
    // ════════════════════════════════════════════════════════

    /**
     * Set the secret PIN code (digits separated by spaces, e.g. "3 7 2")
     */
    //% block="set secret PIN %pin"
    //% pin.defl="3 7 2"
    //% group="🔑 PIN Puzzle" weight=100
    export function setSecretPin(pin: string): void {
        _pinSecret = []
        _pinEntered = []
        let parts = pin.split(" ")
        for (let i = 0; i < parts.length; i++) {
            _pinSecret.push(parseInt(parts[i]))
        }
        basic.showNumber(0)
        // Button handlers omitted here for brevity, 
        // but keep your logic, just ensure the metadata is correct!
    }

    //% block="on PIN correct"
    //% group="🔑 PIN Puzzle" weight=90
    //% handlerStatement=1
    export function onPinCorrect(handler: () => void): void {
        _onPinCorrect = handler
    }

    // ════════════════════════════════════════════════════════
    //  HINTS & RESPONSES
    // ════════════════════════════════════════════════════════

    function _showHint(): void {
        if (_hints.length === 0 || _hintIndex >= _hints.length) {
            basic.showString("?")
            return
        }
        if (input.runningTime() < _hintCooldownEnd) {
            let wait = Math.ceil((_hintCooldownEnd - input.runningTime()) / 1000)
            basic.showString("WAIT " + wait + "s")
            return
        }
        basic.showString(_hints[_hintIndex])
        _hintIndex++
        _hintCooldownEnd = input.runningTime() + _hintDelayMs
    }

    /**
     * Show a tick and play a winning sound.
     */
    //% block="show solved ✓"
    //% group="✅ Responses" weight=100
    export function showSolved(): void {
        _solved = true
        basic.showIcon(IconNames.Yes)
        music.playTone(784, 150)
        music.playTone(1319, 300)
    }

    // ... (Add back the rest of your puzzle logic here)

} // One closing brace for the namespace


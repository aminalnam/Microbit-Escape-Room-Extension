//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    export enum ButtonOption {
        A,
        B
    }

    // --- State Management ---
    let _locked = false
    let _solved = false
    
    let _seqSecret: ButtonOption[] = []
    let _seqBuffer: ButtonOption[] = []
    let _onSeqCorrect: () => void = null

    let _pinSecret: number[] = []
    let _pinEntered: number[] = []
    let _onPinCorrect: () => void = null

    // ==========================================
    //  SEQUENCE PUZZLE
    // ==========================================

    /**
     * Set the secret 3-button sequence.
     */
    //% block="set secret sequence %a then %b then %c"
    //% group="Sequence Puzzle" weight=100
    export function setSecretSequence(a: ButtonOption, b: ButtonOption, c: ButtonOption): void {
        _seqSecret = [a, b, c]
        _seqBuffer = []

        input.onButtonPressed(Button.A, function () {
            if (_locked || _solved) return
            _seqBuffer.push(ButtonOption.A)
            if (_seqBuffer.length > 3) _seqBuffer.shift()
            _checkSequence()
        })

        input.onButtonPressed(Button.B, function () {
            if (_locked || _solved) return
            _seqBuffer.push(ButtonOption.B)
            if (_seqBuffer.length > 3) _seqBuffer.shift()
            _checkSequence()
        })
    }

    /**
     * Check if the currently entered sequence is correct.
     * Use this inside 'if' blocks.
     */
    //% block="sequence is correct"
    //% group="Sequence Puzzle" weight=80
    export function isSequenceCorrect(): boolean {
        if (_seqBuffer.length < 3) return false
        for (let i = 0; i < 3; i++) {
            if (_seqBuffer[i] !== _seqSecret[i]) return false
        }
        return true
    }

    /**
     * Code to run automatically when the sequence is correct.
     */
    //% block="on sequence correct"
    //% group="Sequence Puzzle" weight=90
    //% handlerStatement=1
    export function onSequenceCorrect(handler: () => void): void {
        _onSeqCorrect = handler
    }

    function _checkSequence(): void {
        if (isSequenceCorrect() && _onSeqCorrect) {
            _onSeqCorrect()
        }
    }

    // ==========================================
    //  PIN PUZZLE
    // ==========================================

    /**
     * Check if the currently entered PIN is correct.
     * Use this inside 'if' blocks.
     */
    //% block="PIN is correct"
    //% group="PIN Puzzle" weight=80
    export function isPinCorrect(): boolean {
        if (_pinEntered.length !== _pinSecret.length) return false
        for (let i = 0; i < _pinSecret.length; i++) {
            if (_pinEntered[i] !== _pinSecret[i]) return false
        }
        return true
    }

    /**
     * Code to run automatically when the PIN is correct.
     */
    //% block="on PIN correct"
    //% group="PIN Puzzle" weight=90
    //% handlerStatement=1
    export function onPinCorrect(handler: () => void): void {
        _onPinCorrect = handler
    }

    // ==========================================
    //  GLOBAL ACTIONS
    // ==========================================

    /**
     * Mark the puzzle as solved and play a sound.
     */
    //% block="show solved"
    //% group="General" weight=100
    export function showSolved(): void {
        _solved = true
        basic.showIcon(IconNames.Yes)
        music.playTone(784, 150)
        music.playTone(1319, 300)
    }

    /**
     * Returns true if the puzzle has been solved.
     */
    //% block="is solved"
    //% group="General" weight=90
    export function isSolved(): boolean {
        return _solved
    }
}



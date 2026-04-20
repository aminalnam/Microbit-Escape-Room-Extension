//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    export enum ButtonOption { A, B }

    // --- State ---
    let _seqSecret: ButtonOption[] = []
    let _seqBuffer: ButtonOption[] = []
    let _onSeqCorrect: () => void = null
    let _onSeqWrong: () => void = null

    // ==========================================
    //  1. SETUP BLOCKS (Go in "on start")
    // ==========================================

    /**
     * Define the secret code.
     */
    //% block="set secret sequence %a %b %c"
    //% group="1. Setup" weight=100
    export function setSecretSequence(a: ButtonOption, b: ButtonOption, c: ButtonOption): void {
        _seqSecret = [a, b, c]
        _seqBuffer = []
    }

    // ==========================================
    //  2. INPUT BLOCKS (The player uses these)
    // ==========================================

    /**
     * Add a button press to the current sequence attempt.
     * Put this inside a standard "on button A pressed" block.
     */
    //% block="input sequence button %button"
    //% group="2. Player Input" weight=100
    export function inputSequence(button: ButtonOption): void {
        _seqBuffer.push(button)
        if (_seqBuffer.length > 3) _seqBuffer.shift()
        
        // Visual feedback
        if (button === ButtonOption.A) led.plot(0, 0)
        else led.plot(4, 0)
        basic.pause(100)
        basic.clearScreen()

        _checkSequence()
    }

    // ==========================================
    //  3. EVENT BLOCKS (The reaction)
    // ==========================================

    /**
     * This block runs its code when the sequence matches.
     */
    //% block="on sequence correct"
    //% group="3. Events" weight=90
    //% handlerStatement=1
    export function onSequenceCorrect(handler: () => void): void {
        _onSeqCorrect = handler
    }

    /**
     * This block runs its code when the sequence is wrong.
     */
    //% block="on sequence wrong"
    //% group="3. Events" weight=80
    //% handlerStatement=1
    export function onSequenceWrong(handler: () => void): void {
        _onSeqWrong = handler
    }

    // ==========================================
    //  4. LOGIC BLOCKS (For 'if' statements)
    // ==========================================

    /**
     * Returns true if the sequence is currently correct.
     */
    //% block="sequence is correct"
    //% group="4. Logic" weight=70
    export function isSequenceCorrect(): boolean {
        if (_seqBuffer.length < 3) return false
        for (let i = 0; i < 3; i++) {
            if (_seqBuffer[i] !== _seqSecret[i]) return false
        }
        return true
    }

    function _checkSequence(): void {
        if (_seqBuffer.length < 3) return
        if (isSequenceCorrect()) {
            if (_onSeqCorrect) _onSeqCorrect()
        } else {
            if (_onSeqWrong) _onSeqWrong()
        }
    }
}



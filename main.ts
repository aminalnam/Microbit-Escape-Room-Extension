//% color="#000000" weight=100 icon="\uf023" block="Escape Puzzles"
namespace escapePuzzles {

    export enum Pad {
        //% block="A"
        A,
        //% block="B"
        B
    }

    // --- State Variables ---
    let pinSecret = "1234"
    let pinAttempt = ""
    let currentDigit = 0

    let seqSecret = "AAB"
    let seqAttempt = ""

    // Event handlers
    let seqSuccessHandler: () => void = null
    let seqFailHandler: () => void = null

    // ════════════════════════════════════════════════════════
    // 🔑 PIN CODE PUZZLE
    // ════════════════════════════════════════════════════════

    //% block="set secret PIN to %pin"
    //% group="PIN Code" weight=100
    export function setPin(pin: string) {
        pinSecret = pin
        pinAttempt = ""
        currentDigit = 0
    }

    //% block="cycle current digit"
    //% group="PIN Code" weight=90
    export function cycleDigit() {
        currentDigit = (currentDigit + 1) % 10
        basic.showNumber(currentDigit)
    }

    //% block="save current digit"
    //% group="PIN Code" weight=80
    export function saveDigit() {
        pinAttempt = pinAttempt + currentDigit.toString()
        currentDigit = 0
        basic.clearScreen()
    }

    //% block="PIN is correct"
    //% group="PIN Code" weight=70
    export function isPinCorrect(): boolean {
        return pinAttempt == pinSecret
    }

    //% block="clear PIN"
    //% group="PIN Code" weight=60
    export function clearPin() {
        pinAttempt = ""
        currentDigit = 0
    }

    //% block="current PIN attempt"
    //% group="PIN Code" weight=50
    export function getPinAttempt(): string {
        return pinAttempt
    }

    // ════════════════════════════════════════════════════════
    // 🔢 SEQUENCE PUZZLE (FIXED)
    // ════════════════════════════════════════════════════════

    //% block="set secret sequence to %seq"
    //% group="Sequence" weight=100
    export function setSequence(seq: string) {
        seqSecret = seq.toUpperCase()
        seqAttempt = ""
    }

    //% block="add %button to sequence"
    //% group="Sequence" weight=90
    export function addSequence(button: Pad) {

        // Append correctly (this was NOT the real issue, but keeping clean)
        if (button == Pad.A) {
            seqAttempt += "A"
        } else {
            seqAttempt += "B"
        }

        // 🔥 AUTO-CHECK when sequence reaches correct length
        if (seqAttempt.length == seqSecret.length) {

            if (seqAttempt == seqSecret) {
                if (seqSuccessHandler) seqSuccessHandler()
            } else {
                if (seqFailHandler) seqFailHandler()
            }

            // Reset AFTER evaluation
            seqAttempt = ""
        }
    }

    //% block="on sequence correct"
    //% group="Sequence" weight=80
    export function onSequenceCorrect(handler: () => void) {
        seqSuccessHandler = handler
    }

    //% block="on sequence wrong"
    //% group="Sequence" weight=70
    export function onSequenceWrong(handler: () => void) {
        seqFailHandler = handler
    }

    //% block="clear sequence"
    //% group="Sequence" weight=60
    export function clearSequence() {
        seqAttempt = ""
    }

    //% block="current sequence"
    //% group="Sequence" weight=50
    export function getSequenceAttempt(): string {
        return seqAttempt
    }
}


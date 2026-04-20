//% color="#000000" weight=100 icon="\uf023" block="Escape Puzzles"
namespace escapePuzzles {

    export enum Pad {
        //% block="A"
        A,
        //% block="B"
        B
    }

    // --- State ---
    let pinSecret = "1234"
    let pinAttempt = ""
    let currentDigit = 0

    let seqSecret = "AAB"
    let seqAttempt = ""

    // --- Events ---
    let pinSuccessHandler: () => void = null
    let seqSuccessHandler: () => void = null

    // ═════════ PIN ═════════

    //% block="set PIN %pin"
    export function setPin(pin: string) {
        pinSecret = pin
        pinAttempt = ""
        currentDigit = 0
    }

    //% block="cycle digit"
    export function cycleDigit() {
        currentDigit = (currentDigit + 1) % 10
        basic.showNumber(currentDigit)
    }

    //% block="save digit"
    export function saveDigit() {
        pinAttempt += currentDigit
        currentDigit = 0
    }

    //% block="check PIN"
    export function checkPin() {
        if (pinAttempt == pinSecret && pinSuccessHandler) {
            pinSuccessHandler()
        }
        pinAttempt = ""
    }

    //% block="on PIN correct"
    export function onPinCorrect(handler: () => void) {
        pinSuccessHandler = handler
    }

    // ═════════ SEQUENCE ═════════

    //% block="set sequence %seq"
    export function setSequence(seq: string) {
        seqSecret = seq.toUpperCase()
        seqAttempt = ""
    }

    //% block="add %button"
    export function addSequence(button: Pad) {
        if (button == Pad.A) {
            seqAttempt += "A"
        } else {
            seqAttempt += "B"
        }
    }

    //% block="check sequence"
    export function checkSequence() {
        if (seqAttempt == seqSecret && seqSuccessHandler) {
            seqSuccessHandler()
        }
        seqAttempt = ""
    }

    //% block="on sequence correct"
    export function onSequenceCorrect(handler: () => void) {
        seqSuccessHandler = handler
    }
}



//% color="#000000" weight=100 icon="\uf023" block="Escape Puzzles"
namespace escapePuzzles {

    // --- State Variables ---
    let pinSecret = "1234"
    let pinAttempt = ""
    let currentDigit = 0

    let seqSecret = "AAB"
    let seqAttempt = ""

    // ════════════════════════════════════════════════════════
    // 🔑 PIN CODE PUZZLE
    // ════════════════════════════════════════════════════════

    //% block="set secret PIN to %pin"
    //% group="PIN Code" weight=100
    export function setPin(pin: string) {
        // Automatically strips out accidental spaces
        let cleanPin = ""
        for (let i = 0; i < pin.length; i++) {
            if (pin.charAt(i) !== " ") {
                cleanPin += pin.charAt(i)
            }
        }
        pinSecret = cleanPin;
        pinAttempt = "";
        currentDigit = 0;
    }

    //% block="cycle current digit"
    //% group="PIN Code" weight=90
    export function cycleDigit() {
        currentDigit = (currentDigit + 1) % 10;
        basic.showNumber(currentDigit);
    }

    //% block="save current digit to attempt"
    //% group="PIN Code" weight=80
    export function saveDigit() {
        pinAttempt = pinAttempt + currentDigit.toString();
        currentDigit = 0;
        basic.clearScreen();
    }

    //% block="PIN is correct"
    //% group="PIN Code" weight=70
    export function isPinCorrect(): boolean {
        return pinAttempt === pinSecret;
    }

    //% block="clear PIN attempt"
    //% group="PIN Code" weight=60
    export function clearPin() {
        pinAttempt = "";
        currentDigit = 0;
    }

    //% block="current PIN attempt"
    //% group="PIN Code" weight=50
    export function getPinAttempt(): string {
        return pinAttempt;
    }

    // ════════════════════════════════════════════════════════
    // 🔢 SEQUENCE PUZZLE
    // ════════════════════════════════════════════════════════

    //% block="set secret sequence to %seq"
    //% group="Sequence" weight=100
    export function setSequence(seq: string) {
        // Automatically strips out accidental spaces
        let cleanSeq = ""
        for (let i = 0; i < seq.length; i++) {
            if (seq.charAt(i) !== " ") {
                cleanSeq += seq.charAt(i)
            }
        }
        seqSecret = cleanSeq.toUpperCase()
        seqAttempt = ""
    }

    //% block="add A to sequence attempt"
    //% group="Sequence" weight=90
    export function addSequenceA() {
        seqAttempt = seqAttempt + "A"
    }

    //% block="add B to sequence attempt"
    //% group="Sequence" weight=80
    export function addSequenceB() {
        seqAttempt = seqAttempt + "B"
    }

    //% block="sequence is correct"
    //% group="Sequence" weight=70
    export function isSequenceCorrect(): boolean {
        return seqAttempt === seqSecret
    }

    //% block="clear sequence attempt"
    //% group="Sequence" weight=60
    export function clearSequence() {
        seqAttempt = ""
    }

    //% block="current sequence attempt"
    //% group="Sequence" weight=50
    export function getSequenceAttempt(): string {
        return seqAttempt
    }
}



//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    // --- State ---
    let _seqSecret = ""
    let _seqAttempt = ""

    let _pinSecret = ""
    let _pinAttempt = ""
    let _pinDigit = 0

    let _morseSecret = ""
    let _morseLetter = ""
    let _morseAttempt = ""

    // ════════════════════════════════════════════════════════
    //  1. SEQUENCE PUZZLE
    // ════════════════════════════════════════════════════════

    //% block="set secret sequence %a %b %c"
    //% group="Sequence" weight=100
    export function setSecretSeq(a: string, b: string, c: string) { 
        _seqSecret = a + b + c; 
        _seqAttempt = ""; 
    }

    //% block="add %btn to sequence attempt"
    //% group="Sequence" weight=90
    export function addSeq(btn: string) { 
        _seqAttempt += btn; 
    }

    //% block="sequence is correct"
    //% group="Sequence" weight=80
    export function isSeqCorrect(): boolean { 
        return _seqAttempt === _seqSecret; 
    }

    //% block="clear sequence attempt"
    //% group="Sequence" weight=70
    export function clearSeq() { 
        _seqAttempt = ""; 
    }

    //% block="current sequence attempt"
    //% group="Sequence" weight=60
    export function getSeq(): string { 
        return _seqAttempt; 
    }

    // ════════════════════════════════════════════════════════
    //  2. PIN PUZZLE
    // ════════════════════════════════════════════════════════

    //% block="set secret PIN %pin"
    //% group="PIN" weight=100
    export function setSecretPin(pin: string) { 
        _pinSecret = pin.split(" ").join(""); // Removes spaces if user typed "1 2 3"
        _pinAttempt = ""; 
    }

    //% block="change current PIN digit"
    //% group="PIN" weight=90
    export function changePinDigit() { 
        _pinDigit = (_pinDigit + 1) % 10; 
        basic.showNumber(_pinDigit); 
    }

    //% block="add current digit to PIN attempt"
    //% group="PIN" weight=85
    export function addPinDigit() { 
        _pinAttempt += _pinDigit.toString(); 
        _pinDigit = 0; 
        basic.clearScreen(); 
    }

    //% block="PIN is correct"
    //% group="PIN" weight=80
    export function isPinCorrect(): boolean { 
        return _pinAttempt === _pinSecret; 
    }

    //% block="clear PIN attempt"
    //% group="PIN" weight=70
    export function clearPin() { 
        _pinAttempt = ""; 
        _pinDigit = 0; 
    }

    //% block="current PIN attempt"
    //% group="PIN" weight=60
    export function getPin(): string { 
        return _pinAttempt; 
    }

    // ════════════════════════════════════════════════════════
    //  3. MORSE PUZZLE
    // ════════════════════════════════════════════════════════

    //% block="set secret Morse %word"
    //% group="Morse" weight=100
    export function setSecretMorse(word: string) { 
        _morseSecret = word.toUpperCase(); 
        _morseAttempt = ""; 
    }

    //% block="add Morse %sym to letter"
    //% group="Morse" weight=90
    export function addMorse(sym: string) { 
        _morseLetter += sym; 
    }

    //% block="submit Morse letter"
    //% group="Morse" weight=85
    export function submitMorseLetter() {
        let codes = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."]
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        let index = codes.indexOf(_morseLetter)
        let ch = (index >= 0) ? chars.charAt(index) : "?"
        _morseAttempt += ch
        _morseLetter = ""
        basic.showString(ch)
    }

    //% block="Morse is correct"
    //% group="Morse" weight=80
    export function isMorseCorrect(): boolean { 
        return _morseAttempt === _morseSecret; 
    }

    //% block="clear Morse attempt"
    //% group="Morse" weight=70
    export function clearMorse() { 
        _morseAttempt = ""; 
        _morseLetter = ""; 
    }

    //% block="current Morse attempt"
    //% group="Morse" weight=60
    export function getMorse(): string { 
        return _morseAttempt; 
    }
    
    // ════════════════════════════════════════════════════════
    //  4. RESPONSES
    // ════════════════════════════════════════════════════════

    //% block="show solved"
    //% group="General" weight=100
    export function showSolved(): void {
        basic.showIcon(IconNames.Yes)
    }
}



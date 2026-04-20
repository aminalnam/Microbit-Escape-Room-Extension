//% color="#000000" weight=100 icon="\uf023" block="Escape Puzzles"
namespace escapePuzzles {
   export enum Pad {
       //% block="A"
       A,
       //% block="B"
       B
   }


   let pinSecret = "1234"
   let pinAttempt = ""
   let currentDigit = 0


   let seqSecret = "AAB"
   let seqAttempt = ""


   function normalizePin(pin: string): string {
       let normalized = ""
       for (let i = 0; i < pin.length; i++) {
           let ch = pin.charAt(i)
           if (ch >= "0" && ch <= "9") {
               normalized += ch
           }
       }
       return normalized
   }


   function normalizeSequence(seq: string): string {
       let normalized = ""
       let upper = seq.toUpperCase()
       for (let i = 0; i < upper.length; i++) {
           let ch = upper.charAt(i)
           if (ch == "A" || ch == "B") {
               normalized += ch
           }
       }
       return normalized
   }


   function digitToText(digit: number): string {
       return "" + digit
   }


   //% block="set secret PIN to $pin"
   //% group="PIN Code" weight=100
   export function setPin(pin: string) {
       pinSecret = normalizePin(pin)
       pinAttempt = ""
       currentDigit = 0
   }


   //% block="cycle current digit"
   //% group="PIN Code" weight=90
   export function cycleDigit() {
       currentDigit = (currentDigit + 1) % 10
       basic.showNumber(currentDigit)
   }


   //% block="save current digit to attempt"
   //% group="PIN Code" weight=80
   export function saveDigit() {
       if (pinAttempt.length >= pinSecret.length) {
           pinAttempt = ""
       }


       pinAttempt += digitToText(currentDigit)
       currentDigit = 0
       basic.clearScreen()
   }


   //% block="PIN is correct"
   //% group="PIN Code" weight=70
   export function isPinCorrect(): boolean {
       return pinAttempt == pinSecret
   }


   //% block="clear PIN attempt"
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


   //% block="set secret sequence to $seq"
   //% group="Sequence" weight=100
   export function setSequence(seq: string) {
       seqSecret = normalizeSequence(seq)
       seqAttempt = ""
   }


   //% block="add button $button to sequence"
   //% group="Sequence" weight=90
   export function addSequence(button: Pad) {
       if (seqAttempt.length >= seqSecret.length) {
           seqAttempt = ""
       }


       if (button == Pad.A) {
           seqAttempt += "A"
       } else {
           seqAttempt += "B"
       }
   }


   //% block="sequence is correct"
   //% group="Sequence" weight=70
   export function isSequenceCorrect(): boolean {
       return seqAttempt == seqSecret
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



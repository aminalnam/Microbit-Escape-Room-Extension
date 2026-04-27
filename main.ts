//% color="#AA278F" icon="\uf11b" block="Escape"
namespace Escape {
    let memory = "";
    let dialNumber = 0;

    // ==========================================
    //  TEXT ENTRY (For Letters)
    // ==========================================

    //% block="add $letter to code"
    //% group="Text" weight=100
    export function addLetter(letter: string): void {
        memory = memory + letter;
        // Flash the letter on screen
        basic.showString(letter);
        basic.clearScreen();
    }

    // ==========================================
    //  NUMBER DIAL (For PIN Codes)
    // ==========================================

    //% block="scroll number dial up"
    //% group="Numbers" weight=100
    export function scrollDial(): void {
        dialNumber++;
        if (dialNumber > 9) {
            dialNumber = 0;
        }
        // Show the current number on the dial
        basic.showNumber(dialNumber);
    }

    //% block="enter dial number"
    //% group="Numbers" weight=90
    export function enterNumber(): void {
        memory = memory + dialNumber.toString();
        // Flash a dot to confirm the number was entered
        basic.clearScreen();
        led.plot(2, 2);
        basic.pause(200);
        basic.clearScreen();
        // Reset dial back to 0
        dialNumber = 0;
    }

    // ==========================================
    //  LOGIC & MEMORY
    // ==========================================

    //% block="code ends with $password"
    //% group="Logic" weight=100
    export function checkPassword(password: string): boolean {
        if (memory.length < password.length) {
            return false;
        }
        let ending = memory.substr(memory.length - password.length, password.length);
        return ending == password;
    }

    //% block="clear code"
    //% group="Logic" weight=90
    export function clearCode(): void {
        memory = "";
        // Flash an X to confirm memory is wiped
        basic.showIcon(IconNames.No);
        basic.pause(200);
        basic.clearScreen();
    }
}

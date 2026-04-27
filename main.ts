//% color="#AA278F" icon="\uf11b" block="Escape Room"
namespace Escape {
    let memory = "";
    let dialNumber = 0;

    // ==========================================
    //  TEXT ENTRY (For Letters)
    // ==========================================

    //% block="add text $letter to code"
    //% group="Text" weight=100
    export function addLetter(letter: string): void {
        memory = memory + letter;
        
        // Flash the letter on screen so you know the button worked
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
        // Show the current number on the screen
        basic.showNumber(dialNumber);
    }

    //% block="enter dial number"
    //% group="Numbers" weight=90
    export function enterNumber(): void {
        // Add the number to the secret memory
        memory = memory + dialNumber.toString();
        
        // Flash a small dot to confirm the number was saved
        basic.clearScreen();
        led.plot(2, 2);
        basic.pause(200);
        basic.clearScreen();
        
        // Reset dial back to 0 for the next digit
        dialNumber = 0;
    }

    // ==========================================
    //  LOGIC & MEMORY
    // ==========================================

    //% block="code ends with $password"
    //% group="Logic" weight=100
    export function checkPassword(password: string): boolean {
        // If they haven't typed enough characters yet, it can't match
        if (memory.length < password.length) {
            return false;
        }
        
        // Grab only the very end of what they typed and check it
        let ending = memory.substr(memory.length - password.length, password.length);
        return ending == password;
    }

    //% block="clear code"
    //% group="Logic" weight=90
    export function clearCode(): void {
        memory = "";
        
        // Flash an X to confirm the memory was wiped clean
        basic.showIcon(IconNames.No);
        basic.pause(200);
        basic.clearScreen();
    }
}

//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {
    
    let inputBuffer: string = "";

    //% block="add text %val to entered code"
    //% group="⌨️ Code Entry" weight=100
    export function addTextToCode(val: string): void {
        inputBuffer += val.toUpperCase();
        
        // Flashes the letter on screen so you know it worked
        basic.showString(val.toUpperCase());
        basic.clearScreen();
    }

    //% block="clear entered code"
    //% group="⌨️ Code Entry" weight=80
    export function clearCode(): void {
        inputBuffer = "";
        
        // Flashes an X so you know the memory was wiped
        basic.showIcon(IconNames.No);
        basic.pause(200);
        basic.clearScreen();
    }

    //% block="entered code ends with %secret"
    //% group="✅ Logic" weight=100
    export function codeEndsWith(secret: string): boolean {
        let s = secret.toUpperCase();
        if (inputBuffer.length < s.length) {
            return false;
        }
        let endOfString = inputBuffer.substr(inputBuffer.length - s.length, s.length);
        return endOfString === s;
    }
}

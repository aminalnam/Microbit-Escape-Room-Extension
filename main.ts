//% color="#AA278F" icon="\uf11b" block="Escape"
namespace Escape {
    let memory = "";

    //% block="add %value to code"
    export function addToCode(value: string): void {
        memory = memory + value.toUpperCase();
        
        // Flash what was pressed
        basic.showString(value.toUpperCase());
        basic.clearScreen();
    }

    //% block="code ends with %password"
    export function checkPassword(password: string): boolean {
        let target = password.toUpperCase();
        if (memory.length < target.length) {
            return false;
        }
        let ending = memory.substr(memory.length - target.length, target.length);
        return ending == target;
    }

    //% block="clear code"
    export function clearCode(): void {
        memory = "";
        
        // Flash an X to show it cleared
        basic.showIcon(IconNames.No);
        basic.pause(200);
        basic.clearScreen();
    }
}

//% color="#AA278F" icon="\uf11b" block="Escape"
//% groups="['Text', 'Numbers', 'Logic']"
namespace Escape {
    let memory = "";
    let dialNumber = 0;

    //% block="add text %letter to code"
    //% group="Text" weight=100
    export function addLetter(letter: string): void {
        memory = memory + letter;
        basic.showString(letter);
        basic.clearScreen();
    }

    //% block="scroll number dial up"
    //% group="Numbers" weight=100
    export function scrollDial(): void {
        dialNumber++;
        if (dialNumber > 9) {
            dialNumber = 0;
        }
        basic.showNumber(dialNumber);
    }

    //% block="enter dial number"
    //% group="Numbers" weight=90
    export function enterNumber(): void {
        memory = memory + dialNumber.toString();
        basic.clearScreen();
        led.plot(2, 2);
        basic.pause(200);
        basic.clearScreen();
        dialNumber = 0;
    }

    //% block="code ends with %password"
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
        basic.showIcon(IconNames.No);
        basic.pause(200);
        basic.clearScreen();
    }
}

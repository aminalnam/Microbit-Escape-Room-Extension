//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {
    
    // The invisible piece of paper where we write down button presses
    let inputBuffer: string = "";

    // ==========================================
    //  INPUT & TRACKING
    // ==========================================

    /**
     * Adds text to the entered code. Automatically makes it uppercase.
     */
    //% block="add text %val to entered code"
    //% group="⌨️ Code Entry" weight=100
    export function addTextToCode(val: string): void {
        inputBuffer += val.toUpperCase();
    }

    /**
     * Adds a number to the entered code.
     */
    //% block="add number %val to entered code"
    //% group="⌨️ Code Entry" weight=90
    export function addNumberToCode(val: number): void {
        inputBuffer += val.toString();
    }

    /**
     * Acts like a backspace button. Removes the last thing typed.
     */
    //% block="remove last character"
    //% group="⌨️ Code Entry" weight=85
    export function removeLastCharacter(): void {
        if (inputBuffer.length > 0) {
            inputBuffer = inputBuffer.substr(0, inputBuffer.length - 1);
        }
    }

    /**
     * Clears the entered code so the player can start over from scratch.
     */
    //% block="clear entered code"
    //% group="⌨️ Code Entry" weight=80
    export function clearCode(): void {
        inputBuffer = "";
    }

    /**
     * Returns the exact code the player has entered so far.
     */
    //% block="current entered code"
    //% group="⌨️ Code Entry" weight=70
    export function getCurrentCode(): string {
        return inputBuffer;
    }

    // ==========================================
    //  CHECKING (Perfect for If/Then blocks)
    // ==========================================

    /**
     * REAL KEYPAD BEHAVIOR: Checks if the end of the typed code matches the secret.
     * Example: If secret is "1234", typing "991234" will return true.
     */
    //% block="entered code ends with %secret"
    //% group="✅ Logic" weight=100
    export function codeEndsWith(secret: string): boolean {
        let s = secret.toUpperCase();
        // If they haven't typed enough characters yet, it can't match
        if (inputBuffer.length < s.length) return false;
        
        // Check only the very end of the string
        let endOfString = inputBuffer.substr(inputBuffer.length - s.length, s.length);
        return endOfString === s;
    }

    /**
     * STRICT BEHAVIOR: Checks if the entered code is exactly the secret and nothing else.
     */
    //% block="entered code is exactly %secret"
    //% group="✅ Logic" weight=90
    export function checkCodeExactly(secret: string): boolean {
        return inputBuffer === secret.toUpperCase();
    }

    /**
     * Checks if the entered code *contains* the secret anywhere inside it.
     */
    //% block="entered code contains %secret"
    //% group="✅ Logic" weight=80
    export function codeContains(secret: string): boolean {
        // indexOf returns -1 if the string is not found
        return inputBuffer.indexOf(secret.toUpperCase()) >= 0;
    }

    // ==========================================
    //  CIPHER & CRYPTOGRAPHY
    // ==========================================

    /**
     * Shifts letters and numbers forward or backward by a certain amount (Caesar Cipher).
     */
    //% block="cipher %text shift by %shift"
    //% group="🕵️ Cipher" weight=100
    export function caesarCipher(text: string, shift: number): string {
        let result = "";
        for (let i = 0; i < text.length; i++) {
            let charCode = text.charCodeAt(i);
            
            // Uppercase Letters (A-Z)
            if (charCode >= 65 && charCode <= 90) {
                result += String.fromCharCode(((charCode - 65 + shift) % 26 + 26) % 26 + 65);
            }
            // Lowercase Letters (a-z)
            else if (charCode >= 97 && charCode <= 122) {
                result += String.fromCharCode(((charCode - 97 + shift) % 26 + 26) % 26 + 97);
            }
            // Numbers (0-9)
            else if (charCode >= 48 && charCode <= 57) {
                result += String.fromCharCode(((charCode - 48 + shift) % 10 + 10) % 10 + 48);
            }
            // Keep spaces and punctuation the same
            else {
                result += text.charAt(i);
            }
        }
        return result;
    }
}

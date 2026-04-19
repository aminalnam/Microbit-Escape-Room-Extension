// ============================================================
//  Escape Room Extension for micro:bit / MakeCode
//  Blocks namespace: escapeRoom
// ============================================================

//% color="#AA278F" weight=100 icon="\uf11b" block="Escape Room"
namespace escapeRoom {

    // ════════════════════════════════════════════════════════
    //  GAME STATE
    // ════════════════════════════════════════════════════════

    let _locked = false
    let _solved = false

    /**
     * Returns true if the puzzle is currently locked (e.g. after a wrong attempt)
     */
    //% block="puzzle is locked"
    //% group="Game State"
    export function isLocked(): boolean { return _locked }

    /**
     * Returns true if the puzzle has been solved
     */
    //% block="puzzle is solved"
    //% group="Game State"
    export function isSolved(): boolean { return _solved }

    /**
     * Mark this puzzle as solved
     */
    //% block="mark puzzle solved"
    //% group="Game State"
    export function markSolved(): void { _solved = true }

    /**
     * Reset everything: sequences, PIN, timer, attempts, hints, Morse, patterns
     */
    //% block="reset all puzzles"
    //% group="Game State"
    export function resetAll(): void {
        _locked = false
        _solved = false
        _attempts = 0
        _maxAttempts = 0
        _hintIndex = 0
        _hintUnlockTime = 0
        _timerRunning = false
        _timerEnd = 0
        _timerDuration = 0
        _pinTarget = []
        _pinInput = []
        _pinDigit = 0
        _recordedSequence = []
        _inputSequence = []
        _sequenceLength = 3
        _morseBuffer = ""
        _morseTarget = ""
        _morseDecoded = ""
        _patternTarget = []
        _patternInput = []
        _cursorPos = 0
        basic.clearScreen()
    }

    // ════════════════════════════════════════════════════════
    //  FEEDBACK (SOLVED / WRONG)
    // ════════════════════════════════════════════════════════

    /**
     * Show a solved animation and play a happy sound
     */
    //% block="show solved animation"
    //% group="Feedback"
    export function showSolved(): void {
        basic.showIcon(IconNames.Yes)
        music.playTone(784, 200)
        music.playTone(988, 200)
        music.playTone(1319, 400)
    }

    /**
     * Show a wrong animation, play a sad sound, and lock input for %seconds seconds
     */
    //% block="show wrong and lock for %seconds seconds"
    //% seconds.min=1 seconds.max=60 seconds.defl=3
    //% group="Feedback"
    export function showWrongAndLock(seconds: number): void {
        _locked = true
        basic.showIcon(IconNames.No)
        music.playTone(220, 600)
        basic.pause(seconds * 1000)
        _locked = false
        basic.clearScreen()
    }

    // ════════════════════════════════════════════════════════
    //  BUTTON SEQUENCE PUZZLES
    // ════════════════════════════════════════════════════════

    let _recordedSequence: string[] = []
    let _inputSequence: string[] = []
    let _sequenceLength = 3

    /**
     * Set the secret button sequence length
     */
    //% block="set sequence length %len"
    //% len.min=1 len.max=10 len.defl=3
    //% group="Sequence"
    export function setSequenceLength(len: number): void {
        _sequenceLength = len
        _recordedSequence = []
        _inputSequence = []
    }

    /**
     * Add a button ("A" or "B") to the secret sequence
     */
    //% block="add %btn to secret sequence"
    //% group="Sequence"
    export function recordSecret(btn: string): void {
        if (_recordedSequence.length < _sequenceLength)
            _recordedSequence.push(btn)
    }

    /**
     * Log a player button press attempt
     */
    //% block="player presses button %btn"
    //% group="Sequence"
    export function playerPress(btn: string): void {
        _inputSequence.push(btn)
        if (_inputSequence.length > _sequenceLength)
            _inputSequence.shift()
    }

    /**
     * Returns true if the player's last inputs match the secret sequence
     */
    //% block="button sequence matches"
    //% group="Sequence"
    export function sequenceMatches(): boolean {
        if (_inputSequence.length < _sequenceLength) return false
        for (let i = 0; i < _sequenceLength; i++) {
            if (_inputSequence[i] !== _recordedSequence[i]) return false
        }
        return true
    }

    /**
     * Clear the player's current sequence input
     */
    //% block="clear player sequence"
    //% group="Sequence"
    export function clearPlayerSequence(): void {
        _inputSequence = []
    }

    // ════════════════════════════════════════════════════════
    //  PIN / NUMBER ENTRY
    // ════════════════════════════════════════════════════════

    let _pinTarget: number[] = []
    let _pinInput: number[] = []
    let _pinDigit = 0

    /**
     * Add a single digit to the secret PIN
     */
    //% block="add digit %d to secret PIN"
    //% d.min=0 d.max=9 d.defl=0
    //% group="PIN Entry"
    export function addPinDigit(d: number): void {
        _pinTarget.push(d)
    }

    /**
     * Increment the currently displayed digit (wraps 0 to 9 then back to 0)
     */
    //% block="increment current PIN digit"
    //% group="PIN Entry"
    export function pinIncrement(): void {
        _pinDigit = (_pinDigit + 1) % 10
        basic.showNumber(_pinDigit)
    }

    /**
     * Confirm the currently displayed digit and advance to the next position
     */
    //% block="confirm PIN digit"
    //% group="PIN Entry"
    export function pinConfirm(): void {
        _pinInput.push(_pinDigit)
        _pinDigit = 0
        basic.showNumber(_pinInput.length)
    }

    /**
     * Returns true if the entered PIN matches the secret PIN
     */
    //% block="PIN matches"
    //% group="PIN Entry"
    export function pinMatches(): boolean {
        if (_pinInput.length !== _pinTarget.length) return false
        for (let i = 0; i < _pinTarget.length; i++) {
            if (_pinInput[i] !== _pinTarget[i]) return false
        }
        return true
    }

    /**
     * Clear the player's PIN input (start over)
     */
    //% block="clear PIN input"
    //% group="PIN Entry"
    export function clearPin(): void {
        _pinInput = []
        _pinDigit = 0
        basic.clearScreen()
    }

    /**
     * Show how many digits have been entered so far
     */
    //% block="show PIN progress"
    //% group="PIN Entry"
    export function showPinProgress(): void {
        basic.showString(_pinInput.length + "/" + _pinTarget.length)
    }

    // ════════════════════════════════════════════════════════
    //  TILT & GESTURE PUZZLES
    // ════════════════════════════════════════════════════════

    /**
     * Returns true if the micro:bit is tilted left past a threshold
     */
    //% block="tilted left past %threshold degrees"
    //% threshold.min=0 threshold.max=90 threshold.defl=30
    //% group="Gesture"
    export function tiltedLeft(threshold: number): boolean {
        return input.rotation(Rotation.Roll) < -threshold
    }

    /**
     * Returns true if the micro:bit is tilted right past a threshold
     */
    //% block="tilted right past %threshold degrees"
    //% threshold.min=0 threshold.max=90 threshold.defl=30
    //% group="Gesture"
    export function tiltedRight(threshold: number): boolean {
        return input.rotation(Rotation.Roll) > threshold
    }

    /**
     * Returns true if the micro:bit is tilted forward past a threshold
     */
    //% block="tilted forward past %threshold degrees"
    //% threshold.min=0 threshold.max=90 threshold.defl=30
    //% group="Gesture"
    export function tiltedForward(threshold: number): boolean {
        return input.rotation(Rotation.Pitch) > threshold
    }

    /**
     * Returns true if the micro:bit is tilted back past a threshold
     */
    //% block="tilted back past %threshold degrees"
    //% threshold.min=0 threshold.max=90 threshold.defl=30
    //% group="Gesture"
    export function tiltedBack(threshold: number): boolean {
        return input.rotation(Rotation.Pitch) < -threshold
    }

    /**
     * Returns true if the micro:bit is held roughly flat
     */
    //% block="held flat within %tolerance degrees"
    //% tolerance.min=1 tolerance.max=45 tolerance.defl=10
    //% group="Gesture"
    export function heldFlat(tolerance: number): boolean {
        return (
            Math.abs(input.rotation(Rotation.Roll)) <= tolerance &&
            Math.abs(input.rotation(Rotation.Pitch)) <= tolerance
        )
    }

    // ════════════════════════════════════════════════════════
    //  SENSOR PUZZLES
    // ════════════════════════════════════════════════════════

    /**
     * Returns true if light level is within range
     */
    //% block="light level between %low and %high"
    //% low.min=0 low.max=255 low.defl=100
    //% high.min=0 high.max=255 high.defl=180
    //% group="Sensors"
    export function lightInRange(low: number, high: number): boolean {
        const l = input.lightLevel()
        return l >= low && l <= high
    }

    /**
     * Returns true if temperature is within range (degrees C)
     */
    //% block="temperature between %low and %high C"
    //% group="Sensors"
    export function tempInRange(low: number, high: number): boolean {
        const t = input.temperature()
        return t >= low && t <= high
    }

    /**
     * Returns true if compass heading is within tolerance of a target bearing
     */
    //% block="compass pointing at %target within %tolerance degrees"
    //% target.min=0 target.max=359 target.defl=90
    //% tolerance.min=1 tolerance.max=45 tolerance.defl=15
    //% group="Sensors"
    export function compassAtTarget(target: number, tolerance: number): boolean {
        const h = input.compassHeading()
        const diff = Math.abs(h - target)
        return diff <= tolerance || diff >= (360 - tolerance)
    }

    /**
     * Show the current compass heading as a scrolling number
     */
    //% block="show compass heading"
    //% group="Sensors"
    export function showCompassHeading(): void {
        basic.showNumber(input.compassHeading())
    }

    /**
     * Show the current light level as a scrolling number
     */
    //% block="show light level"
    //% group="Sensors"
    export function showLightLevel(): void {
        basic.showNumber(input.lightLevel())
    }

    // ════════════════════════════════════════════════════════
    //  MORSE CODE INPUT
    //
    //  Short press = dot, long press = dash
    //  morseConfirmLetter() after each letter
    //  morseMatches() to check against target word
    // ════════════════════════════════════════════════════════

    let _morseBuffer = ""
    let _morseTarget = ""
    let _morseDecoded = ""

    function _morseToChar(code: string): string {
        if (code == ".-")    return "A"
        if (code == "-...")  return "B"
        if (code == "-.-.")  return "C"
        if (code == "-..")   return "D"
        if (code == ".")     return "E"
        if (code == "..-.")  return "F"
        if (code == "--.")   return "G"
        if (code == "....")  return "H"
        if (code == "..")    return "I"
        if (code == ".---")  return "J"
        if (code == "-.-")   return "K"
        if (code == ".-..")  return "L"
        if (code == "--")    return "M"
        if (code == "-.")    return "N"
        if (code == "---")   return "O"
        if (code == ".--.")  return "P"
        if (code == "--.-")  return "Q"
        if (code == ".-.")   return "R"
        if (code == "...")   return "S"
        if (code == "-")     return "T"
        if (code == "..-")   return "U"
        if (code == "...-")  return "V"
        if (code == ".--")   return "W"
        if (code == "-..-")  return "X"
        if (code == "-.--")  return "Y"
        if (code == "--..")  return "Z"
        if (code == "-----") return "0"
        if (code == ".----") return "1"
        if (code == "..---") return "2"
        if (code == "...--") return "3"
        if (code == "....-") return "4"
        if (code == ".....") return "5"
        if (code == "-....") return "6"
        if (code == "--...") return "7"
        if (code == "---..") return "8"
        if (code == "----.") return "9"
        return "?"
    }

    /**
     * Set the secret word players must enter in Morse code (letters and digits only)
     */
    //% block="set Morse target to %word"
    //% group="Morse Code"
    export function setMorseTarget(word: string): void {
        _morseTarget = word.toUpperCase()
        _morseBuffer = ""
        _morseDecoded = ""
    }

    /**
     * Record a dot into the current Morse letter
     */
    //% block="morse dot"
    //% group="Morse Code"
    export function morseDot(): void {
        _morseBuffer += "."
        led.plot(2, 2)
        basic.pause(100)
        led.unplot(2, 2)
    }

    /**
     * Record a dash into the current Morse letter
     */
    //% block="morse dash"
    //% group="Morse Code"
    export function morseDash(): void {
        _morseBuffer += "-"
        led.plot(1, 2)
        led.plot(2, 2)
        led.plot(3, 2)
        basic.pause(100)
        led.unplot(1, 2)
        led.unplot(2, 2)
        led.unplot(3, 2)
    }

    /**
     * Confirm the current Morse letter and add it to the decoded string
     */
    //% block="confirm morse letter"
    //% group="Morse Code"
    export function morseConfirmLetter(): void {
        const ch = _morseToChar(_morseBuffer)
        _morseDecoded += ch
        _morseBuffer = ""
        basic.showString(ch)
    }

    /**
     * Returns true if the decoded Morse input matches the target word
     */
    //% block="morse input matches target"
    //% group="Morse Code"
    export function morseMatches(): boolean {
        return _morseDecoded === _morseTarget
    }

    /**
     * Show how many letters have been decoded so far vs total
     */
    //% block="show morse progress"
    //% group="Morse Code"
    export function showMorseProgress(): void {
        basic.showString(_morseDecoded.length + "/" + _morseTarget.length)
    }

    /**
     * Clear Morse input and start over
     */
    //% block="clear morse input"
    //% group="Morse Code"
    export function clearMorse(): void {
        _morseBuffer = ""
        _morseDecoded = ""
        basic.clearScreen()
    }

    // ════════════════════════════════════════════════════════
    //  LED PATTERN MATCHING
    //
    //  Pattern = 25-char string of "0"s and "1"s
    //  e.g. "0111010001100011000101110" draws the letter E
    //  A = move cursor, B = toggle LED, A+B = submit
    // ════════════════════════════════════════════════════════

    let _patternTarget: number[] = []
    let _patternInput: number[] = []
    let _cursorPos = 0

    function _makeEmptyPattern(): number[] {
        const p: number[] = []
        for (let i = 0; i < 25; i++) p.push(0)
        return p
    }

    /**
     * Set the secret LED pattern from a 25-character string of 0s and 1s
     */
    //% block="set pattern target %bits"
    //% group="LED Pattern"
    export function setPatternTarget(bits: string): void {
        _patternTarget = []
        for (let i = 0; i < 25; i++) {
            _patternTarget.push(bits.charAt(i) === "1" ? 1 : 0)
        }
        _patternInput = _makeEmptyPattern()
        _cursorPos = 0
    }

    /**
     * Flash the secret target pattern for a number of milliseconds, then clear
     */
    //% block="flash target pattern for %ms ms"
    //% ms.min=200 ms.max=5000 ms.defl=1000
    //% group="LED Pattern"
    export function flashTargetPattern(ms: number): void {
        _renderPattern(_patternTarget)
        basic.pause(ms)
        basic.clearScreen()
    }

    /**
     * Move the cursor to the next LED position (wraps around)
     */
    //% block="pattern cursor next"
    //% group="LED Pattern"
    export function patternCursorNext(): void {
        _cursorPos = (_cursorPos + 1) % 25
        _renderPatternWithCursor()
    }

    /**
     * Toggle the LED at the current cursor position
     */
    //% block="pattern toggle current LED"
    //% group="LED Pattern"
    export function patternToggle(): void {
        _patternInput[_cursorPos] = _patternInput[_cursorPos] === 0 ? 1 : 0
        _renderPatternWithCursor()
    }

    /**
     * Returns true if the player's pattern matches the target
     */
    //% block="LED pattern matches"
    //% group="LED Pattern"
    export function patternMatches(): boolean {
        if (_patternTarget.length !== 25) return false
        for (let i = 0; i < 25; i++) {
            if (_patternInput[i] !== _patternTarget[i]) return false
        }
        return true
    }

    /**
     * Clear the player's pattern input
     */
    //% block="clear pattern input"
    //% group="LED Pattern"
    export function clearPattern(): void {
        _patternInput = _makeEmptyPattern()
        _cursorPos = 0
        basic.clearScreen()
    }

    function _renderPattern(p: number[]): void {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (p[row * 5 + col] === 1) {
                    led.plot(col, row)
                } else {
                    led.unplot(col, row)
                }
            }
        }
    }

    function _renderPatternWithCursor(): void {
        _renderPattern(_patternInput)
        const row = Math.floor(_cursorPos / 5)
        const col = _cursorPos % 5
        led.plot(col, row)
    }

    // ════════════════════════════════════════════════════════
    //  TIMER & COUNTDOWN
    // ════════════════════════════════════════════════════════

    let _timerRunning = false
    let _timerEnd = 0
    let _timerDuration = 0

    /**
     * Start a countdown timer for a number of seconds
     */
    //% block="start countdown for %seconds seconds"
    //% seconds.min=5 seconds.max=3600 seconds.defl=60
    //% group="Timer"
    export function startCountdown(seconds: number): void {
        _timerDuration = seconds * 1000
        _timerEnd = input.runningTime() + _timerDuration
        _timerRunning = true
    }

    /**
     * Stop the countdown timer
     */
    //% block="stop countdown"
    //% group="Timer"
    export function stopCountdown(): void {
        _timerRunning = false
    }

    /**
     * Returns the number of seconds remaining on the timer (0 if expired or stopped)
     */
    //% block="seconds remaining"
    //% group="Timer"
    export function secondsRemaining(): number {
        if (!_timerRunning) return 0
        const remaining = _timerEnd - input.runningTime()
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0
    }

    /**
     * Returns true if the countdown timer has expired
     */
    //% block="timer has expired"
    //% group="Timer"
    export function timerExpired(): boolean {
        return _timerRunning && input.runningTime() >= _timerEnd
    }

    /**
     * Show the remaining time as a scrolling number
     */
    //% block="show time remaining"
    //% group="Timer"
    export function showTimeRemaining(): void {
        basic.showNumber(secondsRemaining())
    }

    /**
     * Show a 5-LED progress bar for remaining time across the middle row
     */
    //% block="show countdown bar"
    //% group="Timer"
    export function showCountdownBar(): void {
        if (!_timerRunning) { basic.clearScreen(); return }
        const fraction = Math.max(0, (_timerEnd - input.runningTime())) / _timerDuration
        const bars = Math.ceil(fraction * 5)
        for (let col = 0; col < 5; col++) {
            if (col < bars) {
                led.plot(col, 2)
            } else {
                led.unplot(col, 2)
            }
        }
    }

    /**
     * Run a handler when the timer expires — call this once at setup
     */
    //% block="on timer expired"
    //% group="Timer"
    export function onTimerExpired(handler: () => void): void {
        control.inBackground(() => {
            while (true) {
                if (_timerRunning && input.runningTime() >= _timerEnd) {
                    _timerRunning = false
                    handler()
                    break
                }
                basic.pause(500)
            }
        })
    }

    // ════════════════════════════════════════════════════════
    //  HINT SYSTEM
    // ════════════════════════════════════════════════════════

    let _hints: string[] = []
    let _hintIndex = 0
    let _hintUnlockTime = 0
    let _hintDelayMs = 30000

    /**
     * Add a hint string to the hint queue
     */
    //% block="add hint %hint"
    //% group="Hints"
    export function addHint(hint: string): void {
        _hints.push(hint)
    }

    /**
     * Set the minimum seconds players must wait between hints
     */
    //% block="set hint delay %seconds seconds"
    //% seconds.min=5 seconds.max=300 seconds.defl=30
    //% group="Hints"
    export function setHintDelay(seconds: number): void {
        _hintDelayMs = seconds * 1000
    }

    /**
     * Returns true if a hint is available to show right now
     */
    //% block="hint is available"
    //% group="Hints"
    export function hintAvailable(): boolean {
        return (
            _hintIndex < _hints.length &&
            input.runningTime() >= _hintUnlockTime
        )
    }

    /**
     * Show the next hint and start the cooldown
     */
    //% block="show next hint"
    //% group="Hints"
    export function showNextHint(): void {
        if (_hintIndex >= _hints.length) {
            basic.showString("No hints left")
            return
        }
        basic.showString(_hints[_hintIndex])
        _hintIndex++
        _hintUnlockTime = input.runningTime() + _hintDelayMs
    }

    /**
     * Show how many hints are left
     */
    //% block="show hints remaining"
    //% group="Hints"
    export function showHintsRemaining(): void {
        basic.showNumber(_hints.length - _hintIndex)
    }

    /**
     * Returns the number of seconds until the next hint is unlocked (0 if ready)
     */
    //% block="seconds until next hint"
    //% group="Hints"
    export function secondsUntilHint(): number {
        const remaining = _hintUnlockTime - input.runningTime()
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0
    }

    // ════════════════════════════════════════════════════════
    //  ATTEMPT TRACKING
    // ════════════════════════════════════════════════════════

    let _attempts = 0
    let _maxAttempts = 0

    /**
     * Set the maximum number of wrong attempts allowed (0 = unlimited)
     */
    //% block="set max attempts %max"
    //% max.min=0 max.max=99 max.defl=3
    //% group="Attempts"
    export function setMaxAttempts(max: number): void {
        _maxAttempts = max
        _attempts = 0
    }

    /**
     * Record one wrong attempt
     */
    //% block="record wrong attempt"
    //% group="Attempts"
    export function recordWrongAttempt(): void {
        _attempts++
    }

    /**
     * Returns the number of wrong attempts so far
     */
    //% block="wrong attempt count"
    //% group="Attempts"
    export function wrongAttemptCount(): number { return _attempts }

    /**
     * Returns true if the player has used all their attempts
     */
    //% block="attempts exhausted"
    //% group="Attempts"
    export function attemptsExhausted(): boolean {
        return _maxAttempts > 0 && _attempts >= _maxAttempts
    }

    /**
     * Returns the number of attempts remaining (999 if unlimited)
     */
    //% block="attempts remaining"
    //% group="Attempts"
    export function attemptsRemaining(): number {
        if (_maxAttempts === 0) return 999
        return Math.max(0, _maxAttempts - _attempts)
    }

    /**
     * Show the remaining attempts as a scrolling number
     */
    //% block="show attempts remaining"
    //% group="Attempts"
    export function showAttemptsRemaining(): void {
        basic.showNumber(attemptsRemaining())
    }

    // ════════════════════════════════════════════════════════
    //  RADIO / MULTI-MICRO:BIT
    // ════════════════════════════════════════════════════════

    /**
     * Set a private radio group for this puzzle room (0 to 255)
     */
    //% block="set puzzle radio group %group"
    //% group.min=0 group.max=255 group.defl=42
    //% group="Radio"
    export function setPuzzleGroup(group: number): void {
        radio.setGroup(group)
    }

    /**
     * Broadcast a named puzzle event over radio
     */
    //% block="broadcast event %msg"
    //% group="Radio"
    export function broadcastEvent(msg: string): void {
        radio.sendString(msg)
    }

    /**
     * Run a handler when a specific named radio event is received
     */
    //% block="on radio event %expected"
    //% group="Radio"
    export function onRadioEvent(expected: string, handler: () => void): void {
        radio.onReceivedString(function (msg: string) {
            if (msg === expected) handler()
        })
    }

    /**
     * Broadcast a master reset command to all micro:bits in this group
     */
    //% block="broadcast master reset"
    //% group="Radio"
    export function broadcastMasterReset(): void {
        radio.sendString("__RESET__")
    }

    /**
     * Listen for a master reset and automatically call resetAll then run handler
     */
    //% block="on master reset received"
    //% group="Radio"
    export function onMasterReset(handler: () => void): void {
        radio.onReceivedString(function (msg: string) {
            if (msg === "__RESET__") {
                resetAll()
                handler()
            }
        })
    }

}

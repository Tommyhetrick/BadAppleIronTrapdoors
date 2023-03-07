#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

targetColor := 0xFF0000

lastTime := False

Loop {
    PixelSearch, pColorX, pColorY, 0, 0, 50, 50, 0xFF0000, 50, Fast RGB

    If (ErrorLevel) {
        lastTime := false
    } else {

        If (!lastTime) {
            Send, {F2}
        }
        
        lastTime := true
    }
    Sleep, 10
}

ColorRGBCompare(col1, col2, tol) {
	col1 := RGBfromColor(col1)
	col2 := RGBfromColor(col2)
	return (Abs(col1.r - col2.r) <= tol) && (Abs(col1.g - col2.g) <= tol) && (Abs(col1.r - col2.r) <= tol)
}

RGBfromColor(color) {
	return {r: (0xFF0000 & color) >> 16, g: (0xFF00 & color) >> 8, b: 0xFF & color}
}

ExitApp

Z::
    ExitApp
    Return

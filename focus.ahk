SetWinDelay, -1

Loop, 4 { ; Keep trying for another 1s because sometimes opening is slow
	WinActivate, ahk_exe mpv.exe
	Sleep, 250
}
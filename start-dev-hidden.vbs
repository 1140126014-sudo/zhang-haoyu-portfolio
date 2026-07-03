Set WshShell = CreateObject("WScript.Shell")
Command = "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File ""D:\WORKSP~1\PROJEC~4\scripts\start-dev.ps1"""
WshShell.Run Command, 0, False

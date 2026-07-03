@echo off
setlocal
cd /d "%~dp0"
cscript //Nologo "%~dp0start-dev-hidden.vbs"
echo Opening portfolio at http://127.0.0.1:5173/
timeout /t 3 >nul
start "" "http://127.0.0.1:5173/"

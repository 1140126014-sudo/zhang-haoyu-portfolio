@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
set "NODE_EXE=C:\Users\WIDNOWS\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "VITE_CLI=%~dp0node_modules\vite\bin\vite.js"

echo.
echo 张浩宇作品集本地预览正在启动...
echo 地址: http://127.0.0.1:5173/
echo.
echo 请保持这个窗口打开；关闭窗口会停止网站服务。
echo 如果浏览器还没打开，请手动复制上面的地址访问。
echo.
start "" "http://127.0.0.1:5173/"
"%NODE_EXE%" "%VITE_CLI%" --host 127.0.0.1 --port 5173 --strictPort

echo.
echo 网站服务已停止。
pause

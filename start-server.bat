@echo off
chcp 65001 >nul
echo 正在启动早教应用...
echo.
cd /d "%~dp0"
npx vite preview --port 5173 --host
pause

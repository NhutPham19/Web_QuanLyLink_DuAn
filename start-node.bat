@echo off
title LinkVault (Node.js)
cd /d "%~dp0web-quan-ly-link"
set PORT=3005
echo ===================================================
echo   Dang khoi dong LinkVault qua Node.js (Port 3005)
echo ===================================================
echo.
ping -n 3 127.0.0.1 > nul
start "" "http://localhost:3005"
node src/index.js
echo.
pause

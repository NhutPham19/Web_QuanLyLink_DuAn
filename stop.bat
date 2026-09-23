@echo off
title Stop LinkVault
cd /d "%~dp0"
echo ===================================================
echo   Dang dung he thong LinkVault...
echo ===================================================
docker compose down
echo.
echo [OK] Da dung container LinkVault an toan.
echo.
pause

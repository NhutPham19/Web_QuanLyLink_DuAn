@echo off
title LinkVault (Docker)
cd /d "%~dp0"
echo ===================================================
echo   Dang khoi dong LinkVault qua Docker (Port 3005)...
echo ===================================================
docker compose up -d

if %ERRORLEVEL% equ 0 (
    echo.
    echo [OK] LinkVault da khoi dong thanh cong!
    echo [OK] Dang mo trinh duyet tai: http://localhost:3005
    ping -n 3 127.0.0.1 > nul
    start "" "http://localhost:3005"
) else (
    echo.
    echo [ERROR] Khong the khoi dong Docker.
    echo Vui long kiem tra xem Docker Desktop da duoc bat chua.
)
echo.
pause

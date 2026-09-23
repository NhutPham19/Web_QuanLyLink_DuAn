@echo off
chcp 65001 > nul
title Dừng LinkVault (Docker)
echo ===================================================
echo     Đang dừng hệ thống LinkVault...
echo ===================================================
docker compose down
echo.
echo ✅ Đã dừng container LinkVault an toàn.
echo.
pause

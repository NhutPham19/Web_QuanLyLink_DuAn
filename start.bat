@echo off
chcp 65001 > nul
title Khởi động LinkVault (Docker)
echo ===================================================
echo     Đang khởi động LinkVault qua Docker...
echo ===================================================
docker compose up -d

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ LinkVault đã khởi động thành công!
    echo 🌐 Đang mở trình duyệt tại: http://localhost:3005
    timeout /t 2 > nul
    start http://localhost:3005
) else (
    echo.
    echo ❌ Có lỗi khi khởi động Docker. Vui lòng đảm bảo Docker Desktop đã được bật.
)
echo.
pause

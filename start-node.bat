@echo off
chcp 65001 > nul
title Khởi động LinkVault (Node.js)
echo ===================================================
echo     Đang khởi động LinkVault qua Node.js...
echo ===================================================
cd /d "%~dp0web-quan-ly-link"
timeout /t 2 > nul
start http://localhost:3000
npm start

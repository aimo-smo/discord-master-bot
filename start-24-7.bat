@echo off
title Discord Master Bot - 24/7
cd /d "%~dp0"

where pm2 >nul 2>&1
if %errorlevel% neq 0 (
    echo PM2 غير مثبت. جاري التثبيت...
    npm install -g pm2 pm2-windows-startup
)

echo جاري تشغيل البوت...
pm2 start ecosystem.config.js
pm2 save

echo.
echo ========================================
echo  البوت يعمل الآن 24/7
echo  pm2 status   - حالة البوت
echo  pm2 logs     - السجلات
echo  pm2 restart discord-master-bot
echo ========================================
pause

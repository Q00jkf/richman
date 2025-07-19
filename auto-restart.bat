@echo off
REM RichMan 自動重啟腳本 (Windows)
echo 🔄 正在重啟 RichMan 服務器...

REM 1. 停止現有服務器
echo 🛑 停止現有服務器進程...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im nodemon.exe >nul 2>&1

REM 2. 等待進程完全停止
echo ⏳ 等待進程停止...
timeout /t 3 /nobreak >nul

REM 3. 啟動新的服務器
echo 🚀 啟動新的服務器...
start /min cmd /c "npm run server"

REM 4. 等待服務器啟動
echo ⏳ 等待服務器啟動...
timeout /t 5 /nobreak >nul

REM 5. 檢查服務器狀態並自動開啟測試頁面
echo 🌐 檢查服務器狀態...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 服務器啟動成功！
    echo 🌐 服務器地址: http://localhost:5000
    echo 🎮 自動開啟測試頁面...
    start "" "file:///C:/codeing/richman/test-multiplayer.html"
) else (
    echo ❌ 服務器啟動失敗，請檢查日誌
)

pause
@echo off
echo 🎮 RichMan 快速測試工具
echo =====================
echo.

cd /d "%~dp0\.."

echo 📋 選擇測試類型:
echo 1. 啟動伺服器
echo 2. API 功能測試
echo 3. WebSocket 基本測試
echo 4. WebSocket 多人測試
echo 5. 完整測試流程
echo 6. 查看測試說明
echo.

set /p choice="請選擇 (1-6): "

if "%choice%"=="1" goto start_server
if "%choice%"=="2" goto test_api
if "%choice%"=="3" goto test_websocket_basic
if "%choice%"=="4" goto test_websocket_multi
if "%choice%"=="5" goto test_full
if "%choice%"=="6" goto show_guide
goto invalid_choice

:start_server
echo.
echo 🚀 啟動 RichMan 伺服器...
echo.
npm run server
goto end

:test_api
echo.
echo 🔍 開始 API 測試...
echo 請確保伺服器正在運行 (npm run server)
echo.
pause
node tools/test-api.js
goto end

:test_websocket_basic
echo.
echo 📡 開始 WebSocket 基本測試...
echo 請確保伺服器正在運行 (npm run server)
echo.
pause
node tools/test-websocket.js basic
goto end

:test_websocket_multi
echo.
echo 👥 開始 WebSocket 多人測試...
echo 請確保伺服器正在運行 (npm run server)
echo.
pause
node tools/test-websocket.js multi
goto end

:test_full
echo.
echo 🧪 開始完整測試流程...
echo.
echo 第 1 步: 啟動伺服器測試
timeout /t 2 /nobreak >nul
start /min cmd /c "npm run server"

echo 第 2 步: 等待伺服器啟動...
timeout /t 5 /nobreak >nul

echo 第 3 步: API 測試
node tools/test-api.js

echo.
echo 第 4 步: WebSocket 基本測試
node tools/test-websocket.js basic

echo.
echo ✅ 完整測試完成！
goto end

:show_guide
echo.
echo 📖 測試說明
echo ===========
echo.
echo 1. 啟動伺服器:
echo    - 啟動 RichMan 遊戲伺服器
echo    - 監聽端口 5000
echo    - 顯示初始化狀態
echo.
echo 2. API 功能測試:
echo    - 測試 REST API 端點
echo    - 健康檢查、玩家、房間、遊戲 API
echo    - 錯誤處理測試
echo.
echo 3. WebSocket 基本測試:
echo    - 測試 WebSocket 連接
echo    - 創建玩家和房間
echo    - 基本遊戲流程
echo.
echo 4. WebSocket 多人測試:
echo    - 模擬多個玩家
echo    - 測試即時同步
echo    - 多人遊戲互動
echo.
echo 5. 完整測試流程:
echo    - 自動執行所有測試
echo    - 按順序驗證功能
echo.
echo 💡 建議測試順序:
echo    1 → 2 → 3 → 4
echo.
echo 🔍 詳細說明請參考:
echo    docs/TESTING_GUIDE.md
echo.
pause
goto end

:invalid_choice
echo.
echo ❌ 無效選擇，請重新執行
goto end

:end
echo.
echo 按任意鍵退出...
pause >nul
@echo off
echo 🔍 測試RichMan伺服器端口連接...
echo.

REM 檢查5000端口是否開放
echo 📡 檢查localhost:5000...
telnet localhost 5000
echo.

REM 檢查WiFi IP的5000端口
echo 📱 檢查WiFi IP 192.168.117.202:5000...
telnet 192.168.117.202 5000
echo.

echo 📋 如果看到連接成功訊息，表示端口已開放
echo ❌ 如果連接失敗，請執行 setup-firewall.bat
echo.
pause
@echo off
echo ========================================
echo     找手機熱點中的電腦IP地址
echo ========================================
echo.

echo 正在檢查網路配置...
ipconfig | findstr "IPv4"

echo.
echo ========================================
echo 上面顯示的IP地址中，找到類似這樣的：
echo   IPv4 Address: 192.168.137.X
echo   或 IPv4 Address: 192.168.X.X
echo.
echo 那個X.X.X.X就是你要在手機上輸入的IP
echo 完整網址格式：http://X.X.X.X:5000
echo ========================================
echo.

pause
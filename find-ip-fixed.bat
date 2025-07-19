@echo off
chcp 65001 >nul
echo 查找手機熱點網路的Windows電腦IP地址...
echo.

echo 手機熱點配置檢測：
echo ================================
ipconfig | findstr "IPv4"
ipconfig | findstr "無線"

echo.
echo 詳細網路資訊：
echo ================================
ipconfig /all | findstr "IPv4"
ipconfig /all | findstr "無線區域網路"
ipconfig /all | findstr "預設閘道"

echo.
echo 路由表資訊：
echo ================================
route print | findstr "192.168"

echo.
echo 測試localhost連接：
echo ================================
ping -n 1 127.0.0.1 | findstr "TTL" && echo localhost可用 || echo localhost不可用

echo.
echo 手機熱點網路配置說明：
echo ================================
echo 1. 在上面找到 192.168.137.X 格式的IP
echo 2. 那個IP就是你電腦在手機熱點中的地址
echo 3. 在手機瀏覽器輸入：http://那個IP:5000
echo 4. 例如：http://192.168.137.2:5000

echo.
echo 如果找不到請檢查：
echo - 電腦是否已連接手機熱點
echo - 熱點設定是否正確
echo - 重新啟動熱點

echo.
pause
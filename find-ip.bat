@echo off
echo 🔍 查找手機熱點網路的 Windows 電腦 IP 地址...
echo.

echo 📱 手機熱點配置檢測：
echo ================================
ipconfig | findstr /C:"IPv4" /C:"無線" /C:"區域連線"

echo.
echo 🔧 詳細網路資訊：
echo ================================
ipconfig /all | findstr /C:"IPv4" /C:"子網路遮罩" /C:"預設閘道" /C:"無線區域網路" /C:"乙太網路"

echo.
echo 📊 路由表 (找出電腦在熱點網路中的 IP)：
echo ================================
route print | findstr "192.168"

echo.
echo 🧪 測試 localhost 連接：
echo ================================
curl -I http://localhost:5000 2>nul | findstr "HTTP" || echo ❌ localhost:5000 無法連接

echo.
echo 💡 手機熱點網路配置說明：
echo ================================
echo 1. 🔍 在上面的資訊中找到 192.168.137.X 或 192.168.X.X 的 IP
echo 2. 📱 那個 IP 就是你電腦在手機熱點網路中的地址
echo 3. 🎮 手機開瀏覽器連線：http://那個IP:5000
echo 4. ✅ 例如：http://192.168.137.1:5000

echo.
echo 🚀 如果找不到，請檢查：
echo - 確認電腦已連接到手機熱點
echo - 確認熱點名稱與密碼正確
echo - 嘗試關閉再重開熱點

pause
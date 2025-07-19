@echo off
echo 正在設置Windows防火牆允許RichMan遊戲伺服器...

REM 添加入站規則允許TCP 5000端口
netsh advfirewall firewall add rule name="RichMan Game Server - TCP 5000" dir=in action=allow protocol=TCP localport=5000

REM 添加出站規則允許TCP 5000端口
netsh advfirewall firewall add rule name="RichMan Game Server - TCP 5000 Out" dir=out action=allow protocol=TCP localport=5000

echo.
echo ✅ 防火牆規則已添加！
echo 📋 規則名稱: "RichMan Game Server - TCP 5000"
echo 🔓 允許端口: 5000 (TCP)
echo 📡 方向: 入站和出站
echo.
echo 現在手機應該可以連接到電腦的遊戲伺服器了！
echo.
pause
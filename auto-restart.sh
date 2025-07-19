#!/bin/bash

# RichMan 自動重啟腳本
echo "🔄 正在重啟 RichMan 服務器..."

# 1. 停止現有服務器
echo "🛑 停止現有服務器進程..."
pkill -f "nodemon" 2>/dev/null || true
pkill -f "node.*index.js" 2>/dev/null || true

# 2. 強制釋放端口 5000
echo "🔓 釋放端口 5000..."
lsof -ti :5000 | xargs kill -9 2>/dev/null || true

# 3. 等待進程完全停止
echo "⏳ 等待進程停止..."
sleep 3

# 4. 啟動新的服務器
echo "🚀 啟動新的服務器..."
npm run server &

# 5. 等待服務器啟動
echo "⏳ 等待服務器啟動..."
sleep 5

# 6. 檢查服務器狀態
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ 服務器啟動成功！"
    echo "🌐 服務器地址: http://localhost:5000"
    echo "🎮 測試頁面: file:///C:/codeing/richman/test-multiplayer.html"
else
    echo "❌ 服務器啟動失敗，請檢查日誌"
fi
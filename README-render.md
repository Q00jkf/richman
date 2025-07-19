# 🎮 RichMan - Render 雲端部署版本

## 📋 專案說明

這是 RichMan 多人線上大富翁遊戲的 **Render 雲端部署版本**，專為快速部署和測試而設計的最小化版本。

## ✨ 功能特色

- 🌐 **雲端部署** - 支援 Render 一鍵部署
- 📱 **跨平台** - 手機、平板、電腦都可以連線
- 🔄 **即時連線** - WebSocket 即時多人遊戲
- 🎯 **零設定** - 無需 IP 配置，開啟即用
- 🚀 **快速啟動** - 最小化架構，啟動快速

## 🏗️ 架構說明

```
richman/
├── public/           # 前端靜態資源
│   └── index.html    # 遊戲主頁面
├── server.js         # 簡化版伺服器
├── package.json      # 專案配置
├── render.yaml       # Render 部署配置
└── .env.example      # 環境變數範例
```

## 🚀 本地開發

```bash
# 安裝依賴
npm install

# 啟動伺服器
npm start

# 開啟瀏覽器
open http://localhost:5000
```

## 🌐 Render 部署步驟

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment version"
   git push origin richman-render
   ```

2. **連接 Render**
   - 前往 [Render.com](https://render.com)
   - 點擊 "New +" → "Web Service"
   - 選擇你的 GitHub 專案

3. **設定部署**
   - **Name**: `richman-game`
   - **Branch**: `richman-render`  
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

4. **完成部署**
   - 等待部署完成
   - 獲得網址: `https://your-app-name.onrender.com`

## 🎮 使用方式

1. 開啟部署後的網址
2. 點擊「🚀 連接伺服器」
3. 點擊「🎯 加入遊戲」輸入玩家名稱
4. 邀請朋友使用同樣網址加入！

## 🔧 環境變數

在 Render 設定以下環境變數（可選）：

```
NODE_ENV=production
PORT=5000
ALLOWED_ORIGINS=*
```

## 📱 測試功能

- ✅ 連接雲端伺服器
- ✅ 多人同時連線
- ✅ 即時聊天（待開發）
- ✅ 房間系統（基礎版）
- ✅ 延遲測試

## 🔄 從完整版遷移

完成雲端測試後，可以逐步將完整版功能整合：

1. 遊戲邏輯 (`GameEngine`)
2. 玩家管理 (`PlayerManager`) 
3. 房間系統 (`RoomManager`)
4. 前端 React 組件
5. 資料庫整合

## 🐛 常見問題

**Q: 無法連接伺服器？**
A: 檢查網路連線，確認 Render 部署狀態正常

**Q: 多人連線問題？**  
A: 確認所有玩家使用相同的網址

**Q: 延遲過高？**
A: Render 免費版可能有延遲，可升級至付費版

## 📞 支援

- GitHub Issues: [報告問題](https://github.com/Q00jkf/richman/issues)
- 開發者: photo841841@gmail.com

---

🎯 **目標**: 先讓基礎版本穩定運行，再逐步添加完整遊戲功能！
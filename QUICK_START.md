# 🚀 RichMan 快速開始指南

歡迎使用 RichMan 線上多人大富翁遊戲！本指南將幫助您快速測試和體驗遊戲功能。

## ⚡ 3 分鐘快速測試

### 步驟 1: 啟動伺服器
```bash
# 在專案根目錄執行
npm run server
```

**預期看到**：
```
🚀 RichMan Server running on port 5000
📱 Client URL: http://localhost:3000
🎮 Game Manager initialized
👥 Player Manager initialized
🏠 Room Manager initialized
📡 Socket Service initialized
⚡ Server ready for connections!
```

### 步驟 2: 快速功能測試 (Windows)
```bash
# 雙擊執行一鍵測試工具
tools\quick-test.bat
```

或手動測試：
```bash
# API 測試
npm run test:api

# WebSocket 測試  
npm run test:websocket
```

### 步驟 3: 多人遊戲測試
```bash
# 多人聯機測試
npm run test:websocket:multi
```

## 🎮 遊戲體驗方式

### 方式 1: 使用測試腳本 (推薦)
自動模擬遊戲流程，適合快速驗證功能：

```bash
# 開新命令行視窗，保持伺服器運行
npm run server

# 開另一個命令行視窗進行測試
npm run test:websocket
```

### 方式 2: 瀏覽器手動測試

**選項 A: 使用專用測試頁面 (推薦)**
1. 開啟瀏覽器，訪問 `file:///C:/codeing/richman/testing/legacy/test-websocket.html`
2. 看到漂亮的測試界面，按照步驟操作：
   - 點擊「創建玩家」
   - 點擊「創建房間」  
   - 點擊「開始遊戲」
   - 點擊「擲骰子」進行遊戲

**選項 B: 使用主頁面開發者工具**
1. 開啟瀏覽器，訪問 `http://localhost:5000`
2. 按 F12 開啟開發者工具
3. 在 Console 中執行以下代碼：

```javascript
// 建立連接
const socket = io('http://localhost:5000');

// 監聽連接成功
socket.on('connect', () => {
  console.log('✅ 連接成功！');
  
  // 創建玩家
  socket.emit('player:create', {
    name: '我的玩家',
    avatar: 'player.png'
  });
});

// 監聽玩家創建成功
socket.on('player:created', (data) => {
  console.log('👤 玩家創建成功:', data);
  
  // 創建房間
  socket.emit('room:create', {
    name: '我的房間',
    maxPlayers: 4,
    hostPlayerId: data.playerId
  });
});

// 監聽房間創建成功
socket.on('room:created', (data) => {
  console.log('🏠 房間創建成功:', data);
  
  // 開始遊戲
  socket.emit('game:start', {
    roomId: data.roomId,
    hostPlayerId: data.hostPlayerId
  });
});

// 監聽遊戲開始
socket.on('game:started', (data) => {
  console.log('🎮 遊戲開始！', data);
});

// 監聽輪到自己
socket.on('game:turn_started', (data) => {
  console.log('🎯 輪到玩家:', data.playerId);
  
  // 自動擲骰子
  setTimeout(() => {
    socket.emit('game:action', {
      type: 'ROLL_DICE',
      playerId: data.playerId
    });
  }, 1000);
});

// 監聽擲骰結果
socket.on('game:dice_rolled', (data) => {
  console.log('🎲 擲骰結果:', data.diceResult);
});

// 監聽所有遊戲事件
socket.onAny((eventName, ...args) => {
  if (eventName.startsWith('game:')) {
    console.log(`🎮 ${eventName}:`, args);
  }
});
```

## 📋 測試檢查清單

完成以下測試確保功能正常：

### 基本功能 ✅
- [ ] 伺服器啟動成功
- [ ] API 健康檢查通過
- [ ] WebSocket 連接成功
- [ ] 玩家創建和管理
- [ ] 房間創建和加入

### 遊戲核心 ✅
- [ ] 遊戲開始機制
- [ ] 擲骰子功能
- [ ] 玩家移動
- [ ] 地產購買
- [ ] 租金計算
- [ ] 回合管理

### 多人聯機 ✅
- [ ] 多玩家同時在線
- [ ] 即時狀態同步
- [ ] 回合順序正確
- [ ] 事件廣播正常

## 🎯 預期測試結果

### API 測試成功輸出
```
🧪 RichMan API 測試工具
======================

📡 測試目標: http://localhost:5000

🔍 測試健康檢查...
✅ 健康檢查成功
   - 狀態: OK
   - 運行時間: 12.345秒
   - 活躍遊戲: 0
   - 活躍玩家: 0
   - 活躍房間: 0

👤 測試玩家 API...
   創建玩家...
   ✅ 玩家創建成功
      - 玩家ID: player_xxx

📊 測試結果摘要
================
總測試數: 8
✅ 通過: 8
❌ 失敗: 0
⚠️ 錯誤: 0

成功率: 100.0%
```

### WebSocket 測試成功輸出
```
🎮 RichMan WebSocket 測試工具
================================

🧪 開始基本功能測試...

🔌 正在連接到伺服器...
✅ WebSocket 連接成功！
📡 Socket ID: xyz123

👤 創建玩家: 測試玩家1
✅ 玩家創建成功！ID: player_xxx

🏠 創建房間: 測試房間1
✅ 房間創建成功！ID: room_xxx

🎮 嘗試開始遊戲...
🚀 遊戲開始！

🎯 輪到玩家: player_xxx
✋ 輪到我了！
🤖 自動遊戲中...
🎲 擲骰子...
🎲 擲骰結果: 3 + 4 = 7
🚶 玩家 player_xxx 從位置 0 移動到 7

✅ 基本測試完成！
```

## 🚨 常見問題

### Q: 伺服器無法啟動
**A**: 檢查端口 5000 是否被占用
```bash
netstat -ano | findstr :5000
```

### Q: 測試腳本報錯
**A**: 確保伺服器已啟動並且 Node.js 版本 >= 16.0.0

### Q: WebSocket 連接失敗
**A**: 檢查防火牆設置，確保瀏覽器支援 WebSocket

## 📖 更多資源

- **詳細測試指南**: `docs/TESTING_GUIDE.md`
- **測試工具**: `testing/legacy/`
- **部署文檔**: `deployment/render/`
- **專案架構**: `docs/SYSTEM_ARCHITECTURE_REPORT.md`
- **工作日誌**: `WORK_LOG.md`

## 🎉 下一步

測試完成後，您可以：

1. **開發前端界面** - 創建遊戲 UI 組件
2. **擴展遊戲功能** - 添加更多遊戲機制
3. **優化效能** - 提升併發處理能力
4. **部署上線** - 準備生產環境

---

**🎮 享受 RichMan 遊戲開發之旅！**
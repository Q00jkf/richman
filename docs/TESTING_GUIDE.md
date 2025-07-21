# 🎮 RichMan 遊戲測試教學

> **版本**: 1.0  
> **更新日期**: 2025-07-18  
> **適用對象**: 開發者、測試人員、用戶  

本教學將指導您如何測試 RichMan 線上多人大富翁遊戲的各項功能。

## 📋 目錄

1. [環境準備](#環境準備)
2. [伺服器啟動測試](#伺服器啟動測試)
3. [API 功能測試](#api-功能測試)
4. [WebSocket 連接測試](#websocket-連接測試)
5. [遊戲流程測試](#遊戲流程測試)
6. [多人聯機測試](#多人聯機測試)
7. [問題排除](#問題排除)

---

## 🛠️ 環境準備

### 1. 確認系統要求
```bash
# 檢查 Node.js 版本 (需要 >= 16.0.0)
node --version

# 檢查 NPM 版本 (需要 >= 8.0.0)
npm --version

# 檢查專案依賴
cd C:\codeing\richman
npm list --depth=0
```

### 2. 安裝依賴 (如果尚未安裝)
```bash
cd C:\codeing\richman
npm install
```

### 3. 環境變量設置 (可選)
創建 `.env` 文件：
```bash
# 在專案根目錄創建 .env 文件
echo "PORT=5000" > .env
echo "CLIENT_URL=https://richman-online-game.onrender.com" >> .env
echo "NODE_ENV=development" >> .env
```

---

## 🚀 伺服器啟動測試

### 1. 基本啟動測試
```bash
# 方法 1: 使用 npm script
npm run server

# 方法 2: 直接啟動
node src/main/server/index.js

# 方法 3: 使用 nodemon (開發模式)
npx nodemon src/main/server/index.js
```

### 2. 啟動成功確認
**預期輸出**：
```
🚀 RichMan Server running on port 5000
📱 Client URL: https://richman-online-game.onrender.com
🎮 Game Manager initialized
👥 Player Manager initialized
🏠 Room Manager initialized
📡 Socket Service initialized
⚡ Server ready for connections!
```

### 3. 健康檢查
打開瀏覽器或使用 curl：
```bash
# 瀏覽器訪問
https://richman-online-game.onrender.com/health

# 或使用 curl
curl https://richman-online-game.onrender.com/health
```

**預期回應**：
```json
{
  "status": "OK",
  "timestamp": "2025-07-18T10:00:00.000Z",
  "uptime": 12.345,
  "memory": {...},
  "activeGames": 0,
  "activePlayers": 0,
  "activeRooms": 0
}
```

---

## 🔌 API 功能測試

### 1. 玩家 API 測試

#### 創建玩家
```bash
curl -X POST https://richman-online-game.onrender.com/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試玩家1",
    "avatar": "player1.png"
  }'
```

#### 獲取玩家列表
```bash
curl https://richman-online-game.onrender.com/api/players
```

### 2. 房間 API 測試

#### 創建遊戲房間
```bash
curl -X POST https://richman-online-game.onrender.com/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試房間",
    "maxPlayers": 4,
    "isPrivate": false,
    "settings": {
      "startingMoney": 1500,
      "timeLimit": 120
    }
  }'
```

#### 獲取房間列表
```bash
curl https://richman-online-game.onrender.com/api/rooms
```

### 3. 遊戲 API 測試

#### 獲取遊戲列表
```bash
curl https://richman-online-game.onrender.com/api/games
```

---

## 🌐 WebSocket 連接測試

### 1. 使用瀏覽器控制台測試

在瀏覽器打開 `https://richman-online-game.onrender.com`，按 F12 開啟開發者工具，在 Console 中執行：

```javascript
// 1. 建立 WebSocket 連接
const socket = io('https://richman-online-game.onrender.com');

// 2. 監聽連接事件
socket.on('connect', () => {
  console.log('✅ 連接成功！Socket ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ 連接中斷');
});

// 3. 監聽遊戲事件
socket.on('game:state_updated', (data) => {
  console.log('🎮 遊戲狀態更新:', data);
});

socket.on('room:player_joined', (data) => {
  console.log('👥 玩家加入房間:', data);
});

// 4. 發送測試事件
socket.emit('player:join', {
  name: '測試玩家',
  avatar: 'default.png'
});
```

### 2. 使用 Node.js 腳本測試

使用現有測試文件 `testing/legacy/test-websocket.js`：

```javascript
const io = require('socket.io-client');

const socket = io('https://richman-online-game.onrender.com');

socket.on('connect', () => {
  console.log('✅ WebSocket 連接成功');
  
  // 測試玩家加入
  socket.emit('player:join', {
    name: '測試玩家',
    avatar: 'test.png'
  });
});

socket.on('disconnect', () => {
  console.log('❌ WebSocket 連接中斷');
});

// 監聽所有事件
socket.onAny((eventName, ...args) => {
  console.log(`📡 收到事件: ${eventName}`, args);
});
```

執行測試：
```bash
node testing/legacy/test-websocket.js
```

---

## 🎯 遊戲流程測試

### 1. 單人測試流程

#### 步驟 1: 創建玩家和房間
```bash
# 創建玩家
curl -X POST https://richman-online-game.onrender.com/api/players \
  -H "Content-Type: application/json" \
  -d '{"name": "玩家1", "avatar": "avatar1.png"}'

# 記住返回的 playerId，例如: "player_123"

# 創建房間
curl -X POST https://richman-online-game.onrender.com/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"name": "測試房間", "maxPlayers": 4}'

# 記住返回的 roomId，例如: "room_456"
```

#### 步驟 2: 使用 WebSocket 加入房間
```javascript
const socket = io('https://richman-online-game.onrender.com');

socket.on('connect', () => {
  // 加入房間
  socket.emit('room:join', {
    playerId: 'player_123',
    roomId: 'room_456'
  });
});

socket.on('room:joined', (data) => {
  console.log('✅ 成功加入房間:', data);
});
```

### 2. 遊戲核心功能測試

#### 測試擲骰子
```javascript
socket.emit('game:action', {
  type: 'ROLL_DICE',
  playerId: 'player_123'
});

socket.on('game:dice_rolled', (data) => {
  console.log('🎲 擲骰結果:', data.diceResult);
});
```

#### 測試購買地產
```javascript
socket.emit('game:action', {
  type: 'BUY_PROPERTY',
  playerId: 'player_123',
  data: { propertyId: 1 }
});

socket.on('game:property_bought', (data) => {
  console.log('🏠 購買地產成功:', data);
});
```

#### 測試建造房屋
```javascript
socket.emit('game:action', {
  type: 'BUILD_HOUSE',
  playerId: 'player_123',
  data: { propertyId: 1 }
});

socket.on('game:house_built', (data) => {
  console.log('🏘️ 建造房屋成功:', data);
});
```

---

## 👥 多人聯機測試

### 1. 準備工作

開啟 2-4 個瀏覽器分頁或使用不同設備，每個代表一個玩家。

### 2. 多人測試腳本

**玩家 1 (主機)**：
```javascript
const socket1 = io('https://richman-online-game.onrender.com');

socket1.on('connect', () => {
  // 創建並加入房間
  socket1.emit('room:create', {
    name: '多人測試房間',
    maxPlayers: 4,
    hostPlayerId: 'player_1'
  });
});

socket1.on('room:created', (data) => {
  console.log('房間創建成功:', data.roomId);
  // 開始遊戲
  socket1.emit('game:start', {
    roomId: data.roomId,
    hostPlayerId: 'player_1'
  });
});
```

**玩家 2-4**：
```javascript
const socket2 = io('https://richman-online-game.onrender.com');

socket2.on('connect', () => {
  // 加入現有房間
  socket2.emit('room:join', {
    playerId: 'player_2',
    roomId: 'room_from_player1'
  });
});
```

### 3. 測試多人互動

```javascript
// 所有玩家監聽遊戲事件
socket.on('game:turn_started', (data) => {
  if (data.playerId === myPlayerId) {
    console.log('🎯 輪到我了！');
    // 自動擲骰子
    setTimeout(() => {
      socket.emit('game:action', {
        type: 'ROLL_DICE',
        playerId: myPlayerId
      });
    }, 1000);
  }
});

socket.on('game:player_moved', (data) => {
  console.log(`🚶 玩家 ${data.playerId} 移動到位置 ${data.newPosition}`);
});

socket.on('game:rent_paid', (data) => {
  console.log(`💰 ${data.payerId} 支付 $${data.amount} 給 ${data.ownerId}`);
});
```

---

## 🎮 完整遊戲測試場景

### 場景 1: 基本遊戲流程

1. **啟動伺服器**
2. **4 個玩家加入同一房間**
3. **開始遊戲**
4. **每個玩家依序進行回合**：
   - 擲骰子
   - 移動棋子
   - 處理落地效果（購買地產、支付租金等）
   - 結束回合
5. **測試勝負條件**

### 場景 2: 地產交易測試

1. **玩家 A 購買地產**
2. **玩家 A 建造房屋**
3. **玩家 B 踩到玩家 A 的地產**
4. **玩家 B 支付租金**
5. **驗證金錢轉移**

### 場景 3: 特殊事件測試

1. **玩家抽到機會卡片**
2. **玩家進入監獄**
3. **玩家破產處理**
4. **遊戲結束條件**

---

## 🚨 問題排除

### 常見問題及解決方案

#### 1. 伺服器無法啟動
```bash
# 檢查端口是否被占用
netstat -ano | findstr :5000

# 強制結束占用進程
taskkill /PID <PID> /F

# 使用其他端口
PORT=5001 node src/main/server/index.js
```

#### 2. WebSocket 連接失敗
```bash
# 檢查防火牆設置
# 確認瀏覽器支援 WebSocket
# 檢查 CORS 設置
```

#### 3. API 回應錯誤
```bash
# 檢查請求格式
# 查看伺服器日誌
# 驗證 JSON 格式
```

#### 4. 遊戲狀態同步問題
```javascript
// 檢查事件監聽
socket.onAny((event, data) => {
  console.log('所有事件:', event, data);
});

// 手動同步狀態
socket.emit('game:sync_state', { gameId: 'your_game_id' });
```

### 調試工具

#### 1. 伺服器日誌
```bash
# 啟用詳細日誌
DEBUG=* node src/main/server/index.js
```

#### 2. 網路監控
```bash
# 使用瀏覽器開發者工具
# Network 標籤查看 HTTP 請求
# WebSocket 標籤查看 WebSocket 通信
```

#### 3. 狀態檢查
```javascript
// 獲取當前遊戲狀態
socket.emit('game:get_state', { gameId: 'your_game_id' });

// 獲取房間信息
socket.emit('room:get_info', { roomId: 'your_room_id' });
```

---

## 📊 測試檢查清單

### 基本功能測試
- [ ] 伺服器啟動成功
- [ ] 健康檢查回應正常
- [ ] API 端點可正常訪問
- [ ] WebSocket 連接成功

### 玩家功能測試
- [ ] 玩家註冊/登入
- [ ] 玩家資料更新
- [ ] 玩家狀態同步

### 房間功能測試
- [ ] 房間創建
- [ ] 房間加入/離開
- [ ] 房間設置修改
- [ ] 房間列表顯示

### 遊戲核心測試
- [ ] 遊戲開始/結束
- [ ] 擲骰子機制
- [ ] 棋子移動
- [ ] 地產購買/建造
- [ ] 租金計算
- [ ] 卡片效果
- [ ] 監獄機制
- [ ] 破產處理

### 多人聯機測試
- [ ] 多玩家同時在線
- [ ] 狀態即時同步
- [ ] 回合順序正確
- [ ] 事件廣播正常

### 效能測試
- [ ] 多房間同時運行
- [ ] 大量玩家連接
- [ ] 長時間穩定運行
- [ ] 記憶體使用合理

---

## 🎯 進階測試建議

### 1. 自動化測試腳本
考慮創建自動化測試腳本來模擬多玩家遊戲場景。

### 2. 壓力測試
使用工具如 `artillery` 或 `socket.io-load-tester` 進行壓力測試。

### 3. 整合測試
設置完整的端到端測試環境。

---

**🎮 祝您測試順利！如有問題請參考日誌或聯繫開發團隊。**
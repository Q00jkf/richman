# 🛠️ RichMan 測試工具

本目錄包含了 RichMan 專案的各種測試工具，幫助您快速驗證遊戲功能。

## 📁 文件說明

### 🚀 快速啟動
- **`quick-test.bat`** - Windows 一鍵測試工具（推薦使用）
- **`README.md`** - 本說明文件

### 🧪 測試腳本
- **`test-api.js`** - REST API 功能測試
- **`test-websocket.js`** - WebSocket 連接和遊戲邏輯測試

## 🎯 快速開始

### 方法 1: 使用一鍵測試工具 (Windows)
```bash
# 雙擊執行或在命令行運行
tools/quick-test.bat
```

### 方法 2: 手動測試

#### 1. 啟動伺服器
```bash
npm run server
```

#### 2. API 測試
```bash
node tools/test-api.js
```

#### 3. WebSocket 測試
```bash
# 基本測試
node tools/test-websocket.js basic

# 多人測試
node tools/test-websocket.js multi
```

## 📋 測試內容

### 🔍 API 測試 (`test-api.js`)
- ✅ 伺服器健康檢查
- ✅ 玩家 CRUD 操作
- ✅ 房間管理功能
- ✅ 遊戲列表查詢
- ✅ 錯誤處理驗證

### 📡 WebSocket 測試 (`test-websocket.js`)
- ✅ WebSocket 連接測試
- ✅ 玩家創建和房間管理
- ✅ 遊戲開始和回合管理
- ✅ 擲骰子和移動機制
- ✅ 地產購買和建造
- ✅ 多人即時同步

## 🎮 測試場景

### 基本遊戲流程
1. 伺服器啟動確認
2. 玩家註冊和登入
3. 房間創建和加入
4. 遊戲開始
5. 擲骰子和移動
6. 地產交易
7. 回合結束

### 多人聯機測試
1. 多個玩家同時連接
2. 加入同一房間
3. 即時狀態同步
4. 回合順序管理
5. 互動事件處理

## 📊 預期結果

### 成功啟動標誌
```
🚀 RichMan Server running on port 5000
📱 Client URL: http://localhost:3000
🎮 Game Manager initialized
👥 Player Manager initialized
🏠 Room Manager initialized
📡 Socket Service initialized
⚡ Server ready for connections!
```

### API 測試成功率
- 目標: >90% 測試通過
- 健康檢查: 100% 成功
- 核心 API: >95% 成功

### WebSocket 測試指標
- 連接成功率: 100%
- 事件同步延遲: <100ms
- 多人遊戲穩定性: >99%

## 🚨 問題排除

### 常見問題

#### 1. 伺服器無法啟動
```bash
# 檢查端口占用
netstat -ano | findstr :5000

# 更換端口
PORT=5001 npm run server
```

#### 2. API 測試失敗
- 確認伺服器已啟動
- 檢查防火牆設置
- 驗證網路連接

#### 3. WebSocket 連接失敗
- 確認伺服器支援 WebSocket
- 檢查瀏覽器兼容性
- 查看開發者工具錯誤

### 調試工具

#### 啟用詳細日誌
```bash
DEBUG=* npm run server
```

#### 監控網路請求
- 使用瀏覽器開發者工具
- 檢查 Network 和 WebSocket 標籤

## 📈 效能測試

### 基準測試
- 單伺服器支援: 100+ 並發連接
- 回應時間: <50ms (API)
- 記憶體使用: <200MB (空載)

### 壓力測試 (可選)
```bash
# 安裝壓力測試工具
npm install -g artillery

# 執行壓力測試
artillery quick --count 50 --num 10 http://localhost:5000/health
```

## 🔧 自定義測試

### 創建自定義測試
```javascript
// 基於現有工具擴展
const APITester = require('./test-api');

class CustomTester extends APITester {
  async customTest() {
    // 您的自定義測試邏輯
  }
}
```

### 測試配置
```javascript
// 修改測試參數
const tester = new GameTester('http://localhost:5001');
tester.playerCount = 6; // 測試 6 人遊戲
```

## 📝 測試報告

### 生成報告
測試工具會自動生成結果摘要：
- 通過/失敗統計
- 錯誤詳情
- 建議改進項目

### 持續集成
考慮將測試腳本集成到 CI/CD 流程中：
```yaml
# .github/workflows/test.yml
- name: Run API Tests
  run: node tools/test-api.js
```

## 🎯 下一步

1. **擴展測試覆蓋** - 添加更多測試場景
2. **自動化測試** - 設置持續集成
3. **效能監控** - 建立監控dashboard
4. **用戶測試** - 收集真實用戶反饋

---

**💡 提示**: 建議按照 `quick-test.bat` 的順序進行測試，確保每個階段都正常運行再進行下一步。

**📞 需要幫助?** 請參考 `docs/TESTING_GUIDE.md` 獲取詳細說明。
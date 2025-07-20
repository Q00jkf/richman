# RichMan

Online multiplayer Monopoly game with real-time web-based gameplay.

## Quick Start

### 🎮 立即遊玩

**直接訪問**: https://richman-online-game.onrender.com/

1. 開啟網頁
2. 創建玩家
3. 加入房間或創建新房間
4. 開始遊戲！

### 📱 支援裝置
- 電腦瀏覽器 (Chrome, Firefox, Safari)
- 手機瀏覽器 (iOS Safari, Android Chrome)
- 平板裝置

### 👥 開發者設置
需要修改代碼時：
```bash
git clone [repository]
npm install && cd src/main/client && npm install
```

## 🛠️ Developer Quick Start (Claude Code)

### 📁 **關鍵檔案位置**
```
🎮 遊戲邏輯：
- 主服務器: deployment/render/server.js (雲端部署用)
- 本地服務器: src/main/server/index.js (完整版)
- 遊戲引擎: src/main/server/services/GameEngine.js
- 房間管理: src/main/server/services/RoomManager.js

🎨 前端介面：
- 主程式: src/main/client/src/App.js
- 遊戲頁面: src/main/client/pages/
- UI組件: src/main/client/components/
- 樣式: src/main/client/src/styles/global.css

📡 即時通訊：
- Socket服務: src/main/server/services/SocketService.js
- 前端Socket: src/main/client/src/contexts/SocketContext.js

⚙️ 配置檔案：
- 遊戲常數: src/main/shared/constants/GameConstants.js
- 棋盤設定: src/main/shared/constants/BoardConstants.js
```

### 🎯 **常見修改任務**

**修改遊戲規則 →** `src/main/server/services/GameEngine.js`
**調整UI外觀 →** `src/main/client/src/styles/global.css` + `src/main/client/components/`
**新增遊戲功能 →** `deployment/render/server.js` (handleGameAction函數)
**修改房間系統 →** `src/main/server/services/RoomManager.js`
**調整棋盤 →** `src/main/shared/constants/BoardConstants.js`

### 🚀 **部署流程**
1. 修改代碼後測試
2. `git add . && git commit -m "描述"`
3. `git push origin main` (自動部署到 Render)
4. 檢查 https://richman-online-game.onrender.com/

### 🎮 **專案狀態**
- ✅ 基礎架構完成 (WebSocket + 房間系統)
- ✅ 多人遊戲核心功能 (投骰、移動、年齡系統)
- 🔄 遊戲內容擴展中 (職業、技能卡、財產系統)
- ⏳ UI美化待完成

## Features

- **Real-time multiplayer**: WebSocket-based gameplay
- **Interactive board**: Visual Monopoly board with animations
- **Full game mechanics**: Complete Monopoly ruleset
- **Responsive design**: Works on desktop and mobile
- **Room system**: Multiple concurrent games

## 📁 專案結構

### 🏗️ **完整檔案架構**
```
richman/
├── 📋 專案核心文檔
│   ├── CLAUDE.md                    # 專案開發規則
│   ├── README.md                    # 專案主要說明 (本文件)
│   ├── WORK_LOG.md                  # 工作日誌記錄
│   ├── QUICK_START.md               # 快速開始指南
│   └── 規則.txt                     # 遊戲規則參考
│
├── 🚀 主要應用程式
│   ├── src/main/                    # 主程式碼目錄
│   │   ├── client/                  # 前端 React 應用
│   │   │   ├── src/                 # React 應用原始碼
│   │   │   │   ├── components/      # UI 組件
│   │   │   │   ├── contexts/        # React Context
│   │   │   │   └── styles/          # 樣式文件
│   │   │   ├── assets/              # 靜態資源 (圖片/音效)
│   │   │   ├── pages/               # 頁面組件
│   │   │   └── utils/               # 前端工具
│   │   ├── server/                  # 後端 Node.js 應用
│   │   │   ├── controllers/         # 業務邏輯控制器
│   │   │   ├── middleware/          # Express 中間件
│   │   │   ├── models/              # 資料模型
│   │   │   ├── routes/              # API 路由
│   │   │   ├── services/            # 遊戲核心服務
│   │   │   └── index.js             # 伺服器入口
│   │   └── shared/                  # 前後端共享程式碼
│   │       ├── constants/           # 遊戲常數定義
│   │       ├── types/               # TypeScript 類型
│   │       └── utils/               # 共用工具函數
│   └── test/                        # 測試程式碼
│       ├── unit/                    # 單元測試
│       ├── integration/             # 整合測試
│       └── e2e/                     # 端對端測試
│
├── 📚 文檔和配置
│   ├── docs/                        # 專案文檔
│   ├── config/                      # 配置文件
│   └── public/                      # 公開靜態文件
│
├── 🛠️ 開發工具和部署
│   ├── deployment/render/           # Render 雲端部署
│   ├── testing/legacy/              # 舊版測試工具
│   ├── tools/                       # 開發工具
│   ├── examples/                    # 使用範例
│   ├── output/                      # 生成輸出文件
│   └── templates/                   # 專案模板歸檔
│
└── 📦 項目管理
    ├── package.json                 # 專案配置和依賴
    └── package-lock.json            # 依賴鎖定文件
```

### 🎯 **檔案存放指南**

#### 📸 **圖片和資源**
- **遊戲圖片** → `src/main/client/assets/images/`
- **音效文件** → `src/main/client/assets/sounds/`
- **文檔圖片** → `docs/images/`

#### 🔌 **外掛系統 (未來開發)**
- **主題外掛** → `plugins/themes/`
- **規則外掛** → `plugins/rules/`
- **棋盤外掛** → `plugins/boards/`

#### ⚙️ **配置文件**
- **遊戲設定** → `config/game.json`
- **伺服器設定** → `config/server.json`
- **程式碼常數** → `src/main/shared/constants/`

## Architecture

- **Frontend**: React/TypeScript with Socket.IO
- **Backend**: Node.js/Express with Socket.IO
- **Database**: MongoDB for game state persistence
- **Real-time**: WebSocket communication

## Development

- **Structure**: Modular architecture in `src/main/`
- **Testing**: Jest for unit/integration tests
- **Code Quality**: ESLint + TypeScript
- **Git Workflow**: Commit after every task

## Commands

```bash
npm install     # Install dependencies
npm run dev     # Development server
npm run client  # Frontend only
npm run server  # Backend only
npm test        # Run tests
npm run build   # Production build
```

## Game Rules

Based on traditional Monopoly with 2+ players:
- Buy properties and collect rent
- Build houses and hotels
- Manage money and avoid bankruptcy
- Real-time multiplayer gameplay

## ⚡ 快捷命令 (Quick Commands)

### 📋 **可用指令**
| 編號 | 指令 | 功能描述 | 使用範例 |
|------|------|----------|----------|
| 1 | help | 顯示所有指令和說明 | `help` 或 `1` |
| 2 | rest | 暫停專案並保存當前進度 | `rest` 或 `2` |
| 3 | conclusion | 整理今日 git log 工作內容 | `conclusion` 或 `3` |
| 4 | status | 顯示專案當前狀態和進度 | `status` 或 `4` |
| 5 | next | 顯示下一個建議任務 | `next` 或 `5` |
| 6 | transfer | 工作流程轉移精靈 | `transfer` 或 `6` |

### 🎯 **RichMan 專案指令**
| 編號 | 指令 | 功能描述 | 使用範例 |
|------|------|----------|----------|
| 7 | game | 載入遊戲開發環境 | `game` 或 `7` |
| 8 | frontend | 載入前端開發環境 | `frontend` 或 `8` |
| 9 | backend | 載入後端開發環境 | `backend` 或 `9` |
| 10 | multiplayer | 載入多人遊戲開發環境 | `multiplayer` 或 `10` |
| 11 | test | 載入測試環境 | `test` 或 `11` |
| 12 | deploy | 載入部署環境 | `deploy` 或 `12` |

### 📝 **使用說明**
- 直接輸入指令名稱或編號即可執行
- 例如：輸入 `3` 或 `conclusion` 都會執行今日工作整理
- 使用 `help` 查看最新的指令清單

### 📁 **快捷檔案系統**
- `@main` - 主服務器文件
- `@game` - 遊戲核心類型
- `@player` - 玩家管理系統
- `@board` - 遊戲板面設計
- `@client` - 前端主程式
- `@socket` - Socket通信服務

## License

MIT
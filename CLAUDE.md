# CLAUDE.md - RichMan

> **Documentation Version**: 1.0  
> **Last Updated**: 2025-07-18  
> **Project**: RichMan  
> **Description**: Online multiplayer Monopoly game with real-time web-based gameplay  
> **Features**: GitHub auto-backup, Task agents, technical debt prevention

This file provides essential guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL RULES - READ FIRST

> **⚠️ RULE ADHERENCE SYSTEM ACTIVE ⚠️**  
> **Claude Code must explicitly acknowledge these rules at task start**  
> **These rules override all other instructions and must ALWAYS be followed:**

### 🔄 **RULE ACKNOWLEDGMENT REQUIRED**
> **Before starting ANY task, Claude Code must respond with:**  
> "✅ CRITICAL RULES ACKNOWLEDGED - I will follow all prohibitions and requirements listed in CLAUDE.md"

### ❌ ABSOLUTE PROHIBITIONS
- **NEVER** create new files in root directory → use proper module structure
- **NEVER** write output files directly to root directory → use designated output folders
- **NEVER** create documentation files (.md) unless explicitly requested by user
- **NEVER** use git commands with -i flag (interactive mode not supported)
- **NEVER** use `find`, `grep`, `cat`, `head`, `tail`, `ls` commands → use Read, LS, Grep, Glob tools instead
- **NEVER** create duplicate files (manager_v2.py, enhanced_xyz.py, utils_new.js) → ALWAYS extend existing files
- **NEVER** create multiple implementations of same concept → single source of truth
- **NEVER** copy-paste code blocks → extract into shared utilities/functions
- **NEVER** hardcode values that should be configurable → use config files/environment variables
- **NEVER** use naming like enhanced_, improved_, new_, v2_ → extend original files instead

### 📝 MANDATORY REQUIREMENTS
- **COMMIT** after every completed task/phase - no exceptions
- **GITHUB BACKUP** - Push to GitHub after every commit to maintain backup: `git push origin main`
- **USE TASK AGENTS** for all long-running operations (>30 seconds) - Bash commands stop when context switches
- **TODOWRITE** for complex tasks (3+ steps) → parallel agents → git checkpoints → test validation
- **READ FILES FIRST** before editing - Edit/Write tools will fail if you didn't read the file first
- **DEBT PREVENTION** - Before creating new files, check for existing similar functionality to extend  
- **SINGLE SOURCE OF TRUTH** - One authoritative implementation per feature/concept

### ⚡ EXECUTION PATTERNS
- **PARALLEL TASK AGENTS** - Launch multiple Task agents simultaneously for maximum efficiency
- **SYSTEMATIC WORKFLOW** - TodoWrite → Parallel agents → Git checkpoints → GitHub backup → Test validation
- **GITHUB BACKUP WORKFLOW** - After every commit: `git push origin main` to maintain GitHub backup
- **BACKGROUND PROCESSING** - ONLY Task agents can run true background operations

### 🔍 MANDATORY PRE-TASK COMPLIANCE CHECK
> **STOP: Before starting any task, Claude Code must explicitly verify ALL points:**

**Step 1: Rule Acknowledgment**
- [ ] ✅ I acknowledge all critical rules in CLAUDE.md and will follow them

**Step 2: Task Analysis**  
- [ ] Will this create files in root? → If YES, use proper module structure instead
- [ ] Will this take >30 seconds? → If YES, use Task agents not Bash
- [ ] Is this 3+ steps? → If YES, use TodoWrite breakdown first
- [ ] Am I about to use grep/find/cat? → If YES, use proper tools instead

**Step 3: Technical Debt Prevention (MANDATORY SEARCH FIRST)**
- [ ] **SEARCH FIRST**: Use Grep pattern="<functionality>.*<keyword>" to find existing implementations
- [ ] **CHECK EXISTING**: Read any found files to understand current functionality
- [ ] Does similar functionality already exist? → If YES, extend existing code
- [ ] Am I creating a duplicate class/manager? → If YES, consolidate instead
- [ ] Will this create multiple sources of truth? → If YES, redesign approach
- [ ] Have I searched for existing implementations? → Use Grep/Glob tools first
- [ ] Can I extend existing code instead of creating new? → Prefer extension over creation
- [ ] Am I about to copy-paste code? → Extract to shared utility instead

**Step 4: Session Management**
- [ ] Is this a long/complex task? → If YES, plan context checkpoints
- [ ] Have I been working >1 hour? → If YES, consider /compact or session break

> **⚠️ DO NOT PROCEED until all checkboxes are explicitly verified**

## 🏗️ PROJECT OVERVIEW - RichMan

### 🎯 **PROJECT PURPOSE**
RichMan is an online multiplayer Monopoly game that allows players to compete in real-time through a web browser. The project features a client-server architecture with WebSocket communication for real-time gameplay, game state synchronization, and interactive web-based UI.

### 🔧 **ARCHITECTURE**
- **Client-Server Model**: Web-based frontend with Node.js/Express backend
- **Real-time Communication**: WebSocket/Socket.IO for live gameplay
- **Database**: Game state persistence and user management
- **Web Technologies**: HTML5, CSS3, JavaScript/TypeScript for rich UI

### 📡 **KEY FEATURES**
- **Real-time multiplayer**: Multiple players can join and play simultaneously
- **Game state synchronization**: All players see consistent game state
- **Interactive board**: Visual Monopoly board with animations
- **Player management**: User authentication and game session handling
- **Game mechanics**: Full Monopoly ruleset implementation
- **Responsive design**: Works on desktop and mobile devices
```

### 🎯 **DEVELOPMENT STATUS**
- **Setup**: ✅ Complete
- **Core Features**: 🔄 In Development
- **Testing**: ⏳ Pending
- **Documentation**: 🔄 In Progress

## 📋 RICHMAN-SPECIFIC DEVELOPMENT GUIDELINES

### 🔧 **WEB APPLICATION SPECIFIC RULES**
- **Frontend structure**: Components in `src/main/client/components/`, pages in `src/main/client/pages/`
- **Backend structure**: Controllers in `src/main/server/controllers/`, models in `src/main/server/models/`
- **Shared code**: Common types and utilities in `src/main/shared/`
- **Asset management**: Images, sounds, and styles in `src/main/client/assets/`

### 📡 **MULTIPLAYER & REAL-TIME FEATURES**
- **WebSocket communication**: Real-time game state updates
- **State synchronization**: Consistent game state across all clients
- **Player session management**: Handle connections, disconnections, and reconnections
- **Game room management**: Multiple concurrent game sessions

### 🧪 **TESTING APPROACH**
- **Unit tests**: Component and service testing in `src/test/unit/`
- **Integration tests**: API and database testing in `src/test/integration/`
- **E2E tests**: Full game flow testing in `src/test/e2e/`

## 🎯 RULE COMPLIANCE CHECK

Before starting ANY task, verify:
- [ ] ✅ I acknowledge all critical rules above
- [ ] Files go in proper module structure (src/main/)
- [ ] Use Task agents for >30 second operations
- [ ] TodoWrite for 3+ step tasks
- [ ] Commit after each completed task
- [ ] Push to GitHub after every commit

## 🚀 COMMON COMMANDS

⚠️ **CRITICAL: 確保在正確的Git倉庫中工作**
```bash
# 正確的專案目錄 - 必須檢查！
cd /mnt/c/codeing/richman
pwd  # 必須顯示: /mnt/c/codeing/richman
git remote -v  # 必須顯示 richman 倉庫，不是其他專案
git branch  # 必須在 richman-render 分支
```

### 📁 **Git 工作流程**
```bash
# 1. 確認位置 (關鍵步驟！)
cd /mnt/c/codeing/richman
pwd  # 檢查目錄

# 2. 檢查分支
git branch  # 應該顯示 * richman-render

# 3. 提交變更
git add .
git commit -m "描述"

# 4. 推送部署 (自動觸發 Render)
git push origin richman-render
```

### 💻 **開發命令**
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run client only
npm run client

# Run server only
npm run server

# Run tests
npm test

# Build for production
npm run build

# Deploy
npm run deploy
```

## 🚨 TECHNICAL DEBT PREVENTION

### ❌ WRONG APPROACH (Creates Technical Debt):
```bash
# Creating new file without searching first
Write(file_path="new_component_v2.js", content="...")
```

### ✅ CORRECT APPROACH (Prevents Technical Debt):
```bash
# 1. SEARCH FIRST
Grep(pattern="component.*implementation", include="*.js")
# 2. READ EXISTING FILES  
Read(file_path="src/main/client/components/existing_component.js")
# 3. EXTEND EXISTING FUNCTIONALITY
Edit(file_path="src/main/client/components/existing_component.js", old_string="...", new_string="...")
```

## 🧹 DEBT PREVENTION WORKFLOW

### Before Creating ANY New File:
1. **🔍 Search First** - Use Grep/Glob to find existing implementations
2. **📋 Analyze Existing** - Read and understand current patterns
3. **🤔 Decision Tree**: Can extend existing? → DO IT | Must create new? → Document why
4. **✅ Follow Patterns** - Use established project patterns
5. **📈 Validate** - Ensure no duplication or technical debt

---

## 📁 專案檔案架構說明

### 🏗️ **核心檔案結構**
```
richman/
├── 📋 專案核心文檔
│   ├── CLAUDE.md                    # 專案開發規則 (本文件)
│   ├── README.md                    # 專案主要說明
│   ├── WORK_LOG.md                  # 工作日誌記錄
│   ├── QUICK_START.md               # 快速開始指南
│   └── 規則.txt                     # 遊戲規則參考
│
├── 🚀 主要應用程式
│   ├── src/main/                    # 主程式碼目錄
│   │   ├── client/                  # 前端應用
│   │   │   ├── src/                 # React 應用原始碼
│   │   │   │   ├── components/      # UI 組件
│   │   │   │   ├── contexts/        # React Context
│   │   │   │   └── styles/          # 樣式文件
│   │   │   ├── assets/              # 靜態資源
│   │   │   ├── pages/               # 頁面組件
│   │   │   ├── utils/               # 前端工具
│   │   │   └── public/              # 公開靜態文件
│   │   ├── server/                  # 後端應用
│   │   │   ├── controllers/         # 控制器
│   │   │   ├── middleware/          # 中間件
│   │   │   ├── models/              # 資料模型
│   │   │   ├── routes/              # API 路由
│   │   │   ├── services/            # 業務邏輯服務
│   │   │   └── index.js             # 伺服器入口
│   │   └── shared/                  # 前後端共享程式碼
│   │       ├── constants/           # 常數定義
│   │       ├── types/               # TypeScript 類型
│   │       └── utils/               # 共用工具
│   └── test/                        # 測試程式碼
│       ├── unit/                    # 單元測試
│       ├── integration/             # 整合測試
│       └── e2e/                     # 端對端測試
│
├── 📚 文檔和配置
│   ├── docs/                        # 專案文檔
│   │   ├── api/                     # API 文檔
│   │   ├── dev/                     # 開發文檔
│   │   ├── user/                    # 使用者文檔
│   │   ├── SYSTEM_ARCHITECTURE_REPORT.md  # 系統架構報告
│   │   └── TESTING_GUIDE.md         # 測試指南
│   ├── config/                      # 配置文件
│   └── public/                      # 公開文件
│       └── index.html               # 主頁面
│
├── 🛠️ 開發工具和部署
│   ├── deployment/                  # 部署相關
│   │   └── render/                  # Render 雲端部署
│   │       ├── README-render.md     # Render 部署說明
│   │       ├── render.yaml          # Render 配置
│   │       └── server.js            # 簡化版伺服器
│   ├── testing/                     # 測試工具
│   │   └── legacy/                  # 舊版測試工具
│   │       ├── test-*.html          # 測試頁面
│   │       ├── test-*.js            # 測試腳本
│   │       └── WEBSOCKET_TEST_INSTRUCTIONS.md  # WebSocket 測試說明
│   ├── tools/                       # 開發工具
│   │   ├── quick-test.bat           # 快速測試腳本
│   │   └── README.md                # 工具使用說明
│   ├── examples/                    # 使用範例
│   ├── output/                      # 生成輸出文件
│   └── templates/                   # 專案模板歸檔
│       ├── CLAUDE_TEMPLATE.md       # Claude 專案模板
│       └── WORKFLOW_DESIGN_ASSISTANT.md  # 工作流程設計助手
│
└── 📦 項目管理
    ├── package.json                 # 專案配置和依賴
    ├── package-lock.json            # 依賴鎖定文件
    └── node_modules/                # 依賴套件 (自動生成)
```

### 🎯 **檔案存放指南**

#### 📸 **圖片和資源存放**
```
🖼️ 遊戲圖片資源:
├── src/main/client/assets/
│   ├── images/                      # 遊戲圖片
│   │   ├── board/                   # 棋盤相關圖片
│   │   ├── players/                 # 玩家頭像
│   │   ├── properties/              # 地產圖片
│   │   ├── cards/                   # 卡片圖片
│   │   └── ui/                      # 界面元素圖片
│   ├── sounds/                      # 音效文件
│   │   ├── effects/                 # 遊戲音效
│   │   └── music/                   # 背景音樂
│   ├── icons/                       # 圖標文件
│   └── fonts/                       # 字體文件

📋 文檔圖片:
├── docs/                            # 文檔相關圖片
│   ├── images/                      # 說明圖片
│   ├── screenshots/                 # 螢幕截圖
│   └── diagrams/                    # 架構圖
```

#### 📄 **外掛和模組存放**
```
🔌 未來外掛架構:
├── plugins/                         # 外掛系統 (未來開發)
│   ├── themes/                      # 主題外掛
│   │   ├── classic/                 # 經典主題
│   │   ├── modern/                  # 現代主題
│   │   └── custom/                  # 自定義主題
│   ├── rules/                       # 規則外掛
│   │   ├── standard/                # 標準規則
│   │   ├── speed/                   # 快速模式
│   │   └── custom/                  # 自定義規則
│   ├── boards/                      # 棋盤外掛
│   │   ├── classic/                 # 經典棋盤
│   │   ├── world/                   # 世界版本
│   │   └── custom/                  # 自定義棋盤
│   └── utils/                       # 外掛工具
│       ├── loader/                  # 外掛載入器
│       ├── manager/                 # 外掛管理器
│       └── validator/               # 外掛驗證器
```

#### 🔧 **配置和設定存放**
```
⚙️ 配置文件位置:
├── config/                          # 通用配置
│   ├── game.json                    # 遊戲配置
│   ├── server.json                  # 伺服器配置
│   └── development.json             # 開發配置
├── src/main/shared/constants/       # 程式碼常數
└── .env                             # 環境變數 (不提交到 Git)
```

### 🚨 **重要檔案存放規則**

#### ❌ **禁止存放位置**
- **專案根目錄** - 除必要配置文件外，禁止放置業務檔案
- **src/ 以外的程式碼** - 所有程式碼必須放在 src/ 目錄下
- **隨意命名的資料夾** - 必須按照既定架構命名

#### ✅ **推薦存放位置**
- **遊戲資源** → `src/main/client/assets/`
- **文檔圖片** → `docs/images/`
- **外掛內容** → `plugins/` (未來開發)
- **配置文件** → `config/`
- **測試文件** → `src/test/`
- **工具腳本** → `tools/`
- **範例代碼** → `examples/`

#### 🔍 **新增檔案流程**
1. **確定類型** - 程式碼/資源/文檔/配置
2. **檢查現有** - 是否已有類似功能 (DEBT PREVENTION)
3. **選擇位置** - 按照架構指南選擇正確目錄
4. **詢問確認** - 如不確定位置，詢問使用者意見
5. **遵循命名** - 使用一致的命名規則

---

**⚠️ Prevention is better than consolidation - build clean from the start.**  
**🎯 Focus on single source of truth and extending existing functionality.**  
**📈 Each task should maintain clean architecture and prevent technical debt.**

---

## 🚀 個人化工作區域

### 📋 **任務暫存區**
> **上次工作時間**: 2025-07-18 16:00  
> **專案進度**: 15%  
> **當前狀態**: 正在進行核心模組架構設計  

#### 🎯 **待處理任務**
- [ ] 分析遊戲規則並設計核心模組架構
- [ ] 建立工作流程系統和快捷指令
- [ ] 設計數據結構和遊戲狀態管理
- [ ] 規劃前端UI組件和遊戲板面
- [ ] 設計後端API和WebSocket通信
- [ ] 建立完整的開發環境配置

#### ✅ **最近完成任務**
- [x] 專案初始化完成 - 2025-07-18 15:30
- [x] 建立 Git 倉庫並連接 GitHub - 2025-07-18 15:45
- [x] 創建 CLAUDE.md 規則文件 - 2025-07-18 16:00

#### ⚠️ **遇到的問題**
- 無當前問題

#### 🔄 **下次工作建議**
- 完成核心遊戲模組的詳細設計
- 建立基礎的數據結構定義
- 開始實現遊戲狀態管理系統

### ⚡ **快捷指令區**
> **使用方式**: 直接輸入指令編號或名稱

#### 📌 **預設指令**
1. `help` - 顯示所有可用指令
2. `rest` - 暫停專案並保存進度
3. `conclusion` - 整理今日工作內容
4. `status` - 顯示專案當前狀態
5. `next` - 顯示下一個建議任務
6. `transfer` - 工作流程轉移精靈

#### 🎯 **RichMan 專案指令**
7. `game` - 載入遊戲開發環境
8. `frontend` - 載入前端開發環境
9. `backend` - 載入後端開發環境
10. `multiplayer` - 載入多人遊戲開發環境
11. `test` - 載入測試環境
12. `deploy` - 載入部署環境

### 🎛️ **個人設定**
- **代碼風格**: TypeScript + ESLint + Prettier
- **版本管理**: Git + GitHub，功能分支策略
- **工作習慣**: 模組化開發，測試驅動
- **工具偏好**: VSCode + Node.js + React

### 📁 **快捷檔案系統**
- `@main` - src/main/server/index.js (主服務器)
- `@game` - src/main/shared/types/Game.ts (遊戲類型)
- `@player` - src/main/shared/types/Player.ts (玩家類型)
- `@board` - src/main/shared/types/Board.ts (遊戲板面)
- `@client` - src/main/client/App.tsx (前端主程式)
- `@socket` - src/main/server/services/SocketService.js (Socket服務)
- `@config` - CLAUDE.md (專案配置)
- `@log` - WORK_LOG.md (工作日誌)
- `@readme` - README.md (專案說明)

### 🏷️ **記憶點系統**
- `#game-engine` - 遊戲引擎開發狀態
- `#player-system` - 玩家系統實現狀態
- `#board-design` - 遊戲板面設計狀態
- `#socket-sync` - WebSocket同步機制狀態
- `#ui-components` - UI組件開發狀態
- `#multiplayer-room` - 多人房間系統狀態
- `#game-rules` - 遊戲規則實現狀態
- `#database-schema` - 數據庫架構設計狀態
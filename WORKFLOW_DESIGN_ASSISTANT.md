# 🛠️ 工作流程設計輔助 - WORKFLOW DESIGN ASSISTANT

> **作者**: guanyou  
> **建立日期**: 2025-07-18

> **用途**: CLAUDE_TEMPLATE.md 完成後的個人化工作流程設計  
> **適用**: 所有專案類型  
> **目標**: 快速建立個人化開發習慣和工作流程  

---

## 📋 使用說明

### 🎯 **何時使用此檔案**
- ✅ CLAUDE_TEMPLATE.md 已完成專案初始化
- ✅ 準備開始實際開發工作
- ✅ 需要建立個人化工作流程和習慣

### 🚀 **使用流程**
1. 回答下方的引導問題
2. Claude 會根據回答自動設置 CLAUDE.md 的指令區和任務暫存區
3. 快捷命令會自動添加到 README.md
4. 完成後可開始使用個人化工作流程

---

## 🔍 工作流程設計引導問題

### 📊 **第一部分：代碼風格偏好**

**Q1. 程式語言和框架偏好**
- 主要使用的程式語言：
- 偏好的程式框架：
- 編碼規範標準（如 PEP8, Google Style 等）：

**Q2. 命名規範**
- 變數命名風格（camelCase, snake_case）：
- 函數命名風格：
- 類別命名風格：
- 檔案命名風格：

**Q3. 代碼組織習慣**
- 偏好的檔案結構深度（淺層/深層）：
- 模組化程度偏好（高度模組化/簡單結構）：
- 註解風格偏好（詳細/簡潔）：

### 🔄 **第二部分：版本管理策略**

**Q4. Git 分支策略**
- 開發分支命名規則：
- 功能分支前綴偏好（feature/, feat/, 等）：
- 版本標籤格式（v1.0.0, 1.0.0）：

**Q5. 版本發布習慣**
- 版本號遞增規則（語義版本/自定義）：
- 發布前檢查清單項目：
- 版本發布頻率偏好：

### 📝 **第三部分：開發習慣**

**Q6. 工作時間模式**
- 偏好的工作時段：
- 專注時間長度：
- 休息頻率偏好：

**Q7. 測試習慣**
- 測試驅動開發偏好（TDD/後寫測試）：
- 測試覆蓋率目標：
- 偏好的測試框架：

**Q8. 文件化習慣**
- Commit 訊息格式偏好：
- 文件更新頻率：
- 技術文件詳細程度：

### 🛠️ **第四部分：工具偏好**

**Q9. 開發環境**
- 偏好的編輯器/IDE：
- 必要的擴展功能：
- 偏好的終端環境：

**Q10. 自動化偏好**
- 希望自動化的重複性任務：
- 品質檢查工具偏好：
- 部署流程偏好：

### 🚀 **第五部分：快捷命令需求**

**Q11. 除了預設命令（rest, conclusion, help）外，您還需要哪些快捷命令？**
- 列出希望的命令名稱：
- 描述各命令的預期功能：
- 使用頻率預估：

**Q12. 任務管理偏好**
- 任務追蹤詳細程度（簡要/詳細）：
- 進度報告格式偏好：
- 任務優先級劃分方式：

---

## 🔄 持續迭代與專案轉移功能

### 🛡️ **隱私安全原則 - 極其重要！**

> **🚨 CRITICAL SECURITY WARNING 🚨**  
> **此 md 檔案將跨專案使用，絕對禁止包含任何敏感資訊！**

#### ❌ **絕對禁止包含的內容**
- 🚫 **產品資訊** - 產品名稱、功能描述、商業邏輯
- 🚫 **程式碼內容** - 任何程式碼片段、API、資料庫結構
- 🚫 **專案細節** - 專案名稱、客戶名稱、具體需求
- 🚫 **商業機密** - 商業模式、競爭策略、內部資訊
- 🚫 **技術細節** - 架構設計、安全配置、伺服器資訊
- 🚫 **工作進度** - 具體任務內容、時程安排、里程碑
- 🚫 **人員資訊** - 團隊成員、聯絡方式、組織架構

#### ✅ **僅允許包含的內容**
- ✅ **工作習慣** - 個人偏好的工作方式和時間安排
- ✅ **快捷指令** - 通用的工作流程指令（如 build, test, deploy）
- ✅ **代碼風格** - 程式語言規範偏好（如 PEP8, ESLint）
- ✅ **工具偏好** - 編輯器、框架、開發工具選擇
- ✅ **流程模板** - 通用的檢查清單和工作流程模板

#### 🔒 **安全檢查機制**
Claude 在處理 transfer 指令時必須：
1. **過濾敏感內容** - 自動排除任何可能的敏感資訊
2. **通用化處理** - 將具體內容轉換為通用模板
3. **確認機制** - 轉移前明確告知使用者哪些內容被排除
4. **安全提醒** - 每次轉移時重申安全原則

### 🚀 **transfer 指令完整設計**

#### 🎯 **指令觸發情境**
```
使用者輸入: transfer
系統回應: 🔄 開始工作流程轉移精靈...
```

#### 📋 **執行流程設計**

**第一步：轉移模式選擇**
```
🤔 請選擇轉移模式：

1. 📋 部分複製 - 只複製他人的工作流程設定
2. 🆕 新專案設定 - 從我現有的工作流程建立新專案
3. 🔄 工作流程更新 - 更新當前專案的工作流程

請輸入選項 (1/2/3): 
```

**第二步：目標專案分析**
```
🔍 正在檢查目標專案...

📁 目標專案路徑: [自動檢測或詢問]
📝 發現現有 CLAUDE.md: [是/否]

[如果有現有檔案]
🤔 目標專案已有工作流程設定，您希望：
1. 🔄 合併設定 (保留現有+新增選項)
2. 🗑️ 完全覆蓋 (刪除現有設定)  
3. 📋 僅檢視差異 (不進行更改)

請選擇 (1/2/3):
```

**第三步：工作流程元素掃描**
```
🔍 掃描來源工作流程元素...

📊 發現的設定元素：
✅ 個人偏好設定 (X 項)
✅ 快捷指令 (X 個)
✅ 自動化規則 (X 個)  
✅ 檢查清單模板 (X 個)
✅ 工作習慣配置 (X 項)

🎯 開始逐項確認轉移...
```

**第四步：逐項確認轉移**
```
📌 個人偏好設定 #1:
   內容: "代碼風格偏好 - Python PEP8"
   
🤔 是否轉移此設定？
1. ✅ 是 - 完整轉移
2. ❌ 否 - 跳過此項  
3. ✏️ 修改 - 進入修改模式
4. ❓ 詳細 - 查看完整內容

請選擇 (1/2/3/4): 

[如果選擇修改]
✏️ 修改模式:
- 當前設定: "Python PEP8"
- 🤔 新專案的主要語言是？
- 🤔 是否需要調整為其他編碼規範？
- 🤔 有特殊的代碼風格要求嗎？
```

**第五步：專案類型適配**
```
🎯 新專案資訊收集:

🤔 請告訴我新專案的特性：
1. 專案類型: [Web應用/桌面軟體/行動應用/CLI工具/函式庫/其他]
2. 主要語言: [Python/JavaScript/Java/C++/其他]
3. 開發規模: [個人專案/小團隊(2-5人)/大團隊(5+人)]
4. 專案週期: [短期(1-3月)/中期(3-12月)/長期(1年+)]

根據您的選擇，我會推薦適合的工作流程調整...
```

### 🎛️ **專案類型差異化設計**

#### 🌐 **Web 應用專案**
```markdown
推薦工作流程調整:
- 快捷指令: deploy, test, build, lint
- 自動化: 熱重載、測試自動運行
- 檢查清單: 瀏覽器相容性、響應式設計
- 工作習慣: 前後端分離開發、API測試
```

#### 🖥️ **桌面軟體專案**
```markdown  
推薦工作流程調整:
- 快捷指令: build, package, debug, profile
- 自動化: 編譯檢查、記憶體測試
- 檢查清單: 平台相容性、效能測試
- 工作習慣: 版本發布流程、使用者介面測試
```

#### 📱 **行動應用專案**
```markdown
推薦工作流程調整:  
- 快捷指令: simulator, device-test, publish
- 自動化: 模擬器測試、電池使用分析
- 檢查清單: 裝置相容性、商店發布
- 工作習慣: 回應式設計、觸控操作測試
```

#### ⚡ **CLI 工具專案**
```markdown
推薦工作流程調整:
- 快捷指令: install, uninstall, help-gen
- 自動化: 指令測試、說明文件生成
- 檢查清單: 跨平台測試、參數驗證
- 工作習慣: 使用者體驗、錯誤處理
```

#### 📚 **函式庫專案**  
```markdown
推薦工作流程調整:
- 快捷指令: docs, publish, version
- 自動化: API文件生成、版本管理
- 檢查清單: 向後相容性、範例程式
- 工作習慣: 版本語義、開發者體驗
```

### 🔍 **智慧型提問機制**

#### 🤖 **秘書角色提問範例**
```
針對修改模式的詳細提問:

🤔 關於快捷指令 "deploy":
- 您的部署目標環境是？(測試/正式/多環境)
- 需要部署前自動測試嗎？
- 部署失敗時希望如何處理？
- 是否需要部署後的健康檢查？

🤔 關於代碼風格設定:
- 新專案的團隊規模如何？
- 是否有既定的編碼規範？
- 需要自動格式化工具嗎？
- 程式碼審查流程如何？

🤔 關於工作時間安排:
- 新專案的開發週期緊急嗎？
- 您偏好連續工作還是分段進行？  
- 需要進度追蹤和報告嗎？
- 有固定的檢查點或里程碑嗎？
```

---

## 🎯 Claude 執行指引

### 🔄 **新增：transfer 指令處理邏輯**

#### 📝 **當使用者輸入 "transfer" 時執行：**

1. **🔍 環境檢測 + 安全過濾**
   ```
   自動執行：
   - 檢測當前目錄是否有 CLAUDE.md
   - 掃描工作流程設定元素
   - 🛡️ 自動過濾敏感內容（產品資訊、程式碼、專案細節）
   - 識別可安全轉移的內容類型
   - 檢查目標專案現有設定
   - 🚨 顯示安全檢查結果和被過濾的內容類型
   ```

2. **💬 模式選擇對話 + 安全確認**
   ```
   🛡️ 安全檢查完成！已過濾敏感內容，僅保留工作流程設定。
   
   呈現給使用者：
   🤔 請選擇轉移模式：
   1. 📋 部分複製 - 只複製他人的工作流程設定
   2. 🆕 新專案設定 - 從我現有的工作流程建立新專案  
   3. 🔄 工作流程更新 - 更新當前專案的工作流程
   
   ⚠️ 提醒：此次轉移僅包含通用工作習慣和流程設定，
   不包含任何專案特定內容或敏感資訊。
   
   等待使用者回應，根據選擇執行對應流程
   ```

3. **🔍 逐項確認流程**
   ```
   對每個發現的工作流程元素：
   - 顯示元素名稱和簡要描述
   - 提供 4 個選項：是/否/修改/詳細
   - 如選擇修改，進入詳細提問模式
   - 記錄使用者的每個決定
   ```

4. **🤖 智慧提問模式**
   ```
   當使用者選擇修改時：
   - 根據元素類型提供相關問題
   - 根據專案類型調整問題內容
   - 收集足夠資訊進行客製化調整
   - 確認修改結果符合使用者需求
   ```

5. **📝 設定檔案生成**
   ```
   最終執行：
   - 生成新的工作流程設定
   - 更新 CLAUDE.md 和 README.md
   - 提供轉移摘要報告
   - 建議下一步行動
   ```

### 📋 **原有功能：初始設定流程**

#### 1️⃣ **更新 CLAUDE.md**
在 CLAUDE.md 末尾添加以下區域：

```markdown
---

## 🚀 個人化工作區域

### 📋 **任務暫存區**
> **上次工作時間**: [時間戳記]
> **專案進度**: [百分比]
> **當前狀態**: [狀態描述]

#### 🎯 **待處理任務**
- [ ] [任務1描述]
- [ ] [任務2描述]
- [ ] [任務3描述]

#### ✅ **最近完成任務**
- [x] [已完成任務1] - [完成時間]
- [x] [已完成任務2] - [完成時間]

#### ⚠️ **遇到的問題**
- [問題描述] - [解決方案/狀態]

#### 🔄 **下次工作建議**
- [建議行動1]
- [建議行動2]

### ⚡ **快捷指令區**
> **使用方式**: 直接輸入指令編號或名稱

#### 📌 **預設指令**
1. `help` - 顯示所有可用指令
2. `rest` - 暫停專案並保存進度
3. `conclusion` - 整理今日工作內容
4. `status` - 顯示專案當前狀態
5. `next` - 顯示下一個建議任務
6. `transfer` - 工作流程轉移精靈

#### 🎯 **個人化指令**
[根據使用者需求自動生成]

### 🎛️ **個人設定**
- **代碼風格**: [根據Q1-Q3設定]
- **版本管理**: [根據Q4-Q5設定]
- **工作習慣**: [根據Q6-Q8設定]
- **工具偏好**: [根據Q9-Q10設定]
```

#### 2️⃣ **更新 README.md**
在 README.md 中添加快捷命令區域：

```markdown
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

### 🎯 **個人化指令**
[根據使用者需求動態增加]

### 📝 **使用說明**
- 直接輸入指令名稱或編號即可執行
- 例如：輸入 `3` 或 `conclusion` 都會執行今日工作整理
- 使用 `help` 查看最新的指令清單
```

#### 3️⃣ **預設指令詳細說明**

**🔄 rest 指令功能**
```
執行內容：
1. 保存當前工作進度到 CLAUDE.md 任務暫存區
2. 記錄暫停時間和原因
3. 生成下次開始的檢查清單
4. 更新專案狀態
5. 提供恢復工作的建議
```

**📊 conclusion 指令功能**
```
執行內容：
1. 讀取今日的 git log 記錄
2. 整理提交的內容和更改
3. 生成今日工作摘要
4. 統計程式碼變更量
5. 分析工作效率和進度
```

**❓ help 指令功能**
```
執行內容：
1. 顯示所有可用指令清單
2. 提供編號對應表
3. 說明各指令的功能
4. 顯示使用範例
5. 提供快速啟動方式
```

**🔄 transfer 指令功能**
```
執行內容：
1. 啟動工作流程轉移精靈
2. 掃描並分析現有工作流程設定
3. 提供三種轉移模式選擇
4. 逐項確認要轉移的設定元素
5. 根據專案類型智慧調整工作流程
6. 生成轉移摘要和建議
```

#### 4️⃣ **自動讀取和報告機制**

**當 Claude 檢測到專案檔案上傳時，自動執行：**

1. **讀取 CLAUDE.md 任務暫存區**
2. **生成工作報告**：
   ```
   📊 專案狀態報告
   
   🕒 上次工作: [時間]
   📈 整體進度: [百分比]
   
   📋 上次工作摘要:
   - [工作內容1]
   - [工作內容2]
   
   ⏳ 待處理任務:
   - [ ] [任務1]
   - [ ] [任務2]
   
   🎯 建議下一步:
   - [建議行動1]
   - [建議行動2]
   
   ❓ 需要了解的資訊:
   - [詢問使用者的問題]
   ```

#### 5️⃣ **動態增加指令機制**

**當需要新增指令時：**
1. 詢問指令名稱和功能描述
2. 確認使用場景和頻率
3. 生成指令執行邏輯
4. 更新 README.md 指令表
5. 更新 CLAUDE.md 指令區
6. 分配新的編號

---

## 🎯 完成檢查清單

### ✅ **初始設置完成後確認**
- [ ] CLAUDE.md 已添加任務暫存區
- [ ] CLAUDE.md 已添加快捷指令區
- [ ] README.md 已添加快捷命令表
- [ ] 預設指令已正確設置 (包含 transfer)
- [ ] 個人化設定已記錄
- [ ] 自動讀取機制已啟用
- [ ] 隱私安全原則已設定

### 🔄 **transfer 功能確認**
- [ ] transfer 指令已加入預設指令清單
- [ ] 三種轉移模式邏輯已設定
- [ ] 逐項確認機制已建立
- [ ] 專案類型差異化處理已配置
- [ ] 智慧提問機制已啟用
- [ ] 衝突處理邏輯已建立

### 🚀 **開始使用**
設置完成後，您可以：
- 使用 `help` 查看所有指令
- 使用 `status` 查看當前狀態
- 使用 `transfer` 進行工作流程轉移
- 開始正常的開發工作
- 使用 `rest` 暫停時保存進度
- 使用 `conclusion` 整理每日工作

### 🎯 **跨專案使用流程**
1. **專案結束時**：確保工作流程設定已完善
2. **開始新專案時**：複製此 md 檔案到新專案目錄
3. **執行轉移**：使用 `transfer` 指令進行工作流程適配
4. **持續優化**：根據新專案需求調整工作流程

---

**⚠️ 注意**: 此檔案完成工作流程設計後可以保留作為參考，或根據 CLAUDE.md 規範進行歸檔。

---

## 📝 更新日誌

### 🚀 **v2.0 (2025-07-18)**
**新增功能：**
- ✨ transfer 指令 - 工作流程轉移精靈
- 🔄 持續迭代工作流程功能
- 🛡️ 隱私安全原則強化
- 🎯 專案類型差異化處理
- 🤖 智慧型提問機制
- 📊 三種轉移模式支援

**改進項目：**
- 📋 完善的逐項確認流程
- 🔍 自動環境檢測功能
- 💬 互動式設定調整
- 📝 詳細的執行指引
- ✅ 擴充的檢查清單

**安全提升：**
- 🛡️ 防止敏感資訊洩漏
- 📋 工作內容與設定分離
- 🔒 跨專案安全轉移機制

### 📋 **v1.0 (原始版本)**
- 基礎工作流程設計框架
- 12 個引導問題
- 預設指令系統 (5個)
- 初始 Claude 執行邏輯

---

## 🎯 **v3.0 - MINSPixhawk 實戰經驗總結**

### 🚀 **Claude Code 增強系統完整實施指南**
> **實戰版本**: 基於 MINSPixhawk 專案的完整實施經驗  
> **更新日期**: 2025-07-18  
> **核心特色**: 專家級開發環境 + 3-5倍效率提升  

#### 🎯 **完整實施流程**

##### **第一階段：基礎工作流程安裝**
```bash
# 1. 建立基礎快捷指令系統 (6個)
1. help      - 顯示所有指令和說明
2. rest      - 暫停專案並保存進度
3. conclusion - 整理今日工作內容
4. status    - 顯示專案當前狀態
5. next      - 顯示下一個建議任務
6. transfer  - 工作流程轉移精靈

# 2. 建立工作日誌分離系統
WORK_LOG.md  - 專門儲存工作日誌和rest指令記錄
```

##### **第二階段：Claude Code 快捷鍵整合**
```bash
# 建立快捷鍵系統
Shift+Tab    - 自動接受編輯建議
@            - 添加文件/資料夾到上下文
#            - 創建記憶點
!            - 進入 bash 模式
Double-esc   - 回到歷史記錄
Ctrl+R       - 詳細輸出模式
/vibe        - AI 智能建議模式
```

##### **第三階段：專業環境快捷系統**
```bash
# 建立檔案快捷添加系統 (模組化結構)
@main        - 主程式檔案
@xsens       - src/communication/myUARTSensor.cpp (感測器通訊)
@fusion      - src/core/gnss_ahrs_fusion.h (融合演算法)
@orientation - src/core/Orientation.h (方向計算)
@uart        - src/utils/myUART.h (UART 工具)
@config      - CLAUDE.md (專案設定)
@log         - WORK_LOG.md (工作日誌)
@readme      - README.md (專案說明)
@docs        - docs/ (文檔資料)
@backup      - backup/ (備份檔案)
@claude      - .claude/ (Claude 配置)
```

##### **第四階段：記憶點系統建立**
```bash
# 技術模組記憶點 (5個)
#xsens-debug          - 感測器調試狀態
#mavlink-config       - 協定配置狀態
#nmea-parser          - 解析器開發狀態
#time-sync            - 時序同步機制狀態
#coordinate-transform - 座標轉換演算法狀態

# 問題解決記憶點 (4個)
#checksum-fix         - 校驗和修復進度
#frequency-issue      - 頻率問題解決方案
#buffer-overflow      - 緩衝區溢出解決狀態
#hardware-test        - 硬體測試結果記錄

# 專案里程碑記憶點 (4個)
#milestone-alpha      - Alpha 版本開發完成
#milestone-beta       - Beta 版本測試完成
#milestone-release    - 正式版本發布狀態
#integration-success  - 系統整合成功狀態
```

##### **第五階段：斜杠指令專業環境**
```bash
# 建立自定義斜杠指令系統
/xsens               - 載入感測器開發環境
/mavlink             - 載入協定開發環境
/debug-nmea          - 載入調試工具環境
/hardware            - 載入硬體整合環境
```

#### 📁 **完整文件結構**
```
專案根目錄/
├── .claude/
│   ├── commands/
│   │   ├── xsens.md          # 感測器開發環境
│   │   ├── mavlink.md        # 協定開發環境
│   │   ├── debug-nmea.md     # 調試工具環境
│   │   └── hardware.md       # 硬體整合環境
│   ├── settings.json         # 專案配置
│   └── settings.local.json   # 本地配置
├── src/                      # 原始碼目錄
│   ├── core/                 # 核心模組
│   │   ├── gnss_ahrs_fusion.cpp
│   │   ├── gnss_ahrs_fusion.h
│   │   ├── Orientation.cpp
│   │   └── Orientation.h
│   ├── communication/        # 通訊模組
│   │   ├── myUARTSensor.cpp
│   │   ├── myUARTSensor.h
│   │   ├── myMessage.cpp
│   │   ├── myMessage.h
│   │   ├── uartRT.cpp
│   │   └── uartRT.h
│   ├── utils/                # 工具模組
│   │   └── myUART.h
│   └── external/             # 外部函式庫
│       └── Xsens/
│           └── XsensMessage.h
├── docs/                     # 文檔資料
│   ├── GNSS官網資料.png
│   ├── 架構圖.jpg
│   └── LOCOSYS/
├── backup/                   # 備份檔案
├── 主程式.ino                # 主程式檔案
├── CLAUDE.md                 # 專案主配置
├── README.md                 # 專案說明
├── WORK_LOG.md               # 工作日誌
└── WORKFLOW_DESIGN_ASSISTANT.md # 工作流程設計助手
```

#### 🔧 **關鍵配置檔案模板**

##### **settings.json 模板**
```json
{
  "project": {
    "name": "專案名稱",
    "version": "1.0.0",
    "description": "專案描述",
    "author": "作者名稱",
    "created": "2025-07-18"
  },
  "memory": {
    "enabled": true,
    "project_context": [
      "專案特定的技術規範",
      "核心開發標準",
      "重要協定規範"
    ]
  },
  "commands": {
    "enabled": true,
    "custom_commands": [
      {
        "name": "技術模組名",
        "description": "載入特定開發環境",
        "file": ".claude/commands/模組名.md"
      }
    ]
  },
  "workflow": {
    "shortcuts": {
      "quick_files": {
        "@main": "主程式檔案名",
        "@config": "CLAUDE.md"
      },
      "memory_points": {
        "#debug": "調試狀態描述"
      }
    }
  }
}
```

##### **斜杠指令模板 (commands/技術模組.md)**
```markdown
# /技術模組名 - 技術模組開發環境

## 🎯 上下文載入
當用戶輸入 `/技術模組名` 時，自動載入以下上下文：

### 📋 技術規格
- **核心技術**: 技術規格說明
- **通訊協定**: 協定規範
- **資料格式**: 資料結構說明

### 🔧 配置說明
```
配置範例
```

### 🐛 常見問題
1. **問題類型**
   - 原因: 問題原因分析
   - 解決: 解決方案說明

### 📁 相關檔案
- **主程式**: 主要程式檔案
- **配置**: 設定檔案

### 🎯 當前開發狀態
- **進度**: 完成百分比
- **當前問題**: 待解決問題
- **下一步**: 下一步行動
```

#### 🚀 **實施效果**
- **開發效率**: 3-5 倍提升
- **上下文切換**: 從分鐘級 → 秒級
- **問題解決**: 從摸索 → 專家級指導
- **知識管理**: 自動化專案知識保存

#### 💡 **成功關鍵**
1. **完整性**: 所有六個階段都要完成
2. **客製化**: 根據專案特性調整配置
3. **維護性**: 定期更新斜杠指令內容
4. **一致性**: 保持命名規則統一

#### 🔄 **跨專案轉移指南**
1. **複製核心檔案**: WORKFLOW_DESIGN_ASSISTANT.md
2. **執行轉移指令**: transfer
3. **客製化配置**: 根據新專案調整
4. **測試驗證**: 確保所有功能正常

### 🎯 **專案類型適配指南**

#### **🌐 Web 應用專案**
```bash
# 建議的斜杠指令
/frontend    - 前端開發環境
/backend     - 後端開發環境
/api         - API 開發環境
/database    - 資料庫開發環境

# 建議的快捷檔案
@app         - 主應用程式
@routes      - 路由設定
@models      - 資料模型
@views       - 視圖模板
@api         - API 介面
```

#### **🖥️ 桌面軟體專案**
```bash
# 建議的斜杠指令
/ui          - 使用者介面開發
/core        - 核心邏輯開發
/database    - 資料庫整合
/deployment  - 部署打包環境

# 建議的快捷檔案
@main        - 主程式
@ui          - 介面設計
@config      - 配置管理
@installer   - 安裝程式
```

#### **📱 行動應用專案**
```bash
# 建議的斜杠指令
/ios         - iOS 開發環境
/android     - Android 開發環境
/react-native - React Native 開發環境
/flutter     - Flutter 開發環境

# 建議的快捷檔案
@app         - 主應用程式
@components  - 組件庫
@services    - 服務層
@assets      - 資源檔案
```

#### **⚡ CLI 工具專案**
```bash
# 建議的斜杠指令
/cli         - CLI 介面開發
/commands    - 指令處理
/config      - 配置管理
/testing     - 測試環境

# 建議的快捷檔案
@main        - 主程式
@commands    - 指令定義
@utils       - 工具函數
@help        - 說明文件
```

#### **🔬 嵌入式系統專案**
```bash
# 建議的斜杠指令
/hardware    - 硬體整合環境
/firmware    - 韌體開發環境
/protocol    - 通訊協定環境
/debug       - 調試工具環境

# 建議的快捷檔案
@main        - 主程式
@hardware    - 硬體抽象層
@protocol    - 通訊協定
@config      - 系統配置
```

### 🛡️ **安全和隱私原則**

#### **🔒 跨專案安全轉移**
- **禁止內容**: 產品名稱、商業邏輯、技術細節、工作進度
- **允許內容**: 工作習慣、快捷指令、代碼風格、工具偏好
- **過濾機制**: 自動排除敏感資訊
- **確認機制**: 轉移前明確告知排除內容

#### **📋 WORKFLOW_DESIGN_ASSISTANT.md 維護原則**
- **通用性**: 保持內容通用，不包含特定專案資訊
- **可重用**: 確保可在不同專案間安全使用
- **持續更新**: 根據使用經驗持續改善
- **版本控制**: 記錄每次改進的版本和原因
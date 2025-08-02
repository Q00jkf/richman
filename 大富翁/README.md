# RichMan - FFT 卡牌機率系統 API 服務器

🎯 **創新大富翁遊戲 | 部署於 Render | FFT 驅動的機率系統**  
遊戲不屬於RENDER，遊戲網址:https://richman-online-game.onrender.com
📺 Reference: https://youtu.be/8Q1bRZaHH24

## 🎮 專案概述

RichMan 是一款創新的線上多人大富翁 API 服務器，核心特色是使用**傅立葉轉換 (FFT)** 驅動的卡牌機率系統。與傳統大富翁不同，本遊戲採用 **70 張固定牌組** 中隨機抽取 11 張卡牌對應骰子點數 2-12，並通過職業背景影響卡牌出現機率。

## ✨ 核心創新

### 🔬 FFT 卡牌機率系統
- **數學基礎**: 利用雙骰子近高斯分佈特性 (2-12 點)
- **職業差異化**: 不同職業背景通過頻域濾波產生不同機率曲線
- **機率優雅性**: 用信號處理理論解決遊戲平衡問題

### 🎲 遊戲機制特色
- **70 張固定牌組**: 包含地產、道具、機會、命運等各類卡牌
- **11 位置映射**: 每局隨機抽 11 張對應骰子和值 2-12
- **職業背景系統**: 保守型、平衡型、激進型等不同機率偏好
- **隱藏編號系統**: 每張卡有唯一編號 (如台北大安 a-1、道具牌 c-1)

## 🏗️ 系統架構

```
專案結構 (API 服務器)
├── src/main/server/    # Node.js Express API 服務器
│   ├── routes/         # API 路由定義
│   ├── controllers/    # 業務邏輯控制器
│   ├── models/         # 資料模型定義
│   ├── services/       # FFT 卡牌系統核心服務
│   └── middleware/     # 認證與驗證中間件
└── src/main/shared/    # 共享工具與常數
    ├── types/          # TypeScript 類型定義
    ├── constants/      # 遊戲常數與卡牌定義
    └── utils/          # FFT 數學運算工具
```

## 🔬 FFT 系統核心代碼

### Python 原型實現 (參考)
```python
import numpy as np
from scipy.fft import fft, ifft
from scipy.stats import norm

class SimpleFFTCardSystem:
    def __init__(self):
        self.dice_points = np.arange(2, 13)

    def generate_gaussian(self, center, sigma):
        values = norm.pdf(self.dice_points, loc=center, scale=sigma)
        return values / values.sum()

    def apply_lowpass_filter(self, fft_data, cutoff):
        filtered = np.zeros_like(fft_data)
        filtered[:cutoff] = fft_data[:cutoff]
        filtered[-cutoff:] = fft_data[-cutoff:]
        return filtered

    def generate_card_probability(self, card_center, card_sigma, background_type):
        # 1. 生成基礎高斯分布
        base = self.generate_gaussian(card_center, card_sigma)
        
        # 2. FFT 轉頻域
        fft_base = fft(base)

        # 3. 職業背景濾波
        cutoff_map = {
            "conservative": 2,  # 保守型：低頻
            "balanced": 3,      # 平衡型：中頻
            "aggressive": 5     # 激進型：高頻
        }
        
        cutoff = cutoff_map.get(background_type, 3)
        filtered_fft = self.apply_lowpass_filter(fft_base, cutoff)
        
        # 4. IFFT 回空間域
        final = np.real(ifft(filtered_fft))
        final = np.clip(final, 0, None)
        return final / final.sum()  # 歸一化
```

## 🚀 API 端點

### 🎮 遊戲管理
```http
POST   /api/game/start           # 創建新遊戲，抽取11張卡牌
GET    /api/game/:id/state       # 獲取遊戲狀態
POST   /api/game/:id/roll        # 擲骰子，觸發對應卡牌
```

### 🔍 卡牌系統
```http
GET    /api/cards/:id/probability          # 查看卡牌機率分布
GET    /api/cards/distribution/:background # 職業背景的機率分析
POST   /api/cards/simulate                 # 機率分布模擬測試
```

### 📊 數據分析
```http
GET    /api/analytics/balance    # 遊戲平衡性統計
GET    /api/analytics/fft        # FFT 頻譜分析數據
```

## 🛠️ 技術棧

### 後端服務
- **Runtime**: Node.js 16+
- **框架**: Express.js
- **FFT 運算**: fft.js 或 ml-fft
- **資料庫**: MongoDB/PostgreSQL
- **部署**: Render 雲端服務

### 數學工具
- **信號處理**: FFT/IFFT 實現
- **機率分布**: 高斯函數生成
- **濾波器**: 低通、高通、帶通濾波
- **統計分析**: 分布驗證與平衡性檢查

## 🎯 開發階段

### Phase 1: MVP (最小可行產品) ✅
- [x] 基礎 FFT 引擎實現
- [x] 10 張測試卡牌系統
- [x] 3 種職業背景濾波
- [x] 核心 API 端點

### Phase 2: 核心優化 🔄
- [ ] 70 張完整牌組
- [ ] 位置衝突管理算法
- [ ] 遊戲平衡性監控
- [ ] 效能最佳化

### Phase 3: 進階功能 ⏳
- [ ] 動態機率調整
- [ ] 玩家行為分析
- [ ] 職業覺醒系統
- [ ] 多骰子支援擴展

## 🚀 快速開始

### 1. Render 部署
這是一個純 API 服務器，直接部署到 Render 即可使用：

```bash
# 提交代碼到 Git
git add .
git commit -m "Add FFT Card Probability System"
git push origin main

# Render 會自動：
# 1. 檢測到 package.json 並執行 npm install
# 2. 啟動 src/main/server/index.js
# 3. 在指定端口提供 API 服務
```

### 2. API 使用方式
部署完成後，使用 Render 提供的 URL 訪問 API：

```bash
# RichMan FFT API 服務器地址
export API_URL="https://richman-online-game.onrender.com"

# 創建新遊戲
curl -X POST $API_URL/api/game/start \
  -H "Content-Type: application/json" \
  -d '{"playerBackground": "balanced"}'

# 查看卡牌機率分析
curl "$API_URL/api/cards/a-1/probability?background=conservative"

# 檢查系統狀態
curl $API_URL/health
```

### 3. 開發與測試
不需要本地安裝依賴，直接通過 Render 部署測試：

- **健康檢查**: `GET /health` 
- **服務信息**: `GET /` 
- **系統統計**: `GET /api/analytics/system`

## 📊 數學原理說明

### 雙骰子機率分布
```
骰子和值:  2   3   4   5   6   7   8   9  10  11  12
出現機率: 1/36 2/36 3/36 4/36 5/36 6/36 5/36 4/36 3/36 2/36 1/36
形狀:     近似高斯分布，峰值在 7
```

### FFT 濾波原理
```
1. 基礎分布 → FFT → 頻域表示
2. 職業濾波器 × 頻域數據 → 調整後頻域
3. IFFT → 最終機率分布 → 歸一化
```

### 職業背景效果
- **保守型** (Low-pass): 偏向中間點數，避免極值
- **平衡型** (Mid-pass): 維持原始高斯特性
- **激進型** (High-pass): 增加邊緣點數機率

## 🔧 開發指南

### 新增卡牌
1. 在 `src/main/shared/constants/cards.js` 定義卡牌屬性
2. 設定基礎高斯參數 (center, sigma)
3. 在測試中驗證機率分布合理性

### 新增職業背景
1. 在濾波器定義中加入新的 cutoff 參數
2. 測試與現有職業的差異化程度
3. 確保遊戲平衡性

### API 擴展
1. 在 `src/main/server/routes/` 加入新路由
2. 實現對應的 controller 邏輯
3. 添加適當的錯誤處理和驗證

## 📋 測試策略

### API 功能測試
```bash
# 直接測試部署在 Render 的 API
curl https://richman-online-game.onrender.com/health                                    # 健康檢查
curl https://richman-online-game.onrender.com/api/cards/list                           # 獲取卡牌列表
curl -X POST https://richman-online-game.onrender.com/api/game/start -H "Content-Type: application/json" -d '{"playerBackground": "balanced"}'
```

### FFT 數學驗證
```bash
# 在 Render 環境中運行內建測試
curl https://richman-online-game.onrender.com/api/cards/a-1/probability               # 驗證 FFT 計算
curl https://richman-online-game.onrender.com/api/analytics/system                    # 檢查系統統計
```

## 📄 授權

MIT License - 詳見 LICENSE 文件

## 🙏 致謝

- **數學理論**: 傅立葉轉換在遊戲機率中的創新應用
- **遊戲設計**: 結合信號處理與遊戲平衡的跨領域方法
- **技術實現**: Claude Code 協助開發與系統設計

---

**⚡ 特色**: 世界首個將 FFT 應用於卡牌機率系統的大富翁遊戲  
**🎯 目標**: 為每位玩家提供獨特且平衡的遊戲體驗  
**🔬 創新**: 數學優雅性與遊戲趣味性的完美結合
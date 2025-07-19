#!/bin/bash

echo "🧪 RichMan API 簡單測試腳本"
echo "=============================="
echo

# 設置 API 基礎 URL
API_BASE="http://localhost:5000"

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. 測試健康檢查...${NC}"
HEALTH_RESULT=$(curl -s "${API_BASE}/health")
if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ 健康檢查成功${NC}"
    echo "回應: $HEALTH_RESULT"
else
    echo -e "${RED}❌ 健康檢查失敗${NC}"
    exit 1
fi

echo
echo -e "${BLUE}2. 創建玩家...${NC}"
PLAYER_RESULT=$(curl -s -X POST "${API_BASE}/api/players" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試玩家",
    "avatar": "test.png"
  }')

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ 玩家創建請求發送成功${NC}"
    echo "回應: $PLAYER_RESULT"
    
    # 嘗試提取 playerId
    PLAYER_ID=$(echo "$PLAYER_RESULT" | grep -o '"playerId":"[^"]*"' | cut -d'"' -f4)
    if [[ -n "$PLAYER_ID" ]]; then
        echo -e "${GREEN}📝 玩家ID: $PLAYER_ID${NC}"
    else
        echo -e "${RED}⚠️ 無法提取玩家ID${NC}"
    fi
else
    echo -e "${RED}❌ 玩家創建失敗${NC}"
    exit 1
fi

echo
echo -e "${BLUE}3. 創建房間 (不需要玩家ID)...${NC}"
ROOM_RESULT1=$(curl -s -X POST "${API_BASE}/api/rooms" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試房間1",
    "maxPlayers": 4
  }')

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ 房間創建請求發送成功${NC}"
    echo "回應: $ROOM_RESULT1"
else
    echo -e "${RED}❌ 房間創建失敗${NC}"
fi

echo
echo -e "${BLUE}4. 創建房間 (使用玩家ID)...${NC}"
if [[ -n "$PLAYER_ID" ]]; then
    ROOM_RESULT2=$(curl -s -X POST "${API_BASE}/api/rooms" \
      -H "Content-Type: application/json" \
      -d "{
        \"playerId\": \"$PLAYER_ID\",
        \"name\": \"測試房間2\",
        \"maxPlayers\": 4,
        \"isPrivate\": false
      }")
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ 帶玩家ID的房間創建請求發送成功${NC}"
        echo "回應: $ROOM_RESULT2"
    else
        echo -e "${RED}❌ 帶玩家ID的房間創建失敗${NC}"
    fi
else
    echo -e "${RED}⚠️ 跳過：沒有有效的玩家ID${NC}"
fi

echo
echo -e "${BLUE}5. 獲取房間列表...${NC}"
ROOMS_LIST=$(curl -s "${API_BASE}/api/rooms")
if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ 房間列表獲取成功${NC}"
    echo "回應: $ROOMS_LIST"
else
    echo -e "${RED}❌ 房間列表獲取失敗${NC}"
fi

echo
echo -e "${BLUE}6. 獲取玩家列表...${NC}"
PLAYERS_LIST=$(curl -s "${API_BASE}/api/players")
if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ 玩家列表獲取成功${NC}"
    echo "回應: $PLAYERS_LIST"
else
    echo -e "${RED}❌ 玩家列表獲取失敗${NC}"
fi

echo
echo "🎉 測試完成！"
echo
echo "💡 下一步建議："
echo "  - 如果看到錯誤，檢查伺服器日誌"
echo "  - 測試 WebSocket 連接: npm run test:websocket"
echo "  - 完整測試: npm run test:functional"
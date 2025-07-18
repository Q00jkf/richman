/**
 * 遊戲棋盤常數定義
 * RichMan - 線上多人大富翁遊戲
 */

// 標準大富翁棋盤格子數量
const BOARD_SIZE = 40;

// 標準棋盤格子定義
const STANDARD_BOARD_SPACES = [
  // 0: 起點
  {
    id: 0,
    name: '起點',
    type: 'start',
    description: '經過此格可獲得薪水',
    color: '#4CAF50',
    special: true
  },
  
  // 1-2: 咖啡色地產組
  {
    id: 1,
    name: '台北市大安區',
    type: 'property',
    group: 'brown',
    price: 60,
    rent: [2, 10, 30, 90, 160, 250],
    houseCost: 50,
    hotelCost: 50,
    mortgageValue: 30,
    color: '#8B4513'
  },
  {
    id: 2,
    name: '社區基金',
    type: 'community_chest',
    description: '抽取社區基金卡片',
    color: '#FFC107'
  },
  {
    id: 3,
    name: '台北市信義區',
    type: 'property',
    group: 'brown',
    price: 60,
    rent: [4, 20, 60, 180, 320, 450],
    houseCost: 50,
    hotelCost: 50,
    mortgageValue: 30,
    color: '#8B4513'
  },
  
  // 4: 所得稅
  {
    id: 4,
    name: '所得稅',
    type: 'tax',
    amount: 200,
    description: '繳納所得稅',
    color: '#FF5722'
  },
  
  // 5: 火車站
  {
    id: 5,
    name: '台北車站',
    type: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200],
    mortgageValue: 100,
    color: '#607D8B'
  },
  
  // 6-8: 淺藍色地產組
  {
    id: 6,
    name: '新北市板橋區',
    type: 'property',
    group: 'light_blue',
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    hotelCost: 50,
    mortgageValue: 50,
    color: '#87CEEB'
  },
  {
    id: 7,
    name: '機會',
    type: 'chance',
    description: '抽取機會卡片',
    color: '#FF9800'
  },
  {
    id: 8,
    name: '新北市新莊區',
    type: 'property',
    group: 'light_blue',
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    hotelCost: 50,
    mortgageValue: 50,
    color: '#87CEEB'
  },
  {
    id: 9,
    name: '新北市中和區',
    type: 'property',
    group: 'light_blue',
    price: 120,
    rent: [8, 40, 100, 300, 450, 600],
    houseCost: 50,
    hotelCost: 50,
    mortgageValue: 60,
    color: '#87CEEB'
  },
  
  // 10: 監獄/拜訪監獄
  {
    id: 10,
    name: '監獄',
    type: 'jail',
    description: '暫時停留或被關押',
    color: '#9E9E9E',
    special: true
  },
  
  // 11-13: 粉紅色地產組
  {
    id: 11,
    name: '桃園市中壢區',
    type: 'property',
    group: 'pink',
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    hotelCost: 100,
    mortgageValue: 70,
    color: '#FFC0CB'
  },
  {
    id: 12,
    name: '電力公司',
    type: 'utility',
    price: 150,
    multiplier: [4, 10],
    mortgageValue: 75,
    color: '#FFEB3B'
  },
  {
    id: 13,
    name: '桃園市桃園區',
    type: 'property',
    group: 'pink',
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    hotelCost: 100,
    mortgageValue: 70,
    color: '#FFC0CB'
  },
  {
    id: 14,
    name: '桃園市龜山區',
    type: 'property',
    group: 'pink',
    price: 160,
    rent: [12, 60, 180, 500, 700, 900],
    houseCost: 100,
    hotelCost: 100,
    mortgageValue: 80,
    color: '#FFC0CB'
  },
  
  // 15: 火車站
  {
    id: 15,
    name: '高雄車站',
    type: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200],
    mortgageValue: 100,
    color: '#607D8B'
  },
  
  // 16-18: 橘色地產組
  {
    id: 16,
    name: '台中市西屯區',
    type: 'property',
    group: 'orange',
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    hotelCost: 100,
    mortgageValue: 90,
    color: '#FFA500'
  },
  {
    id: 17,
    name: '社區基金',
    type: 'community_chest',
    description: '抽取社區基金卡片',
    color: '#FFC107'
  },
  {
    id: 18,
    name: '台中市南屯區',
    type: 'property',
    group: 'orange',
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    hotelCost: 100,
    mortgageValue: 90,
    color: '#FFA500'
  },
  {
    id: 19,
    name: '台中市北屯區',
    type: 'property',
    group: 'orange',
    price: 200,
    rent: [16, 80, 220, 600, 800, 1000],
    houseCost: 100,
    hotelCost: 100,
    mortgageValue: 100,
    color: '#FFA500'
  },
  
  // 20: 免費停車
  {
    id: 20,
    name: '免費停車',
    type: 'free_parking',
    description: '免費停車格，無特殊效果',
    color: '#4CAF50',
    special: true
  },
  
  // 21-23: 紅色地產組
  {
    id: 21,
    name: '高雄市前鎮區',
    type: 'property',
    group: 'red',
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    hotelCost: 150,
    mortgageValue: 110,
    color: '#F44336'
  },
  {
    id: 22,
    name: '機會',
    type: 'chance',
    description: '抽取機會卡片',
    color: '#FF9800'
  },
  {
    id: 23,
    name: '高雄市苓雅區',
    type: 'property',
    group: 'red',
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    hotelCost: 150,
    mortgageValue: 110,
    color: '#F44336'
  },
  {
    id: 24,
    name: '高雄市三民區',
    type: 'property',
    group: 'red',
    price: 240,
    rent: [20, 100, 300, 750, 925, 1100],
    houseCost: 150,
    hotelCost: 150,
    mortgageValue: 120,
    color: '#F44336'
  },
  
  // 25: 火車站
  {
    id: 25,
    name: '台中車站',
    type: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200],
    mortgageValue: 100,
    color: '#607D8B'
  },
  
  // 26-28: 黃色地產組
  {
    id: 26,
    name: '台南市安平區',
    type: 'property',
    group: 'yellow',
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    hotelCost: 150,
    mortgageValue: 130,
    color: '#FFEB3B'
  },
  {
    id: 27,
    name: '台南市中西區',
    type: 'property',
    group: 'yellow',
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    hotelCost: 150,
    mortgageValue: 130,
    color: '#FFEB3B'
  },
  {
    id: 28,
    name: '自來水公司',
    type: 'utility',
    price: 150,
    multiplier: [4, 10],
    mortgageValue: 75,
    color: '#2196F3'
  },
  {
    id: 29,
    name: '台南市東區',
    type: 'property',
    group: 'yellow',
    price: 280,
    rent: [24, 120, 360, 850, 1025, 1200],
    houseCost: 150,
    hotelCost: 150,
    mortgageValue: 140,
    color: '#FFEB3B'
  },
  
  // 30: 進入監獄
  {
    id: 30,
    name: '進入監獄',
    type: 'go_to_jail',
    description: '直接進入監獄',
    color: '#FF5722',
    special: true
  },
  
  // 31-33: 綠色地產組
  {
    id: 31,
    name: '台北市松山區',
    type: 'property',
    group: 'green',
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    hotelCost: 200,
    mortgageValue: 150,
    color: '#4CAF50'
  },
  {
    id: 32,
    name: '台北市內湖區',
    type: 'property',
    group: 'green',
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    hotelCost: 200,
    mortgageValue: 150,
    color: '#4CAF50'
  },
  {
    id: 33,
    name: '社區基金',
    type: 'community_chest',
    description: '抽取社區基金卡片',
    color: '#FFC107'
  },
  {
    id: 34,
    name: '台北市南港區',
    type: 'property',
    group: 'green',
    price: 320,
    rent: [28, 150, 450, 1000, 1200, 1400],
    houseCost: 200,
    hotelCost: 200,
    mortgageValue: 160,
    color: '#4CAF50'
  },
  
  // 35: 火車站
  {
    id: 35,
    name: '台南車站',
    type: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200],
    mortgageValue: 100,
    color: '#607D8B'
  },
  
  // 36: 機會
  {
    id: 36,
    name: '機會',
    type: 'chance',
    description: '抽取機會卡片',
    color: '#FF9800'
  },
  
  // 37-39: 深藍色地產組
  {
    id: 37,
    name: '台北市中正區',
    type: 'property',
    group: 'dark_blue',
    price: 350,
    rent: [35, 175, 500, 1100, 1300, 1500],
    houseCost: 200,
    hotelCost: 200,
    mortgageValue: 175,
    color: '#1976D2'
  },
  {
    id: 38,
    name: '奢侈稅',
    type: 'tax',
    amount: 100,
    description: '繳納奢侈稅',
    color: '#FF5722'
  },
  {
    id: 39,
    name: '台北市大同區',
    type: 'property',
    group: 'dark_blue',
    price: 400,
    rent: [50, 200, 600, 1400, 1700, 2000],
    houseCost: 200,
    hotelCost: 200,
    mortgageValue: 200,
    color: '#1976D2'
  }
];

// 地產組定義
const STANDARD_PROPERTY_GROUPS = {
  brown: {
    name: '咖啡色組',
    color: '#8B4513',
    properties: [1, 3],
    houseCost: 50,
    hotelCost: 50,
    monopolyRentMultiplier: 2
  },
  light_blue: {
    name: '淺藍色組',
    color: '#87CEEB',
    properties: [6, 8, 9],
    houseCost: 50,
    hotelCost: 50,
    monopolyRentMultiplier: 2
  },
  pink: {
    name: '粉紅色組',
    color: '#FFC0CB',
    properties: [11, 13, 14],
    houseCost: 100,
    hotelCost: 100,
    monopolyRentMultiplier: 2
  },
  orange: {
    name: '橘色組',
    color: '#FFA500',
    properties: [16, 18, 19],
    houseCost: 100,
    hotelCost: 100,
    monopolyRentMultiplier: 2
  },
  red: {
    name: '紅色組',
    color: '#F44336',
    properties: [21, 23, 24],
    houseCost: 150,
    hotelCost: 150,
    monopolyRentMultiplier: 2
  },
  yellow: {
    name: '黃色組',
    color: '#FFEB3B',
    properties: [26, 27, 29],
    houseCost: 150,
    hotelCost: 150,
    monopolyRentMultiplier: 2
  },
  green: {
    name: '綠色組',
    color: '#4CAF50',
    properties: [31, 32, 34],
    houseCost: 200,
    hotelCost: 200,
    monopolyRentMultiplier: 2
  },
  dark_blue: {
    name: '深藍色組',
    color: '#1976D2',
    properties: [37, 39],
    houseCost: 200,
    hotelCost: 200,
    monopolyRentMultiplier: 2
  },
  railroad: {
    name: '鐵路組',
    color: '#607D8B',
    properties: [5, 15, 25, 35],
    monopolyRentMultiplier: 1
  },
  utility: {
    name: '公用事業組',
    color: '#795548',
    properties: [12, 28],
    monopolyRentMultiplier: 1
  }
};

// 特殊格子類型
const SPACE_TYPES = {
  START: 'start',
  PROPERTY: 'property',
  RAILROAD: 'railroad',
  UTILITY: 'utility',
  CHANCE: 'chance',
  COMMUNITY_CHEST: 'community_chest',
  TAX: 'tax',
  JAIL: 'jail',
  GO_TO_JAIL: 'go_to_jail',
  FREE_PARKING: 'free_parking'
};

// 地產組顏色
const PROPERTY_GROUP_COLORS = {
  BROWN: 'brown',
  LIGHT_BLUE: 'light_blue',
  PINK: 'pink',
  ORANGE: 'orange',
  RED: 'red',
  YELLOW: 'yellow',
  GREEN: 'green',
  DARK_BLUE: 'dark_blue',
  RAILROAD: 'railroad',
  UTILITY: 'utility'
};

// 租金計算相關常數
const RENT_CALCULATION = {
  BASE_MULTIPLIER: 1,
  MONOPOLY_MULTIPLIER: 2,
  ONE_HOUSE_MULTIPLIER: 5,
  TWO_HOUSE_MULTIPLIER: 3,
  THREE_HOUSE_MULTIPLIER: 3,
  FOUR_HOUSE_MULTIPLIER: 2,
  HOTEL_MULTIPLIER: 2,
  
  // 鐵路租金
  RAILROAD_BASE_RENT: 25,
  RAILROAD_RENT_MULTIPLIERS: [1, 2, 4, 8],
  
  // 公用事業租金倍數
  UTILITY_SINGLE_MULTIPLIER: 4,
  UTILITY_MONOPOLY_MULTIPLIER: 10
};

// 建築相關常數
const BUILDING_RULES = {
  MAX_HOUSES_PER_PROPERTY: 4,
  MAX_HOTELS_PER_PROPERTY: 1,
  HOUSES_IN_BANK: 32,
  HOTELS_IN_BANK: 12,
  EVEN_BUILDING_RULE: true // 必須平均建設
};

// 抵押相關常數
const MORTGAGE_RULES = {
  MORTGAGE_INTEREST_RATE: 0.1, // 10%
  UNMORTGAGE_FEE_RATE: 0.1 // 額外10%手續費
};

module.exports = {
  BOARD_SIZE,
  STANDARD_BOARD_SPACES,
  STANDARD_PROPERTY_GROUPS,
  SPACE_TYPES,
  PROPERTY_GROUP_COLORS,
  RENT_CALCULATION,
  BUILDING_RULES,
  MORTGAGE_RULES
};
/**
 * 卡片常數定義
 * RichMan - 線上多人大富翁遊戲
 */

// 機會卡片
const CHANCE_CARDS = [
  {
    id: 'chance_1',
    type: 'move',
    title: '前進到起點',
    description: '前進到起點，獲得薪水 $200',
    effect: { type: 'move_to', position: 0 },
    image: 'chance_go.png'
  },
  {
    id: 'chance_2',
    type: 'move',
    title: '前進到台北市信義區',
    description: '如果經過起點，獲得薪水 $200',
    effect: { type: 'move_to', position: 24 },
    image: 'chance_move.png'
  },
  {
    id: 'chance_3',
    type: 'move',
    title: '前進到台北市大安區',
    description: '如果經過起點，獲得薪水 $200',
    effect: { type: 'move_to', position: 11 },
    image: 'chance_move.png'
  },
  {
    id: 'chance_4',
    type: 'move',
    title: '前進到最近的鐵路',
    description: '支付雙倍租金給地主',
    effect: { type: 'move_to_nearest', target: 'railroad', payDouble: true },
    image: 'chance_railroad.png'
  },
  {
    id: 'chance_5',
    type: 'move',
    title: '前進到最近的公用事業',
    description: '擲骰子並支付骰子數字x10倍的費用',
    effect: { type: 'move_to_nearest', target: 'utility', payMultiplier: 10 },
    image: 'chance_utility.png'
  },
  {
    id: 'chance_6',
    type: 'money',
    title: '銀行錯誤',
    description: '銀行計算錯誤，對你有利，獲得 $200',
    effect: { type: 'gain_money', amount: 200 },
    image: 'chance_money.png'
  },
  {
    id: 'chance_7',
    type: 'money',
    title: '醫療費用',
    description: '支付醫療費用 $50',
    effect: { type: 'lose_money', amount: 50 },
    image: 'chance_medical.png'
  },
  {
    id: 'chance_8',
    type: 'money',
    title: '學校費用',
    description: '支付學校費用 $150',
    effect: { type: 'lose_money', amount: 150 },
    image: 'chance_school.png'
  },
  {
    id: 'chance_9',
    type: 'jail',
    title: '立即入獄',
    description: '立即前往監獄，不經過起點，不獲得薪水',
    effect: { type: 'go_to_jail' },
    image: 'chance_jail.png'
  },
  {
    id: 'chance_10',
    type: 'special',
    title: '出獄卡',
    description: '此卡可保留直到使用，可用來出獄',
    effect: { type: 'get_out_of_jail_card' },
    image: 'chance_jail_free.png'
  },
  {
    id: 'chance_11',
    type: 'move',
    title: '後退三格',
    description: '後退三格',
    effect: { type: 'move_relative', steps: -3 },
    image: 'chance_back.png'
  },
  {
    id: 'chance_12',
    type: 'payment',
    title: '房屋修繕費',
    description: '每棟房屋 $25，每間旅館 $100',
    effect: { type: 'pay_for_buildings', houseRate: 25, hotelRate: 100 },
    image: 'chance_repair.png'
  },
  {
    id: 'chance_13',
    type: 'money',
    title: '股票分紅',
    description: '股票分紅，獲得 $50',
    effect: { type: 'gain_money', amount: 50 },
    image: 'chance_dividend.png'
  },
  {
    id: 'chance_14',
    type: 'money',
    title: '貸款到期',
    description: '支付貸款本息 $50',
    effect: { type: 'lose_money', amount: 50 },
    image: 'chance_loan.png'
  },
  {
    id: 'chance_15',
    type: 'move',
    title: '前進到桃園市',
    description: '如果經過起點，獲得薪水 $200',
    effect: { type: 'move_to', position: 5 },
    image: 'chance_move.png'
  },
  {
    id: 'chance_16',
    type: 'collection',
    title: '慈善募款',
    description: '從每位玩家處獲得 $50',
    effect: { type: 'collect_from_players', amount: 50 },
    image: 'chance_charity.png'
  }
];

// 社區基金卡片
const COMMUNITY_CHEST_CARDS = [
  {
    id: 'community_1',
    type: 'move',
    title: '前進到起點',
    description: '前進到起點，獲得薪水 $200',
    effect: { type: 'move_to', position: 0 },
    image: 'community_go.png'
  },
  {
    id: 'community_2',
    type: 'money',
    title: '銀行錯誤',
    description: '銀行計算錯誤，對你有利，獲得 $200',
    effect: { type: 'gain_money', amount: 200 },
    image: 'community_bank.png'
  },
  {
    id: 'community_3',
    type: 'money',
    title: '醫療費用',
    description: '支付醫療費用 $100',
    effect: { type: 'lose_money', amount: 100 },
    image: 'community_medical.png'
  },
  {
    id: 'community_4',
    type: 'money',
    title: '所得稅退稅',
    description: '收到所得稅退稅 $20',
    effect: { type: 'gain_money', amount: 20 },
    image: 'community_tax.png'
  },
  {
    id: 'community_5',
    type: 'money',
    title: '人壽保險到期',
    description: '人壽保險到期，獲得 $100',
    effect: { type: 'gain_money', amount: 100 },
    image: 'community_insurance.png'
  },
  {
    id: 'community_6',
    type: 'money',
    title: '醫院費用',
    description: '支付醫院費用 $100',
    effect: { type: 'lose_money', amount: 100 },
    image: 'community_hospital.png'
  },
  {
    id: 'community_7',
    type: 'money',
    title: '學校費用',
    description: '支付學校費用 $50',
    effect: { type: 'lose_money', amount: 50 },
    image: 'community_school.png'
  },
  {
    id: 'community_8',
    type: 'money',
    title: '顧問服務費',
    description: '收到顧問服務費 $25',
    effect: { type: 'gain_money', amount: 25 },
    image: 'community_consulting.png'
  },
  {
    id: 'community_9',
    type: 'payment',
    title: '街道修繕',
    description: '每棟房屋 $40，每間旅館 $115',
    effect: { type: 'pay_for_buildings', houseRate: 40, hotelRate: 115 },
    image: 'community_repair.png'
  },
  {
    id: 'community_10',
    type: 'money',
    title: '美化大賽獎金',
    description: '獲得第二名獎金 $10',
    effect: { type: 'gain_money', amount: 10 },
    image: 'community_beauty.png'
  },
  {
    id: 'community_11',
    type: 'money',
    title: '繼承遺產',
    description: '繼承遺產 $100',
    effect: { type: 'gain_money', amount: 100 },
    image: 'community_inherit.png'
  },
  {
    id: 'community_12',
    type: 'money',
    title: '假期基金到期',
    description: '假期基金到期，獲得 $100',
    effect: { type: 'gain_money', amount: 100 },
    image: 'community_holiday.png'
  },
  {
    id: 'community_13',
    type: 'jail',
    title: '立即入獄',
    description: '立即前往監獄，不經過起點，不獲得薪水',
    effect: { type: 'go_to_jail' },
    image: 'community_jail.png'
  },
  {
    id: 'community_14',
    type: 'special',
    title: '出獄卡',
    description: '此卡可保留直到使用，可用來出獄',
    effect: { type: 'get_out_of_jail_card' },
    image: 'community_jail_free.png'
  },
  {
    id: 'community_15',
    type: 'payment',
    title: '生日快樂',
    description: '今天是你的生日，從每位玩家處獲得 $10',
    effect: { type: 'collect_from_players', amount: 10 },
    image: 'community_birthday.png'
  },
  {
    id: 'community_16',
    type: 'money',
    title: '銷售股票',
    description: '銷售股票，獲得 $50',
    effect: { type: 'gain_money', amount: 50 },
    image: 'community_stock.png'
  }
];

// 卡片類型定義
const CARD_TYPES = {
  MOVE: 'move',
  MONEY: 'money',
  JAIL: 'jail',
  SPECIAL: 'special',
  PAYMENT: 'payment',
  COLLECTION: 'collection'
};

// 卡片效果類型
const CARD_EFFECT_TYPES = {
  MOVE_TO: 'move_to',
  MOVE_RELATIVE: 'move_relative',
  MOVE_TO_NEAREST: 'move_to_nearest',
  GAIN_MONEY: 'gain_money',
  LOSE_MONEY: 'lose_money',
  GO_TO_JAIL: 'go_to_jail',
  GET_OUT_OF_JAIL_CARD: 'get_out_of_jail_card',
  PAY_FOR_BUILDINGS: 'pay_for_buildings',
  COLLECT_FROM_PLAYERS: 'collect_from_players'
};

// 卡片堆類型
const DECK_TYPES = {
  CHANCE: 'chance',
  COMMUNITY_CHEST: 'community_chest'
};

// 特殊卡片ID（用於快速查找）
const SPECIAL_CARD_IDS = {
  CHANCE_GET_OUT_OF_JAIL: 'chance_10',
  COMMUNITY_GET_OUT_OF_JAIL: 'community_14'
};

// 卡片圖片路径
const CARD_IMAGE_PATHS = {
  CHANCE: '/assets/images/cards/chance/',
  COMMUNITY_CHEST: '/assets/images/cards/community/',
  BACK: '/assets/images/cards/card_back.png'
};

// 卡片動畫設定
const CARD_ANIMATION = {
  DRAW_DURATION: 1000, // 抽卡動畫時間(毫秒)
  REVEAL_DURATION: 2000, // 顯示卡片時間(毫秒)
  EFFECT_DURATION: 1500, // 效果執行時間(毫秒)
  SHUFFLE_DURATION: 500 // 洗牌動畫時間(毫秒)
};

// 卡片執行順序
const CARD_EXECUTION_ORDER = {
  IMMEDIATE: 0, // 立即執行（移動類）
  BEFORE_LANDING: 1, // 移動前執行
  AFTER_LANDING: 2, // 移動後執行（金錢類）
  END_OF_TURN: 3 // 回合結束執行
};

// 獲得卡片的機率權重（用於特殊模式）
const CARD_PROBABILITY_WEIGHTS = {
  MONEY_GAIN: 0.3,
  MONEY_LOSS: 0.25,
  MOVEMENT: 0.25,
  SPECIAL: 0.15,
  JAIL: 0.05
};

// 卡片本地化文本
const CARD_LOCALIZATION = {
  DRAW_CARD: {
    'zh-TW': '抽取卡片',
    'en-US': 'Draw Card'
  },
  EXECUTE_EFFECT: {
    'zh-TW': '執行效果',
    'en-US': 'Execute Effect'
  },
  KEEP_CARD: {
    'zh-TW': '保留此卡',
    'en-US': 'Keep This Card'
  }
};

// 卡片驗證規則
const CARD_VALIDATION_RULES = {
  MAX_HELD_CARDS: 2, // 最多持有的特殊卡片數量
  REQUIRED_FIELDS: ['id', 'type', 'title', 'description', 'effect'],
  VALID_EFFECT_TYPES: Object.values(CARD_EFFECT_TYPES),
  VALID_CARD_TYPES: Object.values(CARD_TYPES)
};

module.exports = {
  CHANCE_CARDS,
  COMMUNITY_CHEST_CARDS,
  CARD_TYPES,
  CARD_EFFECT_TYPES,
  DECK_TYPES,
  SPECIAL_CARD_IDS,
  CARD_IMAGE_PATHS,
  CARD_ANIMATION,
  CARD_EXECUTION_ORDER,
  CARD_PROBABILITY_WEIGHTS,
  CARD_LOCALIZATION,
  CARD_VALIDATION_RULES
};
/**
 * 卡片系統類型定義
 * RichMan - 線上多人大富翁遊戲
 */

export interface Card {
  id: string;
  type: CardType;
  title: string;
  description: string;
  effect: CardEffect;
  icon?: string;
  rarity: CardRarity;
  isKeepable: boolean; // 是否可以保留使用
  category: string;
  flavorText?: string;
}

export enum CardType {
  CHANCE = 'chance',
  COMMUNITY_CHEST = 'community_chest',
  SPECIAL = 'special'
}

export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  LEGENDARY = 'legendary'
}

export interface CardEffect {
  type: CardEffectType;
  value: number;
  target?: CardTarget;
  condition?: CardCondition;
  duration?: number;
  additionalEffects?: CardEffect[];
}

export enum CardEffectType {
  // 金錢相關
  COLLECT_MONEY = 'collect_money',
  PAY_MONEY = 'pay_money',
  COLLECT_FROM_PLAYERS = 'collect_from_players',
  PAY_TO_PLAYERS = 'pay_to_players',
  COLLECT_FROM_BANK = 'collect_from_bank',
  PAY_TO_BANK = 'pay_to_bank',
  
  // 移動相關
  MOVE_TO_SPACE = 'move_to_space',
  MOVE_SPACES = 'move_spaces',
  MOVE_TO_NEAREST = 'move_to_nearest',
  MOVE_TO_GO = 'move_to_go',
  
  // 監獄相關
  GO_TO_JAIL = 'go_to_jail',
  GET_OUT_OF_JAIL_FREE = 'get_out_of_jail_free',
  
  // 地產相關
  COLLECT_PROPERTY_RENT = 'collect_property_rent',
  PAY_PROPERTY_MAINTENANCE = 'pay_property_maintenance',
  FREE_PROPERTY_UPGRADE = 'free_property_upgrade',
  PROPERTY_DISCOUNT = 'property_discount',
  
  // 特殊效果
  SKIP_NEXT_RENT = 'skip_next_rent',
  DOUBLE_NEXT_RENT = 'double_next_rent',
  EXTRA_TURN = 'extra_turn',
  TELEPORT = 'teleport',
  SWAP_POSITION = 'swap_position',
  IMMUNITY = 'immunity',
  
  // 建設相關
  FREE_HOUSE = 'free_house',
  FREE_HOTEL = 'free_hotel',
  BUILDING_DISCOUNT = 'building_discount',
  
  // 稅務相關
  TAX_EXEMPTION = 'tax_exemption',
  LUXURY_TAX = 'luxury_tax',
  
  // 特殊活動
  CHARITY = 'charity',
  LOTTERY = 'lottery',
  BANK_ERROR = 'bank_error',
  INHERITANCE = 'inheritance',
  
  // 多人效果
  TRADE_FORCED = 'trade_forced',
  AUCTION_PROPERTY = 'auction_property',
  STEAL_MONEY = 'steal_money'
}

export enum CardTarget {
  SELF = 'self',
  ALL_PLAYERS = 'all_players',
  OTHER_PLAYERS = 'other_players',
  RANDOM_PLAYER = 'random_player',
  RICHEST_PLAYER = 'richest_player',
  POOREST_PLAYER = 'poorest_player',
  NEAREST_PLAYER = 'nearest_player',
  PROPERTY_OWNER = 'property_owner'
}

export interface CardCondition {
  type: CardConditionType;
  value: any;
  operator: CardConditionOperator;
}

export enum CardConditionType {
  PLAYER_MONEY = 'player_money',
  PROPERTIES_OWNED = 'properties_owned',
  HOUSES_OWNED = 'houses_owned',
  HOTELS_OWNED = 'hotels_owned',
  CURRENT_POSITION = 'current_position',
  DICE_ROLL = 'dice_roll',
  TURN_NUMBER = 'turn_number',
  JAIL_STATUS = 'jail_status'
}

export enum CardConditionOperator {
  EQUAL = 'equal',
  NOT_EQUAL = 'not_equal',
  GREATER = 'greater',
  GREATER_EQUAL = 'greater_equal',
  LESS = 'less',
  LESS_EQUAL = 'less_equal',
  MULTIPLY = 'multiply',
  DIVIDE = 'divide'
}

export interface CardDeck {
  id: string;
  type: CardType;
  cards: Card[];
  shuffled: boolean;
  currentIndex: number;
  discardPile: Card[];
  lastShuffled: Date;
}

export interface CardPlayResult {
  cardId: string;
  playerId: string;
  effects: CardEffectResult[];
  success: boolean;
  message: string;
  timestamp: Date;
}

export interface CardEffectResult {
  type: CardEffectType;
  value: number;
  targetPlayerId?: string;
  success: boolean;
  message: string;
  previousValue?: number;
  newValue?: number;
}

// 機會卡牌庫
export const CHANCE_CARDS: Card[] = [
  {
    id: 'chance_advance_to_go',
    type: CardType.CHANCE,
    title: '前進至起點',
    description: '前進至起點並收取 $200',
    effect: {
      type: CardEffectType.MOVE_TO_GO,
      value: 0,
      target: CardTarget.SELF
    },
    icon: '🏠',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'movement',
    flavorText: '回到起點，重新開始你的財富之旅！'
  },
  {
    id: 'chance_bank_dividend',
    type: CardType.CHANCE,
    title: '銀行紅利',
    description: '銀行支付你紅利 $50',
    effect: {
      type: CardEffectType.COLLECT_FROM_BANK,
      value: 50,
      target: CardTarget.SELF
    },
    icon: '💰',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'money',
    flavorText: '你的投資終於有了回報！'
  },
  {
    id: 'chance_get_out_of_jail_free',
    type: CardType.CHANCE,
    title: '免費出獄卡',
    description: '此卡可在你入獄時使用',
    effect: {
      type: CardEffectType.GET_OUT_OF_JAIL_FREE,
      value: 1,
      target: CardTarget.SELF
    },
    icon: '🗝️',
    rarity: CardRarity.RARE,
    isKeepable: true,
    category: 'jail',
    flavorText: '自由是無價的！'
  },
  {
    id: 'chance_go_to_jail',
    type: CardType.CHANCE,
    title: '入獄',
    description: '直接前往監獄，不得經過起點',
    effect: {
      type: CardEffectType.GO_TO_JAIL,
      value: 10,
      target: CardTarget.SELF
    },
    icon: '👮',
    rarity: CardRarity.UNCOMMON,
    isKeepable: false,
    category: 'jail',
    flavorText: '法律面前人人平等！'
  },
  {
    id: 'chance_house_repairs',
    type: CardType.CHANCE,
    title: '房屋修繕',
    description: '為你的房屋進行修繕：每間房子 $25，每間旅館 $100',
    effect: {
      type: CardEffectType.PAY_PROPERTY_MAINTENANCE,
      value: 25,
      target: CardTarget.SELF,
      condition: {
        type: CardConditionType.HOUSES_OWNED,
        value: 100,
        operator: CardConditionOperator.MULTIPLY
      }
    },
    icon: '🔧',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'property',
    flavorText: '維護你的投資，讓它們持續為你賺錢！'
  },
  {
    id: 'chance_speeding_fine',
    type: CardType.CHANCE,
    title: '超速罰款',
    description: '超速駕駛，罰款 $15',
    effect: {
      type: CardEffectType.PAY_TO_BANK,
      value: 15,
      target: CardTarget.SELF
    },
    icon: '🚗',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'fine',
    flavorText: '安全駕駛，避免不必要的支出！'
  },
  {
    id: 'chance_birthday',
    type: CardType.CHANCE,
    title: '生日快樂',
    description: '今天是你的生日，每位玩家給你 $10',
    effect: {
      type: CardEffectType.COLLECT_FROM_PLAYERS,
      value: 10,
      target: CardTarget.OTHER_PLAYERS
    },
    icon: '🎂',
    rarity: CardRarity.UNCOMMON,
    isKeepable: false,
    category: 'social',
    flavorText: '朋友們為你慶祝！'
  },
  {
    id: 'chance_tax_refund',
    type: CardType.CHANCE,
    title: '稅務退款',
    description: '收到稅務退款 $20',
    effect: {
      type: CardEffectType.COLLECT_FROM_BANK,
      value: 20,
      target: CardTarget.SELF
    },
    icon: '📋',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'money',
    flavorText: '政府的善意！'
  },
  {
    id: 'chance_move_to_nearest_railroad',
    type: CardType.CHANCE,
    title: '搭乘火車',
    description: '前往最近的火車站，如果無人擁有可以購買',
    effect: {
      type: CardEffectType.MOVE_TO_NEAREST,
      value: 5, // 火車站位置ID
      target: CardTarget.SELF
    },
    icon: '🚂',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'movement',
    flavorText: '搭乘火車，快速到達目的地！'
  },
  {
    id: 'chance_luxury_tax',
    type: CardType.CHANCE,
    title: '奢侈稅',
    description: '被徵收奢侈稅 $75',
    effect: {
      type: CardEffectType.LUXURY_TAX,
      value: 75,
      target: CardTarget.SELF
    },
    icon: '💎',
    rarity: CardRarity.UNCOMMON,
    isKeepable: false,
    category: 'tax',
    flavorText: '富有的代價！'
  }
];

// 命運卡牌庫
export const COMMUNITY_CHEST_CARDS: Card[] = [
  {
    id: 'community_advance_to_go',
    type: CardType.COMMUNITY_CHEST,
    title: '前進至起點',
    description: '前進至起點並收取 $200',
    effect: {
      type: CardEffectType.MOVE_TO_GO,
      value: 0,
      target: CardTarget.SELF
    },
    icon: '🏠',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'movement',
    flavorText: '社區的溫暖，讓你回到起點！'
  },
  {
    id: 'community_bank_error',
    type: CardType.COMMUNITY_CHEST,
    title: '銀行錯誤',
    description: '銀行計算錯誤，對你有利，收取 $200',
    effect: {
      type: CardEffectType.BANK_ERROR,
      value: 200,
      target: CardTarget.SELF
    },
    icon: '🏦',
    rarity: CardRarity.RARE,
    isKeepable: false,
    category: 'money',
    flavorText: '幸運的計算錯誤！'
  },
  {
    id: 'community_doctor_fee',
    type: CardType.COMMUNITY_CHEST,
    title: '醫生費用',
    description: '支付醫生費用 $50',
    effect: {
      type: CardEffectType.PAY_TO_BANK,
      value: 50,
      target: CardTarget.SELF
    },
    icon: '🏥',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'expense',
    flavorText: '健康是最重要的投資！'
  },
  {
    id: 'community_get_out_of_jail_free',
    type: CardType.COMMUNITY_CHEST,
    title: '免費出獄卡',
    description: '此卡可在你入獄時使用',
    effect: {
      type: CardEffectType.GET_OUT_OF_JAIL_FREE,
      value: 1,
      target: CardTarget.SELF
    },
    icon: '🗝️',
    rarity: CardRarity.RARE,
    isKeepable: true,
    category: 'jail',
    flavorText: '社區的支持讓你重獲自由！'
  },
  {
    id: 'community_holiday_fund',
    type: CardType.COMMUNITY_CHEST,
    title: '假期基金',
    description: '假期基金到期，收取 $100',
    effect: {
      type: CardEffectType.COLLECT_FROM_BANK,
      value: 100,
      target: CardTarget.SELF
    },
    icon: '🏖️',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'money',
    flavorText: '努力工作，享受假期！'
  },
  {
    id: 'community_inheritance',
    type: CardType.COMMUNITY_CHEST,
    title: '遺產繼承',
    description: '你繼承了遺產，收取 $100',
    effect: {
      type: CardEffectType.INHERITANCE,
      value: 100,
      target: CardTarget.SELF
    },
    icon: '📜',
    rarity: CardRarity.UNCOMMON,
    isKeepable: false,
    category: 'money',
    flavorText: '意外的財富！'
  },
  {
    id: 'community_hospital_fee',
    type: CardType.COMMUNITY_CHEST,
    title: '醫院費用',
    description: '支付醫院費用 $100',
    effect: {
      type: CardEffectType.PAY_TO_BANK,
      value: 100,
      target: CardTarget.SELF
    },
    icon: '🏥',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'expense',
    flavorText: '照顧好自己的健康！'
  },
  {
    id: 'community_school_fee',
    type: CardType.COMMUNITY_CHEST,
    title: '學校費用',
    description: '支付學校費用 $50',
    effect: {
      type: CardEffectType.PAY_TO_BANK,
      value: 50,
      target: CardTarget.SELF
    },
    icon: '🎓',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'expense',
    flavorText: '教育是最好的投資！'
  },
  {
    id: 'community_tax_refund',
    type: CardType.COMMUNITY_CHEST,
    title: '稅務退款',
    description: '收到稅務退款 $20',
    effect: {
      type: CardEffectType.COLLECT_FROM_BANK,
      value: 20,
      target: CardTarget.SELF
    },
    icon: '📋',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'money',
    flavorText: '政府的回饋！'
  },
  {
    id: 'community_won_contest',
    type: CardType.COMMUNITY_CHEST,
    title: '贏得比賽',
    description: '你在美容比賽中獲得第二名，收取 $10',
    effect: {
      type: CardEffectType.COLLECT_FROM_BANK,
      value: 10,
      target: CardTarget.SELF
    },
    icon: '🏆',
    rarity: CardRarity.COMMON,
    isKeepable: false,
    category: 'money',
    flavorText: '你的魅力得到了認可！'
  }
];

// 特殊卡片（擴展功能）
export const SPECIAL_CARDS: Card[] = [
  {
    id: 'special_double_rent',
    type: CardType.SPECIAL,
    title: '雙倍租金',
    description: '下次收取租金時獲得雙倍金額',
    effect: {
      type: CardEffectType.DOUBLE_NEXT_RENT,
      value: 2,
      target: CardTarget.SELF,
      duration: 1
    },
    icon: '💸',
    rarity: CardRarity.RARE,
    isKeepable: true,
    category: 'enhancement',
    flavorText: '讓你的投資發揮最大效益！'
  },
  {
    id: 'special_teleport',
    type: CardType.SPECIAL,
    title: '傳送門',
    description: '可以傳送到棋盤上的任何位置',
    effect: {
      type: CardEffectType.TELEPORT,
      value: 0,
      target: CardTarget.SELF
    },
    icon: '🌀',
    rarity: CardRarity.LEGENDARY,
    isKeepable: true,
    category: 'movement',
    flavorText: '科技的力量超越了距離！'
  },
  {
    id: 'special_immunity',
    type: CardType.SPECIAL,
    title: '免疫卡',
    description: '免疫下一次負面效果',
    effect: {
      type: CardEffectType.IMMUNITY,
      value: 1,
      target: CardTarget.SELF,
      duration: 1
    },
    icon: '🛡️',
    rarity: CardRarity.RARE,
    isKeepable: true,
    category: 'protection',
    flavorText: '保護你免受傷害！'
  }
];
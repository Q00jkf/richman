/**
 * 遊戲板面類型定義
 * RichMan - 線上多人大富翁遊戲
 */

export interface Board {
  id: string;
  spaces: BoardSpace[];
  totalSpaces: number;
  propertyGroups: PropertyGroup[];
  chanceCards: ChanceCard[];
  communityChestCards: CommunityChestCard[];
  theme: BoardTheme;
  version: string;
  createdAt: Date;
}

export interface BoardSpace {
  id: string;
  position: number; // 0-39
  type: SpaceType;
  name: string;
  description: string;
  group?: string;
  price?: number;
  rent?: RentStructure;
  mortgageValue?: number;
  houseCost?: number;
  hotelCost?: number;
  color?: string;
  icon?: string;
  specialAction?: SpecialAction;
}

export enum SpaceType {
  GO = 'go',                    // 起點
  PROPERTY = 'property',        // 地產
  RAILROAD = 'railroad',        // 火車站
  UTILITY = 'utility',          // 公用事業
  CHANCE = 'chance',            // 機會
  COMMUNITY_CHEST = 'community_chest', // 命運
  TAX = 'tax',                  // 稅務
  JAIL = 'jail',                // 監獄
  GO_TO_JAIL = 'go_to_jail',    // 入獄
  FREE_PARKING = 'free_parking', // 免費停車
  LUXURY_TAX = 'luxury_tax',    // 奢侈稅
  SPECIAL = 'special'           // 特殊格子
}

export interface RentStructure {
  baseRent: number;
  withOneHouse: number;
  withTwoHouses: number;
  withThreeHouses: number;
  withFourHouses: number;
  withHotel: number;
  withMonopoly: number; // 擁有同色地段時的租金
}

export interface SpecialAction {
  type: SpecialActionType;
  value: number;
  description: string;
  condition?: ActionCondition;
}

export enum SpecialActionType {
  COLLECT_MONEY = 'collect_money',    // 收取金錢
  PAY_MONEY = 'pay_money',            // 支付金錢
  MOVE_TO_SPACE = 'move_to_space',    // 移動到指定格子
  MOVE_SPACES = 'move_spaces',        // 移動指定格數
  GO_TO_JAIL = 'go_to_jail',          // 入獄
  DRAW_CARD = 'draw_card',            // 抽卡
  FREE_PARKING_BONUS = 'free_parking_bonus', // 免費停車獎金
  PASS_GO_BONUS = 'pass_go_bonus',    // 繞過起點獎金
  HOUSE_HOTEL_TAX = 'house_hotel_tax', // 房屋旅館稅
  UTILITY_RENT = 'utility_rent',      // 公用事業租金
  RAILROAD_RENT = 'railroad_rent'     // 火車站租金
}

export interface ActionCondition {
  type: ConditionType;
  value: any;
  operator: ConditionOperator;
}

export enum ConditionType {
  DICE_ROLL = 'dice_roll',
  PLAYER_MONEY = 'player_money',
  PROPERTIES_OWNED = 'properties_owned',
  HOUSES_OWNED = 'houses_owned',
  HOTELS_OWNED = 'hotels_owned'
}

export enum ConditionOperator {
  EQUAL = 'equal',
  GREATER = 'greater',
  LESS = 'less',
  MULTIPLY = 'multiply'
}

export interface PropertyGroup {
  id: string;
  name: string;
  color: string;
  propertyIds: string[];
  monopolyBonus: number;
  buildingRestrictions: BuildingRestriction[];
}

export interface BuildingRestriction {
  type: BuildingRestrictionType;
  value: number;
  description: string;
}

export enum BuildingRestrictionType {
  EVEN_BUILDING = 'even_building',      // 平均建設
  MAX_HOUSES = 'max_houses',            // 最大房屋數
  MAX_HOTELS = 'max_hotels',            // 最大旅館數
  MONOPOLY_REQUIRED = 'monopoly_required' // 需要壟斷
}

export interface BoardTheme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  images: ThemeImages;
  sounds: ThemeSounds;
}

export interface ThemeColors {
  background: string;
  boardBorder: string;
  spaceDefault: string;
  spaceProperty: string;
  spaceRailroad: string;
  spaceUtility: string;
  spaceSpecial: string;
  text: string;
  player: string[];
}

export interface ThemeImages {
  background: string;
  boardLayout: string;
  propertyIcons: Record<string, string>;
  playerTokens: string[];
  diceImages: string[];
  cardBackgrounds: Record<string, string>;
}

export interface ThemeSounds {
  diceRoll: string;
  buyProperty: string;
  payRent: string;
  goToJail: string;
  cardDraw: string;
  buildHouse: string;
  buildHotel: string;
  bankrupt: string;
  gameWin: string;
  turnStart: string;
}

// 標準大富翁地圖配置
export const STANDARD_BOARD_SPACES: BoardSpace[] = [
  {
    id: 'go',
    position: 0,
    type: SpaceType.GO,
    name: '起點',
    description: '每次經過獲得 $200',
    icon: '🏠',
    specialAction: {
      type: SpecialActionType.COLLECT_MONEY,
      value: 200,
      description: '繞過起點收取薪水'
    }
  },
  {
    id: 'mediterranean_avenue',
    position: 1,
    type: SpaceType.PROPERTY,
    name: '地中海大道',
    description: '棕色地段',
    group: 'brown',
    price: 60,
    rent: {
      baseRent: 2,
      withOneHouse: 10,
      withTwoHouses: 30,
      withThreeHouses: 90,
      withFourHouses: 160,
      withHotel: 250,
      withMonopoly: 4
    },
    mortgageValue: 30,
    houseCost: 50,
    hotelCost: 50,
    color: '#8B4513'
  },
  {
    id: 'community_chest_1',
    position: 2,
    type: SpaceType.COMMUNITY_CHEST,
    name: '命運',
    description: '抽取命運卡',
    icon: '📋',
    specialAction: {
      type: SpecialActionType.DRAW_CARD,
      value: 1,
      description: '抽取一張命運卡'
    }
  },
  {
    id: 'baltic_avenue',
    position: 3,
    type: SpaceType.PROPERTY,
    name: '波羅的海大道',
    description: '棕色地段',
    group: 'brown',
    price: 60,
    rent: {
      baseRent: 4,
      withOneHouse: 20,
      withTwoHouses: 60,
      withThreeHouses: 180,
      withFourHouses: 320,
      withHotel: 450,
      withMonopoly: 8
    },
    mortgageValue: 30,
    houseCost: 50,
    hotelCost: 50,
    color: '#8B4513'
  },
  {
    id: 'income_tax',
    position: 4,
    type: SpaceType.TAX,
    name: '所得稅',
    description: '支付 $200 或資產的 10%',
    icon: '💸',
    specialAction: {
      type: SpecialActionType.PAY_MONEY,
      value: 200,
      description: '支付所得稅'
    }
  },
  {
    id: 'reading_railroad',
    position: 5,
    type: SpaceType.RAILROAD,
    name: '閱讀火車站',
    description: '火車站',
    group: 'railroad',
    price: 200,
    mortgageValue: 100,
    icon: '🚂',
    specialAction: {
      type: SpecialActionType.RAILROAD_RENT,
      value: 25,
      description: '支付火車站租金'
    }
  },
  // ... 繼續添加其他34個格子
  {
    id: 'jail',
    position: 10,
    type: SpaceType.JAIL,
    name: '監獄',
    description: '監獄/探望',
    icon: '🏛️',
    specialAction: {
      type: SpecialActionType.GO_TO_JAIL,
      value: 0,
      description: '入獄或探望'
    }
  },
  {
    id: 'free_parking',
    position: 20,
    type: SpaceType.FREE_PARKING,
    name: '免費停車',
    description: '免費停車場',
    icon: '🅿️',
    specialAction: {
      type: SpecialActionType.FREE_PARKING_BONUS,
      value: 0,
      description: '免費停車，無事發生'
    }
  },
  {
    id: 'go_to_jail',
    position: 30,
    type: SpaceType.GO_TO_JAIL,
    name: '入獄',
    description: '直接入獄',
    icon: '👮',
    specialAction: {
      type: SpecialActionType.GO_TO_JAIL,
      value: 10,
      description: '直接前往監獄'
    }
  }
];

// 標準地段分組
export const STANDARD_PROPERTY_GROUPS: PropertyGroup[] = [
  {
    id: 'brown',
    name: '棕色地段',
    color: '#8B4513',
    propertyIds: ['mediterranean_avenue', 'baltic_avenue'],
    monopolyBonus: 2,
    buildingRestrictions: [
      {
        type: BuildingRestrictionType.EVEN_BUILDING,
        value: 1,
        description: '必須平均建設'
      },
      {
        type: BuildingRestrictionType.MONOPOLY_REQUIRED,
        value: 1,
        description: '需要擁有整個地段才能建設'
      }
    ]
  },
  {
    id: 'light_blue',
    name: '淺藍色地段',
    color: '#87CEEB',
    propertyIds: ['oriental_avenue', 'vermont_avenue', 'connecticut_avenue'],
    monopolyBonus: 2,
    buildingRestrictions: [
      {
        type: BuildingRestrictionType.EVEN_BUILDING,
        value: 1,
        description: '必須平均建設'
      }
    ]
  },
  {
    id: 'railroad',
    name: '火車站',
    color: '#000000',
    propertyIds: ['reading_railroad', 'pennsylvania_railroad', 'b_o_railroad', 'short_line'],
    monopolyBonus: 1,
    buildingRestrictions: []
  },
  {
    id: 'utility',
    name: '公用事業',
    color: '#FFFFFF',
    propertyIds: ['electric_company', 'water_works'],
    monopolyBonus: 1,
    buildingRestrictions: []
  }
];

// 預設主題
export const DEFAULT_THEME: BoardTheme = {
  id: 'classic',
  name: '經典主題',
  description: '傳統大富翁遊戲風格',
  colors: {
    background: '#F0F8FF',
    boardBorder: '#228B22',
    spaceDefault: '#FFFFFF',
    spaceProperty: '#FFE4B5',
    spaceRailroad: '#000000',
    spaceUtility: '#F0F0F0',
    spaceSpecial: '#FFB6C1',
    text: '#000000',
    player: ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF', '#00FFFF']
  },
  images: {
    background: '/images/board-background.jpg',
    boardLayout: '/images/board-layout.png',
    propertyIcons: {},
    playerTokens: [
      '/images/tokens/car.png',
      '/images/tokens/hat.png',
      '/images/tokens/dog.png',
      '/images/tokens/shoe.png',
      '/images/tokens/ship.png',
      '/images/tokens/iron.png'
    ],
    diceImages: [
      '/images/dice/1.png',
      '/images/dice/2.png',
      '/images/dice/3.png',
      '/images/dice/4.png',
      '/images/dice/5.png',
      '/images/dice/6.png'
    ],
    cardBackgrounds: {
      chance: '/images/cards/chance-back.png',
      community_chest: '/images/cards/community-chest-back.png'
    }
  },
  sounds: {
    diceRoll: '/sounds/dice-roll.mp3',
    buyProperty: '/sounds/buy-property.mp3',
    payRent: '/sounds/pay-rent.mp3',
    goToJail: '/sounds/go-to-jail.mp3',
    cardDraw: '/sounds/card-draw.mp3',
    buildHouse: '/sounds/build-house.mp3',
    buildHotel: '/sounds/build-hotel.mp3',
    bankrupt: '/sounds/bankrupt.mp3',
    gameWin: '/sounds/game-win.mp3',
    turnStart: '/sounds/turn-start.mp3'
  }
};
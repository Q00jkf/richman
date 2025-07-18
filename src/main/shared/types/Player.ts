/**
 * 玩家系統類型定義
 * RichMan - 線上多人大富翁遊戲
 */

export interface Player {
  id: string;
  name: string;
  avatar: string;
  money: number;
  position: number; // 在地圖上的位置 (0-39)
  properties: PropertyOwnership[];
  jailStatus: JailStatus;
  isActive: boolean;
  isBankrupt: boolean;
  connectionStatus: ConnectionStatus;
  stats: PlayerGameStats;
  role?: PlayerRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyOwnership {
  propertyId: string;
  purchasePrice: number;
  currentValue: number;
  isMortgaged: boolean;
  houses: number;
  hotels: number;
  rentMultiplier: number;
  purchaseDate: Date;
}

export interface JailStatus {
  isInJail: boolean;
  turnsInJail: number;
  canPayFine: boolean;
  hasGetOutOfJailCard: boolean;
  jailReason: JailReason;
  jailEntryDate?: Date;
}

export enum JailReason {
  NONE = 'none',
  GO_TO_JAIL_SPACE = 'go_to_jail_space',
  CHANCE_CARD = 'chance_card',
  COMMUNITY_CHEST = 'community_chest',
  THREE_DOUBLES = 'three_doubles'
}

export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting'
}

export interface PlayerGameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalMoneyEarned: number;
  totalRentCollected: number;
  totalRentPaid: number;
  propertiesBought: number;
  housesBuilt: number;
  hotelsBuilt: number;
  timesInJail: number;
  bankruptcies: number;
  averageGameTime: number;
  winRate: number;
  favoriteProperty?: string;
}

export interface PlayerRole {
  id: string;
  name: string;
  description: string;
  abilities: RoleAbility[];
  icon: string;
  color: string;
}

export interface RoleAbility {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  trigger: AbilityTrigger;
  effect: AbilityEffect;
  cooldown?: number;
  usesPerGame?: number;
  usesRemaining?: number;
}

export enum AbilityType {
  PASSIVE = 'passive',
  ACTIVE = 'active',
  TRIGGERED = 'triggered'
}

export enum AbilityTrigger {
  GAME_START = 'game_start',
  TURN_START = 'turn_start',
  DICE_ROLL = 'dice_roll',
  LAND_ON_PROPERTY = 'land_on_property',
  BUY_PROPERTY = 'buy_property',
  PAY_RENT = 'pay_rent',
  COLLECT_RENT = 'collect_rent',
  DRAW_CARD = 'draw_card',
  GO_TO_JAIL = 'go_to_jail',
  PASS_GO = 'pass_go',
  MANUAL_ACTIVATION = 'manual_activation'
}

export interface AbilityEffect {
  type: EffectType;
  value: number;
  duration?: number;
  target?: EffectTarget;
  condition?: EffectCondition;
}

export enum EffectType {
  MONEY_BONUS = 'money_bonus',
  RENT_REDUCTION = 'rent_reduction',
  RENT_INCREASE = 'rent_increase',
  PROPERTY_DISCOUNT = 'property_discount',
  JAIL_IMMUNITY = 'jail_immunity',
  EXTRA_TURN = 'extra_turn',
  DOUBLE_SALARY = 'double_salary',
  FREE_BUILDING = 'free_building',
  TELEPORT = 'teleport',
  STEAL_PROPERTY = 'steal_property'
}

export enum EffectTarget {
  SELF = 'self',
  ALL_PLAYERS = 'all_players',
  OTHER_PLAYERS = 'other_players',
  RANDOM_PLAYER = 'random_player',
  RICHEST_PLAYER = 'richest_player',
  POOREST_PLAYER = 'poorest_player'
}

export interface EffectCondition {
  type: ConditionType;
  value: any;
  operator: ConditionOperator;
}

export enum ConditionType {
  PLAYER_MONEY = 'player_money',
  PROPERTIES_OWNED = 'properties_owned',
  HOUSES_OWNED = 'houses_owned',
  HOTELS_OWNED = 'hotels_owned',
  TURN_NUMBER = 'turn_number',
  JAIL_STATUS = 'jail_status',
  PROPERTY_COLOR = 'property_color'
}

export enum ConditionOperator {
  EQUAL = 'equal',
  NOT_EQUAL = 'not_equal',
  GREATER = 'greater',
  GREATER_EQUAL = 'greater_equal',
  LESS = 'less',
  LESS_EQUAL = 'less_equal',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains'
}

export interface PlayerAction {
  playerId: string;
  type: PlayerActionType;
  data: any;
  timestamp: Date;
  validated: boolean;
}

export enum PlayerActionType {
  ROLL_DICE = 'roll_dice',
  END_TURN = 'end_turn',
  BUY_PROPERTY = 'buy_property',
  DECLINE_PROPERTY = 'decline_property',
  BUILD_HOUSE = 'build_house',
  BUILD_HOTEL = 'build_hotel',
  SELL_HOUSE = 'sell_house',
  SELL_HOTEL = 'sell_hotel',
  MORTGAGE_PROPERTY = 'mortgage_property',
  UNMORTGAGE_PROPERTY = 'unmortgage_property',
  USE_GET_OUT_OF_JAIL_CARD = 'use_get_out_of_jail_card',
  PAY_JAIL_FINE = 'pay_jail_fine',
  PROPOSE_TRADE = 'propose_trade',
  ACCEPT_TRADE = 'accept_trade',
  REJECT_TRADE = 'reject_trade',
  DECLARE_BANKRUPTCY = 'declare_bankruptcy',
  USE_ROLE_ABILITY = 'use_role_ability',
  SEND_MESSAGE = 'send_message',
  LEAVE_GAME = 'leave_game'
}

export interface PlayerTrade {
  id: string;
  proposerId: string;
  targetId: string;
  proposerOffer: TradeOffer;
  targetOffer: TradeOffer;
  status: TradeStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeOffer {
  money: number;
  properties: string[];
  getOutOfJailCards: number;
  specialConditions?: string[];
}

export enum TradeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface PlayerNotification {
  id: string;
  playerId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export enum NotificationType {
  GAME_STARTED = 'game_started',
  YOUR_TURN = 'your_turn',
  PROPERTY_AVAILABLE = 'property_available',
  RENT_DUE = 'rent_due',
  CARD_DRAWN = 'card_drawn',
  JAIL_ENTERED = 'jail_entered',
  TRADE_PROPOSED = 'trade_proposed',
  TRADE_ACCEPTED = 'trade_accepted',
  TRADE_REJECTED = 'trade_rejected',
  PLAYER_BANKRUPTED = 'player_bankrupted',
  GAME_ENDED = 'game_ended',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked'
}

// 預設角色定義
export const DEFAULT_ROLES: PlayerRole[] = [
  {
    id: 'banker',
    name: '銀行家',
    description: '繞過起點時多領 $50',
    abilities: [
      {
        id: 'extra_salary',
        name: '額外薪水',
        description: '每次繞過起點時額外獲得 $50',
        type: AbilityType.PASSIVE,
        trigger: AbilityTrigger.PASS_GO,
        effect: {
          type: EffectType.MONEY_BONUS,
          value: 50,
          target: EffectTarget.SELF
        }
      }
    ],
    icon: '🏦',
    color: '#2E8B57'
  },
  {
    id: 'tycoon',
    name: '富豪',
    description: '購買地產時可選擇分期付款',
    abilities: [
      {
        id: 'installment_payment',
        name: '分期付款',
        description: '購買地產時只需支付 50% 金額',
        type: AbilityType.PASSIVE,
        trigger: AbilityTrigger.BUY_PROPERTY,
        effect: {
          type: EffectType.PROPERTY_DISCOUNT,
          value: 0.5,
          target: EffectTarget.SELF
        }
      }
    ],
    icon: '💰',
    color: '#FFD700'
  },
  {
    id: 'speculator',
    name: '投機客',
    description: '購買地產後抽一張機會卡',
    abilities: [
      {
        id: 'lucky_draw',
        name: '幸運抽獎',
        description: '每次購買地產後自動抽取一張機會卡',
        type: AbilityType.TRIGGERED,
        trigger: AbilityTrigger.BUY_PROPERTY,
        effect: {
          type: EffectType.EXTRA_TURN,
          value: 1,
          target: EffectTarget.SELF
        }
      }
    ],
    icon: '🎰',
    color: '#FF6347'
  }
];
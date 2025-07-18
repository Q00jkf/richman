/**
 * 遊戲常數定義
 * 定義遊戲中所有的常數、狀態、類型等
 */

// 遊戲階段
const GamePhase = {
  LOBBY: 'lobby',
  STARTING: 'starting',
  IN_PROGRESS: 'in_progress',
  PAUSED: 'paused',
  GAME_OVER: 'game_over'
};

// 遊戲事件類型
const GameEventType = {
  // 遊戲生命週期
  GAME_CREATED: 'game_created',
  GAME_STARTED: 'game_started',
  GAME_PAUSED: 'game_paused',
  GAME_RESUMED: 'game_resumed',
  GAME_ENDED: 'game_ended',
  
  // 玩家事件
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  PLAYER_READY: 'player_ready',
  PLAYER_TURN_STARTED: 'player_turn_started',
  PLAYER_TURN_ENDED: 'player_turn_ended',
  PLAYER_MOVED: 'player_moved',
  PLAYER_BANKRUPTED: 'player_bankrupted',
  
  // 遊戲動作
  DICE_ROLLED: 'dice_rolled',
  PROPERTY_BOUGHT: 'property_bought',
  PROPERTY_SOLD: 'property_sold',
  RENT_PAID: 'rent_paid',
  CARD_DRAWN: 'card_drawn',
  TRADE_INITIATED: 'trade_initiated',
  TRADE_COMPLETED: 'trade_completed',
  
  // 系統事件
  GAME_STATE_UPDATED: 'game_state_updated',
  ERROR_OCCURRED: 'error_occurred'
};

// 玩家狀態
const PlayerStatus = {
  OFFLINE: 'offline',
  ONLINE: 'online',
  IN_LOBBY: 'in_lobby',
  IN_GAME: 'in_game',
  DISCONNECTED: 'disconnected'
};

// 房間狀態
const RoomStatus = {
  WAITING: 'waiting',
  FULL: 'full',
  IN_GAME: 'in_game',
  CLOSED: 'closed'
};

// 遊戲設置
const GameSettings = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 6,
  DEFAULT_STARTING_MONEY: 1500,
  DEFAULT_SALARY: 200,
  DEFAULT_GAME_TIME_LIMIT: 120, // 分鐘
  DEFAULT_TURN_TIME_LIMIT: 60, // 秒
  
  // 骰子設置
  DICE_COUNT: 2,
  DICE_SIDES: 6,
  
  // 監獄設置
  JAIL_POSITION: 10,
  JAIL_FINE: 50,
  MAX_JAIL_TURNS: 3,
  
  // 稅收設置
  INCOME_TAX_RATE: 0.10,
  LUXURY_TAX: 75
};

// 棋盤常數
const BoardConstants = {
  TOTAL_SPACES: 40,
  GO_POSITION: 0,
  JAIL_POSITION: 10,
  FREE_PARKING_POSITION: 20,
  GO_TO_JAIL_POSITION: 30,
  
  // 特殊位置
  SPECIAL_POSITIONS: {
    GO: 0,
    COMMUNITY_CHEST_1: 2,
    INCOME_TAX: 4,
    RAILROAD_1: 5,
    CHANCE_1: 7,
    JAIL: 10,
    UTILITY_1: 12,
    RAILROAD_2: 15,
    COMMUNITY_CHEST_2: 17,
    FREE_PARKING: 20,
    CHANCE_2: 22,
    RAILROAD_3: 25,
    UTILITY_2: 28,
    GO_TO_JAIL: 30,
    COMMUNITY_CHEST_3: 33,
    RAILROAD_4: 35,
    CHANCE_3: 36,
    LUXURY_TAX: 38
  }
};

// 屬性類型
const PropertyType = {
  STREET: 'street',
  RAILROAD: 'railroad',
  UTILITY: 'utility',
  SPECIAL: 'special'
};

// 顏色組
const ColorGroup = {
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

// 卡片類型
const CardType = {
  CHANCE: 'chance',
  COMMUNITY_CHEST: 'community_chest'
};

// 動作類型
const ActionType = {
  // 基本動作
  ROLL_DICE: 'roll_dice',
  END_TURN: 'end_turn',
  
  // 購買/管理屬性
  BUY_PROPERTY: 'buy_property',
  SELL_PROPERTY: 'sell_property',
  MORTGAGE_PROPERTY: 'mortgage_property',
  UNMORTGAGE_PROPERTY: 'unmortgage_property',
  
  // 建築管理
  BUILD_HOUSE: 'build_house',
  BUILD_HOTEL: 'build_hotel',
  SELL_HOUSE: 'sell_house',
  SELL_HOTEL: 'sell_hotel',
  
  // 交易
  INITIATE_TRADE: 'initiate_trade',
  ACCEPT_TRADE: 'accept_trade',
  DECLINE_TRADE: 'decline_trade',
  COUNTER_TRADE: 'counter_trade',
  
  // 監獄相關
  PAY_JAIL_FINE: 'pay_jail_fine',
  USE_GET_OUT_OF_JAIL_CARD: 'use_get_out_of_jail_card',
  
  // 破產相關
  DECLARE_BANKRUPTCY: 'declare_bankruptcy',
  
  // 遊戲控制
  PAUSE_GAME: 'pause_game',
  RESUME_GAME: 'resume_game',
  QUIT_GAME: 'quit_game'
};

// WebSocket 事件
const SocketEvents = {
  // 連接事件
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  
  // 房間事件
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  ROOM_CREATED: 'room_created',
  ROOM_UPDATED: 'room_updated',
  ROOM_DELETED: 'room_deleted',
  
  // 遊戲事件
  GAME_ACTION: 'game_action',
  GAME_STATE_UPDATE: 'game_state_update',
  GAME_EVENT: 'game_event',
  
  // 玩家事件
  PLAYER_UPDATE: 'player_update',
  PLAYER_MESSAGE: 'player_message',
  
  // 系統事件
  ERROR: 'error',
  NOTIFICATION: 'notification'
};

// 錯誤代碼
const ErrorCode = {
  // 一般錯誤
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // 認證錯誤
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // 遊戲錯誤
  GAME_NOT_FOUND: 'GAME_NOT_FOUND',
  GAME_FULL: 'GAME_FULL',
  GAME_ALREADY_STARTED: 'GAME_ALREADY_STARTED',
  GAME_NOT_STARTED: 'GAME_NOT_STARTED',
  
  // 玩家錯誤
  PLAYER_NOT_FOUND: 'PLAYER_NOT_FOUND',
  PLAYER_ALREADY_IN_GAME: 'PLAYER_ALREADY_IN_GAME',
  PLAYER_NOT_IN_GAME: 'PLAYER_NOT_IN_GAME',
  PLAYER_NOT_TURN: 'PLAYER_NOT_TURN',
  PLAYER_INSUFFICIENT_FUNDS: 'PLAYER_INSUFFICIENT_FUNDS',
  
  // 房間錯誤
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_FULL: 'ROOM_FULL',
  ROOM_CLOSED: 'ROOM_CLOSED',
  
  // 動作錯誤
  INVALID_ACTION: 'INVALID_ACTION',
  ACTION_NOT_ALLOWED: 'ACTION_NOT_ALLOWED',
  
  // 屬性錯誤
  PROPERTY_NOT_FOUND: 'PROPERTY_NOT_FOUND',
  PROPERTY_ALREADY_OWNED: 'PROPERTY_ALREADY_OWNED',
  PROPERTY_NOT_OWNED: 'PROPERTY_NOT_OWNED',
  PROPERTY_MORTGAGED: 'PROPERTY_MORTGAGED'
};

// 訊息類型
const MessageType = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  SYSTEM: 'system',
  CHAT: 'chat'
};

module.exports = {
  GamePhase,
  GameEventType,
  PlayerStatus,
  RoomStatus,
  GameSettings,
  BoardConstants,
  PropertyType,
  ColorGroup,
  CardType,
  ActionType,
  SocketEvents,
  ErrorCode,
  MessageType
};
/**
 * 遊戲常數定義
 * 所有遊戲相關的常數和配置
 */

// 遊戲階段
const GamePhase = {
  WAITING: 'waiting',
  STARTING: 'starting',
  PLAYING: 'playing',
  PLAYER_TURN: 'player_turn',
  DICE_ROLLING: 'dice_rolling',
  MOVING: 'moving',
  PROPERTY_ACTION: 'property_action',
  CARD_DRAWING: 'card_drawing',
  JAIL: 'jail',
  TRADE: 'trade',
  BUILDING: 'building',
  BANKRUPTCY: 'bankruptcy',
  GAME_OVER: 'game_over'
};

// 遊戲動作類型
const GameActionType = {
  JOIN_GAME: 'join_game',
  LEAVE_GAME: 'leave_game',
  ROLL_DICE: 'roll_dice',
  MOVE_PLAYER: 'move_player',
  BUY_PROPERTY: 'buy_property',
  PAY_RENT: 'pay_rent',
  DRAW_CARD: 'draw_card',
  GO_TO_JAIL: 'go_to_jail',
  GET_OUT_OF_JAIL: 'get_out_of_jail',
  BUILD_HOUSE: 'build_house',
  BUILD_HOTEL: 'build_hotel',
  MORTGAGE_PROPERTY: 'mortgage_property',
  UNMORTGAGE_PROPERTY: 'unmortgage_property',
  TRADE_OFFER: 'trade_offer',
  TRADE_ACCEPT: 'trade_accept',
  TRADE_REJECT: 'trade_reject',
  DECLARE_BANKRUPTCY: 'declare_bankruptcy',
  COLLECT_SALARY: 'collect_salary',
  PAY_TAX: 'pay_tax',
  END_TURN: 'end_turn'
};

// 遊戲事件類型
const GameEventType = {
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  GAME_STARTED: 'game_started',
  TURN_STARTED: 'turn_started',
  DICE_ROLLED: 'dice_rolled',
  PLAYER_MOVED: 'player_moved',
  PROPERTY_BOUGHT: 'property_bought',
  RENT_PAID: 'rent_paid',
  CARD_DRAWN: 'card_drawn',
  JAIL_ENTERED: 'jail_entered',
  JAIL_EXITED: 'jail_exited',
  HOUSE_BUILT: 'house_built',
  HOTEL_BUILT: 'hotel_built',
  PROPERTY_MORTGAGED: 'property_mortgaged',
  PROPERTY_UNMORTGAGED: 'property_unmortgaged',
  TRADE_PROPOSED: 'trade_proposed',
  TRADE_COMPLETED: 'trade_completed',
  PLAYER_BANKRUPTED: 'player_bankrupted',
  PLAYER_AGED: 'player_aged',
  GAME_ENDED: 'game_ended',
  SALARY_COLLECTED: 'salary_collected',
  TAX_PAID: 'tax_paid',
  FREE_PARKING_BONUS: 'free_parking_bonus'
};

// 房間狀態
const RoomStatus = {
  WAITING: 'waiting',
  IN_GAME: 'in_game',
  FINISHED: 'finished',
  ABANDONED: 'abandoned',
  FULL: 'full',
  CLOSED: 'closed'
};

// 玩家狀態
const PlayerStatus = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  IN_LOBBY: 'in_lobby',
  IN_GAME: 'in_game',
  SPECTATING: 'spectating'
};

// 連接狀態
const ConnectionStatus = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting'
};

// 監獄原因
const JailReason = {
  NONE: 'none',
  GO_TO_JAIL_SPACE: 'go_to_jail_space',
  CHANCE_CARD: 'chance_card',
  COMMUNITY_CHEST: 'community_chest',
  THREE_DOUBLES: 'three_doubles'
};

// 遊戲結束原因
const GameEndReason = {
  WINNER: 'winner',
  TIME_LIMIT: 'time_limit',
  PLAYERS_LEFT: 'players_left',
  MANUAL_END: 'manual_end',
  HOST_LEFT: 'host_left'
};

// 交易狀態
const TradeStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

// 通知類型
const NotificationType = {
  GAME_STARTED: 'game_started',
  YOUR_TURN: 'your_turn',
  PROPERTY_AVAILABLE: 'property_available',
  RENT_DUE: 'rent_due',
  CARD_DRAWN: 'card_drawn',
  JAIL_ENTERED: 'jail_entered',
  TRADE_PROPOSED: 'trade_proposed',
  TRADE_ACCEPTED: 'trade_accepted',
  TRADE_REJECTED: 'trade_rejected',
  PLAYER_BANKRUPTED: 'player_bankrupted',
  GAME_ENDED: 'game_ended',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left'
};

// 訊息類型
const MessageType = {
  SYSTEM: 'system',
  CHAT: 'chat',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
  DEBUG: 'debug'
};

// 遊戲配置
const GameConfig = {
  MAX_PLAYERS: 6,
  MIN_PLAYERS: 2,
  DEFAULT_STARTING_MONEY: 1500,
  DEFAULT_SALARY: 200,
  DEFAULT_GAME_TIME_LIMIT: 7200, // 2小時
  DEFAULT_TURN_TIME_LIMIT: 120,  // 2分鐘
  DEFAULT_JAIL_FINE: 50,
  DEFAULT_LUXURY_TAX: 75,
  DEFAULT_INCOME_TAX: 200,
  MAX_HOUSES_PER_PROPERTY: 4,
  MAX_HOTELS_PER_PROPERTY: 1,
  BOARD_SPACES: 40,
  JAIL_POSITION: 10,
  GO_TO_JAIL_POSITION: 30,
  FREE_PARKING_POSITION: 20,
  GO_POSITION: 0,
  MAX_JAIL_TURNS: 3,
  TURN_TIME_LIMIT: 120, // 秒
  ROOM_TIMEOUT: 300000, // 5分鐘
  PLAYER_TIMEOUT: 300000, // 5分鐘
  MAX_CHAT_MESSAGE_LENGTH: 200,
  MAX_PLAYER_NAME_LENGTH: 20,
  MAX_ROOM_NAME_LENGTH: 30
};

// 錯誤代碼
const ErrorCode = {
  // 一般錯誤
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // 玩家相關錯誤
  PLAYER_NOT_FOUND: 'PLAYER_NOT_FOUND',
  PLAYER_ALREADY_EXISTS: 'PLAYER_ALREADY_EXISTS',
  PLAYER_NOT_IN_GAME: 'PLAYER_NOT_IN_GAME',
  PLAYER_ALREADY_IN_GAME: 'PLAYER_ALREADY_IN_GAME',
  PLAYER_NOT_ONLINE: 'PLAYER_NOT_ONLINE',
  INVALID_PLAYER_NAME: 'INVALID_PLAYER_NAME',
  PLAYER_CREATION_FAILED: 'PLAYER_CREATION_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // 房間相關錯誤
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_FULL: 'ROOM_FULL',
  ROOM_ALREADY_STARTED: 'ROOM_ALREADY_STARTED',
  ROOM_NOT_STARTED: 'ROOM_NOT_STARTED',
  ROOM_PASSWORD_REQUIRED: 'ROOM_PASSWORD_REQUIRED',
  ROOM_WRONG_PASSWORD: 'ROOM_WRONG_PASSWORD',
  NOT_ROOM_HOST: 'NOT_ROOM_HOST',
  
  // 遊戲相關錯誤
  GAME_NOT_FOUND: 'GAME_NOT_FOUND',
  GAME_ALREADY_STARTED: 'GAME_ALREADY_STARTED',
  GAME_NOT_STARTED: 'GAME_NOT_STARTED',
  GAME_ALREADY_ENDED: 'GAME_ALREADY_ENDED',
  NOT_PLAYER_TURN: 'NOT_PLAYER_TURN',
  INVALID_GAME_ACTION: 'INVALID_GAME_ACTION',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  PROPERTY_NOT_AVAILABLE: 'PROPERTY_NOT_AVAILABLE',
  PROPERTY_ALREADY_OWNED: 'PROPERTY_ALREADY_OWNED',
  CANNOT_BUILD_HOUSE: 'CANNOT_BUILD_HOUSE',
  CANNOT_BUILD_HOTEL: 'CANNOT_BUILD_HOTEL',
  INVALID_TRADE: 'INVALID_TRADE',
  PLAYER_IN_JAIL: 'PLAYER_IN_JAIL',
  PLAYER_BANKRUPT: 'PLAYER_BANKRUPT'
};

// Socket 事件
const SocketEvents = {
  // 連接事件
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  
  // 認證事件
  AUTHENTICATE: 'authenticate',
  AUTHENTICATION_SUCCESS: 'authentication_success',
  AUTHENTICATION_ERROR: 'authentication_error',
  
  // 房間事件
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  ROOM_JOINED: 'room_joined',
  ROOM_LEFT: 'room_left',
  ROOM_UPDATED: 'room_updated',
  ROOM_PLAYER_JOINED: 'room_player_joined',
  ROOM_PLAYER_LEFT: 'room_player_left',
  ROOM_PLAYER_READY: 'room_player_ready',
  ROOM_CHAT_MESSAGE: 'room_chat_message',
  
  // 遊戲事件
  GAME_START: 'game_start',
  GAME_STARTED: 'game_started',
  GAME_STATE_UPDATE: 'game_state_update',
  GAME_ENDED: 'game_ended',
  GAME_ERROR: 'game_error',
  
  // 玩家動作事件
  PLAYER_ACTION: 'player_action',
  PLAYER_ACTION_RESULT: 'player_action_result',
  
  // 遊戲特定事件
  DICE_ROLL: 'dice_roll',
  DICE_ROLLED: 'dice_rolled',
  PLAYER_MOVED: 'player_moved',
  PROPERTY_BOUGHT: 'property_bought',
  RENT_PAID: 'rent_paid',
  CARD_DRAWN: 'card_drawn',
  PLAYER_JAILED: 'player_jailed',
  PLAYER_FREED: 'player_freed',
  HOUSE_BUILT: 'house_built',
  HOTEL_BUILT: 'hotel_built',
  TRADE_PROPOSED: 'trade_proposed',
  TRADE_RESPONDED: 'trade_responded',
  PLAYER_BANKRUPTED: 'player_bankrupted',
  TURN_STARTED: 'turn_started',
  TURN_ENDED: 'turn_ended',
  
  // 通知事件
  NOTIFICATION: 'notification',
  TOAST_MESSAGE: 'toast_message',
  ERROR_MESSAGE: 'error_message',
  
  // 系統事件
  SERVER_STATUS: 'server_status',
  MAINTENANCE_MODE: 'maintenance_mode'
};

// 預設遊戲設定
const DefaultGameSettings = {
  maxPlayers: GameConfig.MAX_PLAYERS,
  minPlayers: GameConfig.MIN_PLAYERS,
  startingMoney: GameConfig.DEFAULT_STARTING_MONEY,
  salaryAmount: GameConfig.DEFAULT_SALARY,
  jailFine: GameConfig.DEFAULT_JAIL_FINE,
  freeParkingBonus: 0,
  enableHouseRules: false,
  enableAuction: true,
  enableTrade: true,
  timeLimit: GameConfig.TURN_TIME_LIMIT,
  enableChat: true,
  enableSpectators: true,
  autoStart: false,
  customRules: []
};

// 匯出所有常數
module.exports = {
  GamePhase,
  GameActionType,
  GameEventType,
  RoomStatus,
  PlayerStatus,
  ConnectionStatus,
  JailReason,
  GameEndReason,
  TradeStatus,
  NotificationType,
  MessageType,
  GameConfig,
  ErrorCode,
  SocketEvents,
  DefaultGameSettings
};
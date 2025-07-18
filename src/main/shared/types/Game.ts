/**
 * 遊戲核心類型定義
 * RichMan - 線上多人大富翁遊戲
 */

import { Player } from './Player';
import { Board } from './Board';
import { Card } from './Card';

export interface GameState {
  id: string;
  players: Player[];
  board: Board;
  currentPlayerIndex: number;
  gamePhase: GamePhase;
  roundNumber: number;
  diceResult: DiceResult | null;
  lastAction: GameAction | null;
  createdAt: Date;
  updatedAt: Date;
  settings: GameSettings;
}

export enum GamePhase {
  WAITING = 'waiting',        // 等待玩家加入
  STARTING = 'starting',      // 遊戲開始
  PLAYING = 'playing',        // 遊戲進行中
  PLAYER_TURN = 'player_turn', // 玩家回合
  DICE_ROLLING = 'dice_rolling', // 擲骰子
  MOVING = 'moving',          // 移動中
  PROPERTY_ACTION = 'property_action', // 地產動作
  CARD_DRAWING = 'card_drawing', // 抽卡
  JAIL = 'jail',              // 監獄相關
  TRADE = 'trade',            // 交易
  BUILDING = 'building',      // 建設
  BANKRUPTCY = 'bankruptcy',  // 破產處理
  GAME_OVER = 'game_over'     // 遊戲結束
}

export interface DiceResult {
  dice1: number;
  dice2: number;
  total: number;
  isDouble: boolean;
  rollTime: Date;
}

export interface GameAction {
  type: GameActionType;
  playerId: string;
  data: any;
  timestamp: Date;
}

export enum GameActionType {
  JOIN_GAME = 'join_game',
  LEAVE_GAME = 'leave_game',
  ROLL_DICE = 'roll_dice',
  MOVE_PLAYER = 'move_player',
  BUY_PROPERTY = 'buy_property',
  PAY_RENT = 'pay_rent',
  DRAW_CARD = 'draw_card',
  GO_TO_JAIL = 'go_to_jail',
  GET_OUT_OF_JAIL = 'get_out_of_jail',
  BUILD_HOUSE = 'build_house',
  BUILD_HOTEL = 'build_hotel',
  MORTGAGE_PROPERTY = 'mortgage_property',
  UNMORTGAGE_PROPERTY = 'unmortgage_property',
  TRADE_OFFER = 'trade_offer',
  TRADE_ACCEPT = 'trade_accept',
  TRADE_REJECT = 'trade_reject',
  DECLARE_BANKRUPTCY = 'declare_bankruptcy',
  COLLECT_SALARY = 'collect_salary',
  PAY_TAX = 'pay_tax'
}

export interface GameSettings {
  maxPlayers: number;
  startingMoney: number;
  salaryAmount: number;
  jailFine: number;
  freeParkingBonus: number;
  enableHouseRules: boolean;
  enableAuction: boolean;
  enableTrade: boolean;
  timeLimit: number; // 每回合時間限制（秒）
  customRules: CustomRule[];
}

export interface CustomRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  parameters: Record<string, any>;
}

export interface GameRoom {
  id: string;
  name: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  isPrivate: boolean;
  password?: string;
  status: RoomStatus;
  gameState?: GameState;
  createdAt: Date;
  updatedAt: Date;
}

export enum RoomStatus {
  WAITING = 'waiting',
  IN_GAME = 'in_game',
  FINISHED = 'finished',
  ABANDONED = 'abandoned'
}

export interface GameEvent {
  id: string;
  type: GameEventType;
  gameId: string;
  playerId?: string;
  data: any;
  timestamp: Date;
  processed: boolean;
}

export enum GameEventType {
  PLAYER_JOINED = 'player_joined',
  PLAYER_LEFT = 'player_left',
  GAME_STARTED = 'game_started',
  TURN_STARTED = 'turn_started',
  DICE_ROLLED = 'dice_rolled',
  PLAYER_MOVED = 'player_moved',
  PROPERTY_BOUGHT = 'property_bought',
  RENT_PAID = 'rent_paid',
  CARD_DRAWN = 'card_drawn',
  JAIL_ENTERED = 'jail_entered',
  JAIL_EXITED = 'jail_exited',
  HOUSE_BUILT = 'house_built',
  HOTEL_BUILT = 'hotel_built',
  PROPERTY_MORTGAGED = 'property_mortgaged',
  PROPERTY_UNMORTGAGED = 'property_unmortgaged',
  TRADE_PROPOSED = 'trade_proposed',
  TRADE_COMPLETED = 'trade_completed',
  PLAYER_BANKRUPTED = 'player_bankrupted',
  GAME_ENDED = 'game_ended'
}

export interface GameStats {
  gameId: string;
  totalTurns: number;
  totalTime: number; // 遊戲總時間（秒）
  playerStats: PlayerStats[];
  winnerPlayerId: string;
  endReason: GameEndReason;
  createdAt: Date;
  endedAt: Date;
}

export interface PlayerStats {
  playerId: string;
  totalMoney: number;
  propertiesOwned: number;
  housesBuilt: number;
  hotelsBuilt: number;
  rentCollected: number;
  rentPaid: number;
  timesInJail: number;
  turnsPlayed: number;
  finalRank: number;
}

export enum GameEndReason {
  WINNER = 'winner',
  TIME_LIMIT = 'time_limit',
  PLAYERS_LEFT = 'players_left',
  MANUAL_END = 'manual_end'
}

export interface GameEngine {
  gameState: GameState;
  processAction(action: GameAction): Promise<GameEvent[]>;
  validateAction(action: GameAction): boolean;
  getCurrentPlayer(): Player;
  getNextPlayer(): Player;
  checkWinCondition(): boolean;
  calculateRent(propertyId: string, playerId: string): number;
  handleBankruptcy(playerId: string): Promise<void>;
  saveGameState(): Promise<void>;
  loadGameState(gameId: string): Promise<GameState>;
}

export interface GameEventHandler {
  handleEvent(event: GameEvent): Promise<void>;
  subscribe(eventType: GameEventType, callback: (event: GameEvent) => void): void;
  unsubscribe(eventType: GameEventType, callback: (event: GameEvent) => void): void;
  emit(event: GameEvent): void;
}
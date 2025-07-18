/**
 * 遊戲管理器 - 核心遊戲邏輯管理
 * 負責遊戲狀態、規則執行、事件處理
 */

const { v4: uuidv4 } = require('uuid');
const GameEngine = require('./GameEngine');
const { GamePhase, GameEventType } = require('../../shared/constants/GameConstants');

class GameManager {
  constructor() {
    this.games = new Map(); // gameId -> GameEngine
    this.playerGameMapping = new Map(); // playerId -> gameId
    this.gameStats = new Map(); // gameId -> GameStats
    this.eventHandlers = new Map(); // eventType -> handlers[]
    
    this.initializeEventHandlers();
  }

  initializeEventHandlers() {
    // 註冊事件處理器
    this.on(GameEventType.GAME_STARTED, this.handleGameStarted.bind(this));
    this.on(GameEventType.PLAYER_JOINED, this.handlePlayerJoined.bind(this));
    this.on(GameEventType.PLAYER_LEFT, this.handlePlayerLeft.bind(this));
    this.on(GameEventType.GAME_ENDED, this.handleGameEnded.bind(this));
    this.on(GameEventType.PLAYER_BANKRUPTED, this.handlePlayerBankrupted.bind(this));
  }

  /**
   * 創建新遊戲
   */
  createGame(roomId, settings = {}) {
    const gameId = uuidv4();
    const gameEngine = new GameEngine(gameId, roomId, settings);
    
    this.games.set(gameId, gameEngine);
    
    console.log(`🎮 Game created: ${gameId} for room: ${roomId}`);
    return gameEngine;
  }

  /**
   * 獲取遊戲實例
   */
  getGame(gameId) {
    return this.games.get(gameId);
  }

  /**
   * 獲取玩家所在遊戲
   */
  getGameByPlayer(playerId) {
    const gameId = this.playerGameMapping.get(playerId);
    return gameId ? this.games.get(gameId) : null;
  }

  /**
   * 玩家加入遊戲
   */
  async joinGame(gameId, player) {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const result = await game.addPlayer(player);
    if (result.success) {
      this.playerGameMapping.set(player.id, gameId);
      this.emit(GameEventType.PLAYER_JOINED, {
        gameId,
        playerId: player.id,
        playerName: player.name
      });
    }
    
    return result;
  }

  /**
   * 玩家離開遊戲
   */
  async leaveGame(playerId) {
    const gameId = this.playerGameMapping.get(playerId);
    if (!gameId) {
      return { success: false, message: 'Player not in any game' };
    }

    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, message: 'Game not found' };
    }

    const result = await game.removePlayer(playerId);
    if (result.success) {
      this.playerGameMapping.delete(playerId);
      this.emit(GameEventType.PLAYER_LEFT, {
        gameId,
        playerId
      });
      
      // 如果沒有玩家了，清理遊戲
      if (game.getPlayerCount() === 0) {
        this.cleanupGame(gameId);
      }
    }
    
    return result;
  }

  /**
   * 開始遊戲
   */
  async startGame(gameId, hostPlayerId) {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const result = await game.startGame(hostPlayerId);
    if (result.success) {
      this.emit(GameEventType.GAME_STARTED, {
        gameId,
        playerCount: game.getPlayerCount(),
        startTime: new Date()
      });
    }
    
    return result;
  }

  /**
   * 處理玩家動作
   */
  async handlePlayerAction(playerId, action) {
    const game = this.getGameByPlayer(playerId);
    if (!game) {
      throw new Error('Player not in any game');
    }

    return await game.processPlayerAction(playerId, action);
  }

  /**
   * 獲取遊戲狀態
   */
  getGameState(gameId) {
    const game = this.games.get(gameId);
    return game ? game.getGameState() : null;
  }

  /**
   * 獲取所有活躍遊戲
   */
  getActiveGames() {
    return Array.from(this.games.values()).filter(game => 
      game.getGameState().gamePhase !== GamePhase.GAME_OVER
    );
  }

  /**
   * 獲取活躍遊戲數量
   */
  getActiveGamesCount() {
    return this.getActiveGames().length;
  }

  /**
   * 清理遊戲
   */
  cleanupGame(gameId) {
    const game = this.games.get(gameId);
    if (game) {
      // 清理玩家映射
      game.getPlayers().forEach(player => {
        this.playerGameMapping.delete(player.id);
      });
      
      // 保存遊戲統計
      this.gameStats.set(gameId, game.getGameStats());
      
      // 移除遊戲
      this.games.delete(gameId);
      
      console.log(`🧹 Game cleaned up: ${gameId}`);
    }
  }

  /**
   * 事件系統
   */
  on(eventType, handler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType).push(handler);
  }

  emit(eventType, eventData) {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.forEach(handler => {
      try {
        handler(eventData);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    });
  }

  /**
   * 事件處理器
   */
  handleGameStarted(eventData) {
    console.log(`🎮 Game started: ${eventData.gameId} with ${eventData.playerCount} players`);
  }

  handlePlayerJoined(eventData) {
    console.log(`👥 Player joined: ${eventData.playerName} in game ${eventData.gameId}`);
  }

  handlePlayerLeft(eventData) {
    console.log(`👋 Player left: ${eventData.playerId} from game ${eventData.gameId}`);
  }

  handleGameEnded(eventData) {
    console.log(`🏆 Game ended: ${eventData.gameId}, winner: ${eventData.winnerId}`);
    this.cleanupGame(eventData.gameId);
  }

  handlePlayerBankrupted(eventData) {
    console.log(`💸 Player bankrupted: ${eventData.playerId} in game ${eventData.gameId}`);
  }

  /**
   * 獲取遊戲統計
   */
  getGameStats(gameId) {
    return this.gameStats.get(gameId);
  }

  /**
   * 定期清理過期遊戲
   */
  startCleanupTask() {
    setInterval(() => {
      const now = new Date();
      const expiredGames = [];
      
      this.games.forEach((game, gameId) => {
        const gameState = game.getGameState();
        const timeSinceUpdate = now - new Date(gameState.updatedAt);
        
        // 超過1小時無更新的遊戲標記為過期
        if (timeSinceUpdate > 60 * 60 * 1000) {
          expiredGames.push(gameId);
        }
      });
      
      expiredGames.forEach(gameId => {
        console.log(`🧹 Cleaning up expired game: ${gameId}`);
        this.cleanupGame(gameId);
      });
      
    }, 10 * 60 * 1000); // 每10分鐘檢查一次
  }

  /**
   * 伺服器狀態
   */
  getServerStatus() {
    return {
      activeGames: this.getActiveGamesCount(),
      totalGames: this.games.size,
      playersInGame: this.playerGameMapping.size,
      gameStats: this.gameStats.size,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
  }
}

module.exports = GameManager;
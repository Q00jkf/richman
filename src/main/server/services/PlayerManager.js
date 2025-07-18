/**
 * 玩家管理器 - 負責玩家認證、狀態管理、會話處理
 */

const { v4: uuidv4 } = require('uuid');
const { PlayerStatus, ErrorCode } = require('../../shared/constants/GameConstants');

class PlayerManager {
  constructor() {
    this.players = new Map(); // playerId -> Player
    this.socketPlayerMapping = new Map(); // socketId -> playerId
    this.playerSocketMapping = new Map(); // playerId -> socketId
    this.playerStats = new Map(); // playerId -> PlayerStats
    this.sessionTimeouts = new Map(); // playerId -> timeoutId
    
    // 玩家會話超時設定 (5分鐘)
    this.sessionTimeout = 5 * 60 * 1000;
    
    console.log('👥 PlayerManager initialized');
  }

  /**
   * 創建新玩家
   */
  createPlayer(playerData) {
    const playerId = uuidv4();
    const player = {
      id: playerId,
      name: playerData.name,
      email: playerData.email || null,
      avatar: playerData.avatar || null,
      status: PlayerStatus.ONLINE,
      createdAt: new Date(),
      lastActiveAt: new Date(),
      gamesPlayed: 0,
      gamesWon: 0,
      totalPlayTime: 0,
      currentRoomId: null,
      currentGameId: null,
      socketId: null,
      isGuest: !playerData.email,
      preferences: {
        soundEnabled: true,
        notificationsEnabled: true,
        autoEndTurn: false,
        ...playerData.preferences
      }
    };
    
    this.players.set(playerId, player);
    console.log(`👤 Player created: ${player.name} (${playerId})`);
    
    return player;
  }

  /**
   * 玩家連接
   */
  async connectPlayer(socketId, playerData) {
    try {
      let player;
      
      // 如果提供了 playerId，嘗試恢復現有玩家
      if (playerData.playerId && this.players.has(playerData.playerId)) {
        player = this.players.get(playerData.playerId);
        
        // 更新玩家狀態
        player.status = PlayerStatus.ONLINE;
        player.socketId = socketId;
        player.lastActiveAt = new Date();
        
        // 清除會話超時
        this.clearSessionTimeout(player.id);
        
        console.log(`🔄 Player reconnected: ${player.name} (${player.id})`);
      } else {
        // 創建新玩家
        player = this.createPlayer(playerData);
        player.socketId = socketId;
      }
      
      // 建立映射關係
      this.socketPlayerMapping.set(socketId, player.id);
      this.playerSocketMapping.set(player.id, socketId);
      
      return {
        success: true,
        player: this.getPlayerPublicInfo(player)
      };
    } catch (error) {
      console.error('Error connecting player:', error);
      return {
        success: false,
        error: ErrorCode.UNKNOWN_ERROR,
        message: error.message
      };
    }
  }

  /**
   * 玩家斷線
   */
  async disconnectPlayer(socketId) {
    try {
      const playerId = this.socketPlayerMapping.get(socketId);
      if (!playerId) {
        return { success: false, error: ErrorCode.PLAYER_NOT_FOUND };
      }
      
      const player = this.players.get(playerId);
      if (!player) {
        return { success: false, error: ErrorCode.PLAYER_NOT_FOUND };
      }
      
      // 更新玩家狀態
      player.status = PlayerStatus.DISCONNECTED;
      player.socketId = null;
      player.lastActiveAt = new Date();
      
      // 清除映射關係
      this.socketPlayerMapping.delete(socketId);
      this.playerSocketMapping.delete(playerId);
      
      // 設定會話超時
      this.setSessionTimeout(playerId);
      
      console.log(`👋 Player disconnected: ${player.name} (${playerId})`);
      
      return {
        success: true,
        playerId: playerId,
        player: this.getPlayerPublicInfo(player)
      };
    } catch (error) {
      console.error('Error disconnecting player:', error);
      return {
        success: false,
        error: ErrorCode.UNKNOWN_ERROR,
        message: error.message
      };
    }
  }

  /**
   * 根據 Socket ID 獲取玩家
   */
  getPlayerBySocketId(socketId) {
    const playerId = this.socketPlayerMapping.get(socketId);
    return playerId ? this.players.get(playerId) : null;
  }

  /**
   * 獲取玩家
   */
  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  /**
   * 獲取玩家公開資訊
   */
  getPlayerPublicInfo(player) {
    if (!player) return null;
    
    return {
      id: player.id,
      name: player.name,
      avatar: player.avatar,
      status: player.status,
      gamesPlayed: player.gamesPlayed,
      gamesWon: player.gamesWon,
      isGuest: player.isGuest,
      currentRoomId: player.currentRoomId,
      currentGameId: player.currentGameId,
      lastActiveAt: player.lastActiveAt
    };
  }

  /**
   * 更新玩家狀態
   */
  updatePlayerStatus(playerId, status) {
    const player = this.players.get(playerId);
    if (!player) {
      return { success: false, error: ErrorCode.PLAYER_NOT_FOUND };
    }
    
    player.status = status;
    player.lastActiveAt = new Date();
    
    return { success: true, player: this.getPlayerPublicInfo(player) };
  }

  /**
   * 更新玩家房間
   */
  updatePlayerRoom(playerId, roomId) {
    const player = this.players.get(playerId);
    if (!player) {
      return { success: false, error: ErrorCode.PLAYER_NOT_FOUND };
    }
    
    player.currentRoomId = roomId;
    player.status = roomId ? PlayerStatus.IN_LOBBY : PlayerStatus.ONLINE;
    player.lastActiveAt = new Date();
    
    return { success: true, player: this.getPlayerPublicInfo(player) };
  }

  /**
   * 更新玩家遊戲
   */
  updatePlayerGame(playerId, gameId) {
    const player = this.players.get(playerId);
    if (!player) {
      return { success: false, error: ErrorCode.PLAYER_NOT_FOUND };
    }
    
    player.currentGameId = gameId;
    player.status = gameId ? PlayerStatus.IN_GAME : PlayerStatus.IN_LOBBY;
    player.lastActiveAt = new Date();
    
    return { success: true, player: this.getPlayerPublicInfo(player) };
  }

  /**
   * 更新玩家統計
   */
  updatePlayerStats(playerId, stats) {
    const player = this.players.get(playerId);
    if (!player) {
      return { success: false, error: ErrorCode.PLAYER_NOT_FOUND };
    }
    
    if (stats.gameCompleted) {
      player.gamesPlayed++;
    }
    
    if (stats.gameWon) {
      player.gamesWon++;
    }
    
    if (stats.playTime) {
      player.totalPlayTime += stats.playTime;
    }
    
    return { success: true, player: this.getPlayerPublicInfo(player) };
  }

  /**
   * 獲取線上玩家列表
   */
  getOnlinePlayers() {
    return Array.from(this.players.values())
      .filter(player => player.status === PlayerStatus.ONLINE)
      .map(player => this.getPlayerPublicInfo(player));
  }

  /**
   * 獲取活躍玩家數量
   */
  getActivePlayersCount() {
    return Array.from(this.players.values())
      .filter(player => player.status !== PlayerStatus.OFFLINE).length;
  }

  /**
   * 獲取玩家的 Socket ID
   */
  getPlayerSocketId(playerId) {
    return this.playerSocketMapping.get(playerId);
  }

  /**
   * 檢查玩家是否在線
   */
  isPlayerOnline(playerId) {
    const player = this.players.get(playerId);
    return player && player.status !== PlayerStatus.OFFLINE;
  }

  /**
   * 搜尋玩家
   */
  searchPlayers(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    this.players.forEach(player => {
      if (player.name.toLowerCase().includes(lowerQuery) || 
          (player.email && player.email.toLowerCase().includes(lowerQuery))) {
        results.push(this.getPlayerPublicInfo(player));
      }
    });
    
    return results;
  }

  /**
   * 設定會話超時
   */
  setSessionTimeout(playerId) {
    // 清除現有的超時
    this.clearSessionTimeout(playerId);
    
    // 設定新的超時
    const timeoutId = setTimeout(() => {
      this.handleSessionTimeout(playerId);
    }, this.sessionTimeout);
    
    this.sessionTimeouts.set(playerId, timeoutId);
  }

  /**
   * 清除會話超時
   */
  clearSessionTimeout(playerId) {
    const timeoutId = this.sessionTimeouts.get(playerId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.sessionTimeouts.delete(playerId);
    }
  }

  /**
   * 處理會話超時
   */
  handleSessionTimeout(playerId) {
    const player = this.players.get(playerId);
    if (player && player.status === PlayerStatus.DISCONNECTED) {
      console.log(`⏰ Player session expired: ${player.name} (${playerId})`);
      
      // 將玩家設為離線
      player.status = PlayerStatus.OFFLINE;
      
      // 如果是訪客，清除玩家資料
      if (player.isGuest) {
        this.players.delete(playerId);
        console.log(`🗑️ Guest player removed: ${player.name} (${playerId})`);
      }
    }
    
    this.sessionTimeouts.delete(playerId);
  }

  /**
   * 清理過期會話
   */
  cleanupExpiredSessions() {
    const now = new Date();
    const expiredPlayers = [];
    
    this.players.forEach((player, playerId) => {
      if (player.status === PlayerStatus.OFFLINE) {
        const timeSinceActive = now - new Date(player.lastActiveAt);
        
        // 訪客玩家 1 小時後清理，註冊玩家 24 小時後清理
        const cleanupTime = player.isGuest ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        
        if (timeSinceActive > cleanupTime) {
          expiredPlayers.push(playerId);
        }
      }
    });
    
    expiredPlayers.forEach(playerId => {
      const player = this.players.get(playerId);
      console.log(`🧹 Cleaning up expired player: ${player.name} (${playerId})`);
      this.players.delete(playerId);
    });
    
    return expiredPlayers.length;
  }

  /**
   * 定期清理任務
   */
  startCleanupTask() {
    setInterval(() => {
      const cleanedCount = this.cleanupExpiredSessions();
      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanedCount} expired players`);
      }
    }, 30 * 60 * 1000); // 每30分鐘清理一次
  }

  /**
   * 獲取伺服器統計
   */
  getServerStats() {
    const playersByStatus = {};
    Object.values(PlayerStatus).forEach(status => {
      playersByStatus[status] = 0;
    });
    
    this.players.forEach(player => {
      playersByStatus[player.status]++;
    });
    
    return {
      totalPlayers: this.players.size,
      playersByStatus,
      activeSessions: this.sessionTimeouts.size,
      guestPlayers: Array.from(this.players.values()).filter(p => p.isGuest).length,
      registeredPlayers: Array.from(this.players.values()).filter(p => !p.isGuest).length
    };
  }

  /**
   * 驗證玩家名稱
   */
  validatePlayerName(name) {
    if (!name || typeof name !== 'string') {
      return { valid: false, error: 'Player name is required' };
    }
    
    if (name.length < 2 || name.length > 20) {
      return { valid: false, error: 'Player name must be between 2 and 20 characters' };
    }
    
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(name)) {
      return { valid: false, error: 'Player name contains invalid characters' };
    }
    
    // 檢查名稱是否已被使用
    const isNameTaken = Array.from(this.players.values())
      .some(player => player.name.toLowerCase() === name.toLowerCase());
    
    if (isNameTaken) {
      return { valid: false, error: 'Player name is already taken' };
    }
    
    return { valid: true };
  }

  /**
   * 獲取所有玩家（僅供管理使用）
   */
  getAllPlayers() {
    return Array.from(this.players.values()).map(player => this.getPlayerPublicInfo(player));
  }
}

module.exports = PlayerManager;
/**
 * 房間管理器 - 負責遊戲房間的創建、管理、玩家加入/退出
 */

const { v4: uuidv4 } = require('uuid');
const { RoomStatus, GameSettings, ErrorCode } = require('../../../shared/constants/GameConstants');

class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomId -> Room
    this.playerRoomMapping = new Map(); // playerId -> roomId
    this.roomStats = new Map(); // roomId -> RoomStats
    
    console.log('🏠 RoomManager initialized');
  }

  /**
   * 創建新房間
   */
  createRoom(hostPlayer, roomSettings = {}) {
    const roomId = uuidv4();
    const room = {
      id: roomId,
      name: roomSettings.name || `${hostPlayer.name}'s Room`,
      hostId: hostPlayer.id,
      status: RoomStatus.WAITING,
      players: [hostPlayer.id],
      playerDetails: new Map([[hostPlayer.id, {
        id: hostPlayer.id,
        name: hostPlayer.name,
        avatar: hostPlayer.avatar,
        isReady: false,
        isHost: true,
        joinedAt: new Date()
      }]]),
      settings: {
        maxPlayers: roomSettings.maxPlayers || GameSettings.MAX_PLAYERS,
        minPlayers: roomSettings.minPlayers || GameSettings.MIN_PLAYERS,
        gameTimeLimit: roomSettings.gameTimeLimit || GameSettings.DEFAULT_GAME_TIME_LIMIT,
        turnTimeLimit: roomSettings.turnTimeLimit || GameSettings.DEFAULT_TURN_TIME_LIMIT,
        startingMoney: roomSettings.startingMoney || GameSettings.DEFAULT_STARTING_MONEY,
        salary: roomSettings.salary || GameSettings.DEFAULT_SALARY,
        isPrivate: roomSettings.isPrivate || false,
        password: roomSettings.password || null,
        allowSpectators: roomSettings.allowSpectators || true,
        autoStart: roomSettings.autoStart || false
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      gameId: null,
      spectators: [],
      chat: [],
      metadata: {
        totalPlayersJoined: 1,
        gamesPlayed: 0,
        avgGameDuration: 0
      }
    };
    
    this.rooms.set(roomId, room);
    this.playerRoomMapping.set(hostPlayer.id, roomId);
    
    console.log(`🏠 Room created: ${room.name} (${roomId}) by ${hostPlayer.name}`);
    
    return {
      success: true,
      room: this.getRoomPublicInfo(room)
    };
  }

  /**
   * 獲取房間
   */
  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  /**
   * 獲取房間公開資訊
   */
  getRoomPublicInfo(room) {
    if (!room) return null;
    
    return {
      id: room.id,
      name: room.name,
      hostId: room.hostId,
      status: room.status,
      playerCount: room.players.length,
      maxPlayers: room.settings.maxPlayers,
      minPlayers: room.settings.minPlayers,
      players: Array.from(room.playerDetails.values()),
      settings: {
        ...room.settings,
        password: room.settings.password ? '****' : null // 隱藏密碼
      },
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      gameId: room.gameId,
      spectatorCount: room.spectators.length,
      isPrivate: room.settings.isPrivate,
      hasPassword: !!room.settings.password
    };
  }

  /**
   * 玩家加入房間
   */
  async joinRoom(roomId, player, password = null) {
    try {
      const room = this.rooms.get(roomId);
      if (!room) {
        return { success: false, error: ErrorCode.ROOM_NOT_FOUND };
      }
      
      // 檢查玩家是否已在其他房間
      const currentRoomId = this.playerRoomMapping.get(player.id);
      if (currentRoomId && currentRoomId !== roomId) {
        return { success: false, error: ErrorCode.PLAYER_ALREADY_IN_GAME };
      }
      
      // 檢查玩家是否已在此房間
      if (room.players.includes(player.id)) {
        return { success: false, error: ErrorCode.PLAYER_ALREADY_IN_GAME };
      }
      
      // 檢查房間狀態
      if (room.status === RoomStatus.CLOSED) {
        return { success: false, error: ErrorCode.ROOM_CLOSED };
      }
      
      if (room.status === RoomStatus.IN_GAME) {
        // 如果允許觀眾，可以作為觀眾加入
        if (room.settings.allowSpectators) {
          return this.joinAsSpectator(roomId, player);
        } else {
          return { success: false, error: ErrorCode.ROOM_CLOSED };
        }
      }
      
      // 檢查房間是否已滿
      if (room.players.length >= room.settings.maxPlayers) {
        return { success: false, error: ErrorCode.ROOM_FULL };
      }
      
      // 檢查密碼
      if (room.settings.password && password !== room.settings.password) {
        return { success: false, error: ErrorCode.UNAUTHORIZED };
      }
      
      // 加入房間
      room.players.push(player.id);
      room.playerDetails.set(player.id, {
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        isReady: false,
        isHost: false,
        joinedAt: new Date()
      });
      
      room.updatedAt = new Date();
      room.metadata.totalPlayersJoined++;
      
      // 更新房間狀態
      if (room.players.length >= room.settings.maxPlayers) {
        room.status = RoomStatus.FULL;
      }
      
      // 更新玩家房間映射
      this.playerRoomMapping.set(player.id, roomId);
      
      console.log(`👥 Player joined room: ${player.name} -> ${room.name} (${roomId})`);
      
      return {
        success: true,
        room: this.getRoomPublicInfo(room)
      };
      
    } catch (error) {
      console.error('Error joining room:', error);
      return {
        success: false,
        error: ErrorCode.UNKNOWN_ERROR,
        message: error.message
      };
    }
  }

  /**
   * 玩家離開房間
   */
  async leaveRoom(playerId) {
    try {
      const roomId = this.playerRoomMapping.get(playerId);
      if (!roomId) {
        return { success: false, error: ErrorCode.PLAYER_NOT_IN_GAME };
      }
      
      const room = this.rooms.get(roomId);
      if (!room) {
        return { success: false, error: ErrorCode.ROOM_NOT_FOUND };
      }
      
      // 從房間中移除玩家
      room.players = room.players.filter(id => id !== playerId);
      room.playerDetails.delete(playerId);
      room.updatedAt = new Date();
      
      // 清除玩家房間映射
      this.playerRoomMapping.delete(playerId);
      
      console.log(`👋 Player left room: ${playerId} from ${room.name} (${roomId})`);
      
      // 如果是房主離開，轉移房主權限
      if (room.hostId === playerId && room.players.length > 0) {
        const newHostId = room.players[0];
        room.hostId = newHostId;
        const newHostDetails = room.playerDetails.get(newHostId);
        if (newHostDetails) {
          newHostDetails.isHost = true;
        }
        console.log(`👑 Host transferred to: ${newHostId} in room ${roomId}`);
      }
      
      // 更新房間狀態
      if (room.players.length === 0) {
        // 房間沒有玩家時關閉
        room.status = RoomStatus.CLOSED;
        console.log(`🏠 Room closed: ${room.name} (${roomId})`);
        
        // 延遲刪除房間（給其他服務時間處理）
        setTimeout(() => {
          this.deleteRoom(roomId);
        }, 5000);
      } else {
        // 更新房間狀態
        room.status = RoomStatus.WAITING;
      }
      
      return {
        success: true,
        room: this.getRoomPublicInfo(room),
        newHostId: room.hostId !== playerId ? room.hostId : null
      };
      
    } catch (error) {
      console.error('Error leaving room:', error);
      return {
        success: false,
        error: ErrorCode.UNKNOWN_ERROR,
        message: error.message
      };
    }
  }

  /**
   * 作為觀眾加入
   */
  async joinAsSpectator(roomId, player) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { success: false, error: ErrorCode.ROOM_NOT_FOUND };
    }
    
    if (!room.settings.allowSpectators) {
      return { success: false, error: ErrorCode.FORBIDDEN };
    }
    
    if (room.spectators.includes(player.id)) {
      return { success: false, error: ErrorCode.PLAYER_ALREADY_IN_GAME };
    }
    
    room.spectators.push(player.id);
    room.updatedAt = new Date();
    
    console.log(`👁️ Spectator joined: ${player.name} in room ${roomId}`);
    
    return {
      success: true,
      room: this.getRoomPublicInfo(room),
      isSpectator: true
    };
  }

  /**
   * 設置玩家準備狀態
   */
  setPlayerReady(playerId, isReady) {
    const roomId = this.playerRoomMapping.get(playerId);
    if (!roomId) {
      return { success: false, error: ErrorCode.PLAYER_NOT_IN_GAME };
    }
    
    const room = this.rooms.get(roomId);
    if (!room) {
      return { success: false, error: ErrorCode.ROOM_NOT_FOUND };
    }
    
    const playerDetails = room.playerDetails.get(playerId);
    if (!playerDetails) {
      return { success: false, error: ErrorCode.PLAYER_NOT_FOUND };
    }
    
    playerDetails.isReady = isReady;
    room.updatedAt = new Date();
    
    return {
      success: true,
      room: this.getRoomPublicInfo(room),
      allReady: this.areAllPlayersReady(room)
    };
  }

  /**
   * 檢查所有玩家是否準備完成
   */
  areAllPlayersReady(room) {
    if (room.players.length < room.settings.minPlayers) {
      return false;
    }
    
    return room.players.every(playerId => {
      const playerDetails = room.playerDetails.get(playerId);
      return playerDetails && playerDetails.isReady;
    });
  }

  /**
   * 更新房間設置
   */
  updateRoomSettings(roomId, hostId, newSettings) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { success: false, error: ErrorCode.ROOM_NOT_FOUND };
    }
    
    if (room.hostId !== hostId) {
      return { success: false, error: ErrorCode.FORBIDDEN };
    }
    
    if (room.status !== RoomStatus.WAITING) {
      return { success: false, error: ErrorCode.GAME_ALREADY_STARTED };
    }
    
    // 更新設置
    room.settings = {
      ...room.settings,
      ...newSettings
    };
    
    room.updatedAt = new Date();
    
    return {
      success: true,
      room: this.getRoomPublicInfo(room)
    };
  }

  /**
   * 開始遊戲
   */
  startGame(roomId, hostId, gameId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { success: false, error: ErrorCode.ROOM_NOT_FOUND };
    }
    
    if (room.hostId !== hostId) {
      return { success: false, error: ErrorCode.FORBIDDEN };
    }
    
    if (room.status !== RoomStatus.WAITING && room.status !== RoomStatus.FULL) {
      return { success: false, error: ErrorCode.GAME_ALREADY_STARTED };
    }
    
    if (room.players.length < room.settings.minPlayers) {
      return { success: false, error: ErrorCode.VALIDATION_ERROR };
    }
    
    if (!this.areAllPlayersReady(room)) {
      return { success: false, error: ErrorCode.ACTION_NOT_ALLOWED };
    }
    
    room.status = RoomStatus.IN_GAME;
    room.gameId = gameId;
    room.updatedAt = new Date();
    room.metadata.gamesPlayed++;
    
    console.log(`🎮 Game started in room: ${room.name} (${roomId})`);
    
    return {
      success: true,
      room: this.getRoomPublicInfo(room)
    };
  }

  /**
   * 結束遊戲
   */
  endGame(roomId, gameStats = {}) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { success: false, error: ErrorCode.ROOM_NOT_FOUND };
    }
    
    room.status = RoomStatus.WAITING;
    room.gameId = null;
    room.updatedAt = new Date();
    
    // 重置玩家準備狀態
    room.playerDetails.forEach(playerDetails => {
      playerDetails.isReady = false;
    });
    
    // 更新遊戲統計
    if (gameStats.duration) {
      const currentAvg = room.metadata.avgGameDuration;
      const gameCount = room.metadata.gamesPlayed;
      room.metadata.avgGameDuration = ((currentAvg * (gameCount - 1)) + gameStats.duration) / gameCount;
    }
    
    console.log(`🏁 Game ended in room: ${room.name} (${roomId})`);
    
    return {
      success: true,
      room: this.getRoomPublicInfo(room)
    };
  }

  /**
   * 獲取玩家所在房間
   */
  getPlayerRoom(playerId) {
    const roomId = this.playerRoomMapping.get(playerId);
    return roomId ? this.rooms.get(roomId) : null;
  }

  /**
   * 獲取所有公開房間
   */
  getPublicRooms() {
    return Array.from(this.rooms.values())
      .filter(room => !room.settings.isPrivate && room.status !== RoomStatus.CLOSED)
      .map(room => this.getRoomPublicInfo(room));
  }

  /**
   * 搜尋房間
   */
  searchRooms(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    this.rooms.forEach(room => {
      if (!room.settings.isPrivate && room.status !== RoomStatus.CLOSED) {
        if (room.name.toLowerCase().includes(lowerQuery)) {
          results.push(this.getRoomPublicInfo(room));
        }
      }
    });
    
    return results;
  }

  /**
   * 獲取活躍房間數量
   */
  getActiveRoomsCount() {
    return Array.from(this.rooms.values())
      .filter(room => room.status !== RoomStatus.CLOSED).length;
  }

  /**
   * 刪除房間
   */
  deleteRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { success: false, error: ErrorCode.ROOM_NOT_FOUND };
    }
    
    // 清除所有玩家的房間映射
    room.players.forEach(playerId => {
      this.playerRoomMapping.delete(playerId);
    });
    
    // 保存房間統計
    this.roomStats.set(roomId, {
      ...room.metadata,
      totalDuration: new Date() - room.createdAt,
      finalPlayerCount: room.players.length,
      deletedAt: new Date()
    });
    
    // 刪除房間
    this.rooms.delete(roomId);
    
    console.log(`🗑️ Room deleted: ${room.name} (${roomId})`);
    
    return { success: true };
  }

  /**
   * 清理關閉的房間
   */
  cleanupClosedRooms() {
    const now = new Date();
    const closedRooms = [];
    
    this.rooms.forEach((room, roomId) => {
      if (room.status === RoomStatus.CLOSED) {
        const timeSinceClosed = now - room.updatedAt;
        // 5分鐘後刪除關閉的房間
        if (timeSinceClosed > 5 * 60 * 1000) {
          closedRooms.push(roomId);
        }
      }
    });
    
    closedRooms.forEach(roomId => {
      this.deleteRoom(roomId);
    });
    
    return closedRooms.length;
  }

  /**
   * 定期清理任務
   */
  startCleanupTask() {
    setInterval(() => {
      const cleanedCount = this.cleanupClosedRooms();
      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanedCount} closed rooms`);
      }
    }, 15 * 60 * 1000); // 每15分鐘清理一次
  }

  /**
   * 獲取房間統計
   */
  getRoomStats(roomId) {
    return this.roomStats.get(roomId);
  }

  /**
   * 獲取伺服器統計
   */
  getServerStats() {
    const roomsByStatus = {};
    Object.values(RoomStatus).forEach(status => {
      roomsByStatus[status] = 0;
    });
    
    this.rooms.forEach(room => {
      roomsByStatus[room.status]++;
    });
    
    return {
      totalRooms: this.rooms.size,
      roomsByStatus,
      totalPlayersInRooms: this.playerRoomMapping.size,
      avgPlayersPerRoom: this.rooms.size > 0 ? this.playerRoomMapping.size / this.rooms.size : 0
    };
  }
}

module.exports = RoomManager;
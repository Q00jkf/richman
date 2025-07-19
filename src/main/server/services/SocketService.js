/**
 * Socket 服務 - 處理 WebSocket 連接、事件路由、實時通信
 */

const { SocketEvents, ErrorCode, MessageType } = require('../../shared/constants/GameConstants');

class SocketService {
  constructor(io, services) {
    this.io = io;
    this.gameManager = services.gameManager;
    this.playerManager = services.playerManager;
    this.roomManager = services.roomManager;
    
    // 活躍連接管理
    this.activeConnections = new Map(); // socketId -> connectionInfo
    this.playerSockets = new Map(); // playerId -> socketId
    
    // 設置 GameManager 事件監聽器
    this.setupGameManagerListeners();
    
    console.log('📡 SocketService initialized');
  }

  /**
   * 設置 GameManager 事件監聽器
   */
  setupGameManagerListeners() {
    const { GameEventType } = require('../../shared/constants/GameConstants');
    
    // 遊戲開始事件
    this.gameManager.on(GameEventType.GAME_STARTED, (data) => {
      console.log('🎮 Broadcasting game started event:', data);
      this.io.to(data.roomId).emit('game_started', {
        success: true,
        gameId: data.gameId,
        gameState: this.gameManager.getGameState(data.gameId),
        players: data.players,
        startTime: data.startTime
      });
    });

    // 回合開始事件
    this.gameManager.on(GameEventType.TURN_STARTED, (data) => {
      console.log('🎯 Broadcasting turn started event:', data);
      this.io.to(data.roomId || this.getRoomIdByGameId(data.gameId)).emit('turn_started', {
        playerId: data.playerId,
        playerName: data.playerName,
        roundNumber: data.roundNumber,
        gameId: data.gameId
      });
    });

    // 擲骰子事件
    this.gameManager.on(GameEventType.DICE_ROLLED, (data) => {
      console.log('🎲 Broadcasting dice rolled event:', data);
      this.io.to(data.roomId || this.getRoomIdByGameId(data.gameId)).emit('dice_rolled', {
        playerId: data.playerId,
        diceResult: data.diceResult,
        gameId: data.gameId
      });
    });

    // 玩家移動事件
    this.gameManager.on(GameEventType.PLAYER_MOVED, (data) => {
      console.log('🚶 Broadcasting player moved event:', data);
      this.io.to(data.roomId || this.getRoomIdByGameId(data.gameId)).emit('player_moved', {
        playerId: data.playerId,
        oldPosition: data.oldPosition,
        newPosition: data.newPosition,
        gameId: data.gameId
      });
    });

    // 地產購買事件
    this.gameManager.on(GameEventType.PROPERTY_BOUGHT, (data) => {
      console.log('🏠 Broadcasting property bought event:', data);
      this.io.to(data.roomId || this.getRoomIdByGameId(data.gameId)).emit('property_bought', {
        playerId: data.playerId,
        propertyId: data.propertyId,
        price: data.price,
        gameId: data.gameId
      });
    });

    // 租金支付事件
    this.gameManager.on(GameEventType.RENT_PAID, (data) => {
      console.log('💰 Broadcasting rent paid event:', data);
      this.io.to(data.roomId || this.getRoomIdByGameId(data.gameId)).emit('rent_paid', {
        payerId: data.payerId,
        receiverId: data.receiverId,
        amount: data.amount,
        propertyId: data.propertyId,
        gameId: data.gameId
      });
    });

    // 遊戲結束事件
    this.gameManager.on(GameEventType.GAME_ENDED, (data) => {
      console.log('🏆 Broadcasting game ended event:', data);
      this.io.to(data.roomId || this.getRoomIdByGameId(data.gameId)).emit('game_ended', {
        gameId: data.gameId,
        winnerId: data.winnerId,
        winnerName: data.winnerName,
        endReason: data.endReason,
        endTime: data.endTime
      });
    });

    console.log('✅ GameManager event listeners setup completed');
  }

  /**
   * 根據遊戲ID獲取房間ID
   */
  getRoomIdByGameId(gameId) {
    const game = this.gameManager.getGame(gameId);
    return game ? game.roomId : null;
  }

  /**
   * 處理新的 Socket 連接
   */
  handleConnection(socket) {
    console.log(`🔌 New socket connection: ${socket.id}`);
    
    // 儲存連接資訊
    this.activeConnections.set(socket.id, {
      socketId: socket.id,
      connectedAt: new Date(),
      playerId: null,
      roomId: null,
      isAuthenticated: false
    });
    
    // 註冊事件處理器
    this.registerSocketEvents(socket);
    
    // 發送歡迎訊息
    socket.emit(SocketEvents.NOTIFICATION, {
      type: MessageType.SYSTEM,
      message: 'Connected to RichMan server',
      timestamp: new Date()
    });
  }

  /**
   * 處理 Socket 斷線
   */
  async handleDisconnection(socket) {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
    
    const connectionInfo = this.activeConnections.get(socket.id);
    if (connectionInfo && connectionInfo.playerId) {
      // 通知玩家管理器處理斷線
      await this.playerManager.disconnectPlayer(socket.id);
      
      // 從房間中移除玩家（如果在房間中）
      if (connectionInfo.roomId) {
        await this.handlePlayerLeaveRoom(socket, connectionInfo.playerId);
      }
      
      // 清除映射
      this.playerSockets.delete(connectionInfo.playerId);
    }
    
    // 清除連接資訊
    this.activeConnections.delete(socket.id);
  }

  /**
   * 註冊 Socket 事件處理器
   */
  registerSocketEvents(socket) {
    // 玩家認證
    socket.on('authenticate', (data) => this.handleAuthentication(socket, data));
    
    // 房間相關事件
    socket.on(SocketEvents.JOIN_ROOM, (data) => this.handlePlayerJoinRoom(socket, data));
    socket.on(SocketEvents.LEAVE_ROOM, (data) => this.handlePlayerLeaveRoom(socket, data.playerId));
    socket.on('create_room', (data) => this.handleCreateRoom(socket, data));
    socket.on('get_rooms', (data) => this.handleGetRooms(socket, data));
    socket.on('set_ready', (data) => this.handleSetReady(socket, data));
    socket.on('update_room_settings', (data) => this.handleUpdateRoomSettings(socket, data));
    
    // 遊戲相關事件
    socket.on('start_game', (data) => this.handleStartGame(socket, data));
    socket.on(SocketEvents.PLAYER_ACTION, (data) => this.handleGameAction(socket, data));
    socket.on('game_action', (data) => this.handleGameAction(socket, data)); // 兼容前端
    socket.on('get_game_state', (data) => this.handleGetGameState(socket, data));
    
    // 聊天相關事件
    socket.on('send_message', (data) => this.handleSendMessage(socket, data));
    
    // 系統相關事件
    socket.on('ping', (data) => this.handlePing(socket, data));
    socket.on('get_online_players', (data) => this.handleGetOnlinePlayers(socket, data));
    
    // 錯誤處理
    socket.on('error', (error) => {
      console.error(`Socket error from ${socket.id}:`, error);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    });
  }

  /**
   * 處理玩家認證
   */
  async handleAuthentication(socket, data) {
    try {
      const result = await this.playerManager.connectPlayer(socket.id, data);
      
      if (result.success) {
        // 更新連接資訊
        const connectionInfo = this.activeConnections.get(socket.id);
        if (connectionInfo) {
          connectionInfo.playerId = result.player.id;
          connectionInfo.isAuthenticated = true;
        }
        
        // 建立玩家-Socket映射
        this.playerSockets.set(result.player.id, socket.id);
        
        // 發送認證成功
        socket.emit('authenticated', {
          success: true,
          player: result.player
        });
        
        console.log(`✅ Player authenticated: ${result.player.name} (${result.player.id})`);
      } else {
        socket.emit('authenticated', {
          success: false,
          error: result.error,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    }
  }

  /**
   * 處理創建房間
   */
  async handleCreateRoom(socket, data) {
    try {
      const player = this.playerManager.getPlayerBySocketId(socket.id);
      if (!player) {
        return this.sendError(socket, ErrorCode.UNAUTHORIZED, 'Player not authenticated');
      }
      
      const result = this.roomManager.createRoom(player, data.settings);
      
      if (result.success) {
        // 加入房間
        await this.joinSocketRoom(socket, result.room.id);
        
        // 更新玩家狀態
        this.playerManager.updatePlayerRoom(player.id, result.room.id);
        
        // 更新連接資訊
        const connectionInfo = this.activeConnections.get(socket.id);
        if (connectionInfo) {
          connectionInfo.roomId = result.room.id;
        }
        
        socket.emit('room_created', {
          success: true,
          room: result.room
        });
        
        // 廣播房間列表更新
        this.broadcastRoomListUpdate();
        
      } else {
        socket.emit('room_created', {
          success: false,
          error: result.error,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Create room error:', error);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    }
  }

  /**
   * 處理玩家加入房間
   */
  async handlePlayerJoinRoom(socket, data) {
    try {
      const player = this.playerManager.getPlayerBySocketId(socket.id);
      if (!player) {
        return this.sendError(socket, ErrorCode.UNAUTHORIZED, 'Player not authenticated');
      }
      
      const result = await this.roomManager.joinRoom(data.roomId, player, data.password);
      
      if (result.success) {
        // 加入 Socket 房間
        await this.joinSocketRoom(socket, data.roomId);
        
        // 更新玩家狀態
        this.playerManager.updatePlayerRoom(player.id, data.roomId);
        
        // 更新連接資訊
        const connectionInfo = this.activeConnections.get(socket.id);
        if (connectionInfo) {
          connectionInfo.roomId = data.roomId;
        }
        
        socket.emit('room_joined', {
          success: true,
          room: result.room,
          isSpectator: result.isSpectator || false
        });
        
        // 通知房間其他玩家
        socket.to(data.roomId).emit(SocketEvents.ROOM_UPDATED, {
          room: result.room,
          event: 'player_joined',
          player: this.playerManager.getPlayerPublicInfo(player)
        });
        
        // 廣播房間列表更新
        this.broadcastRoomListUpdate();
        
      } else {
        socket.emit('room_joined', {
          success: false,
          error: result.error,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Join room error:', error);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    }
  }

  /**
   * 處理玩家離開房間
   */
  async handlePlayerLeaveRoom(socket, playerId) {
    try {
      const player = playerId ? this.playerManager.getPlayer(playerId) : 
                              this.playerManager.getPlayerBySocketId(socket.id);
      
      if (!player) {
        return this.sendError(socket, ErrorCode.UNAUTHORIZED, 'Player not authenticated');
      }
      
      const result = await this.roomManager.leaveRoom(player.id);
      
      if (result.success) {
        // 離開 Socket 房間
        if (result.room) {
          socket.leave(result.room.id);
          
          // 通知房間其他玩家
          socket.to(result.room.id).emit(SocketEvents.ROOM_UPDATED, {
            room: result.room,
            event: 'player_left',
            player: this.playerManager.getPlayerPublicInfo(player),
            newHostId: result.newHostId
          });
        }
        
        // 更新玩家狀態
        this.playerManager.updatePlayerRoom(player.id, null);
        
        // 更新連接資訊
        const connectionInfo = this.activeConnections.get(socket.id);
        if (connectionInfo) {
          connectionInfo.roomId = null;
        }
        
        socket.emit('room_left', {
          success: true,
          room: result.room
        });
        
        // 廣播房間列表更新
        this.broadcastRoomListUpdate();
        
      } else {
        socket.emit('room_left', {
          success: false,
          error: result.error,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Leave room error:', error);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    }
  }

  /**
   * 處理設置準備狀態
   */
  handleSetReady(socket, data) {
    try {
      const player = this.playerManager.getPlayerBySocketId(socket.id);
      if (!player) {
        return this.sendError(socket, ErrorCode.UNAUTHORIZED, 'Player not authenticated');
      }
      
      const result = this.roomManager.setPlayerReady(player.id, data.isReady);
      
      if (result.success) {
        socket.emit('ready_set', {
          success: true,
          isReady: data.isReady,
          allReady: result.allReady
        });
        
        // 通知房間其他玩家
        socket.to(result.room.id).emit(SocketEvents.ROOM_UPDATED, {
          room: result.room,
          event: 'player_ready_changed',
          player: this.playerManager.getPlayerPublicInfo(player),
          isReady: data.isReady,
          allReady: result.allReady
        });
      } else {
        socket.emit('ready_set', {
          success: false,
          error: result.error,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Set ready error:', error);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    }
  }

  /**
   * 處理開始遊戲
   */
  async handleStartGame(socket, data) {
    try {
      console.log('🎮 Start game request received:', data);
      
      const player = this.playerManager.getPlayerBySocketId(socket.id);
      if (!player) {
        console.log('❌ Player not authenticated for socket:', socket.id);
        return this.sendError(socket, ErrorCode.UNAUTHORIZED, 'Player not authenticated');
      }
      console.log('✅ Player found:', player.id, player.name);
      
      const room = this.roomManager.getPlayerRoom(player.id);
      if (!room) {
        console.log('❌ Player not in room:', player.id);
        return this.sendError(socket, ErrorCode.ROOM_NOT_FOUND, 'Player not in room');
      }
      console.log('✅ Room found:', room.id, 'with', room.players.length, 'players');
      
      // 創建遊戲
      console.log('🎮 Creating game...');
      const game = this.gameManager.createGame(room.id, room.settings);
      console.log('✅ Game created:', game.gameId);
      
      // 將房間玩家加入遊戲
      console.log('👥 Adding players to game...');
      for (const playerId of room.players) {
        const roomPlayer = this.playerManager.getPlayer(playerId);
        if (roomPlayer) {
          console.log('➕ Adding player to game:', roomPlayer.id, roomPlayer.name);
          await this.gameManager.joinGame(game.gameId, roomPlayer);
        }
      }
      console.log('✅ All players added to game');
      
      // 開始遊戲
      console.log('🚀 Starting game...');
      const result = await this.gameManager.startGame(game.gameId, player.id);
      console.log('📊 Start game result:', result);
      
      if (result.success) {
        // 更新房間狀態
        this.roomManager.startGame(room.id, player.id, game.gameId);
        
        // 更新玩家狀態
        room.players.forEach(playerId => {
          this.playerManager.updatePlayerGame(playerId, game.gameId);
        });
        
        // 通知房間所有玩家
        console.log('📡 Emitting game_started event to room:', room.id);
        this.io.to(room.id).emit('game_started', {
          success: true,
          gameId: game.gameId,
          gameState: this.gameManager.getGameState(game.gameId)
        });
        
      } else {
        console.log('❌ Game start failed:', result);
        socket.emit('game_started', {
          success: false,
          error: result.error,
          message: result.message
        });
      }
    } catch (error) {
      console.error('❌ Start game error:', error);
      console.error('❌ Error stack:', error.stack);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    }
  }

  /**
   * 處理遊戲動作
   */
  async handleGameAction(socket, data) {
    try {
      console.log('🎮 Received game action:', data);
      
      const player = this.playerManager.getPlayerBySocketId(socket.id);
      if (!player) {
        return this.sendError(socket, ErrorCode.UNAUTHORIZED, 'Player not authenticated');
      }
      
      // 處理不同的數據格式 (兼容性)
      const action = data.action || data;
      console.log('🎮 Processing action:', action, 'for player:', player.id);
      
      const result = await this.gameManager.handlePlayerAction(player.id, action);
      
      if (result.success) {
        const game = this.gameManager.getGameByPlayer(player.id);
        if (game) {
          // 廣播遊戲狀態更新
          this.io.to(game.roomId).emit(SocketEvents.GAME_STATE_UPDATE, {
            gameState: game.getGameState(),
            action: data.action,
            playerId: player.id
          });
        }
      }
      
      socket.emit('game_action_result', result);
      
    } catch (error) {
      console.error('Game action error:', error);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    }
  }

  /**
   * 處理獲取房間列表
   */
  handleGetRooms(socket, data) {
    try {
      const rooms = data.search ? 
        this.roomManager.searchRooms(data.search) : 
        this.roomManager.getPublicRooms();
      
      socket.emit('rooms_list', {
        success: true,
        rooms: rooms
      });
    } catch (error) {
      console.error('Get rooms error:', error);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    }
  }

  /**
   * 處理獲取遊戲狀態
   */
  handleGetGameState(socket, data) {
    try {
      const player = this.playerManager.getPlayerBySocketId(socket.id);
      if (!player) {
        return this.sendError(socket, ErrorCode.UNAUTHORIZED, 'Player not authenticated');
      }
      
      const game = this.gameManager.getGameByPlayer(player.id);
      if (!game) {
        return this.sendError(socket, ErrorCode.GAME_NOT_FOUND, 'Player not in game');
      }
      
      socket.emit('game_state', {
        success: true,
        gameState: game.getGameState()
      });
    } catch (error) {
      console.error('Get game state error:', error);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    }
  }

  /**
   * 處理發送訊息
   */
  handleSendMessage(socket, data) {
    try {
      const player = this.playerManager.getPlayerBySocketId(socket.id);
      if (!player) {
        return this.sendError(socket, ErrorCode.UNAUTHORIZED, 'Player not authenticated');
      }
      
      const connectionInfo = this.activeConnections.get(socket.id);
      if (!connectionInfo.roomId) {
        return this.sendError(socket, ErrorCode.ROOM_NOT_FOUND, 'Player not in room');
      }
      
      const message = {
        id: Date.now().toString(),
        playerId: player.id,
        playerName: player.name,
        message: data.message,
        timestamp: new Date(),
        type: MessageType.CHAT
      };
      
      // 廣播訊息到房間
      this.io.to(connectionInfo.roomId).emit(SocketEvents.PLAYER_MESSAGE, message);
      
    } catch (error) {
      console.error('Send message error:', error);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    }
  }

  /**
   * 處理 Ping
   */
  handlePing(socket, data) {
    socket.emit('pong', {
      timestamp: new Date(),
      serverTime: Date.now()
    });
  }

  /**
   * 處理獲取線上玩家
   */
  handleGetOnlinePlayers(socket, data) {
    try {
      const players = this.playerManager.getOnlinePlayers();
      socket.emit('online_players', {
        success: true,
        players: players,
        count: players.length
      });
    } catch (error) {
      console.error('Get online players error:', error);
      this.sendError(socket, ErrorCode.UNKNOWN_ERROR, error.message);
    }
  }

  /**
   * 加入 Socket 房間
   */
  async joinSocketRoom(socket, roomId) {
    socket.join(roomId);
    console.log(`🏠 Socket ${socket.id} joined room ${roomId}`);
  }

  /**
   * 廣播房間列表更新
   */
  broadcastRoomListUpdate() {
    const rooms = this.roomManager.getPublicRooms();
    this.io.emit('rooms_updated', {
      rooms: rooms,
      timestamp: new Date()
    });
  }

  /**
   * 發送錯誤訊息
   */
  sendError(socket, errorCode, message) {
    socket.emit(SocketEvents.ERROR, {
      error: errorCode,
      message: message,
      timestamp: new Date()
    });
  }

  /**
   * 發送通知
   */
  sendNotification(socket, message, type = MessageType.INFO) {
    socket.emit(SocketEvents.NOTIFICATION, {
      type: type,
      message: message,
      timestamp: new Date()
    });
  }

  /**
   * 廣播通知到房間
   */
  broadcastToRoom(roomId, event, data) {
    this.io.to(roomId).emit(event, {
      ...data,
      timestamp: new Date()
    });
  }

  /**
   * 發送私人訊息給玩家
   */
  sendToPlayer(playerId, event, data) {
    const socketId = this.playerSockets.get(playerId);
    if (socketId) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit(event, {
          ...data,
          timestamp: new Date()
        });
      }
    }
  }

  /**
   * 獲取連接統計
   */
  getConnectionStats() {
    return {
      activeConnections: this.activeConnections.size,
      authenticatedPlayers: Array.from(this.activeConnections.values())
        .filter(conn => conn.isAuthenticated).length,
      playersInRooms: Array.from(this.activeConnections.values())
        .filter(conn => conn.roomId).length
    };
  }
}

module.exports = SocketService;
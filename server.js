/**
 * RichMan 雲端版伺服器 (Render 部署專用)
 * 最小化版本 - 支援基本 WebSocket 連接和多人遊戲功能
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

class RichManRenderServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: false
      }
    });
    
    this.port = process.env.PORT || 5000;
    this.players = new Map(); // 簡單的玩家存儲
    this.games = new Map();   // 簡單的遊戲存儲
    this.rooms = new Map();   // 房間存儲
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeSocketHandlers();
  }

  initializeMiddleware() {
    // 基礎中間件
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // 提供靜態檔案 (public 資料夾)
    this.app.use(express.static(path.join(__dirname, 'public')));
    
    // 請求日誌
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  initializeRoutes() {
    // 健康檢查 (Render 會用到)
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        activePlayers: this.players.size,
        activeGames: this.games.size,
        version: '1.0.0-render'
      });
    });
    
    // API 路由
    this.app.get('/api/status', (req, res) => {
      res.json({
        server: 'RichMan Render',
        players: this.players.size,
        games: this.games.size,
        uptime: process.uptime()
      });
    });
    
    // 主頁面 (所有路由都返回 index.html，支援 SPA)
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  }

  initializeSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🎮 玩家連線: ${socket.id}`);
      
      // 玩家認證/創建
      socket.on('authenticate', (data) => {
        const player = {
          id: socket.id,
          name: data.name || `玩家${Math.floor(Math.random() * 1000)}`,
          avatar: data.avatar || 'default',
          money: 1500,
          position: 0,
          properties: [],
          skillCards: [],
          joinTime: new Date().toISOString(),
          isOnline: true
        };
        
        this.players.set(socket.id, player);
        console.log(`👤 玩家創建: ${player.name} (${socket.id})`);
        
        socket.emit('authenticated', {
          success: true,
          player: player,
          message: `歡迎 ${player.name}！`
        });
      });
      
      // 創建房間
      socket.on('create_room', (data) => {
        if (!this.players.has(socket.id)) {
          socket.emit('room_created', { 
            success: false, 
            message: '請先創建玩家' 
          });
          return;
        }
        
        // 檢查玩家是否已經在其他房間中
        const playerCurrentRoom = this.findPlayerRoom(socket.id);
        if (playerCurrentRoom) {
          socket.emit('room_created', { 
            success: false, 
            message: `您已經在房間「${playerCurrentRoom.name}」中，請先離開再創建新房間` 
          });
          return;
        }
        
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const room = {
          id: roomId,
          name: data.name || '新房間',
          host: socket.id,
          players: [socket.id],
          maxPlayers: data.maxPlayers || 4,
          status: 'waiting',
          gameState: null,
          settings: data.settings || { startingMoney: 1500 },
          createdAt: new Date().toISOString()
        };
        
        this.rooms.set(roomId, room);
        socket.join(roomId);
        
        console.log(`🏠 房間創建: ${roomId} by ${this.players.get(socket.id)?.name}`);
        socket.emit('room_created', {
          success: true,
          room: room,
          message: `房間 ${room.name} 創建成功`
        });
        
        this.broadcastRoomList();
      });
      
      // 加入房間
      socket.on('join_room', (data) => {
        if (!this.players.has(socket.id)) {
          socket.emit('room_joined', { 
            success: false, 
            message: '請先創建玩家' 
          });
          return;
        }
        
        const room = this.rooms.get(data.roomId);
        if (!room) {
          socket.emit('room_joined', { 
            success: false, 
            message: '房間不存在' 
          });
          return;
        }
        
        // 檢查玩家是否已經在房間中
        if (room.players.includes(socket.id)) {
          socket.emit('room_joined', { 
            success: false, 
            message: '您已經在這個房間中了' 
          });
          return;
        }
        
        if (room.players.length >= room.maxPlayers) {
          socket.emit('room_joined', { 
            success: false, 
            message: '房間已滿' 
          });
          return;
        }
        
        if (room.status !== 'waiting') {
          socket.emit('room_joined', { 
            success: false, 
            message: '遊戲已開始，無法加入' 
          });
          return;
        }
        
        // 檢查玩家是否已經在其他房間中
        const playerCurrentRoom = this.findPlayerRoom(socket.id);
        if (playerCurrentRoom) {
          socket.emit('room_joined', { 
            success: false, 
            message: `您已經在房間「${playerCurrentRoom.name}」中，請先離開再加入新房間` 
          });
          return;
        }
        
        room.players.push(socket.id);
        socket.join(data.roomId);
        
        console.log(`🚪 玩家加入房間: ${this.players.get(socket.id)?.name} → ${room.name}`);
        socket.emit('room_joined', {
          success: true,
          room: room,
          message: `成功加入房間 ${room.name}`
        });
        
        // 通知房間內其他玩家
        socket.to(data.roomId).emit('notification', {
          message: `${this.players.get(socket.id)?.name} 加入了房間`
        });
        
        this.broadcastRoomList();
      });
      
      // 離開房間
      socket.on('leave_room', () => {
        const room = this.findPlayerRoom(socket.id);
        if (!room) {
          socket.emit('error', { message: '您不在任何房間中' });
          return;
        }
        
        // 從房間中移除玩家
        room.players = room.players.filter(id => id !== socket.id);
        socket.leave(room.id);
        
        const playerName = this.players.get(socket.id)?.name;
        console.log(`🚪 玩家離開房間: ${playerName} ← ${room.name}`);
        
        // 通知房間內其他玩家
        socket.to(room.id).emit('notification', {
          message: `${playerName} 離開了房間`
        });
        
        // 如果房間空了，刪除房間
        if (room.players.length === 0) {
          this.rooms.delete(room.id);
          this.games.delete(room.id);
          console.log(`🗑️ 空房間刪除: ${room.id}`);
        } else if (room.host === socket.id) {
          // 如果房主離開，轉移房主權限給第一個玩家
          room.host = room.players[0];
          console.log(`👑 房主轉移: ${this.players.get(room.host)?.name} 成為新房主`);
          this.io.to(room.id).emit('notification', {
            message: `${this.players.get(room.host)?.name} 成為新房主`
          });
        }
        
        socket.emit('room_left', {
          success: true,
          message: `已離開房間 ${room.name}`
        });
        
        this.broadcastRoomList();
      });
      
      // 開始遊戲
      socket.on('start_game', (data) => {
        const room = this.rooms.get(data.roomId);
        if (!room) {
          socket.emit('error', { message: '房間不存在' });
          return;
        }
        
        if (room.host !== socket.id) {
          socket.emit('error', { message: '只有房主可以開始遊戲' });
          return;
        }
        
        if (room.players.length < 2) {
          socket.emit('error', { message: '至少需要2名玩家' });
          return;
        }
        
        // 初始化遊戲狀態
        const gameState = {
          roomId: data.roomId,
          gamePhase: 'playing',
          currentPlayerIndex: 0,
          roundNumber: 1,
          startTime: new Date().toISOString(),
          players: room.players.map(playerId => {
            const player = this.players.get(playerId);
            return {
              id: player.id,
              name: player.name,
              money: room.settings.startingMoney || 1500,
              position: 0,
              properties: [],
              skillCards: [],
              isOnline: true
            };
          })
        };
        
        room.status = 'playing';
        room.gameState = gameState;
        this.games.set(data.roomId, gameState);
        
        console.log(`🎮 遊戲開始: ${room.name} (${room.players.length}人)`);
        
        // 通知房間內所有玩家
        this.io.to(data.roomId).emit('game_started', {
          success: true,
          gameState: gameState,
          message: '遊戲開始！'
        });
        
        // 開始第一個玩家的回合
        this.startPlayerTurn(data.roomId, 0);
        this.broadcastRoomList();
      });
      
      // 遊戲動作
      socket.on('game_action', (data) => {
        this.handleGameAction(socket, data);
      });
      
      // 獲取遊戲狀態
      socket.on('get_game_state', () => {
        const player = this.players.get(socket.id);
        if (!player) return;
        
        // 找到玩家所在的遊戲
        for (const [roomId, gameState] of this.games.entries()) {
          if (gameState.players && gameState.players.some(p => p.id === socket.id)) {
            socket.emit('game_state', {
              success: true,
              gameState: gameState
            });
            return;
          }
        }
      });
      
      // 獲取房間列表
      socket.on('get_rooms', () => {
        this.sendRoomList(socket);
      });
      
      // Ping/Pong 測試
      socket.on('ping', (data) => {
        socket.emit('pong', {
          timestamp: data.timestamp,
          serverTime: Date.now()
        });
      });
      
      // 玩家離線
      socket.on('disconnect', () => {
        const player = this.players.get(socket.id);
        if (player) {
          console.log(`❌ 玩家離線: ${player.name} (${socket.id})`);
          player.isOnline = false;
          
          // 通知其他玩家
          socket.broadcast.emit('player:left', {
            playerId: socket.id,
            playerName: player.name
          });
        }
        
        // 清理空房間
        for (const [roomId, room] of this.rooms.entries()) {
          if (room.players.includes(socket.id)) {
            room.players = room.players.filter(id => id !== socket.id);
            if (room.players.length === 0) {
              this.rooms.delete(roomId);
              this.games.delete(roomId);
              console.log(`🗑️ 空房間刪除: ${roomId}`);
            }
          }
        }
        
        this.broadcastRoomList();
      });
    });
  }
  
  // 遊戲邏輯處理
  handleGameAction(socket, data) {
    const gameState = this.findPlayerGame(socket.id);
    if (!gameState) {
      socket.emit('error', { message: '您不在任何遊戲中' });
      return;
    }
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.id !== socket.id) {
      socket.emit('error', { message: '還沒輪到您' });
      return;
    }
    
    switch (data.type) {
      case 'ROLL_DICE':
        this.handleRollDice(socket, gameState);
        break;
      case 'END_TURN':
        this.handleEndTurn(socket, gameState);
        break;
      default:
        socket.emit('error', { message: '未知的遊戲動作' });
    }
  }
  
  // 擲骰子
  handleRollDice(socket, gameState) {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const oldPosition = currentPlayer.position;
    const newPosition = (oldPosition + total) % 40; // 假設40格棋盤
    
    currentPlayer.position = newPosition;
    
    console.log(`🎲 ${currentPlayer.name} 擲骰: ${dice1}+${dice2}=${total}, 位置: ${oldPosition}→${newPosition}`);
    
    // 通知所有玩家
    this.io.to(gameState.roomId).emit('dice_rolled', {
      playerId: socket.id,
      playerName: currentPlayer.name,
      diceResult: { dice1, dice2, total },
      oldPosition,
      newPosition
    });
    
    this.io.to(gameState.roomId).emit('player_moved', {
      playerId: socket.id,
      playerName: currentPlayer.name,
      oldPosition,
      newPosition,
      diceTotal: total
    });
    
    // 更新遊戲狀態
    this.updateGameState(gameState);
  }
  
  // 結束回合
  handleEndTurn(socket, gameState) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    console.log(`⏭️ ${currentPlayer.name} 結束回合`);
    
    // 切換到下一個玩家
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    // 如果回到第一個玩家，增加回合數
    if (gameState.currentPlayerIndex === 0) {
      gameState.roundNumber++;
    }
    
    this.updateGameState(gameState);
    this.startPlayerTurn(gameState.roomId, gameState.currentPlayerIndex);
  }
  
  // 開始玩家回合
  startPlayerTurn(roomId, playerIndex) {
    const gameState = this.games.get(roomId);
    if (!gameState) return;
    
    const currentPlayer = gameState.players[playerIndex];
    console.log(`🎯 開始回合: ${currentPlayer.name} (回合 ${gameState.roundNumber})`);
    
    this.io.to(roomId).emit('turn_started', {
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      playerIndex: playerIndex,
      roundNumber: gameState.roundNumber,
      gameState: gameState
    });
  }
  
  // 更新遊戲狀態
  updateGameState(gameState) {
    this.io.to(gameState.roomId).emit('game_state', {
      success: true,
      gameState: gameState
    });
  }
  
  // 尋找玩家所在的遊戲
  findPlayerGame(playerId) {
    for (const gameState of this.games.values()) {
      if (gameState.players && gameState.players.some(p => p.id === playerId)) {
        return gameState;
      }
    }
    return null;
  }
  
  // 尋找玩家所在的房間
  findPlayerRoom(playerId) {
    for (const room of this.rooms.values()) {
      if (room.players.includes(playerId)) {
        return room;
      }
    }
    return null;
  }
  
  // 發送房間列表
  sendRoomList(socket) {
    const roomsList = Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      playerCount: room.players.length,
      maxPlayers: room.maxPlayers,
      status: room.status,
      host: this.players.get(room.host)?.name || '未知'
    }));
    
    socket.emit('rooms_list', {
      success: true,
      rooms: roomsList
    });
  }
  
  // 廣播房間列表更新
  broadcastRoomList() {
    const roomsList = Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      playerCount: room.players.length,
      maxPlayers: room.maxPlayers,
      status: room.status,
      host: this.players.get(room.host)?.name || '未知'
    }));
    
    this.io.emit('rooms_updated', {
      success: true,
      rooms: roomsList
    });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`🚀 RichMan Render Server 啟動成功！`);
      console.log(`📍 Port: ${this.port}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⚡ Server ready for connections!`);
      console.log(`🔗 Local: http://localhost:${this.port}`);
    });
  }

  stop() {
    this.server.close(() => {
      console.log('🛑 RichMan Render Server 已停止');
    });
  }
}

// 錯誤處理
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// 優雅關閉
const server = new RichManRenderServer();

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.stop();
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.stop();
});

// 啟動服務器
server.start();

module.exports = RichManRenderServer;
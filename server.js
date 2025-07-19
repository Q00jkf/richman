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
      
      // 玩家加入
      socket.on('player:join', (data) => {
        const player = {
          id: socket.id,
          name: data.name || `玩家${Math.floor(Math.random() * 1000)}`,
          avatar: data.avatar || 'default',
          joinTime: new Date().toISOString(),
          ...data
        };
        
        this.players.set(socket.id, player);
        console.log(`👤 玩家加入: ${player.name} (${socket.id})`);
        
        // 通知所有玩家
        this.io.emit('player:joined', player);
        
        // 發送歡迎訊息
        socket.emit('game:welcome', {
          message: `歡迎 ${player.name}！`,
          playerId: socket.id,
          totalPlayers: this.players.size
        });
      });
      
      // 獲取玩家列表
      socket.on('game:getPlayers', () => {
        const playerList = Array.from(this.players.values());
        socket.emit('game:players', playerList);
      });
      
      // Ping/Pong 測試
      socket.on('ping', (data) => {
        socket.emit('pong', {
          timestamp: data.timestamp,
          serverTime: Date.now()
        });
      });
      
      // 聊天訊息
      socket.on('chat:message', (data) => {
        const player = this.players.get(socket.id);
        if (player) {
          const message = {
            playerId: socket.id,
            playerName: player.name,
            message: data.message,
            timestamp: Date.now()
          };
          
          console.log(`💬 聊天: ${player.name}: ${data.message}`);
          this.io.emit('chat:message', message);
        }
      });
      
      // 遊戲基本功能
      socket.on('game:createRoom', (data) => {
        const roomId = `room_${Date.now()}`;
        const room = {
          id: roomId,
          name: data.name || '新遊戲',
          host: socket.id,
          players: [socket.id],
          maxPlayers: data.maxPlayers || 4,
          status: 'waiting',
          createdAt: new Date().toISOString()
        };
        
        this.games.set(roomId, room);
        socket.join(roomId);
        
        console.log(`🏠 房間創建: ${roomId} by ${this.players.get(socket.id)?.name}`);
        socket.emit('game:roomCreated', room);
      });
      
      // 玩家離線
      socket.on('disconnect', () => {
        const player = this.players.get(socket.id);
        if (player) {
          console.log(`❌ 玩家離線: ${player.name} (${socket.id})`);
          this.players.delete(socket.id);
          
          // 通知其他玩家
          socket.broadcast.emit('player:left', {
            playerId: socket.id,
            playerName: player.name
          });
        }
        
        // 清理房間
        for (const [roomId, room] of this.games.entries()) {
          if (room.players.includes(socket.id)) {
            room.players = room.players.filter(id => id !== socket.id);
            if (room.players.length === 0) {
              this.games.delete(roomId);
              console.log(`🗑️ 空房間刪除: ${roomId}`);
            }
          }
        }
      });
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
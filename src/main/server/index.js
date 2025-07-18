/**
 * RichMan 主服務器
 * 線上多人大富翁遊戲後端服務
 */

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const GameManager = require('./services/GameManager');
const PlayerManager = require('./services/PlayerManager');
const RoomManager = require('./services/RoomManager');
const SocketService = require('./services/SocketService');

class RichManServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIO(this.server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    
    this.port = process.env.PORT || 5000;
    this.gameManager = new GameManager();
    this.playerManager = new PlayerManager();
    this.roomManager = new RoomManager();
    this.socketService = new SocketService(this.io, {
      gameManager: this.gameManager,
      playerManager: this.playerManager,
      roomManager: this.roomManager
    });
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeSocketHandlers();
  }

  initializeMiddleware() {
    // 基礎中間件
    this.app.use(cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true
    }));
    
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // 靜態檔案服務
    this.app.use(express.static(path.join(__dirname, '../client/build')));
    
    // 請求日誌
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  initializeRoutes() {
    // 注入服務依賴到應用程序
    this.app.set('gameManager', this.gameManager);
    this.app.set('playerManager', this.playerManager);
    this.app.set('roomManager', this.roomManager);
    this.app.set('socketService', this.socketService);
    
    // API 路由
    this.app.use('/api/games', require('./routes/games'));
    this.app.use('/api/players', require('./routes/players'));
    this.app.use('/api/rooms', require('./routes/rooms'));
    
    // 健康檢查
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        activeGames: this.gameManager.getActiveGamesCount(),
        activePlayers: this.playerManager.getActivePlayersCount(),
        activeRooms: this.roomManager.getActiveRoomsCount()
      });
    });
    
    // 前端路由 (React Router)
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
  }

  initializeSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      // 將 socket 交給 SocketService 處理
      this.socketService.handleConnection(socket);
      
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.socketService.handleDisconnection(socket);
      });
    });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`🚀 RichMan Server running on port ${this.port}`);
      console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
      console.log(`🎮 Game Manager initialized`);
      console.log(`👥 Player Manager initialized`);
      console.log(`🏠 Room Manager initialized`);
      console.log(`📡 Socket Service initialized`);
      console.log(`⚡ Server ready for connections!`);
    });
  }

  stop() {
    this.server.close(() => {
      console.log('🛑 RichMan Server stopped');
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
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.stop();
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.stop();
});

// 啟動服務器
const server = new RichManServer();
server.start();

module.exports = RichManServer;
/**
 * RichMan API Server - Entry Point
 * 
 * Express.js server with FFT Card Probability System
 * Deployed on Render for production use
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const GameService = require('./services/game-service');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Initialize services
const gameService = new GameService();

// 房間管理系統
class SimpleRoomManager {
    constructor() {
        this.rooms = new Map();
        this.players = new Map();
        console.log('🏠 Room Manager initialized');
    }

    createRoom(hostPlayer, roomSettings = {}) {
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const room = {
            id: roomId,
            name: roomSettings.name || `${hostPlayer.name}的房間`,
            hostId: hostPlayer.id,
            players: [hostPlayer.id],
            playerDetails: new Map([[hostPlayer.id, {
                id: hostPlayer.id,
                name: hostPlayer.name,
                avatar: hostPlayer.avatar || 'default',
                isReady: false,
                isHost: true,
                joinedAt: new Date()
            }]]),
            maxPlayers: roomSettings.maxPlayers || 4,
            status: 'waiting',
            settings: {
                startingMoney: roomSettings.startingMoney || 1500,
                maxPlayers: roomSettings.maxPlayers || 4,
                isPrivate: roomSettings.isPrivate || false,
                password: roomSettings.password || null
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.rooms.set(roomId, room);
        console.log(`✅ 房間創建: ${room.name} (${roomId}) by ${hostPlayer.name}`);
        return { success: true, room: this.getRoomPublicInfo(room) };
    }

    getRoomPublicInfo(room) {
        if (!room) return null;
        return {
            id: room.id,
            name: room.name,
            hostId: room.hostId,
            status: room.status,
            playerCount: room.players.length,
            maxPlayers: room.settings.maxPlayers,
            players: room.players.map(playerId => {
                const player = this.players.get(playerId);
                const details = room.playerDetails?.get(playerId);
                return {
                    id: playerId,
                    name: player?.name || details?.name || '未知',
                    avatar: player?.avatar || details?.avatar || 'default',
                    isReady: details?.isReady || false,
                    isHost: details?.isHost || (playerId === room.hostId),
                    joinedAt: details?.joinedAt || new Date()
                };
            }),
            settings: {
                ...room.settings,
                password: room.settings?.password ? '****' : null
            },
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
            isPrivate: room.settings?.isPrivate || false,
            hasPassword: !!(room.settings?.password)
        };
    }

    getPublicRooms() {
        return Array.from(this.rooms.values())
            .filter(room => !room.settings?.isPrivate && room.status === 'waiting')
            .map(room => this.getRoomPublicInfo(room));
    }

    joinRoom(roomId, player, password = null) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return { success: false, error: 'ROOM_NOT_FOUND', message: '房間不存在' };
        }

        if (room.players.includes(player.id)) {
            return { success: false, error: 'ALREADY_IN_ROOM', message: '您已經在這個房間中了' };
        }

        if (room.players.length >= room.settings.maxPlayers) {
            return { success: false, error: 'ROOM_FULL', message: '房間已滿' };
        }

        if (room.settings.password && password !== room.settings.password) {
            return { success: false, error: 'WRONG_PASSWORD', message: '密碼錯誤' };
        }

        room.players.push(player.id);
        room.playerDetails.set(player.id, {
            id: player.id,
            name: player.name,
            avatar: player.avatar || 'default',
            isReady: false,
            isHost: false,
            joinedAt: new Date()
        });
        room.updatedAt = new Date().toISOString();

        console.log(`✅ 玩家加入房間: ${player.name} → ${room.name}`);
        return { success: true, room: this.getRoomPublicInfo(room) };
    }

    leaveRoom(playerId) {
        let targetRoom = null;
        for (const room of this.rooms.values()) {
            if (room.players.includes(playerId)) {
                targetRoom = room;
                break;
            }
        }

        if (!targetRoom) {
            return { success: false, error: 'NOT_IN_ROOM', message: '您不在任何房間中' };
        }

        targetRoom.players = targetRoom.players.filter(id => id !== playerId);
        targetRoom.playerDetails.delete(playerId);
        targetRoom.updatedAt = new Date().toISOString();

        const player = this.players.get(playerId);
        console.log(`✅ 玩家離開房間: ${player?.name || playerId} ← ${targetRoom.name}`);

        // 如果房間空了，刪除房間
        if (targetRoom.players.length === 0) {
            this.rooms.delete(targetRoom.id);
            console.log(`🗑️ 空房間刪除: ${targetRoom.id}`);
            return { success: true, room: null };
        }

        // 如果房主離開，轉移房主權限
        if (targetRoom.hostId === playerId) {
            const newHostId = targetRoom.players[0];
            targetRoom.hostId = newHostId;
            if (targetRoom.playerDetails.has(newHostId)) {
                targetRoom.playerDetails.get(newHostId).isHost = true;
            }
            console.log(`👑 房主轉移: ${newHostId} 成為新房主`);
        }

        return { success: true, room: this.getRoomPublicInfo(targetRoom) };
    }

    findPlayerRoom(playerId) {
        for (const room of this.rooms.values()) {
            if (room.players.includes(playerId)) {
                return room;
            }
        }
        return null;
    }

    createPlayer(socketId, data) {
        const player = {
            id: socketId,
            name: data.name || `玩家${Math.floor(Math.random() * 1000)}`,
            avatar: data.avatar || 'default',
            socketId: socketId,
            isOnline: true,
            joinTime: new Date().toISOString()
        };
        this.players.set(socketId, player);
        return player;
    }

    getPlayer(playerId) {
        return this.players.get(playerId);
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
    }
}

const roomManager = new SimpleRoomManager();

// Middleware
app.use(cors());
app.use(express.json());

// 靜態文件服務 - 提供前端HTML頁面
app.use(express.static(path.join(__dirname, '../../../public')));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    next();
});

// =============== API Routes ===============

// 前端應用路由 - 主頁面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/index.html'));
});

// API服務信息端點
app.get('/api', (req, res) => {
    res.json({
        service: 'RichMan FFT Card Probability API',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        features: [
            'FFT Card Probability System',
            'Multi-background Player Support', 
            'Real-time Game Management',
            'Statistical Analysis'
        ]
    });
});

app.get('/health', (req, res) => {
    const stats = gameService.getSystemStats();
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        activeGames: stats.totalGames,
        timestamp: new Date().toISOString()
    });
});

// =============== Game Management ===============

/**
 * POST /api/game/start
 * Create a new game with FFT probability calculation
 */
app.post('/api/game/start', (req, res) => {
    try {
        const { playerBackground = 'balanced', playerId } = req.body;
        
        // Validate background type
        const validBackgrounds = ['conservative', 'balanced', 'aggressive'];
        if (!validBackgrounds.includes(playerBackground)) {
            return res.status(400).json({
                error: 'Invalid player background',
                validOptions: validBackgrounds
            });
        }
        
        // Create new game
        const game = gameService.createGame(playerBackground, playerId);
        
        res.status(201).json({
            success: true,
            message: 'Game created successfully',
            data: game
        });
        
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({
            error: 'Failed to create game',
            details: error.message
        });
    }
});

/**
 * GET /api/game/:gameId/state
 * Get current game state
 */
app.get('/api/game/:gameId/state', (req, res) => {
    try {
        const { gameId } = req.params;
        const game = gameService.getGame(gameId);
        
        if (!game) {
            return res.status(404).json({
                error: 'Game not found',
                gameId: gameId
            });
        }
        
        res.json({
            success: true,
            data: {
                gameId: game.id,
                playerBackground: game.playerBackground,
                status: game.status,
                currentTurn: game.currentTurn,
                createdAt: game.createdAt,
                selectedCards: game.selectedCards,
                positionAssignments: game.positionAssignments,
                gameHistory: game.gameHistory
            }
        });
        
    } catch (error) {
        console.error('Error getting game state:', error);
        res.status(500).json({
            error: 'Failed to get game state',
            details: error.message
        });
    }
});

/**
 * POST /api/game/:gameId/roll
 * Simulate dice roll and get corresponding card
 */
app.post('/api/game/:gameId/roll', (req, res) => {
    try {
        const { gameId } = req.params;
        const { diceResult } = req.body; // Optional for testing
        
        // Validate dice result if provided
        if (diceResult && (diceResult < 2 || diceResult > 12)) {
            return res.status(400).json({
                error: 'Invalid dice result',
                message: 'Dice result must be between 2 and 12'
            });
        }
        
        const rollResult = gameService.rollDice(gameId, diceResult);
        
        res.json({
            success: true,
            message: 'Dice rolled successfully',
            data: rollResult
        });
        
    } catch (error) {
        console.error('Error rolling dice:', error);
        const status = error.message.includes('not found') ? 404 : 500;
        res.status(status).json({
            error: 'Failed to roll dice',
            details: error.message
        });
    }
});

// =============== Card Analysis ===============

/**
 * GET /api/cards/:cardId/probability
 * Get detailed probability analysis for a specific card
 */
app.get('/api/cards/:cardId/probability', (req, res) => {
    try {
        const { cardId } = req.params;
        const { background = 'balanced' } = req.query;
        
        const analysis = gameService.getCardProbabilityAnalysis(cardId, background);
        
        res.json({
            success: true,
            data: analysis
        });
        
    } catch (error) {
        console.error('Error analyzing card probability:', error);
        const status = error.message.includes('not found') ? 404 : 500;
        res.status(status).json({
            error: 'Failed to analyze card probability',
            details: error.message
        });
    }
});

/**
 * GET /api/cards/list
 * Get list of all available cards
 */
app.get('/api/cards/list', (req, res) => {
    try {
        const { TestCards } = require('../shared/constants/cards');
        
        const cardList = Object.values(TestCards).map(card => ({
            id: card.id,
            name: card.name,
            nameEn: card.nameEn,
            type: card.type,
            category: card.category,
            description: card.description,
            baseDistribution: card.baseDistribution
        }));
        
        res.json({
            success: true,
            totalCards: cardList.length,
            data: cardList
        });
        
    } catch (error) {
        console.error('Error getting card list:', error);
        res.status(500).json({
            error: 'Failed to get card list',
            details: error.message
        });
    }
});

/**
 * POST /api/cards/simulate
 * Simulate card probability distributions for testing
 */
app.post('/api/cards/simulate', (req, res) => {
    try {
        const { cardIds, backgrounds = ['conservative', 'balanced', 'aggressive'] } = req.body;
        
        if (!cardIds || !Array.isArray(cardIds)) {
            return res.status(400).json({
                error: 'cardIds must be an array'
            });
        }
        
        const simulations = {};
        
        cardIds.forEach(cardId => {
            simulations[cardId] = {};
            backgrounds.forEach(background => {
                try {
                    simulations[cardId][background] = gameService.getCardProbabilityAnalysis(cardId, background);
                } catch (error) {
                    simulations[cardId][background] = { error: error.message };
                }
            });
        });
        
        res.json({
            success: true,
            data: simulations
        });
        
    } catch (error) {
        console.error('Error simulating card probabilities:', error);
        res.status(500).json({
            error: 'Failed to simulate card probabilities',
            details: error.message
        });
    }
});

// =============== Room Management ===============

/**
 * GET /api/rooms
 * Get list of available public rooms
 */
app.get('/api/rooms', (req, res) => {
    try {
        const rooms = roomManager.getPublicRooms();
        
        res.json({
            success: true,
            totalRooms: rooms.length,
            data: rooms
        });
        
    } catch (error) {
        console.error('Error getting rooms:', error);
        res.status(500).json({
            error: 'Failed to get rooms',
            details: error.message
        });
    }
});

// =============== Analytics ===============

/**
 * GET /api/analytics/system
 * Get system statistics and health metrics
 */
app.get('/api/analytics/system', (req, res) => {
    try {
        const stats = gameService.getSystemStats();
        
        res.json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Error getting system analytics:', error);
        res.status(500).json({
            error: 'Failed to get system analytics',
            details: error.message
        });
    }
});

// =============== Error Handling ===============

// SPA路由處理 - 所有非API路由都返回index.html
app.get('*', (req, res) => {
    // 如果是API請求，返回404 JSON
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            error: 'API endpoint not found',
            path: req.path,
            method: req.method,
            availableEndpoints: [
                'GET /api',
                'GET /health',
                'POST /api/game/start',
                'GET /api/game/:gameId/state',
                'POST /api/game/:gameId/roll',
                'GET /api/cards/:cardId/probability',
                'GET /api/cards/list',
                'POST /api/cards/simulate',
                'GET /api/analytics/system',
                'GET /api/rooms'
            ]
        });
    }
    
    // 所有其他路由都返回前端HTML頁面
    res.sendFile(path.join(__dirname, '../../../public/index.html'));
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// =============== Socket.IO 事件處理 ===============

// Socket.IO事件處理 - 完整房間管理系統
io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    // Ping-Pong測試
    socket.on('ping', (data) => {
        socket.emit('pong', { timestamp: data.timestamp });
    });
    
    // 玩家認證
    socket.on('authenticate', (data) => {
        try {
            const player = roomManager.createPlayer(socket.id, data);
            console.log(`✅ 玩家認證成功: ${player.name} (${player.id})`);
            
            socket.emit('authenticated', {
                success: true,
                player: {
                    id: player.id,
                    name: player.name,
                    avatar: player.avatar,
                    joinTime: player.joinTime
                }
            });
        } catch (error) {
            console.error('Authentication error:', error);
            socket.emit('authenticated', {
                success: false,
                error: 'AUTHENTICATION_FAILED',
                message: '認證失敗'
            });
        }
    });
    
    // 創建房間
    socket.on('create_room', (data) => {
        try {
            const player = roomManager.getPlayer(socket.id);
            if (!player) {
                socket.emit('room_created', {
                    success: false,
                    error: 'PLAYER_NOT_FOUND',
                    message: '請先進行玩家認證'
                });
                return;
            }
            
            const result = roomManager.createRoom(player, {
                name: data.name || `${player.name}的房間`,
                maxPlayers: data.maxPlayers || 4,
                isPrivate: data.isPrivate || false,
                password: data.password || null,
                startingMoney: data.startingMoney || 1500
            });
            
            if (result.success) {
                socket.join(result.room.id);
                socket.emit('room_created', {
                    success: true,
                    room: result.room
                });
                
                // 廣播房間列表更新
                io.emit('rooms_updated', {
                    rooms: roomManager.getPublicRooms()
                });
                
                console.log(`✅ 房間創建成功: ${result.room.name} (${result.room.id})`);
            } else {
                socket.emit('room_created', result);
            }
        } catch (error) {
            console.error('Create room error:', error);
            socket.emit('room_created', {
                success: false,
                error: 'ROOM_CREATION_FAILED',
                message: '房間創建失敗'
            });
        }
    });
    
    // 獲取房間列表
    socket.on('get_rooms', () => {
        try {
            const rooms = roomManager.getPublicRooms();
            socket.emit('rooms_list', {
                success: true,
                rooms: rooms
            });
            console.log(`📋 房間列表請求: 返回 ${rooms.length} 個房間`);
        } catch (error) {
            console.error('Get rooms error:', error);
            socket.emit('rooms_list', {
                success: false,
                error: 'ROOMS_FETCH_FAILED',
                message: '獲取房間列表失敗',
                rooms: []
            });
        }
    });
    
    // 加入房間
    socket.on('join_room', (data) => {
        try {
            const { roomId, password } = data;
            const player = roomManager.getPlayer(socket.id);
            
            if (!player) {
                socket.emit('room_joined', {
                    success: false,
                    error: 'PLAYER_NOT_FOUND',
                    message: '請先進行玩家認證'
                });
                return;
            }
            
            const result = roomManager.joinRoom(roomId, player, password);
            
            if (result.success) {
                socket.join(roomId);
                socket.emit('room_joined', {
                    success: true,
                    room: result.room
                });
                
                // 通知房間內其他玩家
                socket.to(roomId).emit('player_joined', {
                    player: {
                        id: player.id,
                        name: player.name,
                        avatar: player.avatar
                    },
                    room: result.room
                });
                
                // 廣播房間列表更新
                io.emit('rooms_updated', {
                    rooms: roomManager.getPublicRooms()
                });
                
                console.log(`✅ 玩家加入房間: ${player.name} → ${result.room.name}`);
            } else {
                socket.emit('room_joined', result);
            }
        } catch (error) {
            console.error('Join room error:', error);
            socket.emit('room_joined', {
                success: false,
                error: 'ROOM_JOIN_FAILED',
                message: '加入房間失敗'
            });
        }
    });
    
    // 離開房間
    socket.on('leave_room', () => {
        try {
            const player = roomManager.getPlayer(socket.id);
            if (!player) return;
            
            const currentRoom = roomManager.findPlayerRoom(socket.id);
            if (!currentRoom) {
                socket.emit('room_left', {
                    success: false,
                    error: 'NOT_IN_ROOM',
                    message: '您不在任何房間中'
                });
                return;
            }
            
            const result = roomManager.leaveRoom(socket.id);
            
            if (result.success) {
                socket.leave(currentRoom.id);
                socket.emit('room_left', {
                    success: true,
                    room: result.room
                });
                
                // 通知房間內其他玩家
                socket.to(currentRoom.id).emit('player_left', {
                    player: {
                        id: player.id,
                        name: player.name
                    },
                    room: result.room
                });
                
                // 廣播房間列表更新
                io.emit('rooms_updated', {
                    rooms: roomManager.getPublicRooms()
                });
                
                console.log(`✅ 玩家離開房間: ${player.name} ← ${currentRoom.name}`);
            } else {
                socket.emit('room_left', result);
            }
        } catch (error) {
            console.error('Leave room error:', error);
            socket.emit('room_left', {
                success: false,
                error: 'ROOM_LEAVE_FAILED',
                message: '離開房間失敗'
            });
        }
    });
    
    // 玩家斷線處理
    socket.on('disconnect', (reason) => {
        console.log(`❌ Client disconnected: ${socket.id}, reason: ${reason}`);
        
        try {
            const player = roomManager.getPlayer(socket.id);
            if (player) {
                const currentRoom = roomManager.findPlayerRoom(socket.id);
                if (currentRoom) {
                    const result = roomManager.leaveRoom(socket.id);
                    if (result.success) {
                        // 通知房間內其他玩家
                        socket.to(currentRoom.id).emit('player_left', {
                            player: {
                                id: player.id,
                                name: player.name
                            },
                            room: result.room,
                            reason: 'disconnected'
                        });
                        
                        // 廣播房間列表更新
                        io.emit('rooms_updated', {
                            rooms: roomManager.getPublicRooms()
                        });
                    }
                }
                
                roomManager.removePlayer(socket.id);
                console.log(`🗑️ 玩家數據清理: ${player.name}`);
            }
        } catch (error) {
            console.error('Disconnect cleanup error:', error);
        }
    });
});

// =============== Server Start ===============

server.listen(PORT, () => {
    console.log('🚀 RichMan FFT Card Probability API Server');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🔬 FFT Engine initialized`);
    console.log(`🃏 ${Object.keys(require('./services/game-service')).length} test cards loaded`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    console.log();
    console.log('Available endpoints:');
    console.log('  GET     /                      - Service info');
    console.log('  GET     /health                - Health check');
    console.log('  POST    /api/game/start        - Create new game');
    console.log('  GET     /api/game/:id/state    - Get game state');
    console.log('  POST    /api/game/:id/roll     - Roll dice');
    console.log('  GET     /api/cards/:id/probability - Analyze card');
    console.log('  GET     /api/cards/list        - List all cards');
    console.log('  POST    /api/cards/simulate    - Simulate probabilities');
    console.log('  GET     /api/rooms             - Get available rooms');
    console.log('  GET     /api/analytics/system  - System stats');
    console.log();
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
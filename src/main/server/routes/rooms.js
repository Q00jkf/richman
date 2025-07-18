/**
 * 房間 API 路由
 * 處理房間相關的 REST API 請求
 */

const express = require('express');
const router = express.Router();
const { ErrorCode } = require('../../../shared/constants/GameConstants');

// 這些服務將由主應用程序注入
let roomManager, playerManager, gameManager;

/**
 * 注入服務依賴
 */
router.use((req, res, next) => {
  if (!roomManager) {
    roomManager = req.app.get('roomManager');
    playerManager = req.app.get('playerManager');
    gameManager = req.app.get('gameManager');
  }
  next();
});

/**
 * 獲取所有公開房間
 * GET /api/rooms
 */
router.get('/', async (req, res) => {
  try {
    const rooms = roomManager.getPublicRooms();
    
    res.json({
      success: true,
      rooms: rooms,
      total: rooms.length
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取特定房間資訊
 * GET /api/rooms/:roomId
 */
router.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = roomManager.getRoom(roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.ROOM_NOT_FOUND,
        message: 'Room not found'
      });
    }
    
    const roomInfo = roomManager.getRoomPublicInfo(room);
    
    res.json({
      success: true,
      room: roomInfo
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 創建新房間
 * POST /api/rooms
 */
router.post('/', async (req, res) => {
  try {
    const { playerId, settings } = req.body;
    
    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: 'Player ID is required'
      });
    }
    
    const player = playerManager.getPlayer(playerId);
    if (!player) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.PLAYER_NOT_FOUND,
        message: 'Player not found'
      });
    }
    
    const result = roomManager.createRoom(player, settings);
    
    if (result.success) {
      // 更新玩家狀態
      playerManager.updatePlayerRoom(playerId, result.room.id);
      
      res.status(201).json({
        success: true,
        room: result.room
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 加入房間
 * POST /api/rooms/:roomId/join
 */
router.post('/:roomId/join', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { playerId, password } = req.body;
    
    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: 'Player ID is required'
      });
    }
    
    const player = playerManager.getPlayer(playerId);
    if (!player) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.PLAYER_NOT_FOUND,
        message: 'Player not found'
      });
    }
    
    const result = await roomManager.joinRoom(roomId, player, password);
    
    if (result.success) {
      // 更新玩家狀態
      playerManager.updatePlayerRoom(playerId, roomId);
      
      res.json({
        success: true,
        room: result.room,
        isSpectator: result.isSpectator || false
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 離開房間
 * POST /api/rooms/:roomId/leave
 */
router.post('/:roomId/leave', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { playerId } = req.body;
    
    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: 'Player ID is required'
      });
    }
    
    const result = await roomManager.leaveRoom(playerId);
    
    if (result.success) {
      // 更新玩家狀態
      playerManager.updatePlayerRoom(playerId, null);
      
      res.json({
        success: true,
        room: result.room,
        newHostId: result.newHostId
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 設置玩家準備狀態
 * PUT /api/rooms/:roomId/ready
 */
router.put('/:roomId/ready', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { playerId, isReady } = req.body;
    
    if (!playerId || typeof isReady !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: 'Player ID and ready status are required'
      });
    }
    
    const result = roomManager.setPlayerReady(playerId, isReady);
    
    if (result.success) {
      res.json({
        success: true,
        room: result.room,
        allReady: result.allReady
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Set ready error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 更新房間設置
 * PUT /api/rooms/:roomId/settings
 */
router.put('/:roomId/settings', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { hostId, settings } = req.body;
    
    if (!hostId || !settings) {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: 'Host ID and settings are required'
      });
    }
    
    const result = roomManager.updateRoomSettings(roomId, hostId, settings);
    
    if (result.success) {
      res.json({
        success: true,
        room: result.room
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Update room settings error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 開始遊戲
 * POST /api/rooms/:roomId/start
 */
router.post('/:roomId/start', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { hostId } = req.body;
    
    if (!hostId) {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: 'Host ID is required'
      });
    }
    
    const room = roomManager.getRoom(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.ROOM_NOT_FOUND,
        message: 'Room not found'
      });
    }
    
    // 創建遊戲
    const game = gameManager.createGame(roomId, room.settings);
    
    // 將房間玩家加入遊戲
    for (const playerId of room.players) {
      const player = playerManager.getPlayer(playerId);
      if (player) {
        await gameManager.joinGame(game.id, player);
      }
    }
    
    // 開始遊戲
    const gameResult = await gameManager.startGame(game.id, hostId);
    
    if (gameResult.success) {
      // 更新房間狀態
      const roomResult = roomManager.startGame(roomId, hostId, game.id);
      
      if (roomResult.success) {
        // 更新所有玩家狀態
        room.players.forEach(playerId => {
          playerManager.updatePlayerGame(playerId, game.id);
        });
        
        res.json({
          success: true,
          gameId: game.id,
          room: roomResult.room,
          gameState: gameManager.getGameState(game.id)
        });
      } else {
        res.status(400).json({
          success: false,
          error: roomResult.error,
          message: roomResult.message
        });
      }
    } else {
      res.status(400).json({
        success: false,
        error: gameResult.error,
        message: gameResult.message
      });
    }
  } catch (error) {
    console.error('Start game error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 搜尋房間
 * GET /api/rooms/search/:query
 */
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const rooms = roomManager.searchRooms(query);
    
    res.json({
      success: true,
      rooms: rooms,
      total: rooms.length,
      query: query
    });
  } catch (error) {
    console.error('Search rooms error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取房間聊天記錄
 * GET /api/rooms/:roomId/chat
 */
router.get('/:roomId/chat', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const room = roomManager.getRoom(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.ROOM_NOT_FOUND,
        message: 'Room not found'
      });
    }
    
    const chat = room.chat || [];
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const chatMessages = chat.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      messages: chatMessages,
      total: chat.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取房間統計
 * GET /api/rooms/:roomId/stats
 */
router.get('/:roomId/stats', async (req, res) => {
  try {
    const { roomId } = req.params;
    const stats = roomManager.getRoomStats(roomId);
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.ROOM_NOT_FOUND,
        message: 'Room stats not found'
      });
    }
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get room stats error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 刪除房間（僅限房主）
 * DELETE /api/rooms/:roomId
 */
router.delete('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { hostId } = req.body;
    
    if (!hostId) {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: 'Host ID is required'
      });
    }
    
    const room = roomManager.getRoom(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.ROOM_NOT_FOUND,
        message: 'Room not found'
      });
    }
    
    if (room.hostId !== hostId) {
      return res.status(403).json({
        success: false,
        error: ErrorCode.FORBIDDEN,
        message: 'Only room host can delete the room'
      });
    }
    
    // 移除所有玩家
    for (const playerId of room.players) {
      await roomManager.leaveRoom(playerId);
      playerManager.updatePlayerRoom(playerId, null);
    }
    
    // 刪除房間
    const result = roomManager.deleteRoom(roomId);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Room deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取伺服器房間統計
 * GET /api/rooms/server/stats
 */
router.get('/server/stats', async (req, res) => {
  try {
    const stats = roomManager.getServerStats();
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get server room stats error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

module.exports = router;
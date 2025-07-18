/**
 * 玩家 API 路由
 * 處理玩家相關的 REST API 請求
 */

const express = require('express');
const router = express.Router();
const { ErrorCode } = require('../../../shared/constants/GameConstants');

// 這些服務將由主應用程序注入
let playerManager, gameManager, roomManager;

/**
 * 注入服務依賴
 */
router.use((req, res, next) => {
  if (!playerManager) {
    playerManager = req.app.get('playerManager');
    gameManager = req.app.get('gameManager');
    roomManager = req.app.get('roomManager');
  }
  next();
});

/**
 * 獲取所有線上玩家
 * GET /api/players
 */
router.get('/', async (req, res) => {
  try {
    const players = playerManager.getOnlinePlayers();
    
    res.json({
      success: true,
      players: players,
      total: players.length
    });
  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取特定玩家資訊
 * GET /api/players/:playerId
 */
router.get('/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = playerManager.getPlayer(playerId);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.PLAYER_NOT_FOUND,
        message: 'Player not found'
      });
    }
    
    const playerInfo = playerManager.getPlayerPublicInfo(player);
    
    res.json({
      success: true,
      player: playerInfo
    });
  } catch (error) {
    console.error('Get player error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 創建新玩家
 * POST /api/players
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, avatar, preferences } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: 'Player name is required'
      });
    }
    
    // 驗證玩家名稱
    const validation = playerManager.validatePlayerName(name);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: validation.error
      });
    }
    
    const player = playerManager.createPlayer({
      name,
      email,
      avatar,
      preferences
    });
    
    res.status(201).json({
      success: true,
      player: playerManager.getPlayerPublicInfo(player)
    });
  } catch (error) {
    console.error('Create player error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 更新玩家資訊
 * PUT /api/players/:playerId
 */
router.put('/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const { name, avatar, preferences } = req.body;
    
    const player = playerManager.getPlayer(playerId);
    if (!player) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.PLAYER_NOT_FOUND,
        message: 'Player not found'
      });
    }
    
    // 更新玩家資訊
    if (name && name !== player.name) {
      const validation = playerManager.validatePlayerName(name);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: ErrorCode.VALIDATION_ERROR,
          message: validation.error
        });
      }
      player.name = name;
    }
    
    if (avatar) {
      player.avatar = avatar;
    }
    
    if (preferences) {
      player.preferences = {
        ...player.preferences,
        ...preferences
      };
    }
    
    player.lastActiveAt = new Date();
    
    res.json({
      success: true,
      player: playerManager.getPlayerPublicInfo(player)
    });
  } catch (error) {
    console.error('Update player error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 搜尋玩家
 * GET /api/players/search/:query
 */
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const players = playerManager.searchPlayers(query);
    
    res.json({
      success: true,
      players: players,
      total: players.length,
      query: query
    });
  } catch (error) {
    console.error('Search players error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取玩家統計
 * GET /api/players/:playerId/stats
 */
router.get('/:playerId/stats', async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = playerManager.getPlayer(playerId);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.PLAYER_NOT_FOUND,
        message: 'Player not found'
      });
    }
    
    const stats = {
      gamesPlayed: player.gamesPlayed,
      gamesWon: player.gamesWon,
      winRate: player.gamesPlayed > 0 ? (player.gamesWon / player.gamesPlayed * 100).toFixed(2) : 0,
      totalPlayTime: player.totalPlayTime,
      avgPlayTime: player.gamesPlayed > 0 ? (player.totalPlayTime / player.gamesPlayed).toFixed(2) : 0,
      createdAt: player.createdAt,
      lastActiveAt: player.lastActiveAt,
      isGuest: player.isGuest
    };
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get player stats error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取玩家當前遊戲
 * GET /api/players/:playerId/current-game
 */
router.get('/:playerId/current-game', async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = playerManager.getPlayer(playerId);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.PLAYER_NOT_FOUND,
        message: 'Player not found'
      });
    }
    
    const game = gameManager.getGameByPlayer(playerId);
    
    if (!game) {
      return res.json({
        success: true,
        game: null,
        message: 'Player not in any game'
      });
    }
    
    const gameState = game.getGameState();
    
    res.json({
      success: true,
      game: {
        id: game.id,
        roomId: game.roomId,
        gamePhase: gameState.gamePhase,
        currentPlayer: gameState.currentPlayer,
        isPlayerTurn: gameState.currentPlayer === playerId,
        playerData: gameState.players.find(p => p.id === playerId)
      }
    });
  } catch (error) {
    console.error('Get current game error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取玩家當前房間
 * GET /api/players/:playerId/current-room
 */
router.get('/:playerId/current-room', async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = playerManager.getPlayer(playerId);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.PLAYER_NOT_FOUND,
        message: 'Player not found'
      });
    }
    
    const room = roomManager.getPlayerRoom(playerId);
    
    if (!room) {
      return res.json({
        success: true,
        room: null,
        message: 'Player not in any room'
      });
    }
    
    res.json({
      success: true,
      room: roomManager.getRoomPublicInfo(room)
    });
  } catch (error) {
    console.error('Get current room error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 更新玩家狀態
 * PUT /api/players/:playerId/status
 */
router.put('/:playerId/status', async (req, res) => {
  try {
    const { playerId } = req.params;
    const { status } = req.body;
    
    const result = playerManager.updatePlayerStatus(playerId, status);
    
    if (result.success) {
      res.json({
        success: true,
        player: result.player
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Update player status error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 驗證玩家名稱
 * POST /api/players/validate-name
 */
router.post('/validate-name', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: 'Player name is required'
      });
    }
    
    const validation = playerManager.validatePlayerName(name);
    
    res.json({
      success: validation.valid,
      valid: validation.valid,
      error: validation.error
    });
  } catch (error) {
    console.error('Validate name error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取伺服器玩家統計
 * GET /api/players/server/stats
 */
router.get('/server/stats', async (req, res) => {
  try {
    const stats = playerManager.getServerStats();
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get server player stats error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 刪除玩家（僅限管理員）
 * DELETE /api/players/:playerId
 */
router.delete('/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = playerManager.getPlayer(playerId);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.PLAYER_NOT_FOUND,
        message: 'Player not found'
      });
    }
    
    // 如果玩家在遊戲中或房間中，先移除
    if (player.currentRoomId) {
      await roomManager.leaveRoom(playerId);
    }
    
    if (player.currentGameId) {
      await gameManager.leaveGame(playerId);
    }
    
    // 刪除玩家（僅限訪客玩家）
    if (player.isGuest) {
      playerManager.players.delete(playerId);
      
      res.json({
        success: true,
        message: 'Player deleted successfully'
      });
    } else {
      res.status(403).json({
        success: false,
        error: ErrorCode.FORBIDDEN,
        message: 'Cannot delete registered player'
      });
    }
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

module.exports = router;
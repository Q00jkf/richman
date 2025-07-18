/**
 * 遊戲 API 路由
 * 處理遊戲相關的 REST API 請求
 */

const express = require('express');
const router = express.Router();
const { ErrorCode } = require('../../shared/constants/GameConstants');

// 這些服務將由主應用程序注入
let gameManager, playerManager, roomManager;

/**
 * 注入服務依賴
 */
router.use((req, res, next) => {
  if (!gameManager) {
    gameManager = req.app.get('gameManager');
    playerManager = req.app.get('playerManager');
    roomManager = req.app.get('roomManager');
  }
  next();
});

/**
 * 獲取所有活躍遊戲
 * GET /api/games
 */
router.get('/', async (req, res) => {
  try {
    const games = gameManager.getActiveGames();
    const gameList = games.map(game => ({
      id: game.id,
      roomId: game.roomId,
      playerCount: game.getPlayerCount(),
      gamePhase: game.getGameState().gamePhase,
      startTime: game.getGameState().startTime,
      currentPlayer: game.getGameState().currentPlayer,
      settings: game.settings
    }));
    
    res.json({
      success: true,
      games: gameList,
      total: gameList.length
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取特定遊戲資訊
 * GET /api/games/:gameId
 */
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = gameManager.getGame(gameId);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.GAME_NOT_FOUND,
        message: 'Game not found'
      });
    }
    
    const gameState = game.getGameState();
    const gameInfo = {
      id: game.id,
      roomId: game.roomId,
      players: game.getPlayers().map(player => ({
        id: player.id,
        name: player.name,
        position: player.position,
        money: player.money,
        properties: player.properties,
        isInJail: player.isInJail,
        isBankrupt: player.isBankrupt
      })),
      gamePhase: gameState.gamePhase,
      currentPlayer: gameState.currentPlayer,
      turnNumber: gameState.turnNumber,
      startTime: gameState.startTime,
      settings: game.settings,
      board: gameState.board,
      lastAction: gameState.lastAction
    };
    
    res.json({
      success: true,
      game: gameInfo
    });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取遊戲狀態
 * GET /api/games/:gameId/state
 */
router.get('/:gameId/state', async (req, res) => {
  try {
    const { gameId } = req.params;
    const gameState = gameManager.getGameState(gameId);
    
    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.GAME_NOT_FOUND,
        message: 'Game not found'
      });
    }
    
    res.json({
      success: true,
      gameState: gameState
    });
  } catch (error) {
    console.error('Get game state error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取遊戲歷史記錄
 * GET /api/games/:gameId/history
 */
router.get('/:gameId/history', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = gameManager.getGame(gameId);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.GAME_NOT_FOUND,
        message: 'Game not found'
      });
    }
    
    const history = game.getGameHistory ? game.getGameHistory() : [];
    
    res.json({
      success: true,
      history: history
    });
  } catch (error) {
    console.error('Get game history error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 執行遊戲動作
 * POST /api/games/:gameId/action
 */
router.post('/:gameId/action', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId, action } = req.body;
    
    if (!playerId || !action) {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: 'Player ID and action are required'
      });
    }
    
    const result = await gameManager.handlePlayerAction(playerId, action);
    
    if (result.success) {
      res.json({
        success: true,
        result: result.result,
        gameState: gameManager.getGameState(gameId)
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Game action error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 暫停遊戲
 * POST /api/games/:gameId/pause
 */
router.post('/:gameId/pause', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId } = req.body;
    
    const game = gameManager.getGame(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.GAME_NOT_FOUND,
        message: 'Game not found'
      });
    }
    
    const result = await game.pauseGame(playerId);
    
    res.json({
      success: result.success,
      error: result.error,
      message: result.message,
      gameState: game.getGameState()
    });
  } catch (error) {
    console.error('Pause game error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 恢復遊戲
 * POST /api/games/:gameId/resume
 */
router.post('/:gameId/resume', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId } = req.body;
    
    const game = gameManager.getGame(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.GAME_NOT_FOUND,
        message: 'Game not found'
      });
    }
    
    const result = await game.resumeGame(playerId);
    
    res.json({
      success: result.success,
      error: result.error,
      message: result.message,
      gameState: game.getGameState()
    });
  } catch (error) {
    console.error('Resume game error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 結束遊戲
 * POST /api/games/:gameId/end
 */
router.post('/:gameId/end', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId, reason } = req.body;
    
    const game = gameManager.getGame(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.GAME_NOT_FOUND,
        message: 'Game not found'
      });
    }
    
    const result = await game.endGame(playerId, reason);
    
    res.json({
      success: result.success,
      error: result.error,
      message: result.message,
      gameState: game.getGameState()
    });
  } catch (error) {
    console.error('End game error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取遊戲統計
 * GET /api/games/:gameId/stats
 */
router.get('/:gameId/stats', async (req, res) => {
  try {
    const { gameId } = req.params;
    const stats = gameManager.getGameStats(gameId);
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        error: ErrorCode.GAME_NOT_FOUND,
        message: 'Game stats not found'
      });
    }
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get game stats error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

/**
 * 獲取伺服器遊戲統計
 * GET /api/games/server/stats
 */
router.get('/server/stats', async (req, res) => {
  try {
    const stats = gameManager.getServerStatus();
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get server stats error:', error);
    res.status(500).json({
      success: false,
      error: ErrorCode.UNKNOWN_ERROR,
      message: error.message
    });
  }
});

module.exports = router;
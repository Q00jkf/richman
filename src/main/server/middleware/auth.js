/**
 * 認證中間件
 * 處理 JWT 令牌驗證和用戶授權
 */

const jwt = require('jsonwebtoken');
const { ErrorCode } = require('../../../shared/constants/GameConstants');

/**
 * 驗證 JWT 令牌
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: ErrorCode.UNAUTHORIZED,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: ErrorCode.FORBIDDEN,
        message: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  });
};

/**
 * 可選認證中間件
 * 如果有令牌則驗證，沒有則繼續
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
};

/**
 * 檢查用戶是否為管理員
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      error: ErrorCode.FORBIDDEN,
      message: 'Admin access required'
    });
  }
  next();
};

/**
 * 檢查用戶是否為房主
 */
const requireRoomHost = (req, res, next) => {
  const roomManager = req.app.get('roomManager');
  const roomId = req.params.roomId;
  const userId = req.user ? req.user.id : null;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: ErrorCode.UNAUTHORIZED,
      message: 'Authentication required'
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

  if (room.hostId !== userId) {
    return res.status(403).json({
      success: false,
      error: ErrorCode.FORBIDDEN,
      message: 'Room host access required'
    });
  }

  req.room = room;
  next();
};

/**
 * 檢查用戶是否在房間中
 */
const requireRoomMember = (req, res, next) => {
  const roomManager = req.app.get('roomManager');
  const roomId = req.params.roomId;
  const userId = req.user ? req.user.id : null;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: ErrorCode.UNAUTHORIZED,
      message: 'Authentication required'
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

  if (!room.players.includes(userId) && !room.spectators.includes(userId)) {
    return res.status(403).json({
      success: false,
      error: ErrorCode.FORBIDDEN,
      message: 'Room membership required'
    });
  }

  req.room = room;
  next();
};

/**
 * 檢查用戶是否在遊戲中
 */
const requireGamePlayer = (req, res, next) => {
  const gameManager = req.app.get('gameManager');
  const gameId = req.params.gameId;
  const userId = req.user ? req.user.id : null;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: ErrorCode.UNAUTHORIZED,
      message: 'Authentication required'
    });
  }

  const game = gameManager.getGame(gameId);
  if (!game) {
    return res.status(404).json({
      success: false,
      error: ErrorCode.GAME_NOT_FOUND,
      message: 'Game not found'
    });
  }

  const player = game.getPlayer(userId);
  if (!player) {
    return res.status(403).json({
      success: false,
      error: ErrorCode.FORBIDDEN,
      message: 'Game participation required'
    });
  }

  req.game = game;
  req.player = player;
  next();
};

/**
 * 生成 JWT 令牌
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * 生成刷新令牌
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  });
};

/**
 * 驗證刷新令牌
 */
const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requireRoomHost,
  requireRoomMember,
  requireGamePlayer,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken
};
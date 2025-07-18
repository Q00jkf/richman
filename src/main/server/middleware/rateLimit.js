/**
 * 頻率限制中間件
 * 防止 API 濫用和 DDoS 攻擊
 */

const rateLimit = require('express-rate-limit');
const { ErrorCode } = require('../../../shared/constants/GameConstants');

/**
 * 一般 API 頻率限制
 */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 分鐘
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 限制每個 IP 每 15 分鐘 100 次請求
  message: {
    success: false,
    error: ErrorCode.RATE_LIMIT_EXCEEDED,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true, // 返回 `RateLimit-*` 標頭
  legacyHeaders: false, // 禁用 `X-RateLimit-*` 標頭
  skip: (req) => {
    // 跳過健康檢查和靜態文件
    return req.path === '/health' || req.path.startsWith('/static/');
  }
});

/**
 * 嚴格的 API 頻率限制（用於敏感操作）
 */
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 10, // 限制每個 IP 每 15 分鐘 10 次請求
  message: {
    success: false,
    error: ErrorCode.RATE_LIMIT_EXCEEDED,
    message: 'Too many sensitive requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * 創建房間頻率限制
 */
const createRoomLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 分鐘
  max: 5, // 限制每個 IP 每 10 分鐘創建 5 個房間
  message: {
    success: false,
    error: ErrorCode.RATE_LIMIT_EXCEEDED,
    message: 'Too many rooms created from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * 玩家創建頻率限制
 */
const createPlayerLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 分鐘
  max: 3, // 限制每個 IP 每 5 分鐘創建 3 個玩家
  message: {
    success: false,
    error: ErrorCode.RATE_LIMIT_EXCEEDED,
    message: 'Too many players created from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * 遊戲動作頻率限制
 */
const gameActionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分鐘
  max: 30, // 限制每個 IP 每分鐘 30 次遊戲動作
  message: {
    success: false,
    error: ErrorCode.RATE_LIMIT_EXCEEDED,
    message: 'Too many game actions from this IP, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * 搜索頻率限制
 */
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分鐘
  max: 20, // 限制每個 IP 每分鐘 20 次搜索
  message: {
    success: false,
    error: ErrorCode.RATE_LIMIT_EXCEEDED,
    message: 'Too many search requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * 聊天訊息頻率限制
 */
const chatLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 秒
  max: 10, // 限制每個 IP 每 30 秒 10 條訊息
  message: {
    success: false,
    error: ErrorCode.RATE_LIMIT_EXCEEDED,
    message: 'Too many messages from this IP, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * 基於用戶的頻率限制
 */
const createUserBasedLimiter = (windowMs, max, message) => {
  const userLimits = new Map();
  
  return (req, res, next) => {
    const userId = req.user ? req.user.id : req.ip;
    const now = Date.now();
    
    // 清理過期的記錄
    const expiredUsers = [];
    for (const [user, data] of userLimits.entries()) {
      if (now - data.resetTime > windowMs) {
        expiredUsers.push(user);
      }
    }
    expiredUsers.forEach(user => userLimits.delete(user));
    
    // 檢查用戶限制
    const userLimit = userLimits.get(userId);
    if (!userLimit) {
      userLimits.set(userId, {
        count: 1,
        resetTime: now,
        firstRequest: now
      });
    } else {
      if (now - userLimit.firstRequest < windowMs) {
        userLimit.count++;
        if (userLimit.count > max) {
          return res.status(429).json({
            success: false,
            error: ErrorCode.RATE_LIMIT_EXCEEDED,
            message: message || 'Too many requests, please try again later'
          });
        }
      } else {
        userLimit.count = 1;
        userLimit.resetTime = now;
        userLimit.firstRequest = now;
      }
    }
    
    next();
  };
};

/**
 * Socket.IO 頻率限制
 */
const socketRateLimiter = (windowMs = 60000, max = 30) => {
  const clientLimits = new Map();
  
  return (socket, next) => {
    const clientId = socket.handshake.address;
    const now = Date.now();
    
    // 清理過期的記錄
    const expiredClients = [];
    for (const [client, data] of clientLimits.entries()) {
      if (now - data.resetTime > windowMs) {
        expiredClients.push(client);
      }
    }
    expiredClients.forEach(client => clientLimits.delete(client));
    
    // 檢查客戶端限制
    const clientLimit = clientLimits.get(clientId);
    if (!clientLimit) {
      clientLimits.set(clientId, {
        count: 1,
        resetTime: now,
        firstRequest: now
      });
    } else {
      if (now - clientLimit.firstRequest < windowMs) {
        clientLimit.count++;
        if (clientLimit.count > max) {
          return next(new Error('Rate limit exceeded'));
        }
      } else {
        clientLimit.count = 1;
        clientLimit.resetTime = now;
        clientLimit.firstRequest = now;
      }
    }
    
    next();
  };
};

/**
 * 動態頻率限制（根據服務器負載調整）
 */
const dynamicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req) => {
    // 根據服務器負載動態調整限制
    const load = process.cpuUsage();
    const memoryUsage = process.memoryUsage();
    
    // 如果 CPU 使用率高或內存使用率高，降低限制
    if (load.user > 80 || memoryUsage.heapUsed / memoryUsage.heapTotal > 0.8) {
      return 50; // 降低限制
    }
    
    return 100; // 正常限制
  },
  message: {
    success: false,
    error: ErrorCode.RATE_LIMIT_EXCEEDED,
    message: 'Server is under high load, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  generalLimiter,
  strictLimiter,
  createRoomLimiter,
  createPlayerLimiter,
  gameActionLimiter,
  searchLimiter,
  chatLimiter,
  createUserBasedLimiter,
  socketRateLimiter,
  dynamicLimiter
};
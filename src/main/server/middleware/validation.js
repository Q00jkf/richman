/**
 * 驗證中間件
 * 處理請求數據驗證和清理
 */

const { ErrorCode } = require('../../shared/constants/GameConstants');

/**
 * 驗證玩家創建數據
 */
const validatePlayerCreation = (req, res, next) => {
  const { name, email, avatar, preferences } = req.body;
  const errors = [];

  // 驗證玩家名稱
  if (!name || typeof name !== 'string') {
    errors.push('Player name is required');
  } else if (name.length < 2 || name.length > 20) {
    errors.push('Player name must be between 2 and 20 characters');
  } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(name)) {
    errors.push('Player name contains invalid characters');
  }

  // 驗證電子郵件（如果提供）
  if (email && typeof email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  // 驗證頭像 URL（如果提供）
  if (avatar && typeof avatar === 'string') {
    try {
      new URL(avatar);
    } catch (error) {
      errors.push('Invalid avatar URL');
    }
  }

  // 驗證偏好設定（如果提供）
  if (preferences && typeof preferences === 'object') {
    const validPreferences = ['soundEnabled', 'notificationsEnabled', 'autoEndTurn'];
    const providedPreferences = Object.keys(preferences);
    
    const invalidPreferences = providedPreferences.filter(key => 
      !validPreferences.includes(key) || typeof preferences[key] !== 'boolean'
    );

    if (invalidPreferences.length > 0) {
      errors.push(`Invalid preferences: ${invalidPreferences.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: ErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

/**
 * 驗證房間創建數據
 */
const validateRoomCreation = (req, res, next) => {
  const { playerId, settings } = req.body;
  const errors = [];

  // 驗證玩家 ID
  if (!playerId || typeof playerId !== 'string') {
    errors.push('Player ID is required');
  }

  // 驗證房間設置
  if (settings && typeof settings === 'object') {
    const { 
      name, 
      maxPlayers, 
      minPlayers, 
      gameTimeLimit, 
      turnTimeLimit,
      startingMoney,
      salary,
      isPrivate,
      password,
      allowSpectators,
      autoStart
    } = settings;

    // 驗證房間名稱
    if (name && (typeof name !== 'string' || name.length < 2 || name.length > 50)) {
      errors.push('Room name must be between 2 and 50 characters');
    }

    // 驗證玩家數量
    if (maxPlayers && (!Number.isInteger(maxPlayers) || maxPlayers < 2 || maxPlayers > 6)) {
      errors.push('Max players must be between 2 and 6');
    }

    if (minPlayers && (!Number.isInteger(minPlayers) || minPlayers < 2 || minPlayers > 6)) {
      errors.push('Min players must be between 2 and 6');
    }

    if (maxPlayers && minPlayers && minPlayers > maxPlayers) {
      errors.push('Min players cannot be greater than max players');
    }

    // 驗證時間限制
    if (gameTimeLimit && (!Number.isInteger(gameTimeLimit) || gameTimeLimit < 30 || gameTimeLimit > 240)) {
      errors.push('Game time limit must be between 30 and 240 minutes');
    }

    if (turnTimeLimit && (!Number.isInteger(turnTimeLimit) || turnTimeLimit < 30 || turnTimeLimit > 300)) {
      errors.push('Turn time limit must be between 30 and 300 seconds');
    }

    // 驗證遊戲金額
    if (startingMoney && (!Number.isInteger(startingMoney) || startingMoney < 1000 || startingMoney > 5000)) {
      errors.push('Starting money must be between 1000 and 5000');
    }

    if (salary && (!Number.isInteger(salary) || salary < 100 || salary > 500)) {
      errors.push('Salary must be between 100 and 500');
    }

    // 驗證布爾值
    if (isPrivate !== undefined && typeof isPrivate !== 'boolean') {
      errors.push('isPrivate must be a boolean');
    }

    if (allowSpectators !== undefined && typeof allowSpectators !== 'boolean') {
      errors.push('allowSpectators must be a boolean');
    }

    if (autoStart !== undefined && typeof autoStart !== 'boolean') {
      errors.push('autoStart must be a boolean');
    }

    // 驗證密碼
    if (password && (typeof password !== 'string' || password.length < 4 || password.length > 20)) {
      errors.push('Password must be between 4 and 20 characters');
    }

    if (isPrivate && !password) {
      errors.push('Private rooms must have a password');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: ErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

/**
 * 驗證遊戲動作數據
 */
const validateGameAction = (req, res, next) => {
  const { playerId, action } = req.body;
  const errors = [];

  // 驗證玩家 ID
  if (!playerId || typeof playerId !== 'string') {
    errors.push('Player ID is required');
  }

  // 驗證動作數據
  if (!action || typeof action !== 'object') {
    errors.push('Action data is required');
  } else {
    const { type, data } = action;

    // 驗證動作類型
    if (!type || typeof type !== 'string') {
      errors.push('Action type is required');
    }

    // 驗證動作數據（如果提供）
    if (data && typeof data !== 'object') {
      errors.push('Action data must be an object');
    }

    // 根據動作類型進行特定驗證
    switch (type) {
      case 'roll_dice':
        // 骰子動作不需要額外數據
        break;
      
      case 'buy_property':
        if (!data || typeof data.propertyId !== 'number') {
          errors.push('Property ID is required for buy_property action');
        }
        break;
      
      case 'build_house':
      case 'build_hotel':
      case 'sell_house':
      case 'sell_hotel':
        if (!data || typeof data.propertyId !== 'number') {
          errors.push('Property ID is required for building actions');
        }
        break;
      
      case 'initiate_trade':
        if (!data || typeof data.targetPlayerId !== 'string') {
          errors.push('Target player ID is required for trade actions');
        }
        if (!data.offer || typeof data.offer !== 'object') {
          errors.push('Trade offer is required');
        }
        break;
      
      case 'accept_trade':
      case 'decline_trade':
        if (!data || typeof data.tradeId !== 'string') {
          errors.push('Trade ID is required for trade response actions');
        }
        break;
      
      default:
        // 允許其他動作類型
        break;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: ErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

/**
 * 驗證分頁參數
 */
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const errors = [];

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || pageNum < 1) {
    errors.push('Page must be a positive integer');
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    errors.push('Limit must be between 1 and 100');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: ErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      errors: errors
    });
  }

  req.pagination = {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum
  };

  next();
};

/**
 * 清理和轉換數據
 */
const sanitizeInput = (req, res, next) => {
  // 清理字符串字段
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/\s+/g, ' ');
  };

  // 遞歸清理對象
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  // 清理請求體
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // 清理查詢參數
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

/**
 * 驗證 UUID 格式
 */
const validateUUID = (paramName) => {
  return (req, res, next) => {
    const uuid = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuid || !uuidRegex.test(uuid)) {
      return res.status(400).json({
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: `Invalid ${paramName} format`
      });
    }
    
    next();
  };
};

module.exports = {
  validatePlayerCreation,
  validateRoomCreation,
  validateGameAction,
  validatePagination,
  sanitizeInput,
  validateUUID
};
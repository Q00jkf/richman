/**
 * 遊戲工具函數
 * 共享的遊戲邏輯和計算函數
 */

const { BoardConstants, PropertyType, ColorGroup } = require('../constants/GameConstants');

/**
 * 骰子相關函數
 */
const DiceUtils = {
  /**
   * 擲骰子
   * @param {number} count - 骰子數量
   * @param {number} sides - 骰子面數
   * @returns {Array<number>} 骰子結果
   */
  roll(count = 2, sides = 6) {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * sides) + 1);
    }
    return results;
  },

  /**
   * 計算骰子總和
   * @param {Array<number>} dice - 骰子結果
   * @returns {number} 總和
   */
  sum(dice) {
    return dice.reduce((sum, value) => sum + value, 0);
  },

  /**
   * 檢查是否為雙數
   * @param {Array<number>} dice - 骰子結果
   * @returns {boolean} 是否為雙數
   */
  isDouble(dice) {
    return dice.length === 2 && dice[0] === dice[1];
  },

  /**
   * 格式化骰子結果
   * @param {Array<number>} dice - 骰子結果
   * @returns {string} 格式化字符串
   */
  format(dice) {
    return `[${dice.join(', ')}] = ${this.sum(dice)}`;
  }
};

/**
 * 位置相關函數
 */
const PositionUtils = {
  /**
   * 計算新位置
   * @param {number} currentPosition - 當前位置
   * @param {number} steps - 移動步數
   * @returns {Object} 新位置和是否經過 GO
   */
  calculateNewPosition(currentPosition, steps) {
    const newPosition = (currentPosition + steps) % BoardConstants.TOTAL_SPACES;
    const passedGo = currentPosition + steps >= BoardConstants.TOTAL_SPACES;
    
    return {
      position: newPosition,
      passedGo: passedGo
    };
  },

  /**
   * 計算兩個位置之間的距離
   * @param {number} from - 起始位置
   * @param {number} to - 目標位置
   * @returns {number} 距離
   */
  calculateDistance(from, to) {
    if (to >= from) {
      return to - from;
    } else {
      return BoardConstants.TOTAL_SPACES - from + to;
    }
  },

  /**
   * 獲取位置名稱
   * @param {number} position - 位置索引
   * @returns {string} 位置名稱
   */
  getPositionName(position) {
    const positionNames = {
      0: 'GO',
      2: 'Community Chest',
      4: 'Income Tax',
      7: 'Chance',
      10: 'Jail',
      17: 'Community Chest',
      20: 'Free Parking',
      22: 'Chance',
      30: 'Go to Jail',
      33: 'Community Chest',
      36: 'Chance',
      38: 'Luxury Tax'
    };
    
    return positionNames[position] || `Position ${position}`;
  },

  /**
   * 檢查位置是否為特殊位置
   * @param {number} position - 位置索引
   * @returns {boolean} 是否為特殊位置
   */
  isSpecialPosition(position) {
    return Object.values(BoardConstants.SPECIAL_POSITIONS).includes(position);
  }
};

/**
 * 金錢相關函數
 */
const MoneyUtils = {
  /**
   * 格式化金錢顯示
   * @param {number} amount - 金額
   * @returns {string} 格式化字符串
   */
  format(amount) {
    return `$${amount.toLocaleString()}`;
  },

  /**
   * 驗證金額是否有效
   * @param {number} amount - 金額
   * @returns {boolean} 是否有效
   */
  isValidAmount(amount) {
    return typeof amount === 'number' && amount >= 0 && Number.isInteger(amount);
  },

  /**
   * 計算租金
   * @param {Object} property - 物業資訊
   * @param {number} diceRoll - 骰子結果（用於鐵路和公用事業）
   * @returns {number} 租金
   */
  calculateRent(property, diceRoll = 0) {
    if (!property.isOwned) return 0;
    
    switch (property.type) {
      case PropertyType.STREET:
        let rent = property.rent;
        
        // 如果擁有完整顏色組，租金翻倍
        if (property.hasMonopoly) {
          rent *= 2;
        }
        
        // 根據建築物數量調整租金
        if (property.houses > 0) {
          rent = property.houseRent[property.houses - 1];
        } else if (property.hasHotel) {
          rent = property.hotelRent;
        }
        
        return rent;
      
      case PropertyType.RAILROAD:
        const railroadRent = [25, 50, 100, 200];
        return railroadRent[property.ownedRailroads - 1] || 0;
      
      case PropertyType.UTILITY:
        const multiplier = property.ownedUtilities === 1 ? 4 : 10;
        return diceRoll * multiplier;
      
      default:
        return 0;
    }
  },

  /**
   * 計算物業價值
   * @param {Object} property - 物業資訊
   * @returns {number} 物業價值
   */
  calculatePropertyValue(property) {
    let value = property.price;
    
    // 加上建築物價值
    if (property.houses > 0) {
      value += property.houses * property.housePrice;
    }
    
    if (property.hasHotel) {
      value += property.hotelPrice;
    }
    
    return value;
  }
};

/**
 * 物業相關函數
 */
const PropertyUtils = {
  /**
   * 獲取顏色組的所有物業
   * @param {string} colorGroup - 顏色組
   * @param {Array} properties - 所有物業
   * @returns {Array} 該顏色組的物業
   */
  getPropertiesInColorGroup(colorGroup, properties) {
    return properties.filter(property => property.colorGroup === colorGroup);
  },

  /**
   * 檢查玩家是否擁有完整顏色組
   * @param {string} playerId - 玩家 ID
   * @param {string} colorGroup - 顏色組
   * @param {Array} properties - 所有物業
   * @returns {boolean} 是否擁有完整顏色組
   */
  hasMonopoly(playerId, colorGroup, properties) {
    const groupProperties = this.getPropertiesInColorGroup(colorGroup, properties);
    return groupProperties.every(property => property.ownerId === playerId);
  },

  /**
   * 獲取玩家擁有的物業
   * @param {string} playerId - 玩家 ID
   * @param {Array} properties - 所有物業
   * @returns {Array} 玩家擁有的物業
   */
  getPlayerProperties(playerId, properties) {
    return properties.filter(property => property.ownerId === playerId);
  },

  /**
   * 計算玩家總資產
   * @param {Object} player - 玩家資訊
   * @param {Array} properties - 所有物業
   * @returns {number} 總資產
   */
  calculatePlayerNetWorth(player, properties) {
    let netWorth = player.money;
    
    // 加上擁有的物業價值
    const playerProperties = this.getPlayerProperties(player.id, properties);
    playerProperties.forEach(property => {
      netWorth += MoneyUtils.calculatePropertyValue(property);
    });
    
    return netWorth;
  },

  /**
   * 檢查物業是否可以建造房屋
   * @param {Object} property - 物業資訊
   * @param {Array} properties - 所有物業
   * @returns {boolean} 是否可以建造
   */
  canBuildHouses(property, properties) {
    if (property.type !== PropertyType.STREET) return false;
    if (property.isMortgaged) return false;
    if (property.hasHotel) return false;
    if (property.houses >= 4) return false;
    
    // 必須擁有完整顏色組
    if (!this.hasMonopoly(property.ownerId, property.colorGroup, properties)) {
      return false;
    }
    
    // 檢查均勻建造規則
    const groupProperties = this.getPropertiesInColorGroup(property.colorGroup, properties);
    const minHouses = Math.min(...groupProperties.map(p => p.houses));
    
    return property.houses === minHouses;
  },

  /**
   * 檢查物業是否可以建造酒店
   * @param {Object} property - 物業資訊
   * @param {Array} properties - 所有物業
   * @returns {boolean} 是否可以建造
   */
  canBuildHotel(property, properties) {
    if (property.type !== PropertyType.STREET) return false;
    if (property.isMortgaged) return false;
    if (property.hasHotel) return false;
    if (property.houses !== 4) return false;
    
    // 必須擁有完整顏色組
    return this.hasMonopoly(property.ownerId, property.colorGroup, properties);
  }
};

/**
 * 遊戲規則相關函數
 */
const GameRules = {
  /**
   * 檢查玩家是否破產
   * @param {Object} player - 玩家資訊
   * @param {Array} properties - 所有物業
   * @returns {boolean} 是否破產
   */
  isPlayerBankrupt(player, properties) {
    const netWorth = PropertyUtils.calculatePlayerNetWorth(player, properties);
    return netWorth < 0;
  },

  /**
   * 檢查遊戲是否結束
   * @param {Array} players - 所有玩家
   * @returns {Object} 遊戲結束資訊
   */
  checkGameEnd(players) {
    const activePlayers = players.filter(player => !player.isBankrupt);
    
    if (activePlayers.length === 1) {
      return {
        isGameOver: true,
        winner: activePlayers[0],
        reason: 'last_player_standing'
      };
    }
    
    if (activePlayers.length === 0) {
      return {
        isGameOver: true,
        winner: null,
        reason: 'all_players_bankrupt'
      };
    }
    
    return {
      isGameOver: false,
      winner: null,
      reason: null
    };
  },

  /**
   * 檢查玩家是否可以交易
   * @param {Object} player - 玩家資訊
   * @returns {boolean} 是否可以交易
   */
  canPlayerTrade(player) {
    return !player.isBankrupt && !player.isInJail;
  },

  /**
   * 檢查玩家是否可以管理物業
   * @param {Object} player - 玩家資訊
   * @param {boolean} isPlayerTurn - 是否為玩家回合
   * @returns {boolean} 是否可以管理物業
   */
  canManageProperties(player, isPlayerTurn) {
    return !player.isBankrupt && (isPlayerTurn || player.needsToRaiseFunds);
  }
};

/**
 * 時間相關函數
 */
const TimeUtils = {
  /**
   * 格式化遊戲時間
   * @param {number} seconds - 秒數
   * @returns {string} 格式化時間
   */
  formatGameTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  },

  /**
   * 計算剩餘時間
   * @param {Date} endTime - 結束時間
   * @returns {number} 剩餘秒數
   */
  getRemainingTime(endTime) {
    const now = new Date();
    const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
    return remaining;
  },

  /**
   * 檢查時間是否過期
   * @param {Date} endTime - 結束時間
   * @returns {boolean} 是否過期
   */
  isExpired(endTime) {
    return new Date() >= endTime;
  }
};

module.exports = {
  DiceUtils,
  PositionUtils,
  MoneyUtils,
  PropertyUtils,
  GameRules,
  TimeUtils
};
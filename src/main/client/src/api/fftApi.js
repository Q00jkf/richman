/**
 * FFT Card Probability System API Client
 * 
 * 與 RichMan FFT API 服務器通信的客戶端
 * 支援本地開發和 Render 生產環境
 */

import axios from 'axios';

// API 配置
const API_CONFIG = {
  // 根據環境自動選擇 API 基礎 URL
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://richman-online-game.onrender.com' 
    : 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// 創建 Axios 實例
const apiClient = axios.create(API_CONFIG);

// 請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// 響應攔截器
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * FFT API 服務類
 */
class FFTApiService {
  
  // =============== 健康檢查 ===============
  
  /**
   * 檢查 API 服務器狀態
   */
  async getHealth() {
    try {
      const response = await apiClient.get('/health');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * 獲取服務資訊
   */
  async getServiceInfo() {
    try {
      const response = await apiClient.get('/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =============== 遊戲管理 ===============

  /**
   * 創建新遊戲
   * @param {Object} options - 遊戲選項
   * @param {string} options.playerBackground - 玩家背景 ('conservative', 'balanced', 'aggressive')
   * @param {string} options.playerId - 玩家ID
   */
  async createGame(options = {}) {
    try {
      const { playerBackground = 'balanced', playerId } = options;
      
      const response = await apiClient.post('/api/game/start', {
        playerBackground,
        playerId
      });
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * 獲取遊戲狀態
   * @param {string} gameId - 遊戲ID
   */
  async getGameState(gameId) {
    try {
      const response = await apiClient.get(`/api/game/${gameId}/state`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * 擲骰子
   * @param {string} gameId - 遊戲ID
   * @param {number} diceResult - 可選：指定骰子結果
   */
  async rollDice(gameId, diceResult = null) {
    try {
      const payload = diceResult ? { diceResult } : {};
      const response = await apiClient.post(`/api/game/${gameId}/roll`, payload);
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  // =============== 卡牌分析 ===============

  /**
   * 獲取所有卡牌列表
   */
  async getCardList() {
    try {
      const response = await apiClient.get('/api/cards/list');
      return {
        success: true,
        data: response.data.data,
        totalCards: response.data.totalCards
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 分析特定卡牌的機率分佈
   * @param {string} cardId - 卡牌ID
   * @param {string} background - 玩家背景
   */
  async analyzeCardProbability(cardId, background = 'balanced') {
    try {
      const response = await apiClient.get(`/api/cards/${cardId}/probability`, {
        params: { background }
      });
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * 模擬多張卡牌的機率分佈
   * @param {string[]} cardIds - 卡牌ID列表
   * @param {string[]} backgrounds - 背景類型列表
   */
  async simulateCardProbabilities(cardIds, backgrounds = ['conservative', 'balanced', 'aggressive']) {
    try {
      const response = await apiClient.post('/api/cards/simulate', {
        cardIds,
        backgrounds
      });
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =============== 分析統計 ===============

  /**
   * 獲取系統統計數據
   */
  async getSystemAnalytics() {
    try {
      const response = await apiClient.get('/api/analytics/system');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =============== 工具方法 ===============

  /**
   * 檢查 API 連接狀態
   */
  async checkConnection() {
    const health = await this.getHealth();
    const service = await this.getServiceInfo();
    
    return {
      isConnected: health.success && service.success,
      healthData: health.data,
      serviceData: service.data,
      errors: {
        health: health.error,
        service: service.error
      }
    };
  }

  /**
   * 批量獲取卡牌分析
   * @param {string[]} cardIds - 卡牌ID列表
   * @param {string} background - 背景類型
   */
  async batchAnalyzeCards(cardIds, background = 'balanced') {
    try {
      const promises = cardIds.map(cardId => 
        this.analyzeCardProbability(cardId, background)
      );
      
      const results = await Promise.allSettled(promises);
      
      return {
        success: true,
        data: results.map((result, index) => ({
          cardId: cardIds[index],
          success: result.status === 'fulfilled',
          data: result.status === 'fulfilled' ? result.value.data : null,
          error: result.status === 'rejected' ? result.reason.message : null
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 獲取推薦的玩家背景
   * @param {string} playStyle - 遊戲風格偏好
   */
  getRecommendedBackground(playStyle = 'balanced') {
    const recommendations = {
      'safe': 'conservative',
      'normal': 'balanced', 
      'risky': 'aggressive',
      'balanced': 'balanced'
    };
    
    return recommendations[playStyle] || 'balanced';
  }
}

// 創建服務實例
const fftApi = new FFTApiService();

// 導出 API 服務
export default fftApi;

// 命名導出常用方法
export {
  fftApi,
  FFTApiService,
  apiClient,
  API_CONFIG
};

// 常數導出
export const PLAYER_BACKGROUNDS = ['conservative', 'balanced', 'aggressive'];
export const API_ENDPOINTS = {
  HEALTH: '/health',
  SERVICE_INFO: '/',
  GAME_START: '/api/game/start',
  GAME_STATE: '/api/game/:gameId/state',
  GAME_ROLL: '/api/game/:gameId/roll',
  CARDS_LIST: '/api/cards/list',
  CARD_PROBABILITY: '/api/cards/:cardId/probability',
  CARDS_SIMULATE: '/api/cards/simulate',
  SYSTEM_ANALYTICS: '/api/analytics/system'
};
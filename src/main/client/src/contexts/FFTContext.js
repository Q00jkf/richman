/**
 * FFT System Context
 * 
 * 管理 FFT 卡牌機率系統的狀態和操作
 * 提供 React 應用程序的全局 FFT 系統訪問
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import fftApi from '../api/fftApi';

// FFT 系統初始狀態
const initialFFTState = {
  // API 連接狀態
  isConnected: false,
  isLoading: false,
  error: null,
  
  // 服務資訊
  serviceInfo: null,
  healthData: null,
  
  // 卡牌數據
  availableCards: [],
  totalCards: 0,
  cardProbabilities: {},
  
  // 當前遊戲
  currentGame: null,
  gameState: null,
  selectedCards: [],
  positionAssignments: {},
  
  // 玩家設定
  playerBackground: 'balanced',
  playerId: null,
  
  // 分析數據
  systemAnalytics: null,
  lastRollResult: null,
  gameHistory: [],
  
  // UI 狀態
  showProbabilityChart: false,
  selectedCardForAnalysis: null,
  compareMode: false,
  comparisonCards: [],
};

// Action Types
const FFT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  SET_SERVICE_INFO: 'SET_SERVICE_INFO',
  SET_CARDS: 'SET_CARDS',
  SET_CARD_PROBABILITIES: 'SET_CARD_PROBABILITIES',
  SET_CURRENT_GAME: 'SET_CURRENT_GAME',
  SET_GAME_STATE: 'SET_GAME_STATE',
  SET_ROLL_RESULT: 'SET_ROLL_RESULT',
  SET_PLAYER_BACKGROUND: 'SET_PLAYER_BACKGROUND',
  SET_PLAYER_ID: 'SET_PLAYER_ID',
  SET_SYSTEM_ANALYTICS: 'SET_SYSTEM_ANALYTICS',
  SET_SELECTED_CARD: 'SET_SELECTED_CARD',
  TOGGLE_PROBABILITY_CHART: 'TOGGLE_PROBABILITY_CHART',
  ADD_TO_COMPARISON: 'ADD_TO_COMPARISON',
  REMOVE_FROM_COMPARISON: 'REMOVE_FROM_COMPARISON',
  TOGGLE_COMPARE_MODE: 'TOGGLE_COMPARE_MODE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
function fftReducer(state, action) {
  switch (action.type) {
    case FFT_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case FFT_ACTIONS.SET_ERROR:
      return { 
        ...state, 
        error: action.payload, 
        isLoading: false 
      };
      
    case FFT_ACTIONS.SET_CONNECTION_STATUS:
      return { 
        ...state, 
        isConnected: action.payload,
        error: action.payload ? null : state.error
      };
      
    case FFT_ACTIONS.SET_SERVICE_INFO:
      return { 
        ...state, 
        serviceInfo: action.payload.service,
        healthData: action.payload.health
      };
      
    case FFT_ACTIONS.SET_CARDS:
      return { 
        ...state, 
        availableCards: action.payload.cards,
        totalCards: action.payload.totalCards
      };
      
    case FFT_ACTIONS.SET_CARD_PROBABILITIES:
      return {
        ...state,
        cardProbabilities: {
          ...state.cardProbabilities,
          ...action.payload
        }
      };
      
    case FFT_ACTIONS.SET_CURRENT_GAME:
      return { 
        ...state, 
        currentGame: action.payload,
        selectedCards: action.payload?.selectedCards || [],
        positionAssignments: action.payload?.positionAssignments || {}
      };
      
    case FFT_ACTIONS.SET_GAME_STATE:
      return { ...state, gameState: action.payload };
      
    case FFT_ACTIONS.SET_ROLL_RESULT:
      return { 
        ...state, 
        lastRollResult: action.payload,
        gameHistory: [...state.gameHistory, action.payload]
      };
      
    case FFT_ACTIONS.SET_PLAYER_BACKGROUND:
      return { ...state, playerBackground: action.payload };
      
    case FFT_ACTIONS.SET_PLAYER_ID:
      return { ...state, playerId: action.payload };
      
    case FFT_ACTIONS.SET_SYSTEM_ANALYTICS:
      return { ...state, systemAnalytics: action.payload };
      
    case FFT_ACTIONS.SET_SELECTED_CARD:
      return { ...state, selectedCardForAnalysis: action.payload };
      
    case FFT_ACTIONS.TOGGLE_PROBABILITY_CHART:
      return { ...state, showProbabilityChart: !state.showProbabilityChart };
      
    case FFT_ACTIONS.ADD_TO_COMPARISON:
      if (state.comparisonCards.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        comparisonCards: [...state.comparisonCards, action.payload]
      };
      
    case FFT_ACTIONS.REMOVE_FROM_COMPARISON:
      return {
        ...state,
        comparisonCards: state.comparisonCards.filter(id => id !== action.payload)
      };
      
    case FFT_ACTIONS.TOGGLE_COMPARE_MODE:
      return { 
        ...state, 
        compareMode: !state.compareMode,
        comparisonCards: state.compareMode ? [] : state.comparisonCards
      };
      
    case FFT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
      
    case FFT_ACTIONS.RESET_STATE:
      return initialFFTState;
      
    default:
      return state;
  }
}

// Context
const FFTContext = createContext();

// Provider Component
export function FFTProvider({ children }) {
  const [state, dispatch] = useReducer(fftReducer, initialFFTState);

  // =============== Helper Functions ===============

  const setLoading = useCallback((loading) => {
    dispatch({ type: FFT_ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: FFT_ACTIONS.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: FFT_ACTIONS.CLEAR_ERROR });
  }, []);

  // =============== API Functions ===============

  const checkConnection = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fftApi.checkConnection();
      dispatch({ 
        type: FFT_ACTIONS.SET_CONNECTION_STATUS, 
        payload: result.isConnected 
      });
      
      if (result.isConnected) {
        dispatch({ 
          type: FFT_ACTIONS.SET_SERVICE_INFO, 
          payload: {
            service: result.serviceData,
            health: result.healthData
          }
        });
      } else {
        setError('Failed to connect to FFT API server');
      }
    } catch (error) {
      setError(error.message);
      dispatch({ type: FFT_ACTIONS.SET_CONNECTION_STATUS, payload: false });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCards = useCallback(async () => {
    try {
      const result = await fftApi.getCardList();
      if (result.success) {
        dispatch({ 
          type: FFT_ACTIONS.SET_CARDS, 
          payload: {
            cards: result.data,
            totalCards: result.totalCards
          }
        });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const createGame = useCallback(async (options = {}) => {
    setLoading(true);
    try {
      const result = await fftApi.createGame({
        playerBackground: state.playerBackground,
        playerId: state.playerId,
        ...options
      });
      
      if (result.success) {
        dispatch({ type: FFT_ACTIONS.SET_CURRENT_GAME, payload: result.data });
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [state.playerBackground, state.playerId]);

  const rollDice = useCallback(async (gameId, diceResult = null) => {
    if (!gameId) {
      setError('No active game found');
      return null;
    }
    
    setLoading(true);
    try {
      const result = await fftApi.rollDice(gameId, diceResult);
      
      if (result.success) {
        dispatch({ type: FFT_ACTIONS.SET_ROLL_RESULT, payload: result.data });
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeCard = useCallback(async (cardId, background = null) => {
    try {
      const targetBackground = background || state.playerBackground;
      const result = await fftApi.analyzeCardProbability(cardId, targetBackground);
      
      if (result.success) {
        dispatch({
          type: FFT_ACTIONS.SET_CARD_PROBABILITIES,
          payload: {
            [`${cardId}_${targetBackground}`]: result.data
          }
        });
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (error) {
      setError(error.message);
      return null;
    }
  }, [state.playerBackground]);

  const loadSystemAnalytics = useCallback(async () => {
    try {
      const result = await fftApi.getSystemAnalytics();
      if (result.success) {
        dispatch({ type: FFT_ACTIONS.SET_SYSTEM_ANALYTICS, payload: result.data });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // =============== UI Functions ===============

  const setPlayerBackground = useCallback((background) => {
    dispatch({ type: FFT_ACTIONS.SET_PLAYER_BACKGROUND, payload: background });
  }, []);

  const setPlayerId = useCallback((playerId) => {
    dispatch({ type: FFT_ACTIONS.SET_PLAYER_ID, payload: playerId });
  }, []);

  const selectCardForAnalysis = useCallback((cardId) => {
    dispatch({ type: FFT_ACTIONS.SET_SELECTED_CARD, payload: cardId });
  }, []);

  const toggleProbabilityChart = useCallback(() => {
    dispatch({ type: FFT_ACTIONS.TOGGLE_PROBABILITY_CHART });
  }, []);

  const addToComparison = useCallback((cardId) => {
    dispatch({ type: FFT_ACTIONS.ADD_TO_COMPARISON, payload: cardId });
  }, []);

  const removeFromComparison = useCallback((cardId) => {
    dispatch({ type: FFT_ACTIONS.REMOVE_FROM_COMPARISON, payload: cardId });
  }, []);

  const toggleCompareMode = useCallback(() => {
    dispatch({ type: FFT_ACTIONS.TOGGLE_COMPARE_MODE });
  }, []);

  // =============== Effects ===============

  // 初始化連接
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // 載入卡牌數據
  useEffect(() => {
    if (state.isConnected) {
      loadCards();
      loadSystemAnalytics();
    }
  }, [state.isConnected, loadCards, loadSystemAnalytics]);

  // Context Value
  const contextValue = {
    // State
    ...state,
    
    // API Functions
    checkConnection,
    loadCards,
    createGame,
    rollDice,
    analyzeCard,
    loadSystemAnalytics,
    
    // UI Functions
    setPlayerBackground,
    setPlayerId,
    selectCardForAnalysis,
    toggleProbabilityChart,
    addToComparison,
    removeFromComparison,
    toggleCompareMode,
    
    // Utils
    setLoading,
    setError,
    clearError
  };

  return (
    <FFTContext.Provider value={contextValue}>
      {children}
    </FFTContext.Provider>
  );
}

// Hook
export function useFFT() {
  const context = useContext(FFTContext);
  if (!context) {
    throw new Error('useFFT must be used within FFTProvider');
  }
  return context;
}

export default FFTContext;
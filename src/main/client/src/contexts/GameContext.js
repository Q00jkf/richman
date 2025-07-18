/**
 * 遊戲狀態管理 Context
 * 管理遊戲狀態、動作和事件
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSocket } from './SocketContext';

// 初始遊戲狀態
const initialGameState = {
  // 遊戲基本信息
  gameId: null,
  roomId: null,
  gamePhase: 'waiting',
  roundNumber: 0,
  
  // 玩家信息
  players: [],
  currentPlayerIndex: 0,
  currentPlayerId: null,
  myPlayerId: null,
  
  // 棋盤狀態
  board: {
    spaces: [],
    propertyGroups: {}
  },
  
  // 遊戲動作
  diceResult: null,
  lastAction: null,
  
  // UI 狀態
  selectedProperty: null,
  showDice: false,
  showCard: null,
  notifications: [],
  
  // 遊戲設置
  settings: {
    maxPlayers: 4,
    startingMoney: 1500,
    timeLimit: 120
  },
  
  // 狀態標誌
  isMyTurn: false,
  canRollDice: false,
  canEndTurn: false,
  isGameStarted: false,
  isGameEnded: false
};

// 動作類型
const ACTION_TYPES = {
  // 遊戲控制
  SET_GAME_STATE: 'SET_GAME_STATE',
  UPDATE_GAME_PHASE: 'UPDATE_GAME_PHASE',
  START_GAME: 'START_GAME',
  END_GAME: 'END_GAME',
  
  // 玩家動作
  SET_PLAYERS: 'SET_PLAYERS',
  ADD_PLAYER: 'ADD_PLAYER',
  REMOVE_PLAYER: 'REMOVE_PLAYER',
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  SET_CURRENT_PLAYER: 'SET_CURRENT_PLAYER',
  SET_MY_PLAYER_ID: 'SET_MY_PLAYER_ID',
  
  // 遊戲動作
  SET_DICE_RESULT: 'SET_DICE_RESULT',
  SET_LAST_ACTION: 'SET_LAST_ACTION',
  CLEAR_DICE: 'CLEAR_DICE',
  
  // UI 控制
  SET_SELECTED_PROPERTY: 'SET_SELECTED_PROPERTY',
  SHOW_DICE: 'SHOW_DICE',
  HIDE_DICE: 'HIDE_DICE',
  SHOW_CARD: 'SHOW_CARD',
  HIDE_CARD: 'HIDE_CARD',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  
  // 能力狀態
  SET_CAN_ROLL_DICE: 'SET_CAN_ROLL_DICE',
  SET_CAN_END_TURN: 'SET_CAN_END_TURN',
  SET_IS_MY_TURN: 'SET_IS_MY_TURN',
  
  // 重置
  RESET_GAME: 'RESET_GAME'
};

// Reducer 函數
function gameReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_GAME_STATE:
      return { ...state, ...action.payload };
      
    case ACTION_TYPES.UPDATE_GAME_PHASE:
      return { ...state, gamePhase: action.payload };
      
    case ACTION_TYPES.START_GAME:
      return { 
        ...state, 
        isGameStarted: true, 
        gamePhase: 'playing',
        ...action.payload 
      };
      
    case ACTION_TYPES.END_GAME:
      return { 
        ...state, 
        isGameEnded: true, 
        gamePhase: 'game_over',
        ...action.payload 
      };
      
    case ACTION_TYPES.SET_PLAYERS:
      return { ...state, players: action.payload };
      
    case ACTION_TYPES.ADD_PLAYER:
      return { 
        ...state, 
        players: [...state.players, action.payload] 
      };
      
    case ACTION_TYPES.REMOVE_PLAYER:
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.payload)
      };
      
    case ACTION_TYPES.UPDATE_PLAYER:
      return {
        ...state,
        players: state.players.map(p => 
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        )
      };
      
    case ACTION_TYPES.SET_CURRENT_PLAYER:
      const isMyTurn = action.payload === state.myPlayerId;
      return { 
        ...state, 
        currentPlayerId: action.payload,
        currentPlayerIndex: state.players.findIndex(p => p.id === action.payload),
        isMyTurn,
        canRollDice: isMyTurn && state.gamePhase === 'player_turn',
        canEndTurn: isMyTurn
      };
      
    case ACTION_TYPES.SET_MY_PLAYER_ID:
      return { 
        ...state, 
        myPlayerId: action.payload,
        isMyTurn: action.payload === state.currentPlayerId
      };
      
    case ACTION_TYPES.SET_DICE_RESULT:
      return { 
        ...state, 
        diceResult: action.payload,
        showDice: true,
        canRollDice: false
      };
      
    case ACTION_TYPES.SET_LAST_ACTION:
      return { ...state, lastAction: action.payload };
      
    case ACTION_TYPES.CLEAR_DICE:
      return { 
        ...state, 
        diceResult: null, 
        showDice: false 
      };
      
    case ACTION_TYPES.SET_SELECTED_PROPERTY:
      return { ...state, selectedProperty: action.payload };
      
    case ACTION_TYPES.SHOW_DICE:
      return { ...state, showDice: true };
      
    case ACTION_TYPES.HIDE_DICE:
      return { ...state, showDice: false };
      
    case ACTION_TYPES.SHOW_CARD:
      return { ...state, showCard: action.payload };
      
    case ACTION_TYPES.HIDE_CARD:
      return { ...state, showCard: null };
      
    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload
        }]
      };
      
    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
      
    case ACTION_TYPES.SET_CAN_ROLL_DICE:
      return { ...state, canRollDice: action.payload };
      
    case ACTION_TYPES.SET_CAN_END_TURN:
      return { ...state, canEndTurn: action.payload };
      
    case ACTION_TYPES.SET_IS_MY_TURN:
      return { ...state, isMyTurn: action.payload };
      
    case ACTION_TYPES.RESET_GAME:
      return { ...initialGameState };
      
    default:
      return state;
  }
}

// Context 創建
const GameContext = createContext();

// Provider 組件
export function GameProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const { socket, isConnected } = useSocket();

  // Socket 事件監聽
  useEffect(() => {
    if (!socket || !isConnected) return;

    // 遊戲狀態事件
    socket.on('game:state_updated', (state) => {
      dispatch({ type: ACTION_TYPES.SET_GAME_STATE, payload: state });
    });

    socket.on('game:started', (data) => {
      dispatch({ type: ACTION_TYPES.START_GAME, payload: data });
      addNotification({ type: 'success', message: '遊戲已開始！' });
    });

    socket.on('game:ended', (data) => {
      dispatch({ type: ACTION_TYPES.END_GAME, payload: data });
      addNotification({ 
        type: 'info', 
        message: `遊戲結束！勝利者：${data.winnerName || '無'}` 
      });
    });

    // 玩家事件
    socket.on('game:player_joined', (player) => {
      dispatch({ type: ACTION_TYPES.ADD_PLAYER, payload: player });
      addNotification({ 
        type: 'info', 
        message: `${player.name} 加入了遊戲` 
      });
    });

    socket.on('game:player_left', (playerId) => {
      dispatch({ type: ACTION_TYPES.REMOVE_PLAYER, payload: playerId });
    });

    socket.on('game:turn_started', (data) => {
      dispatch({ type: ACTION_TYPES.SET_CURRENT_PLAYER, payload: data.playerId });
      if (data.playerId === gameState.myPlayerId) {
        addNotification({ type: 'success', message: '輪到你了！' });
      }
    });

    // 遊戲動作事件
    socket.on('game:dice_rolled', (data) => {
      dispatch({ type: ACTION_TYPES.SET_DICE_RESULT, payload: data.diceResult });
    });

    socket.on('game:player_moved', (data) => {
      const player = gameState.players.find(p => p.id === data.playerId);
      if (player) {
        dispatch({ 
          type: ACTION_TYPES.UPDATE_PLAYER, 
          payload: { id: data.playerId, updates: { position: data.newPosition } }
        });
      }
    });

    socket.on('game:property_bought', (data) => {
      addNotification({ 
        type: 'info', 
        message: `玩家購買了地產` 
      });
    });

    socket.on('game:card_drawn', (data) => {
      dispatch({ type: ACTION_TYPES.SHOW_CARD, payload: data.card });
    });

    // 清理函數
    return () => {
      socket.off('game:state_updated');
      socket.off('game:started');
      socket.off('game:ended');
      socket.off('game:player_joined');
      socket.off('game:player_left');
      socket.off('game:turn_started');
      socket.off('game:dice_rolled');
      socket.off('game:player_moved');
      socket.off('game:property_bought');
      socket.off('game:card_drawn');
    };
  }, [socket, isConnected, gameState.myPlayerId, gameState.players]);

  // 遊戲動作函數
  const gameActions = {
    // 擲骰子
    rollDice: () => {
      if (gameState.canRollDice && socket) {
        socket.emit('game:action', {
          type: 'ROLL_DICE',
          playerId: gameState.myPlayerId
        });
      }
    },

    // 購買地產
    buyProperty: (propertyId) => {
      if (socket) {
        socket.emit('game:action', {
          type: 'BUY_PROPERTY',
          playerId: gameState.myPlayerId,
          data: { propertyId }
        });
      }
    },

    // 建造房屋
    buildHouse: (propertyId) => {
      if (socket) {
        socket.emit('game:action', {
          type: 'BUILD_HOUSE',
          playerId: gameState.myPlayerId,
          data: { propertyId }
        });
      }
    },

    // 結束回合
    endTurn: () => {
      if (gameState.canEndTurn && socket) {
        socket.emit('game:action', {
          type: 'END_TURN',
          playerId: gameState.myPlayerId
        });
        dispatch({ type: ACTION_TYPES.SET_CAN_END_TURN, payload: false });
      }
    },

    // UI 動作
    selectProperty: (propertyId) => {
      dispatch({ type: ACTION_TYPES.SET_SELECTED_PROPERTY, payload: propertyId });
    },

    hideCard: () => {
      dispatch({ type: ACTION_TYPES.HIDE_CARD });
    }
  };

  // 通知函數
  const addNotification = (notification) => {
    dispatch({ type: ACTION_TYPES.ADD_NOTIFICATION, payload: notification });
    
    // 自動移除通知
    setTimeout(() => {
      dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: notification.id });
    }, 5000);
  };

  const removeNotification = (id) => {
    dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id });
  };

  // 計算衍生狀態
  const derivedState = {
    currentPlayer: gameState.players[gameState.currentPlayerIndex] || null,
    myPlayer: gameState.players.find(p => p.id === gameState.myPlayerId) || null,
    playerCount: gameState.players.length,
    isWaitingForPlayers: gameState.gamePhase === 'waiting' && gameState.playerCount < 2
  };

  const contextValue = {
    // 狀態
    ...gameState,
    ...derivedState,
    
    // 動作
    ...gameActions,
    
    // 通知
    addNotification,
    removeNotification,
    
    // 原始 dispatch (供高級用法)
    dispatch
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

// Hook
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
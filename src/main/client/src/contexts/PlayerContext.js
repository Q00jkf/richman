/**
 * Player Context - 玩家狀態管理
 * 處理玩家認證、資料和狀態
 */

import React, { createContext, useContext, useEffect, useState, useReducer } from 'react';
import { toast } from 'react-hot-toast';
import { useSocket } from './SocketContext';
import { playerAPI } from '../api/playerAPI';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

// Player reducer
const playerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_PLAYER':
      return { 
        ...state, 
        player: action.payload, 
        isAuthenticated: true, 
        isLoading: false 
      };
    
    case 'UPDATE_PLAYER':
      return { 
        ...state, 
        player: { ...state.player, ...action.payload } 
      };
    
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload, 
        isLoading: false 
      };
    
    case 'LOGOUT':
      return { 
        ...state, 
        player: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      };
    
    case 'SET_PREFERENCES':
      return {
        ...state,
        player: {
          ...state.player,
          preferences: { ...state.player.preferences, ...action.payload }
        }
      };
    
    case 'UPDATE_STATS':
      return {
        ...state,
        player: {
          ...state.player,
          gamesPlayed: action.payload.gamesPlayed || state.player.gamesPlayed,
          gamesWon: action.payload.gamesWon || state.player.gamesWon,
          totalPlayTime: action.payload.totalPlayTime || state.player.totalPlayTime
        }
      };
    
    default:
      return state;
  }
};

const initialState = {
  player: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  preferences: {
    soundEnabled: true,
    notificationsEnabled: true,
    autoEndTurn: false,
    theme: 'auto'
  }
};

export const PlayerProvider = ({ children }) => {
  const { socket, isConnected, emit, on, off } = useSocket();
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [playerStats, setPlayerStats] = useState(null);

  // Initialize player from localStorage
  useEffect(() => {
    const initializePlayer = () => {
      try {
        const savedPlayer = localStorage.getItem('richman_player');
        const savedPreferences = localStorage.getItem('richman_preferences');
        
        if (savedPlayer) {
          const player = JSON.parse(savedPlayer);
          dispatch({ type: 'SET_PLAYER', payload: player });
        }
        
        if (savedPreferences) {
          const preferences = JSON.parse(savedPreferences);
          dispatch({ type: 'SET_PREFERENCES', payload: preferences });
        }
        
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('Error loading player data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load player data' });
      }
    };

    initializePlayer();
  }, []);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleAuthenticated = (data) => {
      if (data.success) {
        dispatch({ type: 'SET_PLAYER', payload: data.player });
        localStorage.setItem('richman_player', JSON.stringify(data.player));
        toast.success(`Welcome back, ${data.player.name}!`);
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        toast.error(data.message || 'Authentication failed');
      }
    };

    const handlePlayerUpdate = (data) => {
      if (data.playerId === state.player?.id) {
        dispatch({ type: 'UPDATE_PLAYER', payload: data.updates });
      }
    };

    const handleOnlinePlayers = (data) => {
      if (data.success) {
        setOnlinePlayers(data.players);
      }
    };

    const handlePlayerStats = (data) => {
      if (data.success && data.stats) {
        setPlayerStats(data.stats);
      }
    };

    // Register event listeners
    on('authenticated', handleAuthenticated);
    on('player_update', handlePlayerUpdate);
    on('online_players', handleOnlinePlayers);
    on('player_stats', handlePlayerStats);

    // Cleanup
    return () => {
      off('authenticated', handleAuthenticated);
      off('player_update', handlePlayerUpdate);
      off('online_players', handleOnlinePlayers);
      off('player_stats', handlePlayerStats);
    };
  }, [socket, isConnected, state.player?.id]);

  // Auto-authenticate if player exists
  useEffect(() => {
    if (socket && isConnected && state.player && !state.isAuthenticated) {
      authenticate(state.player);
    }
  }, [socket, isConnected, state.player]);

  // Player actions
  const authenticate = async (playerData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (socket && isConnected) {
        emit('authenticate', {
          playerId: playerData.id,
          name: playerData.name,
          avatar: playerData.avatar,
          preferences: state.preferences
        });
      } else {
        throw new Error('Not connected to server');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Authentication failed');
    }
  };

  const createPlayer = async (playerData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Validate player name
      const validation = await playerAPI.validateName(playerData.name);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      // Create player via API
      const response = await playerAPI.createPlayer({
        name: playerData.name,
        avatar: playerData.avatar,
        preferences: state.preferences
      });
      
      if (response.success) {
        const newPlayer = response.player;
        dispatch({ type: 'SET_PLAYER', payload: newPlayer });
        localStorage.setItem('richman_player', JSON.stringify(newPlayer));
        
        // Authenticate with socket
        if (socket && isConnected) {
          emit('authenticate', {
            playerId: newPlayer.id,
            name: newPlayer.name,
            avatar: newPlayer.avatar,
            preferences: state.preferences
          });
        }
        
        toast.success(`Welcome, ${newPlayer.name}!`);
        return { success: true, player: newPlayer };
      } else {
        throw new Error(response.message || 'Failed to create player');
      }
    } catch (error) {
      console.error('Create player error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message || 'Failed to create player');
      return { success: false, error: error.message };
    }
  };

  const updatePlayer = async (updates) => {
    try {
      if (!state.player) {
        throw new Error('No player to update');
      }
      
      const response = await playerAPI.updatePlayer(state.player.id, updates);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_PLAYER', payload: updates });
        localStorage.setItem('richman_player', JSON.stringify({ ...state.player, ...updates }));
        toast.success('Player updated successfully');
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to update player');
      }
    } catch (error) {
      console.error('Update player error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message || 'Failed to update player');
      return { success: false, error: error.message };
    }
  };

  const updatePreferences = (newPreferences) => {
    const updatedPreferences = { ...state.preferences, ...newPreferences };
    dispatch({ type: 'SET_PREFERENCES', payload: updatedPreferences });
    localStorage.setItem('richman_preferences', JSON.stringify(updatedPreferences));
    
    // Update player with new preferences
    if (state.player) {
      updatePlayer({ preferences: updatedPreferences });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('richman_player');
    localStorage.removeItem('richman_preferences');
    
    if (socket && isConnected) {
      emit('logout');
    }
    
    toast.success('Logged out successfully');
  };

  const refreshOnlinePlayers = () => {
    if (socket && isConnected) {
      emit('get_online_players');
    }
  };

  const getPlayerStats = async () => {
    try {
      if (!state.player) return null;
      
      const response = await playerAPI.getPlayerStats(state.player.id);
      
      if (response.success) {
        setPlayerStats(response.stats);
        return response.stats;
      } else {
        throw new Error(response.message || 'Failed to get player stats');
      }
    } catch (error) {
      console.error('Get player stats error:', error);
      return null;
    }
  };

  const searchPlayers = async (query) => {
    try {
      const response = await playerAPI.searchPlayers(query);
      
      if (response.success) {
        return response.players;
      } else {
        throw new Error(response.message || 'Failed to search players');
      }
    } catch (error) {
      console.error('Search players error:', error);
      toast.error(error.message || 'Failed to search players');
      return [];
    }
  };

  const validatePlayerName = async (name) => {
    try {
      const response = await playerAPI.validateName(name);
      return response;
    } catch (error) {
      console.error('Validate name error:', error);
      return { valid: false, error: error.message };
    }
  };

  const value = {
    // State
    player: state.player,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    preferences: state.preferences,
    onlinePlayers,
    playerStats,
    
    // Actions
    authenticate,
    createPlayer,
    updatePlayer,
    updatePreferences,
    logout,
    refreshOnlinePlayers,
    getPlayerStats,
    searchPlayers,
    validatePlayerName,
    
    // Computed values
    isGuest: state.player?.isGuest || false,
    playerName: state.player?.name || '',
    playerAvatar: state.player?.avatar || '',
    playerId: state.player?.id || null,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
/**
 * Player API - 玩家相關 API 調用
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/players`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('richman_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('richman_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const playerAPI = {
  // Get all online players
  getOnlinePlayers: () => api.get('/'),
  
  // Get specific player
  getPlayer: (playerId) => api.get(`/${playerId}`),
  
  // Create new player
  createPlayer: (playerData) => api.post('/', playerData),
  
  // Update player
  updatePlayer: (playerId, updates) => api.put(`/${playerId}`, updates),
  
  // Search players
  searchPlayers: (query) => api.get(`/search/${query}`),
  
  // Get player stats
  getPlayerStats: (playerId) => api.get(`/${playerId}/stats`),
  
  // Get current game
  getCurrentGame: (playerId) => api.get(`/${playerId}/current-game`),
  
  // Get current room
  getCurrentRoom: (playerId) => api.get(`/${playerId}/current-room`),
  
  // Update player status
  updatePlayerStatus: (playerId, status) => api.put(`/${playerId}/status`, { status }),
  
  // Validate player name
  validateName: (name) => api.post('/validate-name', { name }),
  
  // Get server stats
  getServerStats: () => api.get('/server/stats'),
  
  // Delete player (admin only)
  deletePlayer: (playerId) => api.delete(`/${playerId}`),
};
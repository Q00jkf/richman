/**
 * Socket Context - WebSocket 連接管理
 * 處理與服務器的實時通信
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastPing, setLastPing] = useState(null);
  
  const reconnectTimeoutRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  // Initialize socket connection
  useEffect(() => {
    const initializeSocket = () => {
      const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
      
      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: reconnectDelay,
        autoConnect: true,
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(0);
        toast.success('Connected to server');
        
        // Start ping interval
        startPingInterval(newSocket);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        
        // Stop ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
        
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect manually
          handleReconnect(newSocket);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnectionError(error.message);
        setIsConnected(false);
        
        // Handle reconnection
        handleReconnect(newSocket);
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(0);
        toast.success('Reconnected to server');
      });

      newSocket.on('reconnect_error', (error) => {
        console.error('Socket reconnection error:', error);
        setConnectionError(error.message);
      });

      newSocket.on('reconnect_failed', () => {
        console.error('Socket reconnection failed');
        setConnectionError('Failed to reconnect to server');
        toast.error('Unable to reconnect to server');
      });

      // Ping/Pong for connection health
      newSocket.on('pong', (data) => {
        setLastPing(new Date());
      });

      // Error handling
      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
        toast.error(error.message || 'Connection error occurred');
      });

      setSocket(newSocket);
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, []);

  // Handle manual reconnection
  const handleReconnect = (socketInstance) => {
    if (reconnectAttempts < maxReconnectAttempts) {
      setReconnectAttempts(prev => prev + 1);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log(`Reconnection attempt ${reconnectAttempts + 1}/${maxReconnectAttempts}`);
        socketInstance.connect();
      }, reconnectDelay * Math.pow(2, reconnectAttempts)); // Exponential backoff
    } else {
      setConnectionError('Maximum reconnection attempts exceeded');
      toast.error('Connection lost. Please refresh the page.');
    }
  };

  // Start ping interval to check connection health
  const startPingInterval = (socketInstance) => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    
    pingIntervalRef.current = setInterval(() => {
      if (socketInstance && socketInstance.connected) {
        socketInstance.emit('ping', { timestamp: Date.now() });
      }
    }, 30000); // Ping every 30 seconds
  };

  // Socket event helpers
  const emit = (event, data) => {
    if (socket && socket.connected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
      toast.error('Not connected to server');
    }
  };

  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  // Manual reconnection
  const reconnect = () => {
    if (socket) {
      setReconnectAttempts(0);
      socket.connect();
    }
  };

  // Get connection status
  const getConnectionStatus = () => {
    if (!socket) return 'disconnected';
    if (socket.connected) return 'connected';
    if (socket.connecting) return 'connecting';
    return 'disconnected';
  };

  // Get connection health
  const getConnectionHealth = () => {
    if (!lastPing) return 'unknown';
    
    const now = new Date();
    const timeSinceLastPing = now - lastPing;
    
    if (timeSinceLastPing < 60000) return 'good'; // Less than 1 minute
    if (timeSinceLastPing < 180000) return 'fair'; // Less than 3 minutes
    return 'poor'; // More than 3 minutes
  };

  const value = {
    socket,
    isConnected,
    connectionError,
    reconnectAttempts,
    lastPing,
    maxReconnectAttempts,
    
    // Methods
    emit,
    on,
    off,
    reconnect,
    getConnectionStatus,
    getConnectionHealth,
    
    // Connection info
    connectionStatus: getConnectionStatus(),
    connectionHealth: getConnectionHealth(),
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
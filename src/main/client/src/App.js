/**
 * RichMan 主應用程序組件
 * 處理路由、全域狀態管理和主要佈局
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Context hooks
import { useSocket } from './contexts/SocketContext';
import { usePlayer } from './contexts/PlayerContext';
import { useGame } from './contexts/GameContext';
import { useTheme } from './contexts/ThemeContext';

// Components
import LoadingScreen from './components/common/LoadingScreen';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotificationSystem from './components/common/NotificationSystem';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LobbyPage from './pages/LobbyPage';
import RoomPage from './pages/RoomPage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import NotFoundPage from './pages/NotFoundPage';

// Styles
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.background.primary};
  color: ${props => props.theme.text.primary};
  transition: all 0.3s ease;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PageContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

function App() {
  const { socket, isConnected, connectionError } = useSocket();
  const { player, isAuthenticated, isLoading: playerLoading } = usePlayer();
  const { gameState, isInGame } = useGame();
  const { theme, isDarkMode } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for socket connection
        if (socket && isConnected) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('App initialization error:', error);
        toast.error('Failed to initialize application');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [socket, isConnected]);

  // Handle connection errors
  useEffect(() => {
    if (connectionError) {
      toast.error('Connection lost. Attempting to reconnect...');
    }
  }, [connectionError]);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification) => {
      switch (notification.type) {
        case 'success':
          toast.success(notification.message);
          break;
        case 'error':
          toast.error(notification.message);
          break;
        case 'warning':
          toast(notification.message, { icon: '⚠️' });
          break;
        case 'info':
        default:
          toast(notification.message, { icon: 'ℹ️' });
          break;
      }
    };

    const handleError = (error) => {
      console.error('Socket error:', error);
      toast.error(error.message || 'An unexpected error occurred');
    };

    socket.on('notification', handleNotification);
    socket.on('error', handleError);

    return () => {
      socket.off('notification', handleNotification);
      socket.off('error', handleError);
    };
  }, [socket]);

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (playerLoading) {
      return <LoadingScreen message="Authenticating..." />;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  // Game route wrapper
  const GameRoute = ({ children }) => {
    return (
      <ProtectedRoute>
        {isInGame ? children : <Navigate to="/lobby" replace />}
      </ProtectedRoute>
    );
  };

  if (isLoading) {
    return <LoadingScreen message="Connecting to game server..." />;
  }

  return (
    <ErrorBoundary>
      <AppContainer theme={theme}>
        <Header
          player={player}
          isAuthenticated={isAuthenticated}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
          theme={theme}
        />
        
        <MainContent>
          <ContentArea>
            <AnimatePresence>
              {sidebarOpen && (
                <Sidebar
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  player={player}
                  isInGame={isInGame}
                  gameState={gameState}
                  theme={theme}
                />
              )}
            </AnimatePresence>
            
            <PageContainer>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route 
                  path="/login" 
                  element={isAuthenticated ? <Navigate to="/lobby" replace /> : <LoginPage />} 
                />
                <Route path="/help" element={<HelpPage />} />
                
                {/* Protected routes */}
                <Route 
                  path="/lobby" 
                  element={
                    <ProtectedRoute>
                      <LobbyPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/room/:roomId" 
                  element={
                    <ProtectedRoute>
                      <RoomPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Game routes */}
                <Route 
                  path="/game/:gameId" 
                  element={
                    <GameRoute>
                      <GamePage />
                    </GameRoute>
                  } 
                />
                
                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PageContainer>
          </ContentArea>
        </MainContent>
        
        <Footer theme={theme} />
        
        {/* Notification system */}
        <AnimatePresence>
          {showNotifications && (
            <NotificationSystem
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              theme={theme}
            />
          )}
        </AnimatePresence>
      </AppContainer>
    </ErrorBoundary>
  );
}

export default App;
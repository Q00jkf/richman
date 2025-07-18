/**
 * RichMan Client Entry Point
 * 線上多人大富翁遊戲客戶端入口
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Global styles
import './styles/global.css';

// Context providers
import { SocketProvider } from './contexts/SocketContext';
import { GameProvider } from './contexts/GameContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Toast notifications
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <PlayerProvider>
          <SocketProvider>
            <GameProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                    fontFamily: 'Poppins, sans-serif'
                  },
                  success: {
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </GameProvider>
          </SocketProvider>
        </PlayerProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Report web vitals
  const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      });
    }
  };
  
  reportWebVitals(console.log);
}

// Hot module replacement for development
if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <ThemeProvider>
            <PlayerProvider>
              <SocketProvider>
                <GameProvider>
                  <NextApp />
                  <Toaster />
                </GameProvider>
              </SocketProvider>
            </PlayerProvider>
          </ThemeProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  });
}
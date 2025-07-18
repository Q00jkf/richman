/**
 * 主題管理 Context
 * 管理應用程式主題和樣式
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// 主題定義
const themes = {
  light: {
    name: 'light',
    displayName: '淺色主題',
    colors: {
      // 主要顏色
      primary: '#1976d2',
      primaryLight: '#42a5f5',
      primaryDark: '#1565c0',
      
      // 次要顏色
      secondary: '#dc004e',
      secondaryLight: '#f50057',
      secondaryDark: '#c51162',
      
      // 背景顏色
      background: '#ffffff',
      surface: '#f5f5f5',
      paper: '#ffffff',
      
      // 文字顏色
      text: {
        primary: '#212121',
        secondary: '#757575',
        disabled: '#bdbdbd'
      },
      
      // 狀態顏色
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      
      // 遊戲相關顏色
      board: '#e8f5e8',
      space: {
        start: '#4caf50',
        property: '#ffffff',
        railroad: '#607d8b',
        utility: '#ffeb3b',
        chance: '#ff9800',
        communityChest: '#ffc107',
        tax: '#f44336',
        jail: '#9e9e9e',
        freeParking: '#4caf50'
      },
      
      // 地產組顏色
      propertyGroups: {
        brown: '#8b4513',
        lightBlue: '#87ceeb',
        pink: '#ffc0cb',
        orange: '#ffa500',
        red: '#f44336',
        yellow: '#ffeb3b',
        green: '#4caf50',
        darkBlue: '#1976d2'
      }
    },
    
    shadows: {
      small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      medium: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      large: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
    },
    
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '16px',
      round: '50%'
    }
  },
  
  dark: {
    name: 'dark',
    displayName: '深色主題',
    colors: {
      // 主要顏色
      primary: '#90caf9',
      primaryLight: '#e3f2fd',
      primaryDark: '#42a5f5',
      
      // 次要顏色
      secondary: '#f48fb1',
      secondaryLight: '#fce4ec',
      secondaryDark: '#e91e63',
      
      // 背景顏色
      background: '#121212',
      surface: '#1e1e1e',
      paper: '#2d2d2d',
      
      // 文字顏色
      text: {
        primary: '#ffffff',
        secondary: '#b3b3b3',
        disabled: '#666666'
      },
      
      // 狀態顏色
      success: '#66bb6a',
      warning: '#ffb74d',
      error: '#f87171',
      info: '#64b5f6',
      
      // 遊戲相關顏色
      board: '#1a1a1a',
      space: {
        start: '#66bb6a',
        property: '#2d2d2d',
        railroad: '#78909c',
        utility: '#fff176',
        chance: '#ffb74d',
        communityChest: '#ffd54f',
        tax: '#f87171',
        jail: '#9e9e9e',
        freeParking: '#66bb6a'
      },
      
      // 地產組顏色
      propertyGroups: {
        brown: '#a0522d',
        lightBlue: '#87ceeb',
        pink: '#f8bbd9',
        orange: '#ffb347',
        red: '#ff6b6b',
        yellow: '#fff176',
        green: '#66bb6a',
        darkBlue: '#64b5f6'
      }
    },
    
    shadows: {
      small: '0 1px 3px rgba(255,255,255,0.12), 0 1px 2px rgba(255,255,255,0.24)',
      medium: '0 3px 6px rgba(255,255,255,0.16), 0 3px 6px rgba(255,255,255,0.23)',
      large: '0 10px 20px rgba(255,255,255,0.19), 0 6px 6px rgba(255,255,255,0.23)'
    },
    
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '16px',
      round: '50%'
    }
  }
};

// Context 創建
const ThemeContext = createContext();

// Provider 組件
export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [systemPreference, setSystemPreference] = useState('light');

  // 檢測系統偏好
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };
    
    // 初始設置
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');
    
    // 監聽變化
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // 從本地存儲載入主題
  useEffect(() => {
    const savedTheme = localStorage.getItem('richman-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else {
      // 如果沒有保存的主題，使用系統偏好
      setCurrentTheme(systemPreference);
    }
  }, [systemPreference]);

  // 應用主題到 CSS 變量
  useEffect(() => {
    const theme = themes[currentTheme];
    if (!theme) return;

    const root = document.documentElement;
    
    // 設置 CSS 變量
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--color-primary-dark', theme.colors.primaryDark);
    
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-secondary-light', theme.colors.secondaryLight);
    root.style.setProperty('--color-secondary-dark', theme.colors.secondaryDark);
    
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-paper', theme.colors.paper);
    
    root.style.setProperty('--color-text-primary', theme.colors.text.primary);
    root.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
    root.style.setProperty('--color-text-disabled', theme.colors.text.disabled);
    
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-error', theme.colors.error);
    root.style.setProperty('--color-info', theme.colors.info);
    
    root.style.setProperty('--shadow-small', theme.shadows.small);
    root.style.setProperty('--shadow-medium', theme.shadows.medium);
    root.style.setProperty('--shadow-large', theme.shadows.large);
    
    root.style.setProperty('--border-radius-small', theme.borderRadius.small);
    root.style.setProperty('--border-radius-medium', theme.borderRadius.medium);
    root.style.setProperty('--border-radius-large', theme.borderRadius.large);
    
    // 設置 body 背景色
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text.primary;
    
    // 添加主題類名
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '') + ` theme-${currentTheme}`;
  }, [currentTheme]);

  // 主題切換函數
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('richman-theme', themeName);
    }
  };

  // 獲取當前主題對象
  const theme = themes[currentTheme];

  // 工具函數
  const utils = {
    // 獲取地產組顏色
    getPropertyGroupColor: (group) => {
      return theme.colors.propertyGroups[group] || theme.colors.text.secondary;
    },
    
    // 獲取格子顏色
    getSpaceColor: (spaceType) => {
      return theme.colors.space[spaceType] || theme.colors.surface;
    },
    
    // 根據亮度調整顏色
    adjustBrightness: (color, percent) => {
      const num = parseInt(color.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      
      return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
    },
    
    // 獲取對比色
    getContrastColor: (bgColor) => {
      const color = bgColor.replace('#', '');
      const r = parseInt(color.substr(0, 2), 16);
      const g = parseInt(color.substr(2, 2), 16);
      const b = parseInt(color.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      return brightness > 128 ? theme.colors.text.primary : '#ffffff';
    }
  };

  const contextValue = {
    // 當前主題信息
    currentTheme,
    theme,
    systemPreference,
    isDark: currentTheme === 'dark',
    
    // 可用主題
    availableThemes: Object.keys(themes),
    themes,
    
    // 主題控制函數
    toggleTheme,
    setTheme,
    
    // 工具函數
    ...utils
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
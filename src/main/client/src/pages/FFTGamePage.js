/**
 * FFT Game Page Component
 * 
 * 展示 FFT 卡牌機率系統的遊戲界面
 * 包含卡牌分析、機率可視化、遊戲操作等功能
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Contexts
import { useFFT } from '../contexts/FFTContext';
import { useTheme } from '../contexts/ThemeContext';

// Components
import LoadingScreen from '../components/common/LoadingScreen';
import ErrorMessage from '../components/common/ErrorMessage';

// Styled Components
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${props => props.theme.background.primary};
  color: ${props => props.theme.text.primary};
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: ${props => props.theme.background.secondary};
  border-bottom: 2px solid ${props => props.theme.border.primary};
`;

const GameTitle = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.primary.main};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.connected ? '#4CAF50' : '#F44336'};
  }
  
  .status-text {
    font-size: 0.9rem;
    color: ${props => props.theme.text.secondary};
  }
`;

const GameContent = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
  
  @media (max-width: 1200px) {
    grid-template-columns: 250px 1fr 250px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
`;

const SidePanel = styled.div`
  background: ${props => props.theme.background.secondary};
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  border: 1px solid ${props => props.theme.border.primary};
`;

const MainGameArea = styled.div`
  background: ${props => props.theme.background.card};
  border-radius: 12px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.border.primary};
`;

const PlayerControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-weight: 600;
    color: ${props => props.theme.text.primary};
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border.primary};
  background: ${props => props.theme.background.input};
  color: ${props => props.theme.text.primary};
  font-size: 1rem;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: ${props => props.variant === 'secondary' 
    ? props.theme.secondary.main 
    : props.theme.primary.main};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
`;

const GameStatus = styled.div`
  background: ${props => props.theme.background.secondary};
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  h3 {
    margin: 0 0 15px 0;
    color: ${props => props.theme.text.primary};
  }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
`;

const CardItem = styled(motion.div)`
  padding: 12px;
  background: ${props => props.theme.background.card};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.background.hover};
    transform: translateX(5px);
  }
  
  .card-id {
    font-size: 0.8rem;
    color: ${props => props.theme.text.secondary};
  }
  
  .card-name {
    font-weight: 600;
    margin: 5px 0;
    color: ${props => props.theme.text.primary};
  }
  
  .card-type {
    font-size: 0.9rem;
    color: ${props => props.theme.primary.main};
  }
`;

const DiceArea = styled.div`
  text-align: center;
  padding: 40px;
  background: ${props => props.theme.background.secondary};
  border-radius: 12px;
  margin: 20px 0;
`;

const DiceResult = styled(motion.div)`
  font-size: 4rem;
  font-weight: bold;
  color: ${props => props.theme.primary.main};
  margin: 20px 0;
`;

const RollHistory = styled.div`
  h4 {
    color: ${props => props.theme.text.primary};
    margin-bottom: 15px;
  }
`;

const HistoryItem = styled.div`
  padding: 10px;
  background: ${props => props.theme.background.card};
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  .turn {
    color: ${props => props.theme.text.secondary};
    font-weight: 600;
  }
  
  .result {
    color: ${props => props.theme.text.primary};
    margin-top: 4px;
  }
`;

function FFTGamePage() {
  const { theme } = useTheme();
  const {
    isConnected,
    isLoading,
    error,
    availableCards,
    currentGame,
    lastRollResult,
    gameHistory,
    playerBackground,
    createGame,
    rollDice,
    setPlayerBackground,
    clearError
  } = useFFT();

  const [selectedCardId, setSelectedCardId] = useState('');
  const [showDiceAnimation, setShowDiceAnimation] = useState(false);

  // 處理創建遊戲
  const handleCreateGame = useCallback(async () => {
    const game = await createGame();
    if (game) {
      toast.success(`Game created! Game ID: ${game.gameId}`);
    }
  }, [createGame]);

  // 處理擲骰子
  const handleRollDice = useCallback(async () => {
    if (!currentGame) {
      toast.error('No active game found');
      return;
    }

    setShowDiceAnimation(true);
    const result = await rollDice(currentGame.gameId);
    
    setTimeout(() => {
      setShowDiceAnimation(false);
      if (result) {
        toast.success(`Rolled ${result.diceResult}! Got card: ${result.card?.name || 'Unknown'}`);
      }
    }, 1500);
  }, [currentGame, rollDice]);

  // 處理背景變更
  const handleBackgroundChange = (e) => {
    setPlayerBackground(e.target.value);
  };

  // 處理卡牌選擇
  const handleCardSelect = (cardId) => {
    setSelectedCardId(cardId);
  };

  // 清除錯誤
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (isLoading && !currentGame) {
    return <LoadingScreen message="Loading FFT Game System..." />;
  }

  return (
    <GameContainer theme={theme}>
      <GameHeader theme={theme}>
        <GameTitle theme={theme}>
          🔬 RichMan FFT System
        </GameTitle>
        <StatusIndicator connected={isConnected} theme={theme}>
          <div className="status-dot" />
          <div className="status-text">
            {isConnected ? 'Connected to FFT API' : 'Disconnected'}
          </div>
        </StatusIndicator>
      </GameHeader>

      <GameContent theme={theme}>
        {/* Left Panel - Game Controls */}
        <SidePanel theme={theme}>
          <h3>Game Controls</h3>
          
          <PlayerControls>
            <ControlGroup>
              <label>Player Background:</label>
              <Select 
                theme={theme}
                value={playerBackground} 
                onChange={handleBackgroundChange}
              >
                <option value="conservative">Conservative (Safe)</option>
                <option value="balanced">Balanced (Normal)</option>
                <option value="aggressive">Aggressive (Risky)</option>
              </Select>
            </ControlGroup>
            
            <Button
              theme={theme}
              onClick={handleCreateGame}
              disabled={isLoading || !isConnected}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentGame ? 'New Game' : 'Start Game'}
            </Button>
            
            {currentGame && (
              <Button
                theme={theme}
                variant="secondary"
                onClick={handleRollDice}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🎲 Roll Dice
              </Button>
            )}
          </PlayerControls>

          {error && (
            <ErrorMessage 
              message={error} 
              onClose={clearError}
              theme={theme}
            />
          )}

          {/* Available Cards */}
          <div style={{ marginTop: '30px' }}>
            <h4>Available Cards ({availableCards.length})</h4>
            <CardList>
              {availableCards.map((card) => (
                <CardItem
                  key={card.id}
                  theme={theme}
                  onClick={() => handleCardSelect(card.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: selectedCardId === card.id 
                      ? theme.primary.light 
                      : theme.background.card
                  }}
                >
                  <div className="card-id">{card.id}</div>
                  <div className="card-name">{card.name}</div>
                  <div className="card-type">{card.type}</div>
                </CardItem>
              ))}
            </CardList>
          </div>
        </SidePanel>

        {/* Main Game Area */}
        <MainGameArea theme={theme}>
          {currentGame ? (
            <>
              <GameStatus theme={theme}>
                <h3>Current Game</h3>
                <p><strong>Game ID:</strong> {currentGame.gameId}</p>
                <p><strong>Background:</strong> {currentGame.playerBackground}</p>
                <p><strong>Selected Cards:</strong> {currentGame.selectedCards?.length || 0}</p>
                <p><strong>Status:</strong> {currentGame.status}</p>
              </GameStatus>

              <DiceArea theme={theme}>
                <h3>Dice Roll</h3>
                <AnimatePresence>
                  {showDiceAnimation ? (
                    <DiceResult
                      as={motion.div}
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🎲
                    </DiceResult>
                  ) : lastRollResult ? (
                    <DiceResult
                      as={motion.div}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {lastRollResult.diceResult}
                    </DiceResult>
                  ) : (
                    <DiceResult theme={theme}>?</DiceResult>
                  )}
                </AnimatePresence>
                
                {lastRollResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                  >
                    <h4>Last Result:</h4>
                    <p><strong>Card:</strong> {lastRollResult.card?.name || 'Unknown'}</p>
                    <p><strong>Type:</strong> {lastRollResult.card?.type || 'N/A'}</p>
                  </motion.div>
                )}
              </DiceArea>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <h2>Welcome to RichMan FFT System</h2>
              <p>Start a new game to experience the FFT Card Probability System</p>
              {!isConnected && (
                <p style={{ color: theme.error.main, marginTop: '20px' }}>
                  ⚠️ Not connected to FFT API server
                </p>
              )}
            </div>
          )}
        </MainGameArea>

        {/* Right Panel - Game History */}
        <SidePanel theme={theme}>
          <RollHistory>
            <h4>Roll History ({gameHistory.length})</h4>
            {gameHistory.length === 0 ? (
              <p style={{ color: theme.text.secondary, fontStyle: 'italic' }}>
                No rolls yet
              </p>
            ) : (
              gameHistory.slice(-10).reverse().map((roll, index) => (
                <HistoryItem key={index} theme={theme}>
                  <div className="turn">Turn {roll.turn}</div>
                  <div className="result">
                    Dice: {roll.diceResult} → {roll.card?.name || 'Unknown'}
                  </div>
                </HistoryItem>
              ))
            )}
          </RollHistory>

          {/* Position Assignments */}
          {currentGame?.positionAssignments && (
            <div style={{ marginTop: '30px' }}>
              <h4>Position Assignments</h4>
              {Object.entries(currentGame.positionAssignments).map(([position, cardId]) => (
                <div key={position} style={{ 
                  padding: '8px', 
                  background: theme.background.card,
                  borderRadius: '4px',
                  margin: '4px 0',
                  fontSize: '0.9rem'
                }}>
                  <strong>Pos {position}:</strong> {cardId}
                </div>
              ))}
            </div>
          )}
        </SidePanel>
      </GameContent>
    </GameContainer>
  );
}

export default FFTGamePage;
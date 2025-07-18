/**
 * 遊戲引擎 - 核心遊戲邏輯實現
 * 負責遊戲規則、狀態管理、動作處理
 */

const { v4: uuidv4 } = require('uuid');
const { GamePhase, GameActionType, GameEventType } = require('../../../shared/constants/GameConstants');
const { STANDARD_BOARD_SPACES, STANDARD_PROPERTY_GROUPS } = require('../../../shared/constants/BoardConstants');
const { CHANCE_CARDS, COMMUNITY_CHEST_CARDS } = require('../../../shared/constants/CardConstants');

class GameEngine {
  constructor(gameId, roomId, settings = {}) {
    this.gameId = gameId;
    this.roomId = roomId;
    this.settings = this.initializeSettings(settings);
    this.gameState = this.initializeGameState();
    this.eventHandlers = new Map();
    
    this.initializeDecks();
    this.initializeEventHandlers();
  }

  initializeSettings(customSettings) {
    return {
      maxPlayers: 4,
      startingMoney: 1500,
      salaryAmount: 200,
      jailFine: 50,
      freeParkingBonus: 0,
      enableHouseRules: false,
      enableAuction: true,
      enableTrade: true,
      timeLimit: 120, // 秒
      ...customSettings
    };
  }

  initializeGameState() {
    return {
      id: this.gameId,
      players: [],
      board: {
        spaces: STANDARD_BOARD_SPACES,
        propertyGroups: STANDARD_PROPERTY_GROUPS
      },
      currentPlayerIndex: 0,
      gamePhase: GamePhase.WAITING,
      roundNumber: 0,
      diceResult: null,
      lastAction: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: this.settings
    };
  }

  initializeDecks() {
    this.chanceCards = [...CHANCE_CARDS];
    this.communityChestCards = [...COMMUNITY_CHEST_CARDS];
    this.shuffleDecks();
  }

  shuffleDecks() {
    this.chanceCards = this.shuffleArray(this.chanceCards);
    this.communityChestCards = this.shuffleArray(this.communityChestCards);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  initializeEventHandlers() {
    this.on(GameEventType.DICE_ROLLED, this.handleDiceRolled.bind(this));
    this.on(GameEventType.PLAYER_MOVED, this.handlePlayerMoved.bind(this));
    this.on(GameEventType.PROPERTY_BOUGHT, this.handlePropertyBought.bind(this));
    this.on(GameEventType.RENT_PAID, this.handleRentPaid.bind(this));
    this.on(GameEventType.CARD_DRAWN, this.handleCardDrawn.bind(this));
  }

  /**
   * 玩家管理
   */
  async addPlayer(player) {
    if (this.gameState.gamePhase !== GamePhase.WAITING) {
      return { success: false, message: 'Game already started' };
    }

    if (this.gameState.players.length >= this.settings.maxPlayers) {
      return { success: false, message: 'Game is full' };
    }

    if (this.gameState.players.find(p => p.id === player.id)) {
      return { success: false, message: 'Player already in game' };
    }

    const gamePlayer = {
      id: player.id,
      name: player.name,
      avatar: player.avatar || '',
      money: this.settings.startingMoney,
      position: 0,
      properties: [],
      jailStatus: {
        isInJail: false,
        turnsInJail: 0,
        canPayFine: false,
        hasGetOutOfJailCard: false,
        jailReason: 'none'
      },
      isActive: true,
      isBankrupt: false,
      connectionStatus: 'connected',
      stats: this.initializePlayerStats(),
      role: player.role || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.gameState.players.push(gamePlayer);
    this.updateGameState();

    return { success: true, player: gamePlayer };
  }

  async removePlayer(playerId) {
    const playerIndex = this.gameState.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      return { success: false, message: 'Player not found' };
    }

    const player = this.gameState.players[playerIndex];
    
    if (this.gameState.gamePhase === GamePhase.PLAYING) {
      // 遊戲中離開，處理破產
      await this.handlePlayerBankruptcy(playerId);
    } else {
      // 等待中離開，直接移除
      this.gameState.players.splice(playerIndex, 1);
      
      // 調整當前玩家索引
      if (this.gameState.currentPlayerIndex > playerIndex) {
        this.gameState.currentPlayerIndex--;
      }
    }

    this.updateGameState();
    return { success: true };
  }

  initializePlayerStats() {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      totalMoneyEarned: 0,
      totalRentCollected: 0,
      totalRentPaid: 0,
      propertiesBought: 0,
      housesBuilt: 0,
      hotelsBuilt: 0,
      timesInJail: 0,
      bankruptcies: 0,
      averageGameTime: 0,
      winRate: 0
    };
  }

  /**
   * 遊戲控制
   */
  async startGame(hostPlayerId) {
    if (this.gameState.gamePhase !== GamePhase.WAITING) {
      return { success: false, message: 'Game already started' };
    }

    if (this.gameState.players.length < 2) {
      return { success: false, message: 'Need at least 2 players' };
    }

    // 隨機決定先手順序
    this.gameState.players = this.shuffleArray(this.gameState.players);
    this.gameState.currentPlayerIndex = 0;
    this.gameState.gamePhase = GamePhase.STARTING;
    this.gameState.roundNumber = 1;

    this.updateGameState();

    // 開始第一個玩家的回合
    setTimeout(() => {
      this.startPlayerTurn();
    }, 1000);

    return { success: true };
  }

  startPlayerTurn() {
    this.gameState.gamePhase = GamePhase.PLAYER_TURN;
    this.updateGameState();

    const currentPlayer = this.getCurrentPlayer();
    this.emit(GameEventType.TURN_STARTED, {
      gameId: this.gameId,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      roundNumber: this.gameState.roundNumber
    });

    // 設置回合計時器
    this.setTurnTimer();
  }

  setTurnTimer() {
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
    }

    this.turnTimer = setTimeout(() => {
      console.log(`⏰ Turn timeout for player ${this.getCurrentPlayer().id}`);
      this.endPlayerTurn();
    }, this.settings.timeLimit * 1000);
  }

  endPlayerTurn() {
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }

    // 檢查勝負
    if (this.checkWinCondition()) {
      this.endGame();
      return;
    }

    // 切換到下一個玩家
    this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
    
    // 如果回到第一個玩家，增加回合數
    if (this.gameState.currentPlayerIndex === 0) {
      this.gameState.roundNumber++;
    }

    this.startPlayerTurn();
  }

  /**
   * 玩家動作處理
   */
  async processPlayerAction(playerId, action) {
    const player = this.getPlayer(playerId);
    if (!player) {
      return { success: false, message: 'Player not found' };
    }

    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.id !== playerId) {
      return { success: false, message: 'Not your turn' };
    }

    try {
      switch (action.type) {
        case GameActionType.ROLL_DICE:
          return await this.handleRollDice(playerId);
        case GameActionType.BUY_PROPERTY:
          return await this.handleBuyProperty(playerId, action.data);
        case GameActionType.BUILD_HOUSE:
          return await this.handleBuildHouse(playerId, action.data);
        case GameActionType.BUILD_HOTEL:
          return await this.handleBuildHotel(playerId, action.data);
        case GameActionType.PAY_JAIL_FINE:
          return await this.handlePayJailFine(playerId);
        case GameActionType.USE_GET_OUT_OF_JAIL_CARD:
          return await this.handleUseGetOutOfJailCard(playerId);
        case GameActionType.END_TURN:
          return await this.handleEndTurn(playerId);
        default:
          return { success: false, message: 'Unknown action type' };
      }
    } catch (error) {
      console.error('Error processing player action:', error);
      return { success: false, message: 'Internal error' };
    }
  }

  async handleRollDice(playerId) {
    if (this.gameState.gamePhase !== GamePhase.PLAYER_TURN) {
      return { success: false, message: 'Cannot roll dice now' };
    }

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    const isDouble = dice1 === dice2;

    const diceResult = {
      dice1,
      dice2,
      total,
      isDouble,
      rollTime: new Date()
    };

    this.gameState.diceResult = diceResult;
    this.gameState.gamePhase = GamePhase.DICE_ROLLING;
    this.updateGameState();

    this.emit(GameEventType.DICE_ROLLED, {
      gameId: this.gameId,
      playerId,
      diceResult
    });

    // 移動玩家
    setTimeout(() => {
      this.movePlayer(playerId, total);
    }, 1000);

    return { success: true, diceResult };
  }

  async movePlayer(playerId, spaces) {
    const player = this.getPlayer(playerId);
    const oldPosition = player.position;
    const newPosition = (oldPosition + spaces) % 40;

    player.position = newPosition;
    this.gameState.gamePhase = GamePhase.MOVING;
    this.updateGameState();

    // 檢查是否經過起點
    if (newPosition < oldPosition) {
      this.collectSalary(playerId);
    }

    this.emit(GameEventType.PLAYER_MOVED, {
      gameId: this.gameId,
      playerId,
      oldPosition,
      newPosition,
      spaces
    });

    // 處理落地效果
    setTimeout(() => {
      this.handleLandingEffect(playerId, newPosition);
    }, 1000);
  }

  collectSalary(playerId) {
    const player = this.getPlayer(playerId);
    let salaryAmount = this.settings.salaryAmount;

    // 檢查角色加成
    if (player.role && player.role.id === 'banker') {
      salaryAmount += 50; // 銀行家額外獎勵
    }

    player.money += salaryAmount;
    player.stats.totalMoneyEarned += salaryAmount;
    this.updateGameState();

    this.emit(GameEventType.SALARY_COLLECTED, {
      gameId: this.gameId,
      playerId,
      amount: salaryAmount
    });
  }

  async handleLandingEffect(playerId, position) {
    const space = this.gameState.board.spaces[position];
    const player = this.getPlayer(playerId);

    switch (space.type) {
      case 'property':
        await this.handlePropertyLanding(playerId, space);
        break;
      case 'railroad':
        await this.handleRailroadLanding(playerId, space);
        break;
      case 'utility':
        await this.handleUtilityLanding(playerId, space);
        break;
      case 'chance':
        await this.handleChanceLanding(playerId);
        break;
      case 'community_chest':
        await this.handleCommunityChestLanding(playerId);
        break;
      case 'tax':
        await this.handleTaxLanding(playerId, space);
        break;
      case 'go_to_jail':
        await this.handleGoToJail(playerId);
        break;
      case 'free_parking':
        await this.handleFreeParkingLanding(playerId);
        break;
      default:
        // 其他格子，無特殊效果
        this.gameState.gamePhase = GamePhase.PLAYER_TURN;
        this.updateGameState();
        break;
    }
  }

  async handlePropertyLanding(playerId, space) {
    const property = this.getPropertyOwnership(space.id);
    
    if (!property) {
      // 無主地產，可以購買
      this.gameState.gamePhase = GamePhase.PROPERTY_ACTION;
      this.updateGameState();
      
      // 等待玩家決定是否購買
      // 在實際實現中，這裡會等待客戶端的回應
    } else if (property.ownerId !== playerId) {
      // 別人的地產，支付租金
      const rentAmount = this.calculateRent(space.id, property.ownerId);
      await this.payRent(playerId, property.ownerId, rentAmount);
    }
    
    // 如果是自己的地產，無事發生
    this.gameState.gamePhase = GamePhase.PLAYER_TURN;
    this.updateGameState();
  }

  /**
   * 工具方法
   */
  getCurrentPlayer() {
    return this.gameState.players[this.gameState.currentPlayerIndex];
  }

  getPlayer(playerId) {
    return this.gameState.players.find(p => p.id === playerId);
  }

  getPlayerCount() {
    return this.gameState.players.length;
  }

  getPlayers() {
    return this.gameState.players;
  }

  getGameState() {
    return this.gameState;
  }

  updateGameState() {
    this.gameState.updatedAt = new Date();
  }

  checkWinCondition() {
    const activePlayers = this.gameState.players.filter(p => !p.isBankrupt);
    return activePlayers.length <= 1;
  }

  endGame() {
    this.gameState.gamePhase = GamePhase.GAME_OVER;
    const winner = this.gameState.players.find(p => !p.isBankrupt);
    
    this.emit(GameEventType.GAME_ENDED, {
      gameId: this.gameId,
      winnerId: winner ? winner.id : null,
      winnerName: winner ? winner.name : null,
      endTime: new Date()
    });
    
    this.updateGameState();
  }

  /**
   * 事件系統
   */
  on(eventType, handler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType).push(handler);
  }

  emit(eventType, eventData) {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.forEach(handler => {
      try {
        handler(eventData);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    });
  }

  // 事件處理器實現
  handleDiceRolled(eventData) {
    console.log(`🎲 Dice rolled: ${eventData.diceResult.dice1}, ${eventData.diceResult.dice2} (${eventData.diceResult.total})`);
  }

  handlePlayerMoved(eventData) {
    console.log(`🚶 Player moved: ${eventData.playerId} from ${eventData.oldPosition} to ${eventData.newPosition}`);
  }

  handlePropertyBought(eventData) {
    console.log(`🏠 Property bought: ${eventData.propertyId} by ${eventData.playerId} for $${eventData.price}`);
  }

  handleRentPaid(eventData) {
    console.log(`💰 Rent paid: ${eventData.payerId} paid $${eventData.amount} to ${eventData.ownerId}`);
  }

  handleCardDrawn(eventData) {
    console.log(`🎴 Card drawn: ${eventData.cardId} by ${eventData.playerId}`);
  }

  /**
   * 統計和狀態
   */
  getGameStats() {
    return {
      gameId: this.gameId,
      totalTurns: this.gameState.roundNumber,
      totalTime: (new Date() - this.gameState.createdAt) / 1000,
      playerStats: this.gameState.players.map(p => ({
        playerId: p.id,
        totalMoney: p.money,
        propertiesOwned: p.properties.length,
        housesBuilt: p.properties.reduce((sum, prop) => sum + prop.houses, 0),
        hotelsBuilt: p.properties.reduce((sum, prop) => sum + prop.hotels, 0),
        rentCollected: p.stats.totalRentCollected,
        rentPaid: p.stats.totalRentPaid,
        timesInJail: p.stats.timesInJail,
        turnsPlayed: this.gameState.roundNumber
      })),
      winnerPlayerId: this.gameState.players.find(p => !p.isBankrupt)?.id,
      endReason: this.gameState.gamePhase === GamePhase.GAME_OVER ? 'winner' : 'in_progress',
      createdAt: this.gameState.createdAt,
      endedAt: this.gameState.gamePhase === GamePhase.GAME_OVER ? new Date() : null
    };
  }
}

module.exports = GameEngine;
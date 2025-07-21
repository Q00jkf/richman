/**
 * RichMan Game Service - FFT Card Probability System
 * 
 * Core service that integrates:
 * - FFT Card Probability System
 * - Card definitions and management  
 * - Game state management
 * - Position allocation logic
 */

const { SimpleFFTCardSystem } = require('../../shared/utils/fft-engine');
const { TestCards, getCardById, getAllCardIds } = require('../../shared/constants/cards');

class GameService {
    constructor() {
        this.fftSystem = new SimpleFFTCardSystem();
        this.games = new Map(); // Store active games
        
        // Game configuration
        this.config = {
            cardsPerGame: 11,
            positions: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            maxGames: 100,
            gameExpireTime: 24 * 60 * 60 * 1000 // 24 hours
        };
    }
    
    /**
     * Create a new game with random card selection and FFT probability calculation
     * @param {string} playerBackground - Player's background type
     * @param {string} playerId - Unique player identifier
     * @returns {object} - New game state
     */
    createGame(playerBackground = 'balanced', playerId = null) {
        const gameId = this.generateGameId();
        
        // Step 1: Randomly select 11 cards from the pool
        const selectedCardIds = this.selectRandomCards(this.config.cardsPerGame);
        
        // Step 2: Calculate FFT probabilities for each card
        const cardProbabilities = this.calculateCardProbabilities(selectedCardIds, playerBackground);
        
        // Step 3: Assign cards to positions using simple allocation
        const positionAssignments = this.assignCardsToPositions(cardProbabilities);
        
        // Step 4: Create game state
        const game = {
            id: gameId,
            playerId: playerId,
            playerBackground: playerBackground,
            status: 'active',
            createdAt: new Date().toISOString(),
            selectedCards: selectedCardIds,
            cardProbabilities: cardProbabilities,
            positionAssignments: positionAssignments,
            gameHistory: [],
            currentTurn: 1
        };
        
        this.games.set(gameId, game);
        this.cleanupExpiredGames();
        
        return {
            gameId: gameId,
            selectedCards: selectedCardIds.map(id => ({
                id: id,
                name: getCardById(id)?.name,
                type: getCardById(id)?.type
            })),
            positionAssignments: positionAssignments,
            playerBackground: playerBackground,
            status: 'created'
        };
    }
    
    /**
     * Get game state by ID
     * @param {string} gameId - Game identifier
     * @returns {object|null} - Game state or null if not found
     */
    getGame(gameId) {
        return this.games.get(gameId) || null;
    }
    
    /**
     * Simulate dice roll and return corresponding card
     * @param {string} gameId - Game identifier
     * @param {number} diceResult - Optional specific dice result (for testing)
     * @returns {object} - Roll result with card information
     */
    rollDice(gameId, diceResult = null) {
        const game = this.games.get(gameId);
        if (!game) {
            throw new Error(`Game ${gameId} not found`);
        }
        
        // Generate dice result if not specified
        const roll = diceResult || this.simulateDiceRoll();
        
        // Get card assigned to this position
        const assignedCardId = game.positionAssignments[roll];
        const card = getCardById(assignedCardId);
        
        // Record in game history
        const rollRecord = {
            turn: game.currentTurn,
            diceResult: roll,
            cardId: assignedCardId,
            cardName: card?.name,
            timestamp: new Date().toISOString()
        };
        
        game.gameHistory.push(rollRecord);
        game.currentTurn++;
        
        return {
            gameId: gameId,
            turn: rollRecord.turn,
            diceResult: roll,
            card: {
                id: assignedCardId,
                name: card?.name,
                type: card?.type,
                description: card?.description,
                effects: card?.effects
            },
            probability: game.cardProbabilities[assignedCardId]?.[roll - 2] // Convert to array index
        };
    }
    
    /**
     * Get probability analysis for a specific card
     * @param {string} cardId - Card identifier
     * @param {string} playerBackground - Player background type
     * @returns {object} - Detailed probability analysis
     */
    getCardProbabilityAnalysis(cardId, playerBackground = 'balanced') {
        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card ${cardId} not found`);
        }
        
        const baseDist = this.fftSystem.generateGaussian(
            card.baseDistribution.center,
            card.baseDistribution.sigma
        );
        
        const finalDist = this.fftSystem.generateCardProbability(
            card.baseDistribution.center,
            card.baseDistribution.sigma,
            playerBackground
        );
        
        const fftAnalysis = this.fftSystem.analyzeFFT(baseDist);
        const validation = this.fftSystem.validateDistribution(finalDist);
        
        return {
            cardId: cardId,
            cardName: card.name,
            playerBackground: playerBackground,
            baseDistribution: {
                values: baseDist,
                parameters: card.baseDistribution
            },
            filteredDistribution: {
                values: finalDist,
                validation: validation
            },
            fftAnalysis: {
                dominantFrequency: fftAnalysis.dominantFrequency,
                totalEnergy: fftAnalysis.totalEnergy,
                magnitudes: fftAnalysis.magnitudes
            },
            positionProbabilities: this.config.positions.map((pos, idx) => ({
                position: pos,
                probability: finalDist[idx],
                percentage: (finalDist[idx] * 100).toFixed(2) + '%'
            }))
        };
    }
    
    /**
     * Get game statistics and balance analysis
     * @returns {object} - System statistics
     */
    getSystemStats() {
        const activeGames = Array.from(this.games.values());
        
        return {
            totalGames: activeGames.length,
            gamesByBackground: this.aggregateByBackground(activeGames),
            cardUsageStats: this.calculateCardUsageStats(activeGames),
            averageGameLength: this.calculateAverageGameLength(activeGames),
            systemHealth: {
                memoryUsage: process.memoryUsage(),
                uptime: process.uptime(),
                timestamp: new Date().toISOString()
            }
        };
    }
    
    // =================== Private Methods ===================
    
    /**
     * Generate unique game ID
     */
    generateGameId() {
        return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Randomly select cards from the available pool (with replacement for testing)
     * @param {number} count - Number of cards to select
     * @returns {string[]} - Array of selected card IDs
     */
    selectRandomCards(count) {
        const allCardIds = getAllCardIds();
        const selected = [];
        
        // For testing phase: allow card reuse if needed
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * allCardIds.length);
            selected.push(allCardIds[randomIndex]);
        }
        
        return selected;
    }
    
    /**
     * Calculate FFT probabilities for all selected cards
     * @param {string[]} cardIds - Selected card IDs
     * @param {string} playerBackground - Player background type
     * @returns {object} - Card ID -> probability distribution mapping
     */
    calculateCardProbabilities(cardIds, playerBackground) {
        const probabilities = {};
        
        cardIds.forEach(cardId => {
            const card = getCardById(cardId);
            if (card) {
                probabilities[cardId] = this.fftSystem.generateCardProbability(
                    card.baseDistribution.center,
                    card.baseDistribution.sigma,
                    playerBackground
                );
            }
        });
        
        return probabilities;
    }
    
    /**
     * Assign cards to positions using simple greedy algorithm
     * @param {object} cardProbabilities - Card probability distributions
     * @returns {object} - Position -> Card ID mapping
     */
    assignCardsToPositions(cardProbabilities) {
        const assignments = {};
        const usedCards = new Set();
        
        // For each position (2-12), find the card with highest probability
        this.config.positions.forEach((position, posIndex) => {
            let bestCard = null;
            let bestProbability = -1;
            
            Object.entries(cardProbabilities).forEach(([cardId, probabilities]) => {
                if (!usedCards.has(cardId) && probabilities[posIndex] > bestProbability) {
                    bestProbability = probabilities[posIndex];
                    bestCard = cardId;
                }
            });
            
            if (bestCard) {
                assignments[position] = bestCard;
                usedCards.add(bestCard);
            }
        });
        
        return assignments;
    }
    
    /**
     * Simulate realistic dice roll (2 dice)
     * @returns {number} - Sum of two dice (2-12)
     */
    simulateDiceRoll() {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        return die1 + die2;
    }
    
    /**
     * Clean up expired games
     */
    cleanupExpiredGames() {
        const now = Date.now();
        const expiredGames = [];
        
        this.games.forEach((game, gameId) => {
            const gameAge = now - new Date(game.createdAt).getTime();
            if (gameAge > this.config.gameExpireTime) {
                expiredGames.push(gameId);
            }
        });
        
        expiredGames.forEach(gameId => {
            this.games.delete(gameId);
        });
        
        if (expiredGames.length > 0) {
            console.log(`🧹 Cleaned up ${expiredGames.length} expired games`);
        }
    }
    
    /**
     * Aggregate games by background type
     */
    aggregateByBackground(games) {
        const aggregated = {};
        games.forEach(game => {
            const bg = game.playerBackground;
            if (!aggregated[bg]) aggregated[bg] = 0;
            aggregated[bg]++;
        });
        return aggregated;
    }
    
    /**
     * Calculate card usage statistics
     */
    calculateCardUsageStats(games) {
        const usage = {};
        games.forEach(game => {
            game.selectedCards.forEach(cardId => {
                if (!usage[cardId]) usage[cardId] = 0;
                usage[cardId]++;
            });
        });
        return usage;
    }
    
    /**
     * Calculate average game length
     */
    calculateAverageGameLength(games) {
        if (games.length === 0) return 0;
        const totalTurns = games.reduce((sum, game) => sum + game.currentTurn - 1, 0);
        return Math.round(totalTurns / games.length);
    }
}

// Export the service
module.exports = GameService;

// Testing when run directly
if (require.main === module) {
    console.log('🎮 Testing RichMan Game Service...\n');
    
    const gameService = new GameService();
    
    // Test 1: Create a game
    console.log('Test 1: Create Game');
    const game = gameService.createGame('balanced', 'player_test_001');
    console.log('Game created:', {
        gameId: game.gameId,
        selectedCards: game.selectedCards.length,
        backgroundType: game.playerBackground
    });
    console.log();
    
    // Test 2: Analyze a specific card
    console.log('Test 2: Card Probability Analysis');
    const analysis = gameService.getCardProbabilityAnalysis('a-1', 'conservative');
    console.log('Card a-1 (台北大安) with conservative background:');
    console.log('Position probabilities:');
    analysis.positionProbabilities.forEach(pos => {
        console.log(`  Position ${pos.position}: ${pos.percentage}`);
    });
    console.log();
    
    // Test 3: Simulate dice rolls
    console.log('Test 3: Dice Roll Simulation');
    for (let i = 0; i < 3; i++) {
        const roll = gameService.rollDice(game.gameId);
        console.log(`Roll ${roll.turn}: Dice ${roll.diceResult} -> Card: ${roll.card.name} (${roll.card.type})`);
    }
    console.log();
    
    // Test 4: System statistics
    console.log('Test 4: System Statistics');
    const stats = gameService.getSystemStats();
    console.log('System stats:', {
        totalGames: stats.totalGames,
        gamesByBackground: stats.gamesByBackground,
        cardUsage: Object.keys(stats.cardUsageStats).length + ' unique cards used'
    });
    console.log();
    
    console.log('✅ Game Service tests completed successfully!');
}
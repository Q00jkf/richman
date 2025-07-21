/**
 * RichMan API Server - Entry Point
 * 
 * Express.js server with FFT Card Probability System
 * Deployed on Render for production use
 */

const express = require('express');
const cors = require('cors');
const GameService = require('./services/game-service');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const gameService = new GameService();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    next();
});

// =============== API Routes ===============

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'RichMan FFT Card Probability API',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        features: [
            'FFT Card Probability System',
            'Multi-background Player Support', 
            'Real-time Game Management',
            'Statistical Analysis'
        ]
    });
});

app.get('/health', (req, res) => {
    const stats = gameService.getSystemStats();
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        activeGames: stats.totalGames,
        timestamp: new Date().toISOString()
    });
});

// =============== Game Management ===============

/**
 * POST /api/game/start
 * Create a new game with FFT probability calculation
 */
app.post('/api/game/start', (req, res) => {
    try {
        const { playerBackground = 'balanced', playerId } = req.body;
        
        // Validate background type
        const validBackgrounds = ['conservative', 'balanced', 'aggressive'];
        if (!validBackgrounds.includes(playerBackground)) {
            return res.status(400).json({
                error: 'Invalid player background',
                validOptions: validBackgrounds
            });
        }
        
        // Create new game
        const game = gameService.createGame(playerBackground, playerId);
        
        res.status(201).json({
            success: true,
            message: 'Game created successfully',
            data: game
        });
        
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({
            error: 'Failed to create game',
            details: error.message
        });
    }
});

/**
 * GET /api/game/:gameId/state
 * Get current game state
 */
app.get('/api/game/:gameId/state', (req, res) => {
    try {
        const { gameId } = req.params;
        const game = gameService.getGame(gameId);
        
        if (!game) {
            return res.status(404).json({
                error: 'Game not found',
                gameId: gameId
            });
        }
        
        res.json({
            success: true,
            data: {
                gameId: game.id,
                playerBackground: game.playerBackground,
                status: game.status,
                currentTurn: game.currentTurn,
                createdAt: game.createdAt,
                selectedCards: game.selectedCards,
                positionAssignments: game.positionAssignments,
                gameHistory: game.gameHistory
            }
        });
        
    } catch (error) {
        console.error('Error getting game state:', error);
        res.status(500).json({
            error: 'Failed to get game state',
            details: error.message
        });
    }
});

/**
 * POST /api/game/:gameId/roll
 * Simulate dice roll and get corresponding card
 */
app.post('/api/game/:gameId/roll', (req, res) => {
    try {
        const { gameId } = req.params;
        const { diceResult } = req.body; // Optional for testing
        
        // Validate dice result if provided
        if (diceResult && (diceResult < 2 || diceResult > 12)) {
            return res.status(400).json({
                error: 'Invalid dice result',
                message: 'Dice result must be between 2 and 12'
            });
        }
        
        const rollResult = gameService.rollDice(gameId, diceResult);
        
        res.json({
            success: true,
            message: 'Dice rolled successfully',
            data: rollResult
        });
        
    } catch (error) {
        console.error('Error rolling dice:', error);
        const status = error.message.includes('not found') ? 404 : 500;
        res.status(status).json({
            error: 'Failed to roll dice',
            details: error.message
        });
    }
});

// =============== Card Analysis ===============

/**
 * GET /api/cards/:cardId/probability
 * Get detailed probability analysis for a specific card
 */
app.get('/api/cards/:cardId/probability', (req, res) => {
    try {
        const { cardId } = req.params;
        const { background = 'balanced' } = req.query;
        
        const analysis = gameService.getCardProbabilityAnalysis(cardId, background);
        
        res.json({
            success: true,
            data: analysis
        });
        
    } catch (error) {
        console.error('Error analyzing card probability:', error);
        const status = error.message.includes('not found') ? 404 : 500;
        res.status(status).json({
            error: 'Failed to analyze card probability',
            details: error.message
        });
    }
});

/**
 * GET /api/cards/list
 * Get list of all available cards
 */
app.get('/api/cards/list', (req, res) => {
    try {
        const { TestCards } = require('../shared/constants/cards');
        
        const cardList = Object.values(TestCards).map(card => ({
            id: card.id,
            name: card.name,
            nameEn: card.nameEn,
            type: card.type,
            category: card.category,
            description: card.description,
            baseDistribution: card.baseDistribution
        }));
        
        res.json({
            success: true,
            totalCards: cardList.length,
            data: cardList
        });
        
    } catch (error) {
        console.error('Error getting card list:', error);
        res.status(500).json({
            error: 'Failed to get card list',
            details: error.message
        });
    }
});

/**
 * POST /api/cards/simulate
 * Simulate card probability distributions for testing
 */
app.post('/api/cards/simulate', (req, res) => {
    try {
        const { cardIds, backgrounds = ['conservative', 'balanced', 'aggressive'] } = req.body;
        
        if (!cardIds || !Array.isArray(cardIds)) {
            return res.status(400).json({
                error: 'cardIds must be an array'
            });
        }
        
        const simulations = {};
        
        cardIds.forEach(cardId => {
            simulations[cardId] = {};
            backgrounds.forEach(background => {
                try {
                    simulations[cardId][background] = gameService.getCardProbabilityAnalysis(cardId, background);
                } catch (error) {
                    simulations[cardId][background] = { error: error.message };
                }
            });
        });
        
        res.json({
            success: true,
            data: simulations
        });
        
    } catch (error) {
        console.error('Error simulating card probabilities:', error);
        res.status(500).json({
            error: 'Failed to simulate card probabilities',
            details: error.message
        });
    }
});

// =============== Analytics ===============

/**
 * GET /api/analytics/system
 * Get system statistics and health metrics
 */
app.get('/api/analytics/system', (req, res) => {
    try {
        const stats = gameService.getSystemStats();
        
        res.json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Error getting system analytics:', error);
        res.status(500).json({
            error: 'Failed to get system analytics',
            details: error.message
        });
    }
});

// =============== Error Handling ===============

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        method: req.method,
        availableEndpoints: [
            'GET /',
            'GET /health',
            'POST /api/game/start',
            'GET /api/game/:gameId/state',
            'POST /api/game/:gameId/roll',
            'GET /api/cards/:cardId/probability',
            'GET /api/cards/list',
            'POST /api/cards/simulate',
            'GET /api/analytics/system'
        ]
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// =============== Server Start ===============

app.listen(PORT, () => {
    console.log('🚀 RichMan FFT Card Probability API Server');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🔬 FFT Engine initialized`);
    console.log(`🃏 ${Object.keys(require('./services/game-service')).length} test cards loaded`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    console.log();
    console.log('Available endpoints:');
    console.log('  GET     /                      - Service info');
    console.log('  GET     /health                - Health check');
    console.log('  POST    /api/game/start        - Create new game');
    console.log('  GET     /api/game/:id/state    - Get game state');
    console.log('  POST    /api/game/:id/roll     - Roll dice');
    console.log('  GET     /api/cards/:id/probability - Analyze card');
    console.log('  GET     /api/cards/list        - List all cards');
    console.log('  POST    /api/cards/simulate    - Simulate probabilities');
    console.log('  GET     /api/analytics/system  - System stats');
    console.log();
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
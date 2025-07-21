/**
 * RichMan Card Definitions - Test Set (10 cards)
 * 
 * This file defines the 10 test cards used in the MVP phase.
 * Each card has a unique ID and probability distribution parameters.
 * 
 * Card ID Format: [category]-[number]
 * Categories: a (property), c (item), ch (chance), dt (destiny)
 */

const TestCards = {
    // Property Cards (a-series) - Real estate locations
    "a-1": {
        id: "a-1",
        name: "台北大安",
        nameEn: "Taipei Daan",
        type: "property",
        category: "property",
        description: "台北市核心精華地段，穩定增值潛力",
        descriptionEn: "Core premium district in Taipei, stable appreciation potential",
        baseDistribution: {
            center: 7,      // Prefer center positions (moderate risk)
            sigma: 1.5,     // Moderate spread
            weight: 1.0     // Standard weight
        },
        effects: {
            rent: 200,
            buildCost: 500,
            maxLevel: 3
        }
    },
    
    "a-2": {
        id: "a-2", 
        name: "高雄美術館區",
        nameEn: "Kaohsiung Art District",
        type: "property",
        category: "property", 
        description: "南台灣文化精華區，發展潛力佳",
        descriptionEn: "Cultural hub in southern Taiwan, good development potential",
        baseDistribution: {
            center: 5,      // Prefer left side (lower risk)
            sigma: 1.2,     // Tighter distribution
            weight: 0.9     // Slightly lower weight
        },
        effects: {
            rent: 150,
            buildCost: 400,
            maxLevel: 3
        }
    },
    
    "a-3": {
        id: "a-3",
        name: "台中七期", 
        nameEn: "Taichung Qiqi",
        type: "property",
        category: "property",
        description: "台中新興商業區，高風險高報酬",
        descriptionEn: "Emerging business district in Taichung, high risk high return",
        baseDistribution: {
            center: 9,      // Prefer right side (higher risk)
            sigma: 2.0,     // Wider spread
            weight: 1.1     // Slightly higher weight
        },
        effects: {
            rent: 300,
            buildCost: 700,
            maxLevel: 4
        }
    },
    
    // Item Cards (c-series) - Tools and special abilities
    "c-1": {
        id: "c-1",
        name: "指定骰子道具",
        nameEn: "Dice Control Tool", 
        type: "item",
        category: "item",
        description: "可以指定下一次擲骰結果",
        descriptionEn: "Allows player to choose next dice roll result",
        baseDistribution: {
            center: 6.5,    // Uniform-like distribution
            sigma: 3.0,     // Very wide spread
            weight: 0.8     // Lower weight (rare item)
        },
        effects: {
            type: "dice_control",
            usageLimit: 1,
            duration: "immediate"
        }
    },
    
    "c-2": {
        id: "c-2",
        name: "免費建設卡",
        nameEn: "Free Construction Card",
        type: "item", 
        category: "item",
        description: "在擁有的地產上免費建設一次",
        descriptionEn: "Build one level for free on owned property",
        baseDistribution: {
            center: 8,      // Prefer higher numbers
            sigma: 1.8,     // Moderate spread
            weight: 0.7     // Rare item
        },
        effects: {
            type: "free_build",
            usageLimit: 1,
            duration: "immediate"
        }
    },
    
    "c-3": {
        id: "c-3",
        name: "租金加倍卡", 
        nameEn: "Double Rent Card",
        type: "item",
        category: "item",
        description: "下一次收租金時金額加倍",
        descriptionEn: "Double the rent amount for next collection",
        baseDistribution: {
            center: 4,      // Prefer lower numbers
            sigma: 1.6,     // Moderate spread  
            weight: 0.9     // Relatively common
        },
        effects: {
            type: "double_rent",
            usageLimit: 1,
            duration: "next_rent"
        }
    },
    
    // Chance Cards (ch-series) - Random events
    "ch-1": {
        id: "ch-1",
        name: "銀行錯誤對你有利",
        nameEn: "Bank Error in Your Favor",
        type: "chance",
        category: "chance",
        description: "收取 $200",
        descriptionEn: "Collect $200",
        baseDistribution: {
            center: 7.5,    // Slightly right of center
            sigma: 2.2,     // Wide distribution (random nature)
            weight: 1.0     // Standard weight
        },
        effects: {
            type: "money_gain",
            amount: 200,
            duration: "immediate"
        }
    },
    
    "ch-2": {
        id: "ch-2", 
        name: "所得稅繳納",
        nameEn: "Income Tax Payment",
        type: "chance",
        category: "chance",
        description: "繳納 $150 所得稅",
        descriptionEn: "Pay $150 income tax",
        baseDistribution: {
            center: 3.5,    // Prefer lower positions
            sigma: 1.9,     // Moderate spread
            weight: 1.0     // Standard weight
        },
        effects: {
            type: "money_loss",
            amount: 150,
            duration: "immediate"
        }
    },
    
    // Destiny Cards (dt-series) - Fate-based events
    "dt-1": {
        id: "dt-1",
        name: "前進到起點",
        nameEn: "Advance to Go",
        type: "destiny",
        category: "destiny", 
        description: "直接前進到起點並領取 $200",
        descriptionEn: "Move directly to Go and collect $200",
        baseDistribution: {
            center: 11,     // Prefer high numbers (big moves)
            sigma: 1.4,     // Tight distribution
            weight: 0.8     // Less common
        },
        effects: {
            type: "move_to_go",
            bonus: 200,
            duration: "immediate"
        }
    },
    
    "dt-2": {
        id: "dt-2",
        name: "退回三步",
        nameEn: "Go Back 3 Spaces", 
        type: "destiny",
        category: "destiny",
        description: "向後退三個位置",
        descriptionEn: "Move back 3 positions",
        baseDistribution: {
            center: 2.5,    // Prefer very low numbers
            sigma: 1.0,     // Tight distribution
            weight: 1.0     // Standard weight
        },
        effects: {
            type: "move_back",
            steps: 3,
            duration: "immediate"
        }
    }
};

// Card validation function
function validateCard(card) {
    const required = ['id', 'name', 'type', 'category', 'baseDistribution', 'effects'];
    const distributionRequired = ['center', 'sigma', 'weight'];
    
    // Check required fields
    for (const field of required) {
        if (!(field in card)) {
            throw new Error(`Card ${card.id || 'unknown'} missing required field: ${field}`);
        }
    }
    
    // Check distribution parameters
    for (const param of distributionRequired) {
        if (!(param in card.baseDistribution)) {
            throw new Error(`Card ${card.id} missing distribution parameter: ${param}`);
        }
    }
    
    // Validate parameter ranges
    const dist = card.baseDistribution;
    if (dist.center < 2 || dist.center > 12) {
        throw new Error(`Card ${card.id} center must be between 2-12, got ${dist.center}`);
    }
    if (dist.sigma <= 0 || dist.sigma > 5) {
        throw new Error(`Card ${card.id} sigma must be positive and <= 5, got ${dist.sigma}`);
    }
    if (dist.weight <= 0 || dist.weight > 2) {
        throw new Error(`Card ${card.id} weight must be between 0-2, got ${dist.weight}`);
    }
    
    return true;
}

// Validate all cards on import
Object.values(TestCards).forEach(validateCard);

// Export card definitions
module.exports = {
    TestCards,
    validateCard,
    
    // Helper functions
    getCardById: (id) => TestCards[id] || null,
    getCardsByType: (type) => Object.values(TestCards).filter(card => card.type === type),
    getCardsByCategory: (category) => Object.values(TestCards).filter(card => card.category === category),
    getAllCardIds: () => Object.keys(TestCards),
    getCardCount: () => Object.keys(TestCards).length,
    
    // For statistical analysis
    getDistributionSummary: () => {
        return Object.values(TestCards).map(card => ({
            id: card.id,
            name: card.name,
            type: card.type,
            center: card.baseDistribution.center,
            sigma: card.baseDistribution.sigma,
            weight: card.baseDistribution.weight
        }));
    }
};

// Log summary when loaded
if (require.main === module) {
    console.log('📋 RichMan Test Cards Loaded');
    console.log(`Total cards: ${Object.keys(TestCards).length}`);
    console.log('\nCard Distribution Summary:');
    console.log('ID     | Name              | Type     | Center | Sigma | Weight');
    console.log('-------|-------------------|----------|--------|-------|--------');
    
    Object.values(TestCards).forEach(card => {
        const dist = card.baseDistribution;
        console.log(`${card.id.padEnd(6)} | ${card.name.padEnd(17)} | ${card.type.padEnd(8)} | ${dist.center.toString().padEnd(6)} | ${dist.sigma.toString().padEnd(5)} | ${dist.weight}`);
    });
    
    console.log('\n✅ All cards validated successfully');
}
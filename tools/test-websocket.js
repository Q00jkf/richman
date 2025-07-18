/**
 * WebSocket 功能測試腳本
 * 使用方法: node tools/test-websocket.js
 */

const io = require('socket.io-client');

class GameTester {
  constructor(serverUrl = 'http://localhost:5000') {
    this.serverUrl = serverUrl;
    this.socket = null;
    this.playerId = null;
    this.roomId = null;
    this.connected = false;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      console.log('🔌 正在連接到伺服器...');
      
      this.socket = io(this.serverUrl);
      
      this.socket.on('connect', () => {
        this.connected = true;
        console.log('✅ WebSocket 連接成功！');
        console.log(`📡 Socket ID: ${this.socket.id}`);
        this.setupEventListeners();
        resolve();
      });
      
      this.socket.on('connect_error', (error) => {
        console.error('❌ 連接失敗:', error.message);
        reject(error);
      });
      
      this.socket.on('disconnect', (reason) => {
        this.connected = false;
        console.log('❌ 連接中斷:', reason);
      });
    });
  }

  setupEventListeners() {
    // 遊戲事件監聽
    this.socket.on('game:state_updated', (data) => {
      console.log('🎮 遊戲狀態更新:', JSON.stringify(data, null, 2));
    });

    this.socket.on('game:started', (data) => {
      console.log('🚀 遊戲開始！', data);
    });

    this.socket.on('game:turn_started', (data) => {
      console.log(`🎯 輪到玩家: ${data.playerId}`);
      if (data.playerId === this.playerId) {
        console.log('✋ 輪到我了！');
        // 自動執行動作
        setTimeout(() => this.autoPlay(), 2000);
      }
    });

    this.socket.on('game:dice_rolled', (data) => {
      console.log(`🎲 擲骰結果: ${data.diceResult.dice1} + ${data.diceResult.dice2} = ${data.diceResult.total}`);
    });

    this.socket.on('game:player_moved', (data) => {
      console.log(`🚶 玩家 ${data.playerId} 從位置 ${data.oldPosition} 移動到 ${data.newPosition}`);
    });

    this.socket.on('game:property_bought', (data) => {
      console.log(`🏠 玩家 ${data.playerId} 購買了地產 ${data.propertyId}，價格 $${data.price}`);
    });

    this.socket.on('game:rent_paid', (data) => {
      console.log(`💰 ${data.payerId} 支付 $${data.amount} 租金給 ${data.ownerId}`);
    });

    this.socket.on('game:house_built', (data) => {
      console.log(`🏘️ 玩家 ${data.playerId} 在地產 ${data.propertyId} 建造了房屋`);
    });

    this.socket.on('game:card_drawn', (data) => {
      console.log(`🎴 玩家 ${data.playerId} 抽到卡片: ${data.cardTitle}`);
    });

    // 房間事件監聽
    this.socket.on('room:player_joined', (data) => {
      console.log(`👥 玩家加入房間: ${data.playerName}`);
    });

    this.socket.on('room:player_left', (data) => {
      console.log(`👋 玩家離開房間: ${data.playerName}`);
    });

    // 錯誤事件監聽
    this.socket.on('error', (data) => {
      console.error('❌ 錯誤:', data);
    });

    // 監聽所有事件（調試用）
    this.socket.onAny((eventName, ...args) => {
      if (!eventName.startsWith('game:') && !eventName.startsWith('room:')) {
        console.log(`📡 收到事件: ${eventName}`, args);
      }
    });
  }

  async createPlayer(name = '測試玩家', avatar = 'test.png') {
    return new Promise((resolve, reject) => {
      console.log(`👤 創建玩家: ${name}`);
      
      this.socket.emit('player:create', { name, avatar });
      
      this.socket.once('player:created', (data) => {
        this.playerId = data.playerId;
        console.log(`✅ 玩家創建成功！ID: ${this.playerId}`);
        resolve(data);
      });
      
      this.socket.once('player:error', (error) => {
        console.error('❌ 玩家創建失敗:', error);
        reject(error);
      });
    });
  }

  async createRoom(roomName = '測試房間', maxPlayers = 4) {
    return new Promise((resolve, reject) => {
      console.log(`🏠 創建房間: ${roomName}`);
      
      this.socket.emit('room:create', {
        name: roomName,
        maxPlayers,
        hostPlayerId: this.playerId,
        settings: {
          startingMoney: 1500,
          timeLimit: 120
        }
      });
      
      this.socket.once('room:created', (data) => {
        this.roomId = data.roomId;
        console.log(`✅ 房間創建成功！ID: ${this.roomId}`);
        resolve(data);
      });
      
      this.socket.once('room:error', (error) => {
        console.error('❌ 房間創建失敗:', error);
        reject(error);
      });
    });
  }

  async joinRoom(roomId) {
    return new Promise((resolve, reject) => {
      console.log(`🚪 加入房間: ${roomId}`);
      
      this.socket.emit('room:join', {
        playerId: this.playerId,
        roomId: roomId
      });
      
      this.socket.once('room:joined', (data) => {
        this.roomId = roomId;
        console.log(`✅ 成功加入房間！`);
        resolve(data);
      });
      
      this.socket.once('room:error', (error) => {
        console.error('❌ 加入房間失敗:', error);
        reject(error);
      });
    });
  }

  async startGame() {
    if (!this.roomId) {
      console.error('❌ 沒有房間ID，無法開始遊戲');
      return;
    }

    console.log('🎮 嘗試開始遊戲...');
    this.socket.emit('game:start', {
      roomId: this.roomId,
      hostPlayerId: this.playerId
    });
  }

  rollDice() {
    console.log('🎲 擲骰子...');
    this.socket.emit('game:action', {
      type: 'ROLL_DICE',
      playerId: this.playerId
    });
  }

  buyProperty(propertyId) {
    console.log(`🏠 嘗試購買地產 ${propertyId}...`);
    this.socket.emit('game:action', {
      type: 'BUY_PROPERTY',
      playerId: this.playerId,
      data: { propertyId }
    });
  }

  endTurn() {
    console.log('⏭️ 結束回合...');
    this.socket.emit('game:action', {
      type: 'END_TURN',
      playerId: this.playerId
    });
  }

  autoPlay() {
    // 自動遊戲邏輯
    console.log('🤖 自動遊戲中...');
    
    setTimeout(() => {
      this.rollDice();
    }, 1000);
    
    setTimeout(() => {
      this.endTurn();
    }, 5000);
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 斷開連接...');
      this.socket.disconnect();
    }
  }
}

// 測試函數
async function basicTest() {
  console.log('🧪 開始基本功能測試...\n');
  
  const tester = new GameTester();
  
  try {
    // 1. 連接測試
    await tester.connect();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 2. 創建玩家測試
    await tester.createPlayer('測試玩家1');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. 創建房間測試
    await tester.createRoom('測試房間1');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 4. 開始遊戲測試
    await tester.startGame();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n✅ 基本測試完成！');
    console.log('💡 伺服器將繼續運行，您可以手動測試其他功能...');
    console.log('💡 按 Ctrl+C 結束測試');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error);
    tester.disconnect();
    process.exit(1);
  }
}

async function multiPlayerTest() {
  console.log('🧪 開始多人遊戲測試...\n');
  
  const players = [];
  const playerCount = 2; // 測試 2 個玩家
  
  try {
    // 創建多個玩家
    for (let i = 0; i < playerCount; i++) {
      const player = new GameTester();
      await player.connect();
      await player.createPlayer(`測試玩家${i + 1}`);
      players.push(player);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 第一個玩家創建房間
    await players[0].createRoom('多人測試房間');
    const roomId = players[0].roomId;
    
    // 其他玩家加入房間
    for (let i = 1; i < players.length; i++) {
      await players[i].joinRoom(roomId);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 開始遊戲
    await players[0].startGame();
    
    console.log('\n✅ 多人測試設置完成！');
    console.log('💡 遊戲將自動進行，觀察日誌輸出...');
    
  } catch (error) {
    console.error('❌ 多人測試失敗:', error);
    players.forEach(player => player.disconnect());
    process.exit(1);
  }
}

// 命令行參數處理
const args = process.argv.slice(2);
const testType = args[0] || 'basic';

console.log('🎮 RichMan WebSocket 測試工具');
console.log('================================\n');

switch (testType) {
  case 'basic':
    basicTest();
    break;
  case 'multi':
    multiPlayerTest();
    break;
  default:
    console.log('使用方法:');
    console.log('  node tools/test-websocket.js basic   # 基本功能測試');
    console.log('  node tools/test-websocket.js multi   # 多人遊戲測試');
    process.exit(0);
}

// 優雅退出處理
process.on('SIGINT', () => {
  console.log('\n👋 正在退出測試...');
  process.exit(0);
});
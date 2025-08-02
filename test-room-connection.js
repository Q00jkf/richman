/**
 * 房間連線功能測試腳本
 * 用於驗證房間創建、列表獲取、加入等功能
 */

const io = require('socket.io-client');

class RoomConnectionTest {
  constructor() {
    this.testResults = [];
    this.serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
    this.testStartTime = Date.now();
  }

  async runAllTests() {
    console.log('🧪 開始房間連線功能測試...');
    console.log(`📍 測試服務器: ${this.serverUrl}`);
    console.log('=' * 50);

    try {
      await this.testBasicConnection();
      await this.testPlayerAuthentication();
      await this.testRoomCreation();
      await this.testRoomListing();
      await this.testRoomJoining();
      await this.testRoomLeaving();
      await this.testMultiplePlayersInRoom();
      
      this.printResults();
    } catch (error) {
      console.error('❌ 測試過程中發生錯誤:', error);
    }
  }

  async testBasicConnection() {
    console.log('\n🔌 測試基本連接...');
    
    return new Promise((resolve) => {
      const socket = io(this.serverUrl, {
        timeout: 5000,
        reconnection: false
      });

      const timeout = setTimeout(() => {
        this.addResult('basic-connection', 'TIMEOUT', '連接超時');
        socket.disconnect();
        resolve();
      }, 5000);

      socket.on('connect', () => {
        console.log('   ✅ 成功連接到服務器');
        this.addResult('basic-connection', 'PASS');
        clearTimeout(timeout);
        socket.disconnect();
        resolve();
      });

      socket.on('connect_error', (error) => {
        console.log('   ❌ 連接失敗:', error.message);
        this.addResult('basic-connection', 'FAIL', error.message);
        clearTimeout(timeout);
        resolve();
      });
    });
  }

  async testPlayerAuthentication() {
    console.log('\n🔐 測試玩家認證...');
    
    return new Promise((resolve) => {
      const socket = io(this.serverUrl, { reconnection: false });
      let authenticated = false;

      const timeout = setTimeout(() => {
        if (!authenticated) {
          this.addResult('player-auth', 'TIMEOUT', '認證超時');
          socket.disconnect();
          resolve();
        }
      }, 3000);

      socket.on('connect', () => {
        console.log('   📡 發送認證請求...');
        socket.emit('authenticate', {
          name: 'TestPlayer_' + Date.now(),
          avatar: 'test'
        });
      });

      socket.on('authenticated', (data) => {
        if (data.success && data.player) {
          console.log(`   ✅ 認證成功: ${data.player.name} (${data.player.id})`);
          this.addResult('player-auth', 'PASS');
          authenticated = true;
        } else {
          console.log('   ❌ 認證失敗:', data);
          this.addResult('player-auth', 'FAIL', '認證響應格式錯誤');
        }
        clearTimeout(timeout);
        socket.disconnect();
        resolve();
      });

      socket.on('error', (error) => {
        console.log('   ❌ 認證過程錯誤:', error);
        this.addResult('player-auth', 'ERROR', error.message);
        clearTimeout(timeout);
        socket.disconnect();
        resolve();
      });
    });
  }

  async testRoomCreation() {
    console.log('\n🏠 測試房間創建...');
    
    return new Promise((resolve) => {
      const socket = io(this.serverUrl, { reconnection: false });
      let roomCreated = false;

      const timeout = setTimeout(() => {
        if (!roomCreated) {
          this.addResult('room-creation', 'TIMEOUT', '房間創建超時');
          socket.disconnect();
          resolve();
        }
      }, 5000);

      socket.on('connect', () => {
        // 先認證
        socket.emit('authenticate', {
          name: 'RoomCreator_' + Date.now(),
          avatar: 'creator'
        });
      });

      socket.on('authenticated', (data) => {
        if (data.success) {
          console.log('   📡 發送創建房間請求...');
          socket.emit('create_room', {
            name: 'TestRoom_' + Date.now(),
            maxPlayers: 4,
            settings: { startingMoney: 1500 }
          });
        }
      });

      socket.on('room_created', (data) => {
        if (data.success && data.room) {
          console.log(`   ✅ 房間創建成功: ${data.room.name} (${data.room.id})`);
          console.log(`      - 玩家數量: ${data.room.playerCount}/${data.room.maxPlayers}`);
          console.log(`      - 房主: ${data.room.hostId}`);
          this.addResult('room-creation', 'PASS');
          roomCreated = true;
        } else {
          console.log('   ❌ 房間創建失敗:', data);
          this.addResult('room-creation', 'FAIL', data.message || '創建失敗');
        }
        clearTimeout(timeout);
        socket.disconnect();
        resolve();
      });

      socket.on('error', (error) => {
        console.log('   ❌ 房間創建錯誤:', error);
        this.addResult('room-creation', 'ERROR', error.message);
        clearTimeout(timeout);
        socket.disconnect();
        resolve();
      });
    });
  }

  async testRoomListing() {
    console.log('\n📋 測試房間列表獲取...');
    
    return new Promise((resolve) => {
      const socket = io(this.serverUrl, { reconnection: false });
      let listReceived = false;

      const timeout = setTimeout(() => {
        if (!listReceived) {
          this.addResult('room-listing', 'TIMEOUT', '獲取房間列表超時');
          socket.disconnect();
          resolve();
        }
      }, 3000);

      socket.on('connect', () => {
        console.log('   📡 請求房間列表...');
        socket.emit('get_rooms');
      });

      socket.on('rooms_list', (data) => {
        if (data.success && Array.isArray(data.rooms)) {
          console.log(`   ✅ 房間列表獲取成功: ${data.rooms.length} 個房間`);
          if (data.rooms.length > 0) {
            console.log(`      - 第一個房間: ${data.rooms[0].name} (${data.rooms[0].playerCount}/${data.rooms[0].maxPlayers})`);
          }
          this.addResult('room-listing', 'PASS');
          listReceived = true;
        } else {
          console.log('   ❌ 房間列表格式錯誤:', data);
          this.addResult('room-listing', 'FAIL', '響應格式錯誤');
        }
        clearTimeout(timeout);
        socket.disconnect();
        resolve();
      });

      socket.on('error', (error) => {
        console.log('   ❌ 獲取房間列表錯誤:', error);
        this.addResult('room-listing', 'ERROR', error.message);
        clearTimeout(timeout);
        socket.disconnect();
        resolve();
      });
    });
  }

  async testRoomJoining() {
    console.log('\n🚪 測試加入房間...');
    
    return new Promise(async (resolve) => {
      // 首先創建一個房間
      const creatorSocket = io(this.serverUrl, { reconnection: false });
      let roomId = null;

      // 創建房間
      await new Promise((createResolve) => {
        creatorSocket.on('connect', () => {
          creatorSocket.emit('authenticate', {
            name: 'RoomHost_' + Date.now(),
            avatar: 'host'
          });
        });

        creatorSocket.on('authenticated', () => {
          creatorSocket.emit('create_room', {
            name: 'JoinTestRoom_' + Date.now(),
            maxPlayers: 4
          });
        });

        creatorSocket.on('room_created', (data) => {
          if (data.success) {
            roomId = data.room.id;
            console.log(`   📍 測試房間已創建: ${roomId}`);
            createResolve();
          }
        });
      });

      if (!roomId) {
        this.addResult('room-joining', 'FAIL', '無法創建測試房間');
        creatorSocket.disconnect();
        resolve();
        return;
      }

      // 創建第二個玩家加入房間
      const joinerSocket = io(this.serverUrl, { reconnection: false });
      let joined = false;

      const timeout = setTimeout(() => {
        if (!joined) {
          this.addResult('room-joining', 'TIMEOUT', '加入房間超時');
          creatorSocket.disconnect();
          joinerSocket.disconnect();
          resolve();
        }
      }, 5000);

      joinerSocket.on('connect', () => {
        joinerSocket.emit('authenticate', {
          name: 'RoomJoiner_' + Date.now(),
          avatar: 'joiner'
        });
      });

      joinerSocket.on('authenticated', () => {
        console.log('   📡 發送加入房間請求...');
        joinerSocket.emit('join_room', { roomId: roomId });
      });

      joinerSocket.on('room_joined', (data) => {
        if (data.success && data.room) {
          console.log(`   ✅ 成功加入房間: ${data.room.name}`);
          console.log(`      - 房間人數: ${data.room.playerCount}/${data.room.maxPlayers}`);
          this.addResult('room-joining', 'PASS');
          joined = true;
        } else {
          console.log('   ❌ 加入房間失敗:', data);
          this.addResult('room-joining', 'FAIL', data.message || '加入失敗');
        }
        clearTimeout(timeout);
        creatorSocket.disconnect();
        joinerSocket.disconnect();
        resolve();
      });

      joinerSocket.on('error', (error) => {
        console.log('   ❌ 加入房間錯誤:', error);
        this.addResult('room-joining', 'ERROR', error.message);
        clearTimeout(timeout);
        creatorSocket.disconnect();
        joinerSocket.disconnect();
        resolve();
      });
    });
  }

  async testRoomLeaving() {
    console.log('\n🚪 測試離開房間...');
    
    return new Promise(async (resolve) => {
      const socket = io(this.serverUrl, { reconnection: false });
      let roomId = null;
      let left = false;

      const timeout = setTimeout(() => {
        if (!left) {
          this.addResult('room-leaving', 'TIMEOUT', '離開房間超時');
          socket.disconnect();
          resolve();
        }
      }, 5000);

      // 創建房間然後離開
      socket.on('connect', () => {
        socket.emit('authenticate', {
          name: 'LeaveTestPlayer_' + Date.now(),
          avatar: 'leaver'
        });
      });

      socket.on('authenticated', () => {
        socket.emit('create_room', {
          name: 'LeaveTestRoom_' + Date.now(),
          maxPlayers: 4
        });
      });

      socket.on('room_created', (data) => {
        if (data.success) {
          roomId = data.room.id;
          console.log('   📡 發送離開房間請求...');
          socket.emit('leave_room');
        }
      });

      socket.on('room_left', (data) => {
        if (data.success) {
          console.log('   ✅ 成功離開房間');
          this.addResult('room-leaving', 'PASS');
          left = true;
        } else {
          console.log('   ❌ 離開房間失敗:', data);
          this.addResult('room-leaving', 'FAIL', data.message || '離開失敗');
        }
        clearTimeout(timeout);
        socket.disconnect();
        resolve();
      });

      socket.on('error', (error) => {
        console.log('   ❌ 離開房間錯誤:', error);
        this.addResult('room-leaving', 'ERROR', error.message);
        clearTimeout(timeout);
        socket.disconnect();
        resolve();
      });
    });
  }

  async testMultiplePlayersInRoom() {
    console.log('\n👥 測試多玩家房間功能...');
    
    return new Promise(async (resolve) => {
      const sockets = [];
      let roomId = null;
      let allJoined = false;

      const timeout = setTimeout(() => {
        if (!allJoined) {
          this.addResult('multi-player', 'TIMEOUT', '多玩家測試超時');
          sockets.forEach(s => s.disconnect());
          resolve();
        }
      }, 10000);

      try {
        // 創建3個玩家
        for (let i = 0; i < 3; i++) {
          const socket = io(this.serverUrl, { reconnection: false });
          sockets.push(socket);

          await new Promise((socketResolve) => {
            socket.on('connect', () => {
              socket.emit('authenticate', {
                name: `MultiPlayer${i + 1}_` + Date.now(),
                avatar: `player${i + 1}`
              });
            });

            socket.on('authenticated', () => {
              if (i === 0) {
                // 第一個玩家創建房間
                socket.emit('create_room', {
                  name: 'MultiPlayerTestRoom_' + Date.now(),
                  maxPlayers: 4
                });
              } else if (roomId) {
                // 其他玩家加入房間
                socket.emit('join_room', { roomId: roomId });
              }
              socketResolve();
            });

            socket.on('room_created', (data) => {
              if (data.success) {
                roomId = data.room.id;
                console.log(`   📍 多玩家測試房間創建: ${roomId}`);
                socketResolve();
              }
            });

            socket.on('room_joined', (data) => {
              if (data.success) {
                console.log(`   ✅ 玩家 ${i + 1} 加入房間成功 (${data.room.playerCount}/${data.room.maxPlayers})`);
                if (data.room.playerCount === 3) {
                  console.log('   ✅ 所有玩家都成功加入房間');
                  this.addResult('multi-player', 'PASS');
                  allJoined = true;
                  clearTimeout(timeout);
                  sockets.forEach(s => s.disconnect());
                  resolve();
                }
                socketResolve();
              }
            });
          });

          // 如果是第二個或第三個玩家，需要等待房間創建完成
          if (i > 0) {
            await new Promise(wait => setTimeout(wait, 500));
            if (roomId && sockets[i]) {
              sockets[i].emit('join_room', { roomId: roomId });
            }
          }
        }

      } catch (error) {
        console.log('   ❌ 多玩家測試錯誤:', error);
        this.addResult('multi-player', 'ERROR', error.message);
        clearTimeout(timeout);
        sockets.forEach(s => s.disconnect());
        resolve();
      }
    });
  }

  addResult(testName, status, error = null) {
    this.testResults.push({
      test: testName,
      status: status, // PASS, FAIL, ERROR, TIMEOUT
      error: error,
      timestamp: new Date().toISOString()
    });
  }

  printResults() {
    const testDuration = Date.now() - this.testStartTime;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 測試結果報告');
    console.log('='.repeat(60));
    console.log(`⏱️  總測試時間: ${testDuration}ms`);
    console.log(`📍 測試服務器: ${this.serverUrl}`);
    console.log('');

    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const errors = this.testResults.filter(r => r.status === 'ERROR').length;
    const timeouts = this.testResults.filter(r => r.status === 'TIMEOUT').length;

    console.log(`✅ 通過: ${passed}`);
    console.log(`❌ 失敗: ${failed}`);
    console.log(`💥 錯誤: ${errors}`);
    console.log(`⏰ 超時: ${timeouts}`);
    console.log('');

    this.testResults.forEach(result => {
      const icon = {
        'PASS': '✅',
        'FAIL': '❌',
        'ERROR': '💥',
        'TIMEOUT': '⏰'
      }[result.status];

      console.log(`${icon} ${result.test}: ${result.status}`);
      if (result.error) {
        console.log(`   └─ ${result.error}`);
      }
    });

    console.log('');
    const successRate = ((passed / this.testResults.length) * 100).toFixed(1);
    console.log(`🎯 成功率: ${successRate}%`);
    
    if (passed === this.testResults.length) {
      console.log('🎉 所有測試通過！房間連線功能正常運作');
    } else {
      console.log('⚠️  部分測試未通過，請檢查相關功能');
    }
  }
}

// 執行測試
if (require.main === module) {
  const test = new RoomConnectionTest();
  test.runAllTests().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('測試執行失敗:', error);
    process.exit(1);
  });
}

module.exports = RoomConnectionTest;
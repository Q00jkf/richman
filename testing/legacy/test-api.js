/**
 * API 功能測試腳本
 * 使用方法: node tools/test-api.js
 */

const http = require('http');
const https = require('https');

class APITester {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.testResults = [];
  }

  async request(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const isHttps = url.protocol === 'https:';
      const lib = isHttps ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        const jsonData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(jsonData);
      }

      const req = lib.request(options, (res) => {
        let responseBody = '';
        
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = responseBody ? JSON.parse(responseBody) : null;
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: parsedData
            });
          } catch (error) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: responseBody
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async testHealthCheck() {
    console.log('🔍 測試健康檢查...');
    
    try {
      const response = await this.request('GET', '/health');
      
      if (response.statusCode === 200 && response.data.status === 'OK') {
        console.log('✅ 健康檢查成功');
        console.log(`   - 狀態: ${response.data.status}`);
        console.log(`   - 運行時間: ${response.data.uptime}秒`);
        console.log(`   - 活躍遊戲: ${response.data.activeGames}`);
        console.log(`   - 活躍玩家: ${response.data.activePlayers}`);
        console.log(`   - 活躍房間: ${response.data.activeRooms}`);
        this.testResults.push({ test: 'health', status: 'PASS' });
      } else {
        console.log('❌ 健康檢查失敗');
        console.log(`   - 狀態碼: ${response.statusCode}`);
        console.log(`   - 回應: ${JSON.stringify(response.data)}`);
        this.testResults.push({ test: 'health', status: 'FAIL' });
      }
    } catch (error) {
      console.log('❌ 健康檢查失敗 - 無法連接到伺服器');
      console.log(`   - 錯誤: ${error.message}`);
      this.testResults.push({ test: 'health', status: 'ERROR', error: error.message });
    }
  }

  async testPlayerAPI() {
    console.log('\\n👤 測試玩家 API...');
    
    // 創建玩家
    try {
      console.log('   創建玩家...');
      const createResponse = await this.request('POST', '/api/players', {
        name: '測試玩家API',
        avatar: 'test-api.png'
      });
      
      if (createResponse.statusCode === 201 || createResponse.statusCode === 200) {
        console.log('   ✅ 玩家創建成功');
        console.log(`      - 玩家ID: ${createResponse.data.playerId}`);
        this.testResults.push({ test: 'player-create', status: 'PASS' });
        
        const playerId = createResponse.data.playerId;
        
        // 獲取玩家信息
        console.log('   獲取玩家信息...');
        const getResponse = await this.request('GET', `/api/players/${playerId}`);
        
        if (getResponse.statusCode === 200) {
          console.log('   ✅ 獲取玩家信息成功');
          console.log(`      - 玩家名稱: ${getResponse.data.name}`);
          this.testResults.push({ test: 'player-get', status: 'PASS' });
        } else {
          console.log('   ❌ 獲取玩家信息失敗');
          this.testResults.push({ test: 'player-get', status: 'FAIL' });
        }
        
        // 更新玩家信息
        console.log('   更新玩家信息...');
        const updateResponse = await this.request('PUT', `/api/players/${playerId}`, {
          name: '更新後的玩家名稱'
        });
        
        if (updateResponse.statusCode === 200) {
          console.log('   ✅ 玩家信息更新成功');
          this.testResults.push({ test: 'player-update', status: 'PASS' });
        } else {
          console.log('   ❌ 玩家信息更新失敗');
          this.testResults.push({ test: 'player-update', status: 'FAIL' });
        }
        
      } else {
        console.log('   ❌ 玩家創建失敗');
        console.log(`      - 狀態碼: ${createResponse.statusCode}`);
        this.testResults.push({ test: 'player-create', status: 'FAIL' });
      }
    } catch (error) {
      console.log('   ❌ 玩家API測試錯誤');
      console.log(`      - 錯誤: ${error.message}`);
      this.testResults.push({ test: 'player-api', status: 'ERROR', error: error.message });
    }
    
    // 獲取玩家列表
    try {
      console.log('   獲取玩家列表...');
      const listResponse = await this.request('GET', '/api/players');
      
      if (listResponse.statusCode === 200 && Array.isArray(listResponse.data)) {
        console.log('   ✅ 獲取玩家列表成功');
        console.log(`      - 玩家數量: ${listResponse.data.length}`);
        this.testResults.push({ test: 'player-list', status: 'PASS' });
      } else {
        console.log('   ❌ 獲取玩家列表失敗');
        this.testResults.push({ test: 'player-list', status: 'FAIL' });
      }
    } catch (error) {
      console.log('   ❌ 獲取玩家列表錯誤');
      this.testResults.push({ test: 'player-list', status: 'ERROR', error: error.message });
    }
  }

  async testRoomAPI() {
    console.log('\\n🏠 測試房間 API...');
    
    // 創建房間
    try {
      console.log('   創建房間...');
      const createResponse = await this.request('POST', '/api/rooms', {
        name: '測試房間API',
        maxPlayers: 4,
        isPrivate: false,
        settings: {
          startingMoney: 1500,
          timeLimit: 120
        }
      });
      
      if (createResponse.statusCode === 201 || createResponse.statusCode === 200) {
        console.log('   ✅ 房間創建成功');
        console.log(`      - 房間ID: ${createResponse.data.roomId}`);
        this.testResults.push({ test: 'room-create', status: 'PASS' });
        
        const roomId = createResponse.data.roomId;
        
        // 獲取房間信息
        console.log('   獲取房間信息...');
        const getResponse = await this.request('GET', `/api/rooms/${roomId}`);
        
        if (getResponse.statusCode === 200) {
          console.log('   ✅ 獲取房間信息成功');
          console.log(`      - 房間名稱: ${getResponse.data.name}`);
          console.log(`      - 最大玩家數: ${getResponse.data.maxPlayers}`);
          this.testResults.push({ test: 'room-get', status: 'PASS' });
        } else {
          console.log('   ❌ 獲取房間信息失敗');
          this.testResults.push({ test: 'room-get', status: 'FAIL' });
        }
        
      } else {
        console.log('   ❌ 房間創建失敗');
        console.log(`      - 狀態碼: ${createResponse.statusCode}`);
        this.testResults.push({ test: 'room-create', status: 'FAIL' });
      }
    } catch (error) {
      console.log('   ❌ 房間API測試錯誤');
      console.log(`      - 錯誤: ${error.message}`);
      this.testResults.push({ test: 'room-api', status: 'ERROR', error: error.message });
    }
    
    // 獲取房間列表
    try {
      console.log('   獲取房間列表...');
      const listResponse = await this.request('GET', '/api/rooms');
      
      if (listResponse.statusCode === 200 && Array.isArray(listResponse.data)) {
        console.log('   ✅ 獲取房間列表成功');
        console.log(`      - 房間數量: ${listResponse.data.length}`);
        this.testResults.push({ test: 'room-list', status: 'PASS' });
      } else {
        console.log('   ❌ 獲取房間列表失敗');
        this.testResults.push({ test: 'room-list', status: 'FAIL' });
      }
    } catch (error) {
      console.log('   ❌ 獲取房間列表錯誤');
      this.testResults.push({ test: 'room-list', status: 'ERROR', error: error.message });
    }
  }

  async testGameAPI() {
    console.log('\\n🎮 測試遊戲 API...');
    
    try {
      console.log('   獲取遊戲列表...');
      const listResponse = await this.request('GET', '/api/games');
      
      if (listResponse.statusCode === 200) {
        console.log('   ✅ 獲取遊戲列表成功');
        const games = Array.isArray(listResponse.data) ? listResponse.data : [];
        console.log(`      - 遊戲數量: ${games.length}`);
        this.testResults.push({ test: 'game-list', status: 'PASS' });
      } else {
        console.log('   ❌ 獲取遊戲列表失敗');
        this.testResults.push({ test: 'game-list', status: 'FAIL' });
      }
    } catch (error) {
      console.log('   ❌ 遊戲API測試錯誤');
      console.log(`      - 錯誤: ${error.message}`);
      this.testResults.push({ test: 'game-api', status: 'ERROR', error: error.message });
    }
  }

  async testErrorHandling() {
    console.log('\\n❌ 測試錯誤處理...');
    
    // 測試 404
    try {
      console.log('   測試 404 錯誤...');
      const response = await this.request('GET', '/api/nonexistent');
      
      if (response.statusCode === 404) {
        console.log('   ✅ 404 錯誤處理正確');
        this.testResults.push({ test: 'error-404', status: 'PASS' });
      } else {
        console.log(`   ⚠️  預期 404，但收到 ${response.statusCode}`);
        this.testResults.push({ test: 'error-404', status: 'FAIL' });
      }
    } catch (error) {
      console.log('   ❌ 404測試錯誤');
      this.testResults.push({ test: 'error-404', status: 'ERROR' });
    }
    
    // 測試無效 JSON
    try {
      console.log('   測試無效請求...');
      const response = await this.request('POST', '/api/players', {
        // 缺少必要欄位
      });
      
      if (response.statusCode >= 400) {
        console.log('   ✅ 無效請求處理正確');
        this.testResults.push({ test: 'error-validation', status: 'PASS' });
      } else {
        console.log('   ⚠️  無效請求應該返回錯誤');
        this.testResults.push({ test: 'error-validation', status: 'FAIL' });
      }
    } catch (error) {
      console.log('   ❌ 驗證測試錯誤');
      this.testResults.push({ test: 'error-validation', status: 'ERROR' });
    }
  }

  async runAllTests() {
    console.log('🧪 RichMan API 測試工具');
    console.log('======================\\n');
    console.log(`📡 測試目標: ${this.baseUrl}\\n`);
    
    await this.testHealthCheck();
    await this.testPlayerAPI();
    await this.testRoomAPI();
    await this.testGameAPI();
    await this.testErrorHandling();
    
    this.printSummary();
  }

  printSummary() {
    console.log('\\n📊 測試結果摘要');
    console.log('================');
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const errors = this.testResults.filter(r => r.status === 'ERROR').length;
    const total = this.testResults.length;
    
    console.log(`總測試數: ${total}`);
    console.log(`✅ 通過: ${passed}`);
    console.log(`❌ 失敗: ${failed}`);
    console.log(`⚠️  錯誤: ${errors}`);
    
    const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
    console.log(`\\n成功率: ${successRate}%`);
    
    if (failed > 0 || errors > 0) {
      console.log('\\n失敗的測試:');
      this.testResults
        .filter(r => r.status !== 'PASS')
        .forEach(r => {
          console.log(`  - ${r.test}: ${r.status}${r.error ? ` (${r.error})` : ''}`);
        });
    }
    
    console.log('\\n測試完成！');
  }
}

// 主函數
async function main() {
  const args = process.argv.slice(2);
  const serverUrl = args[0] || 'http://localhost:5000';
  
  const tester = new APITester(serverUrl);
  await tester.runAllTests();
}

// 運行測試
if (require.main === module) {
  main().catch(error => {
    console.error('測試執行錯誤:', error);
    process.exit(1);
  });
}

module.exports = APITester;
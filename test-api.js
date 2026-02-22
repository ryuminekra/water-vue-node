const axios = require('axios');

async function testQueryApi() {
  try {
    const response = await axios.post('http://localhost:8080/api/billing/query', {
      startDate: '2026-02-01',
      endDate: '2026-02-28'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API响应:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('测试失败:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.data);
    }
  }
}

testQueryApi();
const axios = require('axios');

async function testLogin() {
  try {
    // 测试user账号登录
    console.log('测试user账号登录...');
    const userResponse = await axios.post('http://localhost:8080/api/auth/login', {
      username: 'user',
      password: '123456'
    });
    console.log('user账号登录成功:', userResponse.data);

    // 测试deliveryman账号登录
    console.log('\n测试deliveryman账号登录...');
    const deliverymanResponse = await axios.post('http://localhost:8080/api/auth/login', {
      username: 'deliveryman',
      password: '123456'
    });
    console.log('deliveryman账号登录成功:', deliverymanResponse.data);

    // 测试admin账号登录
    console.log('\n测试admin账号登录...');
    const adminResponse = await axios.post('http://localhost:8080/api/auth/login', {
      username: 'admin',
      password: '123456'
    });
    console.log('admin账号登录成功:', adminResponse.data);

  } catch (error) {
    console.error('登录测试失败:', error.message);
    if (error.response) {
      console.error('响应数据:', error.response.data);
    }
  }
}

testLogin();
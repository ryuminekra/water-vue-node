const axios = require('axios');

async function testChangePassword() {
  try {
    // 首先登录获取token
    const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      username: 'admin',
      password: '123456'
    });
    
    console.log('登录成功:', loginResponse.data);
    
    const token = loginResponse.data.data.token;
    const userId = loginResponse.data.data.user.id;
    
    // 测试修改密码
    const changePasswordResponse = await axios.post(`http://localhost:8080/api/system/user/${userId}/change-password`, {
      currentPassword: '123456',
      newPassword: '12345678'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('密码修改成功:', changePasswordResponse.data);
    
    // 测试用新密码登录
    const newLoginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      username: 'admin',
      password: '12345678'
    });
    
    console.log('用新密码登录成功:', newLoginResponse.data);
    
    // 改回原密码
    const changeBackResponse = await axios.post(`http://localhost:8080/api/system/user/${userId}/change-password`, {
      currentPassword: '12345678',
      newPassword: '123456'
    }, {
      headers: {
        'Authorization': `Bearer ${newLoginResponse.data.data.token}`
      }
    });
    
    console.log('密码改回成功:', changeBackResponse.data);
    
  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  }
}

testChangePassword();
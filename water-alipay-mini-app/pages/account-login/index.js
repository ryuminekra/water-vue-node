// account-login/index.js
const api = require('../../utils/api.js');

Page({
  data: {
    username: '',
    password: '',
    loading: false
  },
  
  // 用户名输入事件
  onUsernameInput: function(e) {
    console.log('用户名输入:', e);
    this.setData({
      username: e.detail.value
    });
  },
  
  // 密码输入事件
  onPasswordInput: function(e) {
    console.log('密码输入:', e);
    this.setData({
      password: e.detail.value
    });
  },
  
  // 登录事件
  login: function() {
    console.log('点击登录按钮');
    
    const { username, password } = this.data;
    
    // 验证输入
    if (!username) {
      console.log('用户名为空');
      my.showToast({
        type: 'none',
        content: '请输入用户名'
      });
      return;
    }
    
    if (!password) {
      console.log('密码为空');
      my.showToast({
        type: 'none',
        content: '请输入密码'
      });
      return;
    }
    
    this.setData({ loading: true });
    
    console.log('开始登录，用户名:', username, '密码:', password);
    
    // 调用登录API
    my.request({
      url: 'http://localhost:8080/api/auth/login',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        username: username,
        password: password
      },
      success: function(res) {
        console.log('登录请求成功:', res);
        
        if (res.data.code === 200) {
          // 存储登录状态
          my.setStorageSync({ key: 'token', data: res.data.data.token });
          my.setStorageSync({ key: 'user', data: res.data.data.user });
          
          my.showToast({
            type: 'success',
            content: '登录成功'
          });
          
          // 跳转到首页
          setTimeout(function() {
            my.navigateTo({ url: '/pages/consumption/index' });
          }, 1000);
        } else {
          my.showToast({
            type: 'none',
            content: res.data.message || '登录失败'
          });
        }
      },
      fail: function(error) {
        console.error('登录请求失败:', error);
        my.showToast({
          type: 'none',
          content: '网络错误，请重试'
        });
      },
      complete: function() {
        this.setData({ loading: false });
      }.bind(this)
    });
  }
});
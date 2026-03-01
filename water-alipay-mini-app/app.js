// app.js
App({
  onLaunch(options) {
    // 小程序启动时执行
    console.log('小程序启动', options);
    // 检查启动参数，实现扫码自动登录
    this.checkLaunchOptions(options);
  },
  onShow(options) {
    // 小程序显示时执行
    console.log('小程序显示', options);
    // 检查显示参数，实现扫码自动登录
    this.checkLaunchOptions(options);
  },
  onHide() {
    // 小程序隐藏时执行
  },
  globalData: {
    userInfo: null
  },
  
  // 检查启动参数
  checkLaunchOptions(options) {
    if (options && options.query) {
      console.log('检测到启动参数:', options.query);
      // 检查是否包含登录所需参数
      const { role, warehouseId, signature } = options.query;
      if (role && warehouseId && signature) {
        console.log('启动参数包含登录信息，开始自动登录');
        this.autoLogin({ role, warehouseId, signature });
      }
    }
  },
  
  // 自动登录
  autoLogin(qrData) {
    console.log('开始自动登录:', qrData);
    
    // 调用登录API
    my.request({
      url: 'http://localhost:8080/api/mini-app/login',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: qrData,
      success: function(response) {
        console.log('登录API调用成功:', response);
        if (response.data.code === 200) {
          // 存储登录状态
          my.setStorageSync({ key: 'token', data: response.data.data.token });
          my.setStorageSync({ key: 'role', data: qrData.role });
          my.setStorageSync({ key: 'warehouse', data: response.data.data.warehouse });
          
          my.showToast({
            type: 'success',
            content: '登录成功'
          });
          
          // 根据角色跳转
          setTimeout(function() {
            if (qrData.role === 'deliveryman') {
              my.navigateTo({ url: '/pages/delivery/index' });
            } else if (qrData.role === 'user') {
              my.navigateTo({ url: '/pages/consumption/index' });
            }
          }, 1000);
        } else {
          my.showToast({
            type: 'none',
            content: response.data.message
          });
        }
      },
      fail: function(error) {
        console.error('登录API调用失败:', error);
        my.showToast({
          type: 'none',
          content: '登录失败'
        });
      }
    });
  }
});
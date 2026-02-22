// login/index.js
const api = require('../../utils/api.js');

Page({
  data: {
    scanning: false
  },
  
  // 扫码按钮点击事件
  scanCode: function() {
    if (this.data.scanning) return;
    
    this.setData({ scanning: true });
    
    wx.scanCode({
      success: (res) => {
        try {
          // 解析二维码内容
          const qrData = JSON.parse(res.result);
          
          // 验证二维码数据
          if (!qrData.role || !qrData.warehouseId || !qrData.signature) {
            wx.showToast({ title: '二维码格式错误', icon: 'none' });
            return;
          }
          
          // 调用登录API
          api.login(qrData).then(response => {
            if (response.code === 200) {
              // 存储登录状态
              wx.setStorageSync('token', response.data.token);
              wx.setStorageSync('role', qrData.role);
              wx.setStorageSync('warehouse', response.data.warehouse);
              
              // 根据角色跳转
              if (qrData.role === 'deliveryman') {
                wx.navigateTo({ url: '../delivery/index' });
              } else if (qrData.role === 'user') {
                wx.navigateTo({ url: '../consumption/index' });
              }
            } else {
              wx.showToast({ title: response.message, icon: 'none' });
            }
          }).catch(error => {
            wx.showToast({ title: '登录失败', icon: 'none' });
            console.error('登录失败:', error);
          });
        } catch (e) {
          wx.showToast({ title: '二维码解析失败', icon: 'none' });
          console.error('二维码解析失败:', e);
        }
      },
      fail: (error) => {
        wx.showToast({ title: '扫码失败', icon: 'none' });
        console.error('扫码失败:', error);
      },
      complete: () => {
        this.setData({ scanning: false });
      }
    });
  }
});
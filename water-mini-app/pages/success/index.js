// success/index.js
Page({
  data: {
    operation: '',
    data: {},
    currentDate: ''
  },
  
  onLoad: function(option) {
    // 获取从上个页面传递的数据
    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.on('acceptDataFromOpenerPage', (data) => {
        this.setData({
          operation: data.operation,
          data: data.data,
          currentDate: new Date().toLocaleString()
        });
      });
    }
  },
  
  // 返回登录页面
  backToLogin: function() {
    wx.navigateTo({ url: '../login/index' });
  }
});
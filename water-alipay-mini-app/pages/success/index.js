// success/index.js

Page({
  data: {
    operation: '',
    data: {},
    currentDate: ''
  },
  
  onLoad: function() {
    // 获取从上个页面传递的数据
    const successData = my.getStorageSync({ key: 'successData' }).data;
    if (successData) {
      this.setData({
        operation: successData.operation,
        data: successData.data,
        currentDate: new Date().toLocaleString()
      });
    }
  },
  
  // 返回登录页面
  backToLogin: function() {
    console.log('点击返回首页按钮');
    my.navigateTo({ url: '/pages/login/index' });
  }
});
// test/index.js
Page({
  data: {
  },
  
  // 测试Toast功能
  testToast: function() {
    console.log('点击测试Toast按钮');
    my.showToast({
      type: 'none',
      content: '测试Toast功能',
      duration: 2000,
      success: function() {
        console.log('Toast显示成功');
      },
      fail: function(error) {
        console.error('Toast显示失败:', error);
      }
    });
  },
  
  // 测试扫码功能
  testScan: function() {
    console.log('点击测试扫码按钮');
    my.scan({
      type: 'qr',
      success: function(res) {
        console.log('扫码成功:', res);
        my.showToast({
          type: 'none',
          content: '扫码成功: ' + res.code,
          duration: 2000
        });
      },
      fail: function(error) {
        console.error('扫码失败:', error);
        my.showToast({
          type: 'none',
          content: '扫码失败',
          duration: 2000
        });
      }
    });
  }
});
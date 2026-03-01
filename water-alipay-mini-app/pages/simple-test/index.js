// simple-test/index.js
Page({
  data: {
  },
  
  // 测试按钮点击事件
  testClick: function() {
    console.log('点击测试按钮');
    console.log('this对象:', this);
    console.log('my对象是否存在:', typeof my);
    
    if (typeof my !== 'undefined') {
      console.log('my对象方法:', Object.keys(my));
      
      // 尝试显示Toast
      my.showToast({
        type: 'none',
        content: '测试成功',
        duration: 2000,
        success: function() {
          console.log('Toast显示成功');
        },
        fail: function(error) {
          console.error('Toast显示失败:', error);
        }
      });
    } else {
      console.error('my对象不存在');
    }
  }
});
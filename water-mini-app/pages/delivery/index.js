// delivery/index.js
const api = require('../../utils/api.js');

Page({
  data: {
    warehouse: {},
    quantity: '',
    emptyBucketQuantity: '',
    date: new Date().toISOString().split('T')[0],
    remark: ''
  },
  
  onLoad: function() {
    // 获取仓库信息
    const warehouse = wx.getStorageSync('warehouse');
    if (warehouse) {
      this.setData({ warehouse });
    } else {
      wx.showToast({ title: '请先扫码登录', icon: 'none' });
      wx.navigateBack();
    }
  },
  
  // 输入送水数量
  bindQuantityInput: function(e) {
    this.setData({ quantity: e.detail.value });
  },
  
  // 输入空桶数量
  bindEmptyBucketInput: function(e) {
    this.setData({ emptyBucketQuantity: e.detail.value });
  },
  
  // 选择日期
  bindDateChange: function(e) {
    this.setData({ date: e.detail.value });
  },
  
  // 输入备注
  bindRemarkInput: function(e) {
    this.setData({ remark: e.detail.value });
  },
  
  // 提交送水记录
  submitDelivery: function() {
    const { warehouse, quantity, emptyBucketQuantity, date, remark } = this.data;
    
    // 验证输入
    if (!quantity || quantity <= 0) {
      wx.showToast({ title: '请输入有效的送水数量', icon: 'none' });
      return;
    }
    
    if (!emptyBucketQuantity) {
      wx.showToast({ title: '请输入空桶领取数量', icon: 'none' });
      return;
    }
    
    // 构建请求数据
    const deliveryData = {
      waterCategoryId: 1, // 默认桶装水
      warehouseId: warehouse.id,
      quantity: parseInt(quantity),
      emptyBucketQuantity: parseInt(emptyBucketQuantity),
      date: date,
      remark: remark
    };
    
    // 提交数据
    api.addDelivery(deliveryData).then(response => {
      if (response.code === 200) {
        // 跳转到成功页面
        wx.navigateTo({
          url: '../success/index',
          success: function(res) {
            res.eventChannel.emit('acceptDataFromOpenerPage', {
              operation: 'delivery',
              data: deliveryData
            });
          }
        });
      } else {
        wx.showToast({ title: response.message, icon: 'none' });
      }
    }).catch(error => {
      wx.showToast({ title: '提交失败', icon: 'none' });
      console.error('提交失败:', error);
    });
  }
});
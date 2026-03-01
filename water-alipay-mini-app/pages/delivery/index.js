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
    console.log('进入送水页面');
    // 获取仓库信息
    const warehouse = my.getStorageSync({ key: 'warehouse' }).data;
    console.log('仓库信息:', warehouse);
    if (warehouse) {
      this.setData({ warehouse });
    } else {
      my.showToast({
        type: 'none',
        content: '请先扫码登录'
      });
      my.navigateBack();
    }
  },
  
  // 输入送水数量
  onQuantityInput: function(e) {
    console.log('输入送水数量:', e.detail.value);
    this.setData({ quantity: e.detail.value });
  },
  
  // 输入空桶数量
  onEmptyBucketInput: function(e) {
    console.log('输入空桶数量:', e.detail.value);
    this.setData({ emptyBucketQuantity: e.detail.value });
  },
  
  // 选择日期
  onDateChange: function(e) {
    console.log('选择日期:', e.detail.value);
    this.setData({ date: e.detail.value });
  },
  
  // 输入备注
  onRemarkInput: function(e) {
    console.log('输入备注:', e.detail.value);
    this.setData({ remark: e.detail.value });
  },
  
  // 提交送水记录
  submitDelivery: function() {
    console.log('点击提交送水按钮');
    const { warehouse, quantity, emptyBucketQuantity, date, remark } = this.data;
    console.log('提交数据:', { warehouse, quantity, emptyBucketQuantity, date, remark });
    
    // 验证输入
    if (!quantity || quantity <= 0) {
      console.log('送水数量无效');
      my.showToast({
        type: 'none',
        content: '请输入有效的送水数量'
      });
      return;
    }
    
    if (!emptyBucketQuantity) {
      console.log('空桶数量为空');
      my.showToast({
        type: 'none',
        content: '请输入空桶领取数量'
      });
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
    
    console.log('构建送水数据:', deliveryData);
    
    // 提交数据
    console.log('开始调用addDelivery API');
    api.addDelivery(deliveryData).then(function(response) {
      console.log('addDelivery API调用成功:', response);
      if (response.code === 200) {
        // 传递数据到成功页面
        my.setStorageSync({ key: 'successData', data: {
          operation: 'delivery',
          data: deliveryData
        }});
        
        // 跳转到成功页面
        console.log('跳转到成功页面');
        my.navigateTo({
          url: '/pages/success/index'
        });
      } else {
        console.log('addDelivery API返回错误:', response.message);
        my.showToast({
          type: 'none',
          content: response.message
        });
      }
    }).catch(function(error) {
      console.error('addDelivery API调用失败:', error);
      my.showToast({
        type: 'none',
        content: '提交失败'
      });
    });
  }
});
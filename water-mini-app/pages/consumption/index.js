// consumption/index.js
const api = require('../../utils/api.js');

Page({
  data: {
    warehouse: {},
    departments: [],
    departmentIndex: 0,
    receiver: '',
    quantity: '',
    returnEmptyBottles: '',
    consumptionDate: new Date().toISOString().split('T')[0],
    notes: ''
  },
  
  onLoad: function() {
    // 获取仓库信息
    const warehouse = wx.getStorageSync('warehouse');
    if (warehouse) {
      this.setData({ warehouse });
    } else {
      wx.showToast({ title: '请先扫码登录', icon: 'none' });
      wx.navigateBack();
      return;
    }
    
    // 加载部门列表
    this.loadDepartments();
  },
  
  // 加载部门列表
  loadDepartments: function() {
    api.getDepartments().then(response => {
      if (response.code === 200) {
        this.setData({ departments: response.data });
      }
    }).catch(error => {
      console.error('获取部门列表失败:', error);
    });
  },
  
  // 选择部门
  bindDepartmentChange: function(e) {
    this.setData({ departmentIndex: e.detail.value });
  },
  
  // 输入领用人
  bindReceiverInput: function(e) {
    this.setData({ receiver: e.detail.value });
  },
  
  // 输入领用数量
  bindQuantityInput: function(e) {
    this.setData({ quantity: e.detail.value });
  },
  
  // 输入空桶数量
  bindEmptyBottleInput: function(e) {
    this.setData({ returnEmptyBottles: e.detail.value });
  },
  
  // 输入备注
  bindNotesInput: function(e) {
    this.setData({ notes: e.detail.value });
  },
  
  // 提交领用申请
  submitConsumption: function() {
    const { warehouse, departments, departmentIndex, receiver, quantity, returnEmptyBottles, consumptionDate, notes } = this.data;
    
    // 验证输入
    if (departmentIndex === null || !departments[departmentIndex]) {
      wx.showToast({ title: '请选择领用部门', icon: 'none' });
      return;
    }
    
    if (!receiver) {
      wx.showToast({ title: '请输入领用人', icon: 'none' });
      return;
    }
    
    if (!quantity || quantity <= 0) {
      wx.showToast({ title: '请输入有效的领用数量', icon: 'none' });
      return;
    }
    
    if (!returnEmptyBottles) {
      wx.showToast({ title: '请输入归还空桶数量', icon: 'none' });
      return;
    }
    
    // 构建请求数据
    const consumptionData = {
      waterCategoryId: 1, // 默认桶装水
      warehouseId: warehouse.id,
      departmentId: departments[departmentIndex].id,
      receiver: receiver,
      quantity: parseInt(quantity),
      returnEmptyBottles: parseInt(returnEmptyBottles),
      consumptionDate: consumptionDate,
      notes: notes
    };
    
    // 提交数据
    api.addConsumption(consumptionData).then(response => {
      if (response.code === 200) {
        // 跳转到成功页面
        wx.navigateTo({
          url: '../success/index',
          success: function(res) {
            res.eventChannel.emit('acceptDataFromOpenerPage', {
              operation: 'consumption',
              data: consumptionData
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
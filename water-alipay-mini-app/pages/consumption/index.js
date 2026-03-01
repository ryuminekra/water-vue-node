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
    console.log('进入领用页面');
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
      return;
    }
    
    // 加载部门列表
    console.log('开始加载部门列表');
    this.loadDepartments();
  },
  
  // 加载部门列表
  loadDepartments: function() {
    console.log('调用getDepartments API');
    api.getDepartments().then(function(response) {
      console.log('getDepartments API调用成功:', response);
      if (response.code === 200) {
        this.setData({ departments: response.data });
      }
    }.bind(this)).catch(function(error) {
      console.error('获取部门列表失败:', error);
    });
  },
  
  // 选择部门
  onDepartmentChange: function(e) {
    console.log('选择部门:', e.detail.value);
    this.setData({ departmentIndex: e.detail.value });
  },
  
  // 输入领用人
  onReceiverInput: function(e) {
    console.log('输入领用人:', e.detail.value);
    this.setData({ receiver: e.detail.value });
  },
  
  // 输入领用数量
  onQuantityInput: function(e) {
    console.log('输入领用数量:', e.detail.value);
    this.setData({ quantity: e.detail.value });
  },
  
  // 输入空桶数量
  onEmptyBottleInput: function(e) {
    console.log('输入空桶数量:', e.detail.value);
    this.setData({ returnEmptyBottles: e.detail.value });
  },
  
  // 输入备注
  onNotesInput: function(e) {
    console.log('输入备注:', e.detail.value);
    this.setData({ notes: e.detail.value });
  },
  
  // 提交领用申请
  submitConsumption: function() {
    console.log('点击提交领用按钮');
    const { warehouse, departments, departmentIndex, receiver, quantity, returnEmptyBottles, consumptionDate, notes } = this.data;
    console.log('提交数据:', { warehouse, departments, departmentIndex, receiver, quantity, returnEmptyBottles, consumptionDate, notes });
    
    // 验证输入
    if (departmentIndex === null || !departments[departmentIndex]) {
      console.log('未选择领用部门');
      my.showToast({
        type: 'none',
        content: '请选择领用部门'
      });
      return;
    }
    
    if (!receiver) {
      console.log('未输入领用人');
      my.showToast({
        type: 'none',
        content: '请输入领用人'
      });
      return;
    }
    
    if (!quantity || quantity <= 0) {
      console.log('领用数量无效');
      my.showToast({
        type: 'none',
        content: '请输入有效的领用数量'
      });
      return;
    }
    
    if (!returnEmptyBottles) {
      console.log('未输入归还空桶数量');
      my.showToast({
        type: 'none',
        content: '请输入归还空桶数量'
      });
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
    
    console.log('构建领用数据:', consumptionData);
    
    // 提交数据
    console.log('开始调用addConsumption API');
    api.addConsumption(consumptionData).then(function(response) {
      console.log('addConsumption API调用成功:', response);
      if (response.code === 200) {
        // 传递数据到成功页面
        my.setStorageSync({ key: 'successData', data: {
          operation: 'consumption',
          data: consumptionData
        }});
        
        // 跳转到成功页面
        console.log('跳转到成功页面');
        my.navigateTo({
          url: '/pages/success/index'
        });
      } else {
        console.log('addConsumption API返回错误:', response.message);
        my.showToast({
          type: 'none',
          content: response.message
        });
      }
    }).catch(function(error) {
      console.error('addConsumption API调用失败:', error);
      my.showToast({
        type: 'none',
        content: '提交失败'
      });
    });
  }
});
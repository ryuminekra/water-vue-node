const { sequelize } = require('./config/database');
const WaterCategory = require('./models/WaterCategory');
const DeliveryRecord = require('./models/DeliveryRecord');
const Inventory = require('./models/Inventory');
const Consumption = require('./models/Consumption');
const Bill = require('./models/Bill');
const Payment = require('./models/Payment');
const SystemLog = require('./models/SystemLog');
const Warehouse = require('./models/Warehouse');
const Department = require('./models/Department');
const User = require('./models/User');

// 检查并删除重复数据
const checkAndDeleteDuplicates = async () => {
  try {
    console.log('开始检查重复数据...');
    
    // 检查用户表重复数据
    console.log('检查用户表...');
    const users = await User.findAll();
    const userMap = new Map();
    const duplicateUsers = [];
    
    for (const user of users) {
      const key = user.username;
      if (userMap.has(key)) {
        duplicateUsers.push(user.id);
        console.log(`发现重复用户: ${user.username}`);
      } else {
        userMap.set(key, user.id);
      }
    }
    
    // 删除重复用户
    if (duplicateUsers.length > 0) {
      await User.destroy({ where: { id: duplicateUsers } });
      console.log(`删除了 ${duplicateUsers.length} 个重复用户`);
    }
    
    // 检查部门表重复数据
    console.log('检查部门表...');
    const departments = await Department.findAll();
    const departmentMap = new Map();
    const duplicateDepartments = [];
    const departmentIdMap = new Map(); // 用于映射重复部门ID到保留的部门ID
    
    for (const department of departments) {
      const key = department.name;
      if (departmentMap.has(key)) {
        duplicateDepartments.push(department.id);
        departmentIdMap.set(department.id, departmentMap.get(key));
        console.log(`发现重复部门: ${department.name}`);
      } else {
        departmentMap.set(key, department.id);
      }
    }
    
    // 更新消费记录中的部门ID
    if (duplicateDepartments.length > 0) {
      console.log('更新消费记录中的部门ID...');
      for (const [duplicateId, originalId] of departmentIdMap.entries()) {
        await Consumption.update(
          { departmentId: originalId },
          { where: { departmentId: duplicateId } }
        );
        console.log(`将消费记录中的部门ID ${duplicateId} 更新为 ${originalId}`);
      }
    }
    
    // 更新用户表中的部门ID
    if (duplicateDepartments.length > 0) {
      console.log('更新用户表中的部门ID...');
      for (const [duplicateId, originalId] of departmentIdMap.entries()) {
        await User.update(
          { departmentId: originalId },
          { where: { departmentId: duplicateId } }
        );
        console.log(`将用户表中的部门ID ${duplicateId} 更新为 ${originalId}`);
      }
    }
    
    // 删除重复部门
    if (duplicateDepartments.length > 0) {
      await Department.destroy({ where: { id: duplicateDepartments } });
      console.log(`删除了 ${duplicateDepartments.length} 个重复部门`);
    }
    
    // 检查仓库表重复数据
    console.log('检查仓库表...');
    const warehouses = await Warehouse.findAll();
    const warehouseMap = new Map();
    const duplicateWarehouses = [];
    const warehouseIdMap = new Map(); // 用于映射重复仓库ID到保留的仓库ID
    
    for (const warehouse of warehouses) {
      const key = warehouse.name;
      if (warehouseMap.has(key)) {
        duplicateWarehouses.push(warehouse.id);
        warehouseIdMap.set(warehouse.id, warehouseMap.get(key));
        console.log(`发现重复仓库: ${warehouse.name}`);
      } else {
        warehouseMap.set(key, warehouse.id);
      }
    }
    
    // 更新库存表中的仓库ID
    if (duplicateWarehouses.length > 0) {
      console.log('更新库存表中的仓库ID...');
      for (const [duplicateId, originalId] of warehouseIdMap.entries()) {
        await Inventory.update(
          { warehouseId: originalId },
          { where: { warehouseId: duplicateId } }
        );
        console.log(`将库存表中的仓库ID ${duplicateId} 更新为 ${originalId}`);
      }
    }
    
    // 更新送水记录表中的仓库ID
    if (duplicateWarehouses.length > 0) {
      console.log('更新送水记录表中的仓库ID...');
      for (const [duplicateId, originalId] of warehouseIdMap.entries()) {
        await DeliveryRecord.update(
          { warehouseId: originalId },
          { where: { warehouseId: duplicateId } }
        );
        console.log(`将送水记录表中的仓库ID ${duplicateId} 更新为 ${originalId}`);
      }
    }
    
    // 更新消费记录中的仓库ID
    if (duplicateWarehouses.length > 0) {
      console.log('更新消费记录中的仓库ID...');
      for (const [duplicateId, originalId] of warehouseIdMap.entries()) {
        await Consumption.update(
          { warehouseId: originalId },
          { where: { warehouseId: duplicateId } }
        );
        console.log(`将消费记录中的仓库ID ${duplicateId} 更新为 ${originalId}`);
      }
    }
    
    // 删除重复仓库
    if (duplicateWarehouses.length > 0) {
      await Warehouse.destroy({ where: { id: duplicateWarehouses } });
      console.log(`删除了 ${duplicateWarehouses.length} 个重复仓库`);
    }
    
    // 检查饮用水品类表重复数据
    console.log('检查饮用水品类表...');
    const waterCategories = await WaterCategory.findAll();
    const waterCategoryMap = new Map();
    const duplicateWaterCategories = [];
    const waterCategoryIdMap = new Map(); // 用于映射重复品类ID到保留的品类ID
    
    for (const category of waterCategories) {
      const key = category.name;
      if (waterCategoryMap.has(key)) {
        duplicateWaterCategories.push(category.id);
        waterCategoryIdMap.set(category.id, waterCategoryMap.get(key));
        console.log(`发现重复饮用水品类: ${category.name}`);
      } else {
        waterCategoryMap.set(key, category.id);
      }
    }
    
    // 更新库存表中的饮用水品类ID
    if (duplicateWaterCategories.length > 0) {
      console.log('更新库存表中的饮用水品类ID...');
      for (const [duplicateId, originalId] of waterCategoryIdMap.entries()) {
        await Inventory.update(
          { waterCategoryId: originalId },
          { where: { waterCategoryId: duplicateId } }
        );
        console.log(`将库存表中的饮用水品类ID ${duplicateId} 更新为 ${originalId}`);
      }
    }
    
    // 更新送水记录表中的饮用水品类ID
    if (duplicateWaterCategories.length > 0) {
      console.log('更新送水记录表中的饮用水品类ID...');
      for (const [duplicateId, originalId] of waterCategoryIdMap.entries()) {
        await DeliveryRecord.update(
          { waterCategoryId: originalId },
          { where: { waterCategoryId: duplicateId } }
        );
        console.log(`将送水记录表中的饮用水品类ID ${duplicateId} 更新为 ${originalId}`);
      }
    }
    
    // 更新消费记录中的饮用水品类ID
    if (duplicateWaterCategories.length > 0) {
      console.log('更新消费记录中的饮用水品类ID...');
      for (const [duplicateId, originalId] of waterCategoryIdMap.entries()) {
        await Consumption.update(
          { waterCategoryId: originalId },
          { where: { waterCategoryId: duplicateId } }
        );
        console.log(`将消费记录中的饮用水品类ID ${duplicateId} 更新为 ${originalId}`);
      }
    }
    
    // 删除重复饮用水品类
    if (duplicateWaterCategories.length > 0) {
      await WaterCategory.destroy({ where: { id: duplicateWaterCategories } });
      console.log(`删除了 ${duplicateWaterCategories.length} 个重复饮用水品类`);
    }
    
    // 检查账单表重复数据
    console.log('检查账单表...');
    const bills = await Bill.findAll();
    const billMap = new Map();
    const duplicateBills = [];
    
    for (const bill of bills) {
      const key = bill.billNo;
      if (billMap.has(key)) {
        duplicateBills.push(bill.id);
        console.log(`发现重复账单: ${bill.billNo}`);
      } else {
        billMap.set(key, bill.id);
      }
    }
    
    // 删除重复账单
    if (duplicateBills.length > 0) {
      await Bill.destroy({ where: { id: duplicateBills } });
      console.log(`删除了 ${duplicateBills.length} 个重复账单`);
    }
    
    console.log('重复数据检查和删除完成');
  } catch (error) {
    console.error('检查和删除重复数据失败:', error);
  } finally {
    await sequelize.close();
  }
};

// 执行检查和删除
try {
  checkAndDeleteDuplicates();
} catch (error) {
  console.error('执行失败:', error);
}
const Inventory = require('../models/Inventory');
const WaterCategory = require('../models/WaterCategory');
const Warehouse = require('../models/Warehouse');
const DeliveryRecord = require('../models/DeliveryRecord');
const Consumption = require('../models/Consumption');
const SystemLog = require('../models/SystemLog');

class InventoryService {
  // 获取库存列表
  async getInventoryList() {
    try {
      const inventoryList = await Inventory.findAll({
        include: [{
          model: WaterCategory,
          as: 'waterCategory',
          attributes: ['id', 'name', 'unit', 'price']
        }, {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name', 'location']
        }],
        order: [['warehouseId', 'ASC'], ['waterCategoryId', 'ASC']]
      });

      // 使用数据库中存储的实际空桶库存数量
      for (const inventory of inventoryList) {
        // 将数据库中的空桶数量作为剩余空桶数量
        inventory.dataValues.remainingEmptyBuckets = inventory.emptyBucketQuantity;
      }

      return inventoryList;
    } catch (error) {
      throw new Error('获取库存列表失败: ' + error.message);
    }
  }

  // 获取库存详情
  async getInventoryDetail(id) {
    try {
      const inventory = await Inventory.findByPk(id, {
        include: [{
          model: WaterCategory,
          as: 'waterCategory',
          attributes: ['id', 'name', 'unit', 'price']
        }, {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name', 'location']
        }]
      });
      
      if (!inventory) {
        throw new Error('库存记录不存在');
      }

      // 使用数据库中存储的实际空桶库存数量
      // 将数据库中的空桶数量作为剩余空桶数量
      inventory.dataValues.remainingEmptyBuckets = inventory.emptyBucketQuantity;
      
      return inventory;
    } catch (error) {
      throw new Error('获取库存详情失败: ' + error.message);
    }
  }

  // 更新库存信息
  async updateInventory(id, data) {
    try {
      const inventory = await Inventory.findByPk(id);
      if (!inventory) {
        throw new Error('库存记录不存在');
      }
      
      await inventory.update(data);
      
      // 记录系统日志
      await SystemLog.create({
        operation: `更新库存信息: ID ${id}`,
        module: '库存管理'
      });
      
      return inventory;
    } catch (error) {
      throw new Error('更新库存信息失败: ' + error.message);
    }
  }

  // 获取库存预警
  async getInventoryAlert() {
    try {
      const inventoryList = await Inventory.findAll({
        include: [{
          model: WaterCategory,
          as: 'waterCategory',
          attributes: ['id', 'name', 'unit', 'price']
        }, {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name', 'location']
        }]
      });

      // 使用数据库中存储的实际空桶库存数量
      for (const inventory of inventoryList) {
        // 将数据库中的空桶数量作为剩余空桶数量
        inventory.dataValues.remainingEmptyBuckets = inventory.emptyBucketQuantity;
      }
      
      // 筛选出库存数量低于预警阈值的记录
      const alertList = inventoryList.filter(item => {
        return item.quantity <= item.alertThreshold;
      });
      
      return alertList;
    } catch (error) {
      throw new Error('获取库存预警失败: ' + error.message);
    }
  }

  // 获取饮用水品类列表（用于库存管理）
  async getWaterCategoryList() {
    try {
      return await WaterCategory.findAll({ where: { status: 1 } });
    } catch (error) {
      throw new Error('获取饮用水品类列表失败: ' + error.message);
    }
  }

  // 添加饮用水品类
  async addWaterCategory(data) {
    try {
      const result = await WaterCategory.create(data);
      
      // 记录系统日志
      await SystemLog.create({
        operation: `添加饮用水品类: ${data.name}`,
        module: '库存管理'
      });
      
      return result;
    } catch (error) {
      throw new Error('添加饮用水品类失败: ' + error.message);
    }
  }
}

module.exports = new InventoryService();
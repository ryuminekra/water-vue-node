const DeliveryRecord = require('../models/DeliveryRecord');
const Consumption = require('../models/Consumption');
const Inventory = require('../models/Inventory');
const Bill = require('../models/Bill');
const WaterCategory = require('../models/WaterCategory');
const Warehouse = require('../models/Warehouse');
const Department = require('../models/Department');
const { Op } = require('sequelize');

class StatisticsService {
  // 获取送水统计
  async getDeliveryStatistics(startDate, endDate) {
    try {
      // 构建查询条件
      const whereCondition = {};
      if (startDate) {
        whereCondition.date = {
          ...whereCondition.date,
          [Op.gte]: new Date(startDate)
        };
      }
      if (endDate) {
        whereCondition.date = {
          ...whereCondition.date,
          [Op.lte]: new Date(endDate)
        };
      }
      
      // 查询送水记录，包含仓库和饮用水品类信息
      const deliveryList = await DeliveryRecord.findAll({
        where: whereCondition,
        include: [{
          model: WaterCategory,
          as: 'waterCategory',
          attributes: ['id', 'name', 'price']
        }, {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name']
        }]
      });
      
      // 按仓库和品类统计送水量和金额
      const warehouseStats = {};
      let totalQuantity = 0;
      let totalAmount = 0;
      
      for (const item of deliveryList) {
        const warehouseId = item.warehouseId;
        const warehouseName = item.warehouse ? item.warehouse.name : '未知仓库';
        const categoryId = item.waterCategoryId;
        const categoryName = item.waterCategory.name;
        const quantity = item.quantity;
        const amount = quantity * item.waterCategory.price;
        
        // 初始化仓库统计
        if (!warehouseStats[warehouseId]) {
          warehouseStats[warehouseId] = {
            id: warehouseId,
            name: warehouseName,
            totalQuantity: 0,
            totalAmount: 0,
            categoryStats: {}
          };
        }
        
        // 初始化品类统计
        if (!warehouseStats[warehouseId].categoryStats[categoryId]) {
          warehouseStats[warehouseId].categoryStats[categoryId] = {
            id: categoryId,
            name: categoryName,
            quantity: 0,
            amount: 0
          };
        }
        
        // 累加统计数据
        warehouseStats[warehouseId].categoryStats[categoryId].quantity += quantity;
        warehouseStats[warehouseId].categoryStats[categoryId].amount += amount;
        warehouseStats[warehouseId].totalQuantity += quantity;
        warehouseStats[warehouseId].totalAmount += amount;
        totalQuantity += quantity;
        totalAmount += amount;
      }
      
      // 转换格式，将品类统计对象转换为数组
      Object.values(warehouseStats).forEach(warehouse => {
        warehouse.categoryStats = Object.values(warehouse.categoryStats);
      });
      
      return {
        totalQuantity,
        totalAmount,
        warehouseStats: Object.values(warehouseStats)
      };
    } catch (error) {
      throw new Error('获取送水统计失败: ' + error.message);
    }
  }

  // 获取领用统计
  async getConsumptionStatistics(startDate, endDate) {
    try {
      // 构建查询条件
      const whereCondition = {};
      if (startDate) {
        whereCondition.consumptionDate = {
          ...whereCondition.consumptionDate,
          [Op.gte]: new Date(startDate)
        };
      }
      if (endDate) {
        whereCondition.consumptionDate = {
          ...whereCondition.consumptionDate,
          [Op.lte]: new Date(endDate)
        };
      }
      
      // 查询领用记录，包含部门和饮用水品类信息
      const consumptionList = await Consumption.findAll({
        where: whereCondition,
        include: [{
          model: WaterCategory,
          as: 'waterCategory',
          attributes: ['id', 'name', 'price']
        }, {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        }]
      });
      
      // 按部门和品类统计领用量和金额
      const departmentStats = {};
      let totalQuantity = 0;
      let totalAmount = 0;
      
      for (const item of consumptionList) {
        const departmentId = item.departmentId;
        const departmentName = item.department ? item.department.name : '未知部门';
        const categoryId = item.waterCategoryId;
        const categoryName = item.waterCategory.name;
        const quantity = item.quantity;
        const amount = quantity * item.waterCategory.price;
        
        // 初始化部门统计
        if (!departmentStats[departmentId]) {
          departmentStats[departmentId] = {
            id: departmentId,
            name: departmentName,
            totalQuantity: 0,
            totalAmount: 0,
            categoryStats: {}
          };
        }
        
        // 初始化品类统计
        if (!departmentStats[departmentId].categoryStats[categoryId]) {
          departmentStats[departmentId].categoryStats[categoryId] = {
            id: categoryId,
            name: categoryName,
            quantity: 0,
            amount: 0
          };
        }
        
        // 累加统计数据
        departmentStats[departmentId].categoryStats[categoryId].quantity += quantity;
        departmentStats[departmentId].categoryStats[categoryId].amount += amount;
        departmentStats[departmentId].totalQuantity += quantity;
        departmentStats[departmentId].totalAmount += amount;
        totalQuantity += quantity;
        totalAmount += amount;
      }
      
      // 转换格式，将品类统计对象转换为数组
      Object.values(departmentStats).forEach(department => {
        department.categoryStats = Object.values(department.categoryStats);
      });
      
      return {
        totalQuantity,
        totalAmount,
        departmentStats: Object.values(departmentStats)
      };
    } catch (error) {
      throw new Error('获取领用统计失败: ' + error.message);
    }
  }

  // 获取库存统计
  async getInventoryStatistics() {
    try {
      // 查询所有库存记录，包含仓库和饮用水品类信息
      const inventoryList = await Inventory.findAll({
        include: [{
          model: WaterCategory,
          as: 'waterCategory',
          attributes: ['id', 'name', 'price']
        }, {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name']
        }]
      });
      
      // 按仓库和品类统计库存数据
      const warehouseStats = {};
      let totalValue = 0;
      let totalEmptyBuckets = 0;
      
      for (const item of inventoryList) {
        const warehouseId = item.warehouseId;
        const warehouseName = item.warehouse ? item.warehouse.name : '未知仓库';
        const categoryId = item.waterCategoryId;
        const categoryName = item.waterCategory.name;
        const quantity = item.quantity;
        const emptyBucketQuantity = item.emptyBucketQuantity;
        const value = quantity * item.waterCategory.price;
        const alertThreshold = item.alertThreshold;
        const isAlert = item.quantity <= item.alertThreshold;
        
        // 初始化仓库统计
        if (!warehouseStats[warehouseId]) {
          warehouseStats[warehouseId] = {
            id: warehouseId,
            name: warehouseName,
            totalValue: 0,
            totalEmptyBuckets: 0,
            categoryStats: {}
          };
        }
        
        // 初始化品类统计
        if (!warehouseStats[warehouseId].categoryStats[categoryId]) {
          warehouseStats[warehouseId].categoryStats[categoryId] = {
            id: categoryId,
            name: categoryName,
            quantity: 0,
            emptyBucketQuantity: 0,
            value: 0,
            alertThreshold: alertThreshold,
            isAlert: isAlert
          };
        }
        
        // 累加统计数据
        warehouseStats[warehouseId].categoryStats[categoryId].quantity = quantity;
        warehouseStats[warehouseId].categoryStats[categoryId].emptyBucketQuantity = emptyBucketQuantity;
        warehouseStats[warehouseId].categoryStats[categoryId].value = value;
        warehouseStats[warehouseId].totalValue += value;
        warehouseStats[warehouseId].totalEmptyBuckets += emptyBucketQuantity;
        totalValue += value;
        totalEmptyBuckets += emptyBucketQuantity;
      }
      
      // 转换格式，将品类统计对象转换为数组
      Object.values(warehouseStats).forEach(warehouse => {
        warehouse.categoryStats = Object.values(warehouse.categoryStats);
      });
      
      return {
        totalValue,
        totalEmptyBuckets,
        warehouseStats: Object.values(warehouseStats)
      };
    } catch (error) {
      throw new Error('获取库存统计失败: ' + error.message);
    }
  }

  // 获取结算统计
  async getBillingStatistics(startDate, endDate) {
    try {
      // 构建查询条件
      const whereCondition = {};
      if (startDate) {
        whereCondition.createdAt = {
          ...whereCondition.createdAt,
          [Op.gte]: new Date(startDate)
        };
      }
      if (endDate) {
        whereCondition.createdAt = {
          ...whereCondition.createdAt,
          [Op.lte]: new Date(endDate)
        };
      }
      
      // 查询账单
      const billList = await Bill.findAll({
        where: whereCondition
      });
      
      // 按状态统计账单
      const statusStats = {
        UNPAID: 0,
        PAID: 0,
        CANCELLED: 0
      };
      let totalAmount = 0;
      let paidAmount = 0;
      
      for (const bill of billList) {
        statusStats[bill.status]++;
        totalAmount += parseFloat(bill.totalAmount);
        if (bill.status === 'PAID') {
          paidAmount += parseFloat(bill.totalAmount);
        }
      }
      
      return {
        totalAmount,
        paidAmount,
        statusStats
      };
    } catch (error) {
      throw new Error('获取结算统计失败: ' + error.message);
    }
  }
}

module.exports = new StatisticsService();
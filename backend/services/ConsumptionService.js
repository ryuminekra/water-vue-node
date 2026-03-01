const Consumption = require('../models/Consumption');
const WaterCategory = require('../models/WaterCategory');
const Warehouse = require('../models/Warehouse');
const Department = require('../models/Department');
const Inventory = require('../models/Inventory');
const SystemLog = require('../models/SystemLog');

class ConsumptionService {
  // 提交领用申请
  async addConsumption(data) {
    try {
      // 开始事务
      const transaction = await Consumption.sequelize.transaction();
      
      try {
        // 检查库存是否足够
        const inventory = await Inventory.findOne({
          where: { 
            waterCategoryId: data.waterCategoryId,
            warehouseId: data.warehouseId
          },
          transaction
        });
        
        if (!inventory || inventory.quantity < data.quantity) {
          throw new Error('库存不足');
        }
        
        // 创建领用记录
        const consumption = await Consumption.create(data, { transaction });
        
        // 计算库存变化：减少领用数量，增加归还空桶数量
        const returnEmptyBottles = data.returnEmptyBottles || 0;
        await inventory.update(
          {
            quantity: inventory.quantity - data.quantity,
            emptyBucketQuantity: inventory.emptyBucketQuantity + returnEmptyBottles
          },
          { transaction }
        );
        
        // 记录系统日志
        await SystemLog.create(
          {
            operation: `提交领用申请: 品类ID ${data.waterCategoryId}, 数量 ${data.quantity}, 归还空桶 ${returnEmptyBottles}`,
            module: '领用管理'
          },
          { transaction }
        );
        
        // 提交事务
        await transaction.commit();
        
        return consumption;
      } catch (error) {
        // 回滚事务
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      throw new Error('提交领用申请失败: ' + error.message);
    }
  }

  // 获取领用记录列表
  async getConsumptionList(page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      
      const { count, rows } = await Consumption.findAndCountAll({
        include: [{
          model: WaterCategory,
          as: 'waterCategory',
          attributes: ['id', 'name', 'unit', 'price']
        }, {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name']
        }, {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        }],
        order: [['consumptionDate', 'DESC']],
        limit: pageSize,
        offset: offset
      });
      
      return {
        total: count,
        data: rows,
        page: page,
        pageSize: pageSize
      };
    } catch (error) {
      throw new Error('获取领用记录列表失败: ' + error.message);
    }
  }

  // 获取仓库列表（用于领用管理）
  async getWarehouseList() {
    try {
      return await Warehouse.findAll();
    } catch (error) {
      throw new Error('获取仓库列表失败: ' + error.message);
    }
  }

  // 获取部门列表（用于领用管理）
  async getDepartmentList() {
    try {
      return await Department.findAll({ where: { status: 1 } });
    } catch (error) {
      throw new Error('获取部门列表失败: ' + error.message);
    }
  }

  // 获取领用记录详情
  async getConsumptionDetail(id) {
    try {
      const consumption = await Consumption.findByPk(id, {
        include: [{
          model: WaterCategory,
          as: 'waterCategory',
          attributes: ['id', 'name', 'unit', 'price']
        }]
      });
      
      if (!consumption) {
        throw new Error('领用记录不存在');
      }
      
      return consumption;
    } catch (error) {
      throw new Error('获取领用记录详情失败: ' + error.message);
    }
  }

  // 获取饮用水品类列表（用于领用管理）
  async getWaterCategoryList() {
    try {
      return await WaterCategory.findAll({ where: { status: 1 } });
    } catch (error) {
      throw new Error('获取饮用水品类列表失败: ' + error.message);
    }
  }
}

module.exports = new ConsumptionService();
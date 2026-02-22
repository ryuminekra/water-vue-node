const WaterCategory = require('../models/WaterCategory');
const DeliveryRecord = require('../models/DeliveryRecord');
const Inventory = require('../models/Inventory');
const SystemLog = require('../models/SystemLog');

class DeliveryService {
  // 添加饮用水品类
  async addWaterCategory(data) {
    try {
      const category = await WaterCategory.create(data);
      
      // 记录系统日志
      await SystemLog.create({
        operation: `添加饮用水品类: ${data.name}`,
        module: '送水管理'
      });
      
      return category;
    } catch (error) {
      throw new Error('添加饮用水品类失败: ' + error.message);
    }
  }

  // 获取饮用水品类列表
  async getWaterCategoryList() {
    try {
      return await WaterCategory.findAll({ where: { status: 1 } });
    } catch (error) {
      throw new Error('获取饮用水品类列表失败: ' + error.message);
    }
  }

  // 更新饮用水品类
  async updateWaterCategory(id, data) {
    try {
      const category = await WaterCategory.findByPk(id);
      if (!category) {
        throw new Error('饮用水品类不存在');
      }
      
      await category.update(data);
      
      // 记录系统日志
      await SystemLog.create({
        operation: `更新饮用水品类: ${data.name}`,
        module: '送水管理'
      });
      
      return category;
    } catch (error) {
      throw new Error('更新饮用水品类失败: ' + error.message);
    }
  }

  // 删除饮用水品类
  async deleteWaterCategory(id) {
    try {
      const category = await WaterCategory.findByPk(id);
      if (!category) {
        throw new Error('饮用水品类不存在');
      }
      
      await category.update({ status: 0 });
      
      // 记录系统日志
      await SystemLog.create({
        operation: `删除饮用水品类: ${category.name}`,
        module: '送水管理'
      });
      
      return { success: true };
    } catch (error) {
      throw new Error('删除饮用水品类失败: ' + error.message);
    }
  }

  // 添加送水记录
  async addDeliveryRecord(data) {
    try {
      // 开始事务
      const transaction = await DeliveryRecord.sequelize.transaction();
      
      try {
        // 检查是否是管理员添加（管理员可以直接审批）
        const isAdmin = data.isAdmin || false;
        const status = isAdmin ? 'APPROVED' : 'PENDING';
        
        // 创建送水记录
        const record = await DeliveryRecord.create(
          { ...data, status },
          { transaction }
        );
        
        // 记录系统日志
        await SystemLog.create(
          {
            operation: `添加送水记录: 品类ID ${data.waterCategoryId}, 数量 ${data.quantity}, 领取空桶数量 ${data.emptyBucketQuantity}, 状态 ${status}`,
            module: '送水管理'
          },
          { transaction }
        );
        
        // 如果是管理员添加或直接审批通过，更新库存
        if (status === 'APPROVED') {
          // 更新库存
          let inventory = await Inventory.findOne({
            where: { 
              waterCategoryId: data.waterCategoryId,
              warehouseId: data.warehouseId
            },
            transaction
          });
          
          if (inventory) {
            // 增加库存
            await inventory.update(
              { quantity: inventory.quantity + data.quantity },
              { transaction }
            );
          } else {
            // 获取仓库信息
            const Warehouse = require('../models/Warehouse');
            const warehouse = await Warehouse.findByPk(data.warehouseId, { transaction });
            
            // 创建新的库存记录
            await Inventory.create(
              {
                waterCategoryId: data.waterCategoryId,
                warehouseId: data.warehouseId,
                quantity: data.quantity,
                emptyBucketQuantity: 0,
                location: warehouse ? warehouse.name : '默认仓库',
                alertThreshold: 10
              },
              { transaction }
            );
          }
          
          // 处理领取空桶数量
          if (data.emptyBucketQuantity > 0) {
            // 更新空桶库存
            if (inventory) {
              // 减少空桶库存
              if (inventory.emptyBucketQuantity < data.emptyBucketQuantity) {
                throw new Error('空桶库存不足');
              }
              await inventory.update(
                { emptyBucketQuantity: inventory.emptyBucketQuantity - data.emptyBucketQuantity },
                { transaction }
              );
            } else {
              // 如果库存不存在，抛出错误
              throw new Error('库存不存在，无法领取空桶');
            }
          }
        }
        
        // 提交事务
        await transaction.commit();
        
        return record;
      } catch (error) {
        // 回滚事务
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      throw new Error('添加送水记录失败: ' + error.message);
    }
  }

  // 审批送水记录
  async approveDeliveryRecord(id, status) {
    try {
      // 开始事务
      const transaction = await DeliveryRecord.sequelize.transaction();
      
      try {
        // 查找送水记录
        const record = await DeliveryRecord.findByPk(id, { transaction });
        if (!record) {
          throw new Error('送水记录不存在');
        }
        
        // 检查状态是否可以审批
        if (record.status !== 'PENDING') {
          throw new Error('送水记录已经审批过了');
        }
        
        // 更新状态
        await record.update({ status }, { transaction });
        
        // 如果审批通过，更新库存
        if (status === 'APPROVED') {
          // 更新库存
          let inventory = await Inventory.findOne({
            where: { 
              waterCategoryId: record.waterCategoryId,
              warehouseId: record.warehouseId
            },
            transaction
          });
          
          if (inventory) {
            // 增加库存
            await inventory.update(
              { quantity: inventory.quantity + record.quantity },
              { transaction }
            );
          } else {
            // 获取仓库信息
            const Warehouse = require('../models/Warehouse');
            const warehouse = await Warehouse.findByPk(record.warehouseId, { transaction });
            
            // 创建新的库存记录
            await Inventory.create(
              {
                waterCategoryId: record.waterCategoryId,
                warehouseId: record.warehouseId,
                quantity: record.quantity,
                emptyBucketQuantity: 0,
                location: warehouse ? warehouse.name : '默认仓库',
                alertThreshold: 10
              },
              { transaction }
            );
          }
          
          // 处理领取空桶数量
          if (record.emptyBucketQuantity > 0) {
            // 更新空桶库存
            if (inventory) {
              // 减少空桶库存
              if (inventory.emptyBucketQuantity < record.emptyBucketQuantity) {
                throw new Error('空桶库存不足');
              }
              await inventory.update(
                { emptyBucketQuantity: inventory.emptyBucketQuantity - record.emptyBucketQuantity },
                { transaction }
              );
            } else {
              // 如果库存不存在，抛出错误
              throw new Error('库存不存在，无法领取空桶');
            }
          }
        }
        
        // 记录系统日志
        await SystemLog.create(
          {
            operation: `审批送水记录: ID ${id}, 状态 ${status}`,
            module: '送水管理'
          },
          { transaction }
        );
        
        // 提交事务
        await transaction.commit();
        
        return record;
      } catch (error) {
        // 回滚事务
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      throw new Error('审批送水记录失败: ' + error.message);
    }
  }

  // 获取送水记录列表
  async getDeliveryRecordList() {
    try {
      return await DeliveryRecord.findAll({
        include: [{
          model: WaterCategory,
          as: 'waterCategory',
          attributes: ['id', 'name', 'unit', 'price']
        }, {
          model: require('../models/Warehouse'),
          as: 'warehouse',
          attributes: ['id', 'name']
        }],
        order: [['date', 'DESC']]
      });
    } catch (error) {
      throw new Error('获取送水记录列表失败: ' + error.message);
    }
  }

  // 获取送水记录详情
  async getDeliveryRecordDetail(id) {
    try {
      const record = await DeliveryRecord.findByPk(id, {
        include: [{
          model: WaterCategory,
          as: 'waterCategory',
          attributes: ['id', 'name', 'unit', 'price']
        }, {
          model: require('../models/Warehouse'),
          as: 'warehouse',
          attributes: ['id', 'name']
        }]
      });
      
      if (!record) {
        throw new Error('送水记录不存在');
      }
      
      return record;
    } catch (error) {
      throw new Error('获取送水记录详情失败: ' + error.message);
    }
  }

  // 更新送水记录
  async updateDeliveryRecord(id, data) {
    try {
      const record = await DeliveryRecord.findByPk(id);
      if (!record) {
        throw new Error('送水记录不存在');
      }
      
      await record.update(data);
      
      // 记录系统日志
      await SystemLog.create({
        operation: `更新送水记录: ID ${id}`,
        module: '送水管理'
      });
      
      return record;
    } catch (error) {
      throw new Error('更新送水记录失败: ' + error.message);
    }
  }

  // 删除送水记录
  async deleteDeliveryRecord(id) {
    try {
      const record = await DeliveryRecord.findByPk(id);
      if (!record) {
        throw new Error('送水记录不存在');
      }
      
      await record.destroy();
      
      // 记录系统日志
      await SystemLog.create({
        operation: `删除送水记录: ID ${id}`,
        module: '送水管理'
      });
      
      return { success: true };
    } catch (error) {
      throw new Error('删除送水记录失败: ' + error.message);
    }
  }
}

module.exports = new DeliveryService();
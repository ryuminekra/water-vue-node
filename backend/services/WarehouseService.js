const Warehouse = require('../models/Warehouse');
const SystemLog = require('../models/SystemLog');

class WarehouseService {
  // 获取所有仓库
  async getAllWarehouses() {
    try {
      return await Warehouse.findAll({ order: [['createdAt', 'DESC']] });
    } catch (error) {
      throw new Error('获取仓库列表失败: ' + error.message);
    }
  }

  // 根据ID获取仓库
  async getWarehouseById(id) {
    try {
      const warehouse = await Warehouse.findByPk(id);
      if (!warehouse) {
        throw new Error('仓库不存在');
      }
      return warehouse;
    } catch (error) {
      throw new Error('获取仓库失败: ' + error.message);
    }
  }

  // 创建仓库
  async createWarehouse(data) {
    try {
      const warehouse = await Warehouse.create(data);
      // 记录系统日志
      await SystemLog.create({
        operation: `创建仓库: ${data.name}`,
        module: '仓库管理',
        ip: '127.0.0.1' // 实际项目中应该从请求中获取IP
      });
      return warehouse;
    } catch (error) {
      throw new Error('创建仓库失败: ' + error.message);
    }
  }

  // 更新仓库
  async updateWarehouse(id, data) {
    try {
      const warehouse = await Warehouse.findByPk(id);
      if (!warehouse) {
        throw new Error('仓库不存在');
      }
      await warehouse.update(data);
      // 记录系统日志
      await SystemLog.create({
        operation: `更新仓库: ${warehouse.name}`,
        module: '仓库管理',
        ip: '127.0.0.1' // 实际项目中应该从请求中获取IP
      });
      return warehouse;
    } catch (error) {
      throw new Error('更新仓库失败: ' + error.message);
    }
  }

  // 删除仓库
  async deleteWarehouse(id) {
    try {
      const warehouse = await Warehouse.findByPk(id);
      if (!warehouse) {
        throw new Error('仓库不存在');
      }
      const warehouseName = warehouse.name;
      await warehouse.destroy();
      // 记录系统日志
      await SystemLog.create({
        operation: `删除仓库: ${warehouseName}`,
        module: '仓库管理',
        ip: '127.0.0.1' // 实际项目中应该从请求中获取IP
      });
      return { message: '删除成功' };
    } catch (error) {
      throw new Error('删除仓库失败: ' + error.message);
    }
  }
}

module.exports = new WarehouseService;
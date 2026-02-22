const Department = require('../models/Department');
const SystemLog = require('../models/SystemLog');

class DepartmentService {
  // 获取所有部门
  async getAllDepartments() {
    try {
      return await Department.findAll({ order: [['createdAt', 'DESC']] });
    } catch (error) {
      throw new Error('获取部门列表失败: ' + error.message);
    }
  }

  // 根据ID获取部门
  async getDepartmentById(id) {
    try {
      const department = await Department.findByPk(id);
      if (!department) {
        throw new Error('部门不存在');
      }
      return department;
    } catch (error) {
      throw new Error('获取部门失败: ' + error.message);
    }
  }

  // 创建部门
  async createDepartment(data) {
    try {
      const department = await Department.create(data);
      // 记录系统日志
      await SystemLog.create({
        operation: `创建部门: ${data.name}`,
        module: '部门管理',
        ip: '127.0.0.1' // 实际项目中应该从请求中获取IP
      });
      return department;
    } catch (error) {
      throw new Error('创建部门失败: ' + error.message);
    }
  }

  // 更新部门
  async updateDepartment(id, data) {
    try {
      const department = await Department.findByPk(id);
      if (!department) {
        throw new Error('部门不存在');
      }
      await department.update(data);
      // 记录系统日志
      await SystemLog.create({
        operation: `更新部门: ${department.name}`,
        module: '部门管理',
        ip: '127.0.0.1' // 实际项目中应该从请求中获取IP
      });
      return department;
    } catch (error) {
      throw new Error('更新部门失败: ' + error.message);
    }
  }

  // 删除部门
  async deleteDepartment(id) {
    try {
      const department = await Department.findByPk(id);
      if (!department) {
        throw new Error('部门不存在');
      }
      const departmentName = department.name;
      await department.destroy();
      // 记录系统日志
      await SystemLog.create({
        operation: `删除部门: ${departmentName}`,
        module: '部门管理',
        ip: '127.0.0.1' // 实际项目中应该从请求中获取IP
      });
      return { message: '删除成功' };
    } catch (error) {
      throw new Error('删除部门失败: ' + error.message);
    }
  }
}

module.exports = new DepartmentService;
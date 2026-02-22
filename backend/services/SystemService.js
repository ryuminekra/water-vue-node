const SystemLog = require('../models/SystemLog');

class SystemService {
  // 获取系统日志
  async getSystemLogs() {
    try {
      return await SystemLog.findAll({ order: [['createdAt', 'DESC']] });
    } catch (error) {
      throw new Error('获取系统日志失败: ' + error.message);
    }
  }
}

module.exports = new SystemService();
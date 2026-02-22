const { Sequelize } = require('sequelize');

// 创建 Sequelize 实例
const sequelize = new Sequelize(
  process.env.DB_NAME || 'water_system',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '123456',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 30000
    },
    dialectOptions: {
      connectTimeout: 60000
    }
  }
);

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
};

module.exports = {
  sequelize,
  testConnection
};
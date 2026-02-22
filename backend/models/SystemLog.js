const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SystemLog = sequelize.define('SystemLog', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '日志ID'
  },
  operation: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '操作内容'
  },
  ip: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '操作IP'
  },
  module: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '操作模块'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'system_log',
  timestamps: true,
  underscored: true
});

module.exports = SystemLog;
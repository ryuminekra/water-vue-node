const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '部门ID'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '部门名称'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '部门描述'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：1-启用，0-禁用'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '更新时间'
  }
}, {
  tableName: 'department',
  timestamps: true,
  underscored: true
});

module.exports = Department;
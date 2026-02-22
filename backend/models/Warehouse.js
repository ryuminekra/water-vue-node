const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Warehouse = sequelize.define('Warehouse', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '仓库ID'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '仓库名称'
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '仓库位置'
  },
  contactPerson: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '联系人'
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '联系电话'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '仓库描述'
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
  tableName: 'warehouse',
  timestamps: true,
  underscored: true
});

module.exports = Warehouse;
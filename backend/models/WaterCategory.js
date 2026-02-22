const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WaterCategory = sequelize.define('WaterCategory', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '饮用水品类ID'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '品类名称'
  },
  unit: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '单位：桶、件'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '单价'
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '容量（升）'
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
    onUpdate: DataTypes.NOW,
    comment: '更新时间'
  }
}, {
  tableName: 'water_category',
  timestamps: true,
  underscored: true
});

module.exports = WaterCategory;
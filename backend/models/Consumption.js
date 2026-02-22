const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const WaterCategory = require('./WaterCategory');
const Warehouse = require('./Warehouse');
const Department = require('./Department');

const Consumption = sequelize.define('Consumption', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '领用记录ID'
  },
  waterCategoryId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'water_category_id',
    comment: '饮用水品类ID'
  },
  warehouseId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'warehouse_id',
    comment: '领用仓库ID'
  },
  departmentId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'department_id',
    comment: '领用部门ID'
  },
  receiver: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '领用人'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '领用数量'
  },
  returnEmptyBottles: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'return_empty_bottles',
    comment: '归还空桶数量'
  },
  consumptionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'consumption_date',
    comment: '领用时间'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '备注'
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'PENDING',
    comment: '状态：PENDING-待处理，APPROVED-已批准，REJECTED-已拒绝'
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
  tableName: 'consumption',
  timestamps: true,
  underscored: true
});

// 定义关联关系
Consumption.belongsTo(WaterCategory, {
  foreignKey: 'waterCategoryId',
  as: 'waterCategory'
});

Consumption.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  as: 'warehouse'
});

Consumption.belongsTo(Department, {
  foreignKey: 'departmentId',
  as: 'department'
});

module.exports = Consumption;
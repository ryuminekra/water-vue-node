const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const WaterCategory = require('./WaterCategory');
const Warehouse = require('./Warehouse');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '库存ID'
  },
  waterCategoryId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'water_category_id',
    comment: '饮用水品类ID',
    references: {
      model: WaterCategory,
      key: 'id'
    }
  },
  warehouseId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'warehouse_id',
    comment: '仓库ID',
    references: {
      model: Warehouse,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '数量'
  },
  emptyBucketQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'empty_bucket_quantity',
    comment: '空桶数量'
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '存放位置'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：1-正常，0-异常'
  },
  alertThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    field: 'alert_threshold',
    comment: '预警阈值'
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
  tableName: 'inventory',
  timestamps: true,
  underscored: true
});

// 关联关系
Inventory.belongsTo(WaterCategory, {
  foreignKey: 'waterCategoryId',
  as: 'waterCategory'
});

Inventory.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  as: 'warehouse'
});

module.exports = Inventory;
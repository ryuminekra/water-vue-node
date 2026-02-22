const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const WaterCategory = require('./WaterCategory');
const Warehouse = require('./Warehouse');

const DeliveryRecord = sequelize.define('DeliveryRecord', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '记录ID'
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
    comment: '领取空桶数量'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '送水日期'
  },
  remark: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: '备注'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    allowNull: false,
    defaultValue: 'PENDING',
    comment: '状态：PENDING-待审批, APPROVED-已审批, REJECTED-已拒绝'
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
  tableName: 'delivery_record',
  timestamps: true,
  underscored: true
});

// 关联关系
DeliveryRecord.belongsTo(WaterCategory, {
  foreignKey: 'waterCategoryId',
  as: 'waterCategory'
});

DeliveryRecord.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  as: 'warehouse'
});

module.exports = DeliveryRecord;
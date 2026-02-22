const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bill = sequelize.define('Bill', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '账单ID'
  },
  billNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    field: 'bill_no',
    comment: '账单编号'
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_date',
    comment: '开始日期'
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'end_date',
    comment: '结束日期'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount',
    comment: '总金额'
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '状态：UNPAID-未支付，PAID-已支付，CANCELLED-已取消'
  },
  paymentMethod: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'payment_method',
    comment: '支付方式'
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'paid_at',
    comment: '支付时间'
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
  tableName: 'bill',
  timestamps: true,
  underscored: true
});

module.exports = Bill;
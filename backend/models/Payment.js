const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Bill = require('./Bill');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '支付记录ID'
  },
  billId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'bill_id',
    comment: '账单ID',
    references: {
      model: Bill,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '支付金额'
  },
  paymentMethod: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'payment_method',
    comment: '支付方式'
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'transaction_id',
    comment: '交易编号'
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '状态：SUCCESS-成功，FAILED-失败，PENDING-处理中'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'payment',
  timestamps: true,
  underscored: true
});

// 关联关系
Payment.belongsTo(Bill, {
  foreignKey: 'billId',
  as: 'bill'
});

module.exports = Payment;
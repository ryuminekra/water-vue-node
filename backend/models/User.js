const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Department = require('./Department');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '用户ID'
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '密码'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '姓名'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '邮箱'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '电话'
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '头像URL'
  },
  departmentId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    comment: '部门ID'
  },
  role: {
    type: DataTypes.STRING(20),
    defaultValue: 'user',
    comment: '角色：admin-管理员，user-普通用户，deliveryman-送水员'
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
  tableName: 'user',
  timestamps: true,
  underscored: true
});

// 关联部门
User.belongsTo(Department, {
  foreignKey: 'departmentId',
  as: 'department'
});

module.exports = User;
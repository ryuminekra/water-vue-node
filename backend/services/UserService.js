const User = require('../models/User');
const SystemLog = require('../models/SystemLog');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {
  // 登录
  async login(username, password, ip) {
    try {
      // 查找用户
      const user = await User.findOne({ where: { username } });
      if (!user) {
        throw new Error('用户名或密码错误');
      }
      
      // 检查用户状态
      if (user.status !== 1) {
        throw new Error('用户已被禁用');
      }
      
      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('用户名或密码错误');
      }
      
      // 生成JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      // 记录登录日志
      await SystemLog.create({
        operation: `用户登录: ${username}`,
        module: '认证',
        ip: ip
      });
      
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          departmentId: user.departmentId,
          role: user.role,
          status: user.status
        }
      };
    } catch (error) {
      throw new Error('登录失败: ' + error.message);
    }
  }

  // 获取所有用户
  async getAllUsers() {
    try {
      return await User.findAll({
        include: [{ model: require('../models/Department'), as: 'department' }],
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      throw new Error('获取用户列表失败: ' + error.message);
    }
  }

  // 根据ID获取用户
  async getUserById(id) {
    try {
      const user = await User.findByPk(id, {
        include: [{ model: require('../models/Department'), as: 'department' }]
      });
      if (!user) {
        throw new Error('用户不存在');
      }
      return user;
    } catch (error) {
      throw new Error('获取用户失败: ' + error.message);
    }
  }

  // 创建用户
  async createUser(data) {
    try {
      // 密码加密
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      const user = await User.create(data);
      // 记录系统日志
      await SystemLog.create({
        operation: `创建用户: ${data.username}`,
        module: '用户管理',
        ip: '127.0.0.1' // 实际项目中应该从请求中获取IP
      });
      return user;
    } catch (error) {
      throw new Error('创建用户失败: ' + error.message);
    }
  }

  // 更新用户
  async updateUser(id, data) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('用户不存在');
      }
      // 密码加密
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      await user.update(data);
      // 记录系统日志
      await SystemLog.create({
        operation: `更新用户: ${user.username}`,
        module: '用户管理',
        ip: '127.0.0.1' // 实际项目中应该从请求中获取IP
      });
      return user;
    } catch (error) {
      throw new Error('更新用户失败: ' + error.message);
    }
  }

  // 删除用户
  async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('用户不存在');
      }
      const username = user.username;
      await user.destroy();
      // 记录系统日志
      await SystemLog.create({
        operation: `删除用户: ${username}`,
        module: '用户管理',
        ip: '127.0.0.1' // 实际项目中应该从请求中获取IP
      });
      return { message: '删除成功' };
    } catch (error) {
      throw new Error('删除用户失败: ' + error.message);
    }
  }

  // 验证token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      throw new Error('无效的token');
    }
  }

  // 修改密码
  async changePassword(id, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('用户不存在');
      }
      
      // 验证当前密码
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('当前密码错误');
      }
      
      // 加密新密码
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // 更新密码
      await user.update({ password: hashedPassword });
      
      // 记录系统日志
      await SystemLog.create({
        operation: `用户修改密码: ${user.username}`,
        module: '用户管理',
        ip: '127.0.0.1' // 实际项目中应该从请求中获取IP
      });
      
      return { message: '密码修改成功' };
    } catch (error) {
      throw new Error('修改密码失败: ' + error.message);
    }
  }
}

module.exports = new UserService;
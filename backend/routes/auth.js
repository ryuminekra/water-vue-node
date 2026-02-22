const express = require('express');
const userService = require('../services/UserService');
const router = express.Router();

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = req.ip || '127.0.0.1';
    
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    }
    
    const result = await userService.login(username, password, ip);
    res.status(200).json({ code: 200, message: '登录成功', data: result });
  } catch (error) {
    res.status(401).json({ code: 401, message: error.message });
  }
});

// 退出登录
router.post('/logout', async (req, res) => {
  try {
    const ip = req.ip || '127.0.0.1';
    const username = req.user?.username || '未知用户';
    
    // 记录退出登录日志
    await require('../models/SystemLog').create({
      operation: `用户退出: ${username}`,
      module: '认证',
      ip: ip
    });
    
    res.status(200).json({ code: 200, message: '退出成功' });
  } catch (error) {
    res.status(200).json({ code: 200, message: '退出成功' });
  }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ code: 401, message: '未认证' });
    }
    
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        departmentId: user.departmentId,
        department: user.department
      }
    });
  } catch (error) {
    res.status(401).json({ code: 401, message: error.message });
  }
});

module.exports = router;
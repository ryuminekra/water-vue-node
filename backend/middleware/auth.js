const userService = require('../services/UserService');

// 认证中间件
const authMiddleware = (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ code: 401, message: '缺少认证token' });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ code: 401, message: '无效的token格式' });
    }
    
    // 验证token
    const decoded = userService.verifyToken(token);
    
    // 将用户信息存储到请求对象中
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ code: 401, message: error.message });
  }
};

module.exports = authMiddleware;
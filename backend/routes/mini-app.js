const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const WarehouseService = require('../services/WarehouseService');

// 扫码登录
router.post('/login', async (req, res) => {
  try {
    const { role, warehouseId, signature } = req.body;
    
    // 验证参数
    if (!role || !warehouseId) {
      return res.status(400).json({ code: 400, message: '参数缺失' });
    }
    
    // 验证角色
    if (!['deliveryman', 'user'].includes(role)) {
      return res.status(400).json({ code: 400, message: '角色无效' });
    }
    
    // 验证仓库存在
    const warehouse = await WarehouseService.getWarehouseById(warehouseId);
    
    // 验证签名（实际项目中需要更复杂的签名验证）
    // 这里简化处理，实际应该使用密钥生成和验证签名
    
    // 生成token
    const token = jwt.sign(
      { role, warehouseId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({ code: 200, data: { token, role, warehouse }, message: '登录成功' });
  } catch (error) {
    console.error('扫码登录失败:', error);
    if (error.message.includes('仓库不存在')) {
      return res.status(400).json({ code: 400, message: '仓库不存在' });
    }
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

module.exports = router;
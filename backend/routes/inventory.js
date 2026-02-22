const express = require('express');
const router = express.Router();
const inventoryService = require('../services/InventoryService');

// 获取库存列表
router.get('/', async (req, res) => {
  try {
    const result = await inventoryService.getInventoryList();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取库存预警
router.get('/alert', async (req, res) => {
  try {
    const result = await inventoryService.getInventoryAlert();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取饮用水品类列表
router.get('/category', async (req, res) => {
  try {
    const result = await inventoryService.getWaterCategoryList();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 添加饮用水品类
router.post('/category', async (req, res) => {
  try {
    const result = await inventoryService.addWaterCategory(req.body);
    res.status(200).json({ code: 200, data: result, message: '添加成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取库存详情
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await inventoryService.getInventoryDetail(id);
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 更新库存信息
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await inventoryService.updateInventory(id, data);
    res.status(200).json({ code: 200, data: null, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

module.exports = router;
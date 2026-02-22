const express = require('express');
const router = express.Router();
const consumptionService = require('../services/ConsumptionService');

// 提交领用申请
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const result = await consumptionService.addConsumption(data);
    res.status(200).json({ code: 200, data: { id: result.id }, message: '申请成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取领用记录列表
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await consumptionService.getConsumptionList(page, pageSize);
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取饮用水品类列表
router.get('/category', async (req, res) => {
  try {
    const result = await consumptionService.getWaterCategoryList();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取仓库列表
router.get('/warehouse', async (req, res) => {
  try {
    const result = await consumptionService.getWarehouseList();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取部门列表
router.get('/department', async (req, res) => {
  try {
    const result = await consumptionService.getDepartmentList();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取领用记录详情
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await consumptionService.getConsumptionDetail(id);
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const deliveryService = require('../services/DeliveryService');

// 添加送水记录
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const result = await deliveryService.addDeliveryRecord(data);
    res.status(200).json({ code: 200, data: { id: result.id }, message: '添加成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取送水记录列表
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await deliveryService.getDeliveryRecordList(page, pageSize);
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 添加饮用水品类
router.post('/category', async (req, res) => {
  try {
    const data = req.body;
    const result = await deliveryService.addWaterCategory(data);
    res.status(200).json({ code: 200, data: { id: result.id }, message: '添加成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取饮用水品类列表
router.get('/category', async (req, res) => {
  try {
    const result = await deliveryService.getWaterCategoryList();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 更新饮用水品类
router.put('/category/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await deliveryService.updateWaterCategory(id, data);
    res.status(200).json({ code: 200, data: null, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 删除饮用水品类
router.delete('/category/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await deliveryService.deleteWaterCategory(id);
    res.status(200).json({ code: 200, data: null, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取送水记录详情
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deliveryService.getDeliveryRecordDetail(id);
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 更新送水记录
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await deliveryService.updateDeliveryRecord(id, data);
    res.status(200).json({ code: 200, data: null, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 删除送水记录
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await deliveryService.deleteDeliveryRecord(id);
    res.status(200).json({ code: 200, data: null, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 审批送水记录
router.put('/:id/approve', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    await deliveryService.approveDeliveryRecord(id, status);
    res.status(200).json({ code: 200, data: null, message: '审批成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

module.exports = router;
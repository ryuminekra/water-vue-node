const express = require('express');
const router = express.Router();
const billingService = require('../services/BillingService');

// 生成账单
router.post('/generate', async (req, res) => {
  try {
    const data = req.body;
    const result = await billingService.generateBill(data);
    res.status(200).json({ code: 200, data: { bill_id: result.bill.id, details: result.details }, message: '生成成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 查询账单明细
router.post('/query', async (req, res) => {
  try {
    const data = req.body;
    const result = await billingService.calculateBillData(data);
    res.status(200).json({ code: 200, data: result, message: '查询成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取账单列表
router.get('/', async (req, res) => {
  try {
    const result = await billingService.getBillList();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取账单详情
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await billingService.getBillDetail(id);
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 支付账单
router.put('/pay/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await billingService.payBill(id, data);
    res.status(200).json({ code: 200, data: null, message: '支付成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 费用计算
router.post('/calculate', async (req, res) => {
  try {
    const data = req.body;
    const result = await billingService.calculateCost(data);
    res.status(200).json({ code: 200, data: result, message: '计算成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

module.exports = router;
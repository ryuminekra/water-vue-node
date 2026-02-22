const express = require('express');
const router = express.Router();
const statisticsService = require('../services/StatisticsService');

// 获取送水统计
router.get('/delivery', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await statisticsService.getDeliveryStatistics(startDate, endDate);
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取领用统计
router.get('/consumption', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await statisticsService.getConsumptionStatistics(startDate, endDate);
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取库存统计
router.get('/inventory', async (req, res) => {
  try {
    const result = await statisticsService.getInventoryStatistics();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取结算统计
router.get('/billing', async (req, res) => {
  try {
    const result = await statisticsService.getBillingStatistics();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 导出统计数据
router.get('/export', async (req, res) => {
  try {
    // 这里可以实现数据导出功能，例如导出为Excel或CSV文件
    res.status(200).json({ code: 200, data: null, message: '导出成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

module.exports = router;
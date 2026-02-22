const express = require('express');
const router = express.Router();
const systemService = require('../services/SystemService');
const warehouseService = require('../services/WarehouseService');
const userService = require('../services/UserService');
const departmentService = require('../services/DepartmentService');

// 获取系统日志
router.get('/log', async (req, res) => {
  try {
    const result = await systemService.getSystemLogs();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 仓库管理路由
// 获取所有仓库
router.get('/warehouse', async (req, res) => {
  try {
    const result = await warehouseService.getAllWarehouses();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取单个仓库
router.get('/warehouse/:id', async (req, res) => {
  try {
    const result = await warehouseService.getWarehouseById(req.params.id);
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 创建仓库
router.post('/warehouse', async (req, res) => {
  try {
    const result = await warehouseService.createWarehouse(req.body);
    res.status(200).json({ code: 200, data: result, message: '创建成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 更新仓库
router.put('/warehouse/:id', async (req, res) => {
  try {
    const result = await warehouseService.updateWarehouse(req.params.id, req.body);
    res.status(200).json({ code: 200, data: result, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 删除仓库
router.delete('/warehouse/:id', async (req, res) => {
  try {
    const result = await warehouseService.deleteWarehouse(req.params.id);
    res.status(200).json({ code: 200, data: result, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 部门管理路由
// 获取所有部门
router.get('/department', async (req, res) => {
  try {
    const result = await departmentService.getAllDepartments();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取单个部门
router.get('/department/:id', async (req, res) => {
  try {
    const result = await departmentService.getDepartmentById(req.params.id);
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 创建部门
router.post('/department', async (req, res) => {
  try {
    const result = await departmentService.createDepartment(req.body);
    res.status(200).json({ code: 200, data: result, message: '创建成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 更新部门
router.put('/department/:id', async (req, res) => {
  try {
    const result = await departmentService.updateDepartment(req.params.id, req.body);
    res.status(200).json({ code: 200, data: result, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 删除部门
router.delete('/department/:id', async (req, res) => {
  try {
    const result = await departmentService.deleteDepartment(req.params.id);
    res.status(200).json({ code: 200, data: result, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 用户管理路由
// 获取所有用户
router.get('/user', async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 获取单个用户
router.get('/user/:id', async (req, res) => {
  try {
    const result = await userService.getUserById(req.params.id);
    res.status(200).json({ code: 200, data: result, message: '获取成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 创建用户
router.post('/user', async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(200).json({ code: 200, data: result, message: '创建成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 更新用户
router.put('/user/:id', async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ code: 200, data: result, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// 删除用户
router.delete('/user/:id', async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.status(200).json({ code: 200, data: result, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

module.exports = router;
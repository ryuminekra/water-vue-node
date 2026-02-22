const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const initDatabase = require('./config/init-db');

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app = express();

// 配置中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 导入路由
const authRoutes = require('./routes/auth');
const deliveryRoutes = require('./routes/delivery');
const inventoryRoutes = require('./routes/inventory');
const consumptionRoutes = require('./routes/consumption');
const billingRoutes = require('./routes/billing');
const statisticsRoutes = require('./routes/statistics');
const systemRoutes = require('./routes/system');
const miniAppRoutes = require('./routes/mini-app');

// 导入认证中间件
const authMiddleware = require('./middleware/auth');

// 注册认证路由（无需认证）
app.use('/api/auth', authRoutes);

// 注册小程序路由（无需认证）
app.use('/api/mini-app', miniAppRoutes);

// 注册需要认证的路由
app.use('/api/delivery', authMiddleware, deliveryRoutes);
app.use('/api/inventory', authMiddleware, inventoryRoutes);
app.use('/api/consumption', authMiddleware, consumptionRoutes);
app.use('/api/billing', authMiddleware, billingRoutes);
app.use('/api/statistics', authMiddleware, statisticsRoutes);
app.use('/api/system', authMiddleware, systemRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ code: 500, message: '服务器内部错误' });
});

// 启动服务器
const startServer = async () => {
  try {
    // 初始化数据库
    await initDatabase();
    
    // 启动服务器
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
};

// 执行启动服务器
startServer();

module.exports = app;
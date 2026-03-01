const DeliveryRecord = require('./backend/models/DeliveryRecord');
const Consumption = require('./backend/models/Consumption');
const SystemLog = require('./backend/models/SystemLog');

async function clearRecords() {
  try {
    console.log('开始删除送水记录和领水记录...');
    
    // 删除所有送水记录
    const deliveryCount = await DeliveryRecord.destroy({ where: {} });
    console.log(`已删除 ${deliveryCount} 条送水记录`);
    
    // 删除所有领水记录
    const consumptionCount = await Consumption.destroy({ where: {} });
    console.log(`已删除 ${consumptionCount} 条领水记录`);
    
    // 记录系统日志
    await SystemLog.create({
      operation: `批量删除所有送水记录(${deliveryCount}条)和领水记录(${consumptionCount}条)`,
      module: '系统管理',
      ip: '127.0.0.1'
    });
    
    console.log('删除完成！');
  } catch (error) {
    console.error('删除记录失败:', error.message);
  } finally {
    // 关闭数据库连接
    process.exit();
  }
}

// 执行删除操作
clearRecords();
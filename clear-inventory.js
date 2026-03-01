const Inventory = require('./backend/models/Inventory');
const SystemLog = require('./backend/models/SystemLog');

async function clearInventory() {
  try {
    console.log('开始清零所有仓库库存...');
    
    // 获取所有库存记录
    const inventories = await Inventory.findAll();
    const inventoryCount = inventories.length;
    
    // 清零所有库存
    await Inventory.update(
      { 
        quantity: 0, 
        emptyBucketQuantity: 0 
      },
      { where: {} }
    );
    
    // 记录系统日志
    await SystemLog.create({
      operation: `批量清零所有仓库库存(${inventoryCount}条记录)`,
      module: '系统管理',
      ip: '127.0.0.1'
    });
    
    console.log(`已成功清零 ${inventoryCount} 条库存记录`);
    console.log('操作完成！');
  } catch (error) {
    console.error('清零库存失败:', error.message);
  } finally {
    // 关闭数据库连接
    process.exit();
  }
}

// 执行清零操作
clearInventory();
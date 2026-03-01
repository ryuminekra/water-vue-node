const WarehouseService = require('./backend/services/WarehouseService');

async function testDeleteWarehouse() {
  try {
    // 测试删除仓库（请替换为实际存在的仓库ID）
    const warehouseId = 1; // 替换为实际的仓库ID
    
    console.log(`尝试删除仓库 ID: ${warehouseId}`);
    
    const result = await WarehouseService.deleteWarehouse(warehouseId);
    console.log('删除成功:', result);
  } catch (error) {
    console.error('删除仓库失败:', error.message);
  } finally {
    // 关闭进程
    process.exit();
  }
}

// 执行测试
testDeleteWarehouse();
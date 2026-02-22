const { sequelize } = require('./backend/config/database');
const Inventory = require('./backend/models/Inventory');
const WaterCategory = require('./backend/models/WaterCategory');
const Warehouse = require('./backend/models/Warehouse');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    const inventories = await Inventory.findAll({
      include: [{
        model: WaterCategory,
        as: 'waterCategory',
        attributes: ['name']
      }, {
        model: Warehouse,
        as: 'warehouse',
        attributes: ['name']
      }],
      attributes: ['waterCategoryId', 'warehouseId', 'emptyBucketQuantity']
    });
    
    console.log('\n当前空桶库存数量:');
    console.log('----------------------------------------------------------------');
    console.log('品类名称\t\t仓库名称\t\t空桶数量');
    console.log('----------------------------------------------------------------');
    
    inventories.forEach(inv => {
      const categoryName = inv.waterCategory ? inv.waterCategory.name : '未知品类';
      const warehouseName = inv.warehouse ? inv.warehouse.name : '未知仓库';
      console.log(`${categoryName}\t\t${warehouseName}\t\t${inv.emptyBucketQuantity}`);
    });
    
    console.log('----------------------------------------------------------------');
    
    // 计算总空桶数量
    const totalEmptyBuckets = inventories.reduce((sum, inv) => sum + inv.emptyBucketQuantity, 0);
    console.log(`\n总空桶数量: ${totalEmptyBuckets}`);
    
    await sequelize.close();
  } catch (error) {
    console.error('查询失败:', error);
    process.exit(1);
  }
})();
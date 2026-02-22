const { sequelize } = require('./backend/config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 检查 inventory 表是否存在
    const queryInterface = sequelize.getQueryInterface();
    const inventoryTableExists = await queryInterface.showAllTables();
    console.log('\n数据库中的表:', inventoryTableExists);
    
    // 检查 inventory 表的结构
    if (inventoryTableExists.includes('inventory')) {
      console.log('\ninventory 表存在，检查其结构:');
      const inventoryColumns = await queryInterface.describeTable('inventory');
      console.log('inventory 表的字段:');
      Object.keys(inventoryColumns).forEach(column => {
        console.log(`${column}: ${inventoryColumns[column].type}`);
      });
    } else {
      console.log('\ninventory 表不存在');
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('查询失败:', error);
    process.exit(1);
  }
})();
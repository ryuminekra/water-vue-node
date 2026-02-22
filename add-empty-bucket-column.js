const { sequelize } = require('./backend/config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 手动添加 empty_bucket_quantity 字段
    const queryInterface = sequelize.getQueryInterface();
    const inventoryColumns = await queryInterface.describeTable('inventory');
    
    if (!inventoryColumns.empty_bucket_quantity) {
      console.log('添加 empty_bucket_quantity 字段...');
      await queryInterface.addColumn('inventory', 'empty_bucket_quantity', {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '空桶数量'
      });
      console.log('empty_bucket_quantity 字段添加成功');
    } else {
      console.log('empty_bucket_quantity 字段已经存在');
    }
    
    // 检查修改后的表结构
    console.log('\n修改后的 inventory 表结构:');
    const updatedColumns = await queryInterface.describeTable('inventory');
    Object.keys(updatedColumns).forEach(column => {
      console.log(`${column}: ${updatedColumns[column].type}`);
    });
    
    await sequelize.close();
  } catch (error) {
    console.error('操作失败:', error);
    process.exit(1);
  }
})();
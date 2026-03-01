const { sequelize } = require('./config/database');

// 检查数据库
sequelize.query('SHOW DATABASES')
  .then(result => {
    console.log('所有数据库:');
    result[0].forEach(db => {
      console.log('-', db.Database);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('检查数据库失败:', err);
    process.exit(1);
  });
const { sequelize } = require('./database');
const WaterCategory = require('../models/WaterCategory');
const DeliveryRecord = require('../models/DeliveryRecord');
const Inventory = require('../models/Inventory');
const Consumption = require('../models/Consumption');
const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const SystemLog = require('../models/SystemLog');
const Warehouse = require('../models/Warehouse');
const Department = require('../models/Department');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// 初始化数据库
const initDatabase = async () => {
  try {
    console.log('开始初始化数据库...');
    
    // 自动创建表结构
    await sequelize.sync({ force: true });
    console.log('表结构创建成功');
    
    // 初始化部门数据
    const departments = await Department.bulkCreate([
      { name: '行政部' },
      { name: '技术部' },
      { name: '市场部' },
      { name: '财务部' }
    ]);
    console.log('初始化部门数据成功');
    
    // 初始化用户数据
    const hashedPassword = await bcrypt.hash('123456', 10);
    await User.bulkCreate([
      {
        username: 'admin',
        password: hashedPassword,
        name: '管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        departmentId: departments[0].id,
        role: 'admin',
        status: 1
      },
      {
        username: 'user',
        password: hashedPassword,
        name: '普通用户',
        email: 'user@example.com',
        phone: '13900139000',
        departmentId: departments[1].id,
        role: 'user',
        status: 1
      },
      {
        username: 'deliveryman',
        password: hashedPassword,
        name: '送水员',
        email: 'deliveryman@example.com',
        phone: '13700137000',
        departmentId: departments[2].id,
        role: 'deliveryman',
        status: 1
      }
    ]);
    console.log('初始化用户数据成功');
    
    // 初始化饮用水品类数据
    const categories = await WaterCategory.bulkCreate([
      {
        name: '桶装水',
        unit: '桶',
        price: 15.00,
        capacity: 18.9
      },
      {
        name: '瓶装水',
        unit: '件',
        price: 24.00,
        capacity: 500
      },
      {
        name: '矿泉水',
        unit: '瓶',
        price: 3.00,
        capacity: 550
      }
    ]);
    console.log('初始化饮用水品类数据成功');
    
    // 初始化仓库数据
    const warehouses = await Warehouse.bulkCreate([
      {
        name: '仓库A',
        location: '北京市朝阳区',
        contactPerson: '张三',
        contactPhone: '13800138001'
      },
      {
        name: '仓库B',
        location: '北京市海淀区',
        contactPerson: '李四',
        contactPhone: '13800138002'
      },
      {
        name: '仓库C',
        location: '北京市西城区',
        contactPerson: '王五',
        contactPhone: '13800138003'
      }
    ]);
    console.log('初始化仓库数据成功');
    
    // 初始化库存数据
    await Inventory.bulkCreate([
      {
        waterCategoryId: categories[0].id,
        warehouseId: warehouses[0].id,
        quantity: 100,
        emptyBucketQuantity: 50,
        location: warehouses[0].name,
        alertThreshold: 15
      },
      {
        waterCategoryId: categories[1].id,
        warehouseId: warehouses[1].id,
        quantity: 50,
        emptyBucketQuantity: 20,
        location: warehouses[1].name,
        alertThreshold: 10
      },
      {
        waterCategoryId: categories[2].id,
        warehouseId: warehouses[2].id,
        quantity: 200,
        emptyBucketQuantity: 100,
        location: warehouses[2].name,
        alertThreshold: 20
      }
    ]);
    console.log('初始化库存数据成功');
    
    // 初始化送水记录数据
    const deliveryRecords = [];
    const deliveryDates = [
      '2026-02-01', '2026-02-03', '2026-02-05', '2026-02-07', '2026-02-09',
      '2026-02-11', '2026-02-13', '2026-02-15', '2026-02-17', '2026-02-19',
      '2026-02-21', '2026-02-23', '2026-02-25', '2026-02-27'
    ];
    
    const deliveryRemarks = ['月度送水', '补充库存', '紧急补货', '常规配送', '临时补货'];
    
    deliveryDates.forEach((date, index) => {
      // 为每个仓库添加送水记录
      warehouses.forEach((warehouse, warehouseIndex) => {
        // 为每种饮用水品类添加送水记录
        categories.forEach((category, categoryIndex) => {
          deliveryRecords.push({
            waterCategoryId: category.id,
            warehouseId: warehouse.id,
            quantity: Math.floor(Math.random() * 50) + 10, // 10-60之间的随机数量
            emptyBucketQuantity: Math.floor(Math.random() * 20) + 5, // 5-25之间的随机数量
            date: new Date(date),
            remark: deliveryRemarks[Math.floor(Math.random() * deliveryRemarks.length)],
            status: ['PENDING', 'APPROVED', 'REJECTED'][Math.floor(Math.random() * 3)] // 随机状态
          });
        });
      });
    });
    
    await DeliveryRecord.bulkCreate(deliveryRecords);
    console.log('初始化送水记录数据成功');
    
    // 初始化领用记录数据
    const consumptionRecords = [];
    const consumptionDates = [
      '2026-02-02', '2026-02-04', '2026-02-06', '2026-02-08', '2026-02-10',
      '2026-02-12', '2026-02-14', '2026-02-16', '2026-02-18', '2026-02-20',
      '2026-02-22', '2026-02-24', '2026-02-26', '2026-02-28'
    ];
    
    const consumptionRemarks = ['行政部领用', '技术部领用', '市场部领用', '财务部领用', '临时领用'];
    const receivers = ['张三', '李四', '王五', '赵六', '钱七'];
    
    consumptionDates.forEach((date, index) => {
      // 为每个部门添加领用记录
      departments.forEach((department, departmentIndex) => {
        // 为每种饮用水品类添加领用记录
        categories.forEach((category, categoryIndex) => {
          consumptionRecords.push({
            waterCategoryId: category.id,
            warehouseId: warehouses[departmentIndex % warehouses.length].id,
            departmentId: department.id,
            receiver: receivers[Math.floor(Math.random() * receivers.length)],
            quantity: Math.floor(Math.random() * 20) + 1, // 1-20之间的随机数量
            returnEmptyBottles: Math.floor(Math.random() * 10), // 0-9之间的随机数量
            consumptionDate: new Date(date),
            notes: consumptionRemarks[Math.floor(Math.random() * consumptionRemarks.length)],
            status: 'APPROVED' // 固定为已批准状态
          });
        });
      });
    });
    
    await Consumption.bulkCreate(consumptionRecords);
    console.log('初始化领用记录数据成功');
    
    // 初始化账单数据
    await Bill.bulkCreate([
      {
        billNo: 'BILL20260201',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-02-07'),
        totalAmount: 150.00,
        status: 'PAID',
        paymentMethod: '微信支付',
        paidAt: new Date('2026-02-08')
      },
      {
        billNo: 'BILL20260208',
        startDate: new Date('2026-02-08'),
        endDate: new Date('2026-02-14'),
        totalAmount: 240.00,
        status: 'UNPAID'
      },
      {
        billNo: 'BILL20260215',
        startDate: new Date('2026-02-15'),
        endDate: new Date('2026-02-21'),
        totalAmount: 90.00,
        status: 'CANCELLED'
      }
    ]);
    console.log('初始化账单数据成功');
    
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
};

module.exports = initDatabase;
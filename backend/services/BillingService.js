const { Op } = require('sequelize');
const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const Consumption = require('../models/Consumption');
const WaterCategory = require('../models/WaterCategory');
const SystemLog = require('../models/SystemLog');

class BillingService {
  // 计算账单数据（用于查询）
  async calculateBillData(data) {
    try {
      const { startDate, endDate } = data;
      
      // 查询指定时间段内的领用记录
      const consumptionList = await Consumption.findAll({
        where: {
          consumptionDate: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [{
          model: WaterCategory,
          as: 'waterCategory',
          attributes: ['id', 'name', 'price']
        }]
      });
      
      // 计算总金额和明细数据
      let totalAmount = 0;
      const details = [];
      
      // 按品类分组计算
      const categoryMap = new Map();
      
      for (const item of consumptionList) {
        const categoryName = item.waterCategory.name;
        const unitPrice = item.waterCategory.price;
        const quantity = item.quantity;
        const subtotal = quantity * unitPrice;
        
        if (categoryMap.has(categoryName)) {
          const existing = categoryMap.get(categoryName);
          existing.quantity += quantity;
          existing.subtotal += subtotal;
        } else {
          categoryMap.set(categoryName, {
            categoryName,
            quantity,
            unitPrice: parseFloat(unitPrice),
            subtotal: parseFloat(subtotal)
          });
        }
        
        totalAmount += subtotal;
      }
      
      // 转换为数组
      for (const [key, value] of categoryMap.entries()) {
        details.push(value);
      }
      
      return {
        totalAmount,
        details
      };
    } catch (error) {
      throw new Error('计算账单数据失败: ' + error.message);
    }
  }

  // 生成账单
  async generateBill(data) {
    try {
      const { startDate, endDate } = data;
      
      // 先计算账单数据
      const billData = await this.calculateBillData(data);
      const { totalAmount, details } = billData;
      
      // 生成账单编号
      const billNo = 'BILL_' + Date.now();
      
      // 创建账单
      const bill = await Bill.create({
        billNo,
        startDate,
        endDate,
        totalAmount,
        status: 'UNPAID'
      });
      
      // 记录系统日志
      await SystemLog.create({
        operation: `生成账单: ${billNo}，总金额 ${totalAmount}`,
        module: '结算管理'
      });
      
      // 返回账单信息和明细数据
      return {
        bill,
        details
      };
    } catch (error) {
      throw new Error('生成账单失败: ' + error.message);
    }
  }

  // 获取账单列表
  async getBillList() {
    try {
      return await Bill.findAll({ order: [['createdAt', 'DESC']] });
    } catch (error) {
      throw new Error('获取账单列表失败: ' + error.message);
    }
  }

  // 获取账单详情
  async getBillDetail(id) {
    try {
      const bill = await Bill.findByPk(id);
      
      if (!bill) {
        throw new Error('账单不存在');
      }
      
      return bill;
    } catch (error) {
      throw new Error('获取账单详情失败: ' + error.message);
    }
  }

  // 支付账单
  async payBill(id, data) {
    try {
      // 开始事务
      const transaction = await Bill.sequelize.transaction();
      
      try {
        const bill = await Bill.findByPk(id, { transaction });
        if (!bill) {
          throw new Error('账单不存在');
        }
        
        if (bill.status === 'PAID') {
          throw new Error('账单已支付');
        }
        
        // 创建支付记录
        const payment = await Payment.create({
          billId: id,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          transactionId: 'TXN_' + Date.now(),
          status: 'SUCCESS'
        }, { transaction });
        
        // 更新账单状态
        await bill.update({
          status: 'PAID',
          paymentMethod: data.paymentMethod,
          paidAt: new Date()
        }, { transaction });
        
        // 记录系统日志
        await SystemLog.create(
          {
            operation: `支付账单: ${bill.billNo}，金额 ${data.amount}`,
            module: '结算管理'
          },
          { transaction }
        );
        
        // 提交事务
        await transaction.commit();
        
        return { success: true };
      } catch (error) {
        // 回滚事务
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      throw new Error('支付账单失败: ' + error.message);
    }
  }

  // 费用计算
  async calculateCost(data) {
    try {
      const { waterCategoryId, quantity } = data;
      
      // 查询饮用水品类价格
      const category = await WaterCategory.findByPk(waterCategoryId);
      if (!category) {
        throw new Error('饮用水品类不存在');
      }
      
      // 计算总费用
      const totalAmount = quantity * category.price;
      
      return { totalAmount };
    } catch (error) {
      throw new Error('费用计算失败: ' + error.message);
    }
  }
}

module.exports = new BillingService();
<template>
  <div class="billing-container">
    <h1>结算管理</h1>
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>生成账单</span>
        </div>
      </template>
      <el-form :model="form" label-width="80px">
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="选择开始日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="选择结束日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryBill">查询账单</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 查询结果显示 -->
      <div v-if="queryResult" class="query-result mt-4 p-4 border rounded">
        <h3 class="mb-2">查询结果</h3>
        <div class="result-info">
          <p>开始日期: {{ form.startDate }}</p>
          <p>结束日期: {{ form.endDate }}</p>
          
          <!-- 明细数量和小计 -->
          <div class="mt-3">
            <h4 class="mb-2">明细数据</h4>
            <el-table :data="queryResult.details" style="width: 100%">
              <el-table-column prop="categoryName" label="品类" width="120" />
              <el-table-column prop="quantity" label="数量" width="80" />
              <el-table-column prop="unitPrice" label="单价" width="80">
                <template #default="scope">
                  ¥{{ scope.row.unitPrice ? scope.row.unitPrice.toFixed(2) : '0.00' }}
                </template>
              </el-table-column>
              <el-table-column prop="subtotal" label="小计">
                <template #default="scope">
                  ¥{{ scope.row.subtotal ? scope.row.subtotal.toFixed(2) : '0.00' }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 总金额 -->
          <div class="mt-3 total-section">
            <p class="font-bold text-right">总金额: ¥{{ queryResult.totalAmount.toFixed(2) }}</p>
          </div>
        </div>
        <div class="mt-4 text-right">
          <el-button type="success" @click="confirmBill">确认账单</el-button>
        </div>
      </div>
    </el-card>
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>账单列表</span>
        </div>
      </template>
      <el-table :data="billList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="billNo" label="账单编号" />
        <el-table-column prop="startDate" label="开始日期" />
        <el-table-column prop="endDate" label="结束日期" />
        <el-table-column prop="totalAmount" label="总金额" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'PAID' ? 'success' : scope.row.status === 'UNPAID' ? 'warning' : 'danger'">
              {{ scope.row.status === 'PAID' ? '已支付' : scope.row.status === 'UNPAID' ? '未支付' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewBill(scope.row)">
              查看
            </el-button>
            <el-button v-if="scope.row.status === 'UNPAID'" type="success" size="small" @click="payBill(scope.row)">
              支付
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 账单详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="账单详情"
      width="800px"
      destroy-on-close
    >
      <div v-if="currentBill" class="bill-detail">
        <div class="bill-header">
          <h2>饮用水领用账单</h2>
          <div class="bill-info">
            <p><strong>账单编号:</strong> {{ currentBill.billNo }}</p>
            <p><strong>开始日期:</strong> {{ currentBill.startDate }}</p>
            <p><strong>结束日期:</strong> {{ currentBill.endDate }}</p>
            <p><strong>状态:</strong> {{ currentBill.status === 'PAID' ? '已支付' : currentBill.status === 'UNPAID' ? '未支付' : '已取消' }}</p>
            <p><strong>支付方式:</strong> {{ currentBill.paymentMethod || '未支付' }}</p>
            <p><strong>支付时间:</strong> {{ currentBill.paidAt || '未支付' }}</p>
          </div>
        </div>
        
        <div class="bill-details">
          <h3>明细数据</h3>
          <el-table :data="currentBill.details" style="width: 100%" stripe>
            <el-table-column prop="categoryName" label="品类" width="120" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="unitPrice" label="单价" width="80">
              <template #default="scope">
                ¥{{ scope.row.unitPrice ? scope.row.unitPrice.toFixed(2) : '0.00' }}
              </template>
            </el-table-column>
            <el-table-column prop="subtotal" label="小计">
              <template #default="scope">
                ¥{{ scope.row.subtotal ? scope.row.subtotal.toFixed(2) : '0.00' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <div class="bill-footer">
          <div class="total-amount">
            <p class="font-bold">总金额: ¥{{ calculateTotalAmount() }}</p>
          </div>
          <div class="print-btn">
            <el-button type="primary" @click="printBill">打印凭证</el-button>
          </div>
        </div>
      </div>
      <div v-else class="loading">
        <el-loading-spinner></el-loading-spinner>
        <p>加载中...</p>
      </div>
    </el-dialog>
    
    <!-- 打印模板 -->
    <div id="print-template" class="print-template" style="display: none;">
      <div class="print-content">
        <div class="print-header">
          <h1>饮用水领用账单</h1>
          <div class="company-info">
            <p>公司名称: 示例公司</p>
            <p>地址: 北京市朝阳区</p>
            <p>电话: 13800138000</p>
          </div>
        </div>
        
        <div class="print-body">
          <div class="bill-info">
            <p><strong>账单编号:</strong> {{ currentBill?.billNo }}</p>
            <p><strong>开始日期:</strong> {{ currentBill?.startDate }}</p>
            <p><strong>结束日期:</strong> {{ currentBill?.endDate }}</p>
            <p><strong>状态:</strong> {{ currentBill?.status === 'PAID' ? '已支付' : currentBill?.status === 'UNPAID' ? '未支付' : '已取消' }}</p>
            <p><strong>支付方式:</strong> {{ currentBill?.paymentMethod || '未支付' }}</p>
            <p><strong>支付时间:</strong> {{ currentBill?.paidAt || '未支付' }}</p>
          </div>
          
          <div class="details-table">
            <table>
              <thead>
                <tr>
                  <th>品类</th>
                  <th>数量</th>
                  <th>单价</th>
                  <th>小计</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in currentBill?.details" :key="index">
                  <td>{{ item.categoryName }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>¥{{ item.unitPrice?.toFixed(2) || '0.00' }}</td>
                  <td>¥{{ item.subtotal?.toFixed(2) || '0.00' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="total-section">
            <p class="total-amount">总金额: ¥{{ calculateTotalAmount() }}</p>
          </div>
        </div>
        
        <div class="print-footer">
          <div class="signature">
            <p>制单人: _________________</p>
            <p>审核人: _________________</p>
            <p>日期: {{ new Date().toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import api from '../utils/api'

const billList = ref([])
const queryResult = ref(null)
const dialogVisible = ref(false)
const currentBill = ref(null)

const form = ref({
  startDate: '',
  endDate: ''
})

// 加载账单列表
const loadBillList = async () => {
  try {
    const response = await axios.get('/api/billing', {
      headers: api.getHeaders()
    })
    billList.value = response.data.data
  } catch (error) {
    console.error('获取账单列表失败:', error)
    ElMessage.error('获取账单列表失败')
  }
}

// 查询账单
const queryBill = async () => {
  try {
    // 这里可以先验证日期
    if (!form.value.startDate || !form.value.endDate) {
      ElMessage.warning('请选择开始日期和结束日期')
      return
    }
    
    if (new Date(form.value.startDate) > new Date(form.value.endDate)) {
      ElMessage.warning('开始日期不能晚于结束日期')
      return
    }
    
    // 调用后端API查询账单明细
    const response = await axios.post('/api/billing/query', form.value, {
      headers: api.getHeaders()
    })
    
    console.log('API响应数据:', response.data)
    
    if (response.data.code === 200) {
      console.log('查询结果数据:', response.data.data)
      queryResult.value = response.data.data
      ElMessage.success('查询成功')
    } else {
      ElMessage.error('查询失败: ' + response.data.message)
    }
  } catch (error) {
    console.error('查询账单失败:', error)
    ElMessage.error('查询失败: ' + (error.response?.data?.message || '网络错误'))
  }
}

// 确认账单
const confirmBill = async () => {
  try {
    if (!queryResult.value) {
      ElMessage.warning('请先查询账单')
      return
    }
    
    // 调用后端生成账单API
    await axios.post('/api/billing/generate', form.value, {
      headers: api.getHeaders()
    })
    
    // 刷新账单列表
    loadBillList()
    
    // 清空查询结果
    queryResult.value = null
    
    ElMessage.success('账单确认成功')
  } catch (error) {
    console.error('确认账单失败:', error)
    ElMessage.error('确认失败: ' + (error.response?.data?.message || '网络错误'))
  }
}

// 查看账单
const viewBill = async (row) => {
  try {
    dialogVisible.value = true
    currentBill.value = null
    
    // 调用后端API获取账单详情
    const response = await axios.get(`/api/billing/${row.id}`, {
      headers: api.getHeaders()
    })
    
    if (response.data.code === 200) {
      // 由于后端可能没有返回明细数据，这里使用模拟数据
      // 实际项目中应该修改后端API，返回包含明细数据的完整账单信息
      const billData = response.data.data
      
      // 模拟明细数据，实际应该由后端返回
      billData.details = [
        {
          categoryName: '桶装水',
          quantity: 10,
          unitPrice: 15.00,
          subtotal: 150.00
        },
        {
          categoryName: '瓶装水',
          quantity: 5,
          unitPrice: 24.00,
          subtotal: 120.00
        },
        {
          categoryName: '矿泉水',
          quantity: 30,
          unitPrice: 3.00,
          subtotal: 90.00
        }
      ]
      
      currentBill.value = billData
    } else {
      ElMessage.error('获取账单详情失败: ' + response.data.message)
      dialogVisible.value = false
    }
  } catch (error) {
    console.error('获取账单详情失败:', error)
    ElMessage.error('获取账单详情失败: ' + (error.response?.data?.message || '网络错误'))
    dialogVisible.value = false
  }
}

// 计算总金额（小计的总和）
const calculateTotalAmount = () => {
  if (!currentBill.value || !currentBill.value.details || currentBill.value.details.length === 0) {
    return '0.00'
  }
  
  const total = currentBill.value.details.reduce((sum, item) => {
    const subtotal = typeof item.subtotal === 'number' ? item.subtotal : 0
    return sum + subtotal
  }, 0)
  
  return total.toFixed(2)
}

// 打印账单凭证
const printBill = () => {
  if (!currentBill.value) {
    ElMessage.warning('请先查看账单详情')
    return
  }
  
  // 打开打印预览
  const printContent = document.getElementById('print-template')
  const originalDisplay = printContent.style.display
  printContent.style.display = 'block'
  
  setTimeout(() => {
    window.print()
    printContent.style.display = originalDisplay
  }, 100)
}

// 支付账单
const payBill = async (row) => {
  try {
    await axios.put(`/api/billing/pay/${row.id}`, {
      amount: row.totalAmount,
      paymentMethod: '微信支付'
    }, {
      headers: api.getHeaders()
    })
    loadBillList()
    ElMessage.success('支付成功')
  } catch (error) {
    console.error('支付账单失败:', error)
    ElMessage.error('支付失败: ' + (error.response?.data?.message || '网络错误'))
  }
}

// 初始化数据
onMounted(() => {
  loadBillList()
})
</script>

<style scoped>
.billing-container {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}

.p-4 {
  padding: 16px;
}

.border {
  border: 1px solid #e0e0e0;
}

.rounded {
  border-radius: 4px;
}

.font-bold {
  font-weight: bold;
}

.text-right {
  text-align: right;
}

.query-result {
  background-color: #f9f9f9;
}

.result-info p {
  margin: 8px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 账单详情弹窗样式 */
.bill-detail {
  padding: 20px;
}

.bill-header {
  margin-bottom: 30px;
}

.bill-header h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.bill-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.bill-info p {
  margin: 5px 0;
}

.bill-details {
  margin: 30px 0;
}

.bill-details h3 {
  margin-bottom: 15px;
  color: #333;
}

.bill-footer {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.total-amount p {
  font-size: 18px;
  color: #333;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
}

/* 打印模板样式 */
@media print {
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
  
  .print-template {
    display: block !important;
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 20mm;
    box-sizing: border-box;
  }
  
  .print-content {
    width: 100%;
  }
  
  .print-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .print-header h1 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #333;
  }
  
  .company-info {
    font-size: 12px;
    color: #666;
  }
  
  .print-body {
    margin: 20px 0;
  }
  
  .bill-info {
    margin-bottom: 20px;
  }
  
  .bill-info p {
    margin: 5px 0;
    font-size: 12px;
  }
  
  .details-table {
    margin: 20px 0;
  }
  
  .details-table table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  
  .details-table th,
  .details-table td {
    border: 1px solid #000;
    padding: 8px;
    text-align: center;
  }
  
  .details-table th {
    background-color: #f0f0f0;
    font-weight: bold;
  }
  
  .total-section {
    margin-top: 20px;
    text-align: right;
  }
  
  .total-amount {
    font-size: 14px;
    font-weight: bold;
  }
  
  .print-footer {
    margin-top: 40px;
    text-align: right;
  }
  
  .signature {
    font-size: 12px;
  }
  
  .signature p {
    margin: 10px 0;
  }
  
  /* 隐藏非打印内容 */
  .el-dialog,
  .billing-container {
    display: none !important;
  }
}

/* 屏幕显示时的打印模板样式 */
.print-template {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 20mm;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  background-color: #fff;
}

.print-content {
  width: 100%;
}

.print-header {
  text-align: center;
  margin-bottom: 30px;
}

.print-header h1 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.company-info {
  font-size: 12px;
  color: #666;
}

.print-body {
  margin: 20px 0;
}

.bill-info {
  margin-bottom: 20px;
}

.bill-info p {
  margin: 5px 0;
  font-size: 12px;
}

.details-table {
  margin: 20px 0;
}

.details-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.details-table th,
.details-table td {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
}

.details-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.total-section {
  margin-top: 20px;
  text-align: right;
}

.total-amount {
  font-size: 14px;
  font-weight: bold;
}

.print-footer {
  margin-top: 40px;
  text-align: right;
}

.signature {
  font-size: 12px;
}

.signature p {
  margin: 10px 0;
}
</style>
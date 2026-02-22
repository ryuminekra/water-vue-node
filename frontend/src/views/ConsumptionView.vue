<template>
  <div class="consumption-container">
    <h1>领用管理</h1>
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>领用申请</span>
          <el-button type="primary" @click="dialogVisible = true">
            <el-icon><Plus /></el-icon>
            提交领用申请
          </el-button>
        </div>
      </template>
      <el-table :data="consumptionList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="waterCategory.name" label="饮用水品类" />
        <el-table-column label="领用仓库" width="120">
          <template #default="scope">
            {{ getWarehouseName(scope.row.warehouseId) }}
          </template>
        </el-table-column>
        <el-table-column label="领用部门" width="120">
          <template #default="scope">
            {{ getDepartmentName(scope.row.departmentId) }}
          </template>
        </el-table-column>
        <el-table-column prop="receiver" label="领用人" width="120" />
        <el-table-column prop="quantity" label="领用数量" width="100" />
        <el-table-column prop="returnEmptyBottles" label="归还空桶数量" width="120" />
        <el-table-column label="领用时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.consumptionDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="备注" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            {{ getStatusText(scope.row.status) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 领用申请对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="提交领用申请"
      width="500px"
    >
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="饮用水品类" prop="waterCategoryId">
          <el-select v-model="form.waterCategoryId" placeholder="请选择品类">
            <el-option
              v-for="category in waterCategories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="领用仓库" prop="warehouseId">
          <el-select v-model="form.warehouseId" placeholder="请选择仓库">
            <el-option
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              :label="warehouse.name"
              :value="warehouse.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="领用部门" prop="departmentId">
          <el-select v-model="form.departmentId" placeholder="请选择部门">
            <el-option
              v-for="department in departments"
              :key="department.id"
              :label="department.name"
              :value="department.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="领用人" prop="receiver">
          <el-input v-model="form.receiver" placeholder="请输入领用人姓名" />
        </el-form-item>
        <el-form-item label="领用数量" prop="quantity">
          <el-input v-model.number="form.quantity" placeholder="请输入领用数量" type="number" min="1" />
        </el-form-item>
        <el-form-item label="归还空桶数量">
          <el-input v-model.number="form.returnEmptyBottles" placeholder="请输入归还空桶数量" type="number" min="0" />
        </el-form-item>
        <el-form-item label="领用时间">
          <el-date-picker
            v-model="form.consumptionDate"
            type="datetime"
            placeholder="选择时间"
            style="width: 100%"
            disabled
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.notes"
            type="textarea"
            placeholder="请输入备注"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">提交申请</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import api from '../utils/api'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const waterCategories = ref([])
const warehouses = ref([])
const departments = ref([])
const consumptionList = ref([])
const formRef = ref(null)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = ref({
  waterCategoryId: '',
  warehouseId: '',
  departmentId: '',
  receiver: '',
  quantity: '',
  returnEmptyBottles: 0,
  consumptionDate: new Date(),
  notes: ''
})

const rules = {
  waterCategoryId: [{ required: true, message: '请选择饮用水品类', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择领用部门', trigger: 'change' }],
  receiver: [{ required: true, message: '请输入领用人', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入领用数量', trigger: 'blur' }, { type: 'number', min: 1, message: '领用数量必须大于0', trigger: 'blur' }]
}

// 加载饮用水品类
const loadWaterCategories = async () => {
  try {
    const data = await api.get('/consumption/category')
    waterCategories.value = data
  } catch (error) {
    console.error('获取饮用水品类失败:', error)
    ElMessage.error('获取饮用水品类失败')
  }
}

// 加载仓库列表
const loadWarehouses = async () => {
  try {
    const data = await api.get('/consumption/warehouse')
    warehouses.value = data
  } catch (error) {
    console.error('获取仓库列表失败:', error)
    ElMessage.error('获取仓库列表失败')
  }
}

// 加载部门列表
const loadDepartments = async () => {
  try {
    const data = await api.get('/consumption/department')
    departments.value = data
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  }
}

// 加载领用记录
const loadConsumptionList = async () => {
  try {
    const data = await api.get('/consumption', { page: currentPage.value, pageSize: pageSize.value })
    if (data) {
      consumptionList.value = data.data
      total.value = data.total
      currentPage.value = data.page
      pageSize.value = data.pageSize
    }
  } catch (error) {
    console.error('获取领用记录失败:', error)
    ElMessage.error('获取领用记录失败')
  }
}

// 提交领用申请
const submitForm = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    await api.post('/consumption', form.value)
    dialogVisible.value = false
    resetForm()
    loadConsumptionList()
    ElMessage.success('提交成功')
  } catch (error) {
    console.error('提交领用申请失败:', error)
    ElMessage.error('提交失败: ' + error.message)
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.value = {
    waterCategoryId: '',
    warehouseId: '',
    departmentId: '',
    receiver: '',
    quantity: '',
    returnEmptyBottles: 0,
    consumptionDate: new Date(),
    notes: ''
  }
}

// 根据仓库ID获取仓库名称
const getWarehouseName = (id) => {
  if (!id) return ''
  const warehouse = warehouses.value.find(w => w.id === id)
  return warehouse ? warehouse.name : id
}

// 根据部门ID获取部门名称
const getDepartmentName = (id) => {
  if (!id) return ''
  const department = departments.value.find(d => d.id === id)
  return department ? department.name : id
}

// 将英文状态转换为中文状态
const getStatusText = (status) => {
  const statusMap = {
    RECEIVED: '已领取',
    PENDING: '已领取',
    APPROVED: '已领取',
    REJECTED: '已领取'
  }
  return statusMap[status] || '已领取'
}

// 格式化日期时间为东八区，显示到分
const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  // 转换为东八区时间
  const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000)
  const year = utc8Date.getUTCFullYear()
  const month = String(utc8Date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(utc8Date.getUTCDate()).padStart(2, '0')
  const hours = String(utc8Date.getUTCHours()).padStart(2, '0')
  const minutes = String(utc8Date.getUTCMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 分页事件处理
const handleSizeChange = (size) => {
  pageSize.value = size
  loadConsumptionList()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  loadConsumptionList()
}

// 初始化数据
onMounted(() => {
  loadWaterCategories()
  loadWarehouses()
  loadDepartments()
  loadConsumptionList()
})
</script>

<style scoped>
.consumption-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.mb-4 {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
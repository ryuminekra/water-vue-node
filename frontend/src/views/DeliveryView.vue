<template>
  <div class="delivery-container">
    <h1>送水管理</h1>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="送水记录" name="records">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>送水记录管理</span>
              <el-button type="primary" @click="dialogVisible = true">
                <el-icon><Plus /></el-icon>
                新增送水记录
              </el-button>
            </div>
          </template>
          <el-table :data="deliveryRecords" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="waterCategory.name" label="饮用水品类" />
            <el-table-column prop="warehouse.name" label="仓库" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="emptyBucketQuantity" label="取走空桶数量" />
            <el-table-column prop="waterCategory.unit" label="单位" />
            <el-table-column prop="date" label="送水日期" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button type="primary" size="small" @click="editRecord(scope.row)">
                  编辑
                </el-button>
                <el-button v-if="scope.row.status === 'PENDING'" type="success" size="small" @click="approveRecord(scope.row)">
                  审批
                </el-button>
                <el-button type="danger" size="small" @click="deleteRecord(scope.row.id)">
                  删除
                </el-button>
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
      </el-tab-pane>
      <el-tab-pane label="饮用水品类" name="categories">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>饮用水品类管理</span>
              <el-button type="primary" @click="categoryDialogVisible = true">
                <el-icon><Plus /></el-icon>
                新增品类
              </el-button>
            </div>
          </template>
          <el-table :data="waterCategories" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="品类名称" />
            <el-table-column prop="unit" label="单位" />
            <el-table-column prop="price" label="单价" />
            <el-table-column prop="capacity" label="容量(升)" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button type="primary" size="small" @click="editCategory(scope.row)">
                  编辑
                </el-button>
                <el-button type="danger" size="small" @click="deleteCategory(scope.row.id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增/编辑送水记录对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="送水记录"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="饮用水品类">
          <el-select v-model="form.waterCategoryId" placeholder="请选择品类">
            <el-option
              v-for="category in waterCategories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库">
          <el-select v-model="form.warehouseId" placeholder="请选择仓库">
            <el-option
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              :label="warehouse.name"
              :value="warehouse.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model.number="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="领取空桶数量">
          <el-input v-model.number="form.emptyBucketQuantity" placeholder="请输入领取空桶数量" />
        </el-form-item>
        <el-form-item label="送水日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRecord">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增/编辑饮用水品类对话框 -->
    <el-dialog
      v-model="categoryDialogVisible"
      title="饮用水品类"
      width="500px"
    >
      <el-form :model="categoryForm" label-width="80px">
        <el-form-item label="品类名称">
          <el-input v-model="categoryForm.name" placeholder="请输入品类名称" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="categoryForm.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model.number="categoryForm.price" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="容量(升)">
          <el-input v-model.number="categoryForm.capacity" placeholder="请输入容量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="categoryDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveCategory">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 审批送水记录对话框 -->
    <el-dialog
      v-model="approveDialogVisible"
      title="审批送水记录"
      width="500px"
    >
      <el-form :model="approveForm" label-width="80px">
        <el-form-item label="送水记录ID">
          <el-input v-model="approveForm.id" disabled />
        </el-form-item>
        <el-form-item label="饮用水品类">
          <el-input v-model="approveForm.waterCategoryName" disabled />
        </el-form-item>
        <el-form-item label="仓库">
          <el-input v-model="approveForm.warehouseName" disabled />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="approveForm.quantity" disabled />
        </el-form-item>
        <el-form-item label="取走空桶数量">
          <el-input v-model="approveForm.emptyBucketQuantity" disabled />
        </el-form-item>
        <el-form-item label="送水日期">
          <el-input v-model="approveForm.date" disabled />
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="approveForm.status" placeholder="请选择审批状态">
            <el-option label="通过" value="APPROVED" />
            <el-option label="拒绝" value="REJECTED" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="approveDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitApproval">提交审批</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import Api from '../utils/api'

const activeTab = ref('records')
const dialogVisible = ref(false)
const categoryDialogVisible = ref(false)
const approveDialogVisible = ref(false)
const deliveryRecords = ref([])
const waterCategories = ref([])
const warehouses = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = ref({
  waterCategoryId: '',
  warehouseId: '',
  quantity: '',
  emptyBucketQuantity: 0,
  date: '',
  remark: ''
})

const categoryForm = ref({
  name: '',
  unit: '',
  price: '',
  capacity: ''
})

const approveForm = ref({
  id: '',
  waterCategoryName: '',
  warehouseName: '',
  quantity: '',
  emptyBucketQuantity: '',
  date: '',
  status: 'APPROVED'
})

// 加载送水记录
const loadDeliveryRecords = async () => {
  try {
    const data = await Api.get('/delivery', { page: currentPage.value, pageSize: pageSize.value })
    if (data) {
      deliveryRecords.value = data.data
      total.value = data.total
      currentPage.value = data.page
      pageSize.value = data.pageSize
    }
  } catch (error) {
    console.error('获取送水记录失败:', error)
  }
}

// 加载饮用水品类
const loadWaterCategories = async () => {
  try {
    const data = await Api.get('/delivery/category')
    waterCategories.value = data
  } catch (error) {
    console.error('获取饮用水品类失败:', error)
  }
}

// 加载仓库列表
const loadWarehouses = async () => {
  try {
    const data = await Api.get('/system/warehouse')
    warehouses.value = data
  } catch (error) {
    console.error('获取仓库列表失败:', error)
  }
}

// 保存送水记录
const saveRecord = async () => {
  try {
    if (form.value.id) {
      // 更新
      await Api.put(`/delivery/${form.value.id}`, form.value)
    } else {
      // 新增
      await Api.post('/delivery', form.value)
    }
    dialogVisible.value = false
    loadDeliveryRecords()
  } catch (error) {
    console.error('保存送水记录失败:', error)
  }
}

// 编辑送水记录
const editRecord = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

// 删除送水记录
const deleteRecord = async (id) => {
  try {
    await Api.delete(`/delivery/${id}`)
    loadDeliveryRecords()
  } catch (error) {
    console.error('删除送水记录失败:', error)
  }
}

// 保存饮用水品类
const saveCategory = async () => {
  try {
    if (categoryForm.value.id) {
      // 更新
      await Api.put(`/delivery/category/${categoryForm.value.id}`, categoryForm.value)
    } else {
      // 新增
      await Api.post('/delivery/category', categoryForm.value)
    }
    categoryDialogVisible.value = false
    loadWaterCategories()
  } catch (error) {
    console.error('保存饮用水品类失败:', error)
  }
}

// 编辑饮用水品类
const editCategory = (row) => {
  categoryForm.value = { ...row }
  categoryDialogVisible.value = true
}

// 删除饮用水品类
const deleteCategory = async (id) => {
  try {
    await Api.delete(`/delivery/category/${id}`)
    loadWaterCategories()
  } catch (error) {
    console.error('删除饮用水品类失败:', error)
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'PENDING':
      return '待审批'
    case 'APPROVED':
      return '已通过'
    case 'REJECTED':
      return '已拒绝'
    default:
      return status
  }
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'APPROVED':
      return 'success'
    case 'REJECTED':
      return 'danger'
    default:
      return ''
  }
}

// 打开审批对话框
const approveRecord = (row) => {
  approveForm.value = {
    id: row.id,
    waterCategoryName: row.waterCategory?.name || '',
    warehouseName: row.warehouse?.name || '',
    quantity: row.quantity,
    emptyBucketQuantity: row.emptyBucketQuantity,
    date: row.date,
    status: 'APPROVED'
  }
  approveDialogVisible.value = true
}

// 提交审批
const submitApproval = async () => {
  try {
    await Api.put(`/delivery/${approveForm.value.id}/approve`, {
      status: approveForm.value.status
    })
    approveDialogVisible.value = false
    loadDeliveryRecords()
  } catch (error) {
    console.error('提交审批失败:', error)
  }
}

// 分页事件处理
const handleSizeChange = (size) => {
  pageSize.value = size
  loadDeliveryRecords()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  loadDeliveryRecords()
}

// 初始化数据
onMounted(() => {
  loadWaterCategories()
  loadWarehouses()
  loadDeliveryRecords()
})
</script>

<style scoped>
.delivery-container {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
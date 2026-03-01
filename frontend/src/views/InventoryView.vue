<template>
  <div class="inventory-container">
    <h1>库存管理</h1>
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>库存列表</span>
        </div>
      </template>
      <el-table :data="inventoryList" style="width: 100%">
        <el-table-column prop="warehouse.name" label="仓库名称" />
        <el-table-column prop="waterCategory.name" label="送水入库品类" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="remainingEmptyBuckets" label="剩余空桶数量" />
        <el-table-column prop="alertThreshold" label="预警阈值" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.quantity <= scope.row.alertThreshold ? 'danger' : 'success'">
              {{ scope.row.quantity <= scope.row.alertThreshold ? '预警' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editInventory(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>库存预警</span>
        </div>
      </template>
      <el-table :data="alertList" style="width: 100%">
        <el-table-column prop="warehouse.name" label="仓库名称" />
        <el-table-column prop="waterCategory.name" label="送水入库品类" />
        <el-table-column prop="quantity" label="数量" />
      </el-table>
    </el-card>

    <!-- 编辑预警阈值对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑预警阈值"
      width="500px"
    >
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="送水入库品类">
          <el-input v-model="editForm.waterCategoryName" disabled />
        </el-form-item>
        <el-form-item label="当前库存">
          <el-input v-model="editForm.quantity" disabled />
        </el-form-item>
        <el-form-item label="预警阈值">
          <el-input-number v-model="editForm.alertThreshold" :min="1" :max="1000" :step="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../utils/api'
import { ElMessage } from 'element-plus'
const inventoryList = ref([])
const alertList = ref([])
const dialogVisible = ref(false)
const editForm = ref({
  id: '',
  waterCategoryName: '',
  quantity: '',
  alertThreshold: ''
})

// 加载库存列表
const loadInventoryList = async () => {
  try {
    const data = await api.get('/inventory')
    inventoryList.value = data
  } catch (error) {
    console.error('获取库存列表失败:', error)
  }
}

// 加载库存预警
const loadAlertList = async () => {
  try {
    const data = await api.get('/inventory/alert')
    alertList.value = data
  } catch (error) {
    console.error('获取库存预警失败:', error)
  }
}

// 编辑库存
const editInventory = (row) => {
  editForm.value = {
    id: row.id,
    waterCategoryName: row.waterCategory.name,
    quantity: row.quantity,
    alertThreshold: row.alertThreshold
  }
  dialogVisible.value = true
}

// 提交编辑
const submitEdit = async () => {
  try {
    await api.put(`/inventory/${editForm.value.id}`, {
      alertThreshold: editForm.value.alertThreshold
    })
    dialogVisible.value = false
    // 重新加载数据
    loadInventoryList()
    loadAlertList()
    // 提示成功
    ElMessage.success('预警阈值更新成功')
  } catch (error) {
    console.error('更新预警阈值失败:', error)
    ElMessage.error('更新预警阈值失败')
  }
}

// 初始化数据
onMounted(() => {
  loadInventoryList()
  loadAlertList()
})
</script>

<style scoped>
.inventory-container {
  padding: 20px;
  max-width: 100%;
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
</style>
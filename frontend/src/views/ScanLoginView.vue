<template>
  <div class="scan-login-container">
    <div class="scan-login-content">
      <h2 class="scan-login-title">扫码登录</h2>
      
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>登录中...</span>
      </div>
      
      <div v-else-if="error" class="error-message">
        <el-icon><Warning /></el-icon>
        <span>{{ error }}</span>
      </div>
      
      <div v-else-if="role === 'user'" class="role-container">
        <h3>领用人操作</h3>
        <div class="warehouse-info mb-4">
          <el-alert
            :title="`当前仓库: ${warehouseName}`"
            type="info"
            show-icon
          />
        </div>
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>提交领用申请</span>
            </div>
          </template>
          <el-form :model="consumptionForm" label-width="100px" :rules="consumptionRules" ref="consumptionFormRef">
            <el-form-item label="饮用水品类" prop="waterCategoryId">
              <el-select v-model="consumptionForm.waterCategoryId" placeholder="请选择品类">
                <el-option
                  v-for="category in waterCategories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="领用部门" prop="departmentId">
              <el-select v-model="consumptionForm.departmentId" placeholder="请选择部门">
                <el-option
                  v-for="department in departments"
                  :key="department.id"
                  :label="department.name"
                  :value="department.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="领用人" prop="receiver">
              <el-input v-model="consumptionForm.receiver" placeholder="请输入领用人姓名" />
            </el-form-item>
            <el-form-item label="领用数量" prop="quantity">
              <el-input v-model.number="consumptionForm.quantity" placeholder="请输入领用数量" type="number" min="1" />
            </el-form-item>
            <el-form-item label="归还空桶数量">
              <el-input v-model.number="consumptionForm.returnEmptyBottles" placeholder="请输入归还空桶数量" type="number" min="0" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="consumptionForm.notes"
                type="textarea"
                placeholder="请输入备注"
                :rows="3"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitConsumption" :loading="submitting">提交申请</el-button>
              <el-button @click="handleBack">返回</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      
      <div v-else-if="role === 'deliveryman'" class="role-container">
        <h3>送水员操作</h3>
        <div class="warehouse-info mb-4">
          <el-alert
            :title="`当前仓库: ${warehouseName}`"
            type="info"
            show-icon
          />
        </div>
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>提交送水记录</span>
            </div>
          </template>
          <el-form :model="deliveryForm" label-width="100px" :rules="deliveryRules" ref="deliveryFormRef">
            <el-form-item label="饮用水品类" prop="waterCategoryId">
              <el-select v-model="deliveryForm.waterCategoryId" placeholder="请选择品类">
                <el-option
                  v-for="category in waterCategories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="数量" prop="quantity">
              <el-input v-model.number="deliveryForm.quantity" placeholder="请输入数量" type="number" min="1" />
            </el-form-item>
            <el-form-item label="领取空桶数量">
              <el-input v-model.number="deliveryForm.emptyBucketQuantity" placeholder="请输入领取空桶数量" type="number" min="0" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="deliveryForm.remark"
                type="textarea"
                placeholder="请输入备注"
                :rows="3"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitDelivery" :loading="submitting">提交记录</el-button>
              <el-button @click="handleBack">返回</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      
      <div v-else class="scan-prompt">
        <el-icon class="scan-icon"><Camera /></el-icon>
        <p>请使用手机扫描二维码登录</p>
        <p class="hint">二维码包含角色和仓库信息</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loading, Warning, Camera } from '@element-plus/icons-vue'
import api from '../utils/api'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const submitting = ref(false)
const role = ref('')
const warehouseId = ref('')
const warehouseName = ref('')

// 领用表单
const consumptionForm = ref({
  waterCategoryId: '',
  departmentId: '',
  receiver: '',
  quantity: '',
  returnEmptyBottles: 0,
  consumptionDate: new Date(),
  notes: ''
})

const consumptionRules = {
  waterCategoryId: [{ required: true, message: '请选择饮用水品类', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择领用部门', trigger: 'change' }],
  receiver: [{ required: true, message: '请输入领用人', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入领用数量', trigger: 'blur' }, { type: 'number', min: 1, message: '领用数量必须大于0', trigger: 'blur' }]
}

const consumptionFormRef = ref(null)

// 送水表单
const deliveryForm = ref({
  waterCategoryId: '',
  quantity: '',
  emptyBucketQuantity: 0,
  date: new Date(),
  remark: ''
})

const deliveryRules = {
  waterCategoryId: [{ required: true, message: '请选择饮用水品类', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }, { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }]
}

const deliveryFormRef = ref(null)

// 数据列表
const waterCategories = ref([])
const departments = ref([])

// 加载数据
const loadWaterCategories = async () => {
  try {
    const data = await api.get('/consumption/category')
    waterCategories.value = data
  } catch (error) {
    console.error('获取饮用水品类失败:', error)
    ElMessage.error('获取饮用水品类失败')
  }
}

const loadDepartments = async () => {
  try {
    const data = await api.get('/consumption/department')
    departments.value = data
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  }
}

// 处理扫码登录
const handleScanLogin = async () => {
  const queryRole = route.query.role
  const queryWarehouseId = route.query.warehouseId
  const signature = route.query.signature
  
  if (!queryRole || !queryWarehouseId) {
    error.value = '二维码信息不完整'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 调用后端扫码登录接口
    const response = await fetch('/api/mini-app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: queryRole, warehouseId: queryWarehouseId, signature })
    })
    
    const data = await response.json()
    
    if (data.code === 200) {
      // 保存token和用户信息
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify({
        id: 0,
        username: queryRole === 'user' ? '领用人' : '送水员',
        name: queryRole === 'user' ? '领用人' : '送水员',
        role: queryRole,
        warehouseId: queryWarehouseId,
        warehouse: data.data.warehouse
      }))
      
      // 更新状态
      role.value = queryRole
      warehouseId.value = queryWarehouseId
      warehouseName.value = data.data.warehouse?.name || `仓库${queryWarehouseId}`
      
      // 加载数据
      await loadWaterCategories()
      await loadDepartments()
      
      ElMessage.success('登录成功')
    } else {
      error.value = data.message || '登录失败'
    }
  } catch (err) {
    error.value = err.message || '登录失败'
    console.error('扫码登录失败:', err)
  } finally {
    loading.value = false
  }
}

// 返回函数
const handleBack = () => {
  // 清空本地存储并返回登录页面
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

// 提交领用申请
const submitConsumption = async () => {
  if (!consumptionFormRef.value) return
  
  try {
    await consumptionFormRef.value.validate()
    submitting.value = true
    
    // 添加仓库ID
    const formData = {
      ...consumptionForm.value,
      warehouseId: warehouseId.value
    }
    
    console.log('提交领用申请数据:', formData)
    await api.post('/consumption', formData)
    console.log('领用申请提交成功，准备跳转到成功页面')
    
    // 跳转到成功页面
    router.push({
      path: '/success',
      query: { type: 'consumption' }
    })
    console.log('已执行路由跳转')
  } catch (err) {
    console.error('提交领用申请失败:', err)
    ElMessage.error('提交失败: ' + err.message)
  } finally {
    submitting.value = false
  }
}

// 提交送水记录
const submitDelivery = async () => {
  if (!deliveryFormRef.value) return
  
  try {
    await deliveryFormRef.value.validate()
    submitting.value = true
    
    // 添加仓库ID
    const formData = {
      ...deliveryForm.value,
      warehouseId: warehouseId.value
    }
    
    console.log('提交送水记录数据:', formData)
    await api.post('/delivery', formData)
    console.log('送水记录提交成功，准备跳转到成功页面')
    
    // 跳转到成功页面
    router.push({
      path: '/success',
      query: { type: 'delivery' }
    })
    console.log('已执行路由跳转')
  } catch (err) {
    console.error('提交送水记录失败:', err)
    ElMessage.error('提交失败: ' + err.message)
  } finally {
    submitting.value = false
  }
}

// 初始化
onMounted(() => {
  // 检查是否有扫码参数
  if (route.query.role && route.query.warehouseId) {
    handleScanLogin()
  }
})
</script>

<style scoped>
.scan-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.scan-login-content {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.scan-login-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading .el-icon {
  font-size: 48px;
  margin-bottom: 20px;
  color: #667eea;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #fee;
  color: #d32f2f;
  border-radius: 6px;
  margin-bottom: 20px;
}

.error-message .el-icon {
  margin-right: 10px;
}

.role-container {
  margin-top: 20px;
}

.role-container h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #667eea;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scan-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.scan-icon {
  font-size: 64px;
  margin-bottom: 20px;
  color: #667eea;
}

.scan-prompt p {
  margin-bottom: 10px;
  color: #666;
  text-align: center;
}

.scan-prompt .hint {
  font-size: 14px;
  color: #999;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
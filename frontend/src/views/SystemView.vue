<template>
  <div class="system-container">
    <h1>系统管理</h1>
    
    <!-- 部门管理 -->
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>部门管理</span>
          <el-button type="primary" @click="openAddDepartmentDialog">添加部门</el-button>
        </div>
      </template>
      <el-table :data="departments" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="部门名称" />
        <el-table-column prop="description" label="部门描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="openEditDepartmentDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteDepartment(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 用户管理 -->
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="openAddUserDialog">添加用户</el-button>
        </div>
      </template>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="department.name" label="所属部门" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">
              {{ getRoleName(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="openEditUserDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 仓库管理 -->
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>仓库管理</span>
          <el-button type="primary" @click="openAddWarehouseDialog">添加仓库</el-button>
        </div>
      </template>
      <el-table :data="warehouses" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="仓库名称" />
        <el-table-column prop="location" label="仓库位置" />
        <el-table-column prop="contactPerson" label="联系人" />
        <el-table-column prop="contactPhone" label="联系电话" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="openEditWarehouseDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteWarehouse(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 系统日志 -->
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>系统日志</span>
        </div>
      </template>
      <el-table :data="systemLogs" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="operation" label="操作内容" />
        <el-table-column prop="module" label="操作模块" />
        <el-table-column prop="ip" label="操作IP" />
        <el-table-column prop="createdAt" label="操作时间" />
      </el-table>
    </el-card>

    <!-- 添加/编辑部门对话框 -->
    <el-dialog
      v-model="departmentDialogVisible"
      :title="departmentDialogTitle"
      width="500px"
    >
      <el-form :model="departmentForm" label-width="100px">
        <el-form-item label="部门名称">
          <el-input v-model="departmentForm.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门描述">
          <el-input
            v-model="departmentForm.description"
            type="textarea"
            placeholder="请输入部门描述"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="departmentForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="departmentDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDepartment">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="userDialogVisible"
      :title="userDialogTitle"
      width="600px"
    >
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="userForm.departmentId" placeholder="请选择部门">
            <el-option
              v-for="dept in departments"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
            <el-option label="送水员" value="deliveryman" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="userForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加/编辑仓库对话框 -->
    <el-dialog
      v-model="warehouseDialogVisible"
      :title="warehouseDialogTitle"
      width="500px"
    >
      <el-form :model="warehouseForm" label-width="100px">
        <el-form-item label="仓库名称">
          <el-input v-model="warehouseForm.name" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="仓库位置">
          <el-input v-model="warehouseForm.location" placeholder="请输入仓库位置" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="warehouseForm.contactPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="warehouseForm.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="仓库描述">
          <el-input
            v-model="warehouseForm.description"
            type="textarea"
            placeholder="请输入仓库描述"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="warehouseDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveWarehouse">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../utils/api'

const systemLogs = ref([])
const warehouses = ref([])
const departments = ref([])
const users = ref([])

// 仓库相关
const warehouseDialogVisible = ref(false)
const warehouseDialogTitle = ref('添加仓库')
const warehouseForm = ref({
  id: '',
  name: '',
  location: '',
  contactPerson: '',
  contactPhone: '',
  description: ''
})

// 部门相关
const departmentDialogVisible = ref(false)
const departmentDialogTitle = ref('添加部门')
const departmentForm = ref({
  id: '',
  name: '',
  description: '',
  status: 1
})

// 用户相关
const userDialogVisible = ref(false)
const userDialogTitle = ref('添加用户')
const userForm = ref({
  id: '',
  username: '',
  password: '',
  name: '',
  email: '',
  phone: '',
  departmentId: '',
  role: 'user',
  status: 1
})

// 加载系统日志
const loadSystemLogs = async () => {
  try {
    const data = await api.get('/system/log')
    systemLogs.value = data
  } catch (error) {
    console.error('获取系统日志失败:', error)
    ElMessage.error('获取系统日志失败')
  }
}

// 加载仓库列表
const loadWarehouses = async () => {
  try {
    const data = await api.get('/system/warehouse')
    warehouses.value = data
  } catch (error) {
    console.error('获取仓库列表失败:', error)
    ElMessage.error('获取仓库列表失败')
  }
}

// 加载部门列表
const loadDepartments = async () => {
  try {
    const data = await api.get('/system/department')
    departments.value = data
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  }
}

// 加载用户列表
const loadUsers = async () => {
  try {
    const data = await api.get('/system/user')
    users.value = data
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  }
}

// 打开添加仓库对话框
const openAddWarehouseDialog = () => {
  warehouseDialogTitle.value = '添加仓库'
  warehouseForm.value = {
    id: '',
    name: '',
    location: '',
    contactPerson: '',
    contactPhone: '',
    description: ''
  }
  warehouseDialogVisible.value = true
}

// 打开编辑仓库对话框
const openEditWarehouseDialog = (row) => {
  warehouseDialogTitle.value = '编辑仓库'
  warehouseForm.value = { ...row }
  warehouseDialogVisible.value = true
}

// 保存仓库
const saveWarehouse = async () => {
  try {
    if (warehouseForm.value.id) {
      // 更新仓库
      await api.put(`/system/warehouse/${warehouseForm.value.id}`, warehouseForm.value)
      ElMessage.success('更新仓库成功')
    } else {
      // 添加仓库 - 移除id字段或设置为null
      const newWarehouse = { ...warehouseForm.value }
      if (!newWarehouse.id) {
        delete newWarehouse.id
      }
      await api.post('/system/warehouse', newWarehouse)
      ElMessage.success('添加仓库成功')
    }
    warehouseDialogVisible.value = false
    loadWarehouses()
    loadSystemLogs() // 重新加载系统日志，查看操作记录
  } catch (error) {
    console.error('保存仓库失败:', error)
    ElMessage.error('保存仓库失败: ' + error.message)
  }
}

// 删除仓库
const deleteWarehouse = async (id) => {
  try {
    await api.delete(`/system/warehouse/${id}`)
    ElMessage.success('删除仓库成功')
    loadWarehouses()
    loadSystemLogs() // 重新加载系统日志，查看操作记录
  } catch (error) {
    console.error('删除仓库失败:', error)
    ElMessage.error('删除仓库失败')
  }
}

// 打开添加部门对话框
const openAddDepartmentDialog = () => {
  departmentDialogTitle.value = '添加部门'
  departmentForm.value = {
    id: '',
    name: '',
    description: '',
    status: 1
  }
  departmentDialogVisible.value = true
}

// 打开编辑部门对话框
const openEditDepartmentDialog = (row) => {
  departmentDialogTitle.value = '编辑部门'
  departmentForm.value = { ...row }
  departmentDialogVisible.value = true
}

// 保存部门
const saveDepartment = async () => {
  try {
    if (departmentForm.value.id) {
      // 更新部门
      await api.put(`/system/department/${departmentForm.value.id}`, departmentForm.value)
      ElMessage.success('更新部门成功')
    } else {
      // 添加部门 - 移除id字段或设置为null
      const newDepartment = { ...departmentForm.value }
      if (!newDepartment.id) {
        delete newDepartment.id
      }
      await api.post('/system/department', newDepartment)
      ElMessage.success('添加部门成功')
    }
    departmentDialogVisible.value = false
    loadDepartments()
    loadUsers() // 重新加载用户列表，因为用户与部门关联
    loadSystemLogs() // 重新加载系统日志，查看操作记录
  } catch (error) {
    console.error('保存部门失败:', error)
    ElMessage.error('保存部门失败: ' + error.message)
  }
}

// 删除部门
const deleteDepartment = async (id) => {
  try {
    await api.delete(`/system/department/${id}`)
    ElMessage.success('删除部门成功')
    loadDepartments()
    loadUsers() // 重新加载用户列表，因为用户与部门关联
    loadSystemLogs() // 重新加载系统日志，查看操作记录
  } catch (error) {
    console.error('删除部门失败:', error)
    ElMessage.error('删除部门失败')
  }
}

// 打开添加用户对话框
const openAddUserDialog = () => {
  userDialogTitle.value = '添加用户'
  userForm.value = {
    id: '',
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    departmentId: '',
    role: 'user',
    status: 1
  }
  userDialogVisible.value = true
}

// 打开编辑用户对话框
const openEditUserDialog = (row) => {
  userDialogTitle.value = '编辑用户'
  userForm.value = { ...row }
  userDialogVisible.value = true
}

// 保存用户
const saveUser = async () => {
  try {
    if (userForm.value.id) {
      // 更新用户
      await api.put(`/system/user/${userForm.value.id}`, userForm.value)
      ElMessage.success('更新用户成功')
    } else {
      // 添加用户 - 移除id字段或设置为null
      const newUser = { ...userForm.value }
      if (!newUser.id) {
        delete newUser.id
      }
      // 处理部门ID，如果为空则设置为null
      if (!newUser.departmentId) {
        newUser.departmentId = null
      }
      await api.post('/system/user', newUser)
      ElMessage.success('添加用户成功')
    }
    userDialogVisible.value = false
    loadUsers()
    loadSystemLogs() // 重新加载系统日志，查看操作记录
  } catch (error) {
    console.error('保存用户失败:', error)
    ElMessage.error('保存用户失败: ' + error.message)
  }
}

// 删除用户
const deleteUser = async (id) => {
  try {
    await api.delete(`/system/user/${id}`)
    ElMessage.success('删除用户成功')
    loadUsers()
    loadSystemLogs() // 重新加载系统日志，查看操作记录
  } catch (error) {
    console.error('删除用户失败:', error)
    ElMessage.error('删除用户失败')
  }
}

// 获取角色类型
const getRoleType = (role) => {
  switch (role) {
    case 'admin': return 'warning'
    case 'deliveryman': return 'success'
    case 'user': default: return 'info'
  }
}

// 获取角色名称
const getRoleName = (role) => {
  switch (role) {
    case 'admin': return '管理员'
    case 'deliveryman': return '送水员'
    case 'user': default: return '普通用户'
  }
}

// 初始化数据
onMounted(() => {
  loadSystemLogs()
  loadWarehouses()
  loadDepartments()
  loadUsers()
})
</script>

<style scoped>
.system-container {
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
  width: 100%;
  text-align: right;
}
</style>
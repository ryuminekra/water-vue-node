<template>
  <div class="profile-container">
    <h1>个人中心</h1>
    
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>个人资料</span>
        </div>
      </template>
      
      <div class="profile-content">
        <!-- 头像设置 -->
        <div class="avatar-section">
          <div class="avatar-container">
            <el-avatar :size="120" :src="userInfo.avatar || defaultAvatar">
              {{ userInfo.name?.charAt(0) || '用' }}
            </el-avatar>
            <el-button type="primary" size="small" @click="handleAvatarUpload">更换头像</el-button>
            <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="uploadAvatar">
          </div>
        </div>
        
        <!-- 个人信息表单 -->
        <el-form :model="userInfo" label-width="120px" class="info-form">
          <el-form-item label="用户名">
            <el-input v-model="userInfo.username" disabled />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="userInfo.name" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="userInfo.phone" />
          </el-form-item>
          <el-form-item label="所属部门">
            <el-select v-model="userInfo.departmentId" placeholder="请选择部门">
              <el-option
                v-for="dept in departments"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-tag :type="userInfo.role === 'admin' ? 'warning' : 'info'">
              {{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </el-form-item>
          <el-form-item label="状态">
            <el-tag :type="userInfo.status === 1 ? 'success' : 'danger'">
              {{ userInfo.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateProfile">保存修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    
    <!-- 密码修改 -->
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>
      <el-form :model="passwordForm" label-width="120px" class="password-form">
        <el-form-item label="当前密码">
          <el-input v-model="passwordForm.currentPassword" type="password" placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请确认新密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePassword">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Api from '../utils/api'
import { ElMessage } from 'element-plus'

const userInfo = ref({
  id: '',
  username: '',
  name: '',
  email: '',
  phone: '',
  departmentId: '',
  role: '',
  status: 1,
  avatar: ''
})

const departments = ref([])
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const fileInput = ref(null)
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 加载用户信息
const loadUserInfo = async () => {
  try {
    // 从本地存储获取当前用户信息
    const currentUser = Api.getCurrentUser()
    if (currentUser) {
      // 如果缺少status字段，默认设置为1（启用）
      if (currentUser.status === undefined) {
        currentUser.status = 1
        // 更新本地存储
        localStorage.setItem('user', JSON.stringify(currentUser))
      }
      userInfo.value = currentUser
    } else {
      // 如果本地没有用户信息，从后端获取
      const user = await Api.get('/system/user/1') // 假设当前用户ID为1
      userInfo.value = user
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

// 加载部门列表
const loadDepartments = async () => {
  try {
    const deptList = await Api.get('/system/department')
    departments.value = deptList
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  }
}

// 处理头像上传
const handleAvatarUpload = () => {
  fileInput.value.click()
}

// 上传头像
const uploadAvatar = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    
    // 这里应该调用后端API上传头像
    // 为了演示，我们使用一个模拟的头像URL
    // 实际项目中应该调用API上传文件到服务器
    setTimeout(() => {
      userInfo.value.avatar = URL.createObjectURL(file)
      ElMessage.success('头像上传成功')
    }, 1000)
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('头像上传失败')
  }
}

// 更新个人资料
const updateProfile = async () => {
  try {
    await Api.put(`/system/user/${userInfo.value.id}`, userInfo.value)
    ElMessage.success('个人资料更新成功')
    // 更新本地存储的用户信息
    localStorage.setItem('user', JSON.stringify(userInfo.value))
  } catch (error) {
    console.error('更新个人资料失败:', error)
    ElMessage.error('更新个人资料失败')
  }
}

// 更新密码
const updatePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  
  try {
    // 这里应该调用后端API修改密码
    // 为了演示，我们使用一个模拟的成功响应
    // 实际项目中应该调用API验证当前密码并更新新密码
    setTimeout(() => {
      ElMessage.success('密码修改成功')
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }, 1000)
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error('修改密码失败')
  }
}

// 初始化数据
onMounted(() => {
  loadUserInfo()
  loadDepartments()
})
</script>

<style scoped>
.profile-container {
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

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-section {
  margin-bottom: 30px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-container .el-avatar {
  margin-bottom: 15px;
}

.info-form {
  width: 100%;
  max-width: 600px;
}

.password-form {
  width: 100%;
  max-width: 600px;
}
</style>
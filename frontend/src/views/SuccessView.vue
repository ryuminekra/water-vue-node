<template>
  <div class="success-container">
    <div class="success-content">
      <div class="success-icon">
        <el-icon :size="80"><CircleCheck /></el-icon>
      </div>
      <h2 class="success-title">{{ title }}</h2>
      <p class="success-message">{{ message }}</p>
      <div class="success-actions">
        <el-button type="primary" @click="handleBack">返回首页</el-button>
        <el-button @click="handleNewAction">再次操作</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { CircleCheck } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();

const title = ref('操作成功');
const message = ref('您的操作已成功完成');

onMounted(() => {
  // 从路由参数中获取操作类型
  const actionType = route.query.type;
  if (actionType === 'consumption') {
    title.value = '领用成功';
    message.value = '您的领用申请已成功提交，感谢您的使用！';
  } else if (actionType === 'delivery') {
    title.value = '送水成功';
    message.value = '您的送水记录已成功提交，感谢您的辛勤工作！';
  }
});

// 返回首页
const handleBack = () => {
  // 清空本地存储并返回登录页面
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

// 再次操作
const handleNewAction = () => {
  // 返回扫码登录页面，保持当前用户状态
  router.push('/scan-login');
};
</script>

<style scoped>
.success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.success-content {
  background: white;
  padding: 60px 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.success-icon {
  margin-bottom: 30px;
}

.success-icon .el-icon {
  color: #67c23a;
}

.success-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.success-message {
  font-size: 16px;
  color: #606266;
  margin-bottom: 40px;
  line-height: 1.5;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

@media (max-width: 480px) {
  .success-content {
    padding: 40px 20px;
  }
  
  .success-title {
    font-size: 24px;
  }
  
  .success-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .success-actions .el-button {
    width: 100%;
    max-width: 200px;
  }
}
</style>
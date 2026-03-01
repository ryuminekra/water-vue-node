<template>
  <div class="app-container">
    <!-- 登录页面、扫码登录页面和成功页面 -->
    <template v-if="$route.path === '/login' || $route.path === '/scan-login' || $route.path === '/success'">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
    
    <!-- 系统页面（根据角色显示不同菜单） -->
    <template v-else>
      <el-container style="height: 100vh;">
        <!-- 侧边栏 -->
        <el-aside :width="isCollapsed ? '80px' : '220px'" class="sidebar" :class="{ 'collapsed': isCollapsed }">
          <div class="logo" :class="{ 'collapsed': isCollapsed }">
            <h2 v-if="!isCollapsed">饮用水管理系统</h2>
            <h2 v-else>饮管</h2>
          </div>
          <div class="collapse-btn" @click="toggleCollapse">
            <el-icon v-if="!isCollapsed"><ArrowLeft /></el-icon>
            <el-icon v-else><ArrowRight /></el-icon>
          </div>
          <div class="nav-menu">
            <!-- 通用菜单 -->
            <router-link to="/" class="nav-item">
              <el-icon><House /></el-icon>
              <span v-if="!isCollapsed">首页</span>
            </router-link>
            
            <!-- 送水员菜单 -->
            <template v-if="currentUser?.role === 'deliveryman'">
              <router-link to="/delivery" class="nav-item">
                <el-icon><Van /></el-icon>
                <span v-if="!isCollapsed">送水管理</span>
              </router-link>
              <router-link to="/inventory" class="nav-item">
                <el-icon><Box /></el-icon>
                <span v-if="!isCollapsed">库存管理</span>
              </router-link>
            </template>
            
            <!-- 普通用户菜单 -->
            <template v-else-if="currentUser?.role === 'user'">
              <router-link to="/consumption" class="nav-item">
                <el-icon><TakeawayBox /></el-icon>
                <span v-if="!isCollapsed">领用管理</span>
              </router-link>
            </template>
            
            <!-- 管理员菜单 -->
            <template v-else-if="currentUser?.role === 'admin'">
              <router-link to="/delivery" class="nav-item">
                <el-icon><Van /></el-icon>
                <span v-if="!isCollapsed">送水管理</span>
              </router-link>
              <router-link to="/inventory" class="nav-item">
                <el-icon><Box /></el-icon>
                <span v-if="!isCollapsed">库存管理</span>
              </router-link>
              <router-link to="/consumption" class="nav-item">
                <el-icon><TakeawayBox /></el-icon>
                <span v-if="!isCollapsed">领用管理</span>
              </router-link>
              <router-link to="/billing" class="nav-item">
                <el-icon><Wallet /></el-icon>
                <span v-if="!isCollapsed">结算管理</span>
              </router-link>
              <router-link to="/statistics" class="nav-item">
                <el-icon><PieChart /></el-icon>
                <span v-if="!isCollapsed">统计分析</span>
              </router-link>
              <router-link to="/system" class="nav-item">
                <el-icon><Setting /></el-icon>
                <span v-if="!isCollapsed">系统设置</span>
              </router-link>
            </template>
          </div>
        </el-aside>
        
        <!-- 主内容区 -->
        <el-container>
          <el-header class="header">
            <div class="header-right">
              <el-dropdown>
                <span class="user">
                  <el-icon><User /></el-icon>
                  <span>{{ currentUser?.name || '管理员' }}</span>
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <router-link to="/profile" class="dropdown-link">个人中心</router-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </el-header>
          <el-main class="main">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </el-main>
        </el-container>
      </el-container>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { House, Van, Box, TakeawayBox, Wallet, PieChart, Setting, User, ArrowDown, ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import api from './utils/api';

const router = useRouter();
const currentUser = ref(null);
const isCollapsed = ref(false);

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 获取当前用户信息
const getCurrentUser = () => {
  const user = api.getCurrentUser();
  if (user) {
    currentUser.value = user;
  }
};

// 退出登录
const handleLogout = async () => {
  try {
    await api.post('/auth/logout');
    api.logout();
    router.push('/login');
  } catch (error) {
    // 即使失败也清除本地状态并跳转
    api.logout();
    router.push('/login');
  }
};

// 组件挂载时获取用户信息
onMounted(() => {
  getCurrentUser();
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  height: 100vh;
}

.sidebar {
  background-color: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  position: relative;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #002140;
  background-color: #001f3f;
  transition: all 0.3s ease;
}

.logo.collapsed {
  padding: 15px 0;
}

.logo h2 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #1890ff;
  transition: all 0.3s ease;
}

.logo.collapsed h2 {
  font-size: 14px;
}

.collapse-btn {
  position: absolute;
  top: 20px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.collapse-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.sidebar.collapsed .nav-item {
  padding: 0 15px;
  justify-content: center;
}

.sidebar.collapsed .nav-item .el-icon {
  margin-right: 0;
}

.sidebar.collapsed .nav-item span {
  display: none;
}

.nav-menu {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 56px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 4px 10px;
  border-radius: 8px;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: translateX(4px);
}

.nav-item.router-link-active {
  background-color: #1890ff;
  color: #fff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.4);
}

.nav-item .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-link {
  color: #303133;
  text-decoration: none;
  width: 100%;
  display: block;
}

.dropdown-link:hover {
  color: #1890ff;
}

.main {
  padding: 20px;
  background-color: #f5f5f5;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

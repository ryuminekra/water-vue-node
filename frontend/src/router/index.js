import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DeliveryView from '../views/DeliveryView.vue'
import InventoryView from '../views/InventoryView.vue'
import ConsumptionView from '../views/ConsumptionView.vue'
import BillingView from '../views/BillingView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import SystemView from '../views/SystemView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'

// 路由保护
const requireAuth = (to, from, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    next();
  } else {
    next('/login');
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: requireAuth
    },
    {
      path: '/delivery',
      name: 'delivery',
      component: DeliveryView,
      beforeEnter: requireAuth
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: InventoryView,
      beforeEnter: requireAuth
    },
    {
      path: '/consumption',
      name: 'consumption',
      component: ConsumptionView,
      beforeEnter: requireAuth
    },
    {
      path: '/billing',
      name: 'billing',
      component: BillingView,
      beforeEnter: requireAuth
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView,
      beforeEnter: requireAuth
    },
    {
      path: '/system',
      name: 'system',
      component: SystemView,
      beforeEnter: requireAuth
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      beforeEnter: requireAuth
    }
  ]
})

export default router